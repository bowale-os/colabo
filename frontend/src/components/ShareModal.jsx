import { useState } from 'react';
import { X, Mail, UserPlus, Shield, Eye, Edit3, Trash2, Copy, Check, AlertCircle } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, note, currentUser }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('edit');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock data - replace with API calls
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, email: 'jane@example.com', permission: 'edit', sentAt: new Date() }
  ]);
  
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', permission: 'edit', avatar: 'J' }
  ]);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsInviting(true);
    setError(null);

    try {
      // API call would go here
      // await api.collab.invite({ noteId: note._id, email, permission });
      
      setTimeout(() => {
        setPendingInvites([...pendingInvites, {
          id: Date.now(),
          email,
          permission,
          sentAt: new Date()
        }]);
        setEmail('');
        setInviteSuccess(true);
        setIsInviting(false);
        
        setTimeout(() => setInviteSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      setError('Failed to send invitation');
      setIsInviting(false);
    }
  };

  const handleCopyLink = () => {
    // Generate shareable link
    const shareLink = `${window.location.origin}/note/${note._id}/accept`;
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const removeCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const cancelInvite = (id) => {
    setPendingInvites(pendingInvites.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <UserPlus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Share Note</h2>
              <p className="text-sm text-slate-500">{note?.title || 'Untitled Note'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invite Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Mail size={16} />
              Invite by Email
            </h3>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              />
              
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={handleInvite}
                disabled={isInviting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? 'Sending...' : 'Invite'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {inviteSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <Check size={16} />
                Invitation sent successfully!
              </div>
            )}

            {/* Permission Legend */}
            <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Eye size={12} />
                <span>View: Read only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Edit3 size={12} />
                <span>Edit: Can modify</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={12} />
                <span>Admin: Full control</span>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Copy size={16} />
              Share Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`colabo.app/note/${note?._id}`}
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copySuccess
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {copySuccess ? (
                  <span className="flex items-center gap-2">
                    <Check size={16} />
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy size={16} />
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Pending Invites ({pendingInvites.length})
              </h3>
              <div className="space-y-2">
                {pendingInvites.map(invite => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Mail size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{invite.email}</p>
                        <p className="text-xs text-slate-500">
                          Can {invite.permission} · Sent {new Date(invite.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelInvite(invite.id)}
                      className="px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Collaborators */}
          {collaborators.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Collaborators ({collaborators.length})
              </h3>
              <div className="space-y-2">
                {collaborators.map(collab => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {collab.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{collab.name}</p>
                        <p className="text-xs text-slate-500">{collab.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md">
                        {collab.permission}
                      </span>
                      <button
                        onClick={() => removeCollaborator(collab.id)}
                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;