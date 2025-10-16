import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const CollaboratorCursor = ({ collaborators, textareaRef }) => {
  const [cursors, setCursors] = useState({});
  
  // Generate unique colors for each collaborator
  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
    { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' },
    { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
    { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500' },
    { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
    { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
    { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
    { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' },
  ];

  const getColorForUser = (userId) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  useEffect(() => {
    // Update cursor positions based on collaborator data
    const newCursors = {};
    collaborators.forEach(collab => {
      if (collab.cursorPosition !== undefined && textareaRef.current) {
        const textarea = textareaRef.current;
        const position = collab.cursorPosition;
        
        // Calculate cursor position in pixels
        const textBeforeCursor = textarea.value.substring(0, position);
        const lines = textBeforeCursor.split('\n');
        const lineNumber = lines.length - 1;
        const charInLine = lines[lineNumber].length;
        
        // Approximate positioning (this is simplified)
        const lineHeight = 28; // Adjust based on your textarea font size
        const charWidth = 9; // Approximate character width
        
        newCursors[collab.userId] = {
          top: lineNumber * lineHeight,
          left: charInLine * charWidth,
          user: collab.userName,
          color: getColorForUser(collab.userId),
          isTyping: collab.isTyping
        };
      }
    });
    setCursors(newCursors);
  }, [collaborators, textareaRef]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute transition-all duration-200"
          style={{
            top: `${cursor.top}px`,
            left: `${cursor.left}px`,
          }}
        >
          {/* Cursor line */}
          <div className={`w-0.5 h-5 ${cursor.color.bg} animate-pulse`}></div>
          
          {/* User label */}
          <div className={`absolute top-0 left-1 whitespace-nowrap pointer-events-auto`}>
            <div className={`${cursor.color.bg} text-white text-xs px-2 py-0.5 rounded-t-md rounded-br-md font-medium shadow-lg flex items-center gap-1`}>
              <User size={10} />
              {cursor.user}
              {cursor.isTyping && (
                <span className="inline-block">
                  <span className="animate-bounce inline-block">.</span>
                  <span className="animate-bounce inline-block" style={{ animationDelay: '0.1s' }}>.</span>
                  <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollaboratorCursor;