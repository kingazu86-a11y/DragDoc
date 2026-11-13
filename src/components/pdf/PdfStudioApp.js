/**
 * PDF Studio Application Container
 * Complete PDF viewing, annotation, form filling, and digital signature platform.
 */

import React, { useState } from 'react';
import { RibbonPdf } from './RibbonPdf';
import { PdfThumbnailsPanel } from './PdfThumbnailsPanel';
import { PdfViewerCanvas } from './PdfViewerCanvas';
import { PdfSignatureModal } from './PdfSignatureModal';
import {
  createDefaultPdfDocument,
  addBlankPage,
  deletePage,
  rotatePage,
  reorderPages,
  addAnnotationToPage,
  updatePageFormField,
  exportPdfStudioDocument
} from '../../engine/pdfStudioModel';

export function PdfStudioApp({ initialDoc, onDocChange }) {
  const [pdfDoc, setPdfDoc] = useState(() => initialDoc || createDefaultPdfDocument());
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'hand' | 'highlight' | 'underline' | 'strikeout' | 'stickyNote' | 'freehand' | 'stamp' | 'signature'
  const [activeStampType, setActiveStampType] = useState('APPROVED');
  const [inkColor, setInkColor] = useState('#ef4444');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Update doc state with callback
  const updateDoc = (updater) => {
    setPdfDoc(prev => {
      const nextDoc = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      if (onDocChange) onDocChange(nextDoc);
      return nextDoc;
    });
  };

  // Page manipulation
  const handleSelectPage = (pageIdx) => {
    updateDoc(doc => ({ ...doc, activePageIndex: pageIdx }));
  };

  const handleAddPage = () => {
    updateDoc(doc => addBlankPage(doc));
  };

  const handleDeletePage = (pageIdx) => {
    updateDoc(doc => deletePage(doc, pageIdx));
  };

  const handleRotatePage = (pageIdx, delta) => {
    updateDoc(doc => rotatePage(doc, pageIdx, delta));
  };

  const handleMovePageUp = (pageIdx) => {
    if (pageIdx > 0) {
      updateDoc(doc => reorderPages(doc, pageIdx, pageIdx - 1));
    }
  };

  const handleMovePageDown = (pageIdx) => {
    if (pageIdx < pdfDoc.pages.length - 1) {
      updateDoc(doc => reorderPages(doc, pageIdx, pageIdx + 1));
    }
  };

  // Annotations
  const handleAddAnnotation = (pageIdx, annotation) => {
    updateDoc(doc => addAnnotationToPage(doc, pageIdx, annotation));
  };

  const handleRemoveAnnotation = (pageIdx, annotationId) => {
    updateDoc(doc => {
      const updatedPages = doc.pages.map((p, idx) => {
        if (idx !== pageIdx) return p;
        return {
          ...p,
          annotations: (p.annotations || []).filter(a => a.id !== annotationId)
        };
      });
      return { ...doc, pages: updatedPages };
    });
  };

  // Form Fields
  const handleUpdateFormField = (pageIdx, fieldId, value) => {
    updateDoc(doc => updatePageFormField(doc, pageIdx, fieldId, value));
  };

  // Digital Signature Application
  const handleApplySignature = (sigData) => {
    const activePage = pdfDoc.activePageIndex || 0;
    const newSignatureAnnotation = {
      type: 'signature',
      x: 320,
      y: 350,
      width: 220,
      height: 70,
      signerName: sigData.signerName,
      signedDate: sigData.signedDate,
      signatureDataUrl: sigData.signatureDataUrl,
      verified: true
    };
    handleAddAnnotation(activePage, newSignatureAnnotation);
  };

  // PDF Export
  const handleExportPdf = () => {
    exportPdfStudioDocument(pdfDoc);
  };

  return (
    <div className="pdf-studio-app-container">
      {/* Acrobat Ribbon Navigation */}
      <RibbonPdf
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        zoom={pdfDoc.zoom}
        onZoomChange={(newZoom) => updateDoc(doc => ({ ...doc, zoom: newZoom }))}
        onRotateCurrentPage={(delta) => handleRotatePage(pdfDoc.activePageIndex, delta)}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onAddBlankPage={handleAddPage}
        onDeleteCurrentPage={() => handleDeletePage(pdfDoc.activePageIndex)}
        onExportPdf={handleExportPdf}
        activeStampType={activeStampType}
        onSelectStampType={setActiveStampType}
        inkColor={inkColor}
        onChangeInkColor={setInkColor}
      />

      {/* Main PDF Workspace: Left Thumbnails, Center Document Viewport */}
      <div className="pdf-main-workspace">
        <PdfThumbnailsPanel
          pdfDoc={pdfDoc}
          activePageIndex={pdfDoc.activePageIndex}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onRotatePage={handleRotatePage}
          onMovePageUp={handleMovePageUp}
          onMovePageDown={handleMovePageDown}
        />

        <PdfViewerCanvas
          pdfDoc={pdfDoc}
          activeTool={activeTool}
          zoom={pdfDoc.zoom}
          activeStampType={activeStampType}
          inkColor={inkColor}
          onAddAnnotation={handleAddAnnotation}
          onRemoveAnnotation={handleRemoveAnnotation}
          onUpdateFormField={handleUpdateFormField}
          onSelectPage={handleSelectPage}
          onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="pdf-bottom-status-bar">
        <div className="pdf-status-left">
          <span>Page {pdfDoc.activePageIndex + 1} of {pdfDoc.pages.length}</span>
          <span className="pdf-status-divider">|</span>
          <span>{pdfDoc.title}</span>
        </div>
        <div className="pdf-status-right">
          <span>Zoom: {pdfDoc.zoom}%</span>
          <span className="pdf-status-divider">|</span>
          <span className="pdf-status-tag">DragPDF Studio Certified</span>
        </div>
      </div>

      {/* Signature Modal */}
      <PdfSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onApplySignature={handleApplySignature}
      />
    </div>
  );
}

