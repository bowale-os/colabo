import { useState } from 'react';
import { Users, Crown, Shield, Eye } from 'lucide-react';

const CollaboratorBadge = ({ collaborators = [], owner, maxDisplay = 3 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const displayCollabs = collaborators.slice(0, maxDisplay);
  const remainingCount = collaborators.length - maxDisplay;

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'admin': return <Shield size={10} />;
      case 'edit': return null;
      case 'view': return <Eye size={10} />;
      default: return null;
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'admin': return 'border-purple-400 bg-purple-100';
      case 'edit': return 'border-blue-400 bg-blue-100';
      case 'view': return 'border-slate-400 bg-slate-100';
      default: return 'border-slate-400 bg-slate-100';
    }
  };

  if (collaborators.length === 0) return null;

  return (
    <div className="relative inline-flex items-center">
      {/* Collaborator Avatars */}
      <div className="flex items-center -space-x-2">
        {/* Owner Badge */}
        {owner && (
          <div 
            className="relative w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm z-10"
            title={`${owner.name} (Owner)`}
          >
            <Crown size={14} />
          </div>
        )}

        {/* Collaborators */}
        {displayCollabs.map((collab, index) => (
          <div
            key={collab.id || index}
            className={`relative w-7 h-7 rounded-full border-2 ${getPermissionColor(collab.permission)} flex items-center justify-center font-semibold text-xs shadow-sm hover:z-20 transition-transform hover:scale-110 cursor-pointer`}
            style={{ zIndex: maxDisplay - index }}
            title={`${collab.name} (${collab.permission})`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {collab.avatar || collab.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
            
            {/* Permission Icon Overlay */}
            {getPermissionIcon(collab.permission) && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-slate-200">
                {getPermissionIcon(collab.permission)}
              </div>
            )}
          </div>
        ))}

        {/* Remaining Count */}
        {remainingCount > 0 && (
          <div
            className="relative w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-sm cursor-pointer hover:bg-slate-300 transition-colors"
            title={`${remainingCount} more collaborator${remainingCount > 1 ? 's' : ''}`}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Detailed Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50">
          <div className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Users size={14} />
            Collaborators ({collaborators.length + (owner ? 1 : 0)})
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {owner && (
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                  <Crown size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{owner.name}</p>
                  <p className="text-xs text-amber-600">Owner</p>
                </div>
              </div>
            )}
            {collaborators.map((collab, index) => (
              <div key={collab.id || index} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full border ${getPermissionColor(collab.permission)} flex items-center justify-center font-semibold text-xs`}>
                  {collab.avatar || collab.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{collab.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{collab.permission}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorBadge;