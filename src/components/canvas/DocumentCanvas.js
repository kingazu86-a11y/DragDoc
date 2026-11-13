/**
 * Multi-Page Document Canvas
 * Hosts the horizontal ruler, scaled paper viewport, smooth page rendering, and view mode adaptations.
 */

import React, { useRef } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { PageRenderer } from './PageRenderer';
import { Ruler } from '../shell/Ruler';

export function DocumentCanvas() {
  const {
    pagination,
    zoom,
    activeView
  } = useDocument();

  const canvasContainerRef = useRef(null);
  const scale = zoom / 100;

  const {
    pages = [],
    totalPages = 1,
    pageWidth = 816,
    margins = { left: 96, right: 96 }
  } = pagination;

  return (
    <div className={`dragdocs-canvas-workspace view-${activeView}`}>
      {/* Horizontal Ruler at top */}
      <Ruler
        pageWidth={pageWidth}
        margins={margins}
        zoom={zoom}
      />

      {/* Main Scrollable Canvas Viewport */}
      <div
        ref={canvasContainerRef}
        className="canvas-scroll-viewport"
      >
        <div
          className="canvas-zoom-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center'
          }}
        >
          <div className={`pages-stack ${activeView === 'read' ? 'read-mode-stack' : ''}`}>
            {pages.map((page, idx) => (
              <PageRenderer
                key={page.pageNumber || idx}
                page={page}
                pageIndex={idx + 1}
                totalPages={totalPages}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

