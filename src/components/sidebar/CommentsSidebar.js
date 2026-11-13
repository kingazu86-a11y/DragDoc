/**
 * Threaded Comments Sidebar
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { IconClose, IconCheck, IconTrash } from '../common/SvgIcons';

export function CommentsSidebar() {
  const {
    document,
    activeSidebar,
    setActiveSidebar,
    addComment,
    resolveComment,
    deleteComment,
    selectedBlockId
  } = useDocument();

  const [newCommentText, setNewCommentText] = useState('');

  if (activeSidebar !== 'comments') return null;

  const comments = document.comments || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(selectedBlockId, newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div className="dragdocs-sidebar comments-sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="sidebar-title">Comments</span>
          <span className="badge-count">{comments.length}</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setActiveSidebar(null)}
          title="Close Comments Pane"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* New comment input */}
        <form onSubmit={handleAddSubmit} className="new-comment-box">
          <textarea
            className="comment-textarea"
            placeholder="Type a new comment..."
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button type="submit" className="issue-action-btn primary" disabled={!newCommentText.trim()}>
              Post Comment
            </button>
          </div>
        </form>

        {/* Comments stream */}
        <div className="comments-stream">
          {comments.length === 0 ? (
            <div className="sidebar-empty-state">No comments in this document yet.</div>
          ) : (
            comments.map((comm) => (
              <div key={comm.id} className={`comment-card ${comm.resolved ? 'resolved' : ''}`}>
                <div className="comment-meta">
                  <div className="comment-author-badge">
                    <span className="author-name">{comm.author}</span>
                    <span className="comment-time">{comm.timestamp}</span>
                  </div>
                  <div className="comment-actions">
                    <button
                      className="comm-icon-btn"
                      title={comm.resolved ? 'Mark as Unresolved' : 'Resolve Comment'}
                      onClick={() => resolveComment(comm.id)}
                    >
                      <IconCheck size={12} color={comm.resolved ? '#16a34a' : '#6b7280'} />
                    </button>
                    <button
                      className="comm-icon-btn"
                      title="Delete Comment"
                      onClick={() => deleteComment(comm.id)}
                    >
                      <IconTrash size={12} color="#dc2626" />
                    </button>
                  </div>
                </div>

                <div className="comment-body">{comm.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

