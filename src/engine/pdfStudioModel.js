/**
 * PDF Studio Document Model & Manipulation Engine
 * Supports multi-page PDF viewing, rich annotations (highlight, underline,
 * strikeout, sticky notes, freehand ink, shapes, stamps, digital signatures),
 * interactive form fields (inputs, checkboxes, selects), page manipulation (reorder, rotate, delete),
 * and true PDF export using jsPDF.
 */

import { jsPDF } from 'jspdf';

/**
 * Creates default sample PDF document with realistic multi-page enterprise contract.
 */
export function createDefaultPdfDocument(title = 'Master Services Agreement & Execution.pdf') {
  return {
    id: `pdf-${Date.now()}`,
    title,
    activePageIndex: 0,
    zoom: 100, // percentage
    viewMode: 'continuous', // 'continuous' | 'single'
    pages: [
      createSamplePage1(),
      createSamplePage2(),
      createSamplePage3()
    ]
  };
}

function createSamplePage1() {
  return {
    pageNumber: 1,
    width: 612, // US Letter 8.5in in pt
    height: 792, // 11in in pt
    rotation: 0,
    title: 'Master Professional Services Agreement',
    contentBlocks: [
      {
        type: 'header',
        text: 'ENTERPRISE TECHNOLOGY SOLUTIONS INC. — MASTER SERVICES AGREEMENT',
        x: 40, y: 40, size: 9, color: '#64748b', isBold: true
      },
      {
        type: 'title',
        text: 'MASTER PROFESSIONAL SERVICES AGREEMENT',
        x: 40, y: 75, size: 18, color: '#0f172a', isBold: true
      },
      {
        type: 'subtitle',
        text: 'CONTRACT REFERENCE ID: ETS-2026-GLOBAL-08492-MSA',
        x: 40, y: 100, size: 10, color: '#475569', isBold: true
      },
      {
        type: 'divider',
        x1: 40, y1: 115, x2: 572, y2: 115, color: '#cbd5e1'
      },
      {
        type: 'heading',
        text: '1. PARTIES & EFFECTIVE DATE',
        x: 40, y: 135, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'This Master Professional Services Agreement ("Agreement") is entered into and made effective as of the date of final signature by and between Enterprise Technology Solutions Inc. ("Provider"), a Delaware corporation having its principal office at 500 Enterprise Way, Suite 1200, San Francisco, CA 94105, and the Client named in the execution block below ("Client"). Provider and Client are collectively referred to herein as the "Parties" and individually as a "Party".',
        x: 40, y: 155, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: '2. SERVICES & STATEMENT OF WORK (SOW)',
        x: 40, y: 220, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Provider shall perform for Client the software architecture, system integration, document infrastructure development, and cloud data migration services described in one or more Statements of Work ("SOW") executed under this Agreement. Each SOW shall constitute a separate and independent contractual commitment incorporating all terms and conditions set forth herein.',
        x: 40, y: 240, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: '3. SERVICE LEVEL COMMITMENTS & DELIVERABLES',
        x: 40, y: 300, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'table',
        x: 40, y: 320, width: 532,
        headers: ['Milestone Phase', 'Deliverable Scope', 'Target Completion', 'SLA Standard'],
        rows: [
          ['Phase 1: Architecture', 'Core Suite Shell & Office Navigation Engine', 'Month 1', '99.9% Uptime'],
          ['Phase 2: Data Engines', 'Spreadsheet Matrix & Multi-Page PDF Engine', 'Month 2', 'Zero-Latency Calculations'],
          ['Phase 3: Integration', 'Cross-App Document Tabs & Export Pipeline', 'Month 3', 'Enterprise Security Validated'],
          ['Phase 4: Verification', 'Comprehensive Offline Testing & Deployment', 'Month 4', 'Production Certified']
        ]
      },
      {
        type: 'heading',
        text: '4. COMPENSATION & PAYMENT TERMS',
        x: 40, y: 440, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Client shall pay Provider the fees set forth in the applicable Statement of Work. Unless otherwise specified, all valid and undisputed invoices shall be payable Net Thirty (30) days from the invoice date. Late payments shall accrue interest at the lesser of one and one-half percent (1.5%) per month or the maximum rate permitted by applicable law.',
        x: 40, y: 460, size: 10, lineHeight: 15, maxWidth: 532
      }
    ],
    annotations: [
      {
        id: 'ann-1',
        type: 'highlight',
        x: 40, y: 152, width: 320, height: 16,
        color: 'rgba(254, 240, 138, 0.55)',
        author: 'Chief Legal Officer',
        timestamp: '2026-04-10 09:15'
      },
      {
        id: 'ann-2',
        type: 'stickyNote',
        x: 520, y: 220,
        comment: 'Confirmed: All SOW milestones comply with Tier-1 enterprise development specifications.',
        author: 'Audit Committee',
        date: '2026-04-11',
        color: '#fef08a'
      }
    ],
    formFields: [
      {
        id: 'ff-1',
        type: 'text',
        name: 'client_entity_name',
        label: 'Client Registered Entity Name',
        value: 'Global Innovations Corp.',
        x: 40, y: 530, width: 280, height: 28
      },
      {
        id: 'ff-2',
        type: 'text',
        name: 'client_registration_no',
        label: 'Entity Tax / Reg ID',
        value: 'EIN-84-9210492',
        x: 340, y: 530, width: 232, height: 28
      }
    ]
  };
}

