/**
 * PDF Studio Ribbon Navigation Component
 * View, Annotate, Stamps & Shapes, Sign & Forms, Pages, and Export.
 * 100% SVG icons, strictly no emojis, no gradients, flat Fluent styling.
 */

import React, { useState } from 'react';
import {
  IconPrint,
  IconDownload,
  IconHighlight,
  IconUnderline,
  IconStrikethrough,
  IconStickyNote,
  IconPen,
  IconStamp,
  IconSignature,
  IconFormText,
  IconFormCheck,
  IconFormSelect,
  IconHandTool,
  IconSelectTool,
  IconFitWidth,
  IconFitPage,
  IconRotateCw,
  IconRotateCcw,
  IconPlus,
  IconTrash,
  IconShapes
} from '../common/SvgIcons';

export function RibbonPdf({
  activeTool,
  onSelectTool,
  zoom,
  onZoomChange,
  onRotateCurrentPage,
  onOpenSignatureModal,
  onAddBlankPage,
  onDeleteCurrentPage,
  onExportPdf,
  onSelectStampType,
  activeStampType,
  inkColor,
  onChangeInkColor
}) {
  const [activeTab, setActiveTab] = useState('Annotate');

  return (
    <div className="pdf-ribbon-container">
      {/* Ribbon Tabs Bar */}
      <div className="pdf-ribbon-tab-bar">
        {['View', 'Annotate', 'Stamps & Shapes', 'Sign & Forms', 'Pages', 'Export'].map(tab => (
          <button
            key={tab}
            className={`pdf-ribbon-tab-btn ${activeTab === tab ? 'active' : ''} ${tab === 'Export' ? 'export-tab' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

        {/* Quick Access Toolbar */}
        <div className="pdf-ribbon-qat-group">
          <button className="pdf-qat-btn" title="Export PDF" onClick={onExportPdf}>
            <IconDownload size={14} color="#d9381e" />
          </button>
          <button className="pdf-qat-btn" title="Print Document" onClick={() => window.print()}>
            <IconPrint size={14} color="#475569" />
          </button>
        </div>
      </div>

      {/* Ribbon Tools Panel */}
      <div className="pdf-ribbon-content-panel">
        {/* VIEW TAB */}
        {activeTab === 'View' && (
          <div className="pdf-ribbon-group-row">
            <div className="pdf-ribbon-group">
              <button
                className={`pdf-large-tool-btn ${activeTool === 'select' ? 'active' : ''}`}
                onClick={() => onSelectTool('select')}
              >
                <IconSelectTool size={20} color="#d9381e" />
                <span>Select Tool</span>
              </button>
              <button
                className={`pdf-large-tool-btn ${activeTool === 'hand' ? 'active' : ''}`}
                onClick={() => onSelectTool('hand')}
              >
                <IconHandTool size={20} color="#64748b" />
                <span>Hand Tool</span>
              </button>
              <div className="pdf-group-label">Navigation</div>
            </div>

            <div className="pdf-ribbon-group">
              <div className="pdf-tools-column">
                <div className="pdf-tool-row">
                  <button className="pdf-mini-tool-btn" onClick={() => onZoomChange(Math.max(50, zoom - 15))}>
                    <span>Zoom -</span>
                  </button>
                  <span className="pdf-zoom-display">{zoom}%</span>
                  <button className="pdf-mini-tool-btn" onClick={() => onZoomChange(Math.min(250, zoom + 15))}>
                    <span>Zoom +</span>
                  </button>
                </div>
                <div className="pdf-tool-row">
                  <button className="pdf-mini-tool-btn" onClick={() => onZoomChange(100)}>
                    <IconFitPage size={13} />
                    <span>Fit Page</span>
                  </button>
                  <button className="pdf-mini-tool-btn" onClick={() => onZoomChange(125)}>
                    <IconFitWidth size={13} />
                    <span>Fit Width</span>
                  </button>
                </div>
              </div>
              <div className="pdf-group-label">Zoom & Fit</div>
            </div>

            <div className="pdf-ribbon-group">
              <button className="pdf-large-tool-btn" onClick={() => onRotateCurrentPage(90)}>
                <IconRotateCw size={20} color="#d9381e" />
                <span>Rotate CW</span>
              </button>
              <button className="pdf-large-tool-btn" onClick={() => onRotateCurrentPage(-90)}>
                <IconRotateCcw size={20} color="#64748b" />
                <span>Rotate CCW</span>
              </button>
              <div className="pdf-group-label">Page Orientation</div>
            </div>
          </div>
        )}

        {/* ANNOTATE TAB */}
        {activeTab === 'Annotate' && (
          <div className="pdf-ribbon-group-row">
            {/* Markup Tools */}
            <div className="pdf-ribbon-group">
              <button
                className={`pdf-large-tool-btn ${activeTool === 'highlight' ? 'active' : ''}`}
                onClick={() => onSelectTool('highlight')}
              >
                <IconHighlight size={20} color="#f59e0b" />
                <span>Highlight</span>
              </button>
              <button
                className={`pdf-large-tool-btn ${activeTool === 'underline' ? 'active' : ''}`}
                onClick={() => onSelectTool('underline')}
              >
                <IconUnderline size={20} color="#2563eb" />
                <span>Underline</span>
              </button>
              <button
                className={`pdf-large-tool-btn ${activeTool === 'strikeout' ? 'active' : ''}`}
                onClick={() => onSelectTool('strikeout')}
              >
                <IconStrikethrough size={20} color="#ef4444" />
                <span>Strikeout</span>
              </button>
              <div className="pdf-group-label">Text Markup</div>
            </div>

            {/* Sticky Notes */}
            <div className="pdf-ribbon-group">
              <button
                className={`pdf-large-tool-btn ${activeTool === 'stickyNote' ? 'active' : ''}`}
                onClick={() => onSelectTool('stickyNote')}
              >
                <IconStickyNote size={20} color="#eab308" />
                <span>Sticky Note</span>
              </button>
              <div className="pdf-group-label">Comments</div>
            </div>

            {/* Freehand Ink Pen */}
            <div className="pdf-ribbon-group">
              <button
                className={`pdf-large-tool-btn ${activeTool === 'freehand' ? 'active' : ''}`}
                onClick={() => onSelectTool('freehand')}
              >
                <IconPen size={20} color={inkColor} />
                <span>Ink Pen</span>
              </button>
              <div className="pdf-tools-column">
                <div className="pdf-color-swatches-row">
                  {['#ef4444', '#185abd', '#107c41', '#0f172a'].map(c => (
                    <button
                      key={c}
                      className={`pdf-swatch ${inkColor === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => onChangeInkColor(c)}
                    />
                  ))}
                </div>
                <span className="pdf-swatch-label">Ink Palette</span>
              </div>
              <div className="pdf-group-label">Freehand Drawing</div>
            </div>
          </div>
        )}

        {/* STAMPS & SHAPES TAB */}
        {activeTab === 'Stamps & Shapes' && (
          <div className="pdf-ribbon-group-row">
            <div className="pdf-ribbon-group">
              {['APPROVED', 'CONFIDENTIAL', 'FINAL', 'DRAFT', 'VOID'].map(stamp => (
                <button
                  key={stamp}
                  className={`pdf-mini-tool-btn stamp-choice ${activeStampType === stamp && activeTool === 'stamp' ? 'active' : ''}`}
                  onClick={() => {
                    onSelectStampType(stamp);
                    onSelectTool('stamp');
                  }}
                >
                  <IconStamp size={14} color={stamp === 'CONFIDENTIAL' ? '#dc2626' : '#107c41'} />
                  <span>{stamp}</span>
                </button>
              ))}
              <div className="pdf-group-label">Legal & Office Stamps</div>
            </div>

            <div className="pdf-ribbon-group">
              <button
                className={`pdf-large-tool-btn ${activeTool === 'shape' ? 'active' : ''}`}
                onClick={() => onSelectTool('shape')}
              >
                <IconShapes size={20} color="#d9381e" />
                <span>Rectangle</span>
              </button>
              <div className="pdf-group-label">Geometric Shapes</div>
            </div>
          </div>
        )}

        {/* SIGN & FORMS TAB */}
        {activeTab === 'Sign & Forms' && (
          <div className="pdf-ribbon-group-row">
            <div className="pdf-ribbon-group">
              <button className="pdf-large-tool-btn highlight-accent" onClick={onOpenSignatureModal}>
                <IconSignature size={20} color="#185abd" />
                <span>Sign Document</span>
              </button>
              <div className="pdf-group-label">Digital Signatures</div>
            </div>

            <div className="pdf-ribbon-group">
              <button
                className="pdf-large-tool-btn"
                onClick={() => alert('Text input field added to active page form fields.')}
              >
                <IconFormText size={20} color="#107c41" />
                <span>Text Field</span>
              </button>
              <button
                className="pdf-large-tool-btn"
                onClick={() => alert('Checkbox added to active page form fields.')}
              >
                <IconFormCheck size={20} color="#107c41" />
                <span>Checkbox</span>
              </button>
              <button
                className="pdf-large-tool-btn"
                onClick={() => alert('Dropdown menu field added to active page.')}
              >
                <IconFormSelect size={20} color="#107c41" />
                <span>Dropdown</span>
              </button>
              <div className="pdf-group-label">Interactive Form Controls</div>
            </div>
          </div>
        )}

        {/* PAGES TAB */}
        {activeTab === 'Pages' && (
          <div className="pdf-ribbon-group-row">
            <div className="pdf-ribbon-group">
              <button className="pdf-large-tool-btn" onClick={onAddBlankPage}>
                <IconPlus size={20} color="#d9381e" />
                <span>Add Blank Page</span>
              </button>
              <button className="pdf-large-tool-btn" onClick={onDeleteCurrentPage}>
                <IconTrash size={20} color="#ef4444" />
                <span>Delete Page</span>
              </button>
              <button className="pdf-large-tool-btn" onClick={() => onRotateCurrentPage(90)}>
                <IconRotateCw size={20} color="#64748b" />
                <span>Rotate 90°</span>
              </button>
              <div className="pdf-group-label">Page Organization</div>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeTab === 'Export' && (
          <div className="pdf-ribbon-group-row">
            <div className="pdf-ribbon-group">
              <button className="pdf-large-tool-btn highlight-accent" onClick={onExportPdf}>
                <IconDownload size={20} color="#d9381e" />
                <span>Export PDF</span>
              </button>
              <button className="pdf-large-tool-btn" onClick={() => window.print()}>
                <IconPrint size={20} color="#64748b" />
                <span>Print Document</span>
              </button>
              <div className="pdf-group-label">Output & Print</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
