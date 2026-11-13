/**
 * Title Bar for DragSlides / DragDocs Presentation Mode
 */

import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import {
  AppLogoIcon,
  IconSave,
  IconUndo,
  IconRedo,
  IconSearch,
  IconCheck
} from '../common/SvgIcons';

export function TitleBarPresentation({ onSwitchMode }) {
  const {
    presentation,
    setPresentation,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    startSlideShow
  } = usePresentation();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(presentation.title || 'Untitled Presentation');
  const [tellMeQuery, setTellMeQuery] = useState('');
  const [tellMeOpen, setTellMeOpen] = useState(false);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== presentation.title) {
      setPresentation(pres => ({ ...pres, title: titleInput.trim() }));
    }
  };

  const handleManualSave = () => {
    localStorage.setItem('dragslides_active_pres', JSON.stringify(presentation));
  };

  return (
    <div className="dragdocs-titlebar presentation-titlebar">
      {/* Left: Brand & QAT */}
      <div className="titlebar-left">
        <div className="titlebar-brand" title="DragSlides Enterprise Presentation Suite">
          <AppLogoIcon size={20} />
          <span className="brand-name">DragSlides</span>
        </div>

        <div className="qat-separator" />

        <div className="quick-access-toolbar">
          <button className="qat-btn" title="Save" onClick={handleManualSave}>
            <IconSave size={14} />
          </button>
          <button className={`qat-btn ${!canUndo ? 'disabled' : ''}`} disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)">
            <IconUndo size={14} />
          </button>
          <button className={`qat-btn ${!canRedo ? 'disabled' : ''}`} disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Y)">
            <IconRedo size={14} />
          </button>
          <button className="qat-btn" onClick={() => startSlideShow(true)} title="Start Slideshow (F5)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          <div className="autosave-pill">
            <span className={`autosave-dot ${saveStatus}`} />
            <span className="autosave-label">
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saved'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Title & Mode Switcher */}
      <div className="titlebar-center">
        {isEditingTitle ? (
          <input
            type="text"
            className="titlebar-input"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            autoFocus
          />
        ) : (
          <div
            className="titlebar-title"
            onClick={() => {
              setTitleInput(presentation.title);
              setIsEditingTitle(true);
            }}
            title="Click to rename presentation"
          >
            <span className="title-text">{presentation.title || 'Untitled Presentation'}</span>
            <span className="title-status">- Presentation Deck</span>
          </div>
        )}

        {/* Mode Switcher Pill */}
        {onSwitchMode && (
          <button
            className="suite-mode-switch-btn"
            onClick={onSwitchMode}
            title="Switch to Word Document Editor"
          >
            Switch to Word Editor
          </button>
        )}
      </div>

      {/* Right: Tell me & Present */}
      <div className="titlebar-right">
        <div className="tell-me-container">
          <div className="tell-me-input-box" onClick={() => setTellMeOpen(true)}>
            <IconSearch size={13} color="#9ca3af" />
            <input
              type="text"
              placeholder="Tell me what you want to do..."
              value={tellMeQuery}
              onChange={(e) => setTellMeQuery(e.target.value)}
              onFocus={() => setTellMeOpen(true)}
              onBlur={() => setTimeout(() => setTellMeOpen(false), 250)}
            />
          </div>

          {tellMeOpen && (
            <div className="tell-me-dropdown">
              <div className="tell-me-header">Suggested Slide Actions</div>
              <div className="tell-me-item" onMouseDown={() => startSlideShow(true)}>
                <IconCheck size={12} color="#185abd" />
                <span>Start Fullscreen Presentation</span>
              </div>
              <div className="tell-me-item" onMouseDown={() => setTellMeOpen(false)}>
                <IconCheck size={12} color="#185abd" />
                <span>Insert Clustered Column Chart</span>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-badge" title="Active Author">
          <div className="user-avatar" style={{ backgroundColor: '#107c41' }}>PA</div>
        </div>
      </div>
    </div>
  );
}