function createSamplePage2() {
  return {
    pageNumber: 2,
    width: 612,
    height: 792,
    rotation: 0,
    title: 'Intellectual Property, Security & Confidentiality',
    contentBlocks: [
      {
        type: 'header',
        text: 'ENTERPRISE TECHNOLOGY SOLUTIONS INC. — MASTER SERVICES AGREEMENT',
        x: 40, y: 40, size: 9, color: '#64748b', isBold: true
      },
      {
        type: 'heading',
        text: '5. INTELLECTUAL PROPERTY RIGHTS',
        x: 40, y: 75, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Except for Pre-Existing Materials and Third-Party Technologies, all deliverables created specifically for Client under an executed Statement of Work shall upon full payment become the intellectual property of Client. Provider retains all ownership rights in its core platforms, foundational libraries, proprietary algorithms, and general know-how.',
        x: 40, y: 95, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: '6. CONFIDENTIALITY & NON-DISCLOSURE',
        x: 40, y: 155, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Each Party agrees to safeguard and keep confidential all technical, commercial, financial, and proprietary information disclosed by the other Party. The receiving Party shall use the same degree of care it uses for its own confidential information, but in no case less than reasonable care, and shall not disclose such information to any third party without prior written consent.',
        x: 40, y: 175, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: '7. DATA PROTECTION & CYBERSECURITY COMPLIANCE',
        x: 40, y: 240, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Provider shall maintain comprehensive administrative, physical, and technical safeguards designed to protect the security, confidentiality, and integrity of Client Data. Provider maintains compliance with SOC 2 Type II, ISO/IEC 27001, and applicable data privacy regulations including GDPR and CCPA.',
        x: 40, y: 260, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: '8. LIMITATION OF LIABILITY & INDEMNIFICATION',
        x: 40, y: 320, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS OR BUSINESS INTERRUPTION. THE AGGREGATE LIABILITY OF EITHER PARTY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THE APPLICABLE SOW IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.',
        x: 40, y: 340, size: 9, lineHeight: 14, maxWidth: 532, isBold: true, color: '#334155'
      }
    ],
    annotations: [
      {
        id: 'ann-stamp-approved',
        type: 'stamp',
        stampType: 'APPROVED',
        x: 390, y: 430, width: 150, height: 46,
        color: '#107c41',
        timestamp: '2026-04-12 14:20',
        user: 'Chief Legal Officer'
      }
    ],
    formFields: [
      {
        id: 'ff-check-nda',
        type: 'checkbox',
        name: 'nda_acknowledged',
        label: 'Client confirms mutual NDA provisions have been reviewed and accepted by in-house counsel.',
        checked: true,
        x: 40, y: 440, width: 330, height: 24
      },
      {
        id: 'ff-select-govlaw',
        type: 'select',
        name: 'governing_jurisdiction',
        label: 'Governing Law Jurisdiction',
        value: 'Delaware Chancery Court, USA',
        options: [
          'Delaware Chancery Court, USA',
          'State of New York, USA',
          'State of California, USA',
          'Commercial Court of England & Wales'
        ],
        x: 40, y: 490, width: 280, height: 30
      }
    ]
  };
}

