/**
 * Office Suite Home Launcher & Dashboard
 * Microsoft 365 style unified desktop home experience.
 * Quick file creation, rich templates gallery, recent/pinned documents manager,
 * and unified search across all Office applications.
 */

import React, { useState } from 'react';
import { useOfficeSuite } from '../../context/OfficeSuiteContext';
import {
  IconWordApp,
  IconSheetsApp,
  IconSlidesApp,
  IconPdfApp,
  IconSearch,
  IconPin,
  IconStar,
  IconPlus,
  IconFolderOpen,
  IconTrash,
  IconOfficeSuite
} from '../common/SvgIcons';

const TEMPLATES = [
  // Word Templates
  {
    id: 'tmpl-word-1',
    title: 'Executive Business Report',
    app: 'word',
    category: 'Word',
    desc: 'Multi-page formal corporate report with executive summary, tables, and references.'
  },
  {
    id: 'tmpl-word-2',
    title: 'Project Proposal & Scope',
    app: 'word',
    category: 'Word',
    desc: 'Professional statement of work, milestone timelines, and deliverable commitments.'
  },
  // Sheets Templates
  {
    id: 'tmpl-sheets-1',
    title: 'Corporate Budget & Projections',
    app: 'sheets',
    category: 'Sheets',
    desc: 'Multi-sheet quarterly budget model with dynamic SUM/AVERAGE formulas and margin analysis.'
  },
  {
    id: 'tmpl-sheets-2',
    title: 'Regional Sales Pipeline',
    app: 'sheets',
    category: 'Sheets',
    desc: 'Territory performance metrics, deal conversion rates, and revenue forecasting.'
  },
  // Slides Templates
  {
    id: 'tmpl-slides-1',
    title: 'Investor Pitch Deck',
    app: 'slides',
    category: 'Slides',
    desc: '16:9 widescreen presentation with market metrics, column charts, and execution roadmap.'
  },
  {
    id: 'tmpl-slides-2',
    title: 'Product Architecture Launch',
    app: 'slides',
    category: 'Slides',
    desc: 'Technical system diagrams, feature comparisons, and engineering milestone slides.'
  },
  // PDF Studio Templates
  {
    id: 'tmpl-pdf-1',
    title: 'Master Services Agreement (MSA)',
    app: 'pdf',
    category: 'PDF',
    desc: 'Complete enterprise contract with fillable signature fields, approvals stamp, and NDAs.'
  },
  {
    id: 'tmpl-pdf-2',
    title: 'Mutual Non-Disclosure Agreement',
    app: 'pdf',
    category: 'PDF',
    desc: 'Confidentiality covenants, IP safeguards, and digital verification blocks.'
  }
];

