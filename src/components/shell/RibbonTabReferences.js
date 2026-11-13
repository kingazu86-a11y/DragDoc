/**
 * Ribbon Tab: REFERENCES
 * Table of Contents, Footnotes & Endnotes, Citation Source Manager, and Bibliography.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { createTableOfContentsBlock, createParagraphBlock } from '../../engine/documentModel';
import { IconTOC, IconFootnote } from '../common/SvgIcons';

const CITATION_STYLES = ['APA', 'MLA', 'Chicago', 'IEEE', 'Harvard'];

export function RibbonTabReferences() {
  const {
    document,
    setDocument,
    insertBlock,
    selectedBlockId,
    setActiveDialog
  } = useDocument();

  const [tocMenuOpen, setTocMenuOpen] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  const handleInsertTOC = () => {
    insertBlock(createTableOfContentsBlock(), selectedBlockId);
    setTocMenuOpen(false);
  };

  const handleInsertFootnote = () => {
    const text = window.prompt('Enter footnote explanation:', 'Detailed reference annotation or citation.');
    if (!text) return;

    setDocument(doc => {
      const nextId = (doc.footnotes?.length || 0) + 1;
      const newFootnote = {
        id: nextId,
        blockId: selectedBlockId,
        text
      };
      return {
        ...doc,
        footnotes: [...(doc.footnotes || []), newFootnote]
      };
    });
  };

  const handleInsertBibliography = () => {
    setDocument(doc => {
      const bibBlocks = [
        createParagraphBlock('Bibliography & References', { bold: true, fontSize: 16, fontColor: '#185abd' }, { spacingBefore: 18, spacingAfter: 8 })
      ];

      (doc.citations || []).forEach(c => {
        let text = '';
        if (doc.citationStyle === 'MLA') {
          text = `${c.author}. "${c.title}." ${c.publisher}, ${c.year}.`;
        } else if (doc.citationStyle === 'IEEE') {
          text = `[${c.id}] ${c.author}, "${c.title}," ${c.publisher}, ${c.year}.`;
        } else {
          // APA
          text = `${c.author} (${c.year}). ${c.title}. ${c.publisher || ''}.`;
        }
        bibBlocks.push(createParagraphBlock(`• ${text}`, { fontSize: 10.5 }, { indentLeft: 18, spacingAfter: 4 }));
      });

      return {
        ...doc,
        blocks: [...(doc.blocks || []), ...bibBlocks]
      };
    });
  };

  return (
    <div className="ribbon-tab-content">
      {/* Group: Table of Contents */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <div className="ribbon-picker-wrapper">
            <button className="ribbon-btn-large" onClick={() => setTocMenuOpen(!tocMenuOpen)} title="Table of Contents">
              <div className="ribbon-btn-icon">
                <IconTOC size={20} color="#185abd" />
              </div>
              <span className="ribbon-btn-label">Table of Contents</span>
            </button>

            {tocMenuOpen && (
              <div className="ribbon-popover-menu">
                <div className="popover-menu-item" onClick={handleInsertTOC}>
                  <div>
                    <div style={{ fontWeight: '500' }}>Automatic Table 1</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Headings 1, 2, and 3 with dot leaders</div>
                  </div>
                </div>
                <div className="popover-menu-item" onClick={handleInsertTOC}>
                  <div>
                    <div style={{ fontWeight: '500' }}>Automatic Table 2</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Modern Styled Hierarchy</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <span className="ribbon-group-title">Table of Contents</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Footnotes */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={handleInsertFootnote} title="Insert Footnote (Ctrl+Alt+F)">
            <div className="ribbon-btn-icon">
              <IconFootnote size={20} color="#185abd" />
            </div>
            <span className="ribbon-btn-label">Insert Footnote</span>
          </button>
        </div>
        <span className="ribbon-group-title">Footnotes</span>
      </div>

      <div className="ribbon-group-divider" />

      {/* Group: Citations & Bibliography */}
      <div className="ribbon-group">
        <div className="ribbon-group-controls">
          <button className="ribbon-btn-large" onClick={() => setActiveDialog('citations')} title="Manage Citation Sources">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Manage Sources</span>
          </button>

          <div className="ribbon-picker-wrapper">
            <button className="ribbon-tool-btn" onClick={() => setStyleMenuOpen(!styleMenuOpen)} title="Citation Style">
              <span style={{ fontWeight: '600' }}>Style: {document.citationStyle || 'APA'}</span>
            </button>

            {styleMenuOpen && (
              <div className="ribbon-popover-menu">
                {CITATION_STYLES.map(st => (
                  <div
                    key={st}
                    className={`popover-menu-item ${document.citationStyle === st ? 'active' : ''}`}
                    onClick={() => {
                      setDocument(doc => ({ ...doc, citationStyle: st }));
                      setStyleMenuOpen(false);
                    }}
                  >
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="ribbon-btn-large" onClick={handleInsertBibliography} title="Insert Bibliography page">
            <div className="ribbon-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
              </svg>
            </div>
            <span className="ribbon-btn-label">Bibliography</span>
          </button>
        </div>
        <span className="ribbon-group-title">Citations & Bibliography</span>
      </div>
    </div>
  );
}

