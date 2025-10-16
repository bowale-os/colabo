import React from "react";
import { Search, Share2, MoreVertical } from "lucide-react";

export default function TopBar({ searchQuery, setSearchQuery }) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center px-8 shadow-sm">
      <div className="flex-1 flex items-center gap-4">
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
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2"
        >
          <Share2 size={16} />
          Share
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
