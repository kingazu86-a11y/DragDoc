/**
 * Ribbon Tab: INSERT
 * Working functionality for Pages, Tables, Illustrations, Links, Headers/Footers, Equations, and Symbols.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import {
  IconTable,
  IconImage,
  IconDiagram,
  IconChart,
  IconLink
} from '../common/SvgIcons';
import {
  createPageBreakBlock,
  createParagraphBlock,
  createHeadingBlock,
  createTableBlock,
  createImageBlock,
  createDiagramBlock,
  createChartBlock,
  createQuoteBlock
} from '../../engine/documentModel';

export function RibbonTabInsert() {
  const {
    insertBlock,
    selectedBlockId,
    setActiveDialog,
    setDocument
  } = useDocument();

  const [tableGridHover, setTableGridHover] = useState({ r: 0, c: 0 });
  const [tablePickerOpen, setTablePickerOpen] = useState(false);

  const handleInsertBlankPage = () => {
    insertBlock(createPageBreakBlock(), selectedBlockId);
    insertBlock(createParagraphBlock(''), selectedBlockId);
  };

  const handleInsertPageBreak = () => {
    insertBlock(createPageBreakBlock(), selectedBlockId);
  };

  const handleInsertCoverPage = () => {
    setDocument(doc => {
      const coverBlocks = [
        createHeadingBlock(doc.title || 'Executive Report', 1, { align: 'center', spacingBefore: 120, spacingAfter: 16 }),
        createParagraphBlock('Prepared for Strategic Enterprise Review', { fontSize: 13, italic: true }, { align: 'center', spacingAfter: 180 }),
        createParagraphBlock(`Author: ${doc.author || 'Author'}\nDate: ${new Date().toLocaleDateString()}`, { fontSize: 11, fontColor: '#6b7280' }, { align: 'center', spacingAfter: 40 }),
        createPageBreakBlock()
      ];
      return {
        ...doc,
        blocks: [...coverBlocks, ...(doc.blocks || [])]
      };
    });
  };

  const handleTableGridSelect = (rows, cols) => {
    insertBlock(createTableBlock(rows, cols), selectedBlockId);
    setTablePickerOpen(false);
  };

  const handleInsertImagePrompt = () => {
    const url = window.prompt('Enter Image URL (e.g. https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600):', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600');
    if (url) {
      insertBlock(createImageBlock(url, 'Inserted Image', 460, 260), selectedBlockId);
    }
  };

  const handleInsertDiagram = (type) => {
    insertBlock(createDiagramBlock(type), selectedBlockId);
  };

  const handleInsertChart = (type) => {
    insertBlock(createChartBlock(type), selectedBlockId);
  };

  const handleInsertQuote = () => {
    insertBlock(createQuoteBlock('“Insert your notable quote or callout text here.”', 'Executive Leadership'), selectedBlockId);
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Pages */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={handleInsertCoverPage} title="Insert modern cover page at beginning">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Cover Page</span>
          </button>

          <button className="ribbon-btn-large" onClick={handleInsertBlankPage} title="Insert blank page">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Blank Page</span>
          </button>

          <button className="ribbon-btn-large" onClick={handleInsertPageBreak} title="Insert page break (Ctrl+Enter)">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="4" y="2" width="16" height="8" rx="1" />
                <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 3" />
                <rect x="4" y="14" width="16" height="8" rx="1" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Page Break</span>
          </button>
        </div>
        <span className="ribbon-group-title">Pages</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Tables */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-picker-wrapper">
            <button
              className="ribbon-btn-large"
              onClick={() => setTablePickerOpen(!tablePickerOpen)}
              title="Insert Table"
            >
              <div className="ribbon-btn-icon">
                <IconTable size={20} color="#185abd" />
              </div>
              <span className="ribbon-btn-label">Table</span>
            </button>

            {tablePickerOpen && (
              <div className="ribbon-popover-menu table-grid-popover">
                <div className="table-grid-label">
                  {tableGridHover.r > 0 ? `${tableGridHover.r} x ${tableGridHover.c} Table` : 'Insert Table'}
                </div>
                <div className="table-grid-matrix" onMouseLeave={() => setTableGridHover({ r: 0, c: 0 })}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(row => (
                    <div key={row} className="table-grid-row">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(col => (
                        <div
                          key={col}
                          className={`table-grid-cell ${row <= tableGridHover.r && col <= tableGridHover.c ? 'highlight' : ''}`}
                          onMouseEnter={() => setTableGridHover({ r: row, c: col })}
                          onClick={() => handleTableGridSelect(row, col)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div
                  className="popover-action-link"
                  onClick={() => {
                    setActiveDialog('table');
                    setTablePickerOpen(false);
                  }}
                >
                  Custom Dimensions...
                </div>
              </div>
            )}
          </div>
        </div>
        <span className="ribbon-group-title">Tables</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Illustrations */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={handleInsertImagePrompt} title="Insert Picture from URL or disk">
            <div className="ribbon-btn-icon">
              <IconImage size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Pictures</span>
          </button>

          <button className="ribbon-btn-large" onClick={() => handleInsertDiagram('process')} title="Insert Smart Diagram">
            <div className="ribbon-btn-icon">
              <IconDiagram size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Smart Diagram</span>
          </button>

          <button className="ribbon-btn-large" onClick={() => handleInsertChart('bar')} title="Insert Business Chart">
            <div className="ribbon-btn-icon">
              <IconChart size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Chart</span>
          </button>
        </div>
        <span className="ribbon-group-title">Illustrations</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Links & Text */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setActiveDialog('hyperlink')} title="Insert Link (Ctrl+K)">
            <div className="ribbon-btn-icon">
              <IconLink size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Link</span>
          </button>

          <button className="ribbon-btn-large" onClick={handleInsertQuote} title="Insert Pull Quote / Callout">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Callout Quote</span>
          </button>
        </div>
        <span className="ribbon-group-title">Text & Links</span>
      </div>
    </div>
  );
}

