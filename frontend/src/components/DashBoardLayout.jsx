import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  getNotes, getUserInfo, logoutUser, createNote,
  updateNote, deleteNote,
} from "../api";
import { jsPDF } from "jspdf";
import {
  createSocket, getSocket, disconnectSocket
} from "../../services/socket";
import Sidebar from "../components/Dashboard/Sidebar";
import TopBar from "../components/Dashboard/TopBar";
import Toasts from "../components/Dashboard/Toasts";
import NotesView from "../components/Dashboard/NotesView";

export default function Dashboard() {
  // All your existing state and handlers from your original Dashboard.jsx here (as in your submitted code)
  // For brevity, not repeated here. Copy your full state + handlers as shown in the first part of your code.

  // All the useEffects (loadDashboardData, resize handlers, click handlers, etc) go here as before

  // Loading state JSX preserved

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
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        handleMouseDown={handleMouseDown}
        user={user}
        notes={notes}
        setFavoriteOpen={setFavoriteOpen}
        setTrashOpen={setTrashOpen}
        setEditorMode={setEditorMode}
        setEditingNote={setEditingNote}
        setSaveError={setSaveError}
        setSaveSuccess={setSaveSuccess}
        favoriteOpen={favoriteOpen}
        trashOpen={trashOpen}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Toasts
          saveSuccess={saveSuccess}
          deleteSuccess={deleteSuccess}
          movedToTrashSuccess={MovedToTrashSuccess}
          favoriteSuccess={favoriteSuccess}
          favoriteRemovalSuccess={favoriteRemovalSuccess}
          downloadSuccess={downloadSuccess}
          duplicateSuccess={duplicateSuccess}
        />
        <NotesView
          notes={notes}
          searchQuery={searchQuery}
          trashOpen={trashOpen}
          favoriteOpen={favoriteOpen}
          filteredNotes={filteredNotes}
          filteredTrashedNotes={filteredTrashedNotes}
          filteredFavoritedNotes={filteredFavoritedNotes}
          setEditorMode={setEditorMode}
          setEditingNote={setEditingNote}
          setSaveError={setSaveError}
          updateNoteAsTrashed={updateNoteAsTrashed}
          deleteNoteForever={deleteNoteForever}
          updateNoteAsFavorite={updateNoteAsFavorite}
          updateNoteAsFavoriteRemoval={updateNoteAsFavoriteRemoval}
          duplicateNote={duplicateNote}
          exportAsMarkdown={exportAsMarkdown}
          exportAsText={exportAsText}
          exportAsPDF={exportAsPDF}
          handleShareClick={handleShareClick}
          showShareModal={showShareModal}
          referencedNote={referencedNote}
          user={user}
          setShowShareModal={setShowShareModal}
          activeNoteMenu={activeNoteMenu}
          setActiveNoteMenu={setActiveNoteMenu}
          exportFormatMenu={exportFormatMenu}
          setExportFormatMenu={setExportFormatMenu}
          handleMouseLeave={handleMouseLeave}
          handleMouseEnter={handleMouseEnter}
          formatDate={formatDate}
        />
      </main>
    </div>
  );
}
