export default function TabBar({ openDocs, activeDocId, setActiveDocId, handleCloseDoc }) {
    return (
      <div className="flex items-center bg-slate-50 border-b border-slate-200 overflow-x-auto">
        {openDocs.map((doc) => (
          <div
            key={doc.id}
            className={`px-4 py-2 border-r min-w-[120px] cursor-pointer ${
              doc.id === activeDocId
                ? 'bg-white font-bold border-b-2 border-blue-600 text-blue-700'
                : 'hover:bg-slate-100'
            }`}
            onClick={() => setActiveDocId(doc.id)}
          >
            <span className="truncate">{doc.title || 'Untitled'}</span>
            <button
              className="ml-2 text-slate-400 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseDoc(doc.id);
              }}
            >×</button>
          </div>
        ))}
      </div>
    );
  }
  