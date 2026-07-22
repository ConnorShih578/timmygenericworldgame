import React from 'react';
import { User, Users, ShieldAlert, Cpu, Play, Plus, X } from 'lucide-react';
import type { Player } from '../types/game';
import { ERAS } from '../constants/eras';
import { playSound } from '../utils/audio';

interface LobbyProps {
  roomCode: string;
  players: Player[];
  currentUserId: string;
  isHost: boolean;
  selectedEraId: string;
  onSelectEra: (eraId: string) => void;
  onAddBot: () => void;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => void;
  onLeaveLobby: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  roomCode,
  players,
  currentUserId,
  isHost,
  selectedEraId,
  onSelectEra,
  onAddBot,
  onRemovePlayer,
  onStartGame,
  onLeaveLobby,
}) => {
  const selectedEra = ERAS.find(e => e.id === selectedEraId) || ERAS[0];

  const handleEraChange = (eraId: string) => {
    playSound.click();
    onSelectEra(eraId);
  };

  const handleStart = () => {
    playSound.ping();
    onStartGame();
  };

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center p-6 bg-black bg-opacity-70">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
        
        {/* Left Side: Terminals/Players list */}
        <div className="radar-panel p-6 border-p1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold glow-text tracking-widest text-p1">
                {selectedEraId === 'roman' ? 'ROMAN_SENATE_CHAMBER' :
                 selectedEraId === 'napoleonic' ? 'ROYAL_COUNCIL_CHAMBER' :
                 selectedEraId === 'british_empire' ? 'IMPERIAL_WAR_OFFICE' :
                 selectedEraId === 'ww1' ? 'FIELD_DISPATCH_LOBBY' :
                 selectedEraId === 'ww2' ? 'BUNKER_STAFF_LOBBY' :
                 'CYBER_COMMAND_LOBBY'}
              </h2>
              <div className="text-xs uppercase bg-opacity-20 bg-p1 border border-p1 px-2 py-0.5 text-p1">
                COMMANDERS: {players.length}/4
              </div>
            </div>
            
            <div className="loader-bar mb-6"></div>

            <div className="space-y-3 mb-6">
              {players.map((player) => {
                const isMe = player.id === currentUserId;
                return (
                  <div 
                    key={player.id} 
                    className="flex justify-between items-center p-3 bg-black bg-opacity-40 border border-p1"
                    style={{ borderColor: player.color } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3">
                      {player.isBot ? (
                        <Cpu className="w-5 h-5" style={{ color: player.color }} />
                      ) : (
                        <User className="w-5 h-5" style={{ color: player.color }} />
                      )}
                      <span className="text-sm font-semibold tracking-wider" style={{ color: player.color }}>
                        {player.name} {isMe && '(YOU)'}
                      </span>
                      {player.isHost && (
                        <span className="text-[10px] border px-1 uppercase tracking-widest" style={{ color: player.color, borderColor: player.color }}>
                          HOST
                        </span>
                      )}
                    </div>
                    {isHost && !player.isHost && (
                      <button 
                        onClick={() => { playSound.click(); onRemovePlayer(player.id); }} 
                        className="text-xs uppercase hover:text-white px-2 py-1 rounded transition bg-red-950 border border-red-500 text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Empty Slots */}
              {Array.from({ length: 4 - players.length }).map((_, idx) => (
                <div 
                  key={`empty-${idx}`} 
                  className="flex justify-between items-center p-3 border border-dashed border-neutral text-neutral opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest">AWAITING CONNECTION...</span>
                  </div>
                  {isHost && (
                    <button 
                      onClick={() => { playSound.ping(); onAddBot(); }} 
                      className="btn-radar px-2 py-1 text-xs uppercase flex items-center gap-1 border-neutral text-neutral"
                    >
                      <Plus className="w-3 h-3" /> ADD_BOT
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-black border border-p2 border-opacity-30 text-p2 text-xs flex gap-2 items-start">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                SECURE ROOM IDENTIFICATION CODE: <strong className="text-sm tracking-widest text-white ml-1">{roomCode}</strong>. SHARE CODE WITH ASSOCIATE TERMINALS TO ENABLE DIRECT SYNC.
              </span>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={onLeaveLobby} 
                className="flex-1 btn-radar py-2 text-sm uppercase font-semibold text-p2 border-p2"
                style={{ '--border-color': 'var(--p2-color)', '--glow-color': 'var(--p2-color)' } as React.CSSProperties}
              >
                ABORT_MISSION
              </button>
              {isHost && (
                <button 
                  onClick={handleStart} 
                  disabled={players.length < 2}
                  className="flex-1 btn-radar py-2 text-sm uppercase font-semibold flex items-center justify-center gap-2 text-p1 border-p1"
                >
                  <Play className="w-4 h-4" /> START_DEPLOY
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Era Selector & Preamble Preview */}
        <div className="radar-panel p-6 border-p1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={`/logo_${selectedEraId}.png`} 
                alt={`${selectedEra.name} LOGO`} 
                className="w-16 h-16 object-contain glow-logo border border-p1 border-opacity-30 p-1 bg-black bg-opacity-60" 
              />
              <div>
                <h2 className="text-xl font-bold glow-text tracking-widest text-p1">
                  MISSION_OBJECTIVES
                </h2>
                <div className="text-[10px] text-p1 opacity-60 font-mono">
                  ERA: {selectedEra.name.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="loader-bar mb-6"></div>

            <div className="mb-4">
              <label className="block text-xs uppercase mb-1.5 text-p1">Select Era Chronology</label>
              {isHost ? (
                <select
                  value={selectedEraId}
                  onChange={(e) => handleEraChange(e.target.value)}
                  className="w-full bg-black border border-p1 text-p1 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-p1"
                >
                  {ERAS.map((era) => (
                    <option key={era.id} value={era.id} className="bg-black">
                      {era.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full bg-black border border-p1 text-p1 p-2 text-sm">
                  {selectedEra.name} (HOST SELECTING)
                </div>
              )}
            </div>

            <div className="p-4 bg-black bg-opacity-50 border border-p1 min-h-[180px]">
              <h3 className="text-xs uppercase text-p1 opacity-60 mb-2">TELEMETRY_LOG</h3>
              <p className="text-sm leading-relaxed text-p1 font-mono">
                {selectedEra.preamble}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-p1 opacity-40 uppercase tracking-widest text-right mt-4">
            SYSTEM_STATUS: READY_FOR_ENCRYPTED_HANDSHAKE
          </div>
        </div>

      </div>
    </div>
  );
};
