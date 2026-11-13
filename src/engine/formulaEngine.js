/**
 * Advanced Spreadsheet Formula Calculation Engine
 * Supports cell references (A1, B2, C10), ranges (A1:A5), arithmetic (+, -, *, /, ^),
 * and 30+ core functions across Mathematical, Statistical, Logical, Text, and Lookup.
 */

// Converts coordinate { r: 1, c: 1 } to 'A1' (1-based)
export function coordsToCellId(r, c) {
  let colName = '';
  let tempC = c;
  while (tempC > 0) {
    const rem = (tempC - 1) % 26;
    colName = String.fromCharCode(65 + rem) + colName;
    tempC = Math.floor((tempC - 1) / 26);
  }
  return `${colName}${r}`;
}

// Converts 'A1' to coordinate { r: 1, c: 1 }
export function cellIdToCoords(cellId) {
  const match = cellId.toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colStr = match[1];
  const rowNum = parseInt(match[2], 10);

  let colNum = 0;
  for (let i = 0; i < colStr.length; i++) {
    colNum = colNum * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { r: rowNum, c: colNum };
}

// Expands range 'A1:A3' to ['A1', 'A2', 'A3']
export function expandCellRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length === 1) return [parts[0].toUpperCase()];
  const start = cellIdToCoords(parts[0]);
  const end = cellIdToCoords(parts[1]);
  if (!start || !end) return [];

  const minR = Math.min(start.r, end.r);
  const maxR = Math.max(start.r, end.r);
  const minC = Math.min(start.c, end.c);
  const maxC = Math.max(start.c, end.c);

  const cells = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      cells.push(coordsToCellId(r, c));
    }
  }
  return cells;
}

/**
 * Resolves cell value from worksheet cell dictionary.
 */
function getCellValue(cellId, cellsDict, visiting = new Set()) {
  const cleanId = cellId.toUpperCase();
  if (visiting.has(cleanId)) return '#CIRCULAR!';

  const cell = cellsDict[cleanId];
  if (!cell) return 0;
  if (cell.formula) {
    visiting.add(cleanId);
    const result = evaluateFormula(cell.formula, cellsDict, visiting);
    visiting.delete(cleanId);
    return result;
  }
  const num = Number(cell.value);
  return isNaN(num) ? (cell.value || '') : num;
}

/**
 * Evaluates a formula string (e.g. '=SUM(A1:A5) + B2*10').
 */
