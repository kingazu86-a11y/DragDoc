/**
 * Professional Vector Chart Component for DragDocs
 */

import React from 'react';
import { useDocument } from '../../context/DocumentContext';

export function ChartView({ block }) {
  const { deleteBlock, updateBlock } = useDocument();
  const labels = block.labels || ['Q1', 'Q2', 'Q3', 'Q4'];
  const datasets = block.datasets || [{ name: 'Series 1', data: [50, 75, 90, 60], color: '#185abd' }];

  const maxValue = Math.max(...datasets.flatMap(d => d.data), 100);

  return (
    <div className="chart-block-wrapper">
      <div className="chart-header">
        <input
          type="text"
          className="chart-title-input"
          value={block.title || 'Chart Title'}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        />
        <div className="chart-header-actions">
          <span className="chart-type-tag">{block.chartType?.toUpperCase() || 'BAR'}</span>
          <button className="chart-del-btn" onClick={() => deleteBlock(block.id)} title="Delete Chart">×</button>
        </div>
      </div>

      <div className="chart-body-svg">
        <svg viewBox="0 0 500 200" className="chart-svg-element">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="40" y1="155" x2="480" y2="155" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Bars */}
          {labels.map((lbl, lIdx) => {
            const groupWidth = 380 / labels.length;
            const groupX = 60 + lIdx * groupWidth;

            return (
              <g key={lbl}>
                {datasets.map((ds, dIdx) => {
                  const barWidth = Math.max(14, (groupWidth - 20) / datasets.length);
                  const barHeight = ((ds.data[lIdx] || 0) / maxValue) * 125;
                  const barX = groupX + dIdx * (barWidth + 4);
                  const barY = 155 - barHeight;

                  return (
                    <g key={dIdx}>
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={ds.color}
                        rx="2"
                      />
                      <text
                        x={barX + barWidth / 2}
                        y={barY - 4}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#64748b"
                      >
                        {ds.data[lIdx]}
                      </text>
                    </g>
                  );
                })}

                {/* X axis label */}
                <text
                  x={groupX + groupWidth / 3}
                  y="175"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#475569"
                >
                  {lbl}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        {datasets.map((ds, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color-dot" style={{ backgroundColor: ds.color }} />
            <span className="legend-name">{ds.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

