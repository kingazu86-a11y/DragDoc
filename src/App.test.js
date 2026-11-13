import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App, { PresentationApp } from './App';
import {
  createDefaultPresentation,
  createDefaultSlide,
  createSlideTextElement,
  createSlideShapeElement,
  createSlideChartElement
} from './engine/presentationModel';
import {
  chartDataToGrid,
  gridToChartData,
  exportChartDataToCsv,
  parseCsvToGrid
} from './engine/chartDataEngine';
import { paginateDocument } from './engine/paginationEngine';
import { createDefaultDocument } from './engine/documentModel';
import {
  createDefaultWorkbook,
  createSheet,
  formatCellValue,
  calculateRangeStats,
  exportSheetToCsv,
  parseCsvToSheet,
  exportWorkbookToSpreadsheetXml,
  sortWorksheet
} from './engine/sheetModel';
import { evaluateFormula, coordsToCellId, cellIdToCoords } from './engine/formulaEngine';
import {
  createDefaultPdfDocument,
  addBlankPage,
  deletePage,
  rotatePage,
  reorderPages,
  addAnnotationToPage,
  updatePageFormField
} from './engine/pdfStudioModel';
import { SheetsApp } from './components/sheets/SheetsApp';
import { PdfStudioApp } from './components/pdf/PdfStudioApp';

describe('Presentation Suite Core Tests', () => {
  test('creates default presentation with executive slides', () => {
    const pres = createDefaultPresentation('Q4 Executive Review');
    expect(pres.title).toBe('Q4 Executive Review');
    expect(pres.slides.length).toBeGreaterThanOrEqual(4);
    expect(pres.aspectRatio).toBe('widescreen');
    expect(pres.dimensions.width).toBe(960);
    expect(pres.dimensions.height).toBe(540);
  });

  test('slide creation and element insertion', () => {
    const slide = createDefaultSlide('Architecture Deep Dive', 'titleAndContent');
    expect(slide.title).toBe('Architecture Deep Dive');
    expect(slide.elements.length).toBeGreaterThan(0);

    const shape = createSlideShapeElement('roundRect', 100, 100, 200, 120);
    expect(shape.type).toBe('shape');
    expect(shape.shapeType).toBe('roundRect');

    const textEl = createSlideTextElement('Dynamic Title', 50, 50, 400, 60);
    expect(textEl.type).toBe('text');
    expect(textEl.text).toBe('Dynamic Title');
  });

  test('chart data matrix conversions and live updates', () => {
    const chartEl = createSlideChartElement('clusteredColumn');
    expect(chartEl.data.categories).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);

    // Convert to 2D spreadsheet grid
    const grid = chartDataToGrid(chartEl.data);
    expect(grid[0]).toEqual(['Category', 'Target Revenue', 'Actual Revenue']);
    expect(grid.length).toBe(5);

    // Modify a cell in grid
    grid[1][2] = 195;

    // Reconvert to chart data
    const updatedData = gridToChartData(grid);
    expect(updatedData.series[1].data[0]).toBe(195);
  });

  test('chart data CSV export and import parsing', () => {
    const chartEl = createSlideChartElement('clusteredBar');
    const csv = exportChartDataToCsv(chartEl.data);
    expect(csv).toContain('Category');
    expect(csv).toContain('Target Revenue');

    const parsedGrid = parseCsvToGrid(csv);
    expect(parsedGrid.length).toBe(5);
    expect(parsedGrid[0][0]).toBe('Category');
  });

  test('renders standalone presentation editor successfully', () => {
    render(<PresentationApp onSwitchMode={() => { }} />);
    expect(screen.getAllByText(/DragSlides/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/New Slide/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Present/i).length).toBeGreaterThan(0);
  });
});