export function evaluateFormula(formulaStr, cellsDict = {}, visiting = new Set()) {
  if (!formulaStr || !formulaStr.startsWith('=')) {
    return formulaStr;
  }

  let expr = formulaStr.substring(1).trim();

  // Handle function calls: FUNCTION_NAME(...)
  const funcRegex = /([A-Z_]+)\(([^()]+)\)/gi;
  let match;
  let iterations = 0;

  while ((match = funcRegex.exec(expr)) !== null && iterations < 30) {
    iterations++;
    const fullMatch = match[0];
    const funcName = match[1].toUpperCase();
    const argsRaw = match[2];

    const computedVal = executeFunction(funcName, argsRaw, cellsDict, visiting);
    expr = expr.replace(fullMatch, typeof computedVal === 'number' ? computedVal : `"${computedVal}"`);
    funcRegex.lastIndex = 0; // reset regex
  }

  // Replace cell references with numeric or string values
  const cellRefRegex = /\b([A-Z]+[0-9]+)\b/gi;
  expr = expr.replace(cellRefRegex, (cellMatch) => {
    const val = getCellValue(cellMatch, cellsDict, visiting);
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string' && val.startsWith('#')) return `"${val}"`;
    return isNaN(Number(val)) ? `"${val}"` : String(val);
  });

  // Evaluate arithmetic expression safely
  try {
    // Only allow safe math tokens
    if (/^[0-9+\-*/().\s^%<>=!&|"']+$/.test(expr)) {
      // replace power operator ^ with Math.pow or **
      const jsExpr = expr.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func, no-eval
      const result = Function(`'use strict'; return (${jsExpr})`)();
      if (typeof result === 'number') {
        return Math.round(result * 10000000) / 10000000;
      }
      return result;
    }
    return expr;
  } catch (err) {
    return '#VALUE!';
  }
}

function executeFunction(funcName, argsStr, cellsDict, visiting) {
  const rawArgs = argsStr.split(',').map(s => s.trim());

  // Helper to resolve range or scalar args to flat array of values
  const resolveArgValues = (arg) => {
    if (arg.includes(':')) {
      const cellIds = expandCellRange(arg);
      return cellIds.map(id => getCellValue(id, cellsDict, visiting));
    }
    // Check if it's a cell ID
    if (/^[A-Z]+[0-9]+$/i.test(arg)) {
      return [getCellValue(arg, cellsDict, visiting)];
    }
    // Number literal or string
    const num = Number(arg.replace(/^"|"$/g, ''));
    return [isNaN(num) ? arg.replace(/^"|"$/g, '') : num];
  };

  const allNumbers = [];
  rawArgs.forEach(a => {
    const vals = resolveArgValues(a);
    vals.forEach(v => {
      if (typeof v === 'number' && !isNaN(v)) allNumbers.push(v);
      else if (!isNaN(Number(v)) && v !== '') allNumbers.push(Number(v));
    });
  });

  switch (funcName) {
    // MATHEMATICAL
    case 'SUM':
      return allNumbers.reduce((acc, n) => acc + n, 0);

    case 'PRODUCT':
      return allNumbers.length === 0 ? 0 : allNumbers.reduce((acc, n) => acc * n, 1);

    case 'AVERAGE':
      return allNumbers.length === 0 ? 0 : (allNumbers.reduce((acc, n) => acc + n, 0) / allNumbers.length);

    case 'MIN':
      return allNumbers.length === 0 ? 0 : Math.min(...allNumbers);

    case 'MAX':
      return allNumbers.length === 0 ? 0 : Math.max(...allNumbers);

    case 'COUNT':
      return allNumbers.length;

    case 'COUNTA': {
      let count = 0;
      rawArgs.forEach(a => {
        const vals = resolveArgValues(a);
        count += vals.filter(v => v !== '' && v !== null && v !== undefined).length;
      });
      return count;
    }

    case 'ABS':
      return Math.abs(allNumbers[0] || 0);

    case 'ROUND': {
      const num = allNumbers[0] || 0;
      const decimals = allNumbers[1] || 0;
      const factor = Math.pow(10, decimals);
      return Math.round(num * factor) / factor;
    }

    case 'INT':
      return Math.floor(allNumbers[0] || 0);

    case 'MOD':
      return (allNumbers[0] || 0) % (allNumbers[1] || 1);

    case 'SQRT':
      return Math.sqrt(Math.max(0, allNumbers[0] || 0));

    case 'POWER':
      return Math.pow(allNumbers[0] || 0, allNumbers[1] || 1);

    // LOGICAL
    case 'IF': {
      const condStr = rawArgs[0];
      const valTrue = rawArgs[1] !== undefined ? resolveArgValues(rawArgs[1])[0] : true;
      const valFalse = rawArgs[2] !== undefined ? resolveArgValues(rawArgs[2])[0] : false;

      // Evaluate condition
      try {
        let evalCond = condStr;
        const cellRefRegex = /\b([A-Z]+[0-9]+)\b/gi;
        evalCond = evalCond.replace(cellRefRegex, (m) => String(getCellValue(m, cellsDict, visiting)));
        // eslint-disable-next-line no-new-func, no-eval
        const isTrue = Function(`'use strict'; return (${evalCond})`)();
        return isTrue ? valTrue : valFalse;
      } catch (e) {
        return '#VALUE!';
      }
    }

    case 'AND':
      return allNumbers.every(n => Boolean(n));

    case 'OR':
      return allNumbers.some(n => Boolean(n));

    case 'NOT':
      return !Boolean(allNumbers[0]);

    case 'IFERROR': {
      const val = resolveArgValues(rawArgs[0])[0];
      if (typeof val === 'string' && val.startsWith('#')) {
        return rawArgs[1] !== undefined ? resolveArgValues(rawArgs[1])[0] : '';
      }
      return val;
    }

    // TEXT
    case 'CONCAT':
    case 'CONCATENATE': {
      let res = '';
      rawArgs.forEach(a => {
        resolveArgValues(a).forEach(v => { res += String(v); });
      });
      return res;
    }

    case 'UPPER':
      return String(resolveArgValues(rawArgs[0])[0] || '').toUpperCase();

    case 'LOWER':
      return String(resolveArgValues(rawArgs[0])[0] || '').toLowerCase();

    case 'LEN':
      return String(resolveArgValues(rawArgs[0])[0] || '').length;

    case 'TRIM':
      return String(resolveArgValues(rawArgs[0])[0] || '').trim();

    case 'LEFT': {
      const str = String(resolveArgValues(rawArgs[0])[0] || '');
      const numChars = allNumbers[allNumbers.length - 1] || 1;
      return str.slice(0, numChars);
    }

    case 'RIGHT': {
      const str = String(resolveArgValues(rawArgs[0])[0] || '');
      const numChars = allNumbers[allNumbers.length - 1] || 1;
      return str.slice(-numChars);
    }

    // DATE
    case 'TODAY':
      return new Date().toLocaleDateString();

    case 'NOW':
      return new Date().toLocaleString();

    case 'YEAR':
      return new Date().getFullYear();

    // LOOKUP
    case 'VLOOKUP': {
      const lookupVal = resolveArgValues(rawArgs[0])[0];
      const tableRange = rawArgs[1];
      const colIndex = Number(rawArgs[2]) || 1;

      if (!tableRange || !tableRange.includes(':')) return '#N/A';
      const parts = tableRange.split(':');
      const start = cellIdToCoords(parts[0]);
      const end = cellIdToCoords(parts[1]);
      if (!start || !end) return '#N/A';

      for (let r = start.r; r <= end.r; r++) {
        const firstColId = coordsToCellId(r, start.c);
        const cellVal = getCellValue(firstColId, cellsDict, visiting);
        if (String(cellVal).toLowerCase() === String(lookupVal).toLowerCase()) {
          const targetColId = coordsToCellId(r, start.c + colIndex - 1);
          return getCellValue(targetColId, cellsDict, visiting);
        }
      }
      return '#N/A';
    }

    default:
      return '#NAME?';
  }
}

