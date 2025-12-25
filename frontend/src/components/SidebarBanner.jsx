import { MessageCircle, Bot, Users, Settings, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";

const SidebarBanner = ({ onChatClick, onAiClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { receivedRequests, sentRequests, fetchReceivedRequests, fetchSentRequests } = useFriendStore();
  
  useEffect(() => {
    fetchReceivedRequests();
    fetchSentRequests();
  }, [fetchReceivedRequests, fetchSentRequests]);
  
  const hasNotifications = receivedRequests.length > 0 || sentRequests.some(req => req.status === 'accepted');

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col justify-between h-full w-16 lg:w-20 laptop:w-24 bg-primary border-r border-primary-content shadow-lg">
        {/* Top buttons */}
        <div className="flex flex-col items-center pt-3 lg:pt-4 space-y-2 lg:space-y-3 laptop:space-y-4">
          <div className="tooltip tooltip-right" data-tip="Chat">
            <button
              onClick={onChatClick}
              className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
              aria-label="Chat"
            >
              <MessageCircle size={16} className="md:hidden" />
              <MessageCircle size={18} className="hidden md:block lg:hidden" />
              <MessageCircle size={20} className="hidden lg:block laptop:hidden" />
              <MessageCircle size={22} className="hidden laptop:block" />
            </button>
          </div>
          
          <div className="tooltip tooltip-right" data-tip="AI Assistant">
            <button
              onClick={onAiClick}
              className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
              aria-label="AI Assistant"
            >
              <Bot size={16} className="md:hidden" />
              <Bot size={18} className="hidden md:block lg:hidden" />
              <Bot size={20} className="hidden lg:block laptop:hidden" />
              <Bot size={22} className="hidden laptop:block" />
            </button>
          </div>
          
          <div className="tooltip tooltip-right" data-tip="Discover Friends">
            <button
              onClick={() => navigate('/discover')}
              className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg relative"
              aria-label="Discover Friends"
            >
              <Users size={16} className="md:hidden" />
              <Users size={18} className="hidden md:block lg:hidden" />
              <Users size={20} className="hidden lg:block laptop:hidden" />
              <Users size={22} className="hidden laptop:block" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex flex-col items-center pb-3 lg:pb-4 space-y-2 lg:space-y-3 laptop:space-y-4">
          <div className="tooltip tooltip-right" data-tip="Settings">
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
              aria-label="Settings"
            >
              <Settings size={16} className="md:hidden" />
              <Settings size={18} className="hidden md:block lg:hidden" />
              <Settings size={20} className="hidden lg:block laptop:hidden" />
              <Settings size={22} className="hidden laptop:block" />
            </button>
          </div>
          
          <div className="tooltip tooltip-right" data-tip="Profile">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
              aria-label="Profile"
            >
              <User size={16} className="md:hidden" />
              <User size={18} className="hidden md:block lg:hidden" />
              <User size={20} className="hidden lg:block laptop:hidden" />
              <User size={22} className="hidden laptop:block" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-circle btn-primary shadow-lg"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
        
        {/* Mobile Slide-over */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-64 bg-base-200 z-50 p-4 transform transition-transform">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => { onChatClick(); setIsOpen(false); }}
                  className="btn btn-ghost justify-start gap-3"
                >
                  <MessageCircle size={20} />
                  Chat
                </button>
                
                <button
                  onClick={() => { onAiClick(); setIsOpen(false); }}
                  className="btn btn-ghost justify-start gap-3"
                >
                  <Bot size={20} />
                  AI Assistant
                </button>
                
                <button
                  onClick={() => { navigate('/discover'); setIsOpen(false); }}
                  className="btn btn-ghost justify-start gap-3 relative"
                >
                  <Users size={20} />
                  Discover Friends
                  {hasNotifications && (
                    <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                <div className="divider" />
                
                <button
                  onClick={() => { navigate('/settings'); setIsOpen(false); }}
                  className="btn btn-ghost justify-start gap-3"
                >
                  <Settings size={20} />
                  Settings
                </button>
                
                <button
                  onClick={() => { navigate('/profile'); setIsOpen(false); }}
                  className="btn btn-ghost justify-start gap-3"
                >
                  <User size={20} />
                  Profile
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidebarBanner;