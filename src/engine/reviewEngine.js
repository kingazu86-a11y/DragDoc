/**
 * Review, Proofing, Thesaurus, and Statistics Engine for DragDocs Word Processor
 */

import { getBlockPlainText } from './paginationEngine';

export const COMMON_TYPOS = {
  'teh': 'the',
  'recieve': 'receive',
  'seperate': 'separate',
  'definately': 'definitely',
  'occured': 'occurred',
  'untill': 'until',
  'goverment': 'government',
  'accomodate': 'accommodate',
  'wich': 'which',
  'thier': 'their',
  'truely': 'truly',
  'beleive': 'believe',
  'adress': 'address',
  'enviroment': 'environment',
  'neccessary': 'necessary',
  'succesful': 'successful',
  'tommorow': 'tomorrow',
  'writting': 'writing',
  'experiance': 'experience',
  'guarentee': 'guarantee'
};

export const THESAURUS_DICTIONARY = {
  'good': ['excellent', 'superior', 'commendable', 'exceptional', 'favorable', 'beneficial'],
  'bad': ['substandard', 'deficient', 'adverse', 'unfavorable', 'defective'],
  'make': ['construct', 'formulate', 'produce', 'synthesize', 'fabricate', 'establish'],
  'show': ['demonstrate', 'illustrate', 'exhibit', 'reveal', 'manifest', 'depict'],
  'big': ['substantial', 'extensive', 'monumental', 'comprehensive', 'prominent'],
  'important': ['vital', 'critical', 'pivotal', 'crucial', 'essential', 'paramount'],
  'problem': ['impediment', 'dilemma', 'complication', 'adversity', 'challenge'],
  'change': ['transform', 'modify', 'adapt', 'transition', 'revolutionize'],
  'help': ['facilitate', 'assist', 'expedite', 'support', 'advance'],
  'fast': ['accelerated', 'rapid', 'swift', 'expeditious', 'high-speed'],
  'new': ['innovative', 'novel', 'contemporary', 'unprecedented', 'state-of-the-art'],
  'lead': ['spearhead', 'orchestrate', 'direct', 'guide', 'pioneer'],
  'system': ['architecture', 'framework', 'infrastructure', 'platform', 'mechanism']
};

/**
 * Calculates comprehensive document statistics.
 */
export function calculateDocumentStats(document, totalPages = 1) {
  let totalWords = 0;
  let totalCharsWithSpaces = 0;
  let totalCharsNoSpaces = 0;
  let totalParagraphs = 0;
  let totalSentences = 0;

  for (const block of document.blocks || []) {
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
      const text = getBlockPlainText(block);
      if (text.trim().length > 0) {
        totalParagraphs++;
        totalCharsWithSpaces += text.length;
        totalCharsNoSpaces += text.replace(/\s+/g, '').length;

        const words = text.trim().split(/\s+/).filter(Boolean);
        totalWords += words.length;

        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        totalSentences += sentences.length;
      }
    } else if (block.type === 'table') {
      for (const row of block.rows || []) {
        for (const cell of row.cells || []) {
          for (const cBlock of cell.content || []) {
            const text = getBlockPlainText(cBlock);
            if (text.trim().length > 0) {
              totalWords += text.trim().split(/\s+/).filter(Boolean).length;
              totalCharsWithSpaces += text.length;
              totalCharsNoSpaces += text.replace(/\s+/g, '').length;
            }
          }
        }
      }
    }
  }

  // Reading time: 220 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 220));
  // Speaking time: 130 words per minute
  const speakingTimeMinutes = Math.max(1, Math.ceil(totalWords / 130));

  return {
    words: totalWords,
    characters: totalCharsWithSpaces,
    charactersNoSpaces: totalCharsNoSpaces,
    paragraphs: totalParagraphs,
    sentences: totalSentences,
    pages: totalPages,
    readingTime: `${readingTimeMinutes} min`,
    speakingTime: `${speakingTimeMinutes} min`
  };
}

/**
 * Analyzes document for spelling errors, grammatical concerns, and style improvements.
 */
export function analyzeDocumentProofing(document) {
  const issues = [];

  (document.blocks || []).forEach((block, blockIdx) => {
    if (block.type !== 'paragraph' && block.type !== 'heading') return;

    const text = getBlockPlainText(block);
    if (!text.trim()) return;

    // 1. Check for known typos
    const wordsWithPunct = text.split(/\s+/);
    wordsWithPunct.forEach((rawWord, wIdx) => {
      const cleanWord = rawWord.toLowerCase().replace(/[^a-z]/g, '');
      if (COMMON_TYPOS[cleanWord]) {
        issues.push({
          id: `typo_${block.id}_${wIdx}`,
          type: 'spelling',
          blockId: block.id,
          original: rawWord,
          suggestion: COMMON_TYPOS[cleanWord],
          message: `Possible spelling error. Did you mean "${COMMON_TYPOS[cleanWord]}"?`
        });
      }
    });

    // 2. Check for repeated duplicate words (e.g. "the the")
    const dupRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
    let dupMatch;
    while ((dupMatch = dupRegex.exec(text)) !== null) {
      issues.push({
        id: `dup_${block.id}_${dupMatch.index}`,
        type: 'grammar',
        blockId: block.id,
        original: dupMatch[0],
        suggestion: dupMatch[1],
        message: `Repeated word "${dupMatch[1]}". Consider removing duplicate.`
      });
    }

    // 3. Check for passive voice patterns (e.g., "was developed by", "is performed by")
    const passiveRegex = /\b(is|was|were|are|been)\s+([a-zA-Z]+ed)\s+(by)\b/gi;
    let passiveMatch;
    while ((passiveMatch = passiveRegex.exec(text)) !== null) {
      issues.push({
        id: `passive_${block.id}_${passiveMatch.index}`,
        type: 'style',
        blockId: block.id,
        original: passiveMatch[0],
        suggestion: null,
        message: `Passive voice detected: "${passiveMatch[0]}". Consider active voice for clearer phrasing.`
      });
    }

    // 4. Space before punctuation (e.g. "word , next")
    const punctSpaceRegex = /\s+([,.:;?!])/g;
    let punctMatch;
    while ((punctMatch = punctSpaceRegex.exec(text)) !== null) {
      issues.push({
        id: `punct_${block.id}_${punctMatch.index}`,
        type: 'punctuation',
        blockId: block.id,
        original: punctMatch[0],
        suggestion: punctMatch[1],
        message: `Extra space before punctuation: "${punctMatch[0]}".`
      });
    }
  });

  return issues;
}

