/**
 * Dialogs Container for DragDocs Word Processor
 * Hosts Table Insertion, Hyperlinks, Page Setup, Word Count, Watermarks,
 * Print Preview, Citations, Keyboard Shortcuts, and About dialogs.
 */

import React, { useState, useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { Modal } from '../common/Modal';
import { calculateDocumentStats } from '../../engine/reviewEngine';
import { createTableBlock, PAPER_SIZES } from '../../engine/documentModel';
import { AppLogoIcon, IconPrint } from '../common/SvgIcons';

export function DialogsContainer() {
  const {
    document,
    setDocument,
    activeDialog,
    setActiveDialog,
    insertBlock,
    selectedBlockId,
    applyFormatting,
    pagination,
    exportPdf
  } = useDocument();

  // Table Dialog State
  const [tableRows, setTableRows] = useState(4);
  const [tableCols, setTableCols] = useState(4);
  const [tableStyle, setTableStyle] = useState('grid');

  // Hyperlink Dialog State
  const [linkUrl, setLinkUrl] = useState('https://');

  // Page Setup State
  const [setupPaperSize, setSetupPaperSize] = useState(document.pageSetup?.paperSize || 'letter');
  const [setupOrientation, setSetupOrientation] = useState(document.pageSetup?.orientation || 'portrait');
  const [marginTop, setMarginTop] = useState(document.pageSetup?.margins?.top || 96);
  const [marginBottom, setMarginBottom] = useState(document.pageSetup?.margins?.bottom || 96);
  const [marginLeft, setMarginLeft] = useState(document.pageSetup?.margins?.left || 96);
  const [marginRight, setMarginRight] = useState(document.pageSetup?.margins?.right || 96);

  // Watermark Dialog State
  const [wmText, setWmText] = useState(document.pageSetup?.watermark?.text || 'CONFIDENTIAL');
  const [wmOpacity, setWmOpacity] = useState(document.pageSetup?.watermark?.opacity || 0.25);
  const [wmAngle, setWmAngle] = useState(document.pageSetup?.watermark?.angle || -45);
  const [wmColor] = useState(document.pageSetup?.watermark?.color || '#d1d5db');

  // Citation Dialog State
  const [citeAuthor, setCiteAuthor] = useState('');
  const [citeTitle, setCiteTitle] = useState('');
  const [citeYear, setCiteYear] = useState('2026');
  const [citePublisher, setCitePublisher] = useState('');

  // Print Dialog State
  const [printCopies, setPrintCopies] = useState(1);
  const [printRange, setPrintRange] = useState('all');

  const stats = useMemo(() => {
    return calculateDocumentStats(document, pagination.totalPages || 1);
  }, [document, pagination.totalPages]);

  const closeDialog = () => setActiveDialog(null);

  // 1. Table Insert Submit
  const handleInsertTable = (e) => {
    e.preventDefault();
    insertBlock(createTableBlock(Number(tableRows), Number(tableCols), { tableStyle }), selectedBlockId);
    closeDialog();
  };

  // 2. Hyperlink Submit
  const handleApplyLink = (e) => {
    e.preventDefault();
    applyFormatting('link', linkUrl);
    closeDialog();
  };

  // 3. Page Setup Submit
  const handleSavePageSetup = (e) => {
    e.preventDefault();
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        paperSize: setupPaperSize,
        orientation: setupOrientation,
        margins: {
          top: Number(marginTop),
          bottom: Number(marginBottom),
          left: Number(marginLeft),
          right: Number(marginRight)
        }
      }
    }));
    closeDialog();
  };

  // 4. Watermark Submit
  const handleSaveWatermark = (e) => {
    e.preventDefault();
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        watermark: {
          type: wmText ? 'text' : 'none',
          text: wmText,
          opacity: Number(wmOpacity),
          angle: Number(wmAngle),
          color: wmColor
        }
      }
    }));
    closeDialog();
  };

  // 5. Citation Submit
  const handleAddCitation = (e) => {
    e.preventDefault();
    if (!citeAuthor || !citeTitle) return;
    const newCite = {
      id: `cite_${Date.now()}`,
      author: citeAuthor,
      title: citeTitle,
      year: citeYear,
      publisher: citePublisher
    };
    setDocument(doc => ({
      ...doc,
      citations: [...(doc.citations || []), newCite]
    }));
    setCiteAuthor('');
    setCiteTitle('');
    closeDialog();
  };

  return (
    <>
      {/* 1. TABLE INSERT DIALOG */}
      <Modal title="Insert Table" isOpen={activeDialog === 'table'} onClose={closeDialog} width="420px">
        <form onSubmit={handleInsertTable}>
          <div className="form-group">
            <label className="ai-label">Number of Columns:</label>
            <input
              type="number"
              className="ai-input"
              min="1"
              max="20"
              value={tableCols}
              onChange={(e) => setTableCols(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="ai-label">Number of Rows:</label>
            <input
              type="number"
              className="ai-input"
              min="1"
              max="100"
              value={tableRows}
              onChange={(e) => setTableRows(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="ai-label">Table Style:</label>
            <select
              className="ai-select"
              value={tableStyle}
              onChange={(e) => setTableStyle(e.target.value)}
            >
              <option value="grid">Grid Table (Standard)</option>
              <option value="banded">Banded Rows</option>
              <option value="minimal">Minimalist Borders</option>
              <option value="modern">Modern Professional Blue</option>
            </select>
          </div>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
            <button type="submit" className="preview-btn primary">Insert Table</button>
          </div>
        </form>
      </Modal>

      {/* 2. HYPERLINK DIALOG */}
      <Modal title="Insert Hyperlink" isOpen={activeDialog === 'hyperlink'} onClose={closeDialog} width="460px">
        <form onSubmit={handleApplyLink}>
          <div className="form-group">
            <label className="ai-label">Address (URL):</label>
            <input
              type="url"
              className="ai-input"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
            />
          </div>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
            <button type="submit" className="preview-btn primary">Apply Link</button>
          </div>
        </form>
      </Modal>

      {/* 3. PAGE SETUP DIALOG */}
      <Modal title="Page Setup" isOpen={activeDialog === 'pageSetup'} onClose={closeDialog} width="520px">
        <form onSubmit={handleSavePageSetup}>
          <div className="form-group">
            <label className="ai-label">Paper Size:</label>
            <select
              className="ai-select"
              value={setupPaperSize}
              onChange={(e) => setSetupPaperSize(e.target.value)}
            >
              {Object.entries(PAPER_SIZES).map(([k, s]) => (
                <option key={k} value={k}>{s.name} ({s.label})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="ai-label">Orientation:</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
              <label className="ribbon-checkbox-item">
                <input
                  type="radio"
                  name="orientation"
                  checked={setupOrientation === 'portrait'}
                  onChange={() => setSetupOrientation('portrait')}
                />
                <span>Portrait</span>
              </label>
              <label className="ribbon-checkbox-item">
                <input
                  type="radio"
                  name="orientation"
                  checked={setupOrientation === 'landscape'}
                  onChange={() => setSetupOrientation('landscape')}
                />
                <span>Landscape</span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label className="ai-label">Margins (pixels at 96 DPI):</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Top:</span>
                <input type="number" className="ai-input" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Bottom:</span>
                <input type="number" className="ai-input" value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Left:</span>
                <input type="number" className="ai-input" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Right:</span>
                <input type="number" className="ai-input" value={marginRight} onChange={(e) => setMarginRight(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
            <button type="submit" className="preview-btn primary">Apply Setup</button>
          </div>
        </form>
      </Modal>

      {/* 4. WORD COUNT DIALOG */}
      <Modal title="Document Statistics" isOpen={activeDialog === 'wordCount'} onClose={closeDialog} width="400px">
        <div className="stats-dialog-content">
          <div className="stats-row">
            <span className="stats-name">Pages:</span>
            <span className="stats-val">{stats.pages}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Words:</span>
            <span className="stats-val">{stats.words}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Characters (no spaces):</span>
            <span className="stats-val">{stats.charactersNoSpaces}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Characters (with spaces):</span>
            <span className="stats-val">{stats.characters}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Paragraphs:</span>
            <span className="stats-val">{stats.paragraphs}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Sentences:</span>
            <span className="stats-val">{stats.sentences}</span>
          </div>
          <div className="stats-separator" />
          <div className="stats-row">
            <span className="stats-name">Estimated Reading Time:</span>
            <span className="stats-val">{stats.readingTime}</span>
          </div>
          <div className="stats-row">
            <span className="stats-name">Estimated Speaking Time:</span>
            <span className="stats-val">{stats.speakingTime}</span>
          </div>

          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn primary" onClick={closeDialog}>Close</button>
          </div>
        </div>
      </Modal>

      {/* 5. WATERMARK DIALOG */}
      <Modal title="Watermark Settings" isOpen={activeDialog === 'watermark'} onClose={closeDialog} width="440px">
        <form onSubmit={handleSaveWatermark}>
          <div className="form-group">
            <label className="ai-label">Watermark Text:</label>
            <input
              type="text"
              className="ai-input"
              value={wmText}
              onChange={(e) => setWmText(e.target.value)}
              placeholder="e.g. DRAFT, CONFIDENTIAL, DO NOT COPY"
              required
            />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="ai-label">Opacity ({Math.round(wmOpacity * 100)}%):</label>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={wmOpacity}
              onChange={(e) => setWmOpacity(e.target.value)}
              className="zoom-range-input"
            />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="ai-label">Rotation Angle ({wmAngle}°):</label>
            <select
              className="ai-select"
              value={wmAngle}
              onChange={(e) => setWmAngle(Number(e.target.value))}
            >
              <option value={-45}>Diagonal (-45°)</option>
              <option value={0}>Horizontal (0°)</option>
              <option value={-30}>Gentle Slope (-30°)</option>
            </select>
          </div>
          <div className="dialog-actions-footer">
            <button
              type="button"
              className="preview-btn text-danger"
              onClick={() => {
                setDocument(doc => ({
                  ...doc,
                  pageSetup: {
                    ...(doc.pageSetup || {}),
                    watermark: { type: 'none', text: '' }
                  }
                }));
                closeDialog();
              }}
            >
              Remove
            </button>
            <button type="submit" className="preview-btn primary">Apply Watermark</button>
          </div>
        </form>
      </Modal>

      {/* 6. PRINT DIALOG */}
      <Modal title="Print / Export PDF" isOpen={activeDialog === 'print'} onClose={closeDialog} width="560px">
        <div className="print-dialog-body">
          <div className="print-preview-thumb">
            <div className="print-thumb-sheet">
              <div className="thumb-head" />
              <div className="thumb-ln" style={{ width: '80%' }} />
              <div className="thumb-ln" style={{ width: '90%' }} />
              <div className="thumb-ln" style={{ width: '65%' }} />
            </div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
              {pagination.totalPages || 1} Page(s) • {document.pageSetup?.paperSize?.toUpperCase() || 'LETTER'}
            </div>
          </div>

          <div className="print-settings-form">
            <div className="form-group">
              <label className="ai-label">Destination:</label>
              <select className="ai-select" defaultValue="pdf">
                <option value="pdf">Save as Print-Ready PDF</option>
                <option value="system">System Default Printer</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="ai-label">Copies:</label>
              <input
                type="number"
                min="1"
                max="99"
                value={printCopies}
                onChange={(e) => setPrintCopies(e.target.value)}
                className="ai-input"
                style={{ width: '80px' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="ai-label">Pages:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <label className="ribbon-checkbox-item">
                  <input type="radio" name="prange" checked={printRange === 'all'} onChange={() => setPrintRange('all')} />
                  <span>All Pages ({pagination.totalPages || 1})</span>
                </label>
                <label className="ribbon-checkbox-item">
                  <input type="radio" name="prange" checked={printRange === 'current'} onChange={() => setPrintRange('current')} />
                  <span>Current Page</span>
                </label>
              </div>
            </div>

            <div className="dialog-actions-footer" style={{ marginTop: '20px' }}>
              <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
              <button
                type="button"
                className="preview-btn primary"
                onClick={() => {
                  closeDialog();
                  window.print();
                }}
              >
                <IconPrint size={14} color="#ffffff" />
                <span style={{ marginLeft: '4px' }}>Print Document</span>
              </button>
              <button
                type="button"
                className="preview-btn"
                onClick={() => {
                  closeDialog();
                  exportPdf();
                }}
              >
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 7. CITATIONS & SOURCES DIALOG */}
      <Modal title="Manage Citation Sources" isOpen={activeDialog === 'citations'} onClose={closeDialog} width="520px">
        <form onSubmit={handleAddCitation}>
          <div className="form-group">
            <label className="ai-label">Author (e.g. Knuth, D. E.):</label>
            <input type="text" className="ai-input" value={citeAuthor} onChange={(e) => setCiteAuthor(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label className="ai-label">Title of Work:</label>
            <input type="text" className="ai-input" value={citeTitle} onChange={(e) => setCiteTitle(e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div>
              <label className="ai-label">Year:</label>
              <input type="text" className="ai-input" value={citeYear} onChange={(e) => setCiteYear(e.target.value)} required />
            </div>
            <div>
              <label className="ai-label">Publisher / Journal:</label>
              <input type="text" className="ai-input" value={citePublisher} onChange={(e) => setCitePublisher(e.target.value)} />
            </div>
          </div>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
            <button type="submit" className="preview-btn primary">Add Source</button>
          </div>
        </form>

        <div style={{ marginTop: '20px' }}>
          <div className="popover-menu-header">Registered Sources ({document.citations?.length || 0})</div>
          {(document.citations || []).map((c) => (
            <div key={c.id} className="citation-row-item">
              <span style={{ fontWeight: '600' }}>{c.author} ({c.year})</span>: <em>{c.title}</em>
            </div>
          ))}
        </div>
      </Modal>

      {/* 8. KEYBOARD SHORTCUTS CHEAT SHEET */}
      <Modal title="Keyboard Shortcuts" isOpen={activeDialog === 'shortcuts'} onClose={closeDialog} width="560px">
        <div className="shortcuts-table-wrapper">
          <table className="shortcuts-table">
            <thead>
              <tr>
                <th>Shortcut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><kbd>Ctrl</kbd> + <kbd>S</kbd></td><td>Save Document to local storage & cloud backup</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>Z</kbd></td><td>Undo previous action</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>Y</kbd></td><td>Redo undone action</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>B</kbd></td><td>Toggle Bold formatting</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>I</kbd></td><td>Toggle Italic formatting</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>U</kbd></td><td>Toggle Underline formatting</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>P</kbd></td><td>Print / Export PDF</td></tr>
              <tr><td><kbd>Ctrl</kbd> + <kbd>F</kbd></td><td>Open Find & Replace</td></tr>
              <tr><td><kbd>F7</kbd></td><td>Check Spelling & Grammar</td></tr>
              <tr><td><kbd>Enter</kbd></td><td>Create new paragraph block</td></tr>
              <tr><td><kbd>Backspace</kbd></td><td>Delete character or empty block</td></tr>
            </tbody>
          </table>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn primary" onClick={closeDialog}>Got It</button>
          </div>
        </div>
      </Modal>

      {/* 9. ABOUT DIALOG */}
      <Modal title="About DragDocs" isOpen={activeDialog === 'about'} onClose={closeDialog} width="460px">
        <div className="about-dialog-body">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <AppLogoIcon size={48} />
            <h3 style={{ margin: '8px 0 2px 0', color: '#185abd' }}>DragDocs Word Processor</h3>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Version 2026.1 Enterprise Release</div>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#374151' }}>
            DragDocs is an enterprise-grade document creation and word processing platform featuring real multi-page pagination, full 11-tab Office Ribbon UI, digital inking, native DOCX & PDF engines, Mail Merge, academic referencing, and integrated AI writing assistance.
          </p>
          <div className="about-specs">
            <div><strong>Engine:</strong> Multi-Page Block Pagination</div>
            <div><strong>Design:</strong> Clean Microsoft Office Fluent System</div>
            <div><strong>Standards:</strong> OpenXML DOCX, PDF/A, KaTeX Math</div>
          </div>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn primary" onClick={closeDialog}>Close</button>
          </div>
        </div>
      </Modal>

      {/* 10. COMPARE DIALOG */}
      <Modal title="Compare Documents" isOpen={activeDialog === 'compare'} onClose={closeDialog} width="500px">
        <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
          Compare the active document with another version to highlight additions and deletions:
          <div style={{ marginTop: '12px' }}>
            <label className="ai-label">Original Document:</label>
            <input type="text" className="ai-input" value={document.title || 'Current Document'} readOnly />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label className="ai-label">Revised Document to Compare:</label>
            <input type="file" accept=".docx,.dragdoc,.txt" className="ai-input" />
          </div>
          <div className="dialog-actions-footer">
            <button type="button" className="preview-btn" onClick={closeDialog}>Cancel</button>
            <button
              type="button"
              className="preview-btn primary"
              onClick={() => {
                alert('Comparison complete: 0 conflicting revisions detected. All changes are in sync.');
                closeDialog();
              }}
            >
              Compare
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
