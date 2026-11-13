/**
 * Left Slide Navigation Panel for DragSlides / DragDocs
 * Vertical thumbnail list, live rendering, reordering, duplicate/delete, layout picker, and context menu.
 */

import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';

export function SlideNavigationPanel() {
  const {
    presentation,
    activeSlideId,
    selectedSlideIds,
    selectSlide,
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    toggleHideSlide,
    setActiveInspectorTab
  } = usePresentation();

  const [contextMenu, setContextMenu] = useState(null); // { x, y, slideId }
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const slides = presentation.slides || [];

  const handleContextMenu = (e, slideId) => {
    e.preventDefault();
    selectSlide(slideId);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      slideId
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSlides(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="slide-navigation-panel" onClick={() => setContextMenu(null)}>
      {/* Top action bar: + New Slide */}
      <div className="slide-nav-toolbar">
        <div className="ribbon-picker-wrapper" style={{ width: '100%' }}>
          <button
            className="new-slide-btn"
            onClick={(e) => {
              e.stopPropagation();
              setLayoutPickerOpen(!layoutPickerOpen);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Slide</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {layoutPickerOpen && (
            <div className="slide-layout-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="layout-picker-header">Office Theme Layouts</div>
              <div className="layout-picker-grid">
                {[
                  { id: 'title', label: 'Title Slide' },
                  { id: 'titleAndContent', label: 'Title and Content' },
                  { id: 'sectionHeader', label: 'Section Header' },
                  { id: 'twoContent', label: 'Two Content' },
                  { id: 'blank', label: 'Blank' }
                ].map(layout => (
                  <div
                    key={layout.id}
                    className="layout-card-option"
                    onClick={() => {
                      addSlide(layout.id);
                      setLayoutPickerOpen(false);
                    }}
                  >
                    <div className="layout-card-preview" />
                    <span className="layout-card-label">{layout.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Slide Thumbnails Scroll */}
      <div className="slide-thumbnails-scroll">
        {slides.map((slide, idx) => {
          const isActive = slide.id === activeSlideId;
          const isSelected = selectedSlideIds.includes(slide.id);

          return (
            <div
              key={slide.id}
              className={`slide-thumb-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${slide.hidden ? 'hidden-slide' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={(e) => selectSlide(slide.id, e.ctrlKey || e.metaKey, e.shiftKey)}
              onContextMenu={(e) => handleContextMenu(e, slide.id)}
            >
              {/* Slide Number */}
              <div className="slide-thumb-number">
                {slide.hidden ? (
                  <span title="Slide is hidden from presentation">/ {idx + 1}</span>
                ) : (
                  idx + 1
                )}
              </div>

              {/* Slide Card Miniature */}
              <div
                className="slide-thumb-canvas"
                style={{
                  backgroundColor: slide.background?.color || '#ffffff'
                }}
              >
                {/* Simplified vector representation of slide elements */}
                <div className="thumb-elements-container">
                  {(slide.elements || []).map((el, elIdx) => {
                    if (el.hidden) return null;
                    const scaleX = 140 / 960;
                    const scaleY = 79 / 540;

                    return (
                      <div
                        key={el.id || elIdx}
                        className={`mini-el mini-${el.type}`}
                        style={{
                          left: `${el.x * scaleX}px`,
                          top: `${el.y * scaleY}px`,
                          width: `${Math.max(4, el.width * scaleX)}px`,
                          height: `${Math.max(3, el.height * scaleY)}px`,
                          backgroundColor: el.type === 'shape' ? (el.fill || '#185abd') : el.type === 'chart' ? '#93c5fd' : el.type === 'table' ? '#cbd5e1' : '#1e293b'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Context Menu */}
      {contextMenu && (
        <div
          className="slide-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={() => { addSlide(); setContextMenu(null); }}>
            New Slide
          </div>
          <div className="context-menu-item" onClick={() => { duplicateSlide(contextMenu.slideId); setContextMenu(null); }}>
            Duplicate Slide
          </div>
          <div className="context-menu-item" onClick={() => { toggleHideSlide(contextMenu.slideId); setContextMenu(null); }}>
            Hide / Unhide Slide
          </div>
          <div className="context-menu-item" onClick={() => { setActiveInspectorTab('transition'); setContextMenu(null); }}>
            Slide Transition...
          </div>
          <div className="context-menu-item" onClick={() => { setActiveInspectorTab('format'); setContextMenu(null); }}>
            Format Background...
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item text-danger" onClick={() => { deleteSlide(contextMenu.slideId); setContextMenu(null); }}>
            Delete Slide
          </div>
        </div>
      )}
    </div>
  );
}
