/**
 * Presentation Data Model for DragDocs / DragSlides
 * Structured representation of slides, elements, animations, transitions, and themes.
 */

export const SLIDE_ASPECT_RATIOS = {
  widescreen: { id: 'widescreen', name: 'Widescreen (16:9)', width: 960, height: 540, label: '16:9' },
  standard: { id: 'standard', name: 'Standard (4:3)', width: 800, height: 600, label: '4:3' },
  custom: { id: 'custom', name: 'Custom Dimensions', width: 960, height: 540, label: 'Custom' }
};

export const PRESENTATION_THEMES = {
  office: {
    id: 'office',
    name: 'Office Fluent',
    primary: '#185abd',
    secondary: '#0078d4',
    accent: '#d83b01',
    background: '#ffffff',
    slideBg: '#ffffff',
    fontHeading: 'Calibri, sans-serif',
    fontBody: 'Calibri, sans-serif'
  },
  darkModern: {
    id: 'darkModern',
    name: 'Executive Dark',
    primary: '#0078d4',
    secondary: '#50e6ff',
    accent: '#ffb900',
    background: '#111827',
    slideBg: '#1f2937',
    fontHeading: 'Segoe UI, sans-serif',
    fontBody: 'Segoe UI, sans-serif'
  },
  emeraldTech: {
    id: 'emeraldTech',
    name: 'Emerald Venture',
    primary: '#107c41',
    secondary: '#27ae60',
    accent: '#2ecc71',
    background: '#ffffff',
    slideBg: '#f0fdf4',
    fontHeading: 'Georgia, serif',
    fontBody: 'Arial, sans-serif'
  },
  crimsonPitch: {
    id: 'crimsonPitch',
    name: 'Crimson Keynote',
    primary: '#a80000',
    secondary: '#d13438',
    accent: '#ea4335',
    background: '#ffffff',
    slideBg: '#fff5f5',
    fontHeading: 'Trebuchet MS, sans-serif',
    fontBody: 'Segoe UI, sans-serif'
  }
};

let elementIdCounter = 1;
export function generateSlideElementId(prefix = 'el') {
  return `${prefix}_${Date.now()}_${elementIdCounter++}`;
}

export function createSlideTextElement(text, x = 80, y = 80, width = 800, height = 90, customProps = {}) {
  return {
    id: generateSlideElementId('txt'),
    type: 'text',
    name: 'Text Box',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 1,
    locked: false,
    hidden: false,
    text,
    fontSize: 28,
    fontFamily: 'Calibri, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#1f2937',
    align: 'left',
    lineSpacing: 1.2,
    bulletType: 'none',
    dir: 'ltr',
    padding: 8,
    ...customProps
  };
}