function createSamplePage3() {
  return {
    pageNumber: 3,
    width: 612,
    height: 792,
    rotation: 0,
    title: 'Execution & Authorized Signatures',
    contentBlocks: [
      {
        type: 'header',
        text: 'ENTERPRISE TECHNOLOGY SOLUTIONS INC. — MASTER SERVICES AGREEMENT',
        x: 40, y: 40, size: 9, color: '#64748b', isBold: true
      },
      {
        type: 'heading',
        text: '9. TERM, TERMINATION & GENERAL PROVISIONS',
        x: 40, y: 75, size: 12, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'This Agreement shall commence on the Effective Date and remain in effect for an initial period of three (3) years, renewing automatically for successive one-year terms unless either Party provides sixty (60) days written notice of non-renewal. This document represents the entire understanding between the Parties.',
        x: 40, y: 95, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'heading',
        text: 'SIGNATURE & EXECUTION ATTESTATION',
        x: 40, y: 155, size: 13, color: '#0f172a', isBold: true
      },
      {
        type: 'paragraph',
        text: 'IN WITNESS WHEREOF, the Parties hereto have executed this Master Professional Services Agreement through their duly authorized corporate officers as of the dates set forth below.',
        x: 40, y: 175, size: 10, lineHeight: 15, maxWidth: 532
      },
      {
        type: 'divider',
        x1: 40, y1: 200, x2: 572, y2: 200, color: '#cbd5e1'
      },
      // Provider Column
      {
        type: 'heading',
        text: 'FOR SERVICE PROVIDER:',
        x: 40, y: 220, size: 11, color: '#1e293b', isBold: true
      },
      {
        type: 'paragraph',
        text: 'Enterprise Technology Solutions Inc.\nName: Marcus Sterling\nTitle: Chief Executive Officer\nDate: April 15, 2026',
        x: 40, y: 240, size: 10, lineHeight: 16
      },
      // Client Column
      {
        type: 'heading',
        text: 'FOR CLIENT:',
        x: 320, y: 220, size: 11, color: '#1e293b', isBold: true
      }
    ],
    annotations: [
      {
        id: 'ann-sig-provider',
        type: 'signature',
        x: 40, y: 310, width: 220, height: 70,
        signerName: 'Marcus Sterling',
        signedDate: '2026-04-15',
        verified: true
      }
    ],
    formFields: [
      {
        id: 'ff-client-rep-name',
        type: 'text',
        name: 'client_rep_name',
        label: 'Authorized Client Representative Name',
        value: 'Elena Rostova',
        x: 320, y: 240, width: 240, height: 26
      },
      {
        id: 'ff-client-rep-title',
        type: 'text',
        name: 'client_rep_title',
        label: 'Official Corporate Title',
        value: 'Vice President of Global Infrastructure',
        x: 320, y: 275, width: 240, height: 26
      },
      {
        id: 'ff-client-sign-date',
        type: 'date',
        name: 'client_sign_date',
        label: 'Date of Execution',
        value: '2026-04-15',
        x: 320, y: 310, width: 160, height: 26
      }
    ]
  };
}

/**
 * Adds a new blank page to the PDF document.
 */
