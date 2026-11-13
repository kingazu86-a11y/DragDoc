/**
 * Interactive Table Component with Cell Editing and Structure Controls
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';
import { generateId, createParagraphBlock } from '../../engine/documentModel';

export function TableView({ block }) {
  const { updateBlock, deleteBlock } = useDocument();

  const handleCellContentChange = (rIdx, cIdx, e) => {
    const text = e.target.innerText;
    const newRows = block.rows.map((row, r) => {
      if (r !== rIdx) return row;
      const newCells = row.cells.map((cell, c) => {
        if (c !== cIdx) return cell;
        return {
          ...cell,
          content: [createParagraphBlock(text, {
            bold: row.isHeader,
            fontSize: 10.5
          }, { spacingAfter: 0 })]
        };
      });
      return { ...row, cells: newCells };
    });

    updateBlock(block.id, { rows: newRows });
  };

  const handleAddRow = (atIndex) => {
    const colCount = block.rows[0]?.cells?.length || 3;
    const newCells = [];
    for (let c = 0; c < colCount; c++) {
      newCells.push({
        id: generateId('cell'),
        colSpan: 1,
        content: [createParagraphBlock('New cell', {}, { spacingAfter: 0 })]
      });
    }
    const newRow = {
      id: generateId('row'),
      isHeader: false,
      cells: newCells
    };

    const newRows = [...block.rows];
    newRows.splice(atIndex + 1, 0, newRow);
    updateBlock(block.id, { rows: newRows });
  };

  const handleDeleteRow = (rIdx) => {
    if (block.rows.length <= 1) {
      deleteBlock(block.id);
      return;
    }
    const newRows = block.rows.filter((_, i) => i !== rIdx);
    updateBlock(block.id, { rows: newRows });
  };

  const handleAddColumn = () => {
    const newRows = block.rows.map(row => {
      const newCell = {
        id: generateId('cell'),
        colSpan: 1,
        backgroundColor: row.isHeader ? '#f3f4f6' : '#ffffff',
        content: [createParagraphBlock(row.isHeader ? 'Header' : 'Data', { bold: row.isHeader }, { spacingAfter: 0 })]
      };
      return {
        ...row,
        cells: [...row.cells, newCell]
      };
    });
    updateBlock(block.id, { rows: newRows });
  };

  return (
    <div className="table-block-wrapper">
      {/* Table Context Controls Toolbar */}
      <div className="table-hover-controls">
        <button
          className="tbl-ctrl-btn"
          title="Add column to right"
          onClick={handleAddColumn}
        >
          + Column
        </button>
        <button
          className="tbl-ctrl-btn"
          title="Add row at end"
          onClick={() => handleAddRow(block.rows.length - 1)}
        >
          + Row
        </button>
        <button
          className="tbl-ctrl-btn text-danger"
          title="Delete entire table"
          onClick={() => deleteBlock(block.id)}
        >
          Delete Table
        </button>
      </div>

      <table
        className={`dragdocs-table style-${block.tableStyle || 'grid'}`}
        style={{
          borderCollapse: 'collapse',
          width: block.width || '100%',
          border: block.borders ? `${block.borderWidth || 1}px ${block.borderStyle || 'solid'} ${block.borderColor || '#d1d5db'}` : 'none'
        }}
      >
        <tbody>
          {block.rows.map((row, rIdx) => (
            <tr key={row.id || rIdx} className={row.isHeader ? 'table-header-row' : 'table-data-row'}>
              {row.cells.map((cell, cIdx) => (
                <td
                  key={cell.id || cIdx}
                  className="table-cell"
                  style={{
                    backgroundColor: cell.backgroundColor || (row.isHeader ? '#f8fafc' : '#ffffff'),
                    border: block.borders ? `${block.borderWidth || 1}px ${block.borderStyle || 'solid'} ${block.borderColor || '#e5e7eb'}` : 'none',
                    textAlign: cell.align || 'left',
                    verticalAlign: cell.verticalAlign || 'top',
                    padding: '6px 10px'
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleCellContentChange(rIdx, cIdx, e)}
                >
                  {cell.content?.[0]?.textRuns?.[0]?.text || ''}
                </td>
              ))}
              <td className="row-action-cell" aria-hidden="true">
                <button
                  className="row-del-btn"
                  title="Delete row"
                  onClick={() => handleDeleteRow(rIdx)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

