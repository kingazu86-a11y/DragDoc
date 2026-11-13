/**
 * Interactive Vector Inking & Drawing Layer for Physical Pages
 */

import React, { useRef, useState } from 'react';
import { useDocument } from '../../context/DocumentContext';

export function DrawingOverlay({ pageIndex, width, height }) {
  const {
    drawingMode,
    drawingColor,
    drawingStrokeWidth,
    drawingsByPage,
    setDrawingsByPage
  } = useDocument();

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const svgRef = useRef(null);

  if (drawingMode === 'none' && (!drawingsByPage[pageIndex] || drawingsByPage[pageIndex].length === 0)) {
    return null;
  }

  const pageStrokes = drawingsByPage[pageIndex] || [];

  const getCoordinates = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    if (drawingMode === 'none') return;

    if (drawingMode === 'eraser') {
      const coord = getCoordinates(e);
      // Erase stroke near coord
      const updated = pageStrokes.filter(stroke => {
        return !stroke.points.some(p => Math.hypot(p.x - coord.x, p.y - coord.y) < 15);
      });
      setDrawingsByPage(prev => ({ ...prev, [pageIndex]: updated }));
      return;
    }

    const startPoint = getCoordinates(e);
    setIsDrawing(true);
    setCurrentPath({
      points: [startPoint],
      color: drawingColor,
      width: drawingStrokeWidth,
      opacity: drawingMode === 'highlighter' ? 0.4 : 1
    });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || !currentPath) return;
    const point = getCoordinates(e);
    setCurrentPath(prev => ({
      ...prev,
      points: [...prev.points, point]
    }));
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    if (currentPath.points.length > 1) {
      setDrawingsByPage(prev => ({
        ...prev,
        [pageIndex]: [...(prev[pageIndex] || []), currentPath]
      }));
    }
    setCurrentPath(null);
  };

  const renderStrokePath = (stroke, key) => {
    if (!stroke.points || stroke.points.length < 2) return null;
    const d = stroke.points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    return (
      <path
        key={key}
        d={d}
        fill="none"
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={stroke.opacity || 1}
      />
    );
  };

  return (
    <svg
      ref={svgRef}
      className={`page-drawing-canvas ${drawingMode !== 'none' ? 'drawing-active' : ''}`}
      style={{ width: `${width}px`, height: `${height}px`, pointerEvents: drawingMode !== 'none' ? 'auto' : 'none' }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {pageStrokes.map((s, idx) => renderStrokePath(s, idx))}
      {currentPath && renderStrokePath(currentPath, 'active_stroke')}
    </svg>
  );
}

