/**
 * Interactive Image Block Component
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';

export function ImageView({ block }) {
  const { updateBlock, deleteBlock } = useDocument();
  const [isSelected, setIsSelected] = useState(false);

  const handleWidthChange = (delta) => {
    const curWidth = Number(block.width) || 450;
    const curHeight = Number(block.height) || 280;
    const newWidth = Math.max(150, Math.min(650, curWidth + delta));
    const ratio = curHeight / curWidth;
    updateBlock(block.id, {
      width: newWidth,
      height: Math.round(newWidth * ratio)
    });
  };

  const handleAlign = (align) => {
    updateBlock(block.id, { align });
  };

  return (
    <div
      className={`image-block-wrapper align-${block.align || 'center'} ${isSelected ? 'selected' : ''}`}
      onClick={() => setIsSelected(true)}
      onBlur={() => setIsSelected(false)}
    >
      <div className="image-container" style={{ width: `${block.width}px` }}>
        <img
          src={block.src}
          alt={block.alt || 'Document Illustration'}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '2px',
            border: block.borderWidth ? `${block.borderWidth}px solid ${block.borderColor || '#e5e7eb'}` : 'none'
          }}
        />

        {isSelected && (
          <div className="image-toolbar-bubble">
            <button className="img-tool-btn" onClick={() => handleWidthChange(-40)} title="Shrink Image">-</button>
            <span style={{ fontSize: '11px', margin: '0 4px' }}>{block.width}px</span>
            <button className="img-tool-btn" onClick={() => handleWidthChange(40)} title="Enlarge Image">+</button>
            <div className="img-sep" />
            <button className={`img-tool-btn ${block.align === 'left' ? 'active' : ''}`} onClick={() => handleAlign('left')}>Left</button>
            <button className={`img-tool-btn ${block.align === 'center' ? 'active' : ''}`} onClick={() => handleAlign('center')}>Center</button>
            <button className={`img-tool-btn ${block.align === 'right' ? 'active' : ''}`} onClick={() => handleAlign('right')}>Right</button>
            <div className="img-sep" />
            <button className="img-tool-btn text-danger" onClick={() => deleteBlock(block.id)} title="Delete Image">×</button>
          </div>
        )}

        <div
          className="image-caption"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateBlock(block.id, { caption: e.target.innerText })}
          placeholder="Add an optional caption..."
        >
          {block.caption || ''}
        </div>
      </div>
    </div>
  );
}

