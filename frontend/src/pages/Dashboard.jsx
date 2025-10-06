import { useEffect, useState, useRef } from "react";
import { getNotes, getUserInfo, logoutUser, createNote, updateNote} from "../api";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Star, Users, Trash2, Menu, MoreVertical, Edit3, Share2, ChevronRight, Sparkles, FileText, Copy, Download } from "lucide-react";
import TabBar from "../components/TabBar";
import TextEditor from "../components/TextEditor";


/**
 * Modern Dashboard - Matching Home/Login/Register Aesthetic
 * 
 * Beautiful gradient design with blue-purple accents
 * Glassmorphism, smooth animations, and modern card layouts
 * All your backend logic preserved and working
 */
export default function Dashboard() {
  // State management - connected to your backend
  const [notes, setNotes] = useState([
    {
      _id: '1',
      title: 'Project Brainstorm',
      content: 'Ideas:\n- Real-time chat\n- Collaborative editing\n- Fun UI with gradients!',
      createdAt: '2025-09-08T13:21:00Z',
      updatedAt: '2025-10-01T09:30:00Z',
      owner: { name: 'Ada' }
    },
    {
      _id: '2',
      title: 'Meeting Notes',
      content: '1. Review tasks\n2. Discuss next sprint\n3. Assign new issues.',
      createdAt: '2025-09-10T08:45:00Z',
      updatedAt: '2025-09-12T16:15:00Z',
      owner: { name: 'Chidi' }
    },
    {
      _id: '3',
      title: 'Personal Diary',
      content: 'Feeling great building collaborative apps today!',
      createdAt: '2025-09-27T10:00:00Z',
      updatedAt: '2025-10-02T11:34:00Z',
      owner: { name: 'Zainab' }
    },
    {
      _id: '4',
      title: 'Todo List',
      content: '[] Finish React dashboard\n[] Write clean code\n[] Celebrate small wins!',
      createdAt: '2025-09-20T12:31:00Z',
      updatedAt: '2025-10-03T08:10:00Z',
      owner: { name: 'Ada' }
    },
    {
      _id: '5',
      title: 'Bug Report',
      content: 'The sidebar animation jitters on mobile devices.',
      createdAt: '2025-10-02T14:14:00Z',
      updatedAt: '2025-10-04T09:05:00Z',
      owner: { name: 'Chidi' }
    }
  ]);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [editorMode, setEditorMode] = useState(null); // 'create', 'edit', or null
  const [editingNote, setEditingNote] = useState(null); // Used for both new and edit
  const [activeNoteMenu, setActiveNoteMenu] = useState(null);
  const menuRef = useRef(null);


  const navigate = useNavigate();

  /**
   * Load dashboard data on mount - YOUR ORIGINAL BACKEND CALLS
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      // Min width 200px, max width 500px
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };
  
    const handleMouseUp = () => {
      setIsResizing(false);
    };
  
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Add this after your other useEffect hooks
useEffect(() => {
  function handleResize() {
    // Auto-collapse sidebar when screen width < 1024px (tablet/mobile)
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }

  // Check on mount
  handleResize();

  // Listen for resize events
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


useEffect(() => {
  // Handler runs on every click anywhere in the document
  function handleClickOutside() {
    if (!menuRef.current) return;
    if (!menuRef.current.contains(e.target)) {
      setActiveNoteMenu(null);
    }
  }
  if (activeNoteMenu !== null) {
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up: remove the event when the menu closes or component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
}, [activeNoteMenu]);


  /**
   * Fetch user and notes data from your backend
   */
  async function loadDashboardData() {
    try {
      const [userData, notesData] = await Promise.all([
        getUserInfo(),
        getNotes()
      ]);
      
      setUser(userData);
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }
  


  /**
   * Handle user logout - YOUR ORIGINAL FUNCTION
   */
  async function handleLogout() {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  }

  /**
   * Format date for display
   */
  function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // Are dates the same (Y/M/D)?
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  // Yesterday check
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  // Days ago (up to 6)
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}


  /**
   * Filter notes based on search
   */
  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //NOTE HANDLING AND EDITING FUNCTIONS

  // Auto-save handler - stays open, handles create→edit transition
  async function handleAutoSave() {
    try {
      if (editorMode === 'create') {
        // First save of a new note
        const savedNote = await createNote(editingNote);
        
        // Update local state with the new note (now has _id)
        setNotes(prev => [...prev, savedNote]);
        setEditingNote(savedNote); // Important: update with server response
        
        // Switch to edit mode so next auto-save uses update
        setEditorMode('edit');
        
        return { success: true };
      } else if (editorMode === 'edit') {
        // Updating existing note
        const updatedNote = await updateNote(editingNote._id, editingNote);
        
        // Update in notes list
        setNotes(prev =>
          prev.map(n => n._id === updatedNote._id ? updatedNote : n)
        );
        setEditingNote(updatedNote); // Keep in sync with server
        
        return { success: true };
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      return { success: false, error: error.message };
    }
}

  // Manual save - closes editor and shows toast
async function handleManualSave() {
  setIsSaving(true);
  setSaveError(null);
  setSaveSuccess(false);

  try {
    if (editorMode === 'create') {
      const savedNote = await createNote(editingNote);
      setNotes(prev => [...prev, savedNote]);
    } else if (editorMode === 'edit') {
      const updatedNote = await updateNote(editingNote._id, editingNote);
      setNotes(prev =>
        prev.map(n => n._id === updatedNote._id ? updatedNote : n)
      );
    }
    
    // Close editor and show success
    setEditorMode(null);
    setEditingNote(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  } catch (error) {
    setSaveError(error.message || "Failed to save note.");
  } finally {
    setIsSaving(false);
  }
}


  // Cancel the note
  function handleCancelNote() {
    setEditorMode(null);
    setEditingNote(null);
  }
  

  // Modern loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mb-4 mx-auto">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      
      {/* Modern Sidebar with gradient accents */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm relative`}
      style={!sidebarCollapsed ? { width: `${sidebarWidth}px` } : {}}>

        {/* Resize Handle */}
        {!sidebarCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 -right-1 w-3 group-hover:bg-blue-500/10"></div>
          </div>
        )}
        
        {/* Brand Header - matching login/register */}
        <div className="h-16 border-b border-slate-100 flex items-center px-5">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">
                Colabo
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors flex-shrink-0"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* New Note Button - gradient matching CTAs */}
        <div className="p-4 border-b border-slate-100">
          <button className={`w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2`}
          onClick={() => {
            setEditorMode('create');
            setEditingNote({
              title: '',
              content: '',
              createdAt: new Date().toISOString(),
              owner: user
            });
            setSaveError(null);
            setSaveSuccess(false);
          }}>
            <Plus size={18} className="flex-shrink-0" />
            <span className="truncate">New Note</span>
          </button>
        </div>

        {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* All Notes (active example, bg highlight & badge) */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm transition-all min-w-0">
            <Edit3 size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="truncate flex-1 text-left">All Notes</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">{notes.length}</span>
              </>
            )}
          </button>

          {/* Favorites */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-all min-w-0">
            <Star size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate flex-1 text-left">Favorites</span>}
          </button>

          {/* Shared With Me */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-all min-w-0">
            <Users size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate flex-1 text-left">Shared with me</span>}
          </button>

          {/* Trash */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-all min-w-0">
            <Trash2 size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate flex-1 text-left">Trash</span>}
          </button>
        </nav>


        {/* User Profile - gradient avatar */}
        <div className="border-t border-slate-200 p-4">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || 'User'}
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex justify-center"
              title="Sign out"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar - glassmorphism effect */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center px-8 shadow-sm">
          <div className="flex-1 flex items-center gap-4">
            {/* Search with gradient focus ring */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2">
            <Share2 size={16} />
            Share
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
            <MoreVertical size={18} />
          </button>
        </div>
        </header>

      {/* Success Toast */}
      {saveSuccess && (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-green-700 font-medium">Note saved successfully!</p>
        </div>
      </div>
      )}


      <div className="flex-1 overflow-y-auto">
        <div className={`mx-auto py-8 transition-all ${
    editorMode ? 'px-4 sm:px-6 lg:px-8' : 'px-8'
  } ${editorMode ? 'max-w-5xl' : 'max-w-6xl'}`}>
        {editorMode ? (
        <TextEditor
        note={editingNote}
        setNote={setEditingNote}
        onSave={handleManualSave}
        onAutoSave={handleAutoSave}
        onCancel={handleCancelNote}
        isSaving={isSaving}
        saveError={saveError}
        mode={editorMode}
        />
      ) : (
        filteredNotes.length > 0 ? (
          <>
            {/* Notes Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Notes</h2>
              <p className="text-slate-600">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            {/* Notes Grid */}
            <div className="grid gap-4">
            {filteredNotes.map((note, index) => (
                  <div
                    key={note._id}
                    className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>
                    
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Note icon and title */}
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={16} className="text-slate-400" />
                          <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                            {note.title || 'Untitled Note'}
                          </h3>
                        </div>
                        
                        {/* Note preview */}
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                          {note.content || 'Start writing...'}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="font-medium">{formatDate(note.updatedAt)}</span>
                          {note.owner?.name && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                  {note.owner.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{note.owner.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    
                      {/* Action buttons - gradient on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Edit Button */}
                      <button 
                        className="p-2 hover:bg-blue-50 rounded-lg transition-all text-slate-600 hover:text-blue-700"
                        onClick={() => {
                          setEditorMode('edit');
                          setEditingNote(note);
                          setSaveError(null);
                        }}
                        title="Edit note"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Share/Collaborate Button */}
                      <button 
                        className="p-2 hover:bg-blue-50 rounded-lg transition-all text-slate-600 hover:text-blue-700"
                        title="Share with team"
                      >
                        <Users size={16} />
                      </button>

                      {/* More Options Dropdown */}
                      <div className="relative">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-all text-slate-600 hover:text-blue-700"
                          onClick={() => {
                            // Toggle dropdown for this specific note
                            setActiveNoteMenu(activeNoteMenu === note._id ? null : note._id);
                          }}
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeNoteMenu === note._id && (
                          <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10">
                            {/* Favorite/Star */}
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700 hover:text-slate-900"
                              onClick={() => {
                                // TODO: Toggle favorite status
                                console.log('Toggle favorite:', note._id);
                                setActiveNoteMenu(null);
                              }}
                            >
                              <Star size={16} />
                              {note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </button>

                            {/* Duplicate */}
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700 hover:text-slate-900"
                              onClick={() => {
                                // TODO: Duplicate note
                                console.log('Duplicate note:', note._id);
                                setActiveNoteMenu(null);
                              }}
                            >
                              <Copy size={16} />
                              Duplicate
                            </button>

                            {/* Export */}
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700 hover:text-slate-900"
                              onClick={() => {
                                // TODO: Export as markdown/PDF
                                console.log('Export note:', note._id);
                                setActiveNoteMenu(null);
                              }}
                            >
                              <Download size={16} />
                              Export
                            </button>

                            {/* Move to Trash */}
                            <div className="border-t border-slate-200 my-1"></div>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 hover:text-red-700"
                              onClick={() => {
                                // TODO: Move to trash with confirmation
                                if (confirm('Move this note to trash?')) {
                                  console.log('Delete note:', note._id);
                                  setActiveNoteMenu(null);
                                }
                              }}
                            >
                              <Trash2 size={16} />
                              Move to trash
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          // Empty State UI
          <div className="text-center py-20">
                {/* Icon with gradient background */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Edit3 size={32} className="text-blue-600" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  {searchQuery ? 'No notes found' : 'Start creating'}
                </h3>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `No notes match "${searchQuery}". Try a different search term.`
                    : 'Create your first note and start collaborating with your team in real-time.'
                  }
                </p>

                {!searchQuery && (
                  <button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all inline-flex items-center gap-2"
                    onClick={() => {
                      setEditorMode('create');
                      setEditingNote({
                        title: '',
                        content: '',
                        createdAt: new Date().toISOString(),
                        owner: user
                      });
                      setSaveError(null);
                      setSaveSuccess(false);
                    }}
                  >
                    <Plus size={20} 
                    />
                    Create New Note
                  </button>
                )}
              </div>
        ) )}
        </div>
    </div>
      </main>
    </div>
  );
}