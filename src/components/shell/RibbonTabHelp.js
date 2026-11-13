/**
 * Ribbon Tab: HELP
 * Documentation, Keyboard shortcuts cheat sheet, AI Assistant access, and About DragDocs.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';
import { IconAiSparkle } from '../common/SvgIcons';

export function RibbonTabHelp() {
  const {
    setActiveDialog,
    setActiveSidebar
  } = useDocument();

  return (
    <div className="ribbon-tab-content">
      {/* Group: Help */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setActiveDialog('about')} title="About DragDocs Word Processor">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Help Guide</span>
          </button>

          <button className="ribbon-btn-large" onClick={() => setActiveDialog('shortcuts')} title="View Complete Keyboard Shortcuts Cheat Sheet">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="6" y1="8" x2="6.01" y2="8" strokeWidth="2" />
                <line x1="10" y1="8" x2="10.01" y2="8" strokeWidth="2" />
                <line x1="14" y1="8" x2="14.01" y2="8" strokeWidth="2" />
                <line x1="18" y1="8" x2="18.01" y2="8" strokeWidth="2" />
                <line x1="7" y1="16" x2="17" y2="16" strokeWidth="2" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Shortcuts</span>
          </button>
        </div>
        <span className="ribbon-group-title">Help</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: AI Intelligence */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-btn-large"
            onClick={() => setActiveSidebar('ai')}
            title="Open AI Writing Assistant (Rewrite, Tone, Summarize, Draft)"
          >
            <div className="ribbon-btn-icon">
              <IconAiSparkle size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">AI Assistant</span>
          </button>
        </div>
        <span className="ribbon-group-title">AI Copilot</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: About */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setActiveDialog('about')} title="System & Version Info">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
              </svg>
            </div>
            <span className="ribbon-btn-label">About</span>
          </button>
        </div>
        <span className="ribbon-group-title">System</span>
      </div>
    </div>
  );
}

