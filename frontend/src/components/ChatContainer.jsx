import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import Avatar from "./Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    activeAi,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?.type !== 'ai') {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && activeAi && (
          <div className="flex h-full items-center justify-center text-sm opacity-60">
            Start a conversation with the AI assistant
          </div>
        )}
        
        {Array.isArray(messages) && messages.map((message) => {
          const isUserMessage = message.senderId === authUser._id || message.senderId === 'user';
          return (
          <div
            key={message._id}
            className={`chat ${isUserMessage ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              {isUserMessage ? (
                <Avatar user={authUser} size="sm" />
              ) : (
                <Avatar user={selectedUser} size="sm" />
              )}
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              
              {/* Message status ticks */}
              {isUserMessage && message.status && (
                <div className="flex justify-end mt-1">
                  {message.status === 'sent' && (
                    <Check className="w-4 h-4 text-gray-400" />
                  )}
                  {message.status === 'delivered' && (
                    <CheckCheck className="w-4 h-4 text-gray-400" />
                  )}
                  {message.status === 'read' && (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
