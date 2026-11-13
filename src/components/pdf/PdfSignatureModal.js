/**
 * PDF Studio Digital Signature Modal
 * Interactive canvas signature pad with ink drawing, signer metadata, and stamp creation.
 */

import React, { useRef, useState, useEffect } from 'react';
import { IconSignature, IconClose, IconCheck, IconTrash } from '../common/SvgIcons';

export function PdfSignatureModal({ isOpen, onClose, onApplySignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerName, setSignerName] = useState('Marcus Sterling');
  const [signerTitle, setSignerTitle] = useState('Chief Executive Officer');
  const [inkColor, setInkColor] = useState('#185abd'); // Navy blue
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleApply = () => {
    let signatureUrl = null;
    if (canvasRef.current && hasDrawn) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    onApplySignature({
      signerName: signerName || 'Authorized Signatory',
      signerTitle: signerTitle || 'Corporate Officer',
      signedDate: todayStr,
      signatureDataUrl: signatureUrl,
      verified: true
    });
    onClose();
  };

  return (
    <div className="pdf-modal-backdrop">
      <div className="pdf-signature-modal">
        {/* Modal Header */}
        <div className="pdf-modal-header">
          <div className="pdf-modal-title-wrap">
            <IconSignature size={20} color="#185abd" />
            <span className="pdf-modal-title">Sign Document Digitally</span>
          </div>
          <button className="pdf-modal-close-btn" onClick={onClose}>
            <IconClose size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pdf-modal-body">
          {/* Signer Metadata Inputs */}
          <div className="pdf-sign-inputs-row">
            <div className="pdf-input-field">
              <label>Signer Full Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="e.g. Marcus Sterling"
              />
            </div>
            <div className="pdf-input-field">
              <label>Signer Corporate Title</label>
              <input
                type="text"
                value={signerTitle}
                onChange={(e) => setSignerTitle(e.target.value)}
                placeholder="e.g. Chief Executive Officer"
              />
            </div>
          </div>

          {/* Canvas Signature Pad */}
          <div className="pdf-canvas-wrap">
            <div className="pdf-canvas-header">
              <span>Draw your signature with mouse or pen</span>
              <div className="pdf-ink-color-choices">
                <button
                  className={`pdf-ink-btn ${inkColor === '#185abd' ? 'active' : ''}`}
                  style={{ backgroundColor: '#185abd' }}
                  onClick={() => setInkColor('#185abd')}
                  title="Navy Blue"
                />
                <button
                  className={`pdf-ink-btn ${inkColor === '#0f172a' ? 'active' : ''}`}
                  style={{ backgroundColor: '#0f172a' }}
                  onClick={() => setInkColor('#0f172a')}
                  title="Classic Black"
                />
                <button
                  className={`pdf-ink-btn ${inkColor === '#dc2626' ? 'active' : ''}`}
                  style={{ backgroundColor: '#dc2626' }}
                  onClick={() => setInkColor('#dc2626')}
                  title="Crimson"
                />
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={480}
              height={140}
              className="pdf-sign-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />

            <div className="pdf-canvas-footer">
              <span className="pdf-pad-instruction">Signature baseline line above</span>
              <button className="pdf-clear-pad-btn" onClick={handleClear}>
                <IconTrash size={13} color="#64748b" />
                <span>Clear Pad</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pdf-modal-footer">
          <button className="pdf-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="pdf-btn primary" onClick={handleApply}>
            <IconCheck size={16} />
            <span>Apply Signature Stamp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

