/**
 * Dynamic Multi-Page Pagination Engine for DragDocs Word Processor
 * Measures block dimensions, handles overflow, supports page breaks,
 * table splitting, keep-with-next, widow/orphan control, and multi-column layout.
 */

import { PAPER_SIZES } from './documentModel';

/**
 * Calculates the total text length and raw text across inline text runs.
 */
export function getBlockPlainText(block) {
  if (!block.textRuns || !Array.isArray(block.textRuns)) {
    return '';
  }
  return block.textRuns.map(r => r.text || '').join('');
}

/**
 * Estimates the rendered pixel height of a content block based on width and typography.
 */
export function measureBlockHeight(block, contentWidth = 624) {
  if (!block) return 0;

  switch (block.type) {
    case 'pageBreak':
      return 0;

    case 'sectionBreak':
      return 12;

    case 'heading': {
      const text = getBlockPlainText(block);
      const fontSize = (block.textRuns?.[0]?.fontSize || 16);
      const lineSpacing = block.lineSpacing || 1.2;
      const charWidth = fontSize * 0.52;
      const charsPerLine = Math.max(15, Math.floor(contentWidth / charWidth));
      
      const paragraphs = text.split('\n');
      let totalLines = 0;
      for (const p of paragraphs) {
        totalLines += Math.max(1, Math.ceil(p.length / charsPerLine));
      }

      const lineHeight = fontSize * 1.33 * lineSpacing;
      const margins = (block.spacingBefore || 10) + (block.spacingAfter || 6);
      return Math.round(totalLines * lineHeight + margins);
    }

    case 'paragraph': {
      const text = getBlockPlainText(block);
      const maxFontSize = block.textRuns?.reduce((max, r) => Math.max(max, r.fontSize || 11), 11) || 11;
      const lineSpacing = block.lineSpacing || 1.15;
      const charWidth = maxFontSize * 0.50;
      const effectiveWidth = Math.max(200, contentWidth - (block.indentLeft || 0) - (block.indentRight || 0));
      const charsPerLine = Math.max(20, Math.floor(effectiveWidth / charWidth));

      const paragraphs = text.split('\n');
      let totalLines = 0;
      for (const p of paragraphs) {
        totalLines += Math.max(1, Math.ceil(p.length / charsPerLine));
      }

      const lineHeight = maxFontSize * 1.33 * lineSpacing;
      const margins = (block.spacingBefore || 0) + (block.spacingAfter || 6);
      return Math.round(totalLines * lineHeight + margins);
    }

    case 'table': {
      if (!block.rows || block.rows.length === 0) return 60;
      let tableHeight = 0;
      for (let r = 0; r < block.rows.length; r++) {
        const row = block.rows[r];
        // estimate cell height
        let maxCellHeight = row.isHeader ? 36 : 28;
        if (row.cells) {
          for (const cell of row.cells) {
            let cellContentHeight = 12;
            if (cell.content && Array.isArray(cell.content)) {
              for (const cBlock of cell.content) {
                cellContentHeight += measureBlockHeight(cBlock, contentWidth / (row.cells.length || 1));
              }
            }
            maxCellHeight = Math.max(maxCellHeight, cellContentHeight);
          }
        }
        tableHeight += maxCellHeight;
      }
      return tableHeight + 16; // table margin
    }

    case 'image': {
      const imgHeight = Number(block.height) || 280;
      const captionHeight = block.caption ? 24 : 0;
      return imgHeight + captionHeight + 16;
    }

    case 'diagram': {
      const itemCount = block.items?.length || 4;
      return Math.min(320, Math.max(160, itemCount * 48 + 40));
    }

    case 'chart': {
      return 260;
    }

    case 'quote': {
      const text = getBlockPlainText(block);
      const charsPerLine = Math.floor((contentWidth - 48) / 6);
      const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
      return Math.round(lines * 22 + (block.author ? 28 : 12) + 20);
    }

    case 'toc': {
      // rough estimation: 40px title + 26px per anticipated entry
      return 180;
    }

    default:
      return 36;
  }
}

