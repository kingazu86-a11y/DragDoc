/**
 * AI Writing Assistant Sidebar (Copilot)
 * Modular provider support with explicit preview and user confirmation before modification.
 */

import React, { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { processAiRequest, AI_PROVIDERS, AI_TONES } from '../../engine/aiAssistant';
import { getBlockPlainText } from '../../engine/paginationEngine';
import { createParagraphBlock } from '../../engine/documentModel';
import { IconAiSparkle, IconClose } from '../common/SvgIcons';

export function AiAssistantSidebar() {
  const {
    document,
    activeSidebar,
    setActiveSidebar,
    selectedBlockId,
    updateBlock,
    insertBlock
  } = useDocument();

  const [provider, setProvider] = useState(AI_PROVIDERS.LOCAL);
  const [apiKey, setApiKey] = useState('');
  const [tone, setTone] = useState('professional');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [action, setAction] = useState('rewrite');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  if (activeSidebar !== 'ai') return null;

  const activeBlock = (document.blocks || []).find(b => b.id === selectedBlockId);
  const selectedText = activeBlock ? getBlockPlainText(activeBlock) : '';

  const handleGenerate = async (selectedAction = action) => {
    setIsLoading(true);
    setAiResult('');
    try {
      const output = await processAiRequest({
        action: selectedAction,
        text: selectedText || document.title || 'Executive Project Initiative',
        context: `Document title: ${document.title}`,
        tone,
        targetLanguage: targetLang,
        apiKey,
        provider
      });
      setAiResult(output);
    } catch (err) {
      setAiResult('Error generating AI response: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyReplace = () => {
    if (!aiResult || !selectedBlockId) return;
    updateBlock(selectedBlockId, {
      textRuns: [{
        ...(activeBlock?.textRuns?.[0] || {}),
        text: aiResult
      }]
    });
    setAiResult('');
  };

  const handleApplyInsertBelow = () => {
    if (!aiResult) return;
    const newBlock = createParagraphBlock(aiResult);
    insertBlock(newBlock, selectedBlockId);
    setAiResult('');
  };

  return (
    <div className="dragdocs-sidebar ai-sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconAiSparkle size={18} color="#185abd" />
          <span className="sidebar-title">AI Assistant</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setActiveSidebar(null)}
          title="Close AI Assistant"
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* Provider settings */}
        <div className="ai-config-section">
          <label className="ai-label">AI Engine Provider:</label>
          <select
            className="ai-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value={AI_PROVIDERS.LOCAL}>Built-in Offline Engine (Zero Latency)</option>
            <option value={AI_PROVIDERS.GEMINI}>Google Gemini API</option>
            <option value={AI_PROVIDERS.OPENAI}>OpenAI API</option>
          </select>

          {provider !== AI_PROVIDERS.LOCAL && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="password"
                className="ai-input"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Action presets buttons */}
        <div className="ai-actions-grid">
          <button
            className={`ai-action-chip ${action === 'rewrite' ? 'active' : ''}`}
            onClick={() => {
              setAction('rewrite');
              handleGenerate('rewrite');
            }}
          >
            Rewrite Text
          </button>

          <button
            className={`ai-action-chip ${action === 'grammar' ? 'active' : ''}`}
            onClick={() => {
              setAction('grammar');
              handleGenerate('grammar');
            }}
          >
            Fix Grammar
          </button>

          <button
            className={`ai-action-chip ${action === 'summarize' ? 'active' : ''}`}
            onClick={() => {
              setAction('summarize');
              handleGenerate('summarize');
            }}
          >
            Summarize
          </button>

          <button
            className={`ai-action-chip ${action === 'expand' ? 'active' : ''}`}
            onClick={() => {
              setAction('expand');
              handleGenerate('expand');
            }}
          >
            Expand
          </button>

          <button
            className={`ai-action-chip ${action === 'simplify' ? 'active' : ''}`}
            onClick={() => {
              setAction('simplify');
              handleGenerate('simplify');
            }}
          >
            Simplify
          </button>

          <button
            className={`ai-action-chip ${action === 'outline' ? 'active' : ''}`}
            onClick={() => {
              setAction('outline');
              handleGenerate('outline');
            }}
          >
            Draft Outline
          </button>

          <button
            className={`ai-action-chip ${action === 'letter' ? 'active' : ''}`}
            onClick={() => {
              setAction('letter');
              handleGenerate('letter');
            }}
          >
            Formal Letter
          </button>

          <button
            className={`ai-action-chip ${action === 'translate' ? 'active' : ''}`}
            onClick={() => {
              setAction('translate');
              handleGenerate('translate');
            }}
          >
            Translate
          </button>
        </div>

        {/* Tone selector */}
        <div style={{ marginTop: '12px' }}>
          <label className="ai-label">Target Tone:</label>
          <select
            className="ai-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {AI_TONES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Translation Language */}
        {action === 'translate' && (
          <div style={{ marginTop: '8px' }}>
            <label className="ai-label">Target Language:</label>
            <select
              className="ai-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Urdu">Urdu (اردو)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Chinese">Chinese (Mandarin)</option>
            </select>
          </div>
        )}

        {/* Generate Button */}
        <button
          className="ai-generate-main-btn"
          disabled={isLoading}
          onClick={() => handleGenerate()}
        >
          {isLoading ? 'Generating Analysis...' : 'Generate with Copilot'}
        </button>

        {/* AI Result Preview Card */}
        {aiResult && (
          <div className="ai-result-preview-card">
            <div className="preview-card-header">
              <span className="preview-card-title">Copilot Suggestion</span>
            </div>
            <div className="preview-card-text">{aiResult}</div>
            <div className="preview-card-actions">
              <button className="preview-btn primary" onClick={handleApplyReplace}>
                Replace Selection
              </button>
              <button className="preview-btn" onClick={handleApplyInsertBelow}>
                Insert Below
              </button>
              <button className="preview-btn text-danger" onClick={() => setAiResult('')}>
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

