const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const { analyzeToxicity } = require('../services/toxicityService');
const { rephraseMessage } = require('../services/rephraseService');
const fallbackFilter = require('./fallbackFilter');
const ModerationLog = require('../models/moderationLog.model');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? true 
      : ["http://localhost:5173"],
  },
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// AI Moderation function
const moderateMessage = async (messageData) => {
  const { text, senderId, receiverId } = messageData;
  
  if (!text || text.trim().length === 0) {
    return { allowed: true, originalMessage: messageData };
  }

  try {
    // Try AI toxicity detection first
    const toxicityResult = await analyzeToxicity(text);
    let moderationMethod = 'ai';
    let isToxic = false;
    let suggestion = text;
    let reason = 'Message approved';
    let toxicityScore = 0;

    if (toxicityResult.ok && toxicityResult.score > 0.5) {
      // Message is toxic, get AI rephrase
      const rephraseResult = await rephraseMessage(text);
      
      if (rephraseResult.ok) {
        isToxic = true;
        suggestion = rephraseResult.politeVersion;
        reason = rephraseResult.reason;
        toxicityScore = toxicityResult.score;
      } else {
        // AI rephrase failed, use fallback
        const fallback = fallbackFilter.getFallbackSuggestion(text);
        isToxic = fallback.isToxic;
        suggestion = fallback.suggestion;
        reason = fallback.reason;
        moderationMethod = 'fallback';
      }
    } else if (!toxicityResult.ok) {
      // AI detection failed, use fallback
      const fallback = fallbackFilter.getFallbackSuggestion(text);
      isToxic = fallback.isToxic;
      suggestion = fallback.suggestion;
      reason = fallback.reason;
      moderationMethod = 'fallback';
    }

    // Log moderation event
    await ModerationLog.create({
      senderId,
      receiverId,
      originalMessage: text,
      toxicityScore,
      action: isToxic ? 'blocked' : 'allowed',
      suggestedMessage: suggestion,
      reason,
      moderationMethod
    });

    return {
      allowed: !isToxic,
      originalMessage: messageData,
      suggestion,
      reason,
      toxicityScore
    };

  } catch (error) {
    console.error('Moderation error:', error);
    // On error, use fallback
    const fallback = fallbackFilter.getFallbackSuggestion(text);
    
    await ModerationLog.create({
      senderId,
      receiverId,
      originalMessage: text,
      action: fallback.isToxic ? 'blocked' : 'allowed',
      suggestedMessage: fallback.suggestion,
      reason: 'Moderation service error - used fallback',
      moderationMethod: 'fallback'
    });

    return {
      allowed: !fallback.isToxic,
      originalMessage: messageData,
      suggestion: fallback.suggestion,
      reason: fallback.reason
    };
  }
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // Join user to their personal room
    socket.join(userId);
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle real-time message sending with moderation
  socket.on('send_message', async (messageData) => {
    console.log('Socket send_message received:', messageData.text);
    try {
      // Run AI moderation BEFORE any broadcast
      const toxicityResult = await analyzeToxicity(messageData.text);
      console.log('Socket AI result:', toxicityResult);
      
      if (toxicityResult.ok && toxicityResult.score >= 0.5) {
        // Message is toxic - get suggestion and block
        let suggestion = messageData.text;
        let reason = 'Message contains inappropriate content';
        
        try {
          const rephraseResult = await rephraseMessage(messageData.text);
          if (rephraseResult.ok) {
            suggestion = rephraseResult.politeVersion;
            reason = rephraseResult.reason;
          }
        } catch (e) {
          const fallback = fallbackFilter.getFallbackSuggestion(messageData.text);
          suggestion = fallback.suggestion;
          reason = fallback.reason;
        }
        
        // Send blocked message ONLY to sender
        socket.emit('message_blocked', {
          original: messageData.text,
          suggestion: suggestion,
          reason: reason,
          source: 'ai'
        });
        return; // Stop here - do NOT broadcast
      }
      
      // Always check fallback filter regardless of AI result
      const fallback = fallbackFilter.analyzeFallback(messageData.text);
      if (fallback.isToxic) {
        socket.emit('message_blocked', {
          original: messageData.text,
          suggestion: fallback.sanitized,
          reason: fallback.reasons.join(', '),
          source: !toxicityResult.ok ? 'fallback' : 'fallback_secondary'
        });
        return; // Stop here - do NOT broadcast
      }
      
      // Message is safe - broadcast to receiver directly
      const receiverSocketId = getReceiverSocketId(messageData.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', messageData);
      }
      
    } catch (error) {
      console.error('Socket message handling error:', error);
      socket.emit('message_error', { error: 'Failed to process message' });
    }
  });

  // Handle sending AI-suggested polite messages
  socket.on('send_suggested_message', (messageData) => {
    // Directly broadcast suggested message without moderation
    const receiverSocketId = getReceiverSocketId(messageData.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_message', messageData);
    }
  });

  // Handle message read status
  socket.on('mark_as_read', async ({ senderId, receiverId }) => {
    try {
      const Message = require('../models/message.model');
      await Message.updateMany(
        { senderId, receiverId, status: { $ne: 'read' } },
        { status: 'read' }
      );
      
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_read', { userId: receiverId });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, getReceiverSocketId };