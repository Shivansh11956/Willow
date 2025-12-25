import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  aiUsers: [],
  showAiPanel: false,
  activeAi: null,
  chatMode: 'human', // 'human' or 'ai'

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      // Get friends list instead of all users
      const res = await axiosInstance.get("/friends/list");
      set({ users: res.data.friends || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load friends');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      
      // Emit mark as read via socket
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit('mark_as_read', {
          senderId: userId,
          receiverId: useAuthStore.getState().authUser._id
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    
    set({ isSendingMessage: true });
    
    try {
      // Send to backend first for moderation
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
      // Only add to UI after backend approves
      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (error.response?.status === 400) {
        // Message was blocked - show error
        toast.error(error.response.data.error);
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("new_message", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
      
      // Mark as read immediately
      socket.emit('mark_as_read', {
        senderId: selectedUser._id,
        receiverId: useAuthStore.getState().authUser._id
      });
    });
    
    socket.on('messages_read', ({ userId }) => {
      if (userId === selectedUser._id) {
        set({
          messages: get().messages.map(msg => 
            msg.senderId === useAuthStore.getState().authUser._id && msg.receiverId === userId
              ? { ...msg, status: 'read' }
              : msg
          )
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("new_message");
    socket.off("messages_read");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    // Clear unread count immediately for this user
    if (selectedUser && selectedUser._id) {
      set({
        users: get().users.map(user => 
          user._id === selectedUser._id ? { ...user, unreadCount: 0 } : user
        )
      });
    }
  },

  // AI functionality
  openAiPanel: () => {
    const aiUsers = [
      { id: 'gemini', name: 'Gemini', fullName: 'Gemini', type: 'ai', isOnline: true },
      { id: 'grok', name: 'Grok', fullName: 'Grok', type: 'ai', isOnline: true }
    ];
    set({ aiUsers, showAiPanel: true, chatMode: 'ai', selectedUser: null, activeAi: null, messages: [] });
  },

  openHumanChat: () => {
    set({ 
      showAiPanel: false, 
      chatMode: 'human', 
      selectedUser: null, 
      activeAi: null, 
      messages: [],
      aiUsers: []
    });
  },

  setActiveAi: (aiId) => {
    const aiUser = get().aiUsers.find(ai => ai.id === aiId);
    if (aiUser) {
      set({ selectedUser: aiUser, activeAi: aiId, messages: [] });
    }
  },

  sendAiMessage: async (message) => {
    const { activeAi, messages } = get();
    if (!activeAi) return;

    try {
      // Add user message immediately
      const userMessage = {
        _id: Date.now().toString(),
        text: message,
        senderId: useAuthStore.getState().authUser._id,
        createdAt: new Date().toISOString()
      };
      set({ messages: [...messages, userMessage] });

      // Call AI API
      const res = await axiosInstance.post('/ai/chat', {
        model: activeAi,
        message: message
      });

      // Add AI response
      const aiMessage = {
        _id: (Date.now() + 1).toString(),
        text: res.data.reply,
        senderId: activeAi,
        createdAt: new Date().toISOString()
      };
      set({ messages: [...get().messages, aiMessage] });
    } catch (error) {
      toast.error('AI service unavailable. Please try again.');
    }
  },
}));
