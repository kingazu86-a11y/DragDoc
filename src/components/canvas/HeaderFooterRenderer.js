/**
 * Header and Footer Renderer for Physical Pages
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';

export function PageHeader({ pageNumber, totalPages, isFirstPage }) {
  const { document, setDocument } = useDocument();
  const headerConfig = document.pageSetup?.header || {};

  if (isFirstPage && !headerConfig.showOnFirstPage && !headerConfig.text) {
    return <div className="page-header-container empty" />;
  }

  const handleTextChange = (e) => {
    const text = e.target.innerText;
    setDocument(doc => ({
      ...doc,
      pageSetup: {
        ...(doc.pageSetup || {}),
        header: {
          ...(doc.pageSetup?.header || {}),
          text
        }
      }
    }));
  };

  return (
    <div className={`page-header-container align-${headerConfig.align || 'right'}`}>
      <div
        className="page-header-content"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTextChange}
        title="Header: Double click to edit"
      >
        {headerConfig.text || document.title || ''}
      </div>
    </div>
  );
}

export function PageFooter({ pageNumber, totalPages, isFirstPage }) {
  const { document } = useDocument();
  const footerConfig = document.pageSetup?.footer || { showPageNumber: true, align: 'center' };

  let pageNumStr = `${pageNumber}`;
  if (footerConfig.format === 'Page {page} of {total}') {
    pageNumStr = `Page ${pageNumber} of ${totalPages}`;
  }

  return (
    <div className={`page-footer-container align-${footerConfig.align || 'center'}`}>
      <div className="page-footer-content">
        {footerConfig.text && <span>{footerConfig.text} — </span>}
        {footerConfig.showPageNumber !== false && (
          <span className="page-number-pill">{pageNumStr}</span>
        )}
      </div>
    </div>
  );
}
