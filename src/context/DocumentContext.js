/**
 * Central State Store & Context for DragDocs Word Processor
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  createDefaultDocument
} from '../engine/documentModel';
import { paginateDocument } from '../engine/paginationEngine';
import { HistoryEngine } from '../engine/historyEngine';
import { AutoSaveEngine } from '../engine/autosaveEngine';
import { DOCUMENT_TEMPLATES } from '../engine/templates';
import { exportToDocxBlob, downloadBlob } from '../engine/docxExporter';
import { importFromDocxBuffer } from '../engine/docxImporter';
import { exportDocumentToPdf } from '../engine/pdfExporter';

const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  // Try loading autosaved draft or fall back to Executive Report / Blank
  const [document, setDocumentState] = useState(() => {
    const saved = AutoSaveEngine.loadCurrent();
    if (saved && saved.blocks && saved.blocks.length > 0) {
      return saved;
    }
    const defaultTemplate = DOCUMENT_TEMPLATES.find(t => t.id === 'business_report') || DOCUMENT_TEMPLATES[0];
    return defaultTemplate.create();
  });

  // History Manager
  const historyRef = useRef(new HistoryEngine(document));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // AutoSave and dirty tracking
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const autoSaveTimerRef = useRef(null);

  // UI state
  const [activeTab, setActiveTab] = useState('home');
  const [isBackstageOpen, setIsBackstageOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState(null);
  const [activeSidebar, setActiveSidebar] = useState(null); // 'nav' | 'comments' | 'trackChanges' | 'ai' | 'findReplace' | 'proofing' | 'mailings'
  const [activeView, setActiveView] = useState('print'); // 'print' | 'read' | 'web' | 'draft' | 'outline'
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showNavigationPane, setShowNavigationPane] = useState(false);
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Selection & Formatting state
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    doubleUnderline: false,
    strikethrough: false,
    superscript: false,
    subscript: false,
    fontSize: 11,
    fontFamily: 'Calibri, sans-serif',
    fontColor: '#1f2937',
    highlight: null,
    align: 'left',
    lineSpacing: 1.15,
    listType: 'none',
    dir: 'ltr'
  });

  // Drawing tools
  const [drawingMode, setDrawingMode] = useState('none'); // 'none' | 'pen' | 'pencil' | 'highlighter' | 'eraser'
  const [drawingColor, setDrawingColor] = useState('#185abd');
  const [drawingStrokeWidth, setDrawingStrokeWidth] = useState(3);
  const [drawingsByPage, setDrawingsByPage] = useState({});

  // Dynamic Pagination layout cache
  const paginationResult = useMemo(() => {
    return paginateDocument(document);
  }, [document]);

  // Sync undo/redo availability
  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  // Update document with history recording and auto-save
  const updateDocument = useCallback((updater, recordHistory = true) => {
    setDocumentState(prevDoc => {
      const nextDoc = typeof updater === 'function' ? updater(prevDoc) : updater;
      if (recordHistory) {
        historyRef.current.push(nextDoc);
        updateHistoryFlags();
      }

      setSaveStatus('unsaved');
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        AutoSaveEngine.saveCurrent(nextDoc);
        AutoSaveEngine.addToRecents(nextDoc);
        setTimeout(() => setSaveStatus('saved'), 400);
      }, 1200);

      return nextDoc;
    });
  }, [updateHistoryFlags]);

  // Undo action
  const handleUndo = useCallback(() => {
    const prevState = historyRef.current.undo();
    if (prevState) {
      setDocumentState(prevState);
      updateHistoryFlags();
      AutoSaveEngine.saveCurrent(prevState);
      setSaveStatus('saved');
    }
  }, [updateHistoryFlags]);

  // Redo action
  const handleRedo = useCallback(() => {
    const nextState = historyRef.current.redo();
    if (nextState) {
      setDocumentState(nextState);
      updateHistoryFlags();
      AutoSaveEngine.saveCurrent(nextState);
      setSaveStatus('saved');
    }
  }, [updateHistoryFlags]);

  // Block modifications
  const updateBlock = useCallback((blockId, partial) => {
    updateDocument(doc => {
      const newBlocks = (doc.blocks || []).map(b => {
        if (b.id === blockId) {
          return { ...b, ...partial };
        }
        return b;
      });
      return { ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  }, [updateDocument]);

  const insertBlock = useCallback((newBlock, afterBlockId = null) => {
    updateDocument(doc => {
      const blocks = [...(doc.blocks || [])];
      if (!afterBlockId) {
        blocks.push(newBlock);
      } else {
        const idx = blocks.findIndex(b => b.id === afterBlockId);
        if (idx >= 0) {
          blocks.splice(idx + 1, 0, newBlock);
        } else {
          blocks.push(newBlock);
        }
      }
      return { ...doc, blocks, updatedAt: new Date().toISOString() };
    });
  }, [updateDocument]);

  const deleteBlock = useCallback((blockId) => {
    updateDocument(doc => {
      const blocks = (doc.blocks || []).filter(b => b.id !== blockId);
      return { ...doc, blocks: blocks.length > 0 ? blocks : [createDefaultDocument().blocks[0]], updatedAt: new Date().toISOString() };
    });
  }, [updateDocument]);

  // Apply formatting to selection or target block
  const applyFormatting = useCallback((key, value) => {
    setFormatState(prev => ({ ...prev, [key]: value }));

    if (!selectedBlockId) return;

    updateDocument(doc => {
      const newBlocks = (doc.blocks || []).map(b => {
        if (b.id !== selectedBlockId) return b;

        // Block-level properties
        if (['align', 'lineSpacing', 'spacingBefore', 'spacingAfter', 'indentLeft', 'listType', 'dir'].includes(key)) {
          return { ...b, [key]: value };
        }

        // Inline run properties
        const newRuns = (b.textRuns || []).map(r => {
          if (!selectedRunId || r.id === selectedRunId) {
            return { ...r, [key]: value };
          }
          return r;
        });

        return { ...b, textRuns: newRuns };
      });
      return { ...doc, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  }, [selectedBlockId, selectedRunId, updateDocument]);

  // Apply paragraph style preset (Heading 1-9, Title, etc.)
  const applyStyle = useCallback((styleName) => {
    if (!selectedBlockId) return;
    updateDocument(doc => {
      const newBlocks = (doc.blocks || []).map(b => {
        if (b.id !== selectedBlockId) return b;
        return {
          ...b,
          type: styleName.startsWith('heading') ? 'heading' : 'paragraph',
          style: styleName,
          level: styleName.startsWith('heading') ? parseInt(styleName.replace('heading', ''), 10) : undefined
        };
      });
      return { ...doc, blocks: newBlocks };
    });
  }, [selectedBlockId, updateDocument]);

  // Load a template
  const loadTemplate = useCallback((templateId) => {
    const tmpl = DOCUMENT_TEMPLATES.find(t => t.id === templateId) || DOCUMENT_TEMPLATES[0];
    const newDoc = tmpl.create();
    historyRef.current = new HistoryEngine(newDoc);
    updateHistoryFlags();
    setDocumentState(newDoc);
    AutoSaveEngine.saveCurrent(newDoc);
    AutoSaveEngine.addToRecents(newDoc);
    setIsBackstageOpen(false);
  }, [updateHistoryFlags]);

  // Export DOCX
  const exportDocx = useCallback(async () => {
    try {
      const blob = await exportToDocxBlob(document);
      const filename = `${document.title || 'Document'}.docx`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error('Failed to export DOCX', err);
      alert('DOCX export error: ' + err.message);
    }
  }, [document]);

  // Import DOCX
  const importDocx = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const importedDoc = await importFromDocxBuffer(arrayBuffer, file.name);
      historyRef.current = new HistoryEngine(importedDoc);
      updateHistoryFlags();
      setDocumentState(importedDoc);
      AutoSaveEngine.saveCurrent(importedDoc);
      AutoSaveEngine.addToRecents(importedDoc);
      setIsBackstageOpen(false);
    } catch (err) {
      console.error('Failed to import DOCX', err);
      alert('Could not parse DOCX: ' + err.message);
    }
  }, [updateHistoryFlags]);

  // Export PDF
  const exportPdf = useCallback(async () => {
    try {
      await exportDocumentToPdf(document.title);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('PDF export error: ' + err.message);
    }
  }, [document.title]);

  // Save manual trigger
  const triggerManualSave = useCallback(() => {
    setSaveStatus('saving');
    AutoSaveEngine.saveCurrent(document);
    AutoSaveEngine.createVersionSnapshot(document, 'Manual Save');
    AutoSaveEngine.addToRecents(document);
    setTimeout(() => setSaveStatus('saved'), 350);
  }, [document]);

  // Document comments
  const addComment = useCallback((blockId, text) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      blockId,
      author: document.author || 'Reviewer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false,
      replies: []
    };
    updateDocument(doc => ({
      ...doc,
      comments: [...(doc.comments || []), newComment]
    }));
  }, [document.author, updateDocument]);

  const resolveComment = useCallback((commentId) => {
    updateDocument(doc => ({
      ...doc,
      comments: (doc.comments || []).map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c)
    }));
  }, [updateDocument]);

  const deleteComment = useCallback((commentId) => {
    updateDocument(doc => ({
      ...doc,
      comments: (doc.comments || []).filter(c => c.id !== commentId)
    }));
  }, [updateDocument]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            triggerManualSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'b':
            e.preventDefault();
            applyFormatting('bold', !formatState.bold);
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic', !formatState.italic);
            break;
          case 'u':
            e.preventDefault();
            applyFormatting('underline', !formatState.underline);
            break;
          case 'p':
            e.preventDefault();
            setActiveDialog('print');
            break;
          case 'f':
            e.preventDefault();
            setActiveSidebar('findReplace');
            break;
          default:
            break;
        }
      } else if (e.key === 'F7') {
        e.preventDefault();
        setActiveSidebar('proofing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerManualSave, handleUndo, handleRedo, applyFormatting, formatState]);

  const value = {
    document,
    setDocument: updateDocument,
    pagination: paginationResult,
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
    saveStatus,
    triggerManualSave,

    // UI Navigation
    activeTab,
    setActiveTab,
    isBackstageOpen,
    setIsBackstageOpen,
    activeDialog,
    setActiveDialog,
    activeSidebar,
    setActiveSidebar,
    activeView,
    setActiveView,
    zoom,
    setZoom,
    showRuler,
    setShowRuler,
    showGridlines,
    setShowGridlines,
    showNavigationPane,
    setShowNavigationPane,
    showFormattingMarks,
    setShowFormattingMarks,
    darkTheme,
    setDarkTheme,
    isFullScreen,
    setIsFullScreen,

    // Selection & Formatting
    selectedBlockId,
    setSelectedBlockId,
    selectedRunId,
    setSelectedRunId,
    formatState,
    applyFormatting,
    applyStyle,

    // Block operations
    updateBlock,
    insertBlock,
    deleteBlock,

    // Drawing
    drawingMode,
    setDrawingMode,
    drawingColor,
    setDrawingColor,
    drawingStrokeWidth,
    setDrawingStrokeWidth,
    drawingsByPage,
    setDrawingsByPage,

    // Templates & Import / Export
    loadTemplate,
    exportDocx,
    importDocx,
    exportPdf,

    // Comments & Review
    addComment,
    resolveComment,
    deleteComment
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(DocumentContext);
  if (!ctx) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return ctx;
}

