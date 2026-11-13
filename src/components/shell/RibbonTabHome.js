/**
 * Ribbon Tab: HOME
 * Full formatting suite: Clipboard, Font, Paragraph, Styles Gallery, and Editing.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconDoubleUnderline,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconHighlight,
  IconFontColor,
  IconClearFormat,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
  IconLineSpacing,
  IconListBullets,
  IconListNumbers,
  IconPilcrow,
  IconRtl,
  IconSearch
} from '../common/SvgIcons';
import { DEFAULT_STYLES } from '../../engine/documentModel';

const FONT_FAMILIES = [
  'Calibri, sans-serif',
  'Aptos, sans-serif',
  'Arial, sans-serif',
  'Times New Roman, serif',
  'Georgia, serif',
  'Segoe UI, sans-serif',
  'Courier New, monospace',
  'Trebuchet MS, sans-serif',
  'Verdana, sans-serif',
  'Amiri, serif', // Arabic
  'Noto Nastaliq Urdu, serif' // Urdu
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
const LINE_SPACINGS = [1.0, 1.15, 1.5, 2.0, 2.5, 3.0];

export function RibbonTabHome() {
  const {
    formatState,
    applyFormatting,
    applyStyle,
    showFormattingMarks,
    setShowFormattingMarks,
    setActiveSidebar,
    document,
    selectedBlockId
  } = useDocument();

  const [fontColorOpen, setFontColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [lineSpacingOpen, setLineSpacingOpen] = useState(false);

  const colors = [
    '#000000', '#1f2937', '#4b5563', '#9ca3af', '#dc2626',
    '#ea580c', '#d97706', '#16a34a', '#0284c7', '#185abd',
    '#7c3aed', '#db2777'
  ];

  const highlightColors = [
    'transparent', '#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8', '#fed7aa'
  ];

  const handleFontFamilyChange = (e) => {
    applyFormatting('fontFamily', e.target.value);
  };

  const handleFontSizeChange = (e) => {
    applyFormatting('fontSize', Number(e.target.value));
  };

  const handleIncreaseFontSize = () => {
    const curSize = formatState.fontSize || 11;
    const nextSize = FONT_SIZES.find(s => s > curSize) || curSize + 2;
    applyFormatting('fontSize', nextSize);
  };

  const handleDecreaseFontSize = () => {
    const curSize = formatState.fontSize || 11;
    const prevSizes = FONT_SIZES.filter(s => s < curSize);
    const prevSize = prevSizes.length > 0 ? prevSizes[prevSizes.length - 1] : Math.max(6, curSize - 2);
    applyFormatting('fontSize', prevSize);
  };

  const handleClearFormat = () => {
    applyFormatting('bold', false);
    applyFormatting('italic', false);
    applyFormatting('underline', false);
    applyFormatting('doubleUnderline', false);
    applyFormatting('strikethrough', false);
    applyFormatting('subscript', false);
    applyFormatting('superscript', false);
    applyFormatting('fontColor', '#1f2937');
    applyFormatting('highlight', null);
    applyFormatting('fontSize', 11);
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Clipboard */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-btn-large"
            title="Paste from clipboard (Ctrl+V)"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) {
                  // paste text into active block
                  const activeBlock = (document.blocks || []).find(b => b.id === selectedBlockId);
                  if (activeBlock) {
                    applyFormatting('text', (activeBlock.textRuns?.[0]?.text || '') + text);
                  }
                }
              } catch (e) {
                alert('Please use standard keyboard shortcut Ctrl+V to paste content.');
              }
            }}
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Paste</span>
          </button>

          <div className="ribbon-btn-stack">
            <button
              className="ribbon-tool-btn"
              title="Cut selection (Ctrl+X)"
              onClick={() => {
                document.execCommand('cut');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              <span>Cut</span>
            </button>

            <button
              className="ribbon-tool-btn"
              title="Copy selection (Ctrl+C)"
              onClick={() => {
                document.execCommand('copy');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
        </div>
        <span className="ribbon-group-title">Clipboard</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Font */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          {/* Row 1: Font Family, Font Size, Grow/Shrink, Case, Clear */}
          <div className="ribbon-control-row">
            <select
              className="ribbon-select font-family-select"
              value={formatState.fontFamily}
              onChange={handleFontFamilyChange}
              title="Font Family"
            >
              {FONT_FAMILIES.map(ff => (
                <option key={ff} value={ff}>{ff.split(',')[0]}</option>
              ))}
            </select>

            <select
              className="ribbon-select font-size-select"
              value={formatState.fontSize || 11}
              onChange={handleFontSizeChange}
              title="Font Size"
            >
              {FONT_SIZES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button className="ribbon-icon-btn" onClick={handleIncreaseFontSize} title="Increase Font Size (Ctrl+])">
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>A^</span>
            </button>

            <button className="ribbon-icon-btn" onClick={handleDecreaseFontSize} title="Decrease Font Size (Ctrl+[)">
              <span style={{ fontSize: '10px' }}>Av</span>
            </button>

            <button className="ribbon-icon-btn" onClick={handleClearFormat} title="Clear All Formatting">
              <IconClearFormat size={13} />
            </button>
          </div>

          {/* Row 2: Bold, Italic, Underline, Strike, Sub, Super, Highlight, Color */}
          <div className="ribbon-control-row">
            <button
              className={`ribbon-icon-btn ${formatState.bold ? 'active' : ''}`}
              onClick={() => applyFormatting('bold', !formatState.bold)}
              title="Bold (Ctrl+B)"
            >
              <IconBold size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.italic ? 'active' : ''}`}
              onClick={() => applyFormatting('italic', !formatState.italic)}
              title="Italic (Ctrl+I)"
            >
              <IconItalic size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.underline ? 'active' : ''}`}
              onClick={() => applyFormatting('underline', !formatState.underline)}
              title="Underline (Ctrl+U)"
            >
              <IconUnderline size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.doubleUnderline ? 'active' : ''}`}
              onClick={() => applyFormatting('doubleUnderline', !formatState.doubleUnderline)}
              title="Double Underline"
            >
              <IconDoubleUnderline size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.strikethrough ? 'active' : ''}`}
              onClick={() => applyFormatting('strikethrough', !formatState.strikethrough)}
              title="Strikethrough"
            >
              <IconStrikethrough size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.subscript ? 'active' : ''}`}
              onClick={() => applyFormatting('subscript', !formatState.subscript)}
              title="Subscript"
            >
              <IconSubscript size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.superscript ? 'active' : ''}`}
              onClick={() => applyFormatting('superscript', !formatState.superscript)}
              title="Superscript"
            >
              <IconSuperscript size={13} />
            </button>

            {/* Highlight color picker */}
            <div className="ribbon-picker-wrapper">
              <button
                className="ribbon-icon-btn"
                title="Text Highlight Color"
                onClick={() => setHighlightOpen(!highlightOpen)}
              >
                <IconHighlight size={13} color={formatState.highlight || '#f59e0b'} />
              </button>
              {highlightOpen && (
                <div className="ribbon-popover-palette">
                  <div className="palette-grid">
                    {highlightColors.map((c, i) => (
                      <div
                        key={i}
                        className="palette-swatch"
                        style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                        title={c}
                        onClick={() => {
                          applyFormatting('highlight', c === 'transparent' ? null : c);
                          setHighlightOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font color picker */}
            <div className="ribbon-picker-wrapper">
              <button
                className="ribbon-icon-btn"
                title="Font Color"
                onClick={() => setFontColorOpen(!fontColorOpen)}
              >
                <IconFontColor size={13} color={formatState.fontColor || '#185abd'} />
              </button>
              {fontColorOpen && (
                <div className="ribbon-popover-palette">
                  <div className="palette-grid">
                    {colors.map((c, i) => (
                      <div
                        key={i}
                        className="palette-swatch"
                        style={{ backgroundColor: c }}
                        title={c}
                        onClick={() => {
                          applyFormatting('fontColor', c);
                          setFontColorOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="ribbon-group-title">Font</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Paragraph */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          {/* Row 1: Bullets, Numbers, Indents, Show Formatting, RTL */}
          <div className="ribbon-control-row">
            <button
              className={`ribbon-icon-btn ${formatState.listType === 'bullet' ? 'active' : ''}`}
              title="Bulleted List"
              onClick={() => applyFormatting('listType', formatState.listType === 'bullet' ? 'none' : 'bullet')}
            >
              <IconListBullets size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.listType === 'number' ? 'active' : ''}`}
              title="Numbered List"
              onClick={() => applyFormatting('listType', formatState.listType === 'number' ? 'none' : 'number')}
            >
              <IconListNumbers size={13} />
            </button>

            <button
              className="ribbon-icon-btn"
              title="Decrease Indent"
              onClick={() => applyFormatting('indentLeft', Math.max(0, (formatState.indentLeft || 0) - 24))}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11 17 6 12 11 7" />
                <line x1="18" y1="12" x2="6" y2="12" />
                <line x1="21" y1="18" x2="3" y2="18" />
                <line x1="21" y1="6" x2="3" y2="6" />
              </svg>
            </button>

            <button
              className="ribbon-icon-btn"
              title="Increase Indent"
              onClick={() => applyFormatting('indentLeft', (formatState.indentLeft || 0) + 24)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="21" y1="18" x2="3" y2="18" />
                <line x1="21" y1="6" x2="3" y2="6" />
              </svg>
            </button>

            <button
              className={`ribbon-icon-btn ${showFormattingMarks ? 'active' : ''}`}
              title="Show/Hide Formatting Marks (¶)"
              onClick={() => setShowFormattingMarks(!showFormattingMarks)}
            >
              <IconPilcrow size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.dir === 'rtl' ? 'active' : ''}`}
              title="Right-to-Left Text Direction (Urdu / Arabic)"
              onClick={() => applyFormatting('dir', formatState.dir === 'rtl' ? 'ltr' : 'rtl')}
            >
              <IconRtl size={13} />
            </button>
          </div>

          {/* Row 2: Align Left, Center, Right, Justify, Line Spacing */}
          <div className="ribbon-control-row">
            <button
              className={`ribbon-icon-btn ${formatState.align === 'left' ? 'active' : ''}`}
              title="Align Left (Ctrl+L)"
              onClick={() => applyFormatting('align', 'left')}
            >
              <IconAlignLeft size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.align === 'center' ? 'active' : ''}`}
              title="Center (Ctrl+E)"
              onClick={() => applyFormatting('align', 'center')}
            >
              <IconAlignCenter size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.align === 'right' ? 'active' : ''}`}
              title="Align Right (Ctrl+R)"
              onClick={() => applyFormatting('align', 'right')}
            >
              <IconAlignRight size={13} />
            </button>

            <button
              className={`ribbon-icon-btn ${formatState.align === 'justify' ? 'active' : ''}`}
              title="Justify (Ctrl+J)"
              onClick={() => applyFormatting('align', 'justify')}
            >
              <IconAlignJustify size={13} />
            </button>

            {/* Line Spacing Popover */}
            <div className="ribbon-picker-wrapper">
              <button
                className="ribbon-icon-btn"
                title="Line and Paragraph Spacing"
                onClick={() => setLineSpacingOpen(!lineSpacingOpen)}
              >
                <IconLineSpacing size={13} />
              </button>
              {lineSpacingOpen && (
                <div className="ribbon-popover-menu">
                  {LINE_SPACINGS.map(ls => (
                    <div
                      key={ls}
                      className={`popover-menu-item ${formatState.lineSpacing === ls ? 'active' : ''}`}
                      onClick={() => {
                        applyFormatting('lineSpacing', ls);
                        setLineSpacingOpen(false);
                      }}
                    >
                      <span>{ls.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="ribbon-group-title">Paragraph</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Styles Gallery */}
      <div className="ribbon-group styles-group">
        <div className="styles-gallery-scroll">
          {Object.entries(DEFAULT_STYLES).slice(0, 6).map(([key, style]) => (
            <button
              key={key}
              className="style-card-btn"
              onClick={() => applyStyle(key)}
              title={`Apply ${style.name}`}
            >
              <span className={`style-preview-text style-${key}`}>{style.name}</span>
            </button>
          ))}
        </div>
        <span className="ribbon-group-title">Styles</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Editing */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-btn-stack">
            <button
              className="ribbon-tool-btn"
              title="Find and Replace in document (Ctrl+F / Ctrl+H)"
              onClick={() => setActiveSidebar('findReplace')}
            >
              <IconSearch size={14} color="#185abd" />
              <span>Find & Replace</span>
            </button>

            <button
              className="ribbon-tool-btn"
              title="Select All (Ctrl+A)"
              onClick={() => document.execCommand('selectAll')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="2 2" />
              </svg>
              <span>Select All</span>
            </button>
          </div>
        </div>
        <span className="ribbon-group-title">Editing</span>
      </div>
    </div>
  );
}
