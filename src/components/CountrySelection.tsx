import React from 'react';
import { Dices } from 'lucide-react';
import type { Player, CountryNode, Era } from '../types/game';
import { playSound } from '../utils/audio';
import { generateRandomEmpireName, getEmpireName } from '../utils/empireNameGenerator';

interface CountrySelectionProps {
  era: Era;
  players: Player[];
  currentUserId: string;
  onSelectCountry: (countryId: string) => void;
  onUpdateEmpireName?: (playerId: string, empireName: string) => void;
}

export const CountrySelection: React.FC<CountrySelectionProps> = ({
  era,
  players,
  currentUserId,
  onSelectCountry,
  onUpdateEmpireName,
}) => {
  const me = players.find((p) => p.id === currentUserId);
  const myStars = me?.starsAssigned || 1;
  const myPick = me?.selectedCountryId || null;
  const myEmpireName = me?.empireName || '';

  // Group nodes by countryId to identify unique countries, their names, stars, and node names
  const countries = era.nodes.reduce((acc: { [key: string]: { id: string; name: string; stars: number; nodes: CountryNode[] } }, node: CountryNode) => {
    if (!acc[node.countryId]) {
      acc[node.countryId] = {
        id: node.countryId,
        name: node.countryName,
        stars: node.stars,
        nodes: [],
      };
    }
    acc[node.countryId].nodes.push(node);
    return acc;
  }, {} as { [key: string]: { id: string; name: string; stars: number; nodes: CountryNode[] } });

  const countryList = Object.values(countries);

  // Filter countries matching my star rank
  const myBracketCountries = countryList.filter((c: { stars: number }) => c.stars === myStars);

  // Get already picked countries
  const pickedCountries = players.reduce((acc, p) => {
    if (p.selectedCountryId) {
      acc[p.selectedCountryId] = p;
    }
    return acc;
  }, {} as { [countryId: string]: Player });

  const handlePick = (country: { id: string; name: string }) => {
    if (pickedCountries[country.id] || myPick) return;
    playSound.ping();

    // If empire name is empty or not custom set yet, default to the chosen country's historical name
    if (!myEmpireName.trim() && onUpdateEmpireName) {
      onUpdateEmpireName(currentUserId, country.name);
    }

    onSelectCountry(country.id);
  };

  const handleRandomizeEmpireName = () => {
    playSound.click();
    if (onUpdateEmpireName) {
      onUpdateEmpireName(currentUserId, generateRandomEmpireName());
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-auto flex items-center justify-center p-6 bg-black bg-opacity-70">
      <div className="max-w-4xl w-full radar-panel p-8 border-p1 glow-border my-auto">
        <h2 className="text-xl font-bold tracking-widest mb-2 text-p1 glow-text uppercase text-center">
          DRAFTING_STARTING_TERRITORIES
        </h2>
        <div className="loader-bar mb-6"></div>

        {/* Custom Empire Name Selection Section */}
        <div className="p-4 bg-black bg-opacity-50 border border-p1 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <label className="text-xs uppercase text-p1 font-bold tracking-wider block mb-0.5">
                Designate Sovereign Empire Title
              </label>
              <span className="text-[10px] text-p1 opacity-70 font-mono">
                Customize your empire name or select a territory to inherit its historical identity.
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={myEmpireName}
                onChange={(e) => onUpdateEmpireName && onUpdateEmpireName(currentUserId, e.target.value)}
                placeholder="e.g. Imperial Legion"
                maxLength={24}
                className="bg-black border border-p1 text-p1 px-3 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-p1 flex-1 sm:w-56"
                style={{ borderColor: me?.color }}
              />
              <button
                type="button"
                onClick={handleRandomizeEmpireName}
                className="btn-radar px-3 py-1 text-xs uppercase flex items-center gap-1.5 border-p1 text-p1 hover:bg-p1 hover:bg-opacity-20"
                title="Randomize Empire Name"
              >
                <Dices className="w-3.5 h-3.5 text-p1" />
                <span className="hidden sm:inline">RANDOM</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left panel: Info about player bracket */}
          <div className="flex-1 p-4 bg-black bg-opacity-40 border border-p1">
            <h3 className="text-sm font-bold text-p1 uppercase tracking-wider mb-2">Draft Assignment</h3>
            <p className="text-xs text-p1 opacity-80 leading-relaxed mb-4">
              Your placement in Rock Paper Scissors has assigned you to the following bracket:
            </p>
            <div className="text-2xl font-bold glow-text mb-4 text-p1 uppercase tracking-widest">
              {myStars}-Star Class ({'★'.repeat(myStars)})
            </div>
            
            {myStars === 1 && (
              <div className="p-3 bg-p2 bg-opacity-10 border border-p2 text-p2 text-xs leading-relaxed">
                <strong>Handicap Activated:</strong> As a 1-star division country, you receive +15 starting troops and a passive +30% Guerrilla Defense bonus on all home nodes!
              </div>
            )}
          </div>

          {/* Right panel: Draft order status */}
          <div className="flex-1 p-4 bg-black bg-opacity-40 border border-p1">
            <h3 className="text-sm font-bold text-p1 uppercase tracking-wider mb-3">Draft Status</h3>
            <div className="space-y-2">
              {players.map((p) => {
                const picked = countryList.find((c) => c.id === p.selectedCountryId);
                const empireDisplay = getEmpireName(p, picked?.name);
                return (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <span style={{ color: p.color }}>{p.name} ({p.starsAssigned}★)</span>
                    <span className="font-mono truncate max-w-[180px] text-right" style={{ color: p.color }}>
                      {picked ? `[${empireDisplay.toUpperCase()}]` : 'SELECTING...'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selection choices */}
        <h3 className="text-xs uppercase text-p1 opacity-60 mb-4 tracking-wider text-center">
          Available Countries in Your Bracket ({myStars}★)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBracketCountries.map((country) => {
            const picker = pickedCountries[country.id];
            const isPicked = !!picker;
            const isMe = picker?.id === currentUserId;

            return (
              <button
                key={country.id}
                disabled={isPicked || !!myPick}
                onClick={() => handlePick(country)}
                className={`p-4 border text-left flex flex-col justify-between transition-all h-[140px] relative ${
                  isMe
                    ? 'border-p1 bg-p1 bg-opacity-25'
                    : isPicked
                    ? 'opacity-40 cursor-not-allowed border-neutral bg-neutral bg-opacity-10'
                    : 'border-p1 hover:border-p3 hover:bg-p3 hover:bg-opacity-10'
                }`}
                style={(!isPicked && !myPick) ? ({
                  '--border-color': 'var(--p3-color)',
                  '--glow-color': 'var(--p3-color)',
                } as React.CSSProperties) : {}}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-bold tracking-wider uppercase text-p1">
                      {country.name}
                    </span>
                    <span className="text-sm font-bold text-p2">
                      {'★'.repeat(country.stars)}
                    </span>
                  </div>
                  <div className="text-[10px] text-p1 opacity-60 uppercase mb-2">
                    Infrastructure Clusters:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {country.nodes.map((n) => (
                      <span key={n.id} className="text-[9px] border border-p1 border-opacity-40 px-1 bg-black bg-opacity-40 text-p1">
                        {n.type === 'capital' ? '★ ' : n.type === 'military_base' ? '⚔ ' : '🏙 '} 
                        {n.name}
                      </span>
                    ))}
                  </div>
                </div>

                {isPicked && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center font-bold text-sm tracking-widest uppercase border border-p1 p-2 text-center"
                    style={{ color: picker.color, borderColor: picker.color }}
                  >
                    Drafted By {getEmpireName(picker, country.name)} ({picker.name})
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
