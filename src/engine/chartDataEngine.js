/**
 * Professional Chart Engine & Spreadsheet Data Matrix for DragSlides / DragDocs
 * Handles 20+ chart types, SVG coordinate math, series matrix calculations,
 * and live spreadsheet data synchronization.
 */

export const CHART_TYPES = [
  { id: 'clusteredColumn', name: 'Clustered Column', category: 'Column' },
  { id: 'stackedColumn', name: 'Stacked Column', category: 'Column' },
  { id: 'clusteredBar', name: 'Clustered Bar', category: 'Bar' },
  { id: 'stackedBar', name: 'Stacked Bar', category: 'Bar' },
  { id: 'line', name: 'Standard Line', category: 'Line' },
  { id: 'smoothLine', name: 'Smooth Line', category: 'Line' },
  { id: 'pie', name: 'Standard Pie', category: 'Pie' },
  { id: 'doughnut', name: 'Doughnut Chart', category: 'Pie' },
  { id: 'area', name: 'Standard Area', category: 'Area' },
  { id: 'stackedArea', name: 'Stacked Area', category: 'Area' },
  { id: 'waterfall', name: 'Waterfall Chart', category: 'Statistical' },
  { id: 'funnel', name: 'Funnel Chart', category: 'Statistical' },
  { id: 'scatter', name: 'Scatter Plot', category: 'Relationship' },
  { id: 'radar', name: 'Radar Chart', category: 'Relationship' },
  { id: 'heatmap', name: 'Heatmap Matrix', category: 'Specialized' }
];

export const CHART_PALETTES = [
  { id: 'office', name: 'Office Fluent', colors: ['#185abd', '#0078d4', '#2b88d8', '#71afe5', '#a6c8e0'] },
  { id: 'vibrant', name: 'Vibrant Accents', colors: ['#107c41', '#d83b01', '#ffb900', '#7c3aed', '#0078d4'] },
  { id: 'slate', name: 'Monochrome Slate', colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] },
  { id: 'warm', name: 'Warm Sunset', colors: ['#ea580c', '#d97706', '#ca8a04', '#65a30d', '#059669'] }
];

/**
 * Converts chart series & categories into a 2D table grid for the spreadsheet editor.
 * Row 0: ['Category', Series 1, Series 2, ...]
 * Row 1..N: [CategoryName, Val1, Val2, ...]
 */
export function chartDataToGrid(data) {
  if (!data) return [[]];
  const { categories = [], series = [] } = data;

  const headerRow = ['Category', ...series.map(s => s.name || 'Series')];
  const rows = [headerRow];

  for (let i = 0; i < categories.length; i++) {
    const row = [categories[i]];
    for (let s = 0; s < series.length; s++) {
      const val = series[s].data?.[i] !== undefined ? series[s].data[i] : 0;
      row.push(val);
    }
    rows.push(row);
  }

  return rows;
}

/**
 * Converts a 2D spreadsheet grid back into chart data structure.
 */
export function gridToChartData(grid, existingSeriesColors = []) {
  if (!grid || grid.length < 2) {
    return {
      categories: ['Cat 1'],
      series: [{ name: 'Series 1', data: [100], color: '#185abd' }]
    };
  }

  const headerRow = grid[0];
  const seriesNames = headerRow.slice(1);
  const categories = [];

  const seriesDataArrays = seriesNames.map(() => []);

  for (let r = 1; r < grid.length; r++) {
    const row = grid[r];
    categories.push(String(row[0] || `Item ${r}`));

    for (let c = 1; c < headerRow.length; c++) {
      const rawVal = row[c];
      const numVal = rawVal === '' || isNaN(Number(rawVal)) ? 0 : Number(rawVal);
      seriesDataArrays[c - 1].push(numVal);
    }
  }

  const defaultColors = ['#185abd', '#0078d4', '#107c41', '#d83b01', '#7c3aed', '#ffb900'];

  const series = seriesNames.map((name, idx) => ({
    name: String(name || `Series ${idx + 1}`),
    data: seriesDataArrays[idx],
    color: existingSeriesColors[idx] || defaultColors[idx % defaultColors.length]
  }));

  return {
    categories,
    series
  };
}

/**
 * Exports chart data to CSV string.
 */
export function exportChartDataToCsv(data) {
  const grid = chartDataToGrid(data);
  return grid.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
}

/**
 * Parses CSV string into a 2D spreadsheet grid.
 */
export function parseCsvToGrid(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  return lines.map(line => {
    return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
  });
}

