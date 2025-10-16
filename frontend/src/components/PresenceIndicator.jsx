import { useState } from 'react';
import { Users, Eye, Edit3, MousePointer, Clock } from 'lucide-react';

const PresenceIndicator = ({ activeUsers = [], currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getUserActivity = (user) => {
    if (user.isTyping) return { icon: Edit3, text: 'Typing...', color: 'text-green-600' };
    if (user.isViewing) return { icon: Eye, text: 'Viewing', color: 'text-blue-600' };
    if (user.lastActivity) {
      const secondsAgo = Math.floor((Date.now() - new Date(user.lastActivity)) / 1000);
      if (secondsAgo < 60) return { icon: MousePointer, text: 'Active', color: 'text-green-600' };
      if (secondsAgo < 300) return { icon: Clock, text: `${Math.floor(secondsAgo / 60)}m ago`, color: 'text-slate-500' };
    }
    return { icon: MousePointer, text: 'Idle', color: 'text-slate-400' };
  };

  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-teal-500 to-teal-600',
  ];

  const getColorForUser = (userId) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (activeUsers.length === 0) return null;

  return (
    <div className="relative inline-block">
      {/* Compact view - Avatar stack */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all"
      >
        <div className="flex items-center -space-x-2">
          {activeUsers.slice(0, 3).map((user, index) => (
            <div
              key={user.userId}
              className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${getColorForUser(user.userId)} border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-sm hover:z-10 transition-transform hover:scale-110`}
              style={{ zIndex: 3 - index }}
              title={user.userName}
            >
              {user.userName?.charAt(0)?.toUpperCase()}
              {user.isTyping && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
          {activeUsers.length > 3 && (
            <div className="relative w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-700 font-bold text-xs shadow-sm">
              +{activeUsers.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{activeUsers.length}</span>
        </div>
      </button>

      {/* Detailed popup */}
      {showDetails && (
        <>
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-900">Active Now</h3>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {activeUsers.length} online
                </span>
              </div>
            </div>

            {/* User list */}
            <div className="max-h-80 overflow-y-auto">
              {activeUsers.map((user) => {
                const activity = getUserActivity(user);
                const ActivityIcon = activity.icon;
                const isCurrentUser = user.userId === currentUser?.id;

                return (
                  <div
                    key={user.userId}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                      isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColorForUser(user.userId)} flex items-center justify-center text-white font-bold shadow-sm`}>
                        {user.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      {/* Status indicator */}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.isTyping ? 'bg-green-500 animate-pulse' : 
                        activity.color.includes('green') ? 'bg-green-500' :
                        'bg-slate-400'
                      }`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user.userName}
                          {isCurrentUser && <span className="text-xs text-slate-500"> (You)</span>}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs ${activity.color}`}>
                        <ActivityIcon size={12} />
                        <span>{activity.text}</span>
                      </div>
                      {user.currentSection && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          At: {user.currentSection}
                        </p>
                      )}
                    </div>

                    {/* Permission badge */}
                    {user.permission && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        user.permission === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.permission === 'edit' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.permission}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-center">
              <p className="text-xs text-slate-500">
                Real-time collaboration active
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PresenceIndicator;