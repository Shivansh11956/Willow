import UserAvatar from "./UserAvatar";

const Avatar = ({ user, size = "md", className = "", isInChat = false }) => {
  const sizeMap = { sm: 40, md: 48, lg: 56 };
  const pixelSize = sizeMap[size];

  // AI users
  if (user.type === 'ai') {
    if (user.id === 'gemini' && isInChat) {
      return (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ${className}`}>
          <img
            src="/gemini-logo.svg"
            alt="Gemini"
            className="w-6 h-6 object-contain translate-x-[1px]"
          />
        </div>
      );
    }
    
    const logoSrc = isInChat 
      ? (user.id === 'gemini' ? '/gemini-chat.svg' : '/grok-chat.svg')
      : (user.id === 'gemini' ? '/gemini-logo.svg' : '/grok-logo.svg');
      
    return (
      <div className={`bg-white rounded-full flex items-center justify-center border-2 border-gray-200 ${className}`} 
           style={{ width: pixelSize, height: pixelSize }}>
        <img 
          src={logoSrc}
          alt={user.name || user.fullName} 
          className="object-contain"
          style={{ width: pixelSize * 0.7, height: pixelSize * 0.7 }}
        />
      </div>
    );
  }

  // Regular users with profile pic
  if (user.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt={user.name || user.fullName}
        className={`object-cover rounded-full ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      />
    );
  }

  // Fallback: SVG avatar with initials
  return (
    <UserAvatar 
      name={user.name || user.fullName || "Unknown"} 
      size={pixelSize} 
      className={className} 
    />
  );
};

export default Avatar;