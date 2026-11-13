/**
 * Ribbon Tab: LAYOUT
 * Page Setup (Margins, Orientation, Size, Columns, Breaks), Paragraph indents/spacing, and Object Wrap.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { PAPER_SIZES, MARGIN_PRESETS, createPageBreakBlock, createSectionBreakBlock } from '../../engine/documentModel';
import { IconMargins, IconColumns } from '../common/SvgIcons';

export function RibbonTabLayout() {
  const {
    document,
    setDocument,
    setActiveDialog,
    insertBlock,
    selectedBlockId
  } = useDocument();

  const [marginsOpen, setMarginsOpen] = useState(false);
  const [orientationOpen, setOrientationOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [breaksOpen, setBreaksOpen] = useState(false);

  const handleSelectMargins = (presetKey) => {
    const preset = MARGIN_PRESETS[presetKey];
    if (!preset) return;
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        marginPreset: presetKey,
        margins: { top: preset.top, bottom: preset.bottom, left: preset.left, right: preset.right }
      }
    }));
    setMarginsOpen(false);
  };

  const handleSelectOrientation = (orient) => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        orientation: orient
      }
    }));
    setOrientationOpen(false);
  };

  const handleSelectSize = (sizeKey) => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        paperSize: sizeKey
      }
    }));
    setSizeOpen(false);
  };

  const handleSelectColumns = (cols) => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        columns: cols
      }
    }));
    setColumnsOpen(false);
  };

  const handleToggleLineNumbers = () => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        lineNumbers: !doc.pageSetup?.lineNumbers
      }
    }));
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Page Setup */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          {/* Margins */}
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setMarginsOpen(!marginsOpen)} title="Margins">
              <div className="ribbon-btn-icon">
                <IconMargins size={20} color="#185abd" />
              </div>
              <span className="ribbon-btn-label">Margins</span>
            </button>

            {marginsOpen && (
              <div className="ribbon-popover-menu">
                {Object.entries(MARGIN_PRESETS).map(([k, p]) => (
                  <div
                    key={k}
                    className={`popover-menu-item ${document.pageSetup?.marginPreset === k ? 'active' : ''}`}
                    onClick={() => handleSelectMargins(k)}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{p.label}</div>
                    </div>
                  </div>
                ))}
                <div className="popover-menu-divider" />
                <div
                  className="popover-action-link"
                  onClick={() => {
                    setActiveDialog('pageSetup');
                    setMarginsOpen(false);
                  }}
                >
                  Custom Margins...
                </div>
              </div>
            )}
          </div>

          {/* Orientation */}
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setOrientationOpen(!orientationOpen)} title="Orientation">
              <div className="ribbon-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                  {document.pageSetup?.orientation === 'landscape' ? (
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                  ) : (
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                  )}
                </svg>
              </div>
              <span className="ribbon-btn-label">Orientation</span>
            </button>

            {orientationOpen && (
              <div className="ribbon-popover-menu">
                <div
                  className={`popover-menu-item ${document.pageSetup?.orientation === 'portrait' ? 'active' : ''}`}
                  onClick={() => handleSelectOrientation('portrait')}
                >
                  <span>Portrait</span>
                </div>
                <div
                  className={`popover-menu-item ${document.pageSetup?.orientation === 'landscape' ? 'active' : ''}`}
                  onClick={() => handleSelectOrientation('landscape')}
                >
                  <span>Landscape</span>
                </div>
              </div>
            )}
          </div>

          {/* Size */}
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setSizeOpen(!sizeOpen)} title="Paper Size">
              <div className="ribbon-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="ribbon-btn-label">Size</span>
            </button>

            {sizeOpen && (
              <div className="ribbon-popover-menu">
                {Object.entries(PAPER_SIZES).map(([k, s]) => (
                  <div
                    key={k}
                    className={`popover-menu-item ${document.pageSetup?.paperSize === k ? 'active' : ''}`}
                    onClick={() => handleSelectSize(k)}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setColumnsOpen(!columnsOpen)} title="Columns">
              <div className="ribbon-btn-icon">
                <IconColumns size={20} color="#185abd" />
              </div>
              <span className="ribbon-btn-label">Columns</span>
            </button>

            {columnsOpen && (
              <div className="ribbon-popover-menu">
                {[1, 2, 3].map(col => (
                  <div
                    key={col}
                    className={`popover-menu-item ${document.pageSetup?.columns === col ? 'active' : ''}`}
                    onClick={() => handleSelectColumns(col)}
                  >
                    <span>{col === 1 ? 'One Column' : col === 2 ? 'Two Columns' : 'Three Columns'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Breaks */}
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setBreaksOpen(!breaksOpen)} title="Insert Page & Section Breaks">
              <div className="ribbon-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                  <path d="M4 12h16" strokeDasharray="3 3" />
                  <polyline points="8 8 12 4 16 8" />
                  <polyline points="8 16 12 20 16 16" />
                </svg>
              </div>
              <span className="ribbon-btn-label">Breaks</span>
            </button>

            {breaksOpen && (
              <div className="ribbon-popover-menu">
                <div className="popover-menu-header">Page Breaks</div>
                <div
                  className="popover-menu-item"
                  onClick={() => {
                    insertBlock(createPageBreakBlock(), selectedBlockId);
                    setBreaksOpen(false);
                  }}
                >
                  <span>Page Break</span>
                </div>
                <div className="popover-menu-header">Section Breaks</div>
                <div
                  className="popover-menu-item"
                  onClick={() => {
                    insertBlock(createSectionBreakBlock('nextPage'), selectedBlockId);
                    setBreaksOpen(false);
                  }}
                >
                  <span>Next Page Section Break</span>
                </div>
                <div
                  className="popover-menu-item"
                  onClick={() => {
                    insertBlock(createSectionBreakBlock('continuous'), selectedBlockId);
                    setBreaksOpen(false);
                  }}
                >
                  <span>Continuous Section Break</span>
                </div>
              </div>
            )}
          </div>

          {/* Line Numbers Toggle */}
          <button
            className={`ribbon-btn-large ${document.pageSetup?.lineNumbers ? 'active' : ''}`}
            onClick={handleToggleLineNumbers}
            title="Line Numbers"
          >
            <div className="ribbon-btn-icon">
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#185abd' }}>1 2 3</span>
            </div>
            <span className="ribbon-btn-label">Line Numbers</span>
          </button>
        </div>
        <span className="ribbon-group-title">Page Setup</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Paragraph Indent & Spacing */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          <div className="ribbon-control-row">
            <span style={{ fontSize: '11px', color: '#6b7280', width: '50px' }}>Indent L:</span>
            <input
              type="number"
              className="ribbon-num-input"
              value={0}
              readOnly
              style={{ width: '50px' }}
            />
            <span style={{ fontSize: '11px', color: '#6b7280', width: '50px', marginLeft: '8px' }}>Indent R:</span>
            <input
              type="number"
              className="ribbon-num-input"
              value={0}
              readOnly
              style={{ width: '50px' }}
            />
          </div>
          <div className="ribbon-control-row">
            <span style={{ fontSize: '11px', color: '#6b7280', width: '50px' }}>Before:</span>
            <input
              type="number"
              className="ribbon-num-input"
              value={0}
              readOnly
              style={{ width: '50px' }}
            />
            <span style={{ fontSize: '11px', color: '#6b7280', width: '50px', marginLeft: '8px' }}>After:</span>
            <input
              type="number"
              className="ribbon-num-input"
              value={6}
              readOnly
              style={{ width: '50px' }}
            />
          </div>
        </div>
        <span className="ribbon-group-title">Paragraph</span>
      </div>
    </div>
  );
}

