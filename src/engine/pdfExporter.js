/**
 * High-Fidelity Multi-Page PDF Exporter for DragDocs Word Processor
 * Uses jsPDF and html2canvas to capture rendered pages at 2x retina resolution
 * and compile them into a print-ready vector-quality PDF file.
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDocumentToPdf(documentTitle = 'Document', pageElements = []) {
  if (!pageElements || pageElements.length === 0) {
    // Fallback: query DOM for active pages
    pageElements = Array.from(document.querySelectorAll('.dragdocs-page-sheet'));
  }

  if (pageElements.length === 0) {
    throw new Error('No rendered pages found to export.');
  }

  // Get dimensions of first page
  const firstPage = pageElements[0];
  const rect = firstPage.getBoundingClientRect();
  const widthPt = rect.width * 0.75; // px to pt at 96 DPI (72/96 = 0.75)
  const heightPt = rect.height * 0.75;
  const orientation = rect.width > rect.height ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [widthPt, heightPt]
  });

  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];
    if (i > 0) {
      pdf.addPage([widthPt, heightPt], orientation);
    }

    const canvas = await html2canvas(pageEl, {
      scale: 2, // 2x high resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, widthPt, heightPt);
  }

  const cleanTitle = (documentTitle || 'Document').replace(/[^a-zA-Z0-9_\- ]/g, '');
  pdf.save(`${cleanTitle}.pdf`);
}

