import { useState } from 'react';
import { MessageSquare, Send, MoreVertical, Trash2, Edit2, Check, X, ThumbsUp, Reply } from 'lucide-react';

const CommentThread = ({ noteId, onClose, position, highlightedText }) => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'S', id: 'user1' },
      content: 'This section needs more detail about the implementation.',
      timestamp: new Date(Date.now() - 3600000),
      likes: 2,
      replies: [
        {
          id: 11,
          user: { name: 'Mike Johnson', avatar: 'M', id: 'user2' },
          content: 'I agree, let me add more context.',
          timestamp: new Date(Date.now() - 1800000),
          likes: 1
        }
      ],
      resolved: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  const currentUser = { name: 'Current User', avatar: 'C', id: 'current' };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: currentUser,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      resolved: false
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      user: currentUser,
      content: replyText,
      timestamp: new Date(),
      likes: 0
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyText('');
    setReplyingTo(null);
  };

  const handleEditComment = (commentId) => {
    if (!editText.trim()) return;

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: editText, edited: true };
      }
      return comment;
    }));

    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    if (isReply) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
            )
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      ));
    }
  };

  const handleResolveThread = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    ));
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-slate-700" />
            <h3 className="font-semibold text-slate-900">Comments</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <X size={16} className="text-slate-600" />
          </button>
        </div>
        {highlightedText && (
          <div className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
            <span className="font-medium">On:</span> "{highlightedText.substring(0, 50)}{highlightedText.length > 50 ? '...' : ''}"
          </div>
        )}
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map(comment => (
          <div
            key={comment.id}
            className={`${comment.resolved ? 'opacity-60' : ''}`}
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {comment.user.avatar}
              </div>

              {/* Comment content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{comment.user.name}</span>
                  <span className="text-xs text-slate-500">{getTimeAgo(comment.timestamp)}</span>
                  {comment.edited && (
                    <span className="text-xs text-slate-400">(edited)</span>
                  )}
                  {comment.resolved && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                      Resolved
                    </span>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="2"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Check size={12} className="inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(null);
                          setEditText('');
                        }}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-700 mb-2 leading-relaxed">{comment.content}</p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp size={12} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Reply size={12} />
                        Reply
                      </button>
                      {comment.user.id === currentUser.id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditText(comment.content);
                            }}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleResolveThread(comment.id)}
                        className={`ml-auto flex items-center gap-1 text-xs font-medium transition-colors ${
                          comment.resolved 
                            ? 'text-slate-500 hover:text-slate-700' 
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        <Check size={12} />
                        {comment.resolved ? 'Reopen' : 'Resolve'}
                      </button>
                    </div>
                  </>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-200">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {reply.user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-900">{reply.user.name}</span>
                            <span className="text-xs text-slate-500">{getTimeAgo(reply.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-700 mb-1">{reply.content}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id, true, comment.id)}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <ThumbsUp size={10} />
                            {reply.likes > 0 && <span>{reply.likes}</span>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                {replyingTo === comment.id && (
                  <div className="mt-3 pl-4 border-l-2 border-blue-500">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {currentUser.avatar}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare size={28} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">No comments yet</p>
            <p className="text-xs text-slate-500">Start a discussion about this section</p>
          </div>
        )}
      </div>

      {/* New comment input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
              rows="3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAddComment();
                }
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={14} />
              Comment (Cmd/Ctrl+Enter)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentThread;