/**
 * PDF Studio Document Viewer Canvas
 * Multi-page continuous rendering, interactive annotation layers,
 * real form field inputs, sticky notes commentary, stamps, and digital signatures.
 */

import React, { useState } from 'react';
import {
  IconStickyNote,
  IconClose,
  IconCheck
} from '../common/SvgIcons';

export function PdfViewerCanvas({
  pdfDoc,
  activeTool,
  zoom = 100,
  activeStampType,
  inkColor = '#ef4444',
  inkWidth = 2.5,
  onAddAnnotation,
  onRemoveAnnotation,
  onUpdateFormField,
  onSelectPage,
  onOpenSignatureModal
}) {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [isDrawingInk, setIsDrawingInk] = useState(false);
  const [drawingPageIdx, setDrawingPageIdx] = useState(null);

  const scale = (zoom || 100) / 100;

  // Handle click on page canvas for stamp / note placement
  const handlePageClick = (pageIdx, e) => {
    onSelectPage(pageIdx);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / scale;
    const clickY = (e.clientY - rect.top) / scale;

    if (activeTool === 'stickyNote') {
      const newNote = {
        type: 'stickyNote',
        x: Math.round(clickX),
        y: Math.round(clickY),
        comment: 'Please review and verify this section.',
        author: 'Reviewer',
        date: new Date().toISOString().split('T')[0],
        color: '#fef08a'
      };
      onAddAnnotation(pageIdx, newNote);
    } else if (activeTool === 'stamp') {
      const newStamp = {
        type: 'stamp',
        stampType: activeStampType || 'APPROVED',
        x: Math.round(clickX - 60),
        y: Math.round(clickY - 20),
        width: 140,
        height: 44,
        color: activeStampType === 'CONFIDENTIAL' ? '#dc2626' : '#107c41',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: 'Legal Counsel'
      };
      onAddAnnotation(pageIdx, newStamp);
    } else if (activeTool === 'signature') {
      if (onOpenSignatureModal) onOpenSignatureModal();
    }
  };

  // Freehand Ink Drawing
  const handleMouseDown = (pageIdx, e) => {
    if (activeTool !== 'freehand') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setIsDrawingInk(true);
    setDrawingPageIdx(pageIdx);
    setDrawingPoints([{ x, y }]);
  };

  const handleMouseMove = (pageIdx, e) => {
    if (!isDrawingInk || activeTool !== 'freehand' || drawingPageIdx !== pageIdx) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setDrawingPoints(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = (pageIdx) => {
    if (isDrawingInk && activeTool === 'freehand' && drawingPoints.length > 1) {
      const inkAnnotation = {
        type: 'freehand',
        points: drawingPoints,
        color: inkColor,
        strokeWidth: inkWidth
      };
      onAddAnnotation(pageIdx, inkAnnotation);
    }
    setIsDrawingInk(false);
    setDrawingPoints([]);
    setDrawingPageIdx(null);
  };

  return (
    <div className={`pdf-canvas-container tool-${activeTool}`}>
      <div className="pdf-pages-scroll-column">
        {pdfDoc.pages.map((page, pageIdx) => {
          const rotationAngle = page.rotation || 0;
          const pageWidth = page.width || 612;
          const pageHeight = page.height || 792;

          return (
            <div
              key={page.pageNumber || pageIdx}
              className={`pdf-page-sheet-wrapper ${pdfDoc.activePageIndex === pageIdx ? 'active' : ''}`}
              style={{
                width: `${pageWidth * scale}px`,
                height: `${pageHeight * scale}px`
              }}
            >
              {/* Scaled & Rotated Page Frame */}
              <div
                className="pdf-page-sheet"
                style={{
                  width: `${pageWidth}px`,
                  height: `${pageHeight}px`,
                  transform: `scale(${scale}) rotate(${rotationAngle}deg)`,
                  transformOrigin: 'top left'
                }}
                onClick={(e) => handlePageClick(pageIdx, e)}
                onMouseDown={(e) => handleMouseDown(pageIdx, e)}
                onMouseMove={(e) => handleMouseMove(pageIdx, e)}
                onMouseUp={() => handleMouseUp(pageIdx)}
              >
                {/* 1. Static Document Content Blocks */}
                {(page.contentBlocks || []).map((block, bIdx) => {
                  if (block.type === 'header') {
                    return (
                      <div
                        key={bIdx}
                        className="pdf-content-header"
                        style={{ left: `${block.x}px`, top: `${block.y}px`, fontSize: `${block.size || 9}px` }}
                      >
                        {block.text}
                      </div>
                    );
                  }
                  if (block.type === 'title') {
                    return (
                      <h1
                        key={bIdx}
                        className="pdf-content-title"
                        style={{ left: `${block.x}px`, top: `${block.y}px`, fontSize: `${block.size || 18}px` }}
                      >
                        {block.text}
                      </h1>
                    );
                  }
                  if (block.type === 'subtitle' || block.type === 'heading') {
                    return (
                      <h2
                        key={bIdx}
                        className="pdf-content-heading"
                        style={{ left: `${block.x}px`, top: `${block.y}px`, fontSize: `${block.size || 12}px` }}
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === 'divider') {
                    return (
                      <hr
                        key={bIdx}
                        className="pdf-content-divider"
                        style={{ left: `${block.x1}px`, top: `${block.y1}px`, width: `${block.x2 - block.x1}px` }}
                      />
                    );
                  }
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={bIdx}
                        className="pdf-content-paragraph"
                        style={{
                          left: `${block.x}px`,
                          top: `${block.y}px`,
                          maxWidth: `${block.maxWidth || 532}px`,
                          fontSize: `${block.size || 10}px`,
                          lineHeight: `${block.lineHeight || 15}px`,
                          fontWeight: block.isBold ? 'bold' : 'normal',
                          color: block.color || '#334155'
                        }}
                      >
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'table') {
                    return (
                      <div
                        key={bIdx}
                        className="pdf-content-table-wrap"
                        style={{ left: `${block.x}px`, top: `${block.y}px`, width: `${block.width}px` }}
                      >
                        <table className="pdf-embedded-table">
                          <thead>
                            <tr>
                              {block.headers.map((h, hIdx) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* 2. Annotations: Highlights */}
                {(page.annotations || []).filter(a => a.type === 'highlight').map(a => (
                  <div
                    key={a.id}
                    className="pdf-annotation-highlight"
                    style={{
                      left: `${a.x}px`,
                      top: `${a.y}px`,
                      width: `${a.width}px`,
                      height: `${a.height}px`,
                      backgroundColor: a.color || 'rgba(254, 240, 138, 0.55)'
                    }}
                    title={`Highlight by ${a.author || 'User'}`}
                  >
                    <button
                      className="pdf-ann-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAnnotation(pageIdx, a.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* 3. Annotations: Stamps */}
                {(page.annotations || []).filter(a => a.type === 'stamp').map(a => (
                  <div
                    key={a.id}
                    className="pdf-annotation-stamp"
                    style={{
                      left: `${a.x}px`,
                      top: `${a.y}px`,
                      width: `${a.width}px`,
                      height: `${a.height}px`,
                      borderColor: a.color || '#107c41',
                      color: a.color || '#107c41'
                    }}
                  >
                    <div className="pdf-stamp-title">{a.stampType}</div>
                    <div className="pdf-stamp-meta">{a.user} • {a.timestamp}</div>
                    <button
                      className="pdf-ann-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAnnotation(pageIdx, a.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* 4. Annotations: Signatures */}
                {(page.annotations || []).filter(a => a.type === 'signature').map(a => (
                  <div
                    key={a.id}
                    className="pdf-annotation-signature-block"
                    style={{
                      left: `${a.x}px`,
                      top: `${a.y}px`,
                      width: `${a.width}px`,
                      height: `${a.height}px`
                    }}
                  >
                    {a.signatureDataUrl ? (
                      <img src={a.signatureDataUrl} alt="Signature" className="pdf-sig-image" />
                    ) : (
                      <div className="pdf-sig-cursive-name">{a.signerName}</div>
                    )}
                    <div className="pdf-sig-meta-line">
                      <span>Digitally Attested: {a.signedDate}</span>
                      <span className="pdf-sig-verified-pill">
                        <IconCheck size={11} color="#16a34a" /> Verified
                      </span>
                    </div>
                    <button
                      className="pdf-ann-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAnnotation(pageIdx, a.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* 5. Annotations: Sticky Notes */}
                {(page.annotations || []).filter(a => a.type === 'stickyNote').map(a => {
                  const isOpen = activeNoteId === a.id;
                  return (
                    <div
                      key={a.id}
                      className="pdf-sticky-note-pin-wrap"
                      style={{ left: `${a.x}px`, top: `${a.y}px` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNoteId(isOpen ? null : a.id);
                      }}
                    >
                      <div className="pdf-sticky-pin-icon" style={{ backgroundColor: a.color || '#fef08a' }}>
                        <IconStickyNote size={16} color="#854d0e" />
                      </div>

                      {isOpen && (
                        <div className="pdf-sticky-note-popover" onClick={(e) => e.stopPropagation()}>
                          <div className="pdf-note-popover-header">
                            <span className="pdf-note-author">{a.author || 'Reviewer'}</span>
                            <span className="pdf-note-date">{a.date}</span>
                            <button className="pdf-note-close" onClick={() => setActiveNoteId(null)}>
                              <IconClose size={12} />
                            </button>
                          </div>
                          <p className="pdf-note-text">{a.comment}</p>
                          <div className="pdf-note-footer">
                            <button
                              className="pdf-note-resolve-btn"
                              onClick={() => onRemoveAnnotation(pageIdx, a.id)}
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 6. Annotations: Freehand Ink (SVG Overlay) */}
                <svg className="pdf-freehand-svg-overlay">
                  {(page.annotations || []).filter(a => a.type === 'freehand').map(a => (
                    <path
                      key={a.id}
                      d={a.points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
                      fill="none"
                      stroke={a.color || '#ef4444'}
                      strokeWidth={a.strokeWidth || 2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                  {/* Current drawing path */}
                  {isDrawingInk && drawingPageIdx === pageIdx && drawingPoints.length > 1 && (
                    <path
                      d={drawingPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
                      fill="none"
                      stroke={inkColor}
                      strokeWidth={inkWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                {/* 7. Interactive Form Fields */}
                {(page.formFields || []).map(f => {
                  if (f.type === 'text') {
                    return (
                      <div
                        key={f.id}
                        className="pdf-form-field-wrapper"
                        style={{ left: `${f.x}px`, top: `${f.y}px`, width: `${f.width}px`, height: `${f.height}px` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          className="pdf-form-input-text"
                          placeholder={f.label}
                          value={f.value || ''}
                          onChange={(e) => onUpdateFormField(pageIdx, f.id, e.target.value)}
                        />
                      </div>
                    );
                  }
                  if (f.type === 'checkbox') {
                    return (
                      <label
                        key={f.id}
                        className="pdf-form-field-checkbox-wrap"
                        style={{ left: `${f.x}px`, top: `${f.y}px`, width: `${f.width}px` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="pdf-form-checkbox"
                          checked={Boolean(f.checked || f.value)}
                          onChange={(e) => onUpdateFormField(pageIdx, f.id, e.target.checked)}
                        />
                        <span className="pdf-form-check-label">{f.label}</span>
                      </label>
                    );
                  }
                  if (f.type === 'select') {
                    return (
                      <div
                        key={f.id}
                        className="pdf-form-field-wrapper"
                        style={{ left: `${f.x}px`, top: `${f.y}px`, width: `${f.width}px`, height: `${f.height}px` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="pdf-form-select"
                          value={f.value || ''}
                          onChange={(e) => onUpdateFormField(pageIdx, f.id, e.target.value)}
                        >
                          {(f.options || []).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (f.type === 'date') {
                    return (
                      <div
                        key={f.id}
                        className="pdf-form-field-wrapper"
                        style={{ left: `${f.x}px`, top: `${f.y}px`, width: `${f.width}px`, height: `${f.height}px` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="date"
                          className="pdf-form-input-date"
                          value={f.value || ''}
                          onChange={(e) => onUpdateFormField(pageIdx, f.id, e.target.value)}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
