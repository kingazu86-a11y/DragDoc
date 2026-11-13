/**
 * Professional Microsoft Word-style Title Bar & Quick Access Toolbar
 * Strict compliance with user rules: SVG icons, NO gradients, NO neumorphism.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import {
  AppLogoIcon,
  IconSave,
  IconUndo,
  IconRedo,
  IconPrint,
  IconSearch,
  IconCheck
} from '../common/SvgIcons';

export function TitleBar() {
  const {
    document,
    setDocument,
    saveStatus,
    triggerManualSave,
    undo,
    redo,
    canUndo,
    canRedo,
    setActiveDialog,
    setActiveSidebar,
    darkTheme,
    setDarkTheme,
    isFullScreen,
    setIsFullScreen
  } = useDocument();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(document.title || 'Untitled Document');
  const [tellMeQuery, setTellMeQuery] = useState('');
  const [tellMeResultsOpen, setTellMeResultsOpen] = useState(false);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== document.title) {
      setDocument(doc => ({ ...doc, title: titleInput.trim() }));
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  // Commands search index for "Tell Me"
  const searchableCommands = [
    { label: 'Insert Table', action: () => setActiveDialog('table') },
    { label: 'Export as PDF', action: () => setActiveDialog('print') },
    { label: 'Print Document', action: () => setActiveDialog('print') },
    { label: 'Word Count Statistics', action: () => setActiveDialog('wordCount') },
    { label: 'Check Spelling & Grammar', action: () => setActiveSidebar('proofing') },
    { label: 'AI Writing Assistant', action: () => setActiveSidebar('ai') },
    { label: 'Mail Merge Wizard', action: () => setActiveSidebar('mailings') },
    { label: 'Page Setup & Margins', action: () => setActiveDialog('pageSetup') },
    { label: 'Watermark Settings', action: () => setActiveDialog('watermark') },
    { label: 'Keyboard Shortcuts Guide', action: () => setActiveDialog('shortcuts') },
    { label: 'Toggle Dark Theme', action: () => setDarkTheme(!darkTheme) }
  ];

  const filteredCommands = tellMeQuery.trim()
    ? searchableCommands.filter(c => c.label.toLowerCase().includes(tellMeQuery.toLowerCase()))
    : searchableCommands.slice(0, 5);

  return (
    <div className="dragdocs-titlebar">
      {/* Left: App Logo & Quick Access Toolbar */}
      <div className="titlebar-left">
        <div className="titlebar-brand" title="DragDocs Professional Word Processor">
          <AppLogoIcon size={20} />
          <span className="brand-name">DragDocs</span>
        </div>

        <div className="qat-separator" />

        {/* Quick Access Toolbar */}
        <div className="quick-access-toolbar">
          <button
            className="qat-btn"
            title="Save (Ctrl+S)"
            onClick={triggerManualSave}
          >
            <IconSave size={14} />
          </button>

          <button
            className={`qat-btn ${!canUndo ? 'disabled' : ''}`}
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={undo}
          >
            <IconUndo size={14} />
          </button>

          <button
            className={`qat-btn ${!canRedo ? 'disabled' : ''}`}
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={redo}
          >
            <IconRedo size={14} />
          </button>

          <button
            className="qat-btn"
            title="Print (Ctrl+P)"
            onClick={() => setActiveDialog('print')}
          >
            <IconPrint size={14} />
          </button>

          {/* AutoSave Indicator */}
          <div className="autosave-pill" title="Automatic Cloud & Local Recovery Engine">
            <span className={`autosave-dot ${saveStatus}`} />
            <span className="autosave-label">
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saved'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Document Title & File Status */}
      <div className="titlebar-center">
        {isEditingTitle ? (
          <input
            type="text"
            className="titlebar-input"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
          />
        ) : (
          <div
            className="titlebar-title"
            onClick={() => {
              setTitleInput(document.title);
              setIsEditingTitle(true);
            }}
            title="Click to rename document"
          >
            <span className="title-text">{document.title || 'Untitled Document'}</span>
            <span className="title-status">- Saved to this device</span>
          </div>
        )}

        {/* Mode Switcher Pill */}
        {window.__toggleAppMode && (
          <button
            className="suite-mode-switch-btn"
            onClick={window.__toggleAppMode}
            title="Switch to Presentation / Slides Editor"
          >
            Switch to Slides Editor
          </button>
        )}
      </div>

      {/* Right: Search / Tell Me & Window Controls */}
      <div className="titlebar-right">
        {/* Tell Me Search */}
        <div className="tell-me-container">
          <div className="tell-me-input-box" onClick={() => setTellMeResultsOpen(true)}>
            <IconSearch size={13} color="#9ca3af" />
            <input
              type="text"
              placeholder="Tell me what you want to do..."
              value={tellMeQuery}
              onChange={(e) => {
                setTellMeQuery(e.target.value);
                setTellMeResultsOpen(true);
              }}
              onFocus={() => setTellMeResultsOpen(true)}
              onBlur={() => setTimeout(() => setTellMeResultsOpen(false), 250)}
            />
          </div>

          {tellMeResultsOpen && (
            <div className="tell-me-dropdown">
              <div className="tell-me-header">Suggested Actions</div>
              {filteredCommands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="tell-me-item"
                  onMouseDown={() => {
                    cmd.action();
                    setTellMeResultsOpen(false);
                  }}
                >
                  <IconCheck size={12} color="#185abd" />
                  <span>{cmd.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          className="titlebar-theme-toggle"
          title="Toggle Dark/Light Theme"
          onClick={() => setDarkTheme(!darkTheme)}
        >
          {darkTheme ? 'Light' : 'Dark'}
        </button>

        {/* User Profile Badge */}
        <div className="user-profile-badge" title="Active Author: Eleanor Vance">
          <div className="user-avatar">EV</div>
        </div>

        {/* Window controls */}
        <div className="window-controls">
          <button className="win-btn" title="Full Screen" onClick={() => setIsFullScreen(!isFullScreen)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

