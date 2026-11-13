/**
 * Full-Screen Slide Show Player for DragSlides / DragDocs
 * Interactive fullscreen presentation playback with slide transitions,
 * laser pointer, drawing pen, presenter notes, timer, black/white screens.
 */

import React, { useState, useEffect, useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';

export function SlideShowPlayer() {
  const {
    presentation,
    isSlideShow,
    slideShowIndex,
    exitSlideShow,
    nextSlide,
    prevSlide,
    slideShowLaser,
    setSlideShowLaser,
    blackScreen,
    setBlackScreen,
    whiteScreen,
    presenterNotesOpen,
    setPresenterNotesOpen
  } = usePresentation();

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef(null);

  const visibleSlides = (presentation.slides || []).filter(s => !s.hidden);
  const currentSlide = visibleSlides[slideShowIndex] || visibleSlides[0];

  // Timer counter
  useEffect(() => {
    if (!isSlideShow) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSlideShow]);

  // Handle laser pointer & hide controls on inactivity
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setControlsVisible(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  };

  if (!isSlideShow || !currentSlide) return null;

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      className="slideshow-player-overlay"
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        // If clicking on slide background, advance to next slide
        if (e.target.classList.contains('slideshow-screen') || e.target.classList.contains('slideshow-slide-sheet')) {
          nextSlide();
        }
      }}
    >
      {/* Black / White Screen Overlays */}
      {blackScreen && <div className="screen-blank black" />}
      {whiteScreen && <div className="screen-blank white" />}

      {/* Laser Pointer Dot */}
      {slideShowLaser && (
        <div
          className="laser-pointer-dot"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
        />
      )}

      {/* Main Slide Presentation Sheet */}
      <div className="slideshow-screen">
        <div
          className={`slideshow-slide-sheet transition-${currentSlide.transition?.type || 'fade'}`}
          style={{
            backgroundColor: currentSlide.background?.color || '#ffffff'
          }}
        >
          {/* Elements */}
          {(currentSlide.elements || []).map(el => {
            if (el.hidden) return null;

            return (
              <div
                key={el.id}
                className="slideshow-element"
                style={{
                  position: 'absolute',
                  left: `${(el.x / 960) * 100}%`,
                  top: `${(el.y / 540) * 100}%`,
                  width: `${(el.width / 960) * 100}%`,
                  height: `${(el.height / 540) * 100}%`,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  zIndex: el.zIndex || 1
                }}
              >
                {el.type === 'text' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      fontSize: `${el.fontSize || 24}px`,
                      fontFamily: el.fontFamily || 'Calibri, sans-serif',
                      fontWeight: el.fontWeight || 'normal',
                      fontStyle: el.fontStyle || 'normal',
                      color: el.color || '#1f2937',
                      textAlign: el.align || 'left',
                      lineHeight: el.lineSpacing || 1.2,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {el.text}
                  </div>
                )}

                {el.type === 'shape' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: el.fill || '#185abd',
                      border: `${el.strokeWidth || 1}px solid ${el.stroke || '#104f9f'}`,
                      borderRadius: el.shapeType === 'circle' ? '50%' : el.shapeType === 'roundRect' ? '12px' : '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: el.textColor || '#ffffff',
                      fontSize: `${el.fontSize || 16}px`,
                      textAlign: 'center'
                    }}
                  >
                    {el.text}
                  </div>
                )}

                {el.type === 'chart' && (
                  <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '4px', padding: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#185abd', marginBottom: '8px' }}>{el.title}</div>
                    <svg viewBox="0 0 500 220" style={{ width: '100%', height: 'calc(100% - 30px)' }}>
                      <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
                      {(el.data?.categories || ['Q1', 'Q2', 'Q3', 'Q4']).map((cat, cIdx) => {
                        const groupWidth = 420 / (el.data?.categories?.length || 4);
                        const gx = 50 + cIdx * groupWidth;
                        const seriesList = el.data?.series || [{ data: [100, 150, 180, 220], color: '#185abd' }];

                        return (
                          <g key={cat}>
                            {seriesList.map((s, sIdx) => {
                              const barW = Math.max(14, (groupWidth - 24) / seriesList.length);
                              const val = s.data?.[cIdx] || 0;
                              const barH = Math.min(150, (val / 300) * 150);
                              const bx = gx + sIdx * (barW + 4);
                              const by = 180 - barH;
                              return (
                                <g key={sIdx}>
                                  <rect x={bx} y={by} width={barW} height={barH} fill={s.color || '#185abd'} rx="2" />
                                  <text x={bx + barW / 2} y={by - 3} textAnchor="middle" fontSize="9" fill="#64748b">{val}</text>
                                </g>
                              );
                            })}
                            <text x={gx + groupWidth / 3} y="200" textAnchor="middle" fontSize="11" fill="#475569">{cat}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Presenter Control Dock */}
      <div className={`slideshow-dock ${controlsVisible ? 'visible' : 'hidden'}`}>
        <button className="dock-btn" onClick={prevSlide} title="Previous Slide (Left Arrow)">
          &lt;
        </button>

        <span className="dock-counter">
          {slideShowIndex + 1} / {visibleSlides.length}
        </span>

        <button className="dock-btn" onClick={nextSlide} title="Next Slide (Right Arrow / Space)">
          &gt;
        </button>

        <div className="dock-sep" />

        <button
          className={`dock-btn ${slideShowLaser ? 'active' : ''}`}
          onClick={() => setSlideShowLaser(!slideShowLaser)}
          title="Laser Pointer"
        >
          Laser
        </button>

        <button
          className={`dock-btn ${presenterNotesOpen ? 'active' : ''}`}
          onClick={() => setPresenterNotesOpen(!presenterNotesOpen)}
          title="Speaker Notes"
        >
          Notes
        </button>

        <button
          className={`dock-btn ${blackScreen ? 'active' : ''}`}
          onClick={() => setBlackScreen(!blackScreen)}
          title="Black Screen (B)"
        >
          Black
        </button>

        <div className="dock-sep" />

        <span className="dock-timer" title="Elapsed Presentation Time">
          {formatTimer(elapsedSeconds)}
        </span>

        <div className="dock-sep" />

        <button className="dock-btn text-danger" onClick={exitSlideShow} title="Exit Slideshow (Esc)">
          Exit Show
        </button>
      </div>

      {/* Presenter Notes Overlay */}
      {presenterNotesOpen && (
        <div className="slideshow-notes-card">
          <div className="notes-card-header">
            <span>Speaker Notes: Slide {slideShowIndex + 1}</span>
            <button className="notes-close-btn" onClick={() => setPresenterNotesOpen(false)}>×</button>
          </div>
          <div className="notes-card-body">
            {currentSlide.notes || 'No speaker notes for this slide.'}
          </div>
        </div>
      )}
    </div>
  );
}
