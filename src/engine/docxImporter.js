/**
 * Genuine DOCX Importer for DragDocs Word Processor
 * Uses `mammoth` to parse DOCX OpenXML binary structures, converting
 * paragraphs, headings, inline bold/italics, and tables into DragDocs model.
 */

import mammoth from 'mammoth';
import {
  createDefaultDocument,
  createHeadingBlock,
  createParagraphBlock,
  createTableBlock,
  createTextRun
} from './documentModel';

export async function importFromDocxBuffer(arrayBuffer, fileName = 'Imported Document') {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');

  const title = fileName.replace(/\.docx$/i, '') || 'Imported Document';
  const doc = createDefaultDocument(title);
  const blocks = [];

  const bodyChildren = Array.from(dom.body.children);

  if (bodyChildren.length === 0) {
    const rawText = dom.body.textContent || '';
    if (rawText.trim()) {
      blocks.push(createParagraphBlock(rawText.trim()));
    }
  }

  for (const el of bodyChildren) {
    const tagName = el.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName.replace('h', ''), 10);
      blocks.push(createHeadingBlock(el.textContent || '', level));
      continue;
    }

    if (tagName === 'table') {
      const rows = Array.from(el.querySelectorAll('tr'));
      if (rows.length > 0) {
        const tableRows = rows.map((tr, rIdx) => {
          const cells = Array.from(tr.querySelectorAll('td, th'));
          return {
            id: `row_${Date.now()}_${rIdx}`,
            isHeader: rIdx === 0 || cells.some(c => c.tagName.toLowerCase() === 'th'),
            cells: cells.map((cell, cIdx) => ({
              id: `cell_${Date.now()}_${rIdx}_${cIdx}`,
              colSpan: 1,
              content: [createParagraphBlock(cell.textContent || '', {
                bold: rIdx === 0
              })]
            }))
          };
        });

        blocks.push(createTableBlock(tableRows.length, tableRows[0]?.cells?.length || 1, {
          rows: tableRows
        }));
      }
      continue;
    }

    if (tagName === 'ul' || tagName === 'ol') {
      const lis = Array.from(el.querySelectorAll('li'));
      for (const li of lis) {
        blocks.push(createParagraphBlock(li.textContent || '', {}, {
          listType: tagName === 'ul' ? 'bullet' : 'number'
        }));
      }
      continue;
    }

    if (tagName === 'blockquote') {
      blocks.push(createParagraphBlock(el.textContent || '', { italic: true }, {
        style: 'quote',
        spacingBefore: 8,
        spacingAfter: 8
      }));
      continue;
    }

    // Default: Paragraph with inline nodes
    const runs = [];
    const childNodes = Array.from(el.childNodes);

    if (childNodes.length === 0) {
      if (el.textContent) {
        runs.push(createTextRun(el.textContent));
      }
    } else {
      for (const child of childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent) {
            runs.push(createTextRun(child.textContent));
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const cTag = child.tagName.toLowerCase();
          const isBold = cTag === 'strong' || cTag === 'b';
          const isItalic = cTag === 'em' || cTag === 'i';
          const isUnderline = cTag === 'u';
          const isStrike = cTag === 's' || cTag === 'del' || cTag === 'strike';

          runs.push(createTextRun(child.textContent || '', {
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strikethrough: isStrike
          }));
        }
      }
    }

    if (runs.length > 0) {
      blocks.push(createParagraphBlock(runs));
    } else if (el.textContent && el.textContent.trim()) {
      blocks.push(createParagraphBlock(el.textContent.trim()));
    }
  }

  if (blocks.length > 0) {
    doc.blocks = blocks;
  }

  return doc;
}

