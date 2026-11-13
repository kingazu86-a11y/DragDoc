/**
 * Status Bar for DragSlides / DragDocs Presentation Mode
 */

import React from 'react';
import { usePresentation } from '../../context/PresentationContext';

export function StatusBarPresentation() {
  const {
    presentation,
    activeSlideIndex,
    zoom,
    setZoom,
    startSlideShow,
    presenterNotesOpen,
    setPresenterNotesOpen
  } = usePresentation();

  const totalSlides = presentation.slides?.length || 1;

  const handleZoomMinus = () => setZoom(prev => Math.max(50, prev - 10));
  const handleZoomPlus = () => setZoom(prev => Math.min(200, prev + 10));

  return (
    <div className="dragdocs-statusbar presentation-statusbar">
      <div className="statusbar-left">
        <span className="statusbar-text-item">
          Slide {activeSlideIndex + 1} of {totalSlides}
        </span>

        <div className="statusbar-separator" />

        <button
          className={`statusbar-item-btn ${presenterNotesOpen ? 'active' : ''}`}
          onClick={() => setPresenterNotesOpen(!presenterNotesOpen)}
          title="Toggle Speaker Notes Panel"
        >
          Notes
        </button>

        <div className="statusbar-separator" />

        <span className="statusbar-text-item">English (US)</span>
      </div>

      <div className="statusbar-right">
        <button
          className="statusbar-item-btn"
          title="Slide Show (F5)"
          onClick={() => startSlideShow(false)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>

        <div className="statusbar-separator" />

        <div className="zoom-slider-container">
          <button className="zoom-step-btn" onClick={handleZoomMinus}>-</button>
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-range-input"
          />
          <button className="zoom-step-btn" onClick={handleZoomPlus}>+</button>
          <button className="zoom-percentage-btn" onClick={() => setZoom(100)}>{zoom}%</button>
        </div>
      </div>
    </div>
  );
}

