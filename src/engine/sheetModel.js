/**
 * Advanced Spreadsheet Data Model & Engine for SheetsApp
 * Microsoft Excel comparable multi-sheet workbook, cell formatting,
 * range calculations, CSV/TSV import/export, and XML SpreadsheetML export.
 */

import { coordsToCellId, cellIdToCoords, evaluateFormula } from './formulaEngine';

export const DEFAULT_COL_COUNT = 26; // A to Z
export const DEFAULT_ROW_COUNT = 100;
export const DEFAULT_COL_WIDTH = 100;
export const DEFAULT_ROW_HEIGHT = 24;

/**
 * Formats a raw cell value based on cell format settings.
 */
export function formatCellValue(rawVal, format = 'general', decimals = 2) {
  if (rawVal === undefined || rawVal === null || rawVal === '') return '';
  if (typeof rawVal === 'string' && rawVal.startsWith('#')) return rawVal; // Error codes e.g. #REF!

  const num = Number(rawVal);
  if (isNaN(num)) return String(rawVal);

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num);

    case 'percent':
      return `${(num * 100).toFixed(decimals)}%`;

    case 'number':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num);

    case 'date':
      try {
        const d = new Date(rawVal);
        return isNaN(d.getTime()) ? String(rawVal) : d.toISOString().split('T')[0];
      } catch {
        return String(rawVal);
      }

    case 'general':
    default:
      return typeof rawVal === 'number' ? String(Number(num.toFixed(6))) : String(rawVal);
  }
}

/**
 * Creates a new blank worksheet or one with template data.
 */
export function createSheet(id = 'sheet-1', name = 'Sheet1', initialCells = {}) {
  const colWidths = {};
  for (let c = 1; c <= DEFAULT_COL_COUNT; c++) {
    const colName = coordsToCellId(1, c).replace('1', '');
    colWidths[colName] = c === 1 ? 160 : DEFAULT_COL_WIDTH;
  }

  const rowHeights = {};
  for (let r = 1; r <= DEFAULT_ROW_COUNT; r++) {
    rowHeights[r] = r === 1 ? 28 : DEFAULT_ROW_HEIGHT;
  }

  return {
    id,
    name,
    cells: initialCells,
    colWidths,
    rowHeights,
    activeCell: 'A1',
    selectionRange: { start: 'A1', end: 'A1' },
    selectedCells: ['A1'],
    freezePanes: { row: 1, col: 0 },
    zoom: 100,
    showGridlines: true,
    showHeadings: true,
    filterConfig: null,
    sortConfig: null
  };
}

/**
 * Generates rich, realistic corporate financial spreadsheet data.
 */