/**
 * Splits a paragraph block into two blocks when overflowing across page boundary.
 * Enforces widow (min 2 lines on next page) and orphan (min 2 lines on current page) control.
 */
export function splitParagraphBlock(block, availableHeight, contentWidth = 624) {
  const text = getBlockPlainText(block);
  const fontSize = block.textRuns?.[0]?.fontSize || 11;
  const lineSpacing = block.lineSpacing || 1.15;
  const lineHeight = fontSize * 1.33 * lineSpacing;
  const charWidth = fontSize * 0.50;
  const effectiveWidth = Math.max(200, contentWidth - (block.indentLeft || 0) - (block.indentRight || 0));
  const charsPerLine = Math.max(20, Math.floor(effectiveWidth / charWidth));

  const availableLines = Math.floor((availableHeight - (block.spacingBefore || 0)) / lineHeight);

  // If we can't fit at least 2 lines, do not split - move whole paragraph
  if (availableLines < 2) {
    return null;
  }

  const words = text.split(' ');
  let lineCount = 1;
  let currentLineChars = 0;
  let splitWordIndex = -1;

  for (let i = 0; i < words.length; i++) {
    const wordLen = words[i].length + 1;
    if (currentLineChars + wordLen > charsPerLine) {
      lineCount++;
      currentLineChars = wordLen;
      if (lineCount > availableLines) {
        splitWordIndex = i;
        break;
      }
    } else {
      currentLineChars += wordLen;
    }
  }

  // Check widow control: remaining lines must be at least 2
  const remainingWords = words.slice(splitWordIndex);
  const remainingChars = remainingWords.join(' ').length;
  const remainingLines = Math.ceil(remainingChars / charsPerLine);

  if (splitWordIndex <= 0 || remainingLines < 2) {
    return null;
  }

  const firstPartText = words.slice(0, splitWordIndex).join(' ');
  const secondPartText = words.slice(splitWordIndex).join(' ');

  const firstBlock = {
    ...block,
    id: `${block.id}_p1`,
    isSplitFirst: true,
    spacingAfter: 0,
    textRuns: [{
      ...(block.textRuns?.[0] || {}),
      text: firstPartText
    }]
  };

  const secondBlock = {
    ...block,
    id: `${block.id}_p2`,
    isSplitContinuation: true,
    spacingBefore: 0,
    textRuns: [{
      ...(block.textRuns?.[0] || {}),
      text: secondPartText
    }]
  };

  return { firstBlock, secondBlock };
}

/**
 * Splits a table across pages, placing fitting rows on current page and remaining rows on next page.
 */
export function splitTableBlock(block, availableHeight, contentWidth = 624) {
  if (!block.rows || block.rows.length <= 2) {
    return null;
  }

  let consumedHeight = 16; // table margin
  const firstRows = [];
  const secondRows = [];
  const headerRow = block.rows.find(r => r.isHeader);

  for (let i = 0; i < block.rows.length; i++) {
    const row = block.rows[i];
    const rowHeight = row.isHeader ? 36 : 28;

    if (consumedHeight + rowHeight <= availableHeight) {
      consumedHeight += rowHeight;
      firstRows.push(row);
    } else {
      secondRows.push(row);
    }
  }

  // If we can't fit at least header + 1 row, don't split table
  if (firstRows.length < (headerRow ? 2 : 1) || secondRows.length === 0) {
    return null;
  }

  // If table has repeatHeader and second part does not have header, duplicate header
  const nextRows = (block.repeatHeader && headerRow && !secondRows.some(r => r.isHeader))
    ? [{ ...headerRow, id: `${headerRow.id}_rep` }, ...secondRows]
    : secondRows;

  const firstTable = {
    ...block,
    id: `${block.id}_t1`,
    rows: firstRows
  };

  const secondTable = {
    ...block,
    id: `${block.id}_t2`,
    rows: nextRows
  };

  return { firstBlock: firstTable, secondBlock: secondTable };
}

