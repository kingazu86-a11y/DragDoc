/**
 * Right Properties & Formatting Inspector for DragSlides / DragDocs
 * Comprehensive controls for Shape, Text, Background, Animations, Transitions, and Layers.
 */

import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { ColorPickerPopover } from '../common/ColorPickerPopover';

export function FormatInspector() {
  const {
    activeSlide,
    selectedElements,
    updateElement,
    setSlideBackground,
    setSlideTransition,
    applyTransitionToAll,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    activeInspectorTab,
    setActiveInspectorTab
  } = usePresentation();

  const [colorPickerTarget, setColorPickerTarget] = useState(null); // 'fill' | 'stroke' | 'text' | 'bg'

  const firstSelected = selectedElements[0];

  const TRANSITION_TYPES = ['none', 'fade', 'push', 'wipe', 'split', 'zoom', 'dissolve'];
  const ANIMATION_TYPES = [
    { id: 'none', label: 'None' },
    { id: 'fade', label: 'Fade In' },
    { id: 'flyIn', label: 'Fly In' },
    { id: 'zoom', label: 'Zoom' },
    { id: 'pulse', label: 'Pulse (Emphasis)' },
    { id: 'spin', label: 'Spin' },
    { id: 'fadeOut', label: 'Fade Out (Exit)' }
  ];

  return (
    <div className="dragdocs-inspector-panel">
      {/* Inspector Tab Strip */}
      <div className="inspector-tabs">
        <button
          className={`inspector-tab-btn ${activeInspectorTab === 'format' ? 'active' : ''}`}
          onClick={() => setActiveInspectorTab('format')}
        >
          Format
        </button>
        <button
          className={`inspector-tab-btn ${activeInspectorTab === 'animation' ? 'active' : ''}`}
          onClick={() => setActiveInspectorTab('animation')}
        >
          Animation
        </button>
        <button
          className={`inspector-tab-btn ${activeInspectorTab === 'transition' ? 'active' : ''}`}
          onClick={() => setActiveInspectorTab('transition')}
        >
          Transition
        </button>
        <button
          className={`inspector-tab-btn ${activeInspectorTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveInspectorTab('layers')}
        >
          Layers
        </button>
      </div>

      <div className="inspector-body">
        {/* TAB 1: FORMAT */}
        {activeInspectorTab === 'format' && (
          <div>
            {firstSelected ? (
              <div className="inspector-section">
                <div className="inspector-section-header">
                  {firstSelected.name || 'Object Format'}
                </div>

                {/* Dimensions & Position */}
                <div className="inspector-row-grid">
                  <div>
                    <label className="ai-label">Width</label>
                    <input
                      type="number"
                      className="ai-input"
                      value={firstSelected.width}
                      onChange={(e) => updateElement(firstSelected.id, { width: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="ai-label">Height</label>
                    <input
                      type="number"
                      className="ai-input"
                      value={firstSelected.height}
                      onChange={(e) => updateElement(firstSelected.id, { height: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="ai-label">X Pos</label>
                    <input
                      type="number"
                      className="ai-input"
                      value={firstSelected.x}
                      onChange={(e) => updateElement(firstSelected.id, { x: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="ai-label">Y Pos</label>
                    <input
                      type="number"
                      className="ai-input"
                      value={firstSelected.y}
                      onChange={(e) => updateElement(firstSelected.id, { y: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Fill & Stroke for shapes/boxes */}
                {firstSelected.type === 'shape' && (
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="ai-label" style={{ margin: 0 }}>Fill Color</span>
                      <button
                        className="color-swatch-btn"
                        style={{ backgroundColor: firstSelected.fill || '#185abd' }}
                        onClick={() => setColorPickerTarget(colorPickerTarget === 'fill' ? null : 'fill')}
                      />
                    </div>
                    {colorPickerTarget === 'fill' && (
                      <ColorPickerPopover
                        color={firstSelected.fill || '#185abd'}
                        onChange={(c) => updateElement(firstSelected.id, { fill: c })}
                        onClose={() => setColorPickerTarget(null)}
                      />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span className="ai-label" style={{ margin: 0 }}>Border Stroke</span>
                      <button
                        className="color-swatch-btn"
                        style={{ backgroundColor: firstSelected.stroke || '#104f9f' }}
                        onClick={() => setColorPickerTarget(colorPickerTarget === 'stroke' ? null : 'stroke')}
                      />
                    </div>
                    {colorPickerTarget === 'stroke' && (
                      <ColorPickerPopover
                        color={firstSelected.stroke || '#104f9f'}
                        onChange={(c) => updateElement(firstSelected.id, { stroke: c })}
                        onClose={() => setColorPickerTarget(null)}
                      />
                    )}
                  </div>
                )}

                {/* Layer arrange buttons */}
                <div style={{ marginTop: '16px' }}>
                  <label className="ai-label">Layer Arrange</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button className="issue-action-btn" onClick={() => bringForward(firstSelected.id)}>Bring Forward</button>
                    <button className="issue-action-btn" onClick={() => sendBackward(firstSelected.id)}>Send Backward</button>
                    <button className="issue-action-btn" onClick={() => bringToFront(firstSelected.id)}>Bring to Front</button>
                    <button className="issue-action-btn" onClick={() => sendToBack(firstSelected.id)}>Send to Back</button>
                  </div>
                </div>
              </div>
            ) : (
              /* No selection: Format Slide Background */
              <div className="inspector-section">
                <div className="inspector-section-header">Slide Background</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="ai-label" style={{ margin: 0 }}>Background Color</span>
                  <button
                    className="color-swatch-btn"
                    style={{ backgroundColor: activeSlide?.background?.color || '#ffffff' }}
                    onClick={() => setColorPickerTarget(colorPickerTarget === 'bg' ? null : 'bg')}
                  />
                </div>
                {colorPickerTarget === 'bg' && (
                  <ColorPickerPopover
                    color={activeSlide?.background?.color || '#ffffff'}
                    onChange={(c) => setSlideBackground(activeSlide.id, { type: 'solid', color: c })}
                    onClose={() => setColorPickerTarget(null)}
                  />
                )}
                <div className="sidebar-empty-state" style={{ marginTop: '20px' }}>
                  Select an object on the slide canvas to inspect its geometry, fill, and font formatting.
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANIMATION */}
        {activeInspectorTab === 'animation' && (
          <div className="inspector-section">
            <div className="inspector-section-header">Object Animations</div>
            {firstSelected ? (
              <div>
                <label className="ai-label">Animation Preset</label>
                <select
                  className="ai-select"
                  value={firstSelected.animation?.type || 'none'}
                  onChange={(e) => updateElement(firstSelected.id, {
                    animation: {
                      type: e.target.value,
                      duration: 0.5,
                      delay: 0,
                      trigger: 'click'
                    }
                  })}
                >
                  {ANIMATION_TYPES.map(a => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                  <div>
                    <label className="ai-label">Duration (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="ai-input"
                      value={firstSelected.animation?.duration || 0.5}
                      onChange={(e) => updateElement(firstSelected.id, {
                        animation: { ...(firstSelected.animation || {}), duration: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <label className="ai-label">Delay (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="ai-input"
                      value={firstSelected.animation?.delay || 0}
                      onChange={(e) => updateElement(firstSelected.id, {
                        animation: { ...(firstSelected.animation || {}), delay: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label className="ai-label">Start Trigger</label>
                  <select
                    className="ai-select"
                    value={firstSelected.animation?.trigger || 'click'}
                    onChange={(e) => updateElement(firstSelected.id, {
                      animation: { ...(firstSelected.animation || {}), trigger: e.target.value }
                    })}
                  >
                    <option value="click">On Click</option>
                    <option value="withPrevious">With Previous</option>
                    <option value="afterPrevious">After Previous</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="sidebar-empty-state">Select an object to assign entrance, emphasis, or exit animations.</div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSITION */}
        {activeInspectorTab === 'transition' && (
          <div className="inspector-section">
            <div className="inspector-section-header">Slide Transition</div>
            <label className="ai-label">Transition Effect</label>
            <select
              className="ai-select"
              value={activeSlide?.transition?.type || 'fade'}
              onChange={(e) => setSlideTransition(activeSlide.id, {
                ...(activeSlide?.transition || {}),
                type: e.target.value
              })}
            >
              {TRANSITION_TYPES.map(t => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>

            <div style={{ marginTop: '12px' }}>
              <label className="ai-label">Duration (seconds)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                className="ai-input"
                value={activeSlide?.transition?.duration || 0.5}
                onChange={(e) => setSlideTransition(activeSlide.id, {
                  ...(activeSlide?.transition || {}),
                  duration: Number(e.target.value)
                })}
              />
            </div>

            <button
              className="issue-action-btn primary"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => applyTransitionToAll(activeSlide?.transition || { type: 'fade', duration: 0.5 })}
            >
              Apply to All Slides
            </button>
          </div>
        )}

        {/* TAB 4: LAYERS */}
        {activeInspectorTab === 'layers' && (
          <div className="inspector-section">
            <div className="inspector-section-header">Slide Elements</div>
            <div className="layers-list">
              {(activeSlide?.elements || []).map((el) => (
                <div
                  key={el.id}
                  className={`layer-item ${selectedElements.some(s => s.id === el.id) ? 'active' : ''}`}
                  onClick={() => updateElement(el.id, {})}
                >
                  <span className="layer-name">{el.name || el.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