export function createDefaultFinancialSheet() {
  const cells = {
    // Header Row 1
    'A1': { value: 'Department / Product Line', bold: true, bgColor: '#f1f5f9', align: 'left' },
    'B1': { value: 'Q1 Actual', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'C1': { value: 'Q2 Actual', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'D1': { value: 'Q3 Projected', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'E1': { value: 'Q4 Projected', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'F1': { value: 'Annual Total', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'G1': { value: 'Operating Margin', bold: true, bgColor: '#f1f5f9', align: 'right' },

    // Data Row 2: Enterprise Software
    'A2': { value: 'Enterprise Software' },
    'B2': { value: 125000, format: 'currency', align: 'right' },
    'C2': { value: 142000, format: 'currency', align: 'right' },
    'D2': { value: 168000, format: 'currency', align: 'right' },
    'E2': { value: 195000, format: 'currency', align: 'right' },
    'F2': { formula: '=SUM(B2:E2)', format: 'currency', bold: true, align: 'right' },
    'G2': { value: 0.38, format: 'percent', align: 'right' },

    // Data Row 3: Cloud Infrastructure
    'A3': { value: 'Cloud Infrastructure' },
    'B3': { value: 84000, format: 'currency', align: 'right' },
    'C3': { value: 96000, format: 'currency', align: 'right' },
    'D3': { value: 110000, format: 'currency', align: 'right' },
    'E3': { value: 125000, format: 'currency', align: 'right' },
    'F3': { formula: '=SUM(B3:E3)', format: 'currency', bold: true, align: 'right' },
    'G3': { value: 0.42, format: 'percent', align: 'right' },

    // Data Row 4: AI Solutions & R&D
    'A4': { value: 'AI Solutions & R&D' },
    'B4': { value: 92000, format: 'currency', align: 'right' },
    'C4': { value: 115000, format: 'currency', align: 'right' },
    'D4': { value: 148000, format: 'currency', align: 'right' },
    'E4': { value: 182000, format: 'currency', align: 'right' },
    'F4': { formula: '=SUM(B4:E4)', format: 'currency', bold: true, align: 'right' },
    'G4': { value: 0.35, format: 'percent', align: 'right' },

    // Data Row 5: Professional Consulting
    'A5': { value: 'Professional Consulting' },
    'B5': { value: 45000, format: 'currency', align: 'right' },
    'C5': { value: 48000, format: 'currency', align: 'right' },
    'D5': { value: 52000, format: 'currency', align: 'right' },
    'E5': { value: 56000, format: 'currency', align: 'right' },
    'F5': { formula: '=SUM(B5:E5)', format: 'currency', bold: true, align: 'right' },
    'G5': { value: 0.28, format: 'percent', align: 'right' },

    // Data Row 6: Security & Compliance
    'A6': { value: 'Security & Compliance' },
    'B6': { value: 38000, format: 'currency', align: 'right' },
    'C6': { value: 41000, format: 'currency', align: 'right' },
    'D6': { value: 44000, format: 'currency', align: 'right' },
    'E6': { value: 49000, format: 'currency', align: 'right' },
    'F6': { formula: '=SUM(B6:E6)', format: 'currency', bold: true, align: 'right' },
    'G6': { value: 0.45, format: 'percent', align: 'right' },

    // Data Row 7: Hardware & Devices
    'A7': { value: 'Hardware & Devices' },
    'B7': { value: 62000, format: 'currency', align: 'right' },
    'C7': { value: 58000, format: 'currency', align: 'right' },
    'D7': { value: 64000, format: 'currency', align: 'right' },
    'E7': { value: 71000, format: 'currency', align: 'right' },
    'F7': { formula: '=SUM(B7:E7)', format: 'currency', bold: true, align: 'right' },
    'G7': { value: 0.22, format: 'percent', align: 'right' },

    // Summary Row 8: Total Revenue
    'A8': { value: 'Total Revenue', bold: true, bgColor: '#e2e8f0' },
    'B8': { formula: '=SUM(B2:B7)', format: 'currency', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'C8': { formula: '=SUM(C2:C7)', format: 'currency', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'D8': { formula: '=SUM(D2:D7)', format: 'currency', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'E8': { formula: '=SUM(E2:E7)', format: 'currency', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'F8': { formula: '=SUM(F2:F7)', format: 'currency', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'G8': { formula: '=AVERAGE(G2:G7)', format: 'percent', bold: true, bgColor: '#e2e8f0', align: 'right' },

    // Summary Row 9: Average per Department
    'A9': { value: 'Average per Dept', italic: true, bgColor: '#f8fafc' },
    'B9': { formula: '=AVERAGE(B2:B7)', format: 'currency', italic: true, align: 'right' },
    'C9': { formula: '=AVERAGE(C2:C7)', format: 'currency', italic: true, align: 'right' },
    'D9': { formula: '=AVERAGE(D2:D7)', format: 'currency', italic: true, align: 'right' },
    'E9': { formula: '=AVERAGE(E2:E7)', format: 'currency', italic: true, align: 'right' },
    'F9': { formula: '=AVERAGE(F2:F7)', format: 'currency', italic: true, align: 'right' },
    'G9': { formula: '=AVERAGE(G2:G7)', format: 'percent', italic: true, align: 'right' }
  };

  return createSheet('sheet-1', 'Financial Projections', cells);
}

/**
 * Creates secondary worksheet for regional sales performance.
 */
export function createDefaultRegionalSheet() {
  const cells = {
    'A1': { value: 'Sales Territory', bold: true, bgColor: '#f1f5f9', align: 'left' },
    'B1': { value: 'Headcount', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'C1': { value: 'Deals Quoted', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'D1': { value: 'Deals Won', bold: true, bgColor: '#f1f5f9', align: 'right' },
    'E1': { value: 'Conversion Rate', bold: true, bgColor: '#f1f5f9', align: 'right' },

    'A2': { value: 'North America (East)' },
    'B2': { value: 18, align: 'right' },
    'C2': { value: 240, align: 'right' },
    'D2': { value: 96, align: 'right' },
    'E2': { formula: '=D2/C2', format: 'percent', align: 'right' },

    'A3': { value: 'North America (West)' },
    'B3': { value: 16, align: 'right' },
    'C3': { value: 210, align: 'right' },
    'D3': { value: 88, align: 'right' },
    'E3': { formula: '=D3/C3', format: 'percent', align: 'right' },

    'A4': { value: 'Europe & UK' },
    'B4': { value: 22, align: 'right' },
    'C4': { value: 290, align: 'right' },
    'D4': { value: 112, align: 'right' },
    'E4': { formula: '=D4/C4', format: 'percent', align: 'right' },

    'A5': { value: 'Asia-Pacific' },
    'B5': { value: 14, align: 'right' },
    'C5': { value: 185, align: 'right' },
    'D5': { value: 74, align: 'right' },
    'E5': { formula: '=D5/C5', format: 'percent', align: 'right' },

    'A6': { value: 'Global Totals', bold: true, bgColor: '#e2e8f0' },
    'B6': { formula: '=SUM(B2:B5)', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'C6': { formula: '=SUM(C2:C5)', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'D6': { formula: '=SUM(D2:D5)', bold: true, bgColor: '#e2e8f0', align: 'right' },
    'E6': { formula: '=D6/C6', format: 'percent', bold: true, bgColor: '#e2e8f0', align: 'right' }
  };

  return createSheet('sheet-2', 'Regional Performance', cells);
}

/**
 * Creates default workbook containing sheets.
 */
export function createDefaultWorkbook(title = 'Corporate Financial Analysis 2026.xlsx') {
  const sheet1 = createDefaultFinancialSheet();
  const sheet2 = createDefaultRegionalSheet();

  return {
    id: `wb-${Date.now()}`,
    title,
    activeSheetId: sheet1.id,
    sheets: [sheet1, sheet2],
    history: { undo: [], redo: [] }
  };
}

/**
 * Calculates statistics (Sum, Count, Average, Min, Max) for a list of cells.
 */
export function calculateRangeStats(cellIds, cellsDict) {
  let sum = 0;
  let count = 0;
  let numericCount = 0;
  let min = Infinity;
  let max = -Infinity;

  cellIds.forEach(id => {
    count++;
    const cell = cellsDict[id];
    if (!cell) return;

    let val = cell.value;
    if (cell.formula) {
      val = evaluateFormula(cell.formula, cellsDict);
    }

    const num = Number(val);
    if (!isNaN(num) && val !== '' && val !== null && typeof val !== 'boolean') {
      sum += num;
      numericCount++;
      if (num < min) min = num;
      if (num > max) max = num;
    }
  });

  return {
    count,
    numericCount,
    sum: numericCount > 0 ? sum : 0,
    average: numericCount > 0 ? (sum / numericCount) : 0,
    min: numericCount > 0 ? min : 0,
    max: numericCount > 0 ? max : 0
  };
}

/**
 * Sorts a range of rows in a worksheet by a specified column.
 */
export function sortWorksheet(sheet, startRow, endRow, sortCol, direction = 'asc') {
  const rows = [];
  for (let r = startRow; r <= endRow; r++) {
    const rowData = {};
    for (let c = 1; c <= DEFAULT_COL_COUNT; c++) {
      const cellId = coordsToCellId(r, c);
      rowData[c] = sheet.cells[cellId] || { value: '' };
    }
    rows.push({ rowIndex: r, data: rowData });
  }

  const targetColCoords = cellIdToCoords(`${sortCol}1`);
  const colIndex = targetColCoords ? targetColCoords.c : 1;

  rows.sort((a, b) => {
    const valA = a.data[colIndex]?.value ?? '';
    const valB = b.data[colIndex]?.value ?? '';

    const numA = Number(valA);
    const numB = Number(valB);

    if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    return direction === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const updatedCells = { ...sheet.cells };
  rows.forEach((row, idx) => {
    const newRowIndex = startRow + idx;
    for (let c = 1; c <= DEFAULT_COL_COUNT; c++) {
      const oldCell = row.data[c];
      const newCellId = coordsToCellId(newRowIndex, c);
      if (oldCell && (oldCell.value !== '' || oldCell.formula)) {
        updatedCells[newCellId] = { ...oldCell };
      } else {
        delete updatedCells[newCellId];
      }
    }
  });

  return {
    ...sheet,
    cells: updatedCells,
    sortConfig: { col: sortCol, direction }
  };
}

/**
 * Exports worksheet cells to standard CSV format.
 */
export function exportSheetToCsv(sheet) {
  let maxR = 1;
  let maxC = 1;

  Object.keys(sheet.cells).forEach(cellId => {
    const coords = cellIdToCoords(cellId);
    if (coords) {
      if (coords.r > maxR) maxR = coords.r;
      if (coords.c > maxC) maxC = coords.c;
    }
  });

  const lines = [];
  for (let r = 1; r <= maxR; r++) {
    const rowVals = [];
    for (let c = 1; c <= maxC; c++) {
      const cellId = coordsToCellId(r, c);
      const cell = sheet.cells[cellId];
      let val = '';
      if (cell) {
        val = cell.formula ? evaluateFormula(cell.formula, sheet.cells) : (cell.value ?? '');
      }
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        rowVals.push(`"${str.replace(/"/g, '""')}"`);
      } else {
        rowVals.push(str);
      }
    }
    lines.push(rowVals.join(','));
  }

  return lines.join('\r\n');
}

/**
 * Parses raw CSV text into a worksheet.
 */
export function parseCsvToSheet(csvText, sheetName = 'Imported Sheet') {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  const newSheet = createSheet(`sheet-${Date.now()}`, sheetName);
  const cells = {};

  lines.forEach((line, rIdx) => {
    const rowNum = rIdx + 1;
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
    let match;
    let colNum = 1;

    while ((match = regex.exec(line)) !== null && colNum <= DEFAULT_COL_COUNT) {
      let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      val = val.trim();
      if (val !== '') {
        const cellId = coordsToCellId(rowNum, colNum);
        const numVal = Number(val);
        cells[cellId] = {
          value: isNaN(numVal) ? val : numVal,
          align: isNaN(numVal) ? 'left' : 'right'
        };
      }
      colNum++;
    }
  });

  return {
    ...newSheet,
    cells
  };
}

/**
 * Exports workbook to Microsoft Excel XML Spreadsheet (SpreadsheetML) format.
 * Fully compatible with Microsoft Excel, LibreOffice Calc, and Google Sheets.
 */
export function exportWorkbookToSpreadsheetXml(workbook) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="sHeader">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#1e293b"/>
   <Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="sCurrency">
   <NumberFormat ss:Format="&quot;$&quot;#,##0.00"/>
  </Style>
  <Style ss:ID="sPercent">
   <NumberFormat ss:Format="0.0%"/>
  </Style>
 </Styles>
`;

  workbook.sheets.forEach(sheet => {
    xml += ` <Worksheet ss:Name="${sheet.name.replace(/["&<>]/g, '')}">\n  <Table>\n`;

    let maxR = 1;
    let maxC = 1;
    Object.keys(sheet.cells).forEach(cellId => {
      const coords = cellIdToCoords(cellId);
      if (coords) {
        if (coords.r > maxR) maxR = coords.r;
        if (coords.c > maxC) maxC = coords.c;
      }
    });

    for (let r = 1; r <= maxR; r++) {
      xml += `   <Row>\n`;
      for (let c = 1; c <= maxC; c++) {
        const cellId = coordsToCellId(r, c);
        const cell = sheet.cells[cellId];
        if (!cell) {
          xml += `    <Cell><Data ss:Type="String"></Data></Cell>\n`;
        } else {
          let val = cell.formula ? evaluateFormula(cell.formula, sheet.cells) : cell.value;
          const isNum = typeof val === 'number' || (!isNaN(Number(val)) && val !== '' && typeof val !== 'boolean');
          const type = isNum ? 'Number' : 'String';
          const cleanVal = isNum ? Number(val) : String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          
          let styleAttr = '';
          if (r === 1 || cell.bold) styleAttr = ' ss:StyleID="sHeader"';
          else if (cell.format === 'currency') styleAttr = ' ss:StyleID="sCurrency"';
          else if (cell.format === 'percent') styleAttr = ' ss:StyleID="sPercent"';

          xml += `    <Cell${styleAttr}><Data ss:Type="${type}">${cleanVal}</Data></Cell>\n`;
        }
      }
      xml += `   </Row>\n`;
    }

    xml += `  </Table>\n </Worksheet>\n`;
  });

  xml += `</Workbook>`;
  return xml;
}

