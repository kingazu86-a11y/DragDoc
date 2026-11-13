/**
 * Office Suite Master Context
 * Provides unified state management across Word, Sheets, Slides, PDF Studio,
 * and the Office Home Launcher. Manages multi-document tabs, app switching,
 * recent documents, templates, and theme settings.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createDefaultWorkbook } from '../engine/sheetModel';
import { createDefaultPdfDocument } from '../engine/pdfStudioModel';
import { createDefaultDocument } from '../engine/documentModel';
import { createDefaultPresentation } from '../engine/presentationModel';

const OfficeSuiteContext = createContext(null);

const DEFAULT_RECENT_FILES = [
  {
    id: 'rf-1',
    title: 'Executive Strategic Plan 2026.docx',
    app: 'word',
    dateModified: 'Today, 10:24 AM',
    size: '142 KB',
    isPinned: true,
    isFavorite: true,
    author: 'Senior Executive'
  },
  {
    id: 'rf-2',
    title: 'Corporate Financial Analysis 2026.xlsx',
    app: 'sheets',
    dateModified: 'Today, 09:15 AM',
    size: '88 KB',
    isPinned: true,
    isFavorite: false,
    author: 'Finance Director'
  },
  {
    id: 'rf-3',
    title: 'Q4 Executive Review.pptx',
    app: 'slides',
    dateModified: 'Yesterday, 04:45 PM',
    size: '2.4 MB',
    isPinned: false,
    isFavorite: true,
    author: 'Strategy Lead'
  },
  {
    id: 'rf-4',
    title: 'Master Services Agreement & Execution.pdf',
    app: 'pdf',
    dateModified: '2 days ago',
    size: '512 KB',
    isPinned: false,
    isFavorite: false,
    author: 'Legal Counsel'
  },
  {
    id: 'rf-5',
    title: 'Quarterly Operating Budget & Headcount.xlsx',
    app: 'sheets',
    dateModified: '3 days ago',
    size: '104 KB',
    isPinned: false,
    isFavorite: false,
    author: 'FP&A Team'
  },
  {
    id: 'rf-6',
    title: 'Product Architecture & Roadmap.pptx',
    app: 'slides',
    dateModified: 'May 12, 2026',
    size: '1.8 MB',
    isPinned: false,
    isFavorite: false,
    author: 'Principal Architect'
  }
];

export function OfficeSuiteProvider({ children }) {
  // Navigation & Active Workspace
  // 'home' | 'word' | 'sheets' | 'slides' | 'pdf'
  const [activeApp, setActiveApp] = useState('home');

  // Multi-Document Tabs
  const [openTabs, setOpenTabs] = useState([
    {
      id: 'tab-word-1',
      app: 'word',
      title: 'Executive Strategic Plan 2026.docx',
      isModified: false,
      data: null // Word manages its own document context or injects initialDoc
    },
    {
      id: 'tab-sheets-1',
      app: 'sheets',
      title: 'Corporate Financial Analysis 2026.xlsx',
      isModified: false,
      data: createDefaultWorkbook('Corporate Financial Analysis 2026.xlsx')
    },
    {
      id: 'tab-slides-1',
      app: 'slides',
      title: 'Q4 Executive Review.pptx',
      isModified: false,
      data: null // Slides manages its own presentation context
    },
    {
      id: 'tab-pdf-1',
      app: 'pdf',
      title: 'Master Services Agreement & Execution.pdf',
      isModified: false,
      data: createDefaultPdfDocument('Master Services Agreement & Execution.pdf')
    }
  ]);

  const [activeTabId, setActiveTabId] = useState(null); // When on 'home', activeTabId is null
  const [recentFiles, setRecentFiles] = useState(DEFAULT_RECENT_FILES);
  const [darkTheme, setDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Switch to an application
  const switchApp = (app) => {
    setActiveApp(app);
    if (app === 'home') {
      setActiveTabId(null);
    } else {
      // Find first matching tab or create one
      const existingTab = openTabs.find(t => t.app === app);
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        openNewDocument(app);
      }
    }
  };

  // Switch to specific tab
  const selectTab = (tabId) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tab.id);
      setActiveApp(tab.app);
    }
  };

  // Open a new document in any application
  const openNewDocument = (app, title) => {
    const defaultTitles = {
      word: 'Document.docx',
      sheets: 'Workbook.xlsx',
      slides: 'Presentation.pptx',
      pdf: 'Document.pdf'
    };

    const docTitle = title || defaultTitles[app] || 'New Document';
    const newTabId = `tab-${app}-${Date.now()}`;

    let initialData = null;
    if (app === 'sheets') initialData = createDefaultWorkbook(docTitle);
    if (app === 'pdf') initialData = createDefaultPdfDocument(docTitle);
    if (app === 'word') initialData = createDefaultDocument(docTitle);
    if (app === 'slides') initialData = createDefaultPresentation(docTitle);

    const newTab = {
      id: newTabId,
      app,
      title: docTitle,
      isModified: false,
      data: initialData
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
    setActiveApp(app);

    // Also add to recent files
    const newRecent = {
      id: `rf-${Date.now()}`,
      title: docTitle,
      app,
      dateModified: 'Just now',
      size: '12 KB',
      isPinned: false,
      isFavorite: false,
      author: 'You'
    };
    setRecentFiles(prev => [newRecent, ...prev]);
  };

  // Close a tab
  const closeTab = useCallback((tabId, e) => {
    if (e) e.stopPropagation();
    setOpenTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId) {
        if (filtered.length > 0) {
          const nextTab = filtered[filtered.length - 1];
          setActiveTabId(nextTab.id);
          setActiveApp(nextTab.app);
        } else {
          setActiveTabId(null);
          setActiveApp('home');
        }
      }
      return filtered;
    });
  }, [activeTabId]);

  // Update tab title
  const updateTabTitle = (tabId, newTitle) => {
    setOpenTabs(prev => prev.map(t => t.id === tabId ? { ...t, title: newTitle } : t));
  };

  // Update tab data
  const updateTabData = (tabId, newData) => {
    setOpenTabs(prev => prev.map(t => t.id === tabId ? { ...t, data: newData, isModified: true } : t));
  };

  // Pin / Unpin file
  const togglePinFile = (fileId) => {
    setRecentFiles(prev => prev.map(f => f.id === fileId ? { ...f, isPinned: !f.isPinned } : f));
  };

  // Star / Favorite file
  const toggleFavoriteFile = (fileId) => {
    setRecentFiles(prev => prev.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  // Delete from recent
  const deleteRecentFile = (fileId) => {
    setRecentFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Keyboard shortcut listener (Ctrl+S, Ctrl+O, Ctrl+W, Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        if (activeTabId) {
          e.preventDefault();
          closeTab(activeTabId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, closeTab]);

  return (
    <OfficeSuiteContext.Provider
      value={{
        activeApp,
        setActiveApp,
        switchApp,
        openTabs,
        activeTabId,
        selectTab,
        openNewDocument,
        closeTab,
        updateTabTitle,
        updateTabData,
        recentFiles,
        togglePinFile,
        toggleFavoriteFile,
        deleteRecentFile,
        darkTheme,
        setDarkTheme,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </OfficeSuiteContext.Provider>
  );
}

export function useOfficeSuite() {
  const context = useContext(OfficeSuiteContext);
  if (!context) {
    throw new Error('useOfficeSuite must be used within an OfficeSuiteProvider');
  }
  return context;
}
