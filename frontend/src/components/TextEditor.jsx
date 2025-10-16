import React, { useState, useRef, useEffect } from "react";
import { X, Bold, Italic, List, Quote, Code, Eye, EyeOff, Clock, CheckCircle2, AlertCircle, Type, Users, Share2, Activity, UserPlus, Lock } from "lucide-react";
import TimeAgo from "react-timeago";
import CollaboratorBadge from './CollaboratorBadge';
import ActivityFeed from './ActivityFeed';
import ShareModal from './ShareModal';

export default function CollaborativeTextEditor({
  note,
  setNote,
  onSave,
  onAutoSave,
  onCancel,
  isSaving = false,
  saveError = null,
  mode,
  currentUser,
  onShareClick
}) {
  // ----------- UI State and Refs -----------
  const [isPreview, setIsPreview] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const [selectedFont, setSelectedFont] = useState('sans');
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Collaboration states
  const [activeCollaborators, setActiveCollaborators] = useState([]);
  const [userPermission, setUserPermission] = useState('edit');
  const [conflictWarning, setConflictWarning] = useState(null);
  const [otherUsersEditing, setOtherUsersEditing] = useState([]);

  const textareaRef = useRef(null);
  const fontPickerRef = useRef(null);
  const intervalRef = useRef(null);
  const wsRef = useRef(null);

  // ----------- Character and Word Count -----------
  const TITLE_LIMIT = 100;
  const CONTENT_LIMIT = 50000;
  const wordCount = (note.content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (note.content || "").length;
  const contentProgress = (charCount / CONTENT_LIMIT) * 100;
  const isNearLimit = contentProgress > 80;
  const isAtLimit = contentProgress > 95;

  // Check if user can edit
  const isOwner = note.owner?._id === currentUser?._id || note.owner === currentUser?._id;
  const canEdit = isOwner || userPermission === 'edit' || userPermission === 'admin';
  const canShare = isOwner || userPermission === 'admin';
  const isReadOnly = userPermission === 'view';

  // ----------- Fonts -----------
  const fonts = [
    {
      id: 'sans',
      name: 'Sans Serif',
      class: 'font-sans',
      style: { fontFamily: 'system-ui, -apple-system, sans-serif' },
      preview: 'The quick brown fox'
    },
    {
      id: 'serif',
      name: 'Serif',
      class: 'font-serif',
      style: { fontFamily: 'Georgia, Cambria, "Times New Roman", serif' },
      preview: 'The quick brown fox'
    },
    {
      id: 'mono',
      name: 'Monospace',
      class: 'font-mono',
      style: { fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace' },
      preview: 'The quick brown fox'
    },
    {
      id: 'display',
      name: 'Display',
      class: 'font-sans',
      style: { fontFamily: '"Inter", -apple-system, sans-serif', letterSpacing: '-0.02em' },
      preview: 'The quick brown fox'
    }
  ];

  // ----------- WebSocket for Real-time Collaboration -----------
  useEffect(() => {
    if (note._id && currentUser) {
      // Initialize WebSocket connection
      const ws = new WebSocket(`ws://localhost:5000?noteId=${note._id}&userId=${currentUser._id}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to collaboration server');
        // Announce presence
        ws.send(JSON.stringify({
          type: 'join',
          noteId: note._id,
          user: currentUser
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'user-joined':
            setActiveCollaborators(prev => [...prev, data.user]);
            break;
          case 'user-left':
            setActiveCollaborators(prev => prev.filter(u => u._id !== data.userId));
            break;
          case 'content-update':
            if (data.userId !== currentUser._id) {
              setConflictWarning(`${data.userName} made changes`);
              setTimeout(() => setConflictWarning(null), 3000);
            }
            break;
          case 'cursor-position':
            setOtherUsersEditing(prev => {
              const filtered = prev.filter(u => u.userId !== data.userId);
              return [...filtered, { userId: data.userId, userName: data.userName, position: data.position }];
            });
            break;
          default:
            break;
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Disconnected from collaboration server');
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'leave', noteId: note._id, userId: currentUser._id }));
          ws.close();
        }
      };
    }
  }, [note._id, currentUser]);

  // Broadcast cursor position
  const handleCursorChange = (e) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor-position',
        noteId: note._id,
        userId: currentUser._id,
        userName: currentUser.name,
        position: e.target.selectionStart
      }));
    }
  };

  // ----------- Side Effects -----------
  useEffect(() => {
    function handleClickOutside(event) {
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target)) {
        setShowFontPicker(false);
      }
    }
    if (showFontPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFontPicker]);

  // Auto-save logic
  useEffect(() => {
    if ((note.title || note.content) && !isSaving && canEdit) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        handleAutoSave();
      }, 10000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [note.title, note.content, isSaving, canEdit]);

  // ----------- Functions/Helpers -----------
  async function handleAutoSave() {
    if (!canEdit) return;
    
    setAutoSaveStatus('saving');
    try {
      await onAutoSave();
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      // Broadcast update to other users
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'content-update',
          noteId: note._id,
          userId: currentUser._id,
          userName: currentUser.name
        }));
      }
      
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }

  function insertFormatting(syntax, wrapText = false) {
    if (!canEdit) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = note.content.substring(start, end);
    const beforeText = note.content.substring(0, start);
    const afterText = note.content.substring(end);
    let newText;
    let newCursorPos;
    if (wrapText && selectedText) {
      newText = beforeText + syntax + selectedText + syntax + afterText;
      newCursorPos = end + syntax.length;
    } else {
      newText = beforeText + syntax + afterText;
      newCursorPos = start + syntax.length;
    }
    setNote({ ...note, content: newText });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function handleKeyDown(e) {
    if (!canEdit && e.key !== 'Escape') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
      return;
    }
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          if (canEdit) onSave();
          break;
        case 'b':
          e.preventDefault();
          insertFormatting('**', true);
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', true);
          break;
        case 'p':
          e.preventDefault();
          setIsPreview(!isPreview);
          break;
        default:
          break;
      }
    }
    if (e.key === 'Escape' && isFocusMode) {
      setIsFocusMode(false);
    }
  }

  // ----------- Render -----------
  return (
    <>
      <div className={`w-full transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center' : ''}`}>
        <div className={`mx-auto bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isFocusMode ? 'w-full max-w-4xl h-[90vh]' : 'w-full max-w-4xl'}`}>
          {/* TOP BAR */}
          <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 transition-opacity ${isFocusMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
            {/* Left: Auto-save status & Collaborators */}
            <div className="flex items-center gap-4">
              {/* Permission Badge */}
              {!isOwner && (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                  isReadOnly ? 'bg-slate-100 text-slate-700' : 
                  userPermission === 'admin' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {isReadOnly && <Lock size={12} />}
                  {isReadOnly ? 'View Only' : userPermission === 'admin' ? 'Admin' : 'Can Edit'}
                </div>
              )}

              {/* Collaborators */}
              {(note.collaborators?.length > 0 || isOwner) && (
                <CollaboratorBadge 
                  collaborators={note.collaborators || []}
                  owner={isOwner ? currentUser : note.owner}
                  maxDisplay={3}
                />
              )}

              {/* Active Editing Indicators */}
              {otherUsersEditing.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">
                    {otherUsersEditing.length} editing
                  </span>
                </div>
              )}

              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {lastSaved && autoSaveStatus !== 'saving' && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock size={14} />
                    <span>Last saved: <TimeAgo date={lastSaved} minPeriod={5} /></span>
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    <span>Save failed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2">
              {/* Activity Feed Toggle */}
              <button
                onClick={() => setShowActivityFeed(!showActivityFeed)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors relative"
                title="Activity log"
              >
                <Activity size={18} />
                {note.editCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {note.editCount > 9 ? '9+' : note.editCount}
                  </span>
                )}
              </button>

              {/* Share Button */}
              {canShare && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                  title="Share note"
                >
                  <Share2 size={16} />
                  Share
                </button>
              )}

              <button
                onClick={() => setIsPreview(!isPreview)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title={`${isPreview ? 'Edit' : 'Preview'} (Cmd/Ctrl+P)`}
              >
                {isPreview ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors"
                title="Focus mode (Esc to exit)"
              >
                {isFocusMode ? 'Exit Focus' : 'Focus'}
              </button>
              {canEdit && (
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {isSaving ? 'Saving...' : 'Save & Close'}
                </button>
              )}
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictWarning && (
            <div className="px-6 py-2 bg-amber-50 border-b border-amber-200">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <AlertCircle size={16} />
                <span>{conflictWarning}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="ml-auto text-xs font-medium hover:underline"
                >
                  Refresh to see changes
                </button>
              </div>
            </div>
          )}

          {/* Read-Only Banner */}
          {isReadOnly && (
            <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Lock size={16} />
                <span>You have view-only access to this note</span>
              </div>
            </div>
          )}

          {/* FORMATTING TOOLBAR */}
          {!isPreview && canEdit && (
            <div className={`flex items-center gap-1 px-6 py-3 border-b border-slate-200 transition-opacity ${isFocusMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
              {/* Font Picker */}
              <div className="relative" ref={fontPickerRef}>
                <button
                  onClick={() => setShowFontPicker(!showFontPicker)}
                  className="px-3 py-2 rounded hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Change font"
                >
                  <Type size={16} />
                  {fonts.find(f => f.id === selectedFont)?.name}
                </button>
                {showFontPicker && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-2">
                    {fonts.map(font => (
                      <button
                        key={font.id}
                        onClick={() => {
                          setSelectedFont(font.id);
                          setShowFontPicker(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                          selectedFont === font.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-900">{font.name}</span>
                          {selectedFont === font.id && <CheckCircle2 size={16} className="text-blue-600" />}
                        </div>
                        <div className="text-sm text-slate-500" style={font.style}>
                          {font.preview}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button
                onClick={() => insertFormatting('**', true)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Bold (Cmd/Ctrl+B)"
              >
                <Bold size={16} />
              </button>
              <button
                onClick={() => insertFormatting('*', true)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Italic (Cmd/Ctrl+I)"
              >
                <Italic size={16} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button
                onClick={() => insertFormatting('- ', false)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Bullet list"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => insertFormatting('> ', false)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Quote"
              >
                <Quote size={16} />
              </button>
              <button
                onClick={() => insertFormatting('`', true)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Code"
              >
                <Code size={16} />
              </button>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" onKeyDown={handleKeyDown}>
            <input
              type="text"
              className="w-full text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 sm:mb-6 bg-transparent leading-normal tracking-tight shadow-none rounded-lg transition"
              placeholder="Untitled"
              value={note.title || ""}
              onChange={e => {
                if (e.target.value.length <= TITLE_LIMIT && canEdit) {
                  setNote({ ...note, title: e.target.value });
                }
              }}
              disabled={isSaving || isPreview || !canEdit}
              autoFocus={!isPreview && canEdit}
            />
            {isPreview ? (
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {note.content || 'Start writing...'}
                </div>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className={`w-full min-h-[300px] sm:min-h-[400px] text-base sm:text-lg text-slate-700 placeholder-slate-300 border-none focus:outline-none focus:ring-0 resize-none bg-transparent leading-relaxed transition-all ${fonts.find(f => f.id === selectedFont)?.class} ${!canEdit ? 'cursor-not-allowed opacity-60' : ''}`}
                  style={fonts.find(f => f.id === selectedFont)?.style}
                  placeholder={canEdit ? "Start writing..." : "You don't have permission to edit this note"}
                  value={note.content || ""}
                  onChange={e => {
                    if (e.target.value.length <= CONTENT_LIMIT && canEdit) {
                      setNote({ ...note, content: e.target.value });
                    }
                  }}
                  onSelect={handleCursorChange}
                  disabled={isSaving || !canEdit}
                  readOnly={!canEdit}
                />
                <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded transition-colors ${
                  isAtLimit ? 'bg-red-100 text-red-700' :
                  isNearLimit ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {charCount.toLocaleString()} / {CONTENT_LIMIT.toLocaleString()} chars • {wordCount} words
                </div>
              </div>
            )}
          </div>

          {/* ERROR MESSAGE */}
          {saveError && (
            <div className="px-8 pb-4">
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed Sidebar */}
      {showActivityFeed && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Activity</h3>
            <button
              onClick={() => setShowActivityFeed(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4">
            <ActivityFeed noteId={note._id} compact={false} />
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          note={note}
          currentUser={currentUser}
        />
      )}
    </>
  );
}