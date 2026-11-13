/**
 * Document Data Model for DragDocs Word Processor
 * Represents structured document blocks, inline formatting runs, page setup, and metadata.
 */

export const PAPER_SIZES = {
  letter: { name: 'Letter', width: 816, height: 1056, unit: 'in', label: '8.5" x 11"' },
  a4: { name: 'A4', width: 794, height: 1123, unit: 'mm', label: '210 x 297 mm' },
  legal: { name: 'Legal', width: 816, height: 1344, unit: 'in', label: '8.5" x 14"' },
  a3: { name: 'A3', width: 1123, height: 1587, unit: 'mm', label: '297 x 420 mm' },
  a5: { name: 'A5', width: 559, height: 794, unit: 'mm', label: '148 x 210 mm' }
};

export const MARGIN_PRESETS = {
  normal: { name: 'Normal', top: 96, bottom: 96, left: 96, right: 96, label: 'Top: 1", Bottom: 1", Left: 1", Right: 1"' },
  narrow: { name: 'Narrow', top: 48, bottom: 48, left: 48, right: 48, label: 'Top: 0.5", Bottom: 0.5", Left: 0.5", Right: 0.5"' },
  moderate: { name: 'Moderate', top: 96, bottom: 96, left: 72, right: 72, label: 'Top: 1", Bottom: 1", Left: 0.75", Right: 0.75"' },
  wide: { name: 'Wide', top: 96, bottom: 96, left: 144, right: 144, label: 'Top: 1", Bottom: 1", Left: 1.5", Right: 1.5"' }
};

export const DOCUMENT_THEMES = {
  office: {
    id: 'office',
    name: 'Office Classic',
    primary: '#185abd',
    secondary: '#106ebe',
    accent: '#2b579a',
    fontHeading: 'Calibri, sans-serif',
    fontBody: 'Calibri, sans-serif'
  },
  modern: {
    id: 'modern',
    name: 'Modern Blue',
    primary: '#0f62fe',
    secondary: '#0043ce',
    accent: '#393939',
    fontHeading: 'Segoe UI, sans-serif',
    fontBody: 'Segoe UI, sans-serif'
  },
  slate: {
    id: 'slate',
    name: 'Slate Minimal',
    primary: '#34495e',
    secondary: '#2c3e50',
    accent: '#7f8c8d',
    fontHeading: 'Arial, sans-serif',
    fontBody: 'Arial, sans-serif'
  },
  academic: {
    id: 'academic',
    name: 'Academic Emerald',
    primary: '#1e7145',
    secondary: '#135c36',
    accent: '#2d3748',
    fontHeading: 'Georgia, serif',
    fontBody: 'Georgia, serif'
  },
  executive: {
    id: 'executive',
    name: 'Executive Crimson',
    primary: '#a80000',
    secondary: '#750000',
    accent: '#2b2b2b',
    fontHeading: 'Times New Roman, serif',
    fontBody: 'Times New Roman, serif'
  }
};

export const DEFAULT_PAGE_SETUP = {
  paperSize: 'letter',
  orientation: 'portrait',
  margins: { top: 96, bottom: 96, left: 96, right: 96 },
  marginPreset: 'normal',
  columns: 1,
  columnGap: 36,
  lineNumbers: false,
  pageColor: '#ffffff',
  watermark: {
    type: 'none', // 'none' | 'text' | 'image'
    text: 'DRAFT',
    color: '#d1d5db',
    opacity: 0.25,
    angle: -45
  },
  pageBorder: {
    enabled: false,
    style: 'solid',
    width: 1,
    color: '#000000'
  },
  header: {
    text: '',
    align: 'right',
    showOnFirstPage: false
  },
  footer: {
    showPageNumber: true,
    format: 'Page {page} of {total}',
    align: 'center',
    text: ''
  }
};

