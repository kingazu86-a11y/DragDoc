/**
 * Ribbon Tab: MAILINGS
 * Complete Mail Merge system: Recipient database, merge fields, preview stepper, and bulk generator.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { STANDARD_MERGE_FIELDS, generateBatchDocuments } from '../../engine/mailMergeEngine';
import { createParagraphBlock, createTextRun } from '../../engine/documentModel';
import { IconMailMerge } from '../common/SvgIcons';

export function RibbonTabMailings() {
  const {
    document,
    setDocument,
    setActiveSidebar,
    insertBlock,
    selectedBlockId
  } = useDocument();

  const [fieldPickerOpen, setFieldPickerOpen] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  const recipients = document.mailMerge?.recipients || [];
  const activeIdx = document.mailMerge?.activeRecipientIndex || 0;
  const totalRecipients = recipients.length;

  const handleInsertField = (field) => {
    insertBlock(createParagraphBlock([
      createTextRun(`«${field}»`, { bold: true, fontColor: '#185abd' })
    ]), selectedBlockId);
    setFieldPickerOpen(false);
  };

  const handleInsertGreeting = () => {
    insertBlock(createParagraphBlock([
      createTextRun('Dear ', {}),
      createTextRun('«FirstName»', { bold: true, fontColor: '#185abd' }),
      createTextRun(',', {})
    ]), selectedBlockId);
  };

  const handleStepRecipient = (newIndex) => {
    if (newIndex < 0 || newIndex >= totalRecipients) return;
    setDocument(doc => ({
      ...doc,
      mailMerge: {
        ...(doc.mailMerge || {}),
        activeRecipientIndex: newIndex
      }
    }));
  };

  const handleBulkMerge = () => {
    const batch = generateBatchDocuments(document);
    alert(`Successfully generated mail merge for ${batch.length} recipients! Documents are prepared for batch printing or individual dispatch.`);
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Start Mail Merge */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button
            className="ribbon-btn-large"
            onClick={() => setActiveSidebar('mailings')}
            title="Start Mail Merge Wizard & Edit Recipients"
          >
            <div className="ribbon-btn-icon">
              <IconMailMerge size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Mail Merge</span>
          </button>

          <button
            className="ribbon-btn-large"
            onClick={() => setActiveSidebar('mailings')}
            title="Manage recipient database (CSV/JSON/Add)"
          >
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Recipients ({totalRecipients})</span>
          </button>
        </div>
        <span className="ribbon-group-title">Start Mail Merge</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Write & Insert Fields */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setFieldPickerOpen(!fieldPickerOpen)} title="Insert Merge Field">
              <div className="ribbon-btn-icon">
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#185abd' }}>« »</span>
              </div>
              <span className="ribbon-btn-label">Merge Field</span>
            </button>

            {fieldPickerOpen && (
              <div className="ribbon-popover-menu">
                <div className="popover-menu-header">Available Merge Fields</div>
                {STANDARD_MERGE_FIELDS.map(f => (
                  <div key={f} className="popover-menu-item" onClick={() => handleInsertField(f)}>
                    <span>«{f}»</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="ribbon-btn-large" onClick={handleInsertGreeting} title="Insert Standard Greeting Line">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Greeting Line</span>
          </button>
        </div>
        <span className="ribbon-group-title">Write & Insert Fields</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Preview Results */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls font-group-controls">
          <button
            className={`ribbon-tool-btn ${isPreviewActive ? 'active' : ''}`}
            onClick={() => setIsPreviewActive(!isPreviewActive)}
            title="Preview Results with recipient data"
          >
            <span style={{ fontWeight: '600' }}>Preview Results</span>
          </button>

          {/* Stepper */}
          <div className="ribbon-control-row" style={{ marginTop: '4px' }}>
            <button className="ribbon-icon-btn" onClick={() => handleStepRecipient(0)} title="First Record" disabled={activeIdx === 0}>
              <span>|&lt;</span>
            </button>
            <button className="ribbon-icon-btn" onClick={() => handleStepRecipient(activeIdx - 1)} title="Previous Record" disabled={activeIdx === 0}>
              <span>&lt;</span>
            </button>
            <span style={{ fontSize: '11px', margin: '0 4px', fontWeight: 'bold' }}>
              {activeIdx + 1} of {totalRecipients}
            </span>
            <button className="ribbon-icon-btn" onClick={() => handleStepRecipient(activeIdx + 1)} title="Next Record" disabled={activeIdx >= totalRecipients - 1}>
              <span>&gt;</span>
            </button>
            <button className="ribbon-icon-btn" onClick={() => handleStepRecipient(totalRecipients - 1)} title="Last Record" disabled={activeIdx >= totalRecipients - 1}>
              <span>&gt;|</span>
            </button>
          </div>
        </div>
        <span className="ribbon-group-title">Preview Results</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Finish & Merge */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={handleBulkMerge} title="Finish and generate batch documents">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Finish & Merge</span>
          </button>
        </div>
        <span className="ribbon-group-title">Finish</span>
      </div>
    </div>
  );
}

