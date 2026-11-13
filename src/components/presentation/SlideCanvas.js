/**
 * Central Slide Editing Canvas for DragSlides / DragDocs
 * Interactive 16:9 canvas with bounding box selection, 8 resize handles, rotation,
 * drag-and-drop movement, smart guides, shapes, tables, charts, and text editing.
 */

import React, { useRef, useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';

export function SlideCanvas() {
  const {
    activeSlide,
    selectedElementIds,
    setSelectedElementIds,
    updateElement,
    zoom,
    showGridlines,
    showGuides,
    setEditingChartElementId
  } = usePresentation();

  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialElementStates, setInitialElementStates] = useState({});

  const scale = zoom / 100;
  const elements = activeSlide?.elements || [];

  const handleCanvasClick = (e) => {
    // If clicked on canvas background, deselect objects
    if (e.target === canvasRef.current || e.target.classList.contains('slide-sheet-background')) {
      setSelectedElementIds([]);
    }
  };

  const handleElementMouseDown = (e, el) => {
    e.stopPropagation();

    if (e.shiftKey || e.ctrlKey) {
      // Toggle selection in multi-select
      setSelectedElementIds(prev =>
        prev.includes(el.id) ? prev.filter(id => id !== el.id) : [...prev, el.id]
      );
    } else {
      if (!selectedElementIds.includes(el.id)) {
        setSelectedElementIds([el.id]);
      }
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });

    // Record initial states of all selected elements
    const states = {};
    elements.forEach(item => {
      if (selectedElementIds.includes(item.id) || item.id === el.id) {
        states[item.id] = { x: item.x, y: item.y, width: item.width, height: item.height };
      }
    });
    setInitialElementStates(states);
  };

  const handleResizeHandleMouseDown = (e, handle, el) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialElementStates({
      [el.id]: { x: el.x, y: el.y, width: el.width, height: el.height }
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / scale;
        const dy = (e.clientY - dragStart.y) / scale;

        Object.entries(initialElementStates).forEach(([id, initial]) => {
          updateElement(id, {
            x: Math.round(initial.x + dx),
            y: Math.round(initial.y + dy)
          });
        });
      } else if (isResizing && selectedElementIds[0]) {
        const id = selectedElementIds[0];
        const initial = initialElementStates[id];
        if (!initial) return;

        const dx = (e.clientX - dragStart.x) / scale;
        const dy = (e.clientY - dragStart.y) / scale;

        let newX = initial.x;
        let newY = initial.y;
        let newWidth = initial.width;
        let newHeight = initial.height;

        if (resizeHandle.includes('e')) newWidth = Math.max(30, initial.width + dx);
        if (resizeHandle.includes('s')) newHeight = Math.max(30, initial.height + dy);
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(30, initial.width - dx);
          newX = initial.x + dx;
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(30, initial.height - dy);
          newY = initial.y + dy;
        }

        updateElement(id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, initialElementStates, scale, selectedElementIds, resizeHandle, updateElement]);

  // Render individual slide element
  const renderElement = (el) => {
    const isSelected = selectedElementIds.includes(el.id);

    return (
      <div
        key={el.id}
        className={`slide-canvas-element ${isSelected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: `${el.x}px`,
          top: `${el.y}px`,
          width: `${el.width}px`,
          height: `${el.height}px`,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          zIndex: el.zIndex || 1,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={(e) => handleElementMouseDown(e, el)}
      >
        {/* Element Content based on type */}
        {el.type === 'text' && (
          <div
            className="canvas-text-box"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateElement(el.id, { text: e.target.innerText })}
            style={{
              width: '100%',
              height: '100%',
              fontSize: `${el.fontSize || 24}px`,
              fontFamily: el.fontFamily || 'Calibri, sans-serif',
              fontWeight: el.fontWeight || 'normal',
              fontStyle: el.fontStyle || 'normal',
              color: el.color || '#1f2937',
              textAlign: el.align || 'left',
              lineHeight: el.lineSpacing || 1.2,
              padding: `${el.padding || 4}px`,
              outline: 'none',
              whiteSpace: 'pre-wrap'
            }}
          >
            {el.text}
          </div>
        )}

        {el.type === 'shape' && (
          <div
            className="canvas-shape-box"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: el.fill || '#185abd',
              border: `${el.strokeWidth || 1}px solid ${el.stroke || '#104f9f'}`,
              borderRadius: el.shapeType === 'circle' ? '50%' : el.shapeType === 'roundRect' ? '12px' : '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: el.textColor || '#ffffff',
              fontSize: `${el.fontSize || 16}px`,
              padding: '6px',
              textAlign: 'center'
            }}
          >
            {el.text}
          </div>
        )}

        {el.type === 'chart' && (
          <div className="canvas-chart-box" style={{ width: '100%', height: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#185abd' }}>{el.title}</span>
              <button
                className="edit-chart-data-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setEditingChartElementId(el.id)}
                title="Edit Chart Data in Spreadsheet"
              >
                EDIT DATA
              </button>
            </div>

            {/* Simple Crisp Vector SVG Chart Visualization */}
            <svg viewBox="0 0 500 220" style={{ width: '100%', height: 'calc(100% - 30px)' }}>
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

              {(el.data?.categories || ['Q1', 'Q2', 'Q3', 'Q4']).map((cat, cIdx) => {
                const groupWidth = 420 / (el.data?.categories?.length || 4);
                const gx = 50 + cIdx * groupWidth;
                const seriesList = el.data?.series || [{ data: [100, 150, 180, 220], color: '#185abd' }];

                return (
                  <g key={cat}>
                    {seriesList.map((s, sIdx) => {
                      const barW = Math.max(14, (groupWidth - 24) / seriesList.length);
                      const val = s.data?.[cIdx] || 0;
                      const barH = Math.min(150, (val / 300) * 150);
                      const bx = gx + sIdx * (barW + 4);
                      const by = 180 - barH;

                      return (
                        <g key={sIdx}>
                          <rect x={bx} y={by} width={barW} height={barH} fill={s.color || '#185abd'} rx="2" />
                          <text x={bx + barW / 2} y={by - 3} textAnchor="middle" fontSize="9" fill="#64748b">{val}</text>
                        </g>
                      );
                    })}
                    <text x={gx + groupWidth / 3} y="200" textAnchor="middle" fontSize="11" fill="#475569">{cat}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {el.type === 'table' && (
          <div className="canvas-table-box" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {(el.rows || []).map(row => (
                  <tr key={row.id}>
                    {(row.cells || []).map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          backgroundColor: cell.backgroundColor || '#ffffff',
                          color: cell.textColor || '#1f2937',
                          fontWeight: cell.bold ? 'bold' : 'normal',
                          textAlign: cell.align || 'left',
                          border: '1px solid #cbd5e1',
                          padding: '6px 10px',
                          fontSize: '13px'
                        }}
                      >
                        {cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selection Bounding Box & 8 Resize Handles */}
        {isSelected && (
          <div className="canvas-selection-box">
            <div className="resize-handle handle-nw" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'nw', el)} />
            <div className="resize-handle handle-n" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'n', el)} />
            <div className="resize-handle handle-ne" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'ne', el)} />
            <div className="resize-handle handle-e" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'e', el)} />
            <div className="resize-handle handle-se" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'se', el)} />
            <div className="resize-handle handle-s" onMouseDown={(e) => handleResizeHandleMouseDown(e, 's', el)} />
            <div className="resize-handle handle-sw" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'sw', el)} />
            <div className="resize-handle handle-w" onMouseDown={(e) => handleResizeHandleMouseDown(e, 'w', el)} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="slide-canvas-viewport">
      <div
        className="slide-zoom-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div
          ref={canvasRef}
          className={`slide-sheet-16-9 ${showGridlines ? 'show-grid' : ''}`}
          style={{
            width: '960px',
            height: '540px',
            backgroundColor: activeSlide?.background?.color || '#ffffff'
          }}
          onClick={handleCanvasClick}
        >
          {/* Smart Guides */}
          {showGuides && (
            <>
              <div className="canvas-guide guide-horizontal" style={{ top: '270px' }} />
              <div className="canvas-guide guide-vertical" style={{ left: '480px' }} />
            </>
          )}

          {/* Render Elements */}
          {elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
}
