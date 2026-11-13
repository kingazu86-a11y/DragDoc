/**
 * Professional Presentation Ribbon for DragSlides / DragDocs
 * Features full 10-tab presentation ribbon navigation + Contextual Chart and Shape tabs.
 */

import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import {
  createSlideTextElement,
  createSlideShapeElement,
  createSlideTableElement,
  createSlideChartElement
} from '../../engine/presentationModel';
import {
  IconBold,
  IconItalic,
  IconTable,
  IconImage,
  IconChart
} from '../common/SvgIcons';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'draw', label: 'Draw' },
  { id: 'design', label: 'Design' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'animations', label: 'Animations' },
  { id: 'slideshow', label: 'Slide Show' },
  { id: 'review', label: 'Review' },
  { id: 'view', label: 'View' }
];

export function RibbonPresentation() {
  const {
    activeSlide,
    selectedElements,
    addElement,
    addSlide,
    deleteSlide,
    updateElement,
    activeRibbonTab,
    setActiveRibbonTab,
    startSlideShow,
    showGuides,
    setShowGuides,
    showGridlines,
    setShowGridlines,
    setZoom,
    setActiveInspectorTab,
    setEditingChartElementId,
    bringForward,
    sendBackward,
    alignElements
  } = usePresentation();

  const [shapePickerOpen, setShapePickerOpen] = useState(false);
  const [chartPickerOpen, setChartPickerOpen] = useState(false);

  const firstSelected = selectedElements[0];
  const isChartSelected = firstSelected?.type === 'chart';

  const handleInsertText = () => {
    addElement(createSlideTextElement('Click to add title or text', 100, 150, 600, 80));
  };

  const handleInsertShape = (shapeType) => {
    addElement(createSlideShapeElement(shapeType, 200, 160, 240, 150));
    setShapePickerOpen(false);
  };

  const handleInsertTable = () => {
    addElement(createSlideTableElement(3, 4, 100, 140, 760, 220));
  };

  const handleInsertChart = (chartType) => {
    addElement(createSlideChartElement(chartType, 80, 100, 800, 360));
    setChartPickerOpen(false);
  };

  const handleInsertImage = () => {
    const url = window.prompt(
      'Enter image URL:',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600'
    );
    if (url) {
      addElement({
        id: `img_${Date.now()}`,
        type: 'image',
        name: 'Picture',
        src: url,
        x: 180,
        y: 120,
        width: 480,
        height: 280,
        rotation: 0,
        zIndex: 2,
        opacity: 1
      });
    }
  };

  return (
    <div className="dragdocs-ribbon presentation-ribbon">
      {/* Ribbon Tab Bar */}
      <div className="ribbon-tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`ribbon-tab-btn ${activeRibbonTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveRibbonTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}

        {/* Contextual Chart Tools Tab */}
        {isChartSelected && (
          <button
            className={`ribbon-tab-btn contextual-tab ${activeRibbonTab === 'chartDesign' ? 'active' : ''}`}
            onClick={() => setActiveRibbonTab('chartDesign')}
          >
            Chart Design
          </button>
        )}

        <div className="ribbon-tab-bar-right">
          <button
            className="present-mode-btn"
            onClick={() => startSlideShow(false)}
            title="Start Slide Show from Current Slide (Shift+F5)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Present</span>
          </button>
        </div>
      </div>

      {/* Ribbon Content Panel */}
      <div className="ribbon-content-panel">
        {/* TAB: HOME */}
        {activeRibbonTab === 'home' && (
          <div className="ribbon-tab-content">
            {/* Slides Group */}
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button className="ribbon-btn-large" onClick={() => addSlide()} title="Add new slide">
                  <div className="ribbon-btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                      <line x1="12" y1="7" x2="12" y2="13" />
                      <line x1="9" y1="10" x2="15" y2="10" />
                    </svg>
                  </div>
                  <span className="ribbon-btn-label">New Slide</span>
                </button>

                <button className="ribbon-tool-btn text-danger" onClick={() => deleteSlide()} title="Delete active slide">
                  <span>Delete</span>
                </button>
              </div>
              <span className="ribbon-group-title">Slides</span>
            </div>

            <div className="ribbon-group-divider" />

            {/* Font / Text Group */}
            <div className="ribbon-group">
              <div className="ribbon-group-controls font-group-controls">
                <div className="ribbon-control-row">
                  <select
                    className="ribbon-select font-family-select"
                    value={firstSelected?.fontFamily || 'Calibri, sans-serif'}
                    onChange={(e) => firstSelected && updateElement(firstSelected.id, { fontFamily: e.target.value })}
                  >
                    <option value="Calibri, sans-serif">Calibri</option>
                    <option value="Segoe UI, sans-serif">Segoe UI</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                  </select>

                  <select
                    className="ribbon-select font-size-select"
                    value={firstSelected?.fontSize || 24}
                    onChange={(e) => firstSelected && updateElement(firstSelected.id, { fontSize: Number(e.target.value) })}
                  >
                    {[14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 60, 72].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="ribbon-control-row">
                  <button
                    className={`ribbon-icon-btn ${firstSelected?.fontWeight === 'bold' ? 'active' : ''}`}
                    onClick={() => firstSelected && updateElement(firstSelected.id, { fontWeight: firstSelected.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  >
                    <IconBold size={13} />
                  </button>

                  <button
                    className={`ribbon-icon-btn ${firstSelected?.fontStyle === 'italic' ? 'active' : ''}`}
                    onClick={() => firstSelected && updateElement(firstSelected.id, { fontStyle: firstSelected.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  >
                    <IconItalic size={13} />
                  </button>

                  <button
                    className="ribbon-icon-btn"
                    onClick={() => firstSelected && updateElement(firstSelected.id, { align: 'left' })}
                  >
                    <span>L</span>
                  </button>
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => firstSelected && updateElement(firstSelected.id, { align: 'center' })}
                  >
                    <span>C</span>
                  </button>
                  <button
                    className="ribbon-icon-btn"
                    onClick={() => firstSelected && updateElement(firstSelected.id, { align: 'right' })}
                  >
                    <span>R</span>
                  </button>
                </div>
              </div>
              <span className="ribbon-group-title">Font</span>
            </div>

            <div className="ribbon-group-divider" />

            {/* Quick Insert Group */}
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button className="ribbon-btn-large" onClick={handleInsertText} title="Insert Text Box">
                  <div className="ribbon-btn-icon">
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#185abd' }}>T</span>
                  </div>
                  <span className="ribbon-btn-label">Text Box</span>
                </button>

                <div className="ribbon-picker-wrapper">
                  <button className="ribbon-btn-large" onClick={() => setShapePickerOpen(!shapePickerOpen)}>
                    <div className="ribbon-btn-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <circle cx="17.5" cy="6.5" r="3.5" />
                        <polygon points="12 14 17 21 7 21" />
                      </svg>
                    </div>
                    <span className="ribbon-btn-label">Shapes</span>
                  </button>

                  {shapePickerOpen && (
                    <div className="ribbon-popover-menu" style={{ width: '180px' }}>
                      <div className="popover-menu-item" onClick={() => handleInsertShape('rect')}>Rectangle</div>
                      <div className="popover-menu-item" onClick={() => handleInsertShape('roundRect')}>Rounded Rect</div>
                      <div className="popover-menu-item" onClick={() => handleInsertShape('circle')}>Circle / Oval</div>
                      <div className="popover-menu-item" onClick={() => handleInsertShape('triangle')}>Triangle</div>
                      <div className="popover-menu-item" onClick={() => handleInsertShape('diamond')}>Diamond</div>
                    </div>
                  )}
                </div>
              </div>
              <span className="ribbon-group-title">Drawing</span>
            </div>

            <div className="ribbon-group-divider" />

            {/* Arrange & Align */}
            <div className="ribbon-group">
              <div className="ribbon-group-controls font-group-controls">
                <div className="ribbon-control-row">
                  <button className="ribbon-tool-btn" onClick={() => alignElements('left')}>Align L</button>
                  <button className="ribbon-tool-btn" onClick={() => alignElements('center')}>Center</button>
                  <button className="ribbon-tool-btn" onClick={() => alignElements('right')}>Align R</button>
                </div>
                <div className="ribbon-control-row">
                  <button className="ribbon-tool-btn" onClick={() => firstSelected && bringForward(firstSelected.id)}>Forward</button>
                  <button className="ribbon-tool-btn" onClick={() => firstSelected && sendBackward(firstSelected.id)}>Backward</button>
                </div>
              </div>
              <span className="ribbon-group-title">Arrange</span>
            </div>
          </div>
        )}

        {/* TAB: INSERT */}
        {activeRibbonTab === 'insert' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button className="ribbon-btn-large" onClick={handleInsertTable} title="Insert Data Table">
                  <div className="ribbon-btn-icon"><IconTable size={20} color="#185abd" /></div>
                  <span className="ribbon-btn-label">Table</span>
                </button>

                <button className="ribbon-btn-large" onClick={handleInsertImage} title="Insert Picture">
                  <div className="ribbon-btn-icon"><IconImage size={20} color="#185abd" /></div>
                  <span className="ribbon-btn-label">Pictures</span>
                </button>

                <div className="ribbon-picker-wrapper">
                  <button className="ribbon-btn-large" onClick={() => setChartPickerOpen(!chartPickerOpen)} title="Insert Business Chart">
                    <div className="ribbon-btn-icon"><IconChart size={20} color="#185abd" /></div>
                    <span className="ribbon-btn-label">Chart</span>
                  </button>

                  {chartPickerOpen && (
                    <div className="ribbon-popover-menu" style={{ width: '200px' }}>
                      <div className="popover-menu-header">Chart Types</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('clusteredColumn')}>Clustered Column</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('stackedColumn')}>Stacked Column</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('clusteredBar')}>Clustered Bar</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('line')}>Line with Markers</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('pie')}>Pie Chart</div>
                      <div className="popover-menu-item" onClick={() => handleInsertChart('doughnut')}>Doughnut Chart</div>
                    </div>
                  )}
                </div>

                <button className="ribbon-btn-large" onClick={handleInsertText} title="Insert Text Box">
                  <div className="ribbon-btn-icon"><span style={{ fontSize: '16px', fontWeight: 'bold', color: '#185abd' }}>T</span></div>
                  <span className="ribbon-btn-label">Text Box</span>
                </button>
              </div>
              <span className="ribbon-group-title">Illustrations</span>
            </div>
          </div>
        )}

        {/* TAB: TRANSITIONS */}
        {activeRibbonTab === 'transitions' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                {['none', 'fade', 'push', 'wipe', 'split', 'zoom', 'dissolve'].map(t => (
                  <button
                    key={t}
                    className={`ribbon-tool-btn ${activeSlide?.transition?.type === t ? 'active' : ''}`}
                    onClick={() => setActiveInspectorTab('transition')}
                  >
                    <span>{t.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              <span className="ribbon-group-title">Transition to This Slide</span>
            </div>
          </div>
        )}

        {/* TAB: ANIMATIONS */}
        {activeRibbonTab === 'animations' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                {['none', 'fade', 'flyIn', 'zoom', 'pulse', 'spin', 'fadeOut'].map(a => (
                  <button
                    key={a}
                    className={`ribbon-tool-btn ${firstSelected?.animation?.type === a ? 'active' : ''}`}
                    onClick={() => setActiveInspectorTab('animation')}
                  >
                    <span>{a}</span>
                  </button>
                ))}
              </div>
              <span className="ribbon-group-title">Animation Effects</span>
            </div>
          </div>
        )}

        {/* TAB: SLIDE SHOW */}
        {activeRibbonTab === 'slideshow' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button className="ribbon-btn-large" onClick={() => startSlideShow(true)} title="Start from Beginning (F5)">
                  <div className="ribbon-btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span className="ribbon-btn-label">From Beginning</span>
                </button>

                <button className="ribbon-btn-large" onClick={() => startSlideShow(false)} title="Start from Current Slide (Shift+F5)">
                  <div className="ribbon-btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185abd" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                      <line x1="2" y1="3" x2="2" y2="21" strokeWidth="3" />
                    </svg>
                  </div>
                  <span className="ribbon-btn-label">From Current</span>
                </button>
              </div>
              <span className="ribbon-group-title">Start Slide Show</span>
            </div>
          </div>
        )}

        {/* TAB: VIEW */}
        {activeRibbonTab === 'view' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls font-group-controls">
                <label className="ribbon-checkbox-item">
                  <input type="checkbox" checked={showGuides} onChange={(e) => setShowGuides(e.target.checked)} />
                  <span>Guides</span>
                </label>
                <label className="ribbon-checkbox-item">
                  <input type="checkbox" checked={showGridlines} onChange={(e) => setShowGridlines(e.target.checked)} />
                  <span>Gridlines</span>
                </label>
              </div>
              <span className="ribbon-group-title">Show</span>
            </div>

            <div className="ribbon-group-divider" />

            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button className="ribbon-btn-large" onClick={() => setZoom(100)}>
                  <div className="ribbon-btn-icon"><span style={{ fontWeight: 'bold', fontSize: '13px' }}>100%</span></div>
                  <span className="ribbon-btn-label">100%</span>
                </button>
                <button className="ribbon-btn-large" onClick={() => setZoom(90)}>
                  <div className="ribbon-btn-icon"><span style={{ fontWeight: 'bold', fontSize: '13px' }}>Fit</span></div>
                  <span className="ribbon-btn-label">Fit Slide</span>
                </button>
              </div>
              <span className="ribbon-group-title">Zoom</span>
            </div>
          </div>
        )}

        {/* CONTEXTUAL TAB: CHART DESIGN */}
        {isChartSelected && activeRibbonTab === 'chartDesign' && (
          <div className="ribbon-tab-content">
            <div className="ribbon-group">
              <div className="ribbon-group-controls">
                <button
                  className="ribbon-btn-large"
                  onClick={() => setEditingChartElementId(firstSelected.id)}
                  title="Open Spreadsheet Data Editor"
                >
                  <div className="ribbon-btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#107c41" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                  </div>
                  <span className="ribbon-btn-label" style={{ fontWeight: 'bold', color: '#107c41' }}>EDIT DATA</span>
                </button>
              </div>
              <span className="ribbon-group-title">Data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
