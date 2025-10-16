# Colabo Collaboration Components - Integration Guide

## 📁 File Structure

```
src/
├── components/
│   ├── collaboration/
│   │   ├── ShareModal.jsx                 # Main sharing interface
│   │   ├── CollaborationNotification.jsx  # Real-time notifications
│   │   ├── CollaboratorBadge.jsx         # Avatar badges
│   │   ├── PresenceIndicator.jsx         # Active users display
│   │   ├── CollaboratorCursor.jsx        # Real-time cursor tracking
│   │   ├── CommentThread.jsx             # Inline comments
│   │   ├── ActivityFeed.jsx              # Activity log
│   │   ├── VersionHistory.jsx            # Version control
│   │   ├── ConflictResolver.jsx          # Merge conflicts
│   │   ├── PermissionManager.jsx         # Permission settings
│   │   └── SharedWithMe.jsx              # Shared notes view
│   ├── editor/
│   │   ├── TextEditor.jsx                # Your existing editor
│   │   └── CollaborativeTextEditor.jsx   # Enhanced with collab
│   └── ...
├── services/
│   └── api.js                            # API service layer
└── ...
```

---

## 🚀 Integration Steps

### Step 1: Add Components to Your Project

Create a `collaboration` folder in your `components` directory and add all the collaboration components.

### Step 2: Update Your Main App Component

```jsx
// App.jsx or Dashboard.jsx
import { useState } from 'react';
import ShareModal from './components/collaboration/ShareModal';
import CollaborationNotification from './components/collaboration/CollaborationNotification';
import SharedWithMe from './components/collaboration/SharedWithMe';
import CollaborativeTextEditor from './components/editor/CollaborativeTextEditor';

function App() {
  const [showSharedView, setShowSharedView] = useState(false);
  const [currentUser, setCurrentUser] = useState(/* your user object */);
  
  // ... rest of your app logic
}
```

### Step 3: Replace TextEditor with CollaborativeTextEditor

**In your existing code where you render TextEditor:**

```jsx
// OLD (Document 2 - your current code)
{editorMode && (
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
)}

// NEW (with collaboration features)
{editorMode && (
  <CollaborativeTextEditor
    note={editingNote}
    setNote={setEditingNote}
    onSave={handleManualSave}
    onAutoSave={handleAutoSave}
    onCancel={handleCancelNote}
    isSaving={isSaving}
    saveError={saveError}
    mode={editorMode}
    currentUser={user}  // Add this
    onShareClick={() => setShowShareModal(true)}  // Add this
  />
)}
```

### Step 4: Add Notifications to Header

**In your top bar (Document 1 - around line with Share button):**

```jsx
// In your header section, replace:
<header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center px-8 shadow-sm">
  <div className="flex-1 flex items-center gap-4">
    {/* ... search bar ... */}
  </div>
  <div className="flex items-center gap-2">
    {/* ADD THIS - Notification Bell */}
    <CollaborationNotification
      onAcceptInvite={handleAcceptInvite}
      onDeclineInvite={handleDeclineInvite}
    />
    
    <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2">
      <Share2 size={16} />
      Share
    </button>
    {/* ... rest of buttons ... */}
  </div>
</header>
```

### Step 5: Update Sidebar Navigation

**In your sidebar (Document 1 - navigation section):**

```jsx
{/* Replace "Shared with me" button with full component */}
<button 
  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${sharedOpen ? "bg-blue-50 text-blue-700" : "text-slate-600"} font-medium text-sm transition-all min-w-0`}
  onClick={() => {
    setSharedOpen(true);
    setFavoriteOpen(false);
    setTrashOpen(false);
  }}
>
  <Users size={18} className="flex-shrink-0" />
  {!sidebarCollapsed && (
    <>
      <span className="truncate flex-1 text-left">Shared with me</span>
      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex-shrink-0">
        {sharedNotes.length}
      </span>
    </>
  )}
</button>
```

### Step 6: Add Shared Notes View

**In your main content area (where you handle different views):**

```jsx
{editorMode ? (
  <CollaborativeTextEditor {...editorProps} />
) : trashOpen ? (
  <TrashView />
) : favoriteOpen ? (
  <FavoritesView />
) : sharedOpen ? (
  // ADD THIS NEW VIEW
  <SharedWithMe 
    onOpenNote={handleOpenSharedNote}
  />
) : (
  <AllNotesView />
)}
```

### Step 7: Add Collaborator Badges to Note Cards

**In your note card component (where you display individual notes):**

```jsx
import CollaboratorBadge from './components/collaboration/CollaboratorBadge';

// In your note card render:
<div className="note-card">
  <div className="flex items-center justify-between">
    <h3>{note.title}</h3>
    
    {/* ADD THIS */}
    {note.collaborators && note.collaborators.length > 0 && (
      <CollaboratorBadge 
        collaborators={note.collaborators}
        owner={note.owner}
        maxDisplay={3}
      />
    )}
  </div>
  {/* ... rest of card ... */}
