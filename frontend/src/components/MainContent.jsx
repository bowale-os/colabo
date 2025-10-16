import React from 'react';
import Toast from './Toast';
import NotesList from './NotesList';
import TextEditor from './TextEditor';
import ShareModal from './ShareModal';

export default function MainContent({
  notes,
  viewMode,
  editorMode,
  editingNote,
  ...handlersAndStates // pass down all necessary state/handlers as individual props!
}) {
  return (
    <section>
      {/* TopBar/SearchBar/Filters */}
      {/* Toasts for success/error */}
      <Toast {...handlersAndStates} />
      {/* Editor View */}
      {editorMode && (
        <TextEditor
          note={editingNote}
          {...handlersAndStates}
        />
      )}
      {/* Notes List */}
      {!editorMode && (
        <NotesList
          notes={notes}
          viewMode={viewMode} // 'all', 'favorites', 'trash'
          {...handlersAndStates}
        />
      )}
      {/* Share Modal */}
      <ShareModal {...handlersAndStates} />
    </section>
  );
}
