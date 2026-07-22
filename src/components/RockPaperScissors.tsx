import React, { useEffect } from 'react';
import { Scissors, FileText, Hand, Cpu, Users } from 'lucide-react';
import type { Player, Posture } from '../types/game';
import { playSound } from '../utils/audio';
import { getEmpireName } from '../utils/empireNameGenerator';

interface RockPaperScissorsProps {
  players: Player[];
  currentUserId: string;
  onSelectPosture: (posture: Posture) => void;
  tieOccurred: boolean;
}

export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  players,
  currentUserId,
  onSelectPosture,
  tieOccurred,
}) => {
  const me = players.find((p) => p.id === currentUserId);
  const myPosture = me?.posture || null;

  const handleSelect = (posture: Posture) => {
    playSound.ping();
    onSelectPosture(posture);
  };

  // Sound cues on tie
  useEffect(() => {
    if (tieOccurred) {
      playSound.klaxon();
    }
  }, [tieOccurred]);

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center p-6 bg-black bg-opacity-70">
      <div className="max-w-3xl w-full radar-panel p-8 border-p1 glow-border my-auto">
        <h2 className="text-xl font-bold tracking-widest mb-2 text-p1 glow-text uppercase text-center">
          ROCK_PAPER_SCISSORS
        </h2>
        <div className="loader-bar mb-6"></div>

        {tieOccurred && (
          <div className="mb-6 p-3 bg-red-950 border border-red-500 text-red-400 text-sm font-semibold uppercase tracking-widest text-center animate-pulse">
            Tie Game! Select Your Choice Again
          </div>
        )}

        <p className="text-sm text-p1 opacity-90 mb-8 leading-relaxed text-center max-w-xl mx-auto font-mono">
          Select Rock, Paper, or Scissors to decide the starting territory draft order.
          <br />
          <strong className="text-p2 font-semibold">Rock</strong> beats <strong className="text-p3 font-semibold">Scissors</strong>.
          {' • '}
          <strong className="text-p3 font-semibold">Scissors</strong> beats <strong className="text-p4 font-semibold">Paper</strong>.
          {' • '}
          <strong className="text-p4 font-semibold">Paper</strong> beats <strong className="text-p2 font-semibold">Rock</strong>.
        </p>

        {/* Choice buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleSelect('rock')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'rock'
                ? 'bg-p2 bg-opacity-20 border-p2 text-p2 glow-border scale-105'
                : 'border-p1 hover:border-p2 text-p1 hover:text-p2 hover:bg-p2 hover:bg-opacity-10'
            }`}
            style={{
              '--border-color': 'var(--p2-color)',
              '--glow-color': 'var(--p2-color)',
            } as React.CSSProperties}
          >
            <Hand className="w-12 h-12" />
            <span className="text-xl font-bold tracking-widest uppercase">Rock</span>
            <span className="text-[10px] opacity-75 font-mono">BEATS SCISSORS</span>
          </button>

          <button
            onClick={() => handleSelect('paper')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'paper'
                ? 'bg-p4 bg-opacity-20 border-p4 text-p4 glow-border scale-105'
                : 'border-p1 hover:border-p4 text-p1 hover:text-p4 hover:bg-p4 hover:bg-opacity-10'
            }`}
            style={{
              '--border-color': 'var(--p4-color)',
              '--glow-color': 'var(--p4-color)',
            } as React.CSSProperties}
          >
            <FileText className="w-12 h-12" />
            <span className="text-xl font-bold tracking-widest uppercase">Paper</span>
            <span className="text-[10px] opacity-75 font-mono">BEATS ROCK</span>
          </button>

          <button
            onClick={() => handleSelect('scissors')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'scissors'
                ? 'bg-p3 bg-opacity-20 border-p3 text-p3 glow-border scale-105'
                : 'border-p1 hover:border-p3 text-p1 hover:text-p3 hover:bg-p3 hover:bg-opacity-10'
            }`}
            style={{
              '--border-color': 'var(--p3-color)',
              '--glow-color': 'var(--p3-color)',
            } as React.CSSProperties}
          >
            <Scissors className="w-12 h-12" />
            <span className="text-xl font-bold tracking-widest uppercase">Scissors</span>
            <span className="text-[10px] opacity-75 font-mono">BEATS PAPER</span>
          </button>
        </div>

        {/* Player readiness */}
        <div className="border-t border-p1 border-opacity-30 pt-6">
          <h3 className="text-xs uppercase text-p1 opacity-60 mb-4 tracking-wider text-center">
            PLAYER_SELECTION_STATUS
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {players.map((player) => {
              const hasSubmitted = !!player.posture;
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-2.5 bg-black bg-opacity-40 border border-p1"
                  style={{ borderColor: player.color } as React.CSSProperties}
                >
                  {player.isBot ? (
                    <Cpu className="w-4 h-4" style={{ color: player.color }} />
                  ) : (
                    <Users className="w-4 h-4" style={{ color: player.color }} />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-bold tracking-wider truncate" style={{ color: player.color }}>
                      {getEmpireName(player)}
                    </span>
                    <span className="text-[9px] text-p1 opacity-60 font-mono truncate">
                      {player.name}
                    </span>
                  </div>
                  {hasSubmitted ? (
                    <span className="text-[10px] font-bold text-p1 animate-pulse flex-shrink-0">[READY]</span>
                  ) : (
                    <span className="text-[10px] text-p2 animate-pulse flex-shrink-0">[CHOOSING...]</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
