/**
 * Presentation Context & Central State Store for DragSlides / DragDocs
 * Manages slides, canvas objects, animations, transitions, spreadsheet data editor, and slideshow playback.
 */

import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  createDefaultPresentation,
  createDefaultSlide,
  generateSlideElementId
} from '../engine/presentationModel';
import { HistoryEngine } from '../engine/historyEngine';

const PresentationContext = createContext(null);

const STORAGE_KEY_PRESENTATION = 'dragslides_active_pres';

export function PresentationProvider({ children }) {
  // Load autosaved presentation or create default
  const [presentation, setPresentationState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRESENTATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slides && parsed.slides.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load presentation from storage', e);
    }
    return createDefaultPresentation();
  });

  // History Manager
  const historyRef = useRef(new HistoryEngine(presentation));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Active slide & selection
  const [activeSlideId, setActiveSlideId] = useState(presentation.slides[0]?.id || '');
  const [selectedSlideIds, setSelectedSlideIds] = useState([presentation.slides[0]?.id || '']);
  const [selectedElementIds, setSelectedElementIds] = useState([]);

  // UI Panels & Canvas controls
  const [activeRibbonTab, setActiveRibbonTab] = useState('home');
  const [activeInspectorTab, setActiveInspectorTab] = useState('format'); // 'format' | 'animation' | 'transition' | 'layers'
  const [showRuler, setShowRuler] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [showGridlines, setShowGridlines] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Full-screen Slide Show Mode
  const [isSlideShow, setIsSlideShow] = useState(false);
  const [slideShowIndex, setSlideShowIndex] = useState(0);
  const [slideShowLaser, setSlideShowLaser] = useState(false);
  const [slideShowDrawTool, setSlideShowDrawTool] = useState('none'); // 'none' | 'pen' | 'highlighter' | 'eraser'
  const [blackScreen, setBlackScreen] = useState(false);
  const [whiteScreen, setWhiteScreen] = useState(false);
  const [presenterNotesOpen, setPresenterNotesOpen] = useState(false);

  // Chart Data Spreadsheet Modal
  const [editingChartElementId, setEditingChartElementId] = useState(null);

  // Save status
  const [saveStatus, setSaveStatus] = useState('saved');
  const autoSaveTimerRef = useRef(null);

  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  const updatePresentation = useCallback((updater, recordHistory = true) => {
    setPresentationState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (recordHistory) {
        historyRef.current.push(next);
        updateHistoryFlags();
      }

      setSaveStatus('unsaved');
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        setSaveStatus('saving');
        try {
          localStorage.setItem(STORAGE_KEY_PRESENTATION, JSON.stringify(next));
        } catch (e) {
          console.warn('Storage limit', e);
        }
        setTimeout(() => setSaveStatus('saved'), 350);
      }, 1000);

      return next;
    });
  }, [updateHistoryFlags]);

  // Undo / Redo
  const undo = useCallback(() => {
    const prev = historyRef.current.undo();
    if (prev) {
      setPresentationState(prev);
      updateHistoryFlags();
    }
  }, [updateHistoryFlags]);

  const redo = useCallback(() => {
    const next = historyRef.current.redo();
    if (next) {
      setPresentationState(next);
      updateHistoryFlags();
    }
  }, [updateHistoryFlags]);

  // Active slide object
  const activeSlideIndex = useMemo(() => {
    const idx = presentation.slides.findIndex(s => s.id === activeSlideId);
    return idx >= 0 ? idx : 0;
  }, [presentation.slides, activeSlideId]);

  const activeSlide = useMemo(() => {
    return presentation.slides[activeSlideIndex] || presentation.slides[0];
  }, [presentation.slides, activeSlideIndex]);

  // Selected elements array
  const selectedElements = useMemo(() => {
    if (!activeSlide?.elements) return [];
    return activeSlide.elements.filter(el => selectedElementIds.includes(el.id));
  }, [activeSlide, selectedElementIds]);

  // --- SLIDE OPERATIONS ---

  const selectSlide = useCallback((slideId, isMulti = false, isRange = false) => {
    setActiveSlideId(slideId);
    setSelectedElementIds([]); // clear element selection when switching slide

    if (!isMulti && !isRange) {
      setSelectedSlideIds([slideId]);
      return;
    }

    if (isMulti) {
      setSelectedSlideIds(prev =>
        prev.includes(slideId) ? (prev.length > 1 ? prev.filter(id => id !== slideId) : prev) : [...prev, slideId]
      );
    }
  }, []);

  const addSlide = useCallback((layout = 'titleAndContent', afterSlideId = null) => {
    const newSlide = createDefaultSlide(`Slide ${presentation.slides.length + 1}`, layout);

    updatePresentation(pres => {
      const slides = [...pres.slides];
      const targetId = afterSlideId || activeSlideId;
      const idx = slides.findIndex(s => s.id === targetId);
      if (idx >= 0) {
        slides.splice(idx + 1, 0, newSlide);
      } else {
        slides.push(newSlide);
      }
      return { ...pres, slides };
    });

    setActiveSlideId(newSlide.id);
    setSelectedSlideIds([newSlide.id]);
  }, [activeSlideId, presentation.slides.length, updatePresentation]);

  const duplicateSlide = useCallback((slideId) => {
    const targetId = slideId || activeSlideId;
    const targetSlide = presentation.slides.find(s => s.id === targetId);
    if (!targetSlide) return;

    const cloned = JSON.parse(JSON.stringify(targetSlide));
    cloned.id = `sld_${Date.now()}`;
    cloned.title = `${targetSlide.title} (Copy)`;
    cloned.elements = (cloned.elements || []).map(el => ({
      ...el,
      id: generateSlideElementId('el')
    }));

    updatePresentation(pres => {
      const slides = [...pres.slides];
      const idx = slides.findIndex(s => s.id === targetId);
      slides.splice(idx + 1, 0, cloned);
      return { ...pres, slides };
    });

    setActiveSlideId(cloned.id);
    setSelectedSlideIds([cloned.id]);
  }, [activeSlideId, presentation.slides, updatePresentation]);

  const deleteSlide = useCallback((slideId) => {
    if (presentation.slides.length <= 1) return; // Keep at least one slide

    const targetId = slideId || activeSlideId;
    const newSlides = presentation.slides.filter(s => s.id !== targetId);
    const newActive = newSlides[Math.max(0, activeSlideIndex - 1)] || newSlides[0];

    updatePresentation(pres => ({
      ...pres,
      slides: newSlides
    }));

    setActiveSlideId(newActive.id);
    setSelectedSlideIds([newActive.id]);
  }, [activeSlideId, activeSlideIndex, presentation.slides, updatePresentation]);

  const reorderSlides = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;
    updatePresentation(pres => {
      const slides = [...pres.slides];
      const [removed] = slides.splice(sourceIndex, 1);
      slides.splice(targetIndex, 0, removed);
      return { ...pres, slides };
    });
  }, [updatePresentation]);

  const toggleHideSlide = useCallback((slideId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => s.id === slideId ? { ...s, hidden: !s.hidden } : s)
    }));
  }, [updatePresentation]);

  const setSlideBackground = useCallback((slideId, background) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => s.id === slideId ? { ...s, background } : s)
    }));
  }, [updatePresentation]);

  const setSlideTransition = useCallback((slideId, transition) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => s.id === slideId ? { ...s, transition } : s)
    }));
  }, [updatePresentation]);

  const applyTransitionToAll = useCallback((transition) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => ({ ...s, transition }))
    }));
  }, [updatePresentation]);

  // --- ELEMENT OPERATIONS ---

  const addElement = useCallback((element) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        return {
          ...s,
          elements: [...(s.elements || []), element]
        };
      })
    }));
    setSelectedElementIds([element.id]);
  }, [activeSlideId, updatePresentation]);

  const updateElement = useCallback((elementId, partial) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        return {
          ...s,
          elements: (s.elements || []).map(el => el.id === elementId ? { ...el, ...partial } : el)
        };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  const updateMultipleElements = useCallback((elementIds, partial) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        return {
          ...s,
          elements: (s.elements || []).map(el => elementIds.includes(el.id) ? { ...el, ...partial } : el)
        };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  const deleteElement = useCallback((elementId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        return {
          ...s,
          elements: (s.elements || []).filter(el => el.id !== elementId)
        };
      })
    }));
    setSelectedElementIds(prev => prev.filter(id => id !== elementId));
  }, [activeSlideId, updatePresentation]);

  const deleteSelectedElements = useCallback(() => {
    if (selectedElementIds.length === 0) return;
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        return {
          ...s,
          elements: (s.elements || []).filter(el => !selectedElementIds.includes(el.id))
        };
      })
    }));
    setSelectedElementIds([]);
  }, [activeSlideId, selectedElementIds, updatePresentation]);

  const bringForward = useCallback((elementId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        const elements = [...(s.elements || [])];
        const idx = elements.findIndex(el => el.id === elementId);
        if (idx < elements.length - 1) {
          const temp = elements[idx];
          elements[idx] = elements[idx + 1];
          elements[idx + 1] = temp;
        }
        return { ...s, elements };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  const sendBackward = useCallback((elementId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        const elements = [...(s.elements || [])];
        const idx = elements.findIndex(el => el.id === elementId);
        if (idx > 0) {
          const temp = elements[idx];
          elements[idx] = elements[idx - 1];
          elements[idx - 1] = temp;
        }
        return { ...s, elements };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  const bringToFront = useCallback((elementId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        const elements = (s.elements || []).filter(el => el.id !== elementId);
        const target = (s.elements || []).find(el => el.id === elementId);
        if (target) elements.push(target);
        return { ...s, elements };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  const sendToBack = useCallback((elementId) => {
    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        const elements = (s.elements || []).filter(el => el.id !== elementId);
        const target = (s.elements || []).find(el => el.id === elementId);
        if (target) elements.unshift(target);
        return { ...s, elements };
      })
    }));
  }, [activeSlideId, updatePresentation]);

  // Align elements
  const alignElements = useCallback((alignment) => {
    if (selectedElementIds.length <= 1) return;

    updatePresentation(pres => ({
      ...pres,
      slides: pres.slides.map(s => {
        if (s.id !== activeSlideId) return s;
        const targets = (s.elements || []).filter(el => selectedElementIds.includes(el.id));
        if (targets.length <= 1) return s;

        let referenceVal = 0;
        if (alignment === 'left') referenceVal = Math.min(...targets.map(el => el.x));
        if (alignment === 'right') referenceVal = Math.max(...targets.map(el => el.x + el.width));
        if (alignment === 'top') referenceVal = Math.min(...targets.map(el => el.y));
        if (alignment === 'bottom') referenceVal = Math.max(...targets.map(el => el.y + el.height));
        if (alignment === 'center') {
          const minX = Math.min(...targets.map(el => el.x));
          const maxX = Math.max(...targets.map(el => el.x + el.width));
          referenceVal = (minX + maxX) / 2;
        }

        const newElements = (s.elements || []).map(el => {
          if (!selectedElementIds.includes(el.id)) return el;
          if (alignment === 'left') return { ...el, x: referenceVal };
          if (alignment === 'right') return { ...el, x: referenceVal - el.width };
          if (alignment === 'top') return { ...el, y: referenceVal };
          if (alignment === 'bottom') return { ...el, y: referenceVal - el.height };
          if (alignment === 'center') return { ...el, x: referenceVal - el.width / 2 };
          return el;
        });

        return { ...s, elements: newElements };
      })
    }));
  }, [activeSlideId, selectedElementIds, updatePresentation]);

  // --- SLIDESHOW PLAYER ---

  const startSlideShow = useCallback((fromBeginning = true) => {
    const startIndex = fromBeginning ? 0 : activeSlideIndex;
    setSlideShowIndex(startIndex);
    setIsSlideShow(true);
    setBlackScreen(false);
    setWhiteScreen(false);
  }, [activeSlideIndex]);

  const exitSlideShow = useCallback(() => {
    setIsSlideShow(false);
    setBlackScreen(false);
    setWhiteScreen(false);
  }, []);

  const nextSlide = useCallback(() => {
    setSlideShowIndex(prev => {
      const visibleSlides = presentation.slides.filter(s => !s.hidden);
      if (prev < visibleSlides.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [presentation.slides]);

  const prevSlide = useCallback(() => {
    setSlideShowIndex(prev => Math.max(0, prev - 1));
  }, []);

  // Keyboard navigation during slideshow & editing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSlideShow) {
        if (e.key === 'Escape') {
          exitSlideShow();
        } else if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'b' || e.key === 'B') {
          setBlackScreen(prev => !prev);
        } else if (e.key === 'w' || e.key === 'W') {
          setWhiteScreen(prev => !prev);
        }
        return;
      }

      // Normal edit mode shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // If not editing inside input or contenteditable
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isContentEditable = document.activeElement?.isContentEditable;
        if (activeTag !== 'input' && activeTag !== 'textarea' && !isContentEditable) {
          deleteSelectedElements();
        }
      } else if (e.key === 'F5') {
        e.preventDefault();
        startSlideShow(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideShow, exitSlideShow, nextSlide, prevSlide, undo, redo, deleteSelectedElements, startSlideShow]);

  const value = {
    presentation,
    setPresentation: updatePresentation,
    activeSlide,
    activeSlideId,
    activeSlideIndex,
    selectedSlideIds,
    selectSlide,
    selectedElementIds,
    setSelectedElementIds,
    selectedElements,

    // Slide Operations
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    toggleHideSlide,
    setSlideBackground,
    setSlideTransition,
    applyTransitionToAll,

    // Element Operations
    addElement,
    updateElement,
    updateMultipleElements,
    deleteElement,
    deleteSelectedElements,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    alignElements,

    // Canvas UI
    activeRibbonTab,
    setActiveRibbonTab,
    activeInspectorTab,
    setActiveInspectorTab,
    showRuler,
    setShowRuler,
    showGuides,
    setShowGuides,
    showGridlines,
    setShowGridlines,
    snapToGrid,
    setSnapToGrid,
    zoom,
    setZoom,

    // Slide Show
    isSlideShow,
    slideShowIndex,
    startSlideShow,
    exitSlideShow,
    nextSlide,
    prevSlide,
    slideShowLaser,
    setSlideShowLaser,
    slideShowDrawTool,
    setSlideShowDrawTool,
    blackScreen,
    setBlackScreen,
    whiteScreen,
    setWhiteScreen,
    presenterNotesOpen,
    setPresenterNotesOpen,

    // Chart Data Editor
    editingChartElementId,
    setEditingChartElementId,

    // Undo / Redo / Save
    canUndo,
    canRedo,
    undo,
    redo,
    saveStatus
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return ctx;
}

