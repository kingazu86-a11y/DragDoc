/**
 * Navigation Sidebar
 * Document Outline / Headings tree, Page Thumbnails, and Search Results.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { getBlockPlainText } from '../../engine/paginationEngine';
import { IconSearch, IconClose } from '../common/SvgIcons';

export function NavigationSidebar() {
  const {
    document,
    pagination,
    showNavigationPane,
    setShowNavigationPane,
    setSelectedBlockId
  } = useDocument();

  const [navTab, setNavTab] = useState('headings'); // 'headings' | 'pages' | 'search'
  const [searchQuery, setSearchQuery] = useState('');

  if (!showNavigationPane) return null;

  const headings = (document.blocks || [])
    .filter(b => b.type === 'heading')
    .map(b => ({
      id: b.id,
      level: b.level || 1,
      text: getBlockPlainText(b) || 'Untitled Heading'
    }));

  const handleHeadingClick = (id) => {
    setSelectedBlockId(id);
    const el = document.getElementById?.(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePageThumbClick = (pageNum) => {
    const el = window.document.querySelector(`[data-page-number="${pageNum}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="dragdocs-sidebar nav-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Navigation</span>
        <button
          className="sidebar-close-btn"
          onClick={() => setShowNavigationPane(false)}
          title="Close Navigation Pane"
        >
          <IconClose size={14} />
        </button>
      </div>

      {/* Search box */}
      <div className="nav-search-bar">
        <IconSearch size={13} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="nav-tab-strip">
        <button
          className={`nav-tab-btn ${navTab === 'headings' ? 'active' : ''}`}
          onClick={() => setNavTab('headings')}
        >
          Headings
        </button>
        <button
          className={`nav-tab-btn ${navTab === 'pages' ? 'active' : ''}`}
          onClick={() => setNavTab('pages')}
        >
          Pages ({pagination.totalPages || 1})
        </button>
      </div>

      <div className="sidebar-content">
        {navTab === 'headings' && (
          <div className="headings-outline-tree">
            {headings.length === 0 ? (
              <div className="sidebar-empty-state">No headings yet. Apply Heading 1-3 from Home tab to build an outline.</div>
            ) : (
              headings.map(h => (
                <div
                  key={h.id}
                  className={`outline-item level-${h.level}`}
                  onClick={() => handleHeadingClick(h.id)}
                >
                  <span className="outline-item-text">{h.text}</span>
                </div>
              ))
            )}
          </div>
        )}

        {navTab === 'pages' && (
          <div className="page-thumbnails-list">
            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map(pageNum => (
              <div
                key={pageNum}
                className="thumbnail-card"
                onClick={() => handlePageThumbClick(pageNum)}
              >
                <div className="thumbnail-paper">
                  <div className="thumb-header-line" />
                  <div className="thumb-line" style={{ width: '80%' }} />
                  <div className="thumb-line" style={{ width: '60%' }} />
                  <div className="thumb-line" style={{ width: '90%' }} />
                </div>
                <div className="thumbnail-label">Page {pageNum}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