export function OfficeHomeDashboard() {
  const {
    openNewDocument,
    recentFiles,
    togglePinFile,
    toggleFavoriteFile,
    deleteRecentFile,
    openTabs,
    selectTab
  } = useOfficeSuite();

  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'recent' | 'pinned' | 'favorites'
  const [appFilter, setAppFilter] = useState('all'); // 'all' | 'word' | 'sheets' | 'slides' | 'pdf'
  const [templateFilter, setTemplateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter recent files
  const filteredRecent = recentFiles.filter(file => {
    // Tab filter
    if (activeTabFilter === 'pinned' && !file.isPinned) return false;
    if (activeTabFilter === 'favorites' && !file.isFavorite) return false;

    // App filter
    if (appFilter !== 'all' && file.app !== appFilter) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return file.title.toLowerCase().includes(q) || (file.author && file.author.toLowerCase().includes(q));
    }

    return true;
  });

  // Filter templates
  const filteredTemplates = TEMPLATES.filter(tmpl => {
    if (templateFilter !== 'all' && tmpl.app !== templateFilter) return false;
    return true;
  });

  const getAppBadge = (app) => {
    switch (app) {
      case 'word':
        return <IconWordApp size={22} />;
      case 'sheets':
        return <IconSheetsApp size={22} />;
      case 'slides':
        return <IconSlidesApp size={22} />;
      case 'pdf':
        return <IconPdfApp size={22} />;
      default:
        return <IconOfficeSuite size={22} />;
    }
  };

  const handleOpenExistingOrTab = (file) => {
    const existingTab = openTabs.find(t => t.title === file.title);
    if (existingTab) {
      selectTab(existingTab.id);
    } else {
      openNewDocument(file.app, file.title);
    }
  };

  return (
    <div className="office-home-container">
      {/* Header & Quick Create */}
      <header className="office-home-header">
        <div className="office-home-greeting-area">
          <h1 className="office-home-greeting">Good day</h1>
          <p className="office-home-subgreeting">Welcome to DragOffice Suite — Word, Sheets, Slides & PDF Studio</p>
        </div>

        {/* Global Search Bar */}
        <div className="office-home-search-bar">
          <IconSearch size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search documents, spreadsheets, presentations, and templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="office-home-search-input"
          />
          {searchTerm && (
            <button className="office-search-clear-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Quick Create Section */}
      <section className="office-quick-create-section">
        <div className="office-section-header">
          <h2 className="office-section-title">Create New</h2>
        </div>

        <div className="office-quick-create-grid">
          {/* New Word Doc */}
          <button
            className="office-quick-card office-card-word"
            onClick={() => openNewDocument('word', 'Document.docx')}
          >
            <div className="office-card-icon-wrap word-color">
              <IconWordApp size={32} />
            </div>
            <div className="office-card-info">
              <span className="office-card-title">Blank Document</span>
              <span className="office-card-app-label">DragDocs Word Processor</span>
            </div>
            <div className="office-card-action">
              <IconPlus size={18} />
            </div>
          </button>

          {/* New Sheets Spreadsheet */}
          <button
            className="office-quick-card office-card-sheets"
            onClick={() => openNewDocument('sheets', 'Corporate Budget.xlsx')}
          >
            <div className="office-card-icon-wrap sheets-color">
              <IconSheetsApp size={32} />
            </div>
            <div className="office-card-info">
              <span className="office-card-title">Blank Spreadsheet</span>
              <span className="office-card-app-label">DragSheets Analysis</span>
            </div>
            <div className="office-card-action">
              <IconPlus size={18} />
            </div>
          </button>

          {/* New Presentation */}
          <button
            className="office-quick-card office-card-slides"
            onClick={() => openNewDocument('slides', 'Presentation.pptx')}
          >
            <div className="office-card-icon-wrap slides-color">
              <IconSlidesApp size={32} />
            </div>
            <div className="office-card-info">
              <span className="office-card-title">Blank Presentation</span>
              <span className="office-card-app-label">DragSlides Platform</span>
            </div>
            <div className="office-card-action">
              <IconPlus size={18} />
            </div>
          </button>

          {/* New / Open PDF */}
          <button
            className="office-quick-card office-card-pdf"
            onClick={() => openNewDocument('pdf', 'Master Services Agreement.pdf')}
          >
            <div className="office-card-icon-wrap pdf-color">
              <IconPdfApp size={32} />
            </div>
            <div className="office-card-info">
              <span className="office-card-title">Open PDF Studio</span>
              <span className="office-card-app-label">DragPDF Workspace</span>
            </div>
            <div className="office-card-action">
              <IconFolderOpen size={18} />
            </div>
          </button>
        </div>
      </section>

      {/* Templates Gallery Section */}
      <section className="office-templates-section">
        <div className="office-section-header">
          <h2 className="office-section-title">Recommended Templates</h2>
          <div className="office-filter-pills">
            <button
              className={`office-filter-pill ${templateFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTemplateFilter('all')}
            >
              All
            </button>
            <button
              className={`office-filter-pill ${templateFilter === 'word' ? 'active' : ''}`}
              onClick={() => setTemplateFilter('word')}
            >
              Word
            </button>
            <button
              className={`office-filter-pill ${templateFilter === 'sheets' ? 'active' : ''}`}
              onClick={() => setTemplateFilter('sheets')}
            >
              Sheets
            </button>
            <button
              className={`office-filter-pill ${templateFilter === 'slides' ? 'active' : ''}`}
              onClick={() => setTemplateFilter('slides')}
            >
              Slides
            </button>
            <button
              className={`office-filter-pill ${templateFilter === 'pdf' ? 'active' : ''}`}
              onClick={() => setTemplateFilter('pdf')}
            >
              PDF Studio
            </button>
          </div>
        </div>

        <div className="office-templates-grid">
          {filteredTemplates.map(tmpl => (
            <div
              key={tmpl.id}
              className="office-template-card"
              onClick={() => openNewDocument(tmpl.app, `${tmpl.title}.${tmpl.app === 'word' ? 'docx' : tmpl.app === 'sheets' ? 'xlsx' : tmpl.app === 'slides' ? 'pptx' : 'pdf'}`)}
            >
              <div className="office-template-header">
                {getAppBadge(tmpl.app)}
                <span className="office-template-tag">{tmpl.category}</span>
              </div>
              <h3 className="office-template-title">{tmpl.title}</h3>
              <p className="office-template-desc">{tmpl.desc}</p>
              <div className="office-template-footer">
                <span className="office-template-btn">Create from Template</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Files Table Section */}
      <section className="office-recent-section">
        <div className="office-section-header">
          <div className="office-tab-buttons">
            <button
              className={`office-tab-btn ${activeTabFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTabFilter('all')}
            >
              Recent
            </button>
            <button
              className={`office-tab-btn ${activeTabFilter === 'pinned' ? 'active' : ''}`}
              onClick={() => setActiveTabFilter('pinned')}
            >
              Pinned
            </button>
            <button
              className={`office-tab-btn ${activeTabFilter === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTabFilter('favorites')}
            >
              Favorites
            </button>
          </div>

          <div className="office-app-filter-tabs">
            {['all', 'word', 'sheets', 'slides', 'pdf'].map(app => (
              <button
                key={app}
                className={`office-filter-btn ${appFilter === app ? 'active' : ''}`}
                onClick={() => setAppFilter(app)}
              >
                {app.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="office-files-table-container">
          <table className="office-files-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Name</th>
                <th>Application</th>
                <th>Date Modified</th>
                <th>Size</th>
                <th>Author</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecent.length === 0 ? (
                <tr>
                  <td colSpan="7" className="office-empty-table-cell">
                    No documents found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRecent.map(file => (
                  <tr key={file.id} className="office-file-row" onClick={() => handleOpenExistingOrTab(file)}>
                    <td className="office-file-icon-cell">
                      {getAppBadge(file.app)}
                    </td>
                    <td className="office-file-title-cell">
                      <span className="office-file-title">{file.title}</span>
                    </td>
                    <td className="office-file-app-cell">
                      <span className={`office-app-pill ${file.app}`}>
                        {file.app.toUpperCase()}
                      </span>
                    </td>
                    <td className="office-file-meta-cell">{file.dateModified}</td>
                    <td className="office-file-meta-cell">{file.size}</td>
                    <td className="office-file-meta-cell">{file.author}</td>
                    <td className="office-file-actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`office-action-icon-btn ${file.isPinned ? 'active' : ''}`}
                        title={file.isPinned ? 'Unpin' : 'Pin to list'}
                        onClick={() => togglePinFile(file.id)}
                      >
                        <IconPin size={15} color={file.isPinned ? '#185abd' : '#64748b'} />
                      </button>
                      <button
                        className={`office-action-icon-btn ${file.isFavorite ? 'active' : ''}`}
                        title={file.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                        onClick={() => toggleFavoriteFile(file.id)}
                      >
                        <IconStar
                          size={15}
                          color={file.isFavorite ? '#eab308' : '#64748b'}
                          fill={file.isFavorite ? '#eab308' : 'none'}
                        />
                      </button>
                      <button
                        className="office-action-icon-btn delete-btn"
                        title="Remove from recent"
                        onClick={() => deleteRecentFile(file.id)}
                      >
                        <IconTrash size={15} color="#94a3b8" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

