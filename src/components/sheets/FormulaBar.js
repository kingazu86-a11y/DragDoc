/**
 * Sheets Formula Bar Component
 * Name box (active cell coordinate), fx function helper, and formula input bar.
 */

import React, { useState, useEffect } from 'react';
import { IconFormulaFx, IconCheck, IconClose } from '../common/SvgIcons';

const QUICK_FUNCTIONS = [
  { name: 'SUM', snippet: '=SUM(', desc: 'Calculates the total sum of numbers in a range' },
  { name: 'AVERAGE', snippet: '=AVERAGE(', desc: 'Returns the numerical average of values' },
  { name: 'COUNT', snippet: '=COUNT(', desc: 'Counts the number of cells containing numbers' },
  { name: 'MAX', snippet: '=MAX(', desc: 'Returns the largest value in a set of values' },
  { name: 'MIN', snippet: '=MIN(', desc: 'Returns the smallest value in a set of values' },
  { name: 'IF', snippet: '=IF(condition, value_if_true, value_if_false)', desc: 'Logical conditional test' },
  { name: 'ROUND', snippet: '=ROUND(value, decimals)', desc: 'Rounds a number to specified decimals' },
  { name: 'VLOOKUP', snippet: '=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])', desc: 'Vertical lookup in matrix' }
];

export function FormulaBar({
  activeCellId,
  cellValue,
  cellFormula,
  onFormulaCommit,
  onFormulaCancel
}) {
  const [inputText, setInputText] = useState('');
  const [showFxMenu, setShowFxMenu] = useState(false);

  // Sync formula input whenever active cell changes
  useEffect(() => {
    setInputText(cellFormula || (cellValue !== undefined && cellValue !== null ? String(cellValue) : ''));
  }, [activeCellId, cellFormula, cellValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFormulaCommit(inputText);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputText(cellFormula || (cellValue !== undefined ? String(cellValue) : ''));
      if (onFormulaCancel) onFormulaCancel();
    }
  };

  const handleInsertFunction = (func) => {
    setInputText(func.snippet);
    setShowFxMenu(false);
  };

  return (
    <div className="sheets-formula-bar-container">
      {/* Name Box */}
      <div className="sheets-name-box" title="Name Box (Current Cell Reference)">
        <span>{activeCellId || 'A1'}</span>
      </div>

      <div className="sheets-formula-divider" />

      {/* Action Buttons: Cancel, Commit */}
      <div className="sheets-formula-actions">
        <button
          className="sheets-formula-action-btn cancel-btn"
          title="Cancel (Esc)"
          onClick={() => {
            setInputText(cellFormula || (cellValue !== undefined ? String(cellValue) : ''));
            if (onFormulaCancel) onFormulaCancel();
          }}
        >
          <IconClose size={13} color="#dc2626" />
        </button>
        <button
          className="sheets-formula-action-btn confirm-btn"
          title="Commit (Enter)"
          onClick={() => onFormulaCommit(inputText)}
        >
          <IconCheck size={14} color="#16a34a" />
        </button>
      </div>

      {/* Fx Function Inserter Button */}
      <div className="sheets-fx-dropdown-wrap">
        <button
          className={`sheets-fx-btn ${showFxMenu ? 'active' : ''}`}
          title="Insert Function"
          onClick={() => setShowFxMenu(!showFxMenu)}
        >
          <IconFormulaFx size={14} color="#107c41" />
        </button>

        {showFxMenu && (
          <div className="sheets-fx-menu-dropdown">
            <div className="sheets-fx-menu-header">Standard Functions</div>
            {QUICK_FUNCTIONS.map(fn => (
              <button
                key={fn.name}
                className="sheets-fx-menu-item"
                onClick={() => handleInsertFunction(fn)}
              >
                <span className="sheets-fx-item-name">{fn.name}</span>
                <span className="sheets-fx-item-desc">{fn.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Formula Input */}
      <input
        type="text"
        className="sheets-formula-input"
        placeholder="Enter a value or formula starting with = (e.g. =SUM(B2:E2))"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onFormulaCommit(inputText)}
      />
    </div>
  );
}

