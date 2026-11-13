/**
 * Ribbon Tab: VIEW
 * Views (Print Layout, Read Mode, Web Layout, Draft, Outline), Show/Hide (Ruler, Gridlines, Nav Pane), Zoom, and Focus Mode.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';

export function RibbonTabView() {
  const {
    activeView,
    setActiveView,
    showRuler,
    setShowRuler,
    showGridlines,
    setShowGridlines,
    showNavigationPane,
    setShowNavigationPane,
    setZoom,
    isFullScreen,
    setIsFullScreen
  } = useDocument();

  return (
    <div className="ribbon-tab-content">
      {/* Group: Views */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-btn-large ${activeView === 'print' ? 'active' : ''}`}
            onClick={() => setActiveView('print')}
            title="Print Layout (Standard multi-page view)"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Print Layout</span>
          </button>

          <button
            className={`ribbon-btn-large ${activeView === 'read' ? 'active' : ''}`}
            onClick={() => setActiveView('read')}
            title="Read Mode (Distraction-free reading)"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Read Mode</span>
          </button>

          <button
            className={`ribbon-btn-large ${activeView === 'web' ? 'active' : ''}`}
            onClick={() => setActiveView('web')}
            title="Web Layout (Fluid continuous layout)"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Web Layout</span>
          </button>
        </div>
        <span className="ribbon-group-title">Views</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Show */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          <label className="ribbon-checkbox-item">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={(e) => setShowRuler(e.target.checked)}
            />
            <span>Ruler</span>
          </label>

          <label className="ribbon-checkbox-item">
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={(e) => setShowGridlines(e.target.checked)}
            />
            <span>Gridlines</span>
          </label>

          <label className="ribbon-checkbox-item">
            <input
              type="checkbox"
              checked={showNavigationPane}
              onChange={(e) => setShowNavigationPane(e.target.checked)}
            />
            <span>Navigation Pane</span>
          </label>
        </div>
        <span className="ribbon-group-title">Show</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Zoom */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setZoom(100)} title="Zoom to 100%">
            <div className="ribbon-btn-icon">
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#185abd' }}>100%</span>
            </div>
            <span className="ribbon-btn-label">100%</span>
          </button>

          <button className="ribbon-btn-large" onClick={() => setZoom(120)} title="Fit to Page Width">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <polyline points="4 8 2 12 4 16" />
                <polyline points="20 8 22 12 20 16" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Page Width</span>
          </button>

          <button className="ribbon-btn-large" onClick={() => setZoom(80)} title="Whole Page view">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="5" y="3" width="14" height="18" rx="2" />
              </svg>
            </div>
            <span className="ribbon-btn-label">One Page</span>
          </button>
        </div>
        <span className="ribbon-group-title">Zoom</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Window */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-btn-large ${isFullScreen ? 'active' : ''}`}
            onClick={() => setIsFullScreen(!isFullScreen)}
            title="Focus Mode / Full Screen"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Full Screen</span>
          </button>
        </div>
        <span className="ribbon-group-title">Window</span>
      </div>
    </div>
  );
}

