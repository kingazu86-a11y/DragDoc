/**
 * Professional Microsoft Word-style Status Bar
 * Displays Page count, Word count, Proofing status, Language, View switchers, and Zoom Slider.
 */

import React, { useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { calculateDocumentStats } from '../../engine/reviewEngine';
import { IconCheck } from '../common/SvgIcons';

export function StatusBar() {
  const {
    document,
    pagination,
    zoom,
    setZoom,
    activeView,
    setActiveView,
    setActiveDialog,
    setActiveSidebar
  } = useDocument();

  const stats = useMemo(() => {
    return calculateDocumentStats(document, pagination.totalPages || 1);
  }, [document, pagination.totalPages]);

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value));
  };

  const handleZoomMinus = () => {
    setZoom(prev => Math.max(50, prev - 10));
  };

  const handleZoomPlus = () => {
    setZoom(prev => Math.min(200, prev + 10));
  };

  return (
    <div className="dragdocs-statusbar">
      {/* Left side: Page, Words, Proofing, Language */}
      <div className="statusbar-left">
        <button
          className="statusbar-item-btn"
          title="Click to view Navigation / Go To Page"
          onClick={() => setActiveSidebar('nav')}
        >
          <span>Page 1 of {pagination.totalPages || 1}</span>
        </button>

        <div className="statusbar-separator" />

        <button
          className="statusbar-item-btn"
          title="Click to view full Document Word Count & Statistics"
          onClick={() => setActiveDialog('wordCount')}
        >
          <span>{stats.words} words</span>
        </button>

        <div className="statusbar-separator" />

        <button
          className="statusbar-item-btn"
          title="Spelling and Grammar Check"
          onClick={() => setActiveSidebar('proofing')}
        >
          <IconCheck size={12} color="#16a34a" />
          <span style={{ marginLeft: '4px' }}>Proofing: Ready</span>
        </button>

        <div className="statusbar-separator" />

        <div className="statusbar-text-item" title="Document Proofing Language">
          <span>English (US)</span>
        </div>
      </div>

      {/* Right side: View switchers & Zoom slider */}
      <div className="statusbar-right">
        {/* View mode shortcuts */}
        <div className="view-mode-shortcuts">
          <button
            className={`view-mode-btn ${activeView === 'read' ? 'active' : ''}`}
            title="Read Mode"
            onClick={() => setActiveView('read')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </button>

          <button
            className={`view-mode-btn ${activeView === 'print' ? 'active' : ''}`}
            title="Print Layout"
            onClick={() => setActiveView('print')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
            </svg>
          </button>

          <button
            className={`view-mode-btn ${activeView === 'web' ? 'active' : ''}`}
            title="Web Layout"
            onClick={() => setActiveView('web')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        </div>

        <div className="statusbar-separator" />

        {/* Zoom controls */}
        <div className="zoom-slider-container">
          <button className="zoom-step-btn" onClick={handleZoomMinus} title="Zoom Out (-10%)">
            -
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={handleZoomChange}
            className="zoom-range-input"
            title={`Zoom: ${zoom}%`}
          />

          <button className="zoom-step-btn" onClick={handleZoomPlus} title="Zoom In (+10%)">
            +
          </button>

          <button
            className="zoom-percentage-btn"
            onClick={() => setZoom(100)}
            title="Click to reset zoom to 100%"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </div>
  );
}

