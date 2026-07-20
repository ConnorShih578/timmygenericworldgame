import React, { useEffect, useState } from 'react';
import { playSound } from '../utils/audio';
import type { Era } from '../types/game';

interface PreambleProps {
  era: Era;
  onComplete: () => void;
}

export const Preamble: React.FC<PreambleProps> = ({ era, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let index = 0;
    let timer: any;
    const text = era.preamble;

    const typeWriter = () => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
        
        // Play soft click every 3rd character to keep sound pleasing
        if (index % 3 === 0) {
          playSound.click();
        }
        
        timer = setTimeout(typeWriter, 20);
      } else {
        setIsFinished(true);
      }
    };

    typeWriter();

    return () => {
      clearTimeout(timer);
    };
  }, [era]);

  const handleSkip = () => {
    playSound.ping();
    setDisplayText(era.preamble);
    setIsFinished(true);
  };

  const handleProceed = () => {
    playSound.ping();
    onComplete();
  };

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center p-6 bg-black bg-opacity-70">
      <div className="max-w-2xl w-full radar-panel p-8 border-p1 glow-border my-auto">
        <h2 className="text-xl font-bold tracking-widest mb-2 text-p1 glow-text uppercase">
          DIAGNOSTIC_DECOMPRESSION // {era.name}
        </h2>
        <div className="loader-bar mb-6"></div>

        <div className="min-h-[160px] mb-8 font-mono text-sm leading-relaxed text-p1 bg-black bg-opacity-40 p-4 border border-p1 border-opacity-35 max-h-[300px] overflow-y-auto custom-scrollbar">
          {displayText}
          {!isFinished && <span className="animate-pulse ml-0.5 text-p1">|</span>}
        </div>

        <div className="flex gap-4 justify-end">
          {!isFinished ? (
            <button
              onClick={handleSkip}
              className="btn-radar px-6 py-2 text-sm uppercase font-semibold text-p2 border-p2"
              style={{ '--border-color': 'var(--p2-color)', '--glow-color': 'var(--p2-color)' } as React.CSSProperties}
            >
              SKIP_LOG
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="btn-radar px-6 py-2 text-sm uppercase font-semibold text-p1 border-p1 animate-pulse"
            >
              ESTABLISH_POSTURE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