export function createSlideShapeElement(shapeType = 'rect', x = 120, y = 140, width = 240, height = 160, customProps = {}) {
  return {
    id: generateSlideElementId('shp'),
    type: 'shape',
    shapeType, // 'rect', 'roundRect', 'circle', 'triangle', 'diamond', 'arrow', 'star', 'callout', 'process', 'decision'
    name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Shape`,
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 2,
    locked: false,
    hidden: false,
    fill: '#185abd',
    stroke: '#104f9f',
    strokeWidth: 2,
    borderRadius: shapeType === 'roundRect' ? 12 : 0,
    opacity: 1,
    text: '',
    textColor: '#ffffff',
    fontSize: 16,
    ...customProps
  };
}

export function createSlideImageElement(src, x = 140, y = 120, width = 480, height = 280, customProps = {}) {
  return {
    id: generateSlideElementId('img'),
    type: 'image',
    name: 'Picture',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 2,
    locked: false,
    hidden: false,
    src,
    alt: 'Presentation Graphic',
    opacity: 1,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#e5e7eb',
    filter: {
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      blur: 0
    },
    ...customProps
  };
}

export function createSlideTableElement(rows = 3, cols = 3, x = 100, y = 140, width = 760, height = 220, customProps = {}) {
  const tableRows = [];
  for (let r = 0; r < rows; r++) {
    const cells = [];
    for (let c = 0; c < cols; c++) {
      const isHeader = r === 0;
      cells.push({
        id: generateSlideElementId('cell'),
        text: isHeader ? `Header ${c + 1}` : `Data ${r},${c}`,
        backgroundColor: isHeader ? '#185abd' : (r % 2 === 0 ? '#f8fafc' : '#ffffff'),
        textColor: isHeader ? '#ffffff' : '#1f2937',
        bold: isHeader,
        align: 'left'
      });
    }
    tableRows.push({ id: generateSlideElementId('row'), cells });
  }

  return {
    id: generateSlideElementId('tbl'),
    type: 'table',
    name: 'Data Table',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 2,
    locked: false,
    hidden: false,
    rows: tableRows,
    borders: true,
    borderColor: '#cbd5e1',
    headerRow: true,
    bandedRows: true,
    ...customProps
  };
}

export function createSlideChartElement(chartType = 'clusteredColumn', x = 80, y = 110, width = 800, height = 360, customProps = {}) {
  return {
    id: generateSlideElementId('cht'),
    type: 'chart',
    name: `${chartType} Chart`,
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 3,
    locked: false,
    hidden: false,
    chartType, // 'clusteredColumn', 'stackedColumn', 'clusteredBar', 'line', 'smoothLine', 'pie', 'doughnut', 'area', 'scatter', 'radar', 'funnel', 'waterfall', 'heatmap'
    title: 'Enterprise Growth & Adoption Metrics',
    showLegend: true,
    showDataLabels: true,
    showGridlines: true,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    data: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        { name: 'Target Revenue', data: [120, 150, 180, 240], color: '#93c5fd' },
        { name: 'Actual Revenue', data: [135, 168, 210, 275], color: '#185abd' }
      ]
    },
    ...customProps
  };
}

export function createDefaultSlide(title = 'New Slide', layout = 'titleAndContent') {
  const elements = [];

  if (layout === 'title') {
    elements.push(
      createSlideTextElement(title, 80, 160, 800, 90, {
        fontSize: 44,
        fontWeight: 'bold',
        align: 'center',
        color: '#185abd'
      }),
      createSlideTextElement('Strategic Vision & Execution Overview\nNovember 2026', 120, 270, 720, 70, {
        fontSize: 18,
        color: '#6b7280',
        align: 'center'
      })
    );
  } else if (layout === 'titleAndContent') {
    elements.push(
      createSlideTextElement(title, 60, 40, 840, 50, {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#185abd'
      }),
      createSlideTextElement(
        '• Scalable cloud architecture supporting multi-region deployment\n• Sub-16ms deterministic layout rendering pipeline\n• Built-in collaborative commenting and track changes\n• Automated data synchronization across connected data sources',
        60,
        120,
        840,
        340,
        {
          fontSize: 20,
          lineSpacing: 1.6,
          color: '#374151'
        }
      )
    );
  } else if (layout === 'sectionHeader') {
    elements.push(
      createSlideTextElement(title, 80, 200, 800, 90, {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
        align: 'center'
      })
    );
  } else {
    // Blank or custom
    elements.push(
      createSlideTextElement(title, 60, 40, 840, 50, {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#185abd'
      })
    );
  }

  return {
    id: generateSlideElementId('sld'),
    title,
    layout,
    background: {
      type: layout === 'sectionHeader' ? 'solid' : 'solid',
      color: layout === 'sectionHeader' ? '#185abd' : '#ffffff'
    },
    transition: {
      type: 'fade', // 'none', 'fade', 'push', 'wipe', 'split', 'zoom', 'dissolve'
      duration: 0.5,
      direction: 'left'
    },
    notes: 'Speaker notes for this slide: Introduce strategic goals, timeline milestones, and team deliverables.',
    hidden: false,
    elements
  };
}

export function createDefaultPresentation(title = 'Executive Keynote Presentation') {
  return {
    id: generateSlideElementId('pres'),
    title,
    author: 'Principal Architect',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    aspectRatio: 'widescreen',
    dimensions: { width: 960, height: 540 },
    theme: PRESENTATION_THEMES.office,
    slides: [
      createDefaultSlide('DragSlides Executive Keynote', 'title'),
      {
        ...createDefaultSlide('Enterprise Core Architecture', 'titleAndContent'),
        elements: [
          createSlideTextElement('Enterprise Core Architecture', 60, 40, 840, 50, {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#185abd'
          }),
          createSlideShapeElement('roundRect', 60, 130, 240, 120, {
            text: 'Client Presentation Canvas\n(GPU Accelerated)',
            fill: '#eff6ff',
            stroke: '#185abd',
            textColor: '#185abd',
            fontSize: 14
          }),
          createSlideShapeElement('roundRect', 360, 130, 240, 120, {
            text: 'Spreadsheet Chart Engine\n(Live Data Binding)',
            fill: '#eff6ff',
            stroke: '#107c41',
            textColor: '#107c41',
            fontSize: 14
          }),
          createSlideShapeElement('roundRect', 660, 130, 240, 120, {
            text: 'Slide Transition & Timeline\n(Interactive Player)',
            fill: '#eff6ff',
            stroke: '#7c3aed',
            textColor: '#7c3aed',
            fontSize: 14
          }),
          createSlideTextElement('All modules communicate seamlessly with deterministic reactive state synchronization.', 60, 300, 840, 60, {
            fontSize: 18,
            color: '#4b5563',
            align: 'center'
          })
        ]
      },
      {
        ...createDefaultSlide('Quarterly Business Performance', 'blank'),
        elements: [
          createSlideTextElement('Quarterly Performance & Growth Forecast', 60, 30, 840, 50, {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#185abd'
          }),
          createSlideChartElement('clusteredColumn', 60, 90, 840, 400)
        ]
      },
      {
        ...createDefaultSlide('Detailed Metrics Comparison', 'blank'),
        elements: [
          createSlideTextElement('Deliverable Milestones & Ownership', 60, 30, 840, 50, {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#185abd'
          }),
          createSlideTableElement(4, 4, 60, 100, 840, 240, {
            rows: [
              {
                id: 'r_h',
                cells: [
                  { id: 'c1', text: 'Workstream Focus', backgroundColor: '#185abd', textColor: '#ffffff', bold: true },
                  { id: 'c2', text: 'Lead Architect', backgroundColor: '#185abd', textColor: '#ffffff', bold: true },
                  { id: 'c3', text: 'Target SLA', backgroundColor: '#185abd', textColor: '#ffffff', bold: true },
                  { id: 'c4', text: 'Current Status', backgroundColor: '#185abd', textColor: '#ffffff', bold: true }
                ]
              },
              {
                id: 'r_1',
                cells: [
                  { id: 'c11', text: 'Slide Thumbnail Virtualization', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c12', text: 'Eleanor Vance', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c13', text: '< 8ms Frame Rate', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c14', text: 'Production Complete', backgroundColor: '#dcfce7', textColor: '#16a34a', bold: true }
                ]
              },
              {
                id: 'r_2',
                cells: [
                  { id: 'c21', text: 'Chart Spreadsheet Data Editor', backgroundColor: '#f8fafc', textColor: '#1f2937' },
                  { id: 'c22', text: 'Marcus Chen', backgroundColor: '#f8fafc', textColor: '#1f2937' },
                  { id: 'c23', text: 'Instant Reactive Refresh', backgroundColor: '#f8fafc', textColor: '#1f2937' },
                  { id: 'c24', text: 'Production Complete', backgroundColor: '#dcfce7', textColor: '#16a34a', bold: true }
                ]
              },
              {
                id: 'r_3',
                cells: [
                  { id: 'c31', text: 'Fullscreen Presenter Show', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c32', text: 'Sarah Lin', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c33', text: 'Hardware Acceleration', backgroundColor: '#ffffff', textColor: '#1f2937' },
                  { id: 'c34', text: 'Production Complete', backgroundColor: '#dcfce7', textColor: '#16a34a', bold: true }
                ]
              }
            ]
          })
        ]
      },
      createDefaultSlide('Summary & Strategic Q&A', 'sectionHeader')
    ],
    sections: [
      { id: 'sec_1', name: 'Executive Overview', slideIds: [], collapsed: false },
      { id: 'sec_2', name: 'Architecture & Operations', slideIds: [], collapsed: false }
    ]
  };
}

