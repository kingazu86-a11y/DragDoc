/**
 * Main Ribbon Component for DragDocs Word Processor
 * Features all 11 tabs with professional Office layout, icons, and commands.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { RibbonTabHome } from './RibbonTabHome';
import { RibbonTabInsert } from './RibbonTabInsert';
import { RibbonTabDraw } from './RibbonTabDraw';
import { RibbonTabDesign } from './RibbonTabDesign';
import { RibbonTabLayout } from './RibbonTabLayout';
import { RibbonTabReferences } from './RibbonTabReferences';
import { RibbonTabMailings } from './RibbonTabMailings';
import { RibbonTabReview } from './RibbonTabReview';
import { RibbonTabView } from './RibbonTabView';
import { RibbonTabHelp } from './RibbonTabHelp';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'draw', label: 'Draw' },
  { id: 'design', label: 'Design' },
  { id: 'layout', label: 'Layout' },
  { id: 'references', label: 'References' },
  { id: 'mailings', label: 'Mailings' },
  { id: 'review', label: 'Review' },
  { id: 'view', label: 'View' },
  { id: 'help', label: 'Help' }
];

export function Ribbon() {
  const {
    activeTab,
    setActiveTab,
    setIsBackstageOpen
  } = useDocument();

  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);

  return (
    <div className={`dragdocs-ribbon ${isRibbonCollapsed ? 'collapsed' : ''}`}>
      {/* Ribbon Tab Bar */}
      <div className="ribbon-tab-bar">
        {/* Special File / Backstage Tab */}
        <button
          className="ribbon-tab-btn file-tab-btn"
          onClick={() => setIsBackstageOpen(true)}
          title="Open File Backstage Menu"
        >
          File
        </button>

        {/* Standard Tabs */}
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`ribbon-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Right: Collapse toggle */}
        <div className="ribbon-tab-bar-right">
          <button
            className="ribbon-collapse-btn"
            onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
            title={isRibbonCollapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {isRibbonCollapsed ? (
                <polyline points="6 9 12 15 18 9" />
              ) : (
                <polyline points="18 15 12 9 6 15" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Ribbon Active Content Panel */}
      {!isRibbonCollapsed && (
        <div className="ribbon-content-panel">
          {activeTab === 'home' && <RibbonTabHome />}
          {activeTab === 'insert' && <RibbonTabInsert />}
          {activeTab === 'draw' && <RibbonTabDraw />}
          {activeTab === 'design' && <RibbonTabDesign />}
          {activeTab === 'layout' && <RibbonTabLayout />}
          {activeTab === 'references' && <RibbonTabReferences />}
          {activeTab === 'mailings' && <RibbonTabMailings />}
          {activeTab === 'review' && <RibbonTabReview />}
          {activeTab === 'view' && <RibbonTabView />}
          {activeTab === 'help' && <RibbonTabHelp />}
        </div>
      )}
    </div>
  );
}

