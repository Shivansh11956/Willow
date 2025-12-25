const User = require('../models/user.model.js');
const Message = require('../models/message.model.js');
const cloudinary = require('../lib/cloudinary.js');
const { getReceiverSocketId, io } = require('../lib/socket.js');
const { moderateWithGemini } = require('../services/geminiPoolService');
const { moderateWithGroq } = require('../services/groqService');
const FriendService = require('../services/friend.service.js');

// HF disabled for LLM rewrite pipeline
// const { analyzeToxicity } = require('../services/toxicityService');
// const { analyzeFallback } = require('../lib/fallbackFilter');

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // Get friends list instead of all users
    const friends = await FriendService.getFriendsList(loggedInUserId);
    
    // Get unread counts and last message for each friend
    const friendsWithMetadata = await Promise.all(
      friends.map(async (friend) => {
        const unreadCount = await Message.countDocuments({
          senderId: friend._id,
          receiverId: loggedInUserId,
          status: { $ne: 'read' }
        });
        
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: friend._id },
            { senderId: friend._id, receiverId: loggedInUserId }
          ]
        }).sort({ createdAt: -1 });
        
        return {
          ...friend.toObject(),
          unreadCount,
          lastMessageTime: lastMessage?.createdAt || friend.createdAt
        };
      })
    );
    
    // Sort by last message time (most recent first)
    friendsWithMetadata.sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
    
    res.status(200).json(friendsWithMetadata);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Check if users are friends
    const areFriends = await FriendService.areAlreadyFriends(myId, userToChatId);
    if (!areFriends) {
      return res.status(403).json({ error: "You can only chat with friends" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Mark messages as read
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, status: { $ne: 'read' } },
      { status: 'read' }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    let { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const uid = String(senderId).slice(-4);

    // Check if users are friends
    const areFriends = await FriendService.areAlreadyFriends(senderId, receiverId);
    if (!areFriends) {
      return res.status(403).json({ error: "You can only send messages to friends" });
    }

    // Production-grade moderation pipeline (TEXT ONLY)
    if (text && text.trim()) {
      const startTs = Date.now();
      const totalBudgetMs = 12000;
      
      // Stage 1: Try Gemini (max 2 attempts, 4.5s each)
      const geminiResult = await moderateWithGemini(text, {
        perAttemptTimeoutMs: 4500,
        maxAttempts: 2,
        remainingBudgetMs: totalBudgetMs - (Date.now() - startTs)
      });
      
      if (geminiResult.ok) {
        if (geminiResult.text === '<<BLOCK>>') {
          console.log(`BLOCK uid=${uid} decision=BLOCK`);
          return res.status(400).json({
            error: "This message was blocked due to inappropriate language. Kindly communicate respectfully."
          });
        }
        
        text = geminiResult.text;
        if (text !== req.body.text) {
          console.log(`REWRITE_GEMINI key=${geminiResult.keyIndex} uid=${uid} decision=REWRITE`);
        } else {
          console.log(`SAFE uid=${uid} decision=SAFE`);
        }
      } else {
        // Stage 2: Fallback to Groq (3s timeout)
        const groqResult = await moderateWithGroq(text, 3000);
        
        if (groqResult.ok) {
          if (groqResult.text === '<<BLOCK>>') {
            console.log(`BLOCK uid=${uid} decision=BLOCK`);
            return res.status(400).json({
              error: "This message was blocked due to inappropriate language. Kindly communicate respectfully."
            });
          }
          
          text = groqResult.text;
          if (text !== req.body.text) {
            console.log(`REWRITE_GROQ uid=${uid} decision=REWRITE`);
          } else {
            console.log(`SAFE uid=${uid} decision=SAFE`);
          }
        } else {
          // Stage 3: Fail-open (use original text)
          console.log(`FAIL_OPEN uid=${uid} decision=FAIL_OPEN`);
          text = req.body.text;
        }
      }
    }

    // Images bypass moderation - proceed directly
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Set status to delivered if receiver is online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      newMessage.status = 'delivered';
      await newMessage.save();
      io.to(receiverSocketId).emit("new_message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessage };
