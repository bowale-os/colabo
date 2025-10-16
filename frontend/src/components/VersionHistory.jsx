import { useState } from 'react';
import { History, RotateCcw, Eye, GitBranch, User, Clock, FileText, X, CheckCircle } from 'lucide-react';

const VersionHistory = ({ noteId, currentVersion, onRestore, onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock version data - replace with API call
  const [versions] = useState([
    {
      id: 'v12',
      version: 12,
      title: 'Q4 Marketing Strategy - Final Draft',
      content: 'Complete marketing strategy with all sections finalized...',
      user: { name: 'Sarah Chen', avatar: 'S', id: 'user1' },
      timestamp: new Date(Date.now() - 3600000),
      changes: { added: 234, removed: 45 },
      isCurrent: true
    },
    {
      id: 'v11',
      version: 11,
      title: 'Q4 Marketing Strategy - Draft',
      content: 'Marketing strategy draft with most sections complete...',
      user: { name: 'Mike Johnson', avatar: 'M', id: 'user2' },
      timestamp: new Date(Date.now() - 7200000),
      changes: { added: 156, removed: 23 },
      isCurrent: false
    },
    {
      id: 'v10',
      version: 10,
      title: 'Q4 Marketing Strategy',
      content: 'Initial marketing strategy outline...',
      user: { name: 'Sarah Chen', avatar: 'S', id: 'user1' },
      timestamp: new Date(Date.now() - 14400000),
      changes: { added: 89, removed: 12 },
      isCurrent: false
    },
    {
      id: 'v9',
      version: 9,
      title: 'Q4 Marketing Strategy',
      content: 'Early draft with basic structure...',
      user: { name: 'Emma Davis', avatar: 'E', id: 'user3' },
      timestamp: new Date(Date.now() - 86400000),
      changes: { added: 445, removed: 0 },
      isCurrent: false
    }
  ]);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return timestamp.toLocaleDateString();
  };

  const handleRestore = (version) => {
    if (window.confirm(`Restore to version ${version.version}? This will create a new version.`)) {
      onRestore(version);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
        {/* Version List */}
        <div className="w-96 border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <History className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Version History</h2>
                  <p className="text-sm text-slate-600">{versions.length} versions</p>
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

          {/* Versions List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {versions.map((version, index) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedVersion?.id === version.id
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                      : 'bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs`}>
                        {version.user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Version {version.version}
                          {version.isCurrent && (
                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-600">{version.user.name}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 mb-2 line-clamp-1">{version.title}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{getTimeAgo(version.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">+{version.changes.added}</span>
                      <span className="text-red-600">-{version.changes.removed}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          {selectedVersion ? (
            <>
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Version {selectedVersion.version}
                    {selectedVersion.isCurrent && (
                      <span className="ml-2 text-sm font-normal text-green-600">(Current)</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{selectedVersion.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{getTimeAgo(selectedVersion.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!selectedVersion.isCurrent && (
                    <button
                      onClick={() => handleRestore(selectedVersion)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Restore This Version
                    </button>
                  )}
                </div>
              </div>

              {/* Changes Summary */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-slate-700">
                      <span className="font-semibold text-green-600">{selectedVersion.changes.added}</span> additions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-700">
                      <span className="font-semibold text-red-600">{selectedVersion.changes.removed}</span> deletions
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold text-slate-900 mb-6">
                    {selectedVersion.title}
                  </h1>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedVersion.content}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-slate-500 mb-1">Modified by</p>
                        <p className="text-slate-900 font-medium">{selectedVersion.user.name}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-slate-500 mb-1">Last modified</p>
                        <p className="text-slate-900 font-medium">
                          {selectedVersion.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <History size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Version</h3>
                <p className="text-slate-600">Choose a version from the list to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;