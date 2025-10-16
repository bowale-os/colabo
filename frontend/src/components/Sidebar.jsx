import React from "react";
import {
  Sparkles, Menu, ChevronRight, Plus, Star, Users, Trash2, Notebook
} from "lucide-react";

export default function Sidebar({
  sidebarCollapsed, setSidebarCollapsed, sidebarWidth, setSidebarWidth, handleMouseDown,
  user, notes, setFavoriteOpen, setTrashOpen, favoriteOpen, trashOpen, handleLogout,
  setEditorMode, setEditingNote, setSaveError, setSaveSuccess
}) {
  return (
    <aside
      className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm relative`}
      style={!sidebarCollapsed ? { width: `${sidebarWidth}px` } : {}}
    >
      {!sidebarCollapsed && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -right-1 w-3 group-hover:bg-blue-500/10"></div>
        </div>
      )}
      
      {/* Brand Header */}
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

      {/* New Note Button */}
      <div className="p-4 border-b border-slate-100">
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
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
          <Plus size={18} className="flex-shrink-0" />
          <span className="truncate">New Note</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* All Notes */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            !trashOpen && !favoriteOpen ? "bg-blue-50 text-blue-700" : "text-slate-600"
          } font-medium text-sm transition-all min-w-0`}
          onClick={() => {
            setFavoriteOpen(false);
            setTrashOpen(false);
          }}
        >
          <Notebook size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="truncate flex-1 text-left">All Notes</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
                {notes.filter(n => !n.trashed).length}
              </span>
            </>
          )}
        </button>

        {/* Favorites */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            favoriteOpen ? "bg-blue-50 text-blue-700" : "text-slate-600"
          } font-medium text-sm transition-all min-w-0`}
          onClick={() => {
            setFavoriteOpen(true);
            setTrashOpen(false);
          }}
        >
          <Star size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="truncate flex-1 text-left">Favorites</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex-shrink-0">
                {notes.filter(n => n.isFavorite && !n.trashed).length}
              </span>
            </>
          )}
        </button>

        {/* Shared With Me */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-all min-w-0">
          <Users size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && <span className="truncate flex-1 text-left">Shared with me</span>}
        </button>

        {/* Trash */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            trashOpen ? "bg-blue-50 text-blue-700" : "text-slate-600"
          } font-medium text-sm transition-all min-w-0`}
          onClick={() => {
            setTrashOpen(true);
            setFavoriteOpen(false);
          }}
        >
          <Trash2 size={18} className="flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="truncate flex-1 text-left">Trash</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex-shrink-0">
                {notes.filter(n => n.trashed).length}
              </span>
            </>
          )}
        </button>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "User"}
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
          <button onClick={handleLogout} className="w-full flex justify-center" title="Sign out">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}
