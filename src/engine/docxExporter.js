/**
 * Genuine DOCX Exporter for DragDocs Word Processor
 * Uses the official `docx` library to construct OOXML Document structures
 * with full formatting, styles, tables, and alignment.
 */

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Packer
} from 'docx';
import { getBlockPlainText } from './paginationEngine';

export async function exportToDocxBlob(doc) {
  if (!doc) throw new Error('No document provided for DOCX export');

  const docxChildren = [];

  for (const block of doc.blocks || []) {
    switch (block.type) {
      case 'heading': {
        const text = getBlockPlainText(block);
        let level = HeadingLevel.HEADING_1;
        if (block.level === 2) level = HeadingLevel.HEADING_2;
        if (block.level === 3) level = HeadingLevel.HEADING_3;
        if (block.level === 4) level = HeadingLevel.HEADING_4;

        let alignment = AlignmentType.LEFT;
        if (block.align === 'center') alignment = AlignmentType.CENTER;
        if (block.align === 'right') alignment = AlignmentType.RIGHT;
        if (block.align === 'justify') alignment = AlignmentType.JUSTIFIED;

        docxChildren.push(
          new Paragraph({
            heading: level,
            alignment,
            spacing: {
              before: (block.spacingBefore || 10) * 20,
              after: (block.spacingAfter || 6) * 20
            },
            children: [
              new TextRun({
                text,
                bold: true,
                size: (block.textRuns?.[0]?.fontSize || 16) * 2
              })
            ]
          })
        );
        break;
      }

      case 'paragraph': {
        let alignment = AlignmentType.LEFT;
        if (block.align === 'center') alignment = AlignmentType.CENTER;
        if (block.align === 'right') alignment = AlignmentType.RIGHT;
        if (block.align === 'justify') alignment = AlignmentType.JUSTIFIED;

        const runs = (block.textRuns || []).map(r => {
          return new TextRun({
            text: r.text || '',
            bold: !!r.bold,
            italics: !!r.italic,
            strike: !!r.strikethrough,
            subScript: !!r.subscript,
            superScript: !!r.superscript,
            color: r.fontColor ? r.fontColor.replace('#', '') : '1F2937',
            size: (r.fontSize || 11) * 2
          });
        });

        docxChildren.push(
          new Paragraph({
            alignment,
            spacing: {
              before: (block.spacingBefore || 0) * 20,
              after: (block.spacingAfter || 6) * 20,
              line: Math.round((block.lineSpacing || 1.15) * 240)
            },
            bullet: block.listType === 'bullet' ? { level: block.listLevel || 0 } : undefined,
            children: runs.length > 0 ? runs : [new TextRun('')]
          })
        );
        break;
      }

      case 'quote': {
        const text = getBlockPlainText(block);
        docxChildren.push(
          new Paragraph({
            spacing: { before: 200, after: 200 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: `“${text}”`,
                italics: true,
                color: '4B5563',
                size: 22
              }),
              ...(block.author ? [new TextRun({ text: ` — ${block.author}`, bold: true, size: 20 })] : [])
            ]
          })
        );
        break;
      }

      case 'table': {
        if (!block.rows || block.rows.length === 0) break;

        const tableRows = block.rows.map(row => {
          const cells = (row.cells || []).map(cell => {
            const cellParagraphs = [];
            if (cell.content && Array.isArray(cell.content)) {
              for (const cBlock of cell.content) {
                const cellText = getBlockPlainText(cBlock);
                cellParagraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellText,
                        bold: !!row.isHeader,
                        size: 20
                      })
                    ]
                  })
                );
              }
            } else {
              cellParagraphs.push(new Paragraph({ children: [new TextRun('')] }));
            }

            return new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              shading: row.isHeader ? { fill: '185ABD' } : undefined,
              children: cellParagraphs
            });
          });

          return new TableRow({
            tableHeader: !!row.isHeader,
            children: cells
          });
        });

        docxChildren.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
          })
        );
        break;
      }

      case 'pageBreak': {
        docxChildren.push(
          new Paragraph({
            pageBreakBefore: true,
            children: [new TextRun('')]
          })
        );
        break;
      }

      default:
        break;
    }
  }

  const docxDocument = new Document({
    title: doc.title || 'DragDocs Document',
    creator: doc.author || 'DragDocs User',
    sections: [
      {
        properties: {},
        children: docxChildren
      }
    ]
  });

  return await Packer.toBlob(docxDocument);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

