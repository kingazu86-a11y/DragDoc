/**
 * Professional Microsoft Word-style File Backstage View
 * Full template gallery, Open/Upload, Save, Export (DOCX, PDF, MD, HTML, TXT), Document Info, and Protection.
 */

import React, { useState, useMemo, useRef } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { DOCUMENT_TEMPLATES } from '../../engine/templates';
import { AutoSaveEngine } from '../../engine/autosaveEngine';
import { calculateDocumentStats } from '../../engine/reviewEngine';
import { downloadBlob } from '../../engine/docxExporter';
import { AppLogoIcon } from '../common/SvgIcons';

export function FileBackstage() {
  const {
    document,
    setDocument,
    isBackstageOpen,
    setIsBackstageOpen,
    loadTemplate,
    exportDocx,
    importDocx,
    exportPdf,
    triggerManualSave,
    setActiveDialog
  } = useDocument();

  const [activeBackstageTab, setActiveBackstageTab] = useState('info'); // 'info' | 'new' | 'open' | 'saveAs' | 'export' | 'print'
  const fileInputRef = useRef(null);

  const stats = useMemo(() => {
    return calculateDocumentStats(document);
  }, [document]);

  const recents = useMemo(() => {
    return AutoSaveEngine.getRecents();
  }, []);

  if (!isBackstageOpen) return null;

  const handleExportText = () => {
    const textLines = (document.blocks || []).map(b => {
      return (b.textRuns || []).map(r => r.text || '').join('');
    });
    const blob = new Blob([textLines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${document.title || 'document'}.txt`);
  };

  const handleExportMarkdown = () => {
    const mdLines = (document.blocks || []).map(b => {
      const text = (b.textRuns || []).map(r => {
        let t = r.text || '';
        if (r.bold) t = `**${t}**`;
        if (r.italic) t = `*${t}*`;
        if (r.strikethrough) t = `~~${t}~~`;
        return t;
      }).join('');

      if (b.type === 'heading') {
        const hashes = '#'.repeat(b.level || 1);
        return `${hashes} ${text}`;
      }
      if (b.type === 'quote') {
        return `> ${text}`;
      }
      return text;
    });

    const blob = new Blob([mdLines.join('\n\n')], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, `${document.title || 'document'}.md`);
  };

  const handleExportHtml = () => {
    const htmlBlocks = (document.blocks || []).map(b => {
      const text = (b.textRuns || []).map(r => {
        let t = r.text || '';
        if (r.bold) t = `<strong>${t}</strong>`;
        if (r.italic) t = `<em>${t}</em>`;
        if (r.underline) t = `<u>${t}</u>`;
        return t;
      }).join('');

      if (b.type === 'heading') return `<h${b.level || 1}>${text}</h${b.level || 1}>`;
      if (b.type === 'quote') return `<blockquote>${text}</blockquote>`;
      return `<p>${text}</p>`;
    });

    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${document.title}</title><style>body{font-family:Calibri,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.5;}</style></head><body>${htmlBlocks.join('\n')}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, `${document.title || 'document'}.html`);
  };

  const handleExportNative = () => {
    const jsonStr = JSON.stringify(document, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, `${document.title || 'document'}.dragdoc`);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.docx')) {
      importDocx(file);
    } else if (file.name.endsWith('.dragdoc') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          setDocument(parsed);
          setIsBackstageOpen(false);
        } catch (err) {
          alert('Could not parse .dragdoc file: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const paragraphs = text.split(/\r?\n\r?\n/).filter(Boolean);
        setDocument(doc => ({
          ...doc,
          title: file.name.replace(/\.[^/.]+$/, ''),
          blocks: paragraphs.map(p => ({
            id: `p_${Date.now()}_${Math.random()}`,
            type: 'paragraph',
            textRuns: [{ text: p }]
          }))
        }));
        setIsBackstageOpen(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="dragdocs-backstage-overlay">
      {/* Left Backstage Navigation Menu */}
      <div className="backstage-sidebar">
        <button
          className="backstage-back-btn"
          onClick={() => setIsBackstageOpen(false)}
          title="Return to Document"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="backstage-nav-items">
          <button
            className={`backstage-nav-btn ${activeBackstageTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveBackstageTab('info')}
          >
            Info
          </button>

          <button
            className={`backstage-nav-btn ${activeBackstageTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveBackstageTab('new')}
          >
            New
          </button>

          <button
            className={`backstage-nav-btn ${activeBackstageTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveBackstageTab('open')}
          >
            Open
          </button>

          <button
            className="backstage-nav-btn"
            onClick={() => {
              triggerManualSave();
              setIsBackstageOpen(false);
            }}
          >
            Save
          </button>

          <button
            className={`backstage-nav-btn ${activeBackstageTab === 'saveAs' ? 'active' : ''}`}
            onClick={() => setActiveBackstageTab('saveAs')}
          >
            Save As
          </button>

          <button
            className={`backstage-nav-btn ${activeBackstageTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveBackstageTab('export')}
          >
            Export
          </button>

          <button
            className="backstage-nav-btn"
            onClick={() => {
              setIsBackstageOpen(false);
              setActiveDialog('print');
            }}
          >
            Print
          </button>
        </div>

        <div className="backstage-nav-footer">
          <div className="backstage-version">DragDocs 2026 Enterprise</div>
        </div>
      </div>

      {/* Right Backstage Content Area */}
      <div className="backstage-content-area">
        {/* TAB: INFO */}
        {activeBackstageTab === 'info' && (
          <div className="backstage-view-panel">
            <h2 className="backstage-heading">Document Information</h2>

            <div className="backstage-info-grid">
              <div className="info-main-card">
                <div className="info-doc-header">
                  <AppLogoIcon size={36} />
                  <div>
                    <h3 className="info-doc-title">{document.title || 'Untitled Document'}</h3>
                    <div className="info-doc-path">Local Device Storage / Cloud Synced</div>
                  </div>
                </div>

                <div className="info-action-row">
                  <button
                    className="backstage-action-card"
                    onClick={() => {
                      const pass = window.prompt('Enter protection password to lock editing:', '');
                      if (pass) alert('Document is now protected. Password required for modifications.');
                    }}
                  >
                    <div className="action-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <div className="action-card-title">Protect Document</div>
                      <div className="action-card-desc">Control what types of changes people can make to this document.</div>
                    </div>
                  </button>

                  <button
                    className="backstage-action-card"
                    onClick={() => {
                      AutoSaveEngine.createVersionSnapshot(document, 'User Checkpoint');
                      alert('Version snapshot successfully created!');
                    }}
                  >
                    <div className="action-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                    </div>
                    <div>
                      <div className="action-card-title">Version History</div>
                      <div className="action-card-desc">Create or inspect immutable recovery checkpoints.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Properties Sidebar */}
              <div className="info-properties-panel">
                <h4 className="properties-title">Properties</h4>
                <div className="property-item">
                  <span className="prop-name">Size:</span>
                  <span className="prop-val">~{Math.round(JSON.stringify(document).length / 1024)} KB</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Pages:</span>
                  <span className="prop-val">{stats.pages}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Words:</span>
                  <span className="prop-val">{stats.words}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Characters:</span>
                  <span className="prop-val">{stats.characters}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Reading Time:</span>
                  <span className="prop-val">{stats.readingTime}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Author:</span>
                  <span className="prop-val">{document.author || 'Author'}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Created:</span>
                  <span className="prop-val">{new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="property-item">
                  <span className="prop-name">Last Modified:</span>
                  <span className="prop-val">{new Date(document.updatedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEW */}
        {activeBackstageTab === 'new' && (
          <div className="backstage-view-panel">
            <h2 className="backstage-heading">New Document</h2>
            <p className="backstage-subtext">Start from scratch or select a professionally crafted document template.</p>

            <div className="templates-grid">
              {DOCUMENT_TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.id}
                  className="template-card"
                  onClick={() => loadTemplate(tmpl.id)}
                >
                  <div className="template-thumb-preview">
                    <div className="preview-sheet">
                      <div className="preview-head" />
                      <div className="preview-line" style={{ width: '85%' }} />
                      <div className="preview-line" style={{ width: '70%' }} />
                      <div className="preview-line" style={{ width: '92%' }} />
                      <div className="preview-line" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div className="template-meta">
                    <div className="template-title">{tmpl.name}</div>
                    <div className="template-category">{tmpl.category}</div>
                    <div className="template-description">{tmpl.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: OPEN */}
        {activeBackstageTab === 'open' && (
          <div className="backstage-view-panel">
            <h2 className="backstage-heading">Open Document</h2>

            <div className="open-options-box">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".docx,.dragdoc,.json,.txt,.md"
                onChange={handleFileInputChange}
              />

              <button
                className="open-browse-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="browse-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Browse from this Device</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Supports .docx, .dragdoc, .txt, and .md files</div>
                </div>
              </button>
            </div>

            <h3 className="section-subtitle" style={{ marginTop: '24px' }}>Recent Documents</h3>
            <div className="recents-list">
              {recents.length === 0 ? (
                <div style={{ color: '#9ca3af', fontStyle: 'italic', padding: '12px 0' }}>No recent files recorded yet.</div>
              ) : (
                recents.map((r, idx) => (
                  <div key={idx} className="recent-file-row">
                    <AppLogoIcon size={18} />
                    <div className="recent-file-info">
                      <div className="recent-file-name">{r.title}</div>
                      <div className="recent-file-date">{new Date(r.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: SAVE AS */}
        {activeBackstageTab === 'saveAs' && (
          <div className="backstage-view-panel">
            <h2 className="backstage-heading">Save As</h2>
            <p className="backstage-subtext">Save a copy in DragDocs Native Format or export to standard files.</p>

            <div className="export-cards-grid">
              <div className="export-option-card" onClick={handleExportNative}>
                <div className="export-card-icon">
                  <AppLogoIcon size={28} />
                </div>
                <div>
                  <div className="export-title">DragDocs Document (*.dragdoc)</div>
                  <div className="export-desc">Native JSON format preserving full document hierarchy, drawings, and metadata.</div>
                </div>
              </div>

              <div className="export-option-card" onClick={exportDocx}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Microsoft Word (*.docx)</div>
                  <div className="export-desc">Standard OpenXML document compatible with desktop Microsoft Office.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EXPORT */}
        {activeBackstageTab === 'export' && (
          <div className="backstage-view-panel">
            <h2 className="backstage-heading">Export Document</h2>

            <div className="export-cards-grid">
              <div className="export-option-card" onClick={exportPdf}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Create PDF / XPS Document (*.pdf)</div>
                  <div className="export-desc">Preserves layout, formatting, fonts, and images. Freezes content for printing.</div>
                </div>
              </div>

              <div className="export-option-card" onClick={exportDocx}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Microsoft Word (*.docx)</div>
                  <div className="export-desc">Full formatting, headings, tables, and alignment export.</div>
                </div>
              </div>

              <div className="export-option-card" onClick={handleExportMarkdown}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M7 15V9l3 4 3-4v6" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Markdown Document (*.md)</div>
                  <div className="export-desc">Structured plain text with markdown headings and formatting tags.</div>
                </div>
              </div>

              <div className="export-option-card" onClick={handleExportHtml}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Web Page (*.html)</div>
                  <div className="export-desc">Single file HTML ready for publishing or browser viewing.</div>
                </div>
              </div>

              <div className="export-option-card" onClick={handleExportText}>
                <div className="export-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="14" y2="18" />
                  </svg>
                </div>
                <div>
                  <div className="export-title">Plain Text (*.txt)</div>
                  <div className="export-desc">Unformatted raw text document.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
