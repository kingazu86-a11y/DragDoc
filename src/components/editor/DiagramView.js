/**
 * SmartArt / Process Diagram Component
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';

export function DiagramView({ block }) {
  const { updateBlock, deleteBlock } = useDocument();
  const items = block.items || [];
  const accent = block.accentColor || '#185abd';

  const handleItemTitleChange = (idx, text) => {
    const newItems = items.map((it, i) => i === idx ? { ...it, title: text } : it);
    updateBlock(block.id, { items: newItems });
  };

  const handleItemDescChange = (idx, text) => {
    const newItems = items.map((it, i) => i === idx ? { ...it, desc: text } : it);
    updateBlock(block.id, { items: newItems });
  };

  const handleAddItem = () => {
    const newItem = {
      id: `it_${Date.now()}`,
      title: `Step ${items.length + 1}`,
      desc: 'New phase description'
    };
    updateBlock(block.id, { items: [...items, newItem] });
  };

  return (
    <div className="diagram-block-wrapper">
      <div className="diagram-toolbar">
        <span className="diagram-type-label">Smart Diagram: {block.diagramType.toUpperCase()}</span>
        <button className="diag-action-btn" onClick={handleAddItem}>+ Add Step</button>
        <button className="diag-action-btn text-danger" onClick={() => deleteBlock(block.id)}>Remove</button>
      </div>

      <div className="process-diagram-container">
        {items.map((item, idx) => (
          <React.Fragment key={item.id || idx}>
            <div className="diagram-step-card" style={{ borderTop: `4px solid ${accent}` }}>
              <div className="step-badge" style={{ backgroundColor: accent }}>{idx + 1}</div>
              <div
                className="step-title"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemTitleChange(idx, e.target.innerText)}
              >
                {item.title}
              </div>
              <div
                className="step-desc"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleItemDescChange(idx, e.target.innerText)}
              >
                {item.desc}
              </div>
            </div>

            {idx < items.length - 1 && (
              <div className="diagram-arrow-connector">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

