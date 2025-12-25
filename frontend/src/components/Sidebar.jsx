import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import SidebarBanner from "./SidebarBanner";
import Avatar from "./Avatar";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../lib/translations";

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading,
    aiUsers,
    showAiPanel,
    openAiPanel,
    openHumanChat,
    setActiveAi,
    chatMode
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? (Array.isArray(users) ? users : []).filter((user) => 
        Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
      )
    : (Array.isArray(users) ? users : []);

  // Count online friends only (not all online users)
  const onlineFriendsCount = (Array.isArray(users) ? users : []).filter((user) => 
    Array.isArray(onlineUsers) && onlineUsers.includes(user._id)
  ).length;

  // Combine regular users with AI users when AI panel is open
  const allUsers = chatMode === 'ai' ? aiUsers : filteredUsers;

  const handleAiClick = () => {
    openAiPanel();
  };

  const handleChatClick = () => {
    openHumanChat();
  };

  const handleUserClick = (user) => {
    if (user.type === 'ai') {
      setActiveAi(user.id);
      setSelectedUser(user);
    } else {
      setSelectedUser(user);
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="flex h-full">
      {/* Sidebar Banner */}
      <SidebarBanner
        onChatClick={handleChatClick}
        onAiClick={handleAiClick}
      />
      
      {/* Main Sidebar */}
      <aside className="h-full w-20 sm:w-24 md:w-28 lg:w-80 xl:w-96 laptop:w-[400px] border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-3 sm:p-4 lg:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-5 sm:size-6" />
          <span className="font-medium hidden lg:block text-sm laptop:text-base">{t('contacts')}</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-2 sm:mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-xs laptop:text-sm">{t('showOnlineOnly')}</span>
          </label>
          <span className="text-[10px] laptop:text-xs text-zinc-500">
            ({chatMode === 'ai' ? '2 online' : `${onlineFriendsCount} ${t('online').toLowerCase()}`})
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 sm:py-3">
        {allUsers.map((user) => (
          <button
            key={user._id || user.id}
            onClick={() => handleUserClick(user)}
            className={`
              w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3
              hover:bg-base-300 transition-colors
              ${(selectedUser?._id === user._id || selectedUser?.id === user.id) ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <Avatar user={user} size="md" />
              {(user.isOnline || (Array.isArray(onlineUsers) && onlineUsers.includes(user._id))) && (
                <span
                  className="absolute bottom-0 right-0 size-2.5 sm:size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate text-sm xl:text-base laptop:text-base">{user.fullName || user.name}</div>
              <div className="text-xs xl:text-sm laptop:text-sm text-zinc-400">
                {user.type === 'ai' ? t('online') : 
                 (Array.isArray(onlineUsers) && onlineUsers.includes(user._id)) ? t('online') : t('offline')}
              </div>
            </div>
            
            {/* Unread count badge */}
            {user.unreadCount > 0 && (
              <div className="bg-green-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {user.unreadCount > 99 ? '99+' : user.unreadCount}
              </div>
            )}
          </button>
        ))}

        {allUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm">
            {showOnlineOnly ? t('noOnlineFriends') : t('noFriends')}
          </div>
        )}
      </div>
    </aside>
    </div>
  );
};
export default Sidebar;