describe('Word Multi-Page Document Tests', () => {
  test('multi-page document engine backwards compatibility', () => {
    const doc = createDefaultDocument('Word Document');
    const pagination = paginateDocument(doc);
    expect(pagination.totalPages).toBeGreaterThanOrEqual(1);
    expect(pagination.pages[0].blocks.length).toBeGreaterThan(0);
  });
});

  describe('Sheets Spreadsheet Engine & Components', () => {
    test('coordinates conversion utilities', () => {
      expect(coordsToCellId(1, 1)).toBe('A1');
      expect(coordsToCellId(2, 2)).toBe('B2');
      expect(coordsToCellId(10, 26)).toBe('Z10');
      expect(cellIdToCoords('A1')).toEqual({ r: 1, c: 1 });
      expect(cellIdToCoords('B2')).toEqual({ r: 2, c: 2 });
      expect(cellIdToCoords('Z10')).toEqual({ r: 10, c: 26 });
    });

    test('formula engine calculates mathematical and statistical functions', () => {
      const cells = {
        'A1': { value: 100 },
        'A2': { value: 200 },
        'A3': { value: 300 }
      };

      expect(evaluateFormula('=SUM(A1:A3)', cells)).toBe(600);
      expect(evaluateFormula('=AVERAGE(A1:A3)', cells)).toBe(200);
      expect(evaluateFormula('=MIN(A1:A3)', cells)).toBe(100);
      expect(evaluateFormula('=MAX(A1:A3)', cells)).toBe(300);
      expect(evaluateFormula('=COUNT(A1:A3)', cells)).toBe(3);
      expect(evaluateFormula('=A1*2 + A2', cells)).toBe(400);
    });

    test('cell formatting formats currency, percentage, and decimals', () => {
      expect(formatCellValue(125000, 'currency')).toBe('$125,000.00');
      expect(formatCellValue(0.385, 'percent', 1)).toBe('38.5%');
      expect(formatCellValue(1234.5678, 'number', 2)).toBe('1,234.57');
    });

    test('default workbook creation and range statistics calculation', () => {
      const wb = createDefaultWorkbook();
      expect(wb.sheets.length).toBe(2);
      expect(wb.sheets[0].name).toBe('Financial Projections');

      const stats = calculateRangeStats(['B2', 'B3', 'B4'], wb.sheets[0].cells);
      expect(stats.count).toBe(3);
      expect(stats.sum).toBe(125000 + 84000 + 92000);
    });

    test('CSV and Excel SpreadsheetML export', () => {
      const wb = createDefaultWorkbook();
      const csv = exportSheetToCsv(wb.sheets[0]);
      expect(csv).toContain('Enterprise Software');
      expect(csv).toContain('Annual Total');

      const xml = exportWorkbookToSpreadsheetXml(wb);
      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('urn:schemas-microsoft-com:office:spreadsheet');
      expect(xml).toContain('Financial Projections');
    });

    test('renders SheetsApp component successfully', () => {
      render(<SheetsApp />);
      expect(screen.getAllByText(/AutoSum/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Financial Projections/i).length).toBeGreaterThan(0);
    });
  });

  describe('PDF Studio Engine & Components', () => {
    test('creates default multi-page PDF document', () => {
      const pdfDoc = createDefaultPdfDocument();
      expect(pdfDoc.pages.length).toBe(3);
      expect(pdfDoc.pages[0].title).toContain('Master Professional Services Agreement');
      expect(pdfDoc.pages[0].contentBlocks.length).toBeGreaterThan(0);
    });

    test('page rotation, addition, and deletion', () => {
      let pdfDoc = createDefaultPdfDocument();
      expect(pdfDoc.pages[0].rotation).toBe(0);

      pdfDoc = rotatePage(pdfDoc, 0, 90);
      expect(pdfDoc.pages[0].rotation).toBe(90);

      pdfDoc = addBlankPage(pdfDoc);
      expect(pdfDoc.pages.length).toBe(4);

      pdfDoc = deletePage(pdfDoc, 3);
      expect(pdfDoc.pages.length).toBe(3);
    });

    test('annotations and interactive form fields', () => {
      let pdfDoc = createDefaultPdfDocument();
      pdfDoc = addAnnotationToPage(pdfDoc, 0, {
        type: 'stamp',
        stampType: 'CONFIDENTIAL',
        x: 100,
        y: 100
      });
      expect(pdfDoc.pages[0].annotations.some(a => a.stampType === 'CONFIDENTIAL')).toBe(true);

      pdfDoc = updatePageFormField(pdfDoc, 0, 'ff-1', 'Acme Corporation');
      const field = pdfDoc.pages[0].formFields.find(f => f.id === 'ff-1');
      expect(field.value).toBe('Acme Corporation');
    });

    test('renders PdfStudioApp component successfully', () => {
      render(<PdfStudioApp />);
      expect(screen.getAllByText(/Master Professional Services Agreement/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Highlight/i).length).toBeGreaterThan(0);
      // Switch to Sign & Forms tab
      fireEvent.click(screen.getByText('Sign & Forms'));
      expect(screen.getAllByText(/Sign Document/i).length).toBeGreaterThan(0);
    });
  });

  describe('Unified Office Suite Shell & Navigation', () => {
    test('renders Unified Office Home Dashboard launcher by default', () => {
      render(<App />);
      // Home greeting and cards
      expect(screen.getAllByText(/Good day/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Blank Document/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Blank Spreadsheet/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Blank Presentation/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Open PDF Studio/i).length).toBeGreaterThan(0);

      // Left App rail buttons
      expect(screen.getByTitle(/Office Home Dashboard/i)).toBeInTheDocument();
      expect(screen.getByTitle(/DragDocs Word Processor/i)).toBeInTheDocument();
      expect(screen.getByTitle(/DragSheets Spreadsheet/i)).toBeInTheDocument();
      expect(screen.getByTitle(/DragSlides Presentation/i)).toBeInTheDocument();
      expect(screen.getByTitle(/DragPDF Studio/i)).toBeInTheDocument();
    });

    test('switches to Slides application when clicking Slides rail icon', () => {
      render(<App />);
      const slidesRailBtn = screen.getByTitle(/DragSlides Presentation/i);
      fireEvent.click(slidesRailBtn);

      expect(screen.getAllByText(/New Slide/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Present/i).length).toBeGreaterThan(0);
    });

    test('switches to Sheets application when clicking Sheets rail icon', () => {
      render(<App />);
      const sheetsRailBtn = screen.getByTitle(/DragSheets Spreadsheet/i);
      fireEvent.click(sheetsRailBtn);

      expect(screen.getAllByText(/AutoSum/i).length).toBeGreaterThan(0);
    });

    test('switches to PDF Studio when clicking PDF rail icon', () => {
      render(<App />);
      const pdfRailBtn = screen.getByTitle(/DragPDF Studio/i);
      fireEvent.click(pdfRailBtn);

      expect(screen.getAllByText(/Highlight/i).length).toBeGreaterThan(0);
      fireEvent.click(screen.getByText('Sign & Forms'));
      expect(screen.getAllByText(/Sign Document/i).length).toBeGreaterThan(0);
    });
  });
