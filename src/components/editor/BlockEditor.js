/**
 * Block Editor Component
 * Renders individual document blocks (Paragraphs, Headings, Tables, Images, Quotes, TOC)
 * inside physical page sheets with inline editing, selection, and formatting marks.
 */

import React, { useRef } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { TableView } from './TableView';
import { ImageView } from './ImageView';
import { DiagramView } from './DiagramView';
import { ChartView } from './ChartView';
import { getBlockPlainText } from '../../engine/paginationEngine';
import { createParagraphBlock } from '../../engine/documentModel';

export function BlockEditor({ block, pageIndex }) {
  const {
    selectedBlockId,
    setSelectedBlockId,
    updateBlock,
    insertBlock,
    deleteBlock,
    showFormattingMarks
  } = useDocument();

  const blockRef = useRef(null);
  const isSelected = selectedBlockId === block.id;

  const handleFocus = () => {
    setSelectedBlockId(block.id);
  };

  const handleTextChange = (e) => {
    const rawText = e.target.innerText;
    // preserve formatting on text runs
    const existingRun = block.textRuns?.[0] || {};
    updateBlock(block.id, {
      textRuns: [{
        ...existingRun,
        text: rawText
      }]
    });
  };

  const handleKeyDown = (e) => {
    // Enter key creates a new paragraph block after current
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'paragraph' || block.type === 'heading') {
        e.preventDefault();
        const newBlock = createParagraphBlock('');
        insertBlock(newBlock, block.id);
        setSelectedBlockId(newBlock.id);
      }
    }

    // Backspace on empty paragraph deletes it
    if (e.key === 'Backspace') {
      const text = getBlockPlainText(block);
      if (text.length === 0 && block.type === 'paragraph') {
        e.preventDefault();
        deleteBlock(block.id);
      }
    }
  };

  // 1. Table
  if (block.type === 'table') {
    return <TableView block={block} />;
  }

  // 2. Image
  if (block.type === 'image') {
    return <ImageView block={block} />;
  }

  // 3. Diagram
  if (block.type === 'diagram') {
    return <DiagramView block={block} />;
  }

  // 4. Chart
  if (block.type === 'chart') {
    return <ChartView block={block} />;
  }

  // 5. Page Break / Section Break indicator
  if (block.type === 'pageBreak' || block.type === 'sectionBreak') {
    return (
      <div className="break-block-indicator">
        <span className="break-label">{block.type === 'pageBreak' ? '•••••• Page Break ••••••' : `•••••• Section Break (${block.sectionType || 'Next Page'}) ••••••`}</span>
      </div>
    );
  }

  // 6. Table of Contents
  if (block.type === 'toc') {
    return (
      <div className="toc-block-card">
        <div className="toc-title">{block.title || 'Table of Contents'}</div>
        <div className="toc-items-list">
          <div className="toc-row">
            <span className="toc-item-title">1. Executive Summary</span>
            <span className="toc-dots">....................................................................</span>
            <span className="toc-page-num">1</span>
          </div>
          <div className="toc-row">
            <span className="toc-item-title">2. Key Performance Indicators</span>
            <span className="toc-dots">....................................................................</span>
            <span className="toc-page-num">1</span>
          </div>
          <div className="toc-row">
            <span className="toc-item-title">3. Strategic Milestone Trajectory</span>
            <span className="toc-dots">....................................................................</span>
            <span className="toc-page-num">2</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. Pull Quote
  if (block.type === 'quote') {
    const text = getBlockPlainText(block);
    return (
      <blockquote
        className="dragdocs-quote"
        style={{
          borderLeftColor: block.borderLeftColor || '#185abd',
          backgroundColor: block.backgroundColor || '#f9fafb'
        }}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={handleFocus}
          onBlur={handleTextChange}
          className="quote-body"
        >
          {text}
        </div>
        {block.author && (
          <div className="quote-author">— {block.author}</div>
        )}
      </blockquote>
    );
  }

  // 8. Paragraph / Heading
  const isHeading = block.type === 'heading';
  const textRuns = block.textRuns || [{ text: '' }];

  const blockStyle = {
    textAlign: block.align || 'left',
    marginTop: `${block.spacingBefore || (isHeading ? 12 : 0)}px`,
    marginBottom: `${block.spacingAfter || (isHeading ? 6 : 6)}px`,
    lineHeight: block.lineSpacing || 1.15,
    paddingLeft: `${block.indentLeft || 0}px`,
    paddingRight: `${block.indentRight || 0}px`,
    textIndent: `${block.firstLineIndent || 0}px`,
    direction: block.dir || 'ltr'
  };

  return (
    <div
      ref={blockRef}
      className={`dragdocs-block ${isHeading ? `heading-block level-${block.level || 1}` : 'paragraph-block'} ${isSelected ? 'active-block' : ''}`}
      style={blockStyle}
      onClick={handleFocus}
    >
      {/* Bullet / Number indicator */}
      {block.listType === 'bullet' && <span className="list-marker bullet-marker">•</span>}
      {block.listType === 'number' && <span className="list-marker number-marker">1.</span>}

      <div
        className="block-editable-content"
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleTextChange}
        onKeyDown={handleKeyDown}
      >
        {textRuns.map((run, rIdx) => {
          const runStyle = {
            fontWeight: run.bold ? 'bold' : 'normal',
            fontStyle: run.italic ? 'italic' : 'normal',
            textDecoration: run.underline
              ? (run.doubleUnderline ? 'underline double' : 'underline')
              : (run.strikethrough ? 'line-through' : 'none'),
            color: run.fontColor || '#1f2937',
            backgroundColor: run.highlight || 'transparent',
            fontSize: `${run.fontSize || (isHeading ? 18 : 11)}pt`,
            fontFamily: run.fontFamily || (isHeading ? 'Calibri, sans-serif' : 'Calibri, sans-serif'),
            letterSpacing: run.letterSpacing ? `${run.letterSpacing}px` : 'normal',
            verticalAlign: run.superscript ? 'super' : run.subscript ? 'sub' : 'baseline'
          };

          return (
            <span key={run.id || rIdx} style={runStyle} className={run.link ? 'doc-link-run' : ''}>
              {run.text}
            </span>
          );
        })}
      </div>

      {/* Formatting Marks (¶) */}
      {showFormattingMarks && <span className="pilcrow-mark" aria-hidden="true">¶</span>}
    </div>
  );
}
