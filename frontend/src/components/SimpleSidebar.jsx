import { MessageCircle, Bot, Users, Settings, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";

const SimpleSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openHumanChat, openAiPanel } = useChatStore();

  const isActive = (path) => location.pathname === path;

  const handleChatClick = () => {
    openHumanChat();
    navigate('/');
  };

  const handleAiClick = () => {
    openAiPanel();
    navigate('/');
  };

  return (
    <div className="flex flex-col justify-between h-full w-16 sm:w-20 laptop:w-24 bg-primary border-r border-primary-content shadow-lg">
      {/* Top buttons */}
      <div className="flex flex-col items-center pt-3 lg:pt-4 space-y-2 lg:space-y-3 laptop:space-y-4">
        <button
          onClick={handleChatClick}
          className={`btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg ${
            isActive('/') ? 'bg-primary-focus' : ''
          }`}
          aria-label="Chat"
        >
          <MessageCircle size={16} className="sm:hidden" />
          <MessageCircle size={18} className="hidden sm:block lg:hidden" />
          <MessageCircle size={20} className="hidden lg:block laptop:hidden" />
          <MessageCircle size={22} className="hidden laptop:block" />
        </button>
        
        <button
          onClick={handleAiClick}
          className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
          aria-label="AI Assistant"
        >
          <Bot size={16} className="sm:hidden" />
          <Bot size={18} className="hidden sm:block lg:hidden" />
          <Bot size={20} className="hidden lg:block laptop:hidden" />
          <Bot size={22} className="hidden laptop:block" />
        </button>
        
        <button
          onClick={() => navigate('/discover')}
          className="btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg"
          aria-label="Discover Friends"
        >
          <Users size={16} className="sm:hidden" />
          <Users size={18} className="hidden sm:block lg:hidden" />
          <Users size={20} className="hidden lg:block laptop:hidden" />
          <Users size={22} className="hidden laptop:block" />
        </button>
      </div>

      {/* Bottom buttons */}
      <div className="flex flex-col items-center pb-3 lg:pb-4 space-y-2 lg:space-y-3 laptop:space-y-4">
        <button
          onClick={() => navigate('/settings')}
          className={`btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg ${
            isActive('/settings') ? 'bg-primary-focus' : ''
          }`}
          aria-label="Settings"
        >
          <Settings size={16} className="sm:hidden" />
          <Settings size={18} className="hidden sm:block lg:hidden" />
          <Settings size={20} className="hidden lg:block laptop:hidden" />
          <Settings size={22} className="hidden laptop:block" />
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`btn btn-ghost btn-circle hover:bg-primary-focus text-primary-content btn-sm lg:btn-md laptop:btn-lg ${
            isActive('/profile') ? 'bg-primary-focus' : ''
          }`}
          aria-label="Profile"
        >
          <User size={16} className="sm:hidden" />
          <User size={18} className="hidden sm:block lg:hidden" />
          <User size={20} className="hidden lg:block laptop:hidden" />
          <User size={22} className="hidden laptop:block" />
        </button>
      </div>
    </div>
  );
};

export default SimpleSidebar;