/**
 * Main pagination function that transforms flat document blocks into an array of rendered pages.
 */
export function paginateDocument(document) {
  if (!document) {
    return { pages: [], totalPages: 0 };
  }

  const { pageSetup = {}, blocks = [] } = document;
  const paper = PAPER_SIZES[pageSetup.paperSize] || PAPER_SIZES.letter;
  const orientation = pageSetup.orientation || 'portrait';

  const pageWidth = orientation === 'landscape' ? paper.height : paper.width;
  const pageHeight = orientation === 'landscape' ? paper.width : paper.height;

  const margins = pageSetup.margins || { top: 96, bottom: 96, left: 96, right: 96 };
  const contentWidth = pageWidth - margins.left - margins.right;

  // Reserved heights for header, footer and page margins
  const headerHeight = 36;
  const footerHeight = 36;
  const availableContentHeight = pageHeight - margins.top - margins.bottom - headerHeight - footerHeight;

  const pages = [];
  let currentPageBlocks = [];
  let currentHeight = 0;
  let currentPageIndex = 1;

  function pushPage() {
    pages.push({
      pageNumber: currentPageIndex,
      blocks: currentPageBlocks,
      pageWidth,
      pageHeight,
      margins,
      contentWidth,
      headerHeight,
      footerHeight,
      availableContentHeight
    });
    currentPageIndex++;
    currentPageBlocks = [];
    currentHeight = 0;
  }

  const blockQueue = [...blocks];

  while (blockQueue.length > 0) {
    const block = blockQueue.shift();

    // Explicit Page Break or Section Break
    if (block.type === 'pageBreak') {
      pushPage();
      continue;
    }

    if (block.type === 'sectionBreak') {
      if (block.sectionType === 'continuous') {
        currentPageBlocks.push(block);
        currentHeight += 12;
      } else {
        pushPage();
        if (block.sectionType === 'oddPage' && currentPageIndex % 2 === 0) {
          // Add blank even page to start on odd
          pushPage();
        } else if (block.sectionType === 'evenPage' && currentPageIndex % 2 !== 0) {
          // Add blank odd page to start on even
          pushPage();
        }
      }
      continue;
    }

    const blockHeight = measureBlockHeight(block, contentWidth);

    // If block fits on current page
    if (currentHeight + blockHeight <= availableContentHeight) {
      currentPageBlocks.push(block);
      currentHeight += blockHeight;
      continue;
    }

    // Block overflows current page!
    // If keepWithNext is true (e.g., Headings), or if current page has minimal space, move to next page
    if (block.keepWithNext && currentPageBlocks.length > 0) {
      pushPage();
      currentPageBlocks.push(block);
      currentHeight += blockHeight;
      continue;
    }

    // Try splitting paragraph if page has remaining room
    const remainingHeight = availableContentHeight - currentHeight;
    if (block.type === 'paragraph' && remainingHeight > 60) {
      const splitResult = splitParagraphBlock(block, remainingHeight, contentWidth);
      if (splitResult) {
        currentPageBlocks.push(splitResult.firstBlock);
        pushPage();
        blockQueue.unshift(splitResult.secondBlock);
        continue;
      }
    }

    // Try splitting table if page has room for header + rows
    if (block.type === 'table' && remainingHeight > 90) {
      const splitResult = splitTableBlock(block, remainingHeight, contentWidth);
      if (splitResult) {
        currentPageBlocks.push(splitResult.firstBlock);
        pushPage();
        blockQueue.unshift(splitResult.secondBlock);
        continue;
      }
    }

    // Cannot split or current page is full: push current page and place block on new page
    if (currentPageBlocks.length > 0) {
      pushPage();
    }

    // Place block on new page
    currentPageBlocks.push(block);
    currentHeight += blockHeight;
  }

  // Push final page if it has blocks or if document is empty
  if (currentPageBlocks.length > 0 || pages.length === 0) {
    pushPage();
  }

  return {
    pages,
    totalPages: pages.length,
    pageWidth,
    pageHeight,
    margins,
    contentWidth
  };
}

