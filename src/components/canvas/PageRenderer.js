/**
 * Physical Page Sheet Renderer
 * Renders an independent physical sheet of paper with true margins,
 * header, content blocks, footnotes, footer, watermark, and inking layer.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';
import { PageHeader, PageFooter } from './HeaderFooterRenderer';
import { WatermarkRenderer, PageBorderRenderer } from './WatermarkRenderer';
import { DrawingOverlay } from './DrawingOverlay';
import { BlockEditor } from '../editor/BlockEditor';

export function PageRenderer({ page, pageIndex, totalPages }) {
  const { document, showGridlines } = useDocument();

  const {
    pageWidth = 816,
    pageHeight = 1056,
    margins = { top: 96, bottom: 96, left: 96, right: 96 },
    blocks = []
  } = page;

  const isFirstPage = pageIndex === 1;
  const pageSetup = document.pageSetup || {};
  const isColumns = (pageSetup.columns || 1) > 1;

  // Filter footnotes relevant to blocks on this page
  const pageFootnotes = (document.footnotes || []).filter(fn => {
    return blocks.some(b => b.id === fn.blockId);
  });

  return (
    <div
      className="dragdocs-page-container"
      data-page-number={pageIndex}
    >
      <div
        className={`dragdocs-page-sheet ${showGridlines ? 'show-gridlines' : ''}`}
        style={{
          width: `${pageWidth}px`,
          height: `${pageHeight}px`,
          backgroundColor: pageSetup.pageColor || '#ffffff'
        }}
      >
        {/* Watermark */}
        <WatermarkRenderer watermark={pageSetup.watermark} />

        {/* Page Border */}
        <PageBorderRenderer
          pageBorder={pageSetup.pageBorder}
          width={pageWidth}
          height={pageHeight}
        />

        {/* Vector Inking Canvas Layer */}
        <DrawingOverlay
          pageIndex={pageIndex}
          width={pageWidth}
          height={pageHeight}
        />

        {/* Header Region */}
        <div
          className="page-header-region"
          style={{
            top: `${Math.max(16, margins.top - 48)}px`,
            left: `${margins.left}px`,
            right: `${margins.right}px`
          }}
        >
          <PageHeader
            pageNumber={pageIndex}
            totalPages={totalPages}
            isFirstPage={isFirstPage}
          />
        </div>

        {/* Content Body Region */}
        <div
          className={`page-content-region ${isColumns ? `columns-count-${pageSetup.columns}` : ''}`}
          style={{
            top: `${margins.top}px`,
            bottom: `${margins.bottom}px`,
            left: `${margins.left}px`,
            right: `${margins.right}px`
          }}
        >
          {blocks.map(block => (
            <BlockEditor
              key={block.id}
              block={block}
              pageIndex={pageIndex}
            />
          ))}

          {/* Footnotes bottom section */}
          {pageFootnotes.length > 0 && (
            <div className="page-footnotes-container">
              <div className="footnote-separator" />
              {pageFootnotes.map(fn => (
                <div key={fn.id} className="footnote-item">
                  <sup className="footnote-num">{fn.id}</sup>
                  <span className="footnote-text">{fn.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Region */}
        <div
          className="page-footer-region"
          style={{
            bottom: `${Math.max(16, margins.bottom - 48)}px`,
            left: `${margins.left}px`,
            right: `${margins.right}px`
          }}
        >
          <PageFooter
            pageNumber={pageIndex}
            totalPages={totalPages}
            isFirstPage={isFirstPage}
          />
        </div>
      </div>
    </div>
  );
}

