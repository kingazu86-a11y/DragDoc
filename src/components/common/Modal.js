/**
 * Reusable Professional Modal Window Component
 */

import React from 'react';
import { IconClose } from './SvgIcons';

export function Modal({ title, isOpen, onClose, children, width = '480px' }) {
  if (!isOpen) return null;

  return (
    <div className="dragdocs-modal-overlay" onClick={onClose}>
      <div
        className="dragdocs-modal-card"
        style={{ width, maxWidth: '95vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close-btn" onClick={onClose} title="Close Dialog">
            <IconClose size={14} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

