import React from "react";
import { Trash2, Star, Download, Copy } from "lucide-react";

export default function Toasts({
  saveSuccess, deleteSuccess, movedToTrashSuccess, favoriteSuccess,
  favoriteRemovalSuccess, downloadSuccess, duplicateSuccess
}) {
  return (
    <>
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

      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <Trash2 size={14} className="text-white" />
            </div>
            <p className="text-red-700 font-medium">Note permanently deleted!</p>
          </div>
        </div>
      )}

      {movedToTrashSuccess && (
        <div className="fixed top-4 right-4 bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
              <Trash2 size={14} className="text-white" />
            </div>
            <p className="text-amber-700 font-medium">Note moved to trash!</p>
          </div>
        </div>
      )}

      {favoriteSuccess && (
        <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star size={14} className="text-white" />
            </div>
            <p className="text-yellow-700 font-medium">Note added to favorites!</p>
          </div>
        </div>
      )}

      {favoriteRemovalSuccess && (
        <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star size={14} className="text-white" />
            </div>
            <p className="text-yellow-700 font-medium">Removed from favorites!</p>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Download size={14} className="text-white" />
            </div>
            <p className="text-blue-700 font-medium">Note downloaded!</p>
          </div>
        </div>
      )}

      {duplicateSuccess && (
        <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Copy size={16} className="text-white" />
            </div>
            <p className="text-blue-700 font-medium">Note duplicated successfully!</p>
          </div>
        </div>
      )}
    </>
  );
}
