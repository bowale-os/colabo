import { useState } from 'react';
import { Shield, Eye, Edit3, Crown, Lock, Unlock, Settings, Save, X, AlertCircle } from 'lucide-react';

const PermissionManager = ({ note, collaborators, onUpdatePermissions, onClose }) => {
  const [permissions, setPermissions] = useState(
    collaborators.reduce((acc, collab) => ({
      ...acc,
      [collab.userId]: {
        level: collab.permission,
        canComment: collab.canComment !== false,
        canShare: collab.canShare || false,
        canViewHistory: collab.canViewHistory !== false,
        canDownload: collab.canDownload !== false
      }
    }), {})
  );

  const [globalSettings, setGlobalSettings] = useState({
    allowComments: note.allowComments !== false,
    allowDownload: note.allowDownload !== false,
    requireApproval: note.requireApproval || false,
    linkSharing: note.linkSharing || 'disabled'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const permissionLevels = [
    {
      value: 'view',
      label: 'Viewer',
      icon: Eye,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      description: 'Can only read the note'
    },
    {
      value: 'comment',
      label: 'Commenter',
      icon: Edit3,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Can read and add comments'
    },
    {
      value: 'edit',
      label: 'Editor',
      icon: Edit3,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Can read, comment, and edit'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Full control including permissions'
    }
  ];

  const handlePermissionChange = (userId, field, value) => {
    setPermissions({
      ...permissions,
      [userId]: {
        ...permissions[userId],
        [field]: value
      }
    });
    setHasChanges(true);
  };

  const handleGlobalSettingChange = (field, value) => {
    setGlobalSettings({
      ...globalSettings,
      [field]: value
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdatePermissions({ permissions, globalSettings });
  };

  const getPermissionConfig = (level) => {
    return permissionLevels.find(p => p.value === level) || permissionLevels[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Permissions</h2>
                <p className="text-sm text-slate-600">Control who can access and edit this note</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Global Settings */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">Global Settings</h3>
            </div>

            <div className="space-y-4">
              {/* Link Sharing */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {globalSettings.linkSharing === 'disabled' ? (
                      <Lock size={16} className="text-slate-600" />
                    ) : (
                      <Unlock size={16} className="text-green-600" />
                    )}
                    <span className="font-semibold text-slate-900">Link Sharing</span>
                  </div>
                  <select
                    value={globalSettings.linkSharing}
                    onChange={(e) => handleGlobalSettingChange('linkSharing', e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="view">Anyone with link can view</option>
                    <option value="comment">Anyone with link can comment</option>
                    <option value="edit">Anyone with link can edit</option>
                  </select>
                </div>
                <p className="text-xs text-slate-600">
                  {globalSettings.linkSharing === 'disabled' 
                    ? 'Only invited collaborators can access this note'
                    : 'Anyone with the link can access this note'}
                </p>
              </div>

              {/* Toggle Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Allow Comments</p>
                    <p className="text-xs text-slate-600">Users can add comments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalSettings.allowComments}
                    onChange={(e) => handleGlobalSettingChange('allowComments', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Allow Download</p>
                    <p className="text-xs text-slate-600">Users can download note</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalSettings.allowDownload}
                    onChange={(e) => handleGlobalSettingChange('allowDownload', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Require Approval</p>
                    <p className="text-xs text-slate-600">Approve edits before saving</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalSettings.requireApproval}
                    onChange={(e) => handleGlobalSettingChange('requireApproval', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Individual Permissions */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown size={18} className="text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">Collaborator Permissions</h3>
              <span className="text-sm text-slate-500">({collaborators.length})</span>
            </div>

            <div className="space-y-3">
              {collaborators.map((collab) => {
                const config = getPermissionConfig(permissions[collab.userId]?.level);
                const Icon = config.icon;

                return (
                  <div
                    key={collab.userId}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    {/* User Info & Permission Level */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                          {collab.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{collab.name}</p>
                          <p className="text-xs text-slate-500">{collab.email}</p>
                        </div>
                      </div>

                      <select
                        value={permissions[collab.userId]?.level}
                        onChange={(e) => handlePermissionChange(collab.userId, 'level', e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {permissionLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Permission Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} mb-3`}>
                      <Icon size={14} className={config.color} />
                      <span className={`text-xs font-medium ${config.color}`}>
                        {config.description}
                      </span>
                    </div>

                    {/* Granular Permissions */}
                    {permissions[collab.userId]?.level !== 'view' && (
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[collab.userId]?.canComment}
                            onChange={(e) => handlePermissionChange(collab.userId, 'canComment', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          Can comment
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[collab.userId]?.canShare}
                            onChange={(e) => handlePermissionChange(collab.userId, 'canShare', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          Can share
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[collab.userId]?.canViewHistory}
                            onChange={(e) => handlePermissionChange(collab.userId, 'canViewHistory', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          View history
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[collab.userId]?.canDownload}
                            onChange={(e) => handlePermissionChange(collab.userId, 'canDownload', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          Can download
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {collaborators.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <Shield size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium mb-1">No collaborators yet</p>
                <p className="text-sm text-slate-500">Add collaborators to manage their permissions</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertCircle size={16} />
              <span>You have unsaved changes</span>
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;