export const DEFAULT_STYLES = {
  normal: { name: 'Normal', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', color: '#1f2937', spacingBefore: 0, spacingAfter: 6, lineSpacing: 1.15 },
  noSpacing: { name: 'No Spacing', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', color: '#1f2937', spacingBefore: 0, spacingAfter: 0, lineSpacing: 1.0 },
  heading1: { name: 'Heading 1', fontSize: 20, fontWeight: 'bold', fontStyle: 'normal', color: '#185abd', spacingBefore: 12, spacingAfter: 6, lineSpacing: 1.2 },
  heading2: { name: 'Heading 2', fontSize: 16, fontWeight: 'bold', fontStyle: 'normal', color: '#2b579a', spacingBefore: 10, spacingAfter: 4, lineSpacing: 1.2 },
  heading3: { name: 'Heading 3', fontSize: 13, fontWeight: 'bold', fontStyle: 'normal', color: '#374151', spacingBefore: 8, spacingAfter: 4, lineSpacing: 1.2 },
  title: { name: 'Title', fontSize: 28, fontWeight: 'bold', fontStyle: 'normal', color: '#111827', spacingBefore: 0, spacingAfter: 8, lineSpacing: 1.1 },
  subtitle: { name: 'Subtitle', fontSize: 14, fontWeight: 'normal', fontStyle: 'italic', color: '#4b5563', spacingBefore: 0, spacingAfter: 12, lineSpacing: 1.15 },
  quote: { name: 'Quote', fontSize: 11, fontWeight: 'normal', fontStyle: 'italic', color: '#4b5563', spacingBefore: 6, spacingAfter: 6, lineSpacing: 1.2, borderLeft: '3px solid #185abd', indentLeft: 24 },
  caption: { name: 'Caption', fontSize: 9.5, fontWeight: 'normal', fontStyle: 'italic', color: '#6b7280', spacingBefore: 4, spacingAfter: 6, lineSpacing: 1.1 }
};

let uniqueIdCounter = 1;
export function generateId(prefix = 'blk') {
  return `${prefix}_${Date.now()}_${uniqueIdCounter++}`;
}

/**
 * Creates an inline text run with optional rich formatting.
 */
export function createTextRun(text = '', formatting = {}) {
  return {
    id: generateId('run'),
    text,
    bold: false,
    italic: false,
    underline: false,
    doubleUnderline: false,
    strikethrough: false,
    superscript: false,
    subscript: false,
    fontColor: '#1f2937',
    highlight: null,
    fontFamily: 'Calibri, sans-serif',
    fontSize: 11,
    letterSpacing: 0,
    link: null,
    footnoteRef: null,
    trackedChange: null,
    ...formatting
  };
}

/**
 * Creates a paragraph block.
 */
export function createParagraphBlock(text = '', formatting = {}, blockProps = {}) {
  const textRuns = Array.isArray(text)
    ? text
    : [createTextRun(text, formatting)];

  return {
    id: generateId('p'),
    type: 'paragraph',
    style: 'normal',
    align: 'left', // 'left' | 'center' | 'right' | 'justify'
    lineSpacing: 1.15,
    spacingBefore: 0,
    spacingAfter: 6,
    indentLeft: 0,
    indentRight: 0,
    firstLineIndent: 0,
    listType: 'none', // 'none' | 'bullet' | 'number'
    listLevel: 0,
    dir: 'ltr', // 'ltr' | 'rtl'
    keepWithNext: false,
    textRuns,
    ...blockProps
  };
}

/**
 * Creates a heading block.
 */
export function createHeadingBlock(text = '', level = 1, blockProps = {}) {
  const styleKey = `heading${level}`;
  const styleDefaults = DEFAULT_STYLES[styleKey] || DEFAULT_STYLES.heading1;
  return {
    id: generateId('h'),
    type: 'heading',
    level,
    style: styleKey,
    align: 'left',
    lineSpacing: styleDefaults.lineSpacing,
    spacingBefore: styleDefaults.spacingBefore,
    spacingAfter: styleDefaults.spacingAfter,
    indentLeft: 0,
    indentRight: 0,
    firstLineIndent: 0,
    listType: 'none',
    listLevel: 0,
    dir: 'ltr',
    keepWithNext: true,
    textRuns: [createTextRun(text, {
      bold: true,
      fontSize: styleDefaults.fontSize,
      fontColor: styleDefaults.color
    })],
    ...blockProps
  };
}

/**
 * Creates a table block.
 */
export function createTableBlock(rows = 3, cols = 3, tableProps = {}) {
  const tableRows = [];
  for (let r = 0; r < rows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const isHeader = r === 0;
      cells.push({
        id: generateId('cell'),
        colSpan: 1,
        rowSpan: 1,
        width: `${Math.round(100 / cols)}%`,
        backgroundColor: isHeader ? '#f3f4f6' : '#ffffff',
        align: 'left',
        verticalAlign: 'top',
        content: [createParagraphBlock(isHeader ? `Header ${c + 1}` : `Row ${r + 1}, Col ${c + 1}`, {
          bold: isHeader,
          fontSize: 10.5
        }, { spacingAfter: 0 })]
      });
    }
    tableRows.push({
      id: generateId('row'),
      isHeader: r === 0,
      cells
    });
  }

  return {
    id: generateId('tbl'),
    type: 'table',
    rows: tableRows,
    borders: true,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderStyle: 'solid',
    align: 'center',
    width: '100%',
    repeatHeader: true,
    tableStyle: 'grid', // 'grid' | 'banded' | 'minimal' | 'modern'
    ...tableProps
  };
}

/**
 * Creates an image block.
 */
export function createImageBlock(src, alt = '', width = 450, height = 300, imageProps = {}) {
  return {
    id: generateId('img'),
    type: 'image',
    src,
    alt,
    width,
    height,
    caption: '',
    align: 'center', // 'left' | 'center' | 'right'
    wrap: 'inline', // 'inline' | 'square' | 'tight' | 'behind' | 'front'
    borderColor: '#e5e7eb',
    borderWidth: 0,
    ...imageProps
  };
}

/**
 * Creates a smart diagram block.
 */
export function createDiagramBlock(diagramType = 'process', items = null, diagramProps = {}) {
  const defaultItems = items || [
    { id: generateId('item'), title: 'Phase 1: Initiate', desc: 'Define project scope and goals' },
    { id: generateId('item'), title: 'Phase 2: Develop', desc: 'Implement core features and architecture' },
    { id: generateId('item'), title: 'Phase 3: Verify', desc: 'Automated testing and QA inspection' },
    { id: generateId('item'), title: 'Phase 4: Deliver', desc: 'Production deployment and handoff' }
  ];

  return {
    id: generateId('diag'),
    type: 'diagram',
    diagramType, // 'process' | 'cycle' | 'hierarchy' | 'matrix' | 'list'
    items: defaultItems,
    accentColor: '#185abd',
    ...diagramProps
  };
}

/**
 * Creates a chart block.
 */
export function createChartBlock(chartType = 'bar', chartProps = {}) {
  return {
    id: generateId('chart'),
    type: 'chart',
    chartType, // 'bar' | 'line' | 'pie'
    title: 'Quarterly Performance Metrics',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { name: 'Target', data: [65, 78, 85, 92], color: '#93c5fd' },
      { name: 'Achieved', data: [70, 82, 90, 96], color: '#185abd' }
    ],
    ...chartProps
  };
}