</div>
```

---

## 🔧 Required State Management

Add these state variables to your main component:

```jsx
const [showShareModal, setShowShareModal] = useState(false);
const [showVersionHistory, setShowVersionHistory] = useState(false);
const [showPermissionManager, setShowPermissionManager] = useState(false);
const [sharedOpen, setSharedOpen] = useState(false);
const [sharedNotes, setSharedNotes] = useState([]);
const [activeCollaborators, setActiveCollaborators] = useState([]);
```

---

## 📡 API Integration Points

### Update Your Note Save Function

```jsx
const handleManualSave = async () => {
  try {
    setIsSaving(true);
    
    // Check if user has permission
    if (!canEdit(editingNote, user)) {
      setSaveError('You don\'t have permission to edit this note');
      return;
    }
    
    const response = await api.notes.update(editingNote._id, {
      title: editingNote.title,
      content: editingNote.content,
      version: editingNote.version + 1,
      lastEditedBy: user._id
    });
    
    // Broadcast update via WebSocket
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'note-updated',
        noteId: editingNote._id,
        userId: user._id
      }));
    }
    
    setSaveSuccess(true);
    setEditorMode(null);
  } catch (error) {
    setSaveError(error.message);
  } finally {
    setIsSaving(false);
  }
};
```

### Fetch Shared Notes

```jsx
const fetchSharedNotes = async () => {
  try {
    const response = await api.collab.getSharedNotes();
    setSharedNotes(response.data);
  } catch (error) {
    console.error('Failed to fetch shared notes:', error);
  }
};

// Call on mount
useEffect(() => {
  fetchSharedNotes();
}, []);
```

---

## 🎨 Component Usage Examples

### 1. ShareModal

```jsx
{showShareModal && (
  <ShareModal
    isOpen={showShareModal}
    onClose={() => setShowShareModal(false)}
    note={editingNote}
    currentUser={user}
  />
)}
```

### 2. VersionHistory

```jsx
{showVersionHistory && (
  <VersionHistory
    noteId={editingNote._id}
    currentVersion={editingNote.version}
    onRestore={handleRestoreVersion}
    onClose={() => setShowVersionHistory(false)}
  />
)}
```

### 3. ConflictResolver

```jsx
{conflicts.length > 0 && (
  <ConflictResolver
    conflicts={conflicts}
    onResolve={handleResolveConflicts}
    onCancel={() => setConflicts([])}
  />
)}
```

### 4. PermissionManager

```jsx
{showPermissionManager && (
  <PermissionManager
    note={editingNote}
    collaborators={editingNote.collaborators || []}
    onUpdatePermissions={handleUpdatePermissions}
    onClose={() => setShowPermissionManager(false)}
  />
)}
```

### 5. CommentThread

```jsx
{showComments && (
  <CommentThread
    noteId={editingNote._id}
    onClose={() => setShowComments(false)}
    position={commentPosition}
    highlightedText={selectedText}
  />
)}
```

### 6. PresenceIndicator

```jsx
<PresenceIndicator
  activeUsers={activeCollaborators}
  currentUser={user}
/>
```

---

## 🔄 WebSocket Setup

```jsx
// In your main app component
import { CollabWebSocket } from './services/api';

useEffect(() => {
  if (user) {
    const ws = new CollabWebSocket(user._id);
    ws.connect();

    ws.on('user-joined', (data) => {
      setActiveCollaborators(prev => [...prev, data.user]);
    });

    ws.on('user-left', (data) => {
      setActiveCollaborators(prev => 
        prev.filter(u => u._id !== data.userId)
      );
    });

    ws.on('invite-received', (data) => {
      // Show notification
      fetchNotifications();
    });

    return () => ws.disconnect();
  }
}, [user]);
```

---

## 🎯 Key Integration Points Summary

1. **Header**: Add `CollaborationNotification` next to Share button
2. **Sidebar**: Update "Shared with me" to toggle `SharedWithMe` view
3. **Editor**: Replace `TextEditor` with `CollaborativeTextEditor`
4. **Note Cards**: Add `CollaboratorBadge` to show collaborators
5. **Modals**: Add state & render for `ShareModal`, `VersionHistory`, etc.
6. **API Service**: Import and use `api.js` for all backend calls
7. **WebSocket**: Initialize `CollabWebSocket` for real-time features

---

## 📝 Optional Enhancements

### Add to Note Context Menu

```jsx
<button onClick={() => setShowVersionHistory(true)}>
  <History size={16} />
  Version History
</button>

<button onClick={() => setShowPermissionManager(true)}>
  <Shield size={16} />
  Manage Permissions
</button>
```

### Add Keyboard Shortcuts

```jsx
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k') {
        e.preventDefault();
        setShowShareModal(true);
      }
      if (e.key === 'h') {
        e.preventDefault();
        setShowVersionHistory(true);
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## ✅ Testing Checklist

- [ ] Share modal opens and closes correctly
- [ ] Notifications display and update in real-time
- [ ] Collaborator badges show on notes
- [ ] Shared notes view displays correctly
- [ ] Version history loads and allows restoration
- [ ] Permission changes save and reflect immediately
- [ ] Comments can be added and replied to
- [ ] Conflict resolution works when simultaneous edits occur
- [ ] Cursor tracking shows other users' positions
- [ ] Activity feed logs all actions

---

## 🐛 Common Issues & Solutions

**Issue**: Components not showing
- **Solution**: Check import paths and ensure all dependencies are installed

**Issue**: WebSocket not connecting
- **Solution**: Verify WebSocket URL in environment variables

**Issue**: Permission errors
- **Solution**: Ensure user object has correct `_id` and permission fields

**Issue**: Styling conflicts
- **Solution**: All components use Tailwind - ensure no CSS overrides

---

## 📚 Next Steps

1. Set up backend routes for collaboration endpoints
2. Configure WebSocket server
3. Add proper authentication middleware
4. Implement rate limiting for invites
5. Add email notifications for invites
6. Set up audit logging
7. Implement Claude AI integration for insights

---

## 💡 Pro Tips

- Use React Context for user/collaboration state across components
- Implement optimistic updates for better UX
- Add loading skeletons for async operations
- Use debouncing for auto-save to reduce API calls
- Implement offline support with service workers
- Add analytics tracking for collaboration metrics

---

Need help? Check the inline component documentation or refer to the API service layer comments!