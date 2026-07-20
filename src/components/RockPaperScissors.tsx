import React, { useEffect } from 'react';
import { Shield, Target, Cpu, Users, EyeOff } from 'lucide-react';
import type { Player, Posture } from '../types/game';
import { playSound } from '../utils/audio';

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
          CALIBRATING_TACTICAL_POSTURES
        </h2>
        <div className="loader-bar mb-6"></div>

        {tieOccurred && (
          <div className="mb-6 p-3 bg-red-950 border border-red-500 text-red-400 text-sm font-semibold uppercase tracking-widest text-center animate-pulse">
            Conflict Tie Detected // Re-align Tactical Postures Immediately
          </div>
        )}

        <p className="text-sm text-p1 opacity-90 mb-8 leading-relaxed text-center max-w-xl mx-auto">
          Draft order is decided by posture matchups. Choose a posture. 
          <br />
          <strong className="text-p2 font-semibold">Defensive (Rock)</strong> absorbs <strong className="text-p3 font-semibold">Offensive (Scissors)</strong>.
          <br />
          <strong className="text-p3 font-semibold">Offensive (Scissors)</strong> destroys <strong className="text-p4 font-semibold">Infiltration (Paper)</strong>.
          <br />
          <strong className="text-p4 font-semibold">Infiltration (Paper)</strong> bypasses <strong className="text-p2 font-semibold">Defensive (Rock)</strong>.
        </p>

        {/* Choice buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleSelect('defensive')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'defensive'
                ? 'bg-p2 bg-opacity-20 border-p2 text-p2 glow-border'
                : 'border-p1 hover:border-p2 text-p1 hover:text-p2'
            }`}
            style={{
              '--border-color': 'var(--p2-color)',
              '--glow-color': 'var(--p2-color)',
            } as React.CSSProperties}
          >
            <Shield className="w-10 h-10" />
            <span className="text-lg font-bold tracking-widest uppercase">Defensive</span>
            <span className="text-[10px] opacity-75">ABSORBS OFFENSIVE</span>
          </button>

          <button
            onClick={() => handleSelect('infiltration')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'infiltration'
                ? 'bg-p4 bg-opacity-20 border-p4 text-p4 glow-border'
                : 'border-p1 hover:border-p4 text-p1 hover:text-p4'
            }`}
            style={{
              '--border-color': 'var(--p4-color)',
              '--glow-color': 'var(--p4-color)',
            } as React.CSSProperties}
          >
            <EyeOff className="w-10 h-10" />
            <span className="text-lg font-bold tracking-widest uppercase">Infiltration</span>
            <span className="text-[10px] opacity-75">BYPASSES DEFENSIVE</span>
          </button>

          <button
            onClick={() => handleSelect('offensive')}
            disabled={!!myPosture}
            className={`p-6 border flex flex-col items-center justify-center gap-3 transition-all ${
              myPosture === 'offensive'
                ? 'bg-p3 bg-opacity-20 border-p3 text-p3 glow-border'
                : 'border-p1 hover:border-p3 text-p1 hover:text-p3'
            }`}
            style={{
              '--border-color': 'var(--p3-color)',
              '--glow-color': 'var(--p3-color)',
            } as React.CSSProperties}
          >
            <Target className="w-10 h-10" />
            <span className="text-lg font-bold tracking-widest uppercase">Offensive</span>
            <span className="text-[10px] opacity-75">DESTROYS INFILTRATION</span>
          </button>
        </div>

        {/* Player readiness */}
        <div className="border-t border-p1 border-opacity-30 pt-6">
          <h3 className="text-xs uppercase text-p1 opacity-60 mb-4 tracking-wider text-center">
            TERMINAL_POSTURE_STATUS
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {players.map((player) => {
              const hasSubmitted = !!player.posture;
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-2 bg-black bg-opacity-40 border border-p1"
                  style={{ borderColor: player.color } as React.CSSProperties}
                >
                  {player.isBot ? (
                    <Cpu className="w-4 h-4" style={{ color: player.color }} />
                  ) : (
                    <Users className="w-4 h-4" style={{ color: player.color }} />
                  )}
                  <span className="text-xs tracking-wider flex-1 truncate" style={{ color: player.color }}>
                    {player.name}
                  </span>
                  {hasSubmitted ? (
                    <span className="text-[10px] font-bold text-p1 animate-pulse">[SECURED]</span>
                  ) : (
                    <span className="text-[10px] text-p2 animate-pulse">[CALIBRATING]</span>
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
