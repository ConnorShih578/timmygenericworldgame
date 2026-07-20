import React, { useState } from 'react';
import { Database, Wifi, WifiOff, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { playSound } from '../utils/audio';

interface SupabaseConfigProps {
  onHostGame: (url: string, key: string) => void;
  onJoinGame: (url: string, key: string, code: string) => void;
  onPlayOffline: () => void;
}

export const SupabaseConfig: React.FC<SupabaseConfigProps> = ({
  onHostGame,
  onJoinGame,
  onPlayOffline,
}) => {
  const [url, setUrl] = useState(localStorage.getItem('supabase_url') || 'https://clngazemowopxvfqwnfq.supabase.co');
  const [key, setKey] = useState(localStorage.getItem('supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbmdhemVtb3dvcHh2ZnF3bmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjY5OTcsImV4cCI6MjA5OTY0Mjk5N30.zWN5WlSOT8f5ElGVIv-nDHbRdc4KsAY34wfgajQN5Ro');
  const [roomCode, setRoomCode] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasCreds = url.trim() !== '' && key.trim() !== '';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && key.trim()) {
      localStorage.setItem('supabase_url', url.trim());
      localStorage.setItem('supabase_key', key.trim());
      setShowSettings(false);
      setErrorMessage('');
      playSound.ping();
    }
  };

  const handleHost = () => {
    if (!url.trim() || !key.trim()) {
      setErrorMessage('WARN: Server config missing. Please set Supabase Credentials below.');
      playSound.klaxon();
      return;
    }
    playSound.ping();
    onHostGame(url.trim(), key.trim());
  };

  const handleJoin = () => {
    if (!url.trim() || !key.trim()) {
      setErrorMessage('WARN: Server config missing. Please set Supabase Credentials below.');
      playSound.klaxon();
      return;
    }
    if (roomCode.trim().length !== 5) {
      setErrorMessage('WARN: Room code must be exactly 5 characters.');
      playSound.klaxon();
      return;
    }
    playSound.ping();
    onJoinGame(url.trim(), key.trim(), roomCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      {/* Scanning Radar Grid decoration */}
      <div className="absolute inset-0 bg-size-40 bg-[linear-gradient(to_right,rgba(51,255,102,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,255,102,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="radar-panel max-w-lg w-full p-8 glow-border border-p1 relative z-10 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold glow-text tracking-widest text-p1">
              TIMMY_WORLD_GAME
            </h1>
            <div className="text-[10px] uppercase border px-2 py-0.5 text-p1 border-p1 animate-pulse flex items-center gap-1">
              {hasCreds ? <Wifi className="w-3 h-3 text-p1" /> : <WifiOff className="w-3 h-3 text-p2" />}
              {hasCreds ? 'NET_READY' : 'LOCAL_ONLY'}
            </div>
          </div>
          
          <div className="loader-bar mb-6"></div>

          {/* Action Log Message */}
          {errorMessage ? (
            <div className="mb-6 p-2 border border-red-500 bg-red-950 bg-opacity-20 text-red-400 text-xs font-mono tracking-wider uppercase animate-pulse">
              {errorMessage}
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
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="ENTER 5-CHAR CODE"
                  className="flex-1 bg-black border border-p1 text-p1 p-2 text-sm text-center font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-p1"
                />
                <button
                  onClick={handleJoin}
                  className="btn-radar px-6 py-2 text-xs font-semibold uppercase border-p1 text-p1"
                >
                  Join Campaign
                </button>
              </div>
            </div>

            {/* Host Campaign */}
            <button
              onClick={handleHost}
              className="w-full btn-radar py-3 text-sm font-semibold uppercase flex items-center justify-center gap-2 border-p1 text-p1"
            >
              <Database className="w-4 h-4" /> Host New Server Sector (Realtime)
            </button>

            {/* Offline Sandbox Fallback */}
            <button
              onClick={() => { playSound.ping(); onPlayOffline(); }}
              className="w-full btn-radar py-3 text-sm font-semibold uppercase flex items-center justify-center gap-2 border-p2 text-p2"
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
                Input credentials once to enable Realtime Broadcast matchmaking
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-0.5 text-p1">Supabase URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full bg-black border border-p1 text-p1 p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-p1"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-0.5 text-p1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
