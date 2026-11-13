/**
 * Sheets Excel-Style Ribbon Navigation Component
 * Fully functional tabs: File, Home, Insert, Page Layout, Formulas, Data, View.
 * Strict rules: 100% SVG icons, No emojis, No gradients, flat Fluent design.
 */

import React, { useState } from 'react';
import {
  IconSave,
  IconUndo,
  IconRedo,
  IconPrint,
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconCurrency,
  IconPercent,
  IconDecimalIncrease,
  IconDecimalDecrease,
  IconMergeCells,
  IconWrapText,
  IconAutoSum,
  IconSortAsc,
  IconSortDesc,
  IconGridlines,
  IconFreezePanes,
  IconChart,
  IconTable,
  IconPlus,
  IconTrash,
  IconDownload,
  IconFolderOpen,
  IconFormulaFx
} from '../common/SvgIcons';

export function RibbonSheets({
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportCsv,
  onExportXml,
  onImportCsv,
  onApplyFormat,
  onApplyStyle,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onClearCells,
  onSort,
  onAutoSum,
  onInsertChart,
  showGridlines,
  onToggleGridlines,
  freezePanes,
  onToggleFreezePanes
}) {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedFont, setSelectedFont] = useState('Segoe UI');
  const [selectedFontSize, setSelectedFontSize] = useState('11');
  const [showAutoSumMenu, setShowAutoSumMenu] = useState(false);

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (text && onImportCsv) {
          onImportCsv(text, file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="sheets-ribbon-container">
      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.tsv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Ribbon Tabs Strip */}
      <div className="sheets-ribbon-tab-bar">
        {['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'View'].map(tab => (
          <button
            key={tab}
            className={`sheets-ribbon-tab-btn ${activeTab === tab ? 'active' : ''} ${tab === 'File' ? 'file-tab' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

        {/* Quick Access Toolbar in Tab Bar */}
        <div className="sheets-ribbon-qat-group">
          <button className="sheets-qat-btn" title="Save (Ctrl+S)" onClick={onSave}>
            <IconSave size={14} color="#107c41" />
          </button>
          <button
            className="sheets-qat-btn"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <IconUndo size={14} color={canUndo ? '#0f172a' : '#94a3b8'} />
          </button>
          <button
            className="sheets-qat-btn"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <IconRedo size={14} color={canRedo ? '#0f172a' : '#94a3b8'} />
          </button>
        </div>
      </div>

      {/* Ribbon Content Panel */}
      <div className="sheets-ribbon-content-panel">
        {/* FILE TAB */}
        {activeTab === 'File' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <button className="sheets-large-tool-btn" onClick={() => fileInputRef.current?.click()}>
                <IconFolderOpen size={20} color="#107c41" />
                <span>Open CSV</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={onSave}>
                <IconSave size={20} color="#107c41" />
                <span>Save</span>
              </button>
              <div className="sheets-group-label">File Management</div>
            </div>

            <div className="sheets-ribbon-group">
              <button className="sheets-large-tool-btn" onClick={onExportCsv}>
                <IconDownload size={20} color="#107c41" />
                <span>Export CSV</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={onExportXml}>
                <IconDownload size={20} color="#107c41" />
                <span>Excel XML</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={() => window.print()}>
                <IconPrint size={20} color="#64748b" />
                <span>Print</span>
              </button>
              <div className="sheets-group-label">Export & Share</div>
            </div>
          </div>
        )}

        {/* HOME TAB */}
        {activeTab === 'Home' && (
          <div className="sheets-ribbon-group-row">
            {/* Clipboard */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <button
                  className="sheets-mini-tool-btn"
                  title="Copy Selection"
                  onClick={() => document.execCommand('copy')}
                >
                  <span>Copy</span>
                </button>
                <button
                  className="sheets-mini-tool-btn"
                  title="Cut Selection"
                  onClick={() => document.execCommand('cut')}
                >
                  <span>Cut</span>
                </button>
              </div>
              <div className="sheets-group-label">Clipboard</div>
            </div>

            {/* Font */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <div className="sheets-tool-row">
                  <select
                    className="sheets-select-input font-family-select"
                    value={selectedFont}
                    onChange={(e) => {
                      setSelectedFont(e.target.value);
                      onApplyStyle({ fontFamily: e.target.value });
                    }}
                  >
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                  <select
                    className="sheets-select-input font-size-select"
                    value={selectedFontSize}
                    onChange={(e) => {
                      setSelectedFontSize(e.target.value);
                      onApplyStyle({ fontSize: parseInt(e.target.value, 10) });
                    }}
                  >
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                  </select>
                </div>
                <div className="sheets-tool-row">
                  <button
                    className="sheets-icon-btn"
                    title="Bold"
                    onClick={() => onApplyStyle({ bold: true, toggle: true })}
                  >
                    <IconBold size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Italic"
                    onClick={() => onApplyStyle({ italic: true, toggle: true })}
                  >
                    <IconItalic size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Underline"
                    onClick={() => onApplyStyle({ underline: true, toggle: true })}
                  >
                    <IconUnderline size={14} />
                  </button>
                  {/* Fill Color */}
                  <input
                    type="color"
                    className="sheets-color-picker-input"
                    title="Cell Fill Color"
                    defaultValue="#f1f5f9"
                    onChange={(e) => onApplyStyle({ bgColor: e.target.value })}
                  />
                  {/* Text Color */}
                  <input
                    type="color"
                    className="sheets-color-picker-input text-color"
                    title="Font Color"
                    defaultValue="#0f172a"
                    onChange={(e) => onApplyStyle({ color: e.target.value })}
                  />
                </div>
              </div>
              <div className="sheets-group-label">Font</div>
            </div>

            {/* Alignment */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <div className="sheets-tool-row">
                  <button
                    className="sheets-icon-btn"
                    title="Align Left"
                    onClick={() => onApplyStyle({ align: 'left' })}
                  >
                    <IconAlignLeft size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Center"
                    onClick={() => onApplyStyle({ align: 'center' })}
                  >
                    <IconAlignCenter size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Align Right"
                    onClick={() => onApplyStyle({ align: 'right' })}
                  >
                    <IconAlignRight size={14} />
                  </button>
                </div>
                <div className="sheets-tool-row">
                  <button
                    className="sheets-mini-tool-btn"
                    title="Wrap Text"
                    onClick={() => onApplyStyle({ wrap: true, toggle: true })}
                  >
                    <IconWrapText size={13} />
                    <span>Wrap Text</span>
                  </button>
                  <button
                    className="sheets-mini-tool-btn"
                    title="Merge & Center"
                    onClick={() => onApplyStyle({ merge: true })}
                  >
                    <IconMergeCells size={13} />
                    <span>Merge</span>
                  </button>
                </div>
              </div>
              <div className="sheets-group-label">Alignment</div>
            </div>

            {/* Number Formatting */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <div className="sheets-tool-row">
                  <button
                    className="sheets-icon-btn"
                    title="Format as Currency ($)"
                    onClick={() => onApplyFormat('currency')}
                  >
                    <IconCurrency size={14} color="#107c41" />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Format as Percent (%)"
                    onClick={() => onApplyFormat('percent')}
                  >
                    <IconPercent size={14} color="#107c41" />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Increase Decimal"
                    onClick={() => onApplyFormat('decimal_increase')}
                  >
                    <IconDecimalIncrease size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Decrease Decimal"
                    onClick={() => onApplyFormat('decimal_decrease')}
                  >
                    <IconDecimalDecrease size={14} />
                  </button>
                </div>
                <div className="sheets-tool-row">
                  <button
                    className="sheets-mini-tool-btn"
                    onClick={() => onApplyFormat('general')}
                  >
                    <span>General</span>
                  </button>
                  <button
                    className="sheets-mini-tool-btn"
                    onClick={() => onApplyFormat('date')}
                  >
                    <span>Date</span>
                  </button>
                </div>
              </div>
              <div className="sheets-group-label">Number</div>
            </div>

            {/* Cells (Insert / Delete) */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <div className="sheets-tool-row">
                  <button
                    className="sheets-mini-tool-btn"
                    title="Insert Row Above"
                    onClick={onInsertRow}
                  >
                    <IconPlus size={12} color="#107c41" />
                    <span>Insert Row</span>
                  </button>
                  <button
                    className="sheets-mini-tool-btn"
                    title="Insert Column Left"
                    onClick={onInsertColumn}
                  >
                    <IconPlus size={12} color="#107c41" />
                    <span>Insert Col</span>
                  </button>
                </div>
                <div className="sheets-tool-row">
                  <button
                    className="sheets-mini-tool-btn"
                    title="Delete Row"
                    onClick={onDeleteRow}
                  >
                    <IconTrash size={12} color="#dc2626" />
                    <span>Delete Row</span>
                  </button>
                  <button
                    className="sheets-mini-tool-btn"
                    title="Delete Column"
                    onClick={onDeleteColumn}
                  >
                    <IconTrash size={12} color="#dc2626" />
                    <span>Delete Col</span>
                  </button>
                  <button
                    className="sheets-mini-tool-btn"
                    title="Clear Content"
                    onClick={onClearCells}
                  >
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              <div className="sheets-group-label">Cells</div>
            </div>

            {/* Editing (AutoSum, Sort, Filter) */}
            <div className="sheets-ribbon-group">
              <div className="sheets-tools-column">
                <div className="sheets-tool-row relative-wrap">
                  <button
                    className="sheets-mini-tool-btn highlight-btn"
                    title="AutoSum (Calculates sum of above/left cells)"
                    onClick={() => setShowAutoSumMenu(!showAutoSumMenu)}
                  >
                    <IconAutoSum size={14} color="#107c41" />
                    <span>AutoSum</span>
                  </button>
                  {showAutoSumMenu && (
                    <div className="sheets-sub-menu">
                      <button onClick={() => { onAutoSum('SUM'); setShowAutoSumMenu(false); }}>Sum</button>
                      <button onClick={() => { onAutoSum('AVERAGE'); setShowAutoSumMenu(false); }}>Average</button>
                      <button onClick={() => { onAutoSum('COUNT'); setShowAutoSumMenu(false); }}>Count Numbers</button>
                      <button onClick={() => { onAutoSum('MAX'); setShowAutoSumMenu(false); }}>Max</button>
                      <button onClick={() => { onAutoSum('MIN'); setShowAutoSumMenu(false); }}>Min</button>
                    </div>
                  )}
                  <button
                    className="sheets-icon-btn"
                    title="Sort Ascending (A to Z)"
                    onClick={() => onSort('asc')}
                  >
                    <IconSortAsc size={14} />
                  </button>
                  <button
                    className="sheets-icon-btn"
                    title="Sort Descending (Z to A)"
                    onClick={() => onSort('desc')}
                  >
                    <IconSortDesc size={14} />
                  </button>
                </div>
              </div>
              <div className="sheets-group-label">Editing</div>
            </div>
          </div>
        )}

        {/* INSERT TAB */}
        {activeTab === 'Insert' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <button
                className="sheets-large-tool-btn"
                onClick={() => onApplyStyle({ border: true, bgColor: '#f8fafc' })}
              >
                <IconTable size={20} color="#107c41" />
                <span>Table</span>
              </button>
              <div className="sheets-group-label">Tables</div>
            </div>

            <div className="sheets-ribbon-group">
              <button
                className="sheets-large-tool-btn"
                onClick={() => onInsertChart('clusteredColumn')}
              >
                <IconChart size={20} color="#107c41" />
                <span>Column Chart</span>
              </button>
              <button
                className="sheets-large-tool-btn"
                onClick={() => onInsertChart('line')}
              >
                <IconChart size={20} color="#2563eb" />
                <span>Line Chart</span>
              </button>
              <button
                className="sheets-large-tool-btn"
                onClick={() => onInsertChart('pie')}
              >
                <IconChart size={20} color="#d97706" />
                <span>Pie Chart</span>
              </button>
              <div className="sheets-group-label">Charts</div>
            </div>
          </div>
        )}

        {/* PAGE LAYOUT TAB */}
        {activeTab === 'Page Layout' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <label className="sheets-checkbox-tool">
                <input
                  type="checkbox"
                  checked={showGridlines}
                  onChange={onToggleGridlines}
                />
                <span>View Gridlines</span>
              </label>
              <div className="sheets-group-label">Sheet Options</div>
            </div>
          </div>
        )}

        {/* FORMULAS TAB */}
        {activeTab === 'Formulas' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <button className="sheets-large-tool-btn" onClick={() => onAutoSum('SUM')}>
                <IconAutoSum size={20} color="#107c41" />
                <span>AutoSum</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={() => onAutoSum('AVERAGE')}>
                <IconFormulaFx size={20} color="#0284c7" />
                <span>Average</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={() => onAutoSum('COUNT')}>
                <IconFormulaFx size={20} color="#7c3aed" />
                <span>Count</span>
              </button>
              <div className="sheets-group-label">Function Library</div>
            </div>
          </div>
        )}

        {/* DATA TAB */}
        {activeTab === 'Data' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <button className="sheets-large-tool-btn" onClick={() => onSort('asc')}>
                <IconSortAsc size={20} color="#107c41" />
                <span>Sort A to Z</span>
              </button>
              <button className="sheets-large-tool-btn" onClick={() => onSort('desc')}>
                <IconSortDesc size={20} color="#107c41" />
                <span>Sort Z to A</span>
              </button>
              <div className="sheets-group-label">Sort & Filter</div>
            </div>
          </div>
        )}

        {/* VIEW TAB */}
        {activeTab === 'View' && (
          <div className="sheets-ribbon-group-row">
            <div className="sheets-ribbon-group">
              <button
                className={`sheets-large-tool-btn ${freezePanes?.row > 0 ? 'active' : ''}`}
                onClick={onToggleFreezePanes}
              >
                <IconFreezePanes size={20} color="#107c41" />
                <span>Freeze Header</span>
              </button>
              <button
                className={`sheets-large-tool-btn ${showGridlines ? 'active' : ''}`}
                onClick={onToggleGridlines}
              >
                <IconGridlines size={20} color="#107c41" />
                <span>Gridlines</span>
              </button>
              <div className="sheets-group-label">Window</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
