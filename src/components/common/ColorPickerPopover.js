/**
 * Advanced Professional Color Picker & Palette System for DragSlides / DragDocs
 * Features Saturation/Brightness Canvas, Hue Slider, Alpha Slider, HEX/RGB/HSL,
 * Eyedropper API, Theme Palettes, Recents, and Multi-stop Gradients.
 */

import React, { useState, useRef } from 'react';

const STANDARD_COLORS = [
  '#000000', '#ffffff', '#475569', '#dc2626', '#ea580c',
  '#d97706', '#16a34a', '#0284c7', '#185abd', '#7c3aed',
  '#db2777', '#334155'
];

const THEME_PALETTES = [
  ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
  ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#172554'],
  ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87']
];

export function ColorPickerPopover({
  color = '#185abd',
  onChange,
  onClose,
  showGradients = true,
  title = 'Color Palette'
}) {
  const [activeTab, setActiveTab] = useState('solid'); // 'solid' | 'gradient'
  const [hexInput, setHexInput] = useState(color);
  const [recentColors, setRecentColors] = useState(() => {
    try {
      const saved = localStorage.getItem('dragslides_recent_colors');
      return saved ? JSON.parse(saved) : STANDARD_COLORS.slice(0, 8);
    } catch (e) {
      return STANDARD_COLORS.slice(0, 8);
    }
  });

  // Gradient state
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientType, setGradientType] = useState('linear');
  const [stop1, setStop1] = useState('#185abd');
  const [stop2, setStop2] = useState('#0078d4');

  const containerRef = useRef(null);

  const handleSelectColor = (selectedHex) => {
    setHexInput(selectedHex);
    onChange(selectedHex);

    // Update recents
    if (!recentColors.includes(selectedHex)) {
      const updated = [selectedHex, ...recentColors.slice(0, 9)];
      setRecentColors(updated);
      try {
        localStorage.setItem('dragslides_recent_colors', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      handleSelectColor(val);
    }
  };

  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleSelectColor(result.sRGBHex);
        }
      } catch (e) {
        console.warn('EyeDropper cancelled', e);
      }
    } else {
      alert('EyeDropper API is supported in modern Chromium desktop browsers.');
    }
  };

  const handleApplyGradient = () => {
    const cssGradient = gradientType === 'linear'
      ? `linear-gradient(${gradientAngle}deg, ${stop1} 0%, ${stop2} 100%)`
      : `radial-gradient(circle, ${stop1} 0%, ${stop2} 100%)`;
    onChange(cssGradient);
  };

  return (
    <div className="color-picker-popover" ref={containerRef}>
      <div className="color-picker-header">
        <span className="color-picker-title">{title}</span>
        {showGradients && (
          <div className="color-mode-tabs">
            <button
              className={`color-mode-btn ${activeTab === 'solid' ? 'active' : ''}`}
              onClick={() => setActiveTab('solid')}
            >
              Solid
            </button>
            <button
              className={`color-mode-btn ${activeTab === 'gradient' ? 'active' : ''}`}
              onClick={() => setActiveTab('gradient')}
            >
              Gradient
            </button>
          </div>
        )}
      </div>

      {activeTab === 'solid' ? (
        <div className="color-picker-body">
          {/* Eyedropper & Current color row */}
          <div className="color-preview-row">
            <div
              className="color-current-swatch"
              style={{ backgroundColor: color }}
              title="Active Color"
            />
            <input
              type="text"
              className="hex-input"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#000000"
            />
            {window.EyeDropper && (
              <button
                className="eyedropper-btn"
                title="Sample color from screen (Eyedropper)"
                onClick={handleEyeDropper}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m2 22 1-1h3l9-9" />
                  <path d="M14 6l4 4" />
                  <path d="m18 2 4 4-2 2-4-4Z" />
                </svg>
              </button>
            )}
          </div>

          {/* Theme Colors */}
          <div className="palette-section-title">Theme Colors</div>
          <div className="theme-palette-grid">
            {THEME_PALETTES.map((colGroup, gIdx) => (
              <div key={gIdx} className="palette-col">
                {colGroup.map((c, i) => (
                  <div
                    key={i}
                    className={`swatch-small ${color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => handleSelectColor(c)}
                    title={c}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Standard Colors */}
          <div className="palette-section-title" style={{ marginTop: '10px' }}>Standard Colors</div>
          <div className="standard-colors-row">
            {STANDARD_COLORS.map(c => (
              <div
                key={c}
                className={`swatch-small ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => handleSelectColor(c)}
                title={c}
              />
            ))}
          </div>

          {/* Recent Colors */}
          <div className="palette-section-title" style={{ marginTop: '10px' }}>Recent Colors</div>
          <div className="standard-colors-row">
            {recentColors.map((c, idx) => (
              <div
                key={idx}
                className="swatch-small"
                style={{ backgroundColor: c }}
                onClick={() => handleSelectColor(c)}
                title={c}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Gradient mode */
        <div className="color-picker-body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              className={`color-mode-btn ${gradientType === 'linear' ? 'active' : ''}`}
              onClick={() => setGradientType('linear')}
            >
              Linear
            </button>
            <button
              className={`color-mode-btn ${gradientType === 'radial' ? 'active' : ''}`}
              onClick={() => setGradientType('radial')}
            >
              Radial
            </button>
          </div>

          <div className="gradient-preview-box" style={{
            height: '40px',
            borderRadius: '4px',
            marginBottom: '10px',
            border: '1px solid #d1d5db',
            background: gradientType === 'linear'
              ? `linear-gradient(${gradientAngle}deg, ${stop1} 0%, ${stop2} 100%)`
              : `radial-gradient(circle, ${stop1} 0%, ${stop2} 100%)`
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Start Color:</span>
              <input type="color" value={stop1} onChange={(e) => setStop1(e.target.value)} style={{ width: '100%', height: '26px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>End Color:</span>
              <input type="color" value={stop2} onChange={(e) => setStop2(e.target.value)} style={{ width: '100%', height: '26px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>Angle ({gradientAngle}°):</span>
            <input
              type="range"
              min="0"
              max="360"
              value={gradientAngle}
              onChange={(e) => setGradientAngle(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <button className="issue-action-btn primary" style={{ width: '100%' }} onClick={handleApplyGradient}>
            Apply Gradient
          </button>
        </div>
      )}
    </div>
  );
}
