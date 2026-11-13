/**
 * Ribbon Tab: REVIEW
 * Proofing (Spelling & Grammar), Word Count statistics, Comments, Track Changes, and Compare.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';
import {
  IconReview,
  IconTrackChanges,
  IconComments,
  IconCheck,
  IconClose
} from '../common/SvgIcons';

export function RibbonTabReview() {
  const {
    document,
    setDocument,
    setActiveDialog,
    setActiveSidebar,
    activeSidebar,
    addComment,
    selectedBlockId
  } = useDocument();

  const isTracking = document.trackedChanges?.enabled;

  const handleToggleTrackChanges = () => {
    setDocument(doc => ({
      ...doc,
      trackedChanges: {
        ...(doc.trackedChanges || {}),
        enabled: !isTracking
      }
    }));
  };

  const handleNewComment = () => {
    const text = window.prompt('Enter comment:', 'Please review this passage.');
    if (text) {
      addComment(selectedBlockId, text);
      setActiveSidebar('comments');
    }
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Proofing */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-btn-large ${activeSidebar === 'proofing' ? 'active' : ''}`}
            onClick={() => setActiveSidebar(activeSidebar === 'proofing' ? null : 'proofing')}
            title="Spelling & Grammar (F7)"
          >
            <div className="ribbon-btn-icon">
              <IconReview size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Editor / Proofing</span>
          </button>

          <button
            className="ribbon-btn-large"
            onClick={() => setActiveDialog('wordCount')}
            title="Document Word Count & Reading Time"
          >
            <div className="ribbon-btn-icon">
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#185abd' }}>123</span>
            </div>
            <span className="ribbon-btn-label">Word Count</span>
          </button>
        </div>
        <span className="ribbon-group-title">Proofing</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Comments */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={handleNewComment} title="New Comment">
            <div className="ribbon-btn-icon">
              <IconComments size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">New Comment</span>
          </button>

          <button
            className={`ribbon-btn-large ${activeSidebar === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveSidebar(activeSidebar === 'comments' ? null : 'comments')}
            title="Toggle Comments Sidebar"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Show Comments</span>
          </button>
        </div>
        <span className="ribbon-group-title">Comments</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Tracking */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-btn-large ${isTracking ? 'active' : ''}`}
            onClick={handleToggleTrackChanges}
            title="Track Changes (Insertions & Deletions)"
          >
            <div className="ribbon-btn-icon">
              <IconTrackChanges size={20} color={isTracking ? '#16a34a' : '#185abd'} />
            </div>
            <span className="ribbon-btn-label">Track Changes</span>
          </button>

          <div className="ribbon-btn-stack">
            <button
              className="ribbon-tool-btn"
              title="Accept all changes"
              onClick={() => {
                alert('All tracked changes accepted and merged into final text.');
              }}
            >
              <IconCheck size={14} color="#16a34a" />
              <span>Accept</span>
            </button>

            <button
              className="ribbon-tool-btn"
              title="Reject all changes"
              onClick={() => {
                alert('All tracked changes rejected.');
              }}
            >
              <IconClose size={14} color="#dc2626" />
              <span>Reject</span>
            </button>
          </div>
        </div>
        <span className="ribbon-group-title">Tracking</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Compare & Protect */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setActiveDialog('compare')} title="Compare Documents">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="2" y="4" width="9" height="16" rx="1" />
                <rect x="13" y="4" width="9" height="16" rx="1" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Compare</span>
          </button>
        </div>
        <span className="ribbon-group-title">Compare</span>
      </div>
    </div>
  );
}

