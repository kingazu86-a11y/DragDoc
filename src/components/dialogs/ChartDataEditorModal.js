/**
 * Spreadsheet-Style Chart Data Editor Modal for DragSlides / DragDocs
 * Interactive grid with editable cells, row/column addition and deletion,
 * CSV import/export, Excel copy-paste support, and instant live visualization updates!
 */

import React, { useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { chartDataToGrid, gridToChartData, exportChartDataToCsv, parseCsvToGrid } from '../../engine/chartDataEngine';
import { Modal } from '../common/Modal';

export function ChartDataEditorModal() {
  const {
    activeSlide,
    editingChartElementId,
    setEditingChartElementId,
    updateElement
  } = usePresentation();

  const chartElement = (activeSlide?.elements || []).find(el => el.id === editingChartElementId);

  const [grid, setGrid] = useState(() => {
    return chartElement ? chartDataToGrid(chartElement.data) : [[]];
  });

  useEffect(() => {
    if (chartElement) {
      setGrid(chartDataToGrid(chartElement.data));
    }
  }, [chartElement]);

  if (!editingChartElementId || !chartElement) return null;

  // Sync grid changes directly to presentation chart element immediately (LIVE UPDATES!)
  const syncGridToChart = (newGrid) => {
    setGrid(newGrid);
    const existingColors = chartElement.data?.series?.map(s => s.color) || [];
    const updatedChartData = gridToChartData(newGrid, existingColors);
    updateElement(chartElement.id, {
      data: updatedChartData
    });
  };

  const handleCellChange = (rIdx, cIdx, val) => {
    const newGrid = grid.map((row, r) => {
      if (r !== rIdx) return row;
      const newRow = [...row];
      newRow[cIdx] = val;
      return newRow;
    });
    syncGridToChart(newGrid);
  };

  const handleAddRow = () => {
    const colCount = grid[0]?.length || 3;
    const newRow = [`Item ${grid.length}`];
    for (let c = 1; c < colCount; c++) {
      newRow.push(100);
    }
    syncGridToChart([...grid, newRow]);
  };

  const handleDeleteRow = (rIdx) => {
    if (grid.length <= 2) return; // Keep at least 1 data row
    const newGrid = grid.filter((_, i) => i !== rIdx);
    syncGridToChart(newGrid);
  };

  const handleAddColumn = () => {
    const seriesCount = (grid[0]?.length || 1) - 1;
    const newGrid = grid.map((row, r) => {
      if (r === 0) return [...row, `Series ${seriesCount + 1}`];
      return [...row, 150];
    });
    syncGridToChart(newGrid);
  };

  const handleDeleteColumn = (cIdx) => {
    if ((grid[0]?.length || 0) <= 2) return; // Keep at least 1 series column
    const newGrid = grid.map(row => row.filter((_, i) => i !== cIdx));
    syncGridToChart(newGrid);
  };

  const handleExportCsv = () => {
    const csv = exportChartDataToCsv(chartElement.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartElement.name || 'ChartData'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const parsedGrid = parseCsvToGrid(csv);
      if (parsedGrid.length >= 2) {
        syncGridToChart(parsedGrid);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      title={`Edit Chart Data — ${chartElement.name || 'Chart'}`}
      isOpen={!!editingChartElementId}
      onClose={() => setEditingChartElementId(null)}
      width="680px"
    >
      <div className="chart-data-editor-container">
        {/* Spreadsheet Toolbar */}
        <div className="spreadsheet-toolbar">
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="issue-action-btn" onClick={handleAddRow}>+ Add Row</button>
            <button className="issue-action-btn" onClick={handleAddColumn}>+ Add Column</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label className="issue-action-btn" style={{ cursor: 'pointer' }}>
              Import CSV
              <input type="file" accept=".csv" onChange={handleImportCsv} style={{ display: 'none' }} />
            </label>
            <button className="issue-action-btn" onClick={handleExportCsv}>Export CSV</button>
          </div>
        </div>

        <div className="spreadsheet-tip">
          Values entered here update the slide visualization instantly in real-time.
        </div>

        {/* 2D Spreadsheet Grid */}
        <div className="spreadsheet-grid-wrapper">
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th className="cell-corner">#</th>
                {grid[0]?.map((colName, cIdx) => (
                  <th key={cIdx} className="col-header-cell">
                    <div className="header-cell-content">
                      <input
                        type="text"
                        value={colName}
                        onChange={(e) => handleCellChange(0, cIdx, e.target.value)}
                        className="header-cell-input"
                      />
                      {cIdx > 1 && (
                        <button
                          className="header-del-btn"
                          title="Delete column"
                          onClick={() => handleDeleteColumn(cIdx)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.slice(1).map((row, rIdx) => {
                const actualRowIdx = rIdx + 1;
                return (
                  <tr key={actualRowIdx}>
                    <td className="row-header-cell">
                      <span>{actualRowIdx}</span>
                      {grid.length > 2 && (
                        <button
                          className="row-del-btn-small"
                          title="Delete row"
                          onClick={() => handleDeleteRow(actualRowIdx)}
                        >
                          ×
                        </button>
                      )}
                    </td>
                    {row.map((cellVal, cIdx) => (
                      <td key={cIdx} className="data-cell">
                        <input
                          type={cIdx === 0 ? 'text' : 'number'}
                          value={cellVal}
                          onChange={(e) => handleCellChange(actualRowIdx, cIdx, e.target.value)}
                          className="data-cell-input"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="dialog-actions-footer" style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="preview-btn primary"
            onClick={() => setEditingChartElementId(null)}
          >
            Done Editing Data
          </button>
        </div>
      </div>
    </Modal>
  );
}
