/**
 * Watermark and Page Border Renderer
 */

import React from 'react';

export function WatermarkRenderer({ watermark }) {
  if (!watermark || watermark.type !== 'text' || !watermark.text) {
    return null;
  }

  return (
    <div className="page-watermark-overlay" aria-hidden="true">
      <div
        className="watermark-text"
        style={{
          color: watermark.color || '#d1d5db',
          opacity: watermark.opacity || 0.25,
          transform: `rotate(${watermark.angle || -45}deg)`
        }}
      >
        {watermark.text}
      </div>
    </div>
  );
}

export function PageBorderRenderer({ pageBorder, width, height }) {
  if (!pageBorder || !pageBorder.enabled) {
    return null;
  }

  return (
    <div
      className="page-border-overlay"
      style={{
        width: `${width - 48}px`,
        height: `${height - 48}px`,
        border: `${pageBorder.width || 1}px ${pageBorder.style || 'solid'} ${pageBorder.color || '#000000'}`,
        top: '24px',
        left: '24px'
      }}
      aria-hidden="true"
    />
  );
}

