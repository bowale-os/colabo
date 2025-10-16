import { useState } from 'react';
import { Activity, User, Edit3, Trash2, Star, Share2, UserPlus, Clock, Filter } from 'lucide-react';

const ActivityFeed = ({ noteId, compact = false }) => {
  const [filter, setFilter] = useState('all');
  
  // Mock activity data - replace with API call
  const [activities] = useState([
    {
      id: 1,
      type: 'edit',
      user: { name: 'Sarah Chen', avatar: 'S' },
      action: 'edited the note',
      timestamp: new Date(Date.now() - 300000),
      details: 'Changed title and added 3 paragraphs'
    },
    {
      id: 2,
      type: 'share',
      user: { name: 'Mike Johnson', avatar: 'M' },
      action: 'shared with',
      target: 'Emma Davis',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 3,
      type: 'favorite',
      user: { name: 'Emma Davis', avatar: 'E' },
      action: 'added to favorites',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      type: 'invite',
      user: { name: 'David Park', avatar: 'D' },
      action: 'invited',
      target: 'john@example.com',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 5,
      type: 'edit',
      user: { name: 'Sarah Chen', avatar: 'S' },
      action: 'updated content',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Modified introduction section'
    },
    {
      id: 6,
      type: 'create',
      user: { name: 'Sarah Chen', avatar: 'S' },
      action: 'created the note',
      timestamp: new Date(Date.now() - 86400000)
    }
  ]);

  const getActivityIcon = (type) => {
    const icons = {
      edit: { icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-100' },
      share: { icon: Share2, color: 'text-green-600', bg: 'bg-green-100' },
      favorite: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
      invite: { icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-100' },
      delete: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-100' },
      create: { icon: User, color: 'text-slate-600', bg: 'bg-slate-100' }
    };
    return icons[type] || icons.edit;
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  if (compact) {
    return (
      <div className="space-y-2">
        {filteredActivities.slice(0, 5).map(activity => {
          const iconConfig = getActivityIcon(activity.type);
          const Icon = iconConfig.icon;
          
          return (
            <div key={activity.id} className="flex items-center gap-2 text-sm">
              <div className={`w-6 h-6 rounded-full ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={12} className={iconConfig.color} />
              </div>
              <p className="text-slate-700 truncate flex-1">
                <span className="font-medium">{activity.user.name}</span>
                {' '}{activity.action}
                {activity.target && <span className="font-medium"> {activity.target}</span>}
              </p>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {getTimeAgo(activity.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activity Log</h3>
              <p className="text-sm text-slate-600">{filteredActivities.length} recent activities</p>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'edit'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              Edits
            </button>
            <button
              onClick={() => setFilter('share')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'share'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              Shares
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="max-h-96 overflow-y-auto p-6">
        {filteredActivities.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
            
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => {
                const iconConfig = getActivityIcon(activity.type);
                const Icon = iconConfig.icon;
                
                return (
                  <div key={activity.id} className="relative pl-12">
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-10 h-10 rounded-full ${iconConfig.bg} border-4 border-white flex items-center justify-center shadow-sm`}>
                      <Icon size={18} className={iconConfig.color} />
                    </div>

                    {/* Activity Content */}
                    <div className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {activity.user.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-slate-900">
                              <span className="font-semibold">{activity.user.name}</span>
                              {' '}<span className="text-slate-600">{activity.action}</span>
                              {activity.target && (
                                <span className="font-semibold text-slate-900"> {activity.target}</span>
                              )}
                            </p>
                            {activity.details && (
                              <p className="text-xs text-slate-500 mt-0.5">{activity.details}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                          <Clock size={12} />
                          <span>{getTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Activity size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No activities yet</p>
            <p className="text-sm text-slate-500 mt-1">Activity will appear here as you collaborate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;