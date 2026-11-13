/**
 * Unified Office Suite Shell
 * Persistent vertical app rail, universal multi-document tab bar,
 * seamless app switching, and unified workspace container.
 */

import React, { useState } from 'react';
import { useOfficeSuite } from '../../context/OfficeSuiteContext';
import { OfficeHomeDashboard } from '../home/OfficeHomeDashboard';
import { SheetsApp } from '../sheets/SheetsApp';
import { PdfStudioApp } from '../pdf/PdfStudioApp';
import {
  IconOfficeSuite,
  IconWordApp,
  IconSheetsApp,
  IconSlidesApp,
  IconPdfApp,
  IconPlus,
  IconClose,
  IconSearch,
  IconSettings
} from '../common/SvgIcons';

export function OfficeSuiteShell({ renderWordApp, renderSlidesApp }) {
  const {
    activeApp,
    switchApp,
    openTabs,
    activeTabId,
    selectTab,
    closeTab,
    openNewDocument,
    updateTabData,
    darkTheme,
    setDarkTheme
  } = useOfficeSuite();

  const [showNewTabMenu, setShowNewTabMenu] = useState(false);
  const [suiteSearch, setSuiteSearch] = useState('');

  const currentTab = openTabs.find(t => t.id === activeTabId);

  const getAppIcon = (app, size = 16) => {
    switch (app) {
      case 'word':
        return <IconWordApp size={size} />;
      case 'sheets':
        return <IconSheetsApp size={size} />;
      case 'slides':
        return <IconSlidesApp size={size} />;
      case 'pdf':
        return <IconPdfApp size={size} />;
      default:
        return <IconOfficeSuite size={size} />;
    }
  };

  return (
    <div className={`office-suite-shell ${darkTheme ? 'dark-theme' : ''}`}>
      {/* 1. Persistent Left App Rail */}
      <nav className="office-left-app-rail" aria-label="Office Applications Switcher">
        {/* App Switcher Top Brand */}
        <button
          className={`office-rail-btn home-btn ${activeApp === 'home' ? 'active' : ''}`}
          title="Office Home Dashboard"
          onClick={() => switchApp('home')}
        >
          <IconOfficeSuite size={22} />
          <span className="office-rail-tooltip">Home</span>
        </button>

        <div className="office-rail-divider" />

        {/* Word Processor */}
        <button
          className={`office-rail-btn word-app-btn ${activeApp === 'word' ? 'active' : ''}`}
          title="DragDocs Word Processor"
          onClick={() => switchApp('word')}
        >
          <IconWordApp size={24} />
          <span className="office-rail-tooltip">Word</span>
        </button>

        {/* Sheets Spreadsheet */}
        <button
          className={`office-rail-btn sheets-app-btn ${activeApp === 'sheets' ? 'active' : ''}`}
          title="DragSheets Spreadsheet"
          onClick={() => switchApp('sheets')}
        >
          <IconSheetsApp size={24} />
          <span className="office-rail-tooltip">Sheets</span>
        </button>

        {/* Slides Presentation */}
        <button
          className={`office-rail-btn slides-app-btn ${activeApp === 'slides' ? 'active' : ''}`}
          title="DragSlides Presentation"
          onClick={() => switchApp('slides')}
        >
          <IconSlidesApp size={24} />
          <span className="office-rail-tooltip">Slides</span>
        </button>

        {/* PDF Studio */}
        <button
          className={`office-rail-btn pdf-app-btn ${activeApp === 'pdf' ? 'active' : ''}`}
          title="DragPDF Studio"
          onClick={() => switchApp('pdf')}
        >
          <IconPdfApp size={24} />
          <span className="office-rail-tooltip">PDF Studio</span>
        </button>

        {/* Bottom Rail Controls */}
        <div className="office-rail-bottom-group">
          <button
            className="office-rail-btn settings-btn"
            title={darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            onClick={() => setDarkTheme(!darkTheme)}
          >
            <IconSettings size={18} color="#94a3b8" />
            <span className="office-rail-tooltip">Theme</span>
          </button>
        </div>
      </nav>

      {/* 2. Main Suite Content Container */}
      <div className="office-main-suite-viewport">
        {/* Universal Top Multi-Document Tab Strip */}
        <div className="office-universal-tab-strip">
          {/* Document Tabs */}
          <div className="office-tabs-scroll-area">
            {openTabs.map(tab => {
              const isActive = activeTabId === tab.id;
              return (
                <div
                  key={tab.id}
                  className={`office-doc-tab ${isActive ? 'active' : ''} ${tab.app}-tab`}
                  onClick={() => selectTab(tab.id)}
                  title={tab.title}
                >
                  <span className="office-tab-badge">
                    {getAppIcon(tab.app, 15)}
                  </span>
                  <span className="office-tab-title">{tab.title}</span>
                  <button
                    className="office-tab-close"
                    title="Close document (Ctrl+W)"
                    onClick={(e) => closeTab(tab.id, e)}
                  >
                    <IconClose size={12} color="#64748b" />
                  </button>
                </div>
              );
            })}

            {/* New Tab Button */}
            <div className="office-new-tab-wrapper">
              <button
                className="office-new-tab-btn"
                title="New Document..."
                onClick={() => setShowNewTabMenu(!showNewTabMenu)}
              >
                <IconPlus size={14} color="#64748b" />
              </button>

              {showNewTabMenu && (
                <div className="office-new-tab-menu">
                  <div className="office-new-menu-header">Create New Document</div>
                  <button
                    className="office-new-menu-item"
                    onClick={() => {
                      openNewDocument('word', 'Document.docx');
                      setShowNewTabMenu(false);
                    }}
                  >
                    <IconWordApp size={16} />
                    <span>Word Document</span>
                  </button>
                  <button
                    className="office-new-menu-item"
                    onClick={() => {
                      openNewDocument('sheets', 'Workbook.xlsx');
                      setShowNewTabMenu(false);
                    }}
                  >
                    <IconSheetsApp size={16} />
                    <span>Excel Spreadsheet</span>
                  </button>
                  <button
                    className="office-new-menu-item"
                    onClick={() => {
                      openNewDocument('slides', 'Presentation.pptx');
                      setShowNewTabMenu(false);
                    }}
                  >
                    <IconSlidesApp size={16} />
                    <span>PowerPoint Slides</span>
                  </button>
                  <button
                    className="office-new-menu-item"
                    onClick={() => {
                      openNewDocument('pdf', 'Contract.pdf');
                      setShowNewTabMenu(false);
                    }}
                  >
                    <IconPdfApp size={16} />
                    <span>PDF Document</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Strip: AutoSave Status & Universal Tell Me Search */}
          <div className="office-tab-strip-right">
            <div className="office-autosave-indicator">
              <span className="office-autosave-dot" />
              <span className="office-autosave-label">AutoSave On</span>
            </div>

            <div className="office-tell-me-search">
              <IconSearch size={13} color="#94a3b8" />
              <input
                type="text"
                placeholder="Tell me what you want to do..."
                value={suiteSearch}
                onChange={(e) => setSuiteSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. Active Application Workspace */}
        <main className="office-app-active-canvas">
          {activeApp === 'home' && (
            <OfficeHomeDashboard />
          )}

          {activeApp === 'word' && (
            renderWordApp()
          )}

          {activeApp === 'sheets' && (
            <SheetsApp
              initialWorkbook={currentTab?.app === 'sheets' ? currentTab.data : null}
              onWorkbookChange={(wb) => {
                if (currentTab?.app === 'sheets') {
                  updateTabData(currentTab.id, wb);
                }
              }}
            />
          )}

          {activeApp === 'slides' && (
            renderSlidesApp()
          )}

          {activeApp === 'pdf' && (
            <PdfStudioApp
              initialDoc={currentTab?.app === 'pdf' ? currentTab.data : null}
              onDocChange={(doc) => {
                if (currentTab?.app === 'pdf') {
                  updateTabData(currentTab.id, doc);
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}