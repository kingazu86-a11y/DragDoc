/**
 * Sheets Bottom Bar: Sheet Tabs, Add Sheet, Live Range Stats, and Zoom Controls.
 */

import React, { useState } from 'react';
import { IconPlus, IconClose } from '../common/SvgIcons';
import { calculateRangeStats, formatCellValue } from '../../engine/sheetModel';

export function SheetTabsBar({
  sheets,
  activeSheetId,
  onSelectSheet,
  onAddSheet,
  onDeleteSheet,
  onRenameSheet,
  activeSheet,
  zoom,
  onZoomChange
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState('');

  // Calculate live stats for current selection
  const selectedCellIds = activeSheet?.selectedCells || [activeSheet?.activeCell || 'A1'];
  const stats = calculateRangeStats(selectedCellIds, activeSheet?.cells || {});

  const handleStartRename = (sheet, e) => {
    e.stopPropagation();
    setRenamingId(sheet.id);
    setRenameText(sheet.name);
  };

  const handleFinishRename = () => {
    if (renamingId && renameText.trim()) {
      onRenameSheet(renamingId, renameText.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="sheets-bottom-bar-container">
      {/* Left: Sheet Tabs Strip */}
      <div className="sheets-tabs-strip">
        <button
          className="sheets-add-tab-btn"
          title="Insert Worksheet (+)"
          onClick={onAddSheet}
        >
          <IconPlus size={14} color="#107c41" />
        </button>

        <div className="sheets-tabs-list">
          {sheets.map(sheet => {
            const isActive = sheet.id === activeSheetId;
            const isRenaming = sheet.id === renamingId;

            return (
              <div
                key={sheet.id}
                className={`sheets-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSheet(sheet.id)}
                onDoubleClick={(e) => handleStartRename(sheet, e)}
              >
                {isRenaming ? (
                  <input
                    type="text"
                    className="sheets-tab-rename-input"
                    value={renameText}
                    autoFocus
                    onChange={(e) => setRenameText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename();
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onBlur={handleFinishRename}
                  />
                ) : (
                  <span className="sheets-tab-name">{sheet.name}</span>
                )}

                {sheets.length > 1 && (
                  <button
                    className="sheets-tab-close-btn"
                    title="Delete Sheet"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSheet(sheet.id);
                    }}
                  >
                    <IconClose size={10} color="#64748b" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Live Range Statistics & Zoom */}
      <div className="sheets-bottom-right-strip">
        {stats.numericCount > 0 && (
          <div className="sheets-live-stats-group">
            <span className="sheets-stat-badge">
              <span className="sheets-stat-label">AVERAGE:</span>
              <span className="sheets-stat-value">{formatCellValue(stats.average, 'number', 2)}</span>
            </span>
            <span className="sheets-stat-badge">
              <span className="sheets-stat-label">COUNT:</span>
              <span className="sheets-stat-value">{stats.count}</span>
            </span>
            <span className="sheets-stat-badge">
              <span className="sheets-stat-label">MIN:</span>
              <span className="sheets-stat-value">{formatCellValue(stats.min, 'number', 2)}</span>
            </span>
            <span className="sheets-stat-badge">
              <span className="sheets-stat-label">MAX:</span>
              <span className="sheets-stat-value">{formatCellValue(stats.max, 'number', 2)}</span>
            </span>
            <span className="sheets-stat-badge highlight-sum">
              <span className="sheets-stat-label">SUM:</span>
              <span className="sheets-stat-value">{formatCellValue(stats.sum, 'currency', 2)}</span>
            </span>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="sheets-zoom-controls">
          <button
            className="sheets-zoom-btn"
            title="Zoom Out"
            onClick={() => onZoomChange(Math.max(50, (zoom || 100) - 10))}
          >
            -
          </button>
          <span className="sheets-zoom-label">{zoom || 100}%</span>
          <button
            className="sheets-zoom-btn"
            title="Zoom In"
            onClick={() => onZoomChange(Math.min(200, (zoom || 100) + 10))}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