export function addBlankPage(pdfDoc) {
  const newPageNum = pdfDoc.pages.length + 1;
  const newPage = {
    pageNumber: newPageNum,
    width: 612,
    height: 792,
    rotation: 0,
    title: `Page ${newPageNum}`,
    contentBlocks: [
      {
        type: 'header',
        text: `${pdfDoc.title.toUpperCase()} — SUPPLEMENTARY ATTACHMENT`,
        x: 40, y: 40, size: 9, color: '#64748b', isBold: true
      },
      {
        type: 'heading',
        text: `SCHEDULE / EXHIBIT ${newPageNum}`,
        x: 40, y: 80, size: 14, color: '#0f172a', isBold: true
      },
      {
        type: 'paragraph',
        text: 'This blank attachment page is ready for custom text, technical specifications, and legal exhibits.',
        x: 40, y: 110, size: 10, lineHeight: 15, maxWidth: 532
      }
    ],
    annotations: [],
    formFields: []
  };

  return {
    ...pdfDoc,
    pages: [...pdfDoc.pages, newPage],
    activePageIndex: pdfDoc.pages.length
  };
}

/**
 * Deletes a page from the PDF document.
 */
export function deletePage(pdfDoc, pageIndex) {
  if (pdfDoc.pages.length <= 1) return pdfDoc; // Cannot delete only page
  const updatedPages = pdfDoc.pages
    .filter((_, idx) => idx !== pageIndex)
    .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

  const nextActive = Math.min(pdfDoc.activePageIndex, updatedPages.length - 1);
  return {
    ...pdfDoc,
    pages: updatedPages,
    activePageIndex: nextActive
  };
}

/**
 * Rotates a page by 90 degrees.
 */
export function rotatePage(pdfDoc, pageIndex, delta = 90) {
  const updatedPages = pdfDoc.pages.map((p, idx) => {
    if (idx !== pageIndex) return p;
    return {
      ...p,
      rotation: (p.rotation + delta + 360) % 360
    };
  });

  return {
    ...pdfDoc,
    pages: updatedPages
  };
}

/**
 * Reorders pages within the document.
 */
export function reorderPages(pdfDoc, fromIdx, toIdx) {
  if (fromIdx < 0 || toIdx < 0 || fromIdx >= pdfDoc.pages.length || toIdx >= pdfDoc.pages.length) {
    return pdfDoc;
  }
  const pagesCopy = [...pdfDoc.pages];
  const [moved] = pagesCopy.splice(fromIdx, 1);
  pagesCopy.splice(toIdx, 0, moved);

  return {
    ...pdfDoc,
    pages: pagesCopy.map((p, idx) => ({ ...p, pageNumber: idx + 1 })),
    activePageIndex: toIdx
  };
}

/**
 * Adds an annotation to a specific page.
 */
export function addAnnotationToPage(pdfDoc, pageIndex, annotation) {
  const updatedPages = pdfDoc.pages.map((p, idx) => {
    if (idx !== pageIndex) return p;
    return {
      ...p,
      annotations: [...(p.annotations || []), { ...annotation, id: annotation.id || `ann-${Date.now()}` }]
    };
  });

  return {
    ...pdfDoc,
    pages: updatedPages
  };
}

/**
 * Updates a form field value on a page.
 */
export function updatePageFormField(pdfDoc, pageIndex, fieldId, value) {
  const updatedPages = pdfDoc.pages.map((p, idx) => {
    if (idx !== pageIndex) return p;
    return {
      ...p,
      formFields: (p.formFields || []).map(f => f.id === fieldId ? { ...f, value: f.type === 'checkbox' ? Boolean(value) : value, checked: f.type === 'checkbox' ? Boolean(value) : undefined } : f)
    };
  });

  return {
    ...pdfDoc,
    pages: updatedPages
  };
}

/**
 * Exports the complete PDF Studio Document to actual PDF using jsPDF.
 */
