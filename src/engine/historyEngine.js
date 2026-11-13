/**
 * Undo and Redo History Engine for DragDocs Word Processor
 */

const MAX_HISTORY_STEPS = 50;

export class HistoryEngine {
  constructor(initialState) {
    this.past = [];
    this.future = [];
    this.current = initialState ? JSON.parse(JSON.stringify(initialState)) : null;
  }

  push(newState) {
    if (!newState) return;
    if (this.current) {
      this.past.push(this.current);
      if (this.past.length > MAX_HISTORY_STEPS) {
        this.past.shift();
      }
    }
    this.current = JSON.parse(JSON.stringify(newState));
    this.future = []; // clear redo stack on new action
  }

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo() {
    if (!this.canUndo()) return null;
    const previous = this.past.pop();
    this.future.unshift(this.current);
    this.current = previous;
    return JSON.parse(JSON.stringify(previous));
  }

  redo() {
    if (!this.canRedo()) return null;
    const next = this.future.shift();
    this.past.push(this.current);
    this.current = next;
    return JSON.parse(JSON.stringify(next));
  }

  clear() {
    this.past = [];
    this.future = [];
  }
}

