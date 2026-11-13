/**
 * Proofing & Editor Sidebar
 * Live scanning for spelling, grammar, punctuation, and clarity suggestions.
 */

import React, { useMemo } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { analyzeDocumentProofing } from '../../engine/reviewEngine';
import { IconCheck, IconClose } from '../common/SvgIcons';

export function ProofingSidebar() {
  const {
    document,
    activeSidebar,
    setActiveSidebar,
    updateBlock
  } = useDocument();

  const issues = useMemo(() => {
    return analyzeDocumentProofing(document);
  }, [document]);

  if (activeSidebar !== 'proofing') return null;

  const handleApplySuggestion = (issue) => {
    if (!issue.suggestion) return;

    const targetBlock = (document.blocks || []).find(b => b.id === issue.blockId);
    if (!targetBlock) return;

    const newRuns = (targetBlock.textRuns || []).map(r => {
      const regex = new RegExp(`\\b${issue.original}\\b`, 'gi');
      return {
        ...r,
        text: (r.text || '').replace(regex, issue.suggestion)
      };
    });

    updateBlock(targetBlock.id, { textRuns: newRuns });
  };

  return (
    <div className="dragdocs-sidebar proofing-sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="sidebar-title">Editor / Proofing</span>
          <span className="badge-count">{issues.length}</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setActiveSidebar(null)}
          title="Close Proofing Pane"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        {issues.length === 0 ? (
          <div className="sidebar-success-state">
            <div className="success-icon-circle">
              <IconCheck size={24} color="#16a34a" />
            </div>
            <h4>No proofing issues found</h4>
            <p>Your document adheres to spelling, grammatical, and typographical guidelines.</p>
          </div>
        ) : (
          <div className="issues-stack">
            {issues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <div className="issue-header">
                  <span className={`issue-tag type-${issue.type}`}>
                    {issue.type.toUpperCase()}
                  </span>
                  <span className="issue-term">"{issue.original}"</span>
                </div>

                <div className="issue-message">{issue.message}</div>

                {issue.suggestion && (
                  <button
                    className="issue-action-btn primary"
                    onClick={() => handleApplySuggestion(issue)}
                  >
                    <span>Change to "<strong>{issue.suggestion}</strong>"</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

