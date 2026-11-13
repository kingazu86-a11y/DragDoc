/**
 * Sheets Interactive Spreadsheet Grid
 * Multi-cell range selection, inline cell editing, column & row resizing,
 * formatted values, formula calculation display, and keyboard navigation.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  coordsToCellId,
  cellIdToCoords,
  expandCellRange,
  evaluateFormula
} from '../../engine/formulaEngine';
import {
  formatCellValue,
  DEFAULT_COL_COUNT,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_WIDTH,
  DEFAULT_ROW_HEIGHT
} from '../../engine/sheetModel';

export function SpreadsheetGrid({
  sheet,
  onUpdateCell,
  onSelectCell,
  onSelectRange,
  onResizeColumn,
  onResizeRow
}) {
  const [editingCellId, setEditingCellId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rangeStart, setRangeStart] = useState('A1');

  // Column / Row resize dragging
  const [resizingCol, setResizingCol] = useState(null);
  const [resizingRow, setResizingRow] = useState(null);
  const [resizeStartPos, setResizeStartPos] = useState(0);
  const [resizeStartSize, setResizeStartSize] = useState(0);

  const gridContainerRef = useRef(null);
  const inputRef = useRef(null);

  const activeCell = sheet.activeCell || 'A1';
  const selectedCells = sheet.selectedCells || [activeCell];

  // Focus inline edit input when editing starts
  useEffect(() => {
    if (editingCellId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCellId]);

  // Handle cell click
  const handleCellClick = (cellId, e) => {
    if (editingCellId && editingCellId !== cellId) {
      commitInlineEdit();
    }

    if (e.shiftKey) {
      // Range selection from current active cell to clicked cell
      const newRange = `${activeCell}:${cellId}`;
      const expanded = expandCellRange(newRange);
      onSelectRange(newRange, expanded);
    } else {
      setRangeStart(cellId);
      onSelectCell(cellId);
    }
  };

  // Handle cell double click -> start editing
  const handleCellDoubleClick = (cellId) => {
    const cell = sheet.cells[cellId];
    setEditingCellId(cellId);
    setEditValue(cell?.formula || (cell?.value !== undefined ? String(cell.value) : ''));
  };

  // Commit inline edit
  const commitInlineEdit = useCallback(() => {
    if (!editingCellId) return;
    onUpdateCell(editingCellId, editValue);
    setEditingCellId(null);
  }, [editingCellId, editValue, onUpdateCell]);

  // Handle keyboard navigation & shortcuts
  const handleKeyDown = (e) => {
    if (editingCellId) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitInlineEdit();
        // Move to cell below
        const coords = cellIdToCoords(editingCellId);
        if (coords && coords.r < DEFAULT_ROW_COUNT) {
          const nextId = coordsToCellId(coords.r + 1, coords.c);
          onSelectCell(nextId);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditingCellId(null);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitInlineEdit();
        // Move to next cell right
        const coords = cellIdToCoords(editingCellId);
        if (coords && coords.c < DEFAULT_COL_COUNT) {
          const nextId = coordsToCellId(coords.r, coords.c + 1);
          onSelectCell(nextId);
        }
      }
      return;
    }

    // Navigation when not editing
    const coords = cellIdToCoords(activeCell);
    if (!coords) return;

    if (e.key === 'ArrowUp' && coords.r > 1) {
      e.preventDefault();
      onSelectCell(coordsToCellId(coords.r - 1, coords.c));
    } else if (e.key === 'ArrowDown' && coords.r < DEFAULT_ROW_COUNT) {
      e.preventDefault();
      onSelectCell(coordsToCellId(coords.r + 1, coords.c));
    } else if (e.key === 'ArrowLeft' && coords.c > 1) {
      e.preventDefault();
      onSelectCell(coordsToCellId(coords.r, coords.c - 1));
    } else if (e.key === 'ArrowRight' && coords.c < DEFAULT_COL_COUNT) {
      e.preventDefault();
      onSelectCell(coordsToCellId(coords.r, coords.c + 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCellDoubleClick(activeCell);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selectedCells.forEach(id => {
        onUpdateCell(id, '');
      });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing directly into active cell
      setEditingCellId(activeCell);
      setEditValue(e.key);
    }
  };

  // Mouse drag range selection
  const handleCellMouseDown = (cellId, e) => {
    if (e.button !== 0) return; // Primary button only
    setIsMouseDown(true);
    setRangeStart(cellId);
    if (!e.shiftKey) {
      onSelectCell(cellId);
    }
  };

  const handleCellMouseEnter = (cellId) => {
    if (isMouseDown && rangeStart) {
      const rangeStr = `${rangeStart}:${cellId}`;
      const expanded = expandCellRange(rangeStr);
      onSelectRange(rangeStr, expanded);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Column resize handlers
  const handleColResizeStart = (colName, currentWidth, e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingCol(colName);
    setResizeStartPos(e.clientX);
    setResizeStartSize(currentWidth);
  };

  // Row resize handlers
  const handleRowResizeStart = (rowNum, currentHeight, e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingRow(rowNum);
    setResizeStartPos(e.clientY);
    setResizeStartSize(currentHeight);
  };

  // Window mouse move for resizing
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (resizingCol) {
        const delta = e.clientX - resizeStartPos;
        const newWidth = Math.max(40, resizeStartSize + delta);
        onResizeColumn(resizingCol, newWidth);
      } else if (resizingRow) {
        const delta = e.clientY - resizeStartPos;
        const newHeight = Math.max(18, resizeStartSize + delta);
        onResizeRow(resizingRow, newHeight);
      }
    };

    const handleWindowMouseUp = () => {
      setResizingCol(null);
      setResizingRow(null);
    };

    if (resizingCol || resizingRow) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [resizingCol, resizingRow, resizeStartPos, resizeStartSize, onResizeColumn, onResizeRow]);

  // Render headers
  const colNames = [];
  for (let c = 1; c <= DEFAULT_COL_COUNT; c++) {
    colNames.push(coordsToCellId(1, c).replace('1', ''));
  }

  const rows = [];
  // Render up to 50 rows for initial view (fast rendering, smoothly scrollable)
  for (let r = 1; r <= 50; r++) {
    rows.push(r);
  }

  return (
    <div
      className="sheets-grid-viewport"
      ref={gridContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="sheets-grid-table">
        {/* Top Header Row (Column Letters) */}
        <div className="sheets-grid-row header-row">
          {/* Top Left Corner */}
          <div className="sheets-corner-header" title="Select All">
            <div className="sheets-corner-triangle" />
          </div>

          {colNames.map(colName => {
            const width = sheet.colWidths?.[colName] || DEFAULT_COL_WIDTH;
            return (
              <div
                key={colName}
                className="sheets-col-header"
                style={{ width: `${width}px`, minWidth: `${width}px` }}
              >
                <span>{colName}</span>
                <div
                  className="sheets-col-resizer"
                  onMouseDown={(e) => handleColResizeStart(colName, width, e)}
                />
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {rows.map(rowNum => {
          const height = sheet.rowHeights?.[rowNum] || DEFAULT_ROW_HEIGHT;
          return (
            <div
              key={rowNum}
              className="sheets-grid-row"
              style={{ height: `${height}px`, minHeight: `${height}px` }}
            >
              {/* Row Header */}
              <div
                className="sheets-row-header"
                style={{ height: `${height}px` }}
              >
                <span>{rowNum}</span>
                <div
                  className="sheets-row-resizer"
                  onMouseDown={(e) => handleRowResizeStart(rowNum, height, e)}
                />
              </div>

              {/* Row Cells */}
              {colNames.map(colName => {
                const cellId = `${colName}${rowNum}`;
                const cell = sheet.cells?.[cellId];
                const width = sheet.colWidths?.[colName] || DEFAULT_COL_WIDTH;
                const isActive = activeCell === cellId;
                const isSelected = selectedCells.includes(cellId);
                const isEditing = editingCellId === cellId;

                // Evaluate display value
                let displayVal = '';
                if (cell) {
                  if (cell.formula) {
                    displayVal = evaluateFormula(cell.formula, sheet.cells);
                  } else {
                    displayVal = cell.value !== undefined ? cell.value : '';
                  }
                  displayVal = formatCellValue(displayVal, cell.format);
                }

                return (
                  <div
                    key={cellId}
                    className={`sheets-cell ${isActive ? 'active' : ''} ${isSelected && !isActive ? 'selected' : ''}`}
                    style={{
                      width: `${width}px`,
                      minWidth: `${width}px`,
                      height: `${height}px`,
                      fontWeight: cell?.bold ? 'bold' : 'normal',
                      fontStyle: cell?.italic ? 'italic' : 'normal',
                      textDecoration: cell?.underline ? 'underline' : 'none',
                      textAlign: cell?.align || 'left',
                      backgroundColor: cell?.bgColor || (isSelected && !isActive ? 'rgba(16, 124, 65, 0.12)' : 'transparent'),
                      color: cell?.color || '#0f172a'
                    }}
                    onClick={(e) => handleCellClick(cellId, e)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
                    onMouseDown={(e) => handleCellMouseDown(cellId, e)}
                    onMouseEnter={() => handleCellMouseEnter(cellId)}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className="sheets-inline-cell-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitInlineEdit}
                      />
                    ) : (
                      <span className="sheets-cell-content-text">{displayVal}</span>
                    )}

                    {/* Active Cell Border & Drag Handle */}
                    {isActive && (
                      <div className="sheets-active-cell-border">
                        <div className="sheets-fill-handle" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