export function exportPdfStudioDocument(pdfDoc) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait'
  });

  pdfDoc.pages.forEach((page, pageIdx) => {
    if (pageIdx > 0) {
      doc.addPage('letter', page.rotation % 180 !== 0 ? 'landscape' : 'portrait');
    }

    // Render content blocks
    (page.contentBlocks || []).forEach(block => {
      if (block.type === 'header') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(block.size || 9);
        doc.setTextColor(100, 116, 139);
        doc.text(block.text, block.x, block.y);
      } else if (block.type === 'title') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(block.size || 18);
        doc.setTextColor(15, 23, 42);
        doc.text(block.text, block.x, block.y);
      } else if (block.type === 'subtitle' || block.type === 'heading') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(block.size || 12);
        doc.setTextColor(30, 41, 59);
        doc.text(block.text, block.x, block.y);
      } else if (block.type === 'divider') {
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(1);
        doc.line(block.x1, block.y1, block.x2, block.y2);
      } else if (block.type === 'paragraph') {
        doc.setFont('helvetica', block.isBold ? 'bold' : 'normal');
        doc.setFontSize(block.size || 10);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(block.text, block.maxWidth || 532);
        doc.text(splitText, block.x, block.y);
      } else if (block.type === 'table') {
        // Render simple table in jsPDF
        let tableY = block.y;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setFillColor(241, 245, 249);
        doc.rect(block.x, tableY, block.width, 20, 'F');
        doc.setTextColor(30, 41, 59);
        const colWidth = block.width / block.headers.length;
        block.headers.forEach((h, hIdx) => {
          doc.text(h, block.x + hIdx * colWidth + 5, tableY + 14);
        });
        tableY += 20;

        doc.setFont('helvetica', 'normal');
        block.rows.forEach(row => {
          doc.rect(block.x, tableY, block.width, 18);
          row.forEach((cellText, cIdx) => {
            doc.text(String(cellText), block.x + cIdx * colWidth + 5, tableY + 13);
          });
          tableY += 18;
        });
      }
    });

    // Render Highlights
    (page.annotations || []).filter(a => a.type === 'highlight').forEach(a => {
      doc.setFillColor(254, 240, 138);
      // jsPDF does GState opacity if available, or flat soft yellow
      doc.rect(a.x, a.y, a.width, a.height, 'F');
    });

    // Render Stamps
    (page.annotations || []).filter(a => a.type === 'stamp').forEach(a => {
      doc.setDrawColor(16, 124, 65);
      doc.setLineWidth(2);
      doc.roundedRect(a.x, a.y, a.width, a.height, 4, 4);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(16, 124, 65);
      doc.text(a.stampType, a.x + 12, a.y + 22);
      doc.setFontSize(8);
      doc.text(`${a.user} • ${a.timestamp}`, a.x + 12, a.y + 36);
    });

    // Render Signatures
    (page.annotations || []).filter(a => a.type === 'signature').forEach(a => {
      doc.setFont('times', 'italic');
      doc.setFontSize(22);
      doc.setTextColor(24, 90, 189);
      doc.text(a.signerName, a.x + 10, a.y + 32);
      doc.setDrawColor(24, 90, 189);
      doc.setLineWidth(1);
      doc.line(a.x + 5, a.y + 40, a.x + a.width - 10, a.y + 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Digitally Attested: ${a.signedDate} [Verified Signature]`, a.x + 10, a.y + 54);
    });

    // Render Form Fields
    (page.formFields || []).forEach(f => {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(1);
      doc.setFillColor(248, 250, 252);
      doc.rect(f.x, f.y, f.width, f.height, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);

      if (f.type === 'checkbox') {
        if (f.checked || f.value) {
          doc.text('[X] ' + f.label, f.x + 4, f.y + 14);
        } else {
          doc.text('[  ] ' + f.label, f.x + 4, f.y + 14);
        }
      } else {
        const valText = String(f.value || '');
        doc.text(valText, f.x + 6, f.y + 16);
      }
    });
  });

  const fileName = pdfDoc.title.endsWith('.pdf') ? pdfDoc.title : `${pdfDoc.title}.pdf`;
  doc.save(fileName);
  return true;
}

