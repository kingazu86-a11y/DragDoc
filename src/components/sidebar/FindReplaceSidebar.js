/**
 * Find and Replace Sidebar Pane
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { IconClose } from '../common/SvgIcons';

export function FindReplaceSidebar() {
  const {
    activeSidebar,
    setActiveSidebar,
    setDocument
  } = useDocument();

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (activeSidebar !== 'findReplace') return null;

  const handleReplaceAll = () => {
    if (!findText) return;

    let replaceCount = 0;
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(findText, flags);

    setDocument(doc => {
      const newBlocks = (doc.blocks || []).map(b => {
        if (!b.textRuns || !Array.isArray(b.textRuns)) return b;
        const newRuns = b.textRuns.map(r => {
          const original = r.text || '';
          const matches = original.match(regex);
          if (matches) replaceCount += matches.length;
          return {
            ...r,
            text: original.replace(regex, replaceText)
          };
        });
        return { ...b, textRuns: newRuns };
      });

      return { ...doc, blocks: newBlocks };
    });

    setStatusMsg(`Replaced ${replaceCount} occurrence(s).`);
  };

  return (
    <div className="dragdocs-sidebar find-replace-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Find & Replace</span>
        <button
          className="sidebar-close-btn"
          onClick={() => setActiveSidebar(null)}
          title="Close Find & Replace"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        <div className="form-group">
          <label className="ai-label">Find what:</label>
          <input
            type="text"
            className="ai-input"
            placeholder="Search word or phrase..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginTop: '12px' }}>
          <label className="ai-label">Replace with:</label>
          <input
            type="text"
            className="ai-input"
            placeholder="Replacement text..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '12px' }}>
          <label className="ribbon-checkbox-item">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
            />
            <span>Match Case</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="issue-action-btn primary" onClick={handleReplaceAll} disabled={!findText}>
            Replace All
          </button>
        </div>

        {statusMsg && (
          <div className="status-toast" style={{ marginTop: '12px', fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}

