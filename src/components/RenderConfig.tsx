import React, { useState } from 'react';
import { Database, Wifi, WifiOff, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { playSound } from '../utils/audio';

interface RenderConfigProps {
  onHostGame: (url: string) => void;
  onJoinGame: (url: string, code: string) => void;
  onPlayOffline: () => void;
  isConnecting?: boolean;
  connectionError?: string;
}

const sanitizeWsUrl = (url: string): string => {
  let cleaned = url.trim();
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.replace('http://', 'ws://');
  } else if (cleaned.startsWith('https://')) {
    cleaned = cleaned.replace('https://', 'wss://');
  } else if (!cleaned.startsWith('ws://') && !cleaned.startsWith('wss://')) {
    if (cleaned.includes('localhost') || cleaned.includes('127.0.0.1')) {
      cleaned = 'ws://' + cleaned;
    } else {
      cleaned = 'wss://' + cleaned;
    }
  }
  return cleaned;
};

export const RenderConfig: React.FC<RenderConfigProps> = ({
  onHostGame,
  onJoinGame,
  onPlayOffline,
  isConnecting = false,
  connectionError = '',
}) => {
  const [url, setUrl] = useState(() => {
    const saved = localStorage.getItem('render_server_url') || 'wss://mygameserver-bsow.onrender.com/';
    return sanitizeWsUrl(saved);
  });
  const [roomCode, setRoomCode] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasCreds = url.trim() !== '';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const sanitized = sanitizeWsUrl(url);
      setUrl(sanitized);
      localStorage.setItem('render_server_url', sanitized);
      setShowSettings(false);
      setErrorMessage('');
      playSound.ping();
    }
  };

  const handleHost = () => {
    if (!url.trim()) {
      setErrorMessage('WARN: Server config missing. Please set Render Server URL below.');
      playSound.klaxon();
      return;
    }
    const sanitized = sanitizeWsUrl(url);
    setUrl(sanitized);
    playSound.ping();
    onHostGame(sanitized);
  };

  const handleJoin = () => {
    if (!url.trim()) {
      setErrorMessage('WARN: Server config missing. Please set Render Server URL below.');
      playSound.klaxon();
      return;
    }
    if (roomCode.trim().length !== 5) {
      setErrorMessage('WARN: Room code must be exactly 5 characters.');
      playSound.klaxon();
      return;
    }
    const sanitized = sanitizeWsUrl(url);
    setUrl(sanitized);
    playSound.ping();
    onJoinGame(sanitized, roomCode.trim().toUpperCase());
  };

  const activeError = errorMessage || connectionError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      {/* Scanning Radar Grid decoration */}
      <div className="absolute inset-0 bg-size-40 bg-[linear-gradient(to_right,rgba(51,255,102,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,255,102,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="radar-panel max-w-lg w-full p-8 glow-border border-p1 relative z-10 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="TIMMY WORLD GAME LOGO" className="w-24 h-24 object-contain mb-4 glow-logo border border-p1 border-opacity-30 p-1 bg-black bg-opacity-60" />
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold glow-text tracking-widest text-p1">
                TIMMY_WORLD_GAME
              </h1>
              <div className="text-[10px] uppercase border px-2 py-0.5 text-p1 border-p1 animate-pulse flex items-center gap-1">
                {hasCreds ? <Wifi className="w-3 h-3 text-p1" /> : <WifiOff className="w-3 h-3 text-p2" />}
                {hasCreds ? 'NET_READY' : 'LOCAL_ONLY'}
              </div>
            </div>
          </div>
          
          <div className="loader-bar mb-6"></div>

          {/* Action Log Message */}
          {activeError ? (
            <div className="mb-6 p-2 border border-red-500 bg-red-950 bg-opacity-20 text-red-400 text-xs font-mono tracking-wider uppercase animate-pulse">
              {activeError}
            </div>
          ) : isConnecting ? (
            <div className="mb-6 p-2 border border-p1 bg-p1 bg-opacity-10 text-p1 text-xs font-mono tracking-wider uppercase animate-pulse">
              CONNECTING TO SATELLITE COMMS SERVER... (Render spins down free services after inactivity. This may take up to 60s)
            </div>
          ) : (
            <p className="text-xs mb-6 text-p1 opacity-70 leading-relaxed font-mono">
              SECURE SATELLITE COMMS LINK INITIATED. CHOOSE DEPLOYMENT POST: JOIN A NETWORK SECTOR CODE, HOST A CAMPAIGN FOR OTHER TERMINALS, OR DISCONNECT NETWORK FOR LOCAL SIMULATOR MODE.
            </p>
          )}

          {/* Core Matchmaking Connections Interface */}
          <div className="space-y-4 mb-6">
            
            {/* Join Room Section */}
            <div className="p-4 bg-black bg-opacity-50 border border-p1 flex flex-col gap-3">
              <label className="block text-xs uppercase tracking-wider text-p1">Join Existing Server Sector</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={5}
                  disabled={isConnecting}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="ENTER 5-CHAR CODE"
                  className="flex-1 bg-black border border-p1 text-p1 p-2 text-sm text-center font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-p1 disabled:opacity-50"
                />
                <button
                  onClick={handleJoin}
                  disabled={isConnecting}
                  className="btn-radar px-6 py-2 text-xs font-semibold uppercase border-p1 text-p1 disabled:opacity-50"
                >
                  Join Campaign
                </button>
              </div>
            </div>

            {/* Host Campaign */}
            <button
              onClick={handleHost}
              disabled={isConnecting}
              className="w-full btn-radar py-3 text-sm font-semibold uppercase flex items-center justify-center gap-2 border-p1 text-p1 disabled:opacity-50"
            >
              <Database className="w-4 h-4" /> Host New Server Sector (Render)
            </button>

            {/* Offline Sandbox Fallback */}
            <button
              onClick={() => { playSound.ping(); onPlayOffline(); }}
              disabled={isConnecting}
              className="w-full btn-radar py-3 text-sm font-semibold uppercase flex items-center justify-center gap-2 border-p2 text-p2 disabled:opacity-50"
              style={{ '--border-color': 'var(--p2-color)', '--glow-color': 'var(--p2-color)' } as React.CSSProperties}
            >
              <Cpu className="w-4 h-4" /> Local Sandbox Simulator (VS Bots)
            </button>
          </div>
        </div>

        {/* Collapsible Network Settings */}
        <div className="border-t border-p1 border-opacity-30 pt-4 mt-2">
          <button
            onClick={() => { playSound.click(); setShowSettings(!showSettings); }}
            className="w-full flex items-center justify-between text-xs text-p1 opacity-60 hover:opacity-100 uppercase tracking-widest font-mono"
          >
            <span>Tactical Server Settings</span>
            <Settings className="w-4 h-4" />
          </button>

          {showSettings && (
            <form onSubmit={handleSaveSettings} className="space-y-3 mt-4 text-left p-3 border border-p1 border-opacity-30 bg-black bg-opacity-40">
              <div className="text-[10px] text-p2 uppercase font-semibold flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Input Render WebSocket server URL once to enable Realtime Broadcast matchmaking
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-0.5 text-p1">Render Server URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="wss://your-service.onrender.com/"
                  className="w-full bg-black border border-p1 text-p1 p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-p1"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full btn-radar py-1.5 text-[10px] font-semibold uppercase border-p1 text-p1"
              >
                Save Server Config
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