/**
 * Creates a page break block.
 */
export function createPageBreakBlock() {
  return {
    id: generateId('pb'),
    type: 'pageBreak'
  };
}

/**
 * Creates a section break block.
 */
export function createSectionBreakBlock(sectionType = 'nextPage') {
  return {
    id: generateId('sb'),
    type: 'sectionBreak',
    sectionType // 'nextPage' | 'continuous' | 'evenPage' | 'oddPage'
  };
}

/**
 * Creates a Table of Contents block.
 */
export function createTableOfContentsBlock() {
  return {
    id: generateId('toc'),
    type: 'toc',
    title: 'Table of Contents',
    maxLevel: 3,
    showPageNumbers: true,
    tabLeader: 'dots' // 'dots' | 'hyphens' | 'line' | 'none'
  };
}

/**
 * Creates a quote / callout block.
 */
export function createQuoteBlock(text = '', author = '', quoteProps = {}) {
  return {
    id: generateId('quote'),
    type: 'quote',
    textRuns: [createTextRun(text, { italic: true, fontSize: 11, fontColor: '#374151' })],
    author,
    borderLeftColor: '#185abd',
    backgroundColor: '#f9fafb',
    ...quoteProps
  };
}

/**
 * Factory for a new blank document.
 */
export function createDefaultDocument(title = 'Untitled Document') {
  return {
    id: generateId('doc'),
    title,
    author: 'Author',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    theme: DOCUMENT_THEMES.office,
    pageSetup: { ...DEFAULT_PAGE_SETUP },
    blocks: [
      createHeadingBlock(title, 1),
      createParagraphBlock('Welcome to DragDocs. Start typing your professional document here, or choose a pre-formatted template from the File tab.')
    ],
    drawings: [], // ink strokes per page
    comments: [], // { id, blockId, author, text, timestamp, resolved, replies: [] }
    trackedChanges: {
      enabled: false,
      author: 'Author',
      displayMode: 'all' // 'all' | 'simple' | 'none' | 'original'
    },
    footnotes: [], // { id: 1, blockId, text: 'Footnote text' }
    endnotes: [],
    citations: [
      { id: 'smith2024', type: 'book', author: 'Smith, J.', title: 'Modern Word Processing Architecture', year: '2024', publisher: 'Tech Press' }
    ],
    citationStyle: 'APA', // 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard'
    mailMerge: {
      recipients: [
        { FirstName: 'Alexander', LastName: 'Wright', Company: 'Apex Global', Address: '123 Market St', City: 'Seattle', State: 'WA', Zip: '98101', Email: 'alex@apex.example' },
        { FirstName: 'Elena', LastName: 'Rostova', Company: 'Vanguard Systems', Address: '456 Tech Parkway', City: 'Austin', State: 'TX', Zip: '73301', Email: 'elena@vanguard.example' },
        { FirstName: 'Marcus', LastName: 'Chen', Company: 'Horizon Dynamics', Address: '789 Innovation Ave', City: 'Boston', State: 'MA', Zip: '02110', Email: 'marcus@horizon.example' }
      ],
      activeRecipientIndex: 0,
      highlightFields: true
    }
  };
}

