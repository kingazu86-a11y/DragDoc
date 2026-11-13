/**
 * Mailings & Mail Merge Recipient Manager Sidebar
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { parseCsvRecipients } from '../../engine/mailMergeEngine';
import { IconClose, IconTrash } from '../common/SvgIcons';

export function MailingsSidebar() {
  const {
    document,
    setDocument,
    activeSidebar,
    setActiveSidebar
  } = useDocument();

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (activeSidebar !== 'mailings') return null;

  const recipients = document.mailMerge?.recipients || [];

  const handleAddRecipient = (e) => {
    e.preventDefault();
    if (!newFirstName && !newLastName) return;

    const newRec = {
      FirstName: newFirstName,
      LastName: newLastName,
      Company: newCompany || 'Enterprise Inc',
      Address: '100 Business Way',
      City: 'San Francisco',
      State: 'CA',
      Zip: '94105',
      Email: newEmail || 'contact@example.com'
    };

    setDocument(doc => ({
      ...doc,
      mailMerge: {
        ...(doc.mailMerge || {}),
        recipients: [...(doc.mailMerge?.recipients || []), newRec]
      }
    }));

    setNewFirstName('');
    setNewLastName('');
    setNewCompany('');
    setNewEmail('');
  };

  const handleDeleteRecipient = (idx) => {
    setDocument(doc => ({
      ...doc,
      mailMerge: {
        ...(doc.mailMerge || {}),
        recipients: (doc.mailMerge?.recipients || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const parsed = parseCsvRecipients(csv);
      if (parsed.length > 0) {
        setDocument(doc => ({
          ...doc,
          mailMerge: {
            ...(doc.mailMerge || {}),
            recipients: [...(doc.mailMerge?.recipients || []), ...parsed]
          }
        }));
        alert(`Successfully imported ${parsed.length} recipients from CSV!`);
      } else {
        alert('Could not find valid recipient records in CSV file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="dragdocs-sidebar mailings-sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="sidebar-title">Mail Merge Recipients</span>
          <span className="badge-count">{recipients.length}</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setActiveSidebar(null)}
          title="Close Mailings Pane"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* CSV Import */}
        <div style={{ marginBottom: '16px' }}>
          <label className="ai-label">Import from CSV Database:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="ai-input"
            style={{ padding: '6px' }}
          />
        </div>

        {/* Add New Recipient Form */}
        <form onSubmit={handleAddRecipient} className="new-recipient-form">
          <label className="ai-label">Add Recipient Manually:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
            <input
              type="text"
              placeholder="First Name"
              className="ai-input"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="ai-input"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Company"
            className="ai-input"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            style={{ marginBottom: '6px' }}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="ai-input"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{ marginBottom: '8px' }}
          />
          <button type="submit" className="issue-action-btn primary" style={{ width: '100%' }}>
            + Add Recipient
          </button>
        </form>

        {/* Recipient list */}
        <div className="recipients-stream" style={{ marginTop: '16px' }}>
          <div className="popover-menu-header">Current Recipients ({recipients.length})</div>
          {recipients.map((rec, idx) => (
            <div key={idx} className="recipient-row-card">
              <div className="recipient-info">
                <div className="rec-name">{rec.FirstName} {rec.LastName}</div>
                <div className="rec-company">{rec.Company} • {rec.Email}</div>
              </div>
              <button
                className="comm-icon-btn"
                title="Delete recipient"
                onClick={() => handleDeleteRecipient(idx)}
              >
                <IconTrash size={12} color="#dc2626" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

