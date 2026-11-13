/**
 * Horizontal Document Ruler Component
 * Accurately displays inch tick marks, left/right margin limits, and indent indicators.
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';

export function Ruler({ pageWidth = 816, margins = { left: 96, right: 96 }, zoom = 100 }) {
  const { showRuler } = useDocument();

  if (!showRuler) return null;

  // 96 DPI: 1 inch = 96px
  const totalInches = Math.ceil(pageWidth / 96);
  const scale = zoom / 100;

  const ticks = [];
  for (let i = 0; i <= totalInches * 4; i++) {
    const isMajor = i % 4 === 0;
    const isMedium = i % 2 === 0;
    const pos = (i * 24); // 24px = 0.25 inch
    if (pos <= pageWidth) {
      ticks.push({
        pos,
        isMajor,
        isMedium,
        inch: i / 4
      });
    }
  }

  return (
    <div className="dragdocs-ruler-container" style={{ width: `${pageWidth * scale}px` }}>
      <div className="ruler-bar" style={{ width: `${pageWidth}px`, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* Left Margin Shading */}
        <div className="ruler-margin-zone" style={{ width: `${margins.left}px`, left: 0 }} />

        {/* Right Margin Shading */}
        <div className="ruler-margin-zone" style={{ width: `${margins.right}px`, right: 0 }} />

        {/* Ticks & Numbers */}
        {ticks.map((t, idx) => (
          <div
            key={idx}
            className={`ruler-tick ${t.isMajor ? 'major' : t.isMedium ? 'medium' : 'minor'}`}
            style={{ left: `${t.pos}px` }}
          >
            {t.isMajor && t.inch > 0 && (
              <span className="ruler-num">{t.inch}</span>
            )}
          </div>
        ))}

        {/* Left Margin Marker */}
        <div className="ruler-marker left-marker" style={{ left: `${margins.left}px` }} title="Left Margin">
          <div className="marker-down-arrow" />
        </div>

        {/* Right Margin Marker */}
        <div className="ruler-marker right-marker" style={{ left: `${pageWidth - margins.right}px` }} title="Right Margin">
          <div className="marker-down-arrow" />
        </div>
      </div>
    </div>
  );
}

