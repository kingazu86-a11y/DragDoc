/**
 * Ribbon Tab: DRAW
 * Digital inking system: Pen, Pencil, Highlighter, Eraser, color swatches, stroke thickness.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';
import { IconPen, IconEraser } from '../common/SvgIcons';

const INK_COLORS = [
  '#000000', '#185abd', '#dc2626', '#16a34a',
  '#d97706', '#7c3aed', '#ec4899', '#f59e0b'
];

const STROKE_WIDTHS = [1, 2, 4, 6, 8, 12];

export function RibbonTabDraw() {
  const {
    drawingMode,
    setDrawingMode,
    drawingColor,
    setDrawingColor,
    drawingStrokeWidth,
    setDrawingStrokeWidth,
    setDrawingsByPage
  } = useDocument();

  const handleClearAllDrawings = () => {
    if (window.confirm('Clear all drawings and annotations across all pages?')) {
      setDrawingsByPage({});
    }
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Drawing Tools */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className={`ribbon-btn-large ${drawingMode === 'none' ? 'active' : ''}`}
            onClick={() => setDrawingMode('none')}
            title="Select & Edit Text"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Select</span>
          </button>

          <button
            className={`ribbon-btn-large ${drawingMode === 'pen' ? 'active' : ''}`}
            onClick={() => {
              setDrawingMode('pen');
              if (drawingStrokeWidth > 6) setDrawingStrokeWidth(3);
            }}
            title="Standard Ballpoint Pen"
          >
            <div className="ribbon-btn-icon">
              <IconPen size={20} color={drawingMode === 'pen' ? drawingColor : '#185abd'} />
            </div>
            <span className="ribbon-btn-label">Pen</span>
          </button>

          <button
            className={`ribbon-btn-large ${drawingMode === 'highlighter' ? 'active' : ''}`}
            onClick={() => {
              setDrawingMode('highlighter');
              setDrawingStrokeWidth(12);
              if (drawingColor === '#000000') setDrawingColor('#fef08a');
            }}
            title="Fluorescent Highlighter"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="m9 11-6 6v3h3l6-6" />
                <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Highlighter</span>
          </button>

          <button
            className={`ribbon-btn-large ${drawingMode === 'eraser' ? 'active' : ''}`}
            onClick={() => setDrawingMode('eraser')}
            title="Ink Stroke Eraser"
          >
            <div className="ribbon-btn-icon">
              <IconEraser size={20} color="#dc2626" />
            </div>
            <span className="ribbon-btn-label">Eraser</span>
          </button>
        </div>
        <span className="ribbon-group-title">Drawing Tools</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Color Palette */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="palette-grid draw-palette">
            {INK_COLORS.map(c => (
              <button
                key={c}
                className={`palette-swatch ${drawingColor === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setDrawingColor(c)}
                title={`Select ink color ${c}`}
              />
            ))}
          </div>
        </div>
        <span className="ribbon-group-title">Ink Color</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Stroke Thickness */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="stroke-thickness-selector">
            {STROKE_WIDTHS.map(w => (
              <button
                key={w}
                className={`stroke-btn ${drawingStrokeWidth === w ? 'active' : ''}`}
                onClick={() => setDrawingStrokeWidth(w)}
                title={`${w}px thickness`}
              >
                <div className="stroke-preview" style={{ height: `${Math.min(10, Math.max(2, w))}px` }} />
                <span>{w}px</span>
              </button>
            ))}
          </div>
        </div>
        <span className="ribbon-group-title">Thickness</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Actions */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-tool-btn" onClick={handleClearAllDrawings} title="Clear ink annotations">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
            <span>Clear Ink</span>
          </button>
        </div>
        <span className="ribbon-group-title">Canvas</span>
      </div>
    </div>
  );
}

