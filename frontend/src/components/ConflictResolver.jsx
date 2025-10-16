import { useState } from 'react';
import { AlertTriangle, Users, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const ConflictResolver = ({ conflicts, onResolve, onCancel }) => {
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [resolutions, setResolutions] = useState({});

  const currentConflict = conflicts[currentConflictIndex];
  const isLastConflict = currentConflictIndex === conflicts.length - 1;
  const allResolved = Object.keys(resolutions).length === conflicts.length;

  const handleSelectVersion = (conflictId, version) => {
    setResolutions({
      ...resolutions,
      [conflictId]: version
    });
  };

  const handleNext = () => {
    if (!isLastConflict) {
      setCurrentConflictIndex(currentConflictIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentConflictIndex > 0) {
      setCurrentConflictIndex(currentConflictIndex - 1);
    }
  };

  const handleResolveAll = () => {
    if (allResolved) {
      onResolve(resolutions);
    }
  };

  const getDiffHighlight = (text1, text2) => {
    // Simple word-level diff (in production, use a proper diff library)
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    return { words1, words2 };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Resolve Conflicts</h2>
                <p className="text-sm text-slate-600">
                  {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected • 
                  {Object.keys(resolutions).length} resolved
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-slate-700">
              Conflict {currentConflictIndex + 1} of {conflicts.length}
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentConflictIndex + 1) / conflicts.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex gap-1">
            {conflicts.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  resolutions[conflicts[index].id]
                    ? 'bg-green-500'
                    : index === currentConflictIndex
                    ? 'bg-blue-500'
                    : 'bg-slate-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Conflict Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentConflict && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Conflict Location */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <AlertTriangle size={16} />
                  <span className="font-semibold">Conflict Location</span>
                </div>
                <p className="text-sm text-amber-900">
                  Line {currentConflict.lineNumber} • Section: "{currentConflict.section}"
                </p>
              </div>

              {/* Conflict Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">What happened?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentConflict.description || 
                    `${currentConflict.user1.name} and ${currentConflict.user2.name} both modified this section. Choose which version to keep.`}
                </p>
              </div>

              {/* Version Options */}
              <div className="space-y-4">
                {/* Version 1 */}
                <div
                  onClick={() => handleSelectVersion(currentConflict.id, 'version1')}
                  className={`cursor-pointer border-2 rounded-xl p-5 transition-all ${
                    resolutions[currentConflict.id] === 'version1'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {currentConflict.user1.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {currentConflict.user1.name}'s version
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(currentConflict.timestamp1).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {resolutions[currentConflict.id] === 'version1' && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {currentConflict.version1}
                    </pre>
                  </div>
                  {currentConflict.changes1 && (
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-green-600">+{currentConflict.changes1.added} words</span>
                      <span className="text-red-600">-{currentConflict.changes1.removed} words</span>
                    </div>
                  )}
                </div>

                {/* Version 2 */}
                <div
                  onClick={() => handleSelectVersion(currentConflict.id, 'version2')}
                  className={`cursor-pointer border-2 rounded-xl p-5 transition-all ${
                    resolutions[currentConflict.id] === 'version2'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold">
                        {currentConflict.user2.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {currentConflict.user2.name}'s version
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(currentConflict.timestamp2).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {resolutions[currentConflict.id] === 'version2' && (
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {currentConflict.version2}
                    </pre>
                  </div>
                  {currentConflict.changes2 && (
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-green-600">+{currentConflict.changes2.added} words</span>
                      <span className="text-red-600">-{currentConflict.changes2.removed} words</span>
                    </div>
                  )}
                </div>

                {/* Keep Both Option */}
                <div
                  onClick={() => handleSelectVersion(currentConflict.id, 'both')}
                  className={`cursor-pointer border-2 rounded-xl p-5 transition-all ${
                    resolutions[currentConflict.id] === 'both'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Keep both versions</p>
                        <p className="text-xs text-slate-500">Merge both changes together</p>
                      </div>
                    </div>
                    {resolutions[currentConflict.id] === 'both' && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {currentConflict.version1}
                      {'\n\n'}
                      {currentConflict.version2}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentConflictIndex === 0}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-all"
            >
              Cancel
            </button>

            {isLastConflict && allResolved ? (
              <button
                onClick={handleResolveAll}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-green-500/30 hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Check size={16} />
                Resolve All Conflicts
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!resolutions[currentConflict.id]}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock conflict data for demonstration
ConflictResolver.defaultProps = {
  conflicts: [
    {
      id: 'conflict1',
      lineNumber: 45,
      section: 'Marketing Objectives',
      description: 'Both users edited the marketing objectives section simultaneously.',
      user1: { name: 'Sarah Chen', avatar: 'S' },
      user2: { name: 'Mike Johnson', avatar: 'M' },
      version1: 'Our primary objective is to increase brand awareness by 40% through targeted social media campaigns and influencer partnerships.',
      version2: 'Our main goal is to boost brand recognition by 50% using comprehensive digital marketing strategies including social media, content marketing, and paid advertising.',
      timestamp1: new Date(Date.now() - 300000),
      timestamp2: new Date(Date.now() - 180000),
      changes1: { added: 12, removed: 0 },
      changes2: { added: 18, removed: 0 }
    }
  ]
};

export default ConflictResolver;