/**
 * PDF Studio Left Thumbnails Navigation Panel
 * Page cards, live miniature page previews, rotation, reordering, and page insertion.
 */

import React from 'react';
import {
  IconPlus,
  IconTrash,
  IconRotateCw,
  IconStamp,
  IconSignature
} from '../common/SvgIcons';

export function PdfThumbnailsPanel({
  pdfDoc,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onRotatePage,
  onMovePageUp,
  onMovePageDown
}) {
  return (
    <div className="pdf-thumbnails-panel">
      {/* Panel Header */}
      <div className="pdf-thumbnails-header">
        <span className="pdf-thumbnails-title">Pages ({pdfDoc.pages.length})</span>
        <button
          className="pdf-add-page-btn"
          title="Add Blank Page"
          onClick={onAddPage}
        >
          <IconPlus size={14} color="#d9381e" />
          <span>Add</span>
        </button>
      </div>

      {/* Thumbnails List */}
      <div className="pdf-thumbnails-list">
        {pdfDoc.pages.map((page, idx) => {
          const isActive = idx === activePageIndex;
          const rotationAngle = page.rotation || 0;

          return (
            <div
              key={page.pageNumber || idx}
              className={`pdf-thumbnail-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPage(idx)}
            >
              {/* Card Header & Page Number */}
              <div className="pdf-thumbnail-top">
                <span className="pdf-thumbnail-badge">Page {idx + 1}</span>
                <div className="pdf-thumbnail-quick-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="pdf-thumb-action-btn"
                    title="Rotate 90° Clockwise"
                    onClick={() => onRotatePage(idx, 90)}
                  >
                    <IconRotateCw size={12} color="#64748b" />
                  </button>
                  {pdfDoc.pages.length > 1 && (
                    <button
                      className="pdf-thumb-action-btn delete-btn"
                      title="Delete Page"
                      onClick={() => onDeletePage(idx)}
                    >
                      <IconTrash size={12} color="#ef4444" />
                    </button>
                  )}
                </div>
              </div>

              {/* Miniature SVG Preview */}
              <div
                className="pdf-thumbnail-preview-frame"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: 'transform 0.2s ease'
                }}
              >
                <div className="pdf-mini-preview-content">
                  <div className="pdf-mini-line title-line" />
                  <div className="pdf-mini-line sub-line" />
                  <div className="pdf-mini-divider" />
                  <div className="pdf-mini-block" />
                  <div className="pdf-mini-block short" />
                  <div className="pdf-mini-block" />

                  {/* Indicator for stamps or signatures */}
                  {page.annotations?.some(a => a.type === 'stamp') && (
                    <div className="pdf-mini-badge stamp">
                      <IconStamp size={10} color="#107c41" />
                    </div>
                  )}
                  {page.annotations?.some(a => a.type === 'signature') && (
                    <div className="pdf-mini-badge sig">
                      <IconSignature size={10} color="#185abd" />
                    </div>
                  )}
                </div>
              </div>

              {/* Page Order Reorder Buttons */}
              <div className="pdf-thumbnail-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  className="pdf-thumb-order-btn"
                  title="Move Page Up"
                  disabled={idx === 0}
                  onClick={() => onMovePageUp(idx)}
                >
                  ▲
                </button>
                <button
                  className="pdf-thumb-order-btn"
                  title="Move Page Down"
                  disabled={idx === pdfDoc.pages.length - 1}
                  onClick={() => onMovePageDown(idx)}
                >
                  ▼
                </button>
                <span className="pdf-thumbnail-caption">{page.title || `Page ${idx + 1}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
