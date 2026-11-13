/**
 * Ribbon Tab: DESIGN
 * Document themes, paragraph spacing presets, watermarks, page background color, and page borders.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { DOCUMENT_THEMES } from '../../engine/documentModel';
import { IconWatermark, IconPageBorder } from '../common/SvgIcons';

const SPACING_PRESETS = [
  { id: 'compact', label: 'Compact', before: 0, after: 3, line: 1.0 },
  { id: 'tight', label: 'Tight', before: 0, after: 6, line: 1.15 },
  { id: 'open', label: 'Open', before: 4, after: 8, line: 1.25 },
  { id: 'relaxed', label: 'Relaxed', before: 6, after: 12, line: 1.5 },
  { id: 'double', label: 'Double', before: 8, after: 16, line: 2.0 }
];

const WATERMARK_PRESETS = ['DRAFT', 'CONFIDENTIAL', 'DO NOT COPY', 'SAMPLE', 'INTERNAL USE'];

export function RibbonTabDesign() {
  const {
    document,
    setDocument,
    setActiveDialog
  } = useDocument();

  const [watermarkOpen, setWatermarkOpen] = useState(false);
  const [pageColorOpen, setPageColorOpen] = useState(false);

  const pageColors = [
    '#ffffff', '#fdfbf7', '#f8fafc', '#f1f5f9', '#fefce8', '#f0fdf4', '#eff6ff', '#faf5ff'
  ];

  const handleSelectTheme = (themeKey) => {
    const selectedTheme = DOCUMENT_THEMES[themeKey];
    if (!selectedTheme) return;

    setDocument(doc => ({
      ...doc,
      theme: selectedTheme,
      blocks: (doc.blocks || []).map(b => {
        if (b.type === 'heading') {
          return {
            ...b,
            textRuns: (b.textRuns || []).map(r => ({
              ...r,
              fontColor: b.level === 1 ? selectedTheme.primary : selectedTheme.secondary,
              fontFamily: selectedTheme.fontHeading
            }))
          };
        }
        if (b.type === 'paragraph') {
          return {
            ...b,
            textRuns: (b.textRuns || []).map(r => ({
              ...r,
              fontFamily: selectedTheme.fontBody
            }))
          };
        }
        return b;
      })
    }));
  };

  const handleApplySpacingPreset = (preset) => {
    setDocument(doc => ({
      ...doc,
      blocks: (doc.blocks || []).map(b => {
        if (b.type === 'paragraph') {
          return {
            ...b,
            spacingBefore: preset.before,
            spacingAfter: preset.after,
            lineSpacing: preset.line
          };
        }
        return b;
      })
    }));
  };

  const handleSetWatermark = (text) => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        watermark: {
          type: text ? 'text' : 'none',
          text: text || '',
          color: '#d1d5db',
          opacity: 0.28,
          angle: -45
        }
      }
    }));
    setWatermarkOpen(false);
  };

  const handleSetPageColor = (color) => {
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        pageColor: color
      }
    }));
    setPageColorOpen(false);
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Document Formatting Themes */}
      <div className="ribbon-group">
        <div className="theme-selector-list">
          {Object.entries(DOCUMENT_THEMES).map(([key, th]) => (
            <button
              key={key}
              className={`theme-badge-btn ${document.theme?.id === th.id ? 'active' : ''}`}
              onClick={() => handleSelectTheme(key)}
              title={th.name}
            >
              <div className="theme-badge-color" style={{ backgroundColor: th.primary }} />
              <span className="theme-badge-label">{th.name}</span>
            </button>
          ))}
        </div>
        <span className="ribbon-group-title">Document Themes</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Paragraph Spacing Presets */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          <div className="ribbon-control-row">
            {SPACING_PRESETS.slice(0, 3).map(sp => (
              <button
                key={sp.id}
                className="ribbon-tool-btn"
                onClick={() => handleApplySpacingPreset(sp)}
                title={`Set ${sp.label} paragraph spacing`}
              >
                <span>{sp.label}</span>
              </button>
            ))}
          </div>
          <div className="ribbon-control-row">
            {SPACING_PRESETS.slice(3).map(sp => (
              <button
                key={sp.id}
                className="ribbon-tool-btn"
                onClick={() => handleApplySpacingPreset(sp)}
                title={`Set ${sp.label} paragraph spacing`}
              >
                <span>{sp.label}</span>
              </button>
            ))}
          </div>
        </div>
        <span className="ribbon-group-title">Paragraph Spacing</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Page Background */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          {/* Watermark */}
          <div className="ribbon-picker-wrapper">
            <button
              className="ribbon-btn-large"
              onClick={() => setWatermarkOpen(!watermarkOpen)}
              title="Add Watermark to pages"
            >
              <div className="ribbon-btn-icon">
                <IconWatermark size={20} color="#185abd" />
              </div>
              <span className="ribbon-btn-label">Watermark</span>
            </button>

            {watermarkOpen && (
              <div className="ribbon-popover-menu">
                <div className="popover-menu-header">Watermark Presets</div>
                {WATERMARK_PRESETS.map(w => (
                  <div key={w} className="popover-menu-item" onClick={() => handleSetWatermark(w)}>
                    <span>{w}</span>
                  </div>
                ))}
                <div className="popover-menu-divider" />
                <div className="popover-menu-item text-danger" onClick={() => handleSetWatermark(null)}>
                  <span>Remove Watermark</span>
                </div>
                <div
                  className="popover-action-link"
                  onClick={() => {
                    setActiveDialog('watermark');
                    setWatermarkOpen(false);
                  }}
                >
                  Custom Watermark...
                </div>
              </div>
            )}
          </div>

          {/* Page Color */}
          <div className="ribbon-picker-wrapper">
            <button
              className="ribbon-btn-large"
              onClick={() => setPageColorOpen(!pageColorOpen)}
              title="Page Color"
            >
              <div className="ribbon-btn-icon">
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid #9ca3af',
                    backgroundColor: document.pageSetup?.pageColor || '#ffffff',
                    borderRadius: '2px'
                  }}
                />
              </div>
              <span className="ribbon-btn-label">Page Color</span>
            </button>

            {pageColorOpen && (
              <div className="ribbon-popover-palette">
                <div className="palette-grid">
                  {pageColors.map(c => (
                    <div
                      key={c}
                      className="palette-swatch"
                      style={{ backgroundColor: c, border: '1px solid #d1d5db' }}
                      title={c}
                      onClick={() => handleSetPageColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Page Borders */}
          <button
            className="ribbon-btn-large"
            onClick={() => {
              const currentEnabled = document.pageSetup?.pageBorder?.enabled;
              setDocument(doc => ({
                ...doc,
                pageSetup: {
                  ...(doc.pageSetup || {}),
                  pageBorder: {
                    enabled: !currentEnabled,
                    style: 'solid',
                    width: 1,
                    color: '#000000'
                  }
                }
              }));
            }}
            title="Toggle Page Border"
          >
            <div className="ribbon-btn-icon">
              <IconPageBorder size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Page Borders</span>
          </button>
        </div>
        <span className="ribbon-group-title">Page Background</span>
      </div>
    </div>
  );
}

