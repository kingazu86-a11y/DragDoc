/**
 * Mail Merge Engine for DragDocs Word Processor
 * Handles recipient data management, CSV parsing, field merging,
 * dynamic preview interpolation, and batch document generation.
 */

export const SAMPLE_RECIPIENTS = [
  { FirstName: 'Alexander', LastName: 'Wright', Company: 'Apex Global', Address: '123 Market St', City: 'Seattle', State: 'WA', Zip: '98101', Email: 'alex@apex.example' },
  { FirstName: 'Elena', LastName: 'Rostova', Company: 'Vanguard Systems', Address: '456 Tech Parkway', City: 'Austin', State: 'TX', Zip: '73301', Email: 'elena@vanguard.example' },
  { FirstName: 'Marcus', LastName: 'Chen', Company: 'Horizon Dynamics', Address: '789 Innovation Ave', City: 'Boston', State: 'MA', Zip: '02110', Email: 'marcus@horizon.example' },
  { FirstName: 'Sophia', LastName: 'Patel', Company: 'Nexus Corp', Address: '321 Bay St', City: 'San Francisco', State: 'CA', Zip: '94105', Email: 'sophia@nexus.example' },
  { FirstName: 'David', LastName: 'Kim', Company: 'Solaria Technologies', Address: '555 River Road', City: 'Chicago', State: 'IL', Zip: '60601', Email: 'david@solaria.example' }
];

export const STANDARD_MERGE_FIELDS = [
  'FirstName',
  'LastName',
  'Company',
  'Address',
  'City',
  'State',
  'Zip',
  'Email'
];

/**
 * Parses CSV text into an array of recipient objects.
 */
export function parseCsvRecipients(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const recipients = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length >= headers.length) {
      const recipient = {};
      headers.forEach((header, idx) => {
        recipient[header] = values[idx] || '';
      });
      recipients.push(recipient);
    }
  }

  return recipients;
}

/**
 * Replaces «FieldName» tokens in text with values from active recipient.
 */
export function interpolateMergeFields(text, recipient = {}) {
  if (!text) return '';
  return text.replace(/«([A-Za-z0-9_]+)»/g, (match, fieldName) => {
    return recipient[fieldName] !== undefined ? recipient[fieldName] : match;
  });
}

/**
 * Clones a document block tree, interpolating merge tokens for a specific recipient.
 */
export function applyMailMergeToDocument(document, recipientIndex = 0) {
  const recipients = document.mailMerge?.recipients || SAMPLE_RECIPIENTS;
  const recipient = recipients[recipientIndex] || recipients[0] || {};

  const mergedBlocks = (document.blocks || []).map(block => {
    if (block.textRuns && Array.isArray(block.textRuns)) {
      const mergedRuns = block.textRuns.map(run => ({
        ...run,
        text: interpolateMergeFields(run.text, recipient)
      }));
      return { ...block, textRuns: mergedRuns };
    }
    return block;
  });

  return {
    ...document,
    blocks: mergedBlocks
  };
}

/**
 * Performs batch mail merge, generating an array of documents for each recipient.
 */
export function generateBatchDocuments(document) {
  const recipients = document.mailMerge?.recipients || SAMPLE_RECIPIENTS;
  return recipients.map((recipient, idx) => {
    const mergedDoc = applyMailMergeToDocument(document, idx);
    mergedDoc.title = `${document.title} - ${recipient.FirstName || ''} ${recipient.LastName || `Record ${idx + 1}`}`;
    return mergedDoc;
  });
}

