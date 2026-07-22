import React, { useState, useEffect, useRef } from 'react';
import type { Player, CountryNode, BorderConnection, TransitTroops, Alliance, GameLog, CombatResult } from '../types/game';
import { getEmpireName } from '../utils/empireNameGenerator';
import { COUNTRY_PATHS, DETAILED_CONTINENTS } from '../constants/countryPaths';
import { playSound } from '../utils/audio';
import { canReachNode } from '../utils/pathfinding';
import { Shield, Target, Award, Eye, RefreshCw, Volume2, VolumeX, AlertTriangle, Compass, HelpCircle, Keyboard } from 'lucide-react';

interface GameBoardProps {
  eraId?: string;
  players: Player[];
  nodes: CountryNode[];
  connections: BorderConnection[];
  transits: TransitTroops[];
  alliances: Alliance[];
  logs: GameLog[];
  currentUserId: string;
  onFortifyToggle: (nodeId: string) => void;
  onLaunchTroops: (sourceId: string, targetId: string, count: number, isExplorer: boolean) => void;
  onProposeAlliance: (targetPlayerId: string) => void;
  onBreakAlliance: (allianceId: string) => void;
  onAcceptAlliance: (allianceId: string) => void;
  onRejectAlliance: (allianceId: string) => void;
  winnerId: string | string[] | null;
  onReset: () => void;
  onLaunchTutorial: () => void;
  lastCombatResult?: CombatResult | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  eraId = 'modern',
  players,
  nodes,
  connections,
  transits,
  alliances,
  logs,
  currentUserId,
  onFortifyToggle,
  onLaunchTroops,
  onProposeAlliance,
  onBreakAlliance,
  onAcceptAlliance,
  onRejectAlliance,
  winnerId,
  onReset,
  onLaunchTutorial,
  lastCombatResult,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [targetActionMode, setTargetActionMode] = useState<'none' | 'attack' | 'explore'>('none');
  const [troopPercentage, setTroopPercentage] = useState<number>(75);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(false);
  const [rightCollapsed, setRightCollapsed] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const [activePayloads, setActivePayloads] = useState<Array<{
    id: string; fromX: number; fromY: number; toX: number; toY: number; progress: number; color: string; isScout: boolean; label: string;
  }>>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Desktop Controls state
  const [showHotkeyHelp, setShowHotkeyHelp] = useState<boolean>(false);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in text field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();

      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        setSelectedNodeId(null);
        setTargetActionMode('none');
      } else if (key === 'a') {
        e.preventDefault();
        if (selectedNodeId) {
          const sNode = nodes.find(n => n.id === selectedNodeId);
          if (sNode && sNode.ownerId === currentUserId) {
            setTargetActionMode(prev => (prev === 'attack' ? 'none' : 'attack'));
            if (soundEnabled) playSound.click();
          }
        }
      } else if (key === 's') {
        e.preventDefault();
        if (selectedNodeId) {
          const sNode = nodes.find(n => n.id === selectedNodeId);
          if (sNode && sNode.ownerId === currentUserId) {
            setTargetActionMode(prev => (prev === 'explore' ? 'none' : 'explore'));
            if (soundEnabled) playSound.click();
          }
        }
      } else if (key === 'f') {
        e.preventDefault();
        if (selectedNodeId) {
          const sNode = nodes.find(n => n.id === selectedNodeId);
          if (sNode && sNode.ownerId === currentUserId && sNode.troops > 1) {
            onFortifyToggle(selectedNodeId);
            if (soundEnabled) playSound.ping();
          }
        }
      } else if (['1', '2', '3', '4'].includes(key)) {
        const pctMap: Record<string, number> = { '1': 25, '2': 50, '3': 75, '4': 100 };
        setTroopPercentage(pctMap[key]);
        if (soundEnabled) playSound.click();
      } else if (key === 'c') {
        e.preventDefault();
        const myCapital = nodes.find(n => n.ownerId === currentUserId && n.type === 'capital') || nodes.find(n => n.ownerId === currentUserId);
        if (myCapital) {
          setSelectedNodeId(myCapital.id);
          setPan({ x: 500 - myCapital.x, y: 350 - myCapital.y });
          setZoom(1.5);
          if (soundEnabled) playSound.ping();
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const myNodes = nodes.filter(n => n.ownerId === currentUserId);
        if (myNodes.length > 0) {
          const currentIndex = myNodes.findIndex(n => n.id === selectedNodeId);
          const nextIndex = e.shiftKey
            ? (currentIndex - 1 + myNodes.length) % myNodes.length
            : (currentIndex + 1) % myNodes.length;
          setSelectedNodeId(myNodes[nextIndex].id);
          if (soundEnabled) playSound.click();
        }
      } else if (e.key === '+' || e.key === '=') {
        setZoom(prev => Math.min(4, prev + 0.25));
      } else if (e.key === '-') {
        setZoom(prev => Math.max(0.75, prev - 0.25));
      } else if (key === '0') {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      } else if (key === 'h' || key === '?') {
        setShowHotkeyHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes, currentUserId, soundEnabled, onFortifyToggle]);

  const startPayloadAnimation = (fromId: string, toId: string, isScout: boolean, count: number, color: string) => {
    const fromN = nodes.find(n => n.id === fromId);
    const toN = nodes.find(n => n.id === toId);
    if (!fromN || !toN) return;

    const payloadId = Math.random().toString();
    const newPayload = {
      id: payloadId,
      fromX: fromN.x,
      fromY: fromN.y,
      toX: toN.x,
      toY: toN.y,
      progress: 0,
      color: color,
      isScout: isScout,
      label: isScout ? '👁 SCOUT' : `⚔ ${count}`
    };

    setActivePayloads(prev => [...prev, newPayload]);

    let start: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(1, elapsed / duration);

      setActivePayloads(prev => prev.map(item => item.id === payloadId ? { ...item, progress: p } : item));

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        setActivePayloads(prev => prev.filter(item => item.id !== payloadId));
      }
    };

    requestAnimationFrame(step);
  };
  
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Helper to check if two nodes are connected
  const getConnection = (nodeAId: string, nodeBId: string) => {
    return connections.find(
      c => (c.from === nodeAId && c.to === nodeBId) || (c.from === nodeBId && c.to === nodeAId)
    );
  };

  // Helper to check if two players are allied
  const areAllied = (playerAId: string | null, playerBId: string | null) => {
    if (!playerAId || !playerBId || playerAId === playerBId) return false;
    return alliances.some(
      a => a.status === 'active' && a.members.includes(playerAId) && a.members.includes(playerBId)
    );
  };

  // Helper to check if two players are in a truce
  const areInTruce = (playerAId: string | null, playerBId: string | null) => {
    if (!playerAId || !playerBId || playerAId === playerBId) return false;
    return alliances.some(
      a => a.status === 'truce' && a.members.includes(playerAId) && a.members.includes(playerBId)
    );
  };

  // Handle clicking on a node
  const handleNodeClick = (nodeId: string) => {
    const clickedNode = nodes.find(n => n.id === nodeId);
    if (!clickedNode) return;

    if (targetActionMode === 'attack' && selectedNodeId) {
      // Validate adjacent connection or empire-wide path reachability
      const canAttackOrReinforce = canReachNode(selectedNodeId, nodeId, currentUserId, nodes, connections, alliances);
      const isTargetAllied = areAllied(clickedNode.ownerId, currentUserId);

      if (canAttackOrReinforce) {
        if (isTargetAllied && clickedNode.ownerId !== currentUserId) {
          // It's allied, reinforce it!
        } else if (areInTruce(clickedNode.ownerId, currentUserId)) {
          alert('Truce is currently active! Cannot strike target.');
          setTargetActionMode('none');
          return;
        }

        const maxAvailable = (selectedNode?.troops || 1) - 1;
        const deployCount = Math.max(1, Math.round(maxAvailable * (troopPercentage / 100)));

        if (deployCount > 0) {
          if (soundEnabled) playSound.click();
          const myCol = players.find(p => p.id === currentUserId)?.color || '#33ff66';
          startPayloadAnimation(selectedNodeId, nodeId, false, deployCount, myCol);
          onLaunchTroops(selectedNodeId, nodeId, deployCount, false);
        }
      } else {
        alert('Target territory is not connected to your empire network!');
      }
      setTargetActionMode('none');
    } else if (targetActionMode === 'explore' && selectedNodeId) {
      const connection = getConnection(selectedNodeId, nodeId);
      if (connection) {
        if (clickedNode.ownerId === currentUserId) {
          alert('Cannot send explorer to your own territory!');
        } else {
          if (soundEnabled) playSound.click();
          const myCol = players.find(p => p.id === currentUserId)?.color || '#33ff66';
          startPayloadAnimation(selectedNodeId, nodeId, true, 5, myCol);
          onLaunchTroops(selectedNodeId, nodeId, 5, true);
        }
      }
      setTargetActionMode('none');
    } else {
      setSelectedNodeId(nodeId);
      setTargetActionMode('none');
      if (soundEnabled) playSound.click();
    }
  };

  const handleFortify = () => {
    if (!selectedNodeId || !selectedNode) return;
    if (selectedNode.ownerId !== currentUserId) return;
    onFortifyToggle(selectedNodeId);
    if (soundEnabled) playSound.ping();
  };

  const triggerAction = (mode: 'attack' | 'explore') => {
    if (!selectedNodeId) return;
    setTargetActionMode(mode);
    if (soundEnabled) playSound.click();
  };

  // Get active alliance requests involving current user
  const activeRequests = alliances.filter(
    a => a.status === 'pending' && a.members.includes(currentUserId) && a.proposedBy !== currentUserId
  );

  return (
    <div className="h-screen w-screen bg-[#050806] flex flex-col overflow-hidden text-p1 relative select-none">
      
      {/* 1. Header/Scoreboard */}
      <div className="h-16 border-b border-p1 bg-black bg-opacity-80 px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <img 
            src={`/logo_${eraId}.png`} 
            alt="Era Logo" 
            className="w-9 h-9 object-contain glow-logo border border-p1 border-opacity-30 p-0.5 bg-black bg-opacity-60" 
          />
          <span className="font-bold glow-text tracking-widest text-lg header-title">TIMMY_WORLD_GAME</span>
          <div className="loader-bar w-24 header-title"></div>
        </div>

        {/* Player scoreboards */}
        <div className="flex gap-4">
          {players.map(p => {
            const ownedNodes = nodes.filter(n => n.ownerId === p.id);
            const totalTroops = ownedNodes.reduce((sum, n) => sum + n.troops, 0);
            const allianceActive = alliances.some(a => a.status === 'active' && a.members.includes(p.id) && a.members.includes(currentUserId));
            const empName = getEmpireName(p);
            
            return (
              <div 
                key={p.id} 
                className={`px-3 py-1 bg-black bg-opacity-40 border text-xs flex items-center gap-2 relative ${
                  !p.isAlive ? 'opacity-35 line-through' : ''
                }`}
                style={{ borderColor: p.color } as React.CSSProperties}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }}></span>
                <div className="flex flex-col">
                  <span className="font-bold uppercase tracking-wider text-[11px] max-w-[130px] truncate" style={{ color: p.color }}>
                    {empName} {p.id === currentUserId && '(YOU)'}
                  </span>
                  <span className="text-[9px] text-p1 opacity-60 font-mono -mt-0.5">
                    {p.name}
                  </span>
                </div>
                <span className="opacity-60 font-mono text-[10px] ml-1">
                  ND:{ownedNodes.length} TR:{totalTroops}
                </span>
                {allianceActive && (
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-[9px] uppercase border px-1" style={{ color: p.color, borderColor: p.color }}>
                      ALLY
                    </span>
                    <button
                      onClick={() => {
                        const alliance = alliances.find(
                          a => a.status === 'active' && a.members.includes(p.id) && a.members.includes(currentUserId)
                        );
                        if (alliance) {
                          if (soundEnabled) playSound.klaxon();
                          onBreakAlliance(alliance.id);
                        }
                      }}
                      className="px-1 border border-red-500 text-[8px] uppercase text-red-400 bg-black hover:bg-red-950"
                      title="DISBAND COALITION"
                    >
                      DISBAND
                    </button>
                  </div>
                )}
                {p.id !== currentUserId && p.isAlive && !allianceActive && (
                  <button
                    onClick={() => { if (soundEnabled) playSound.ping(); onProposeAlliance(p.id); }}
                    className="ml-2 px-1 border border-p1 text-[8px] uppercase hover:bg-p1 hover:bg-opacity-25 text-p1"
                  >
                    ALLIANCE
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Keyboard Shortcuts Cheat Sheet Toggle */}
          <button
            onClick={() => setShowHotkeyHelp(!showHotkeyHelp)}
            className="btn-radar p-2 rounded flex items-center justify-center border-p1 text-p1 hover:bg-p1 hover:bg-opacity-20"
            title="KEYBOARD SHORTCUTS [H]"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Help Briefing Toggle */}
          <button
            onClick={onLaunchTutorial}
            className="btn-radar p-2 rounded flex items-center justify-center border-p1 text-p1"
            title="LAUNCH TACTICAL BRIEFING"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-radar p-2 rounded flex items-center justify-center border-p1"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-p1" /> : <VolumeX className="w-4 h-4 text-p2" />}
          </button>
        </div>
      </div>

      {/* 2. Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Logs and Alliances */}
        <div 
          className={`${leftCollapsed ? 'w-0 border-r-0' : 'w-80 border-r'} border-p1 flex flex-col bg-black bg-opacity-70 z-10 h-full relative transition-all duration-300 overflow-visible`}
        >
          {/* Collapse Handle Tab */}
          <button
            onClick={() => { if (soundEnabled) playSound.click(); setLeftCollapsed(!leftCollapsed); }}
            className="absolute top-1/2 left-full transform -translate-y-1/2 bg-black border border-p1 text-p1 p-1 text-[10px] z-20 cursor-pointer hover:bg-p1 hover:text-black transition-colors flex items-center justify-center rounded-r"
            style={{ height: '60px', width: '16px', borderLeft: 'none' }}
            title={leftCollapsed ? "EXPAND_COALITIONS" : "COLLAPSE_COALITIONS"}
          >
            {leftCollapsed ? '▶' : '◀'}
          </button>

          {!leftCollapsed && (
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              {/* Scrollable Upper Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {/* Incoming Alliance Invites */}
                {activeRequests.length > 0 && (
                  <div className="p-4 border-b border-p2 bg-red-950 bg-opacity-10 flex-shrink-0">
                    <h4 className="text-xs font-bold text-p2 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> ALLIANCE_INVITATION
                    </h4>
                    {activeRequests.map(req => {
                      const sender = players.find(p => p.id === req.proposedBy);
                      return (
                        <div key={req.id} className="p-3 bg-black border border-p2 space-y-3">
                          <span className="text-xs leading-relaxed text-p2">
                            Terminal <strong style={{ color: sender?.color }}>{getEmpireName(sender)} ({sender?.name})</strong> proposes a formal military Coalition.
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { if (soundEnabled) playSound.ping(); onRejectAlliance(req.id); }}
                              className="flex-1 px-2 py-1 text-[10px] uppercase border border-red-500 text-red-400 bg-black hover:bg-red-950"
                            >
                              REJECT
                            </button>
                            <button
                              onClick={() => { if (soundEnabled) playSound.ping(); onAcceptAlliance(req.id); }}
                              className="flex-1 px-2 py-1 text-[10px] uppercase border border-green-500 text-green-400 bg-black hover:bg-green-950"
                            >
                              ACCEPT
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Active Alliances Panel */}
                <div className="p-4 border-b border-p1 flex flex-col">
                  <h3 className="text-xs uppercase text-p1 opacity-60 mb-2 tracking-wider">ACTIVE_COALITIONS</h3>
                  <div className="space-y-2">
                    {alliances.filter(a => a.status === 'active' || a.status === 'truce').map(alliance => {
                      const membersList = alliance.members.map(mId => players.find(p => p.id === mId));
                      const containsMe = alliance.members.includes(currentUserId);
                      
                      return (
                        <div 
                          key={alliance.id} 
                          className={`p-3 bg-black bg-opacity-40 border flex flex-col justify-between gap-2 ${
                            alliance.status === 'truce' ? 'border-p2' : 'border-p1'
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className={`uppercase font-bold ${alliance.status === 'truce' ? 'text-p2' : 'text-p1'}`}>
                                {alliance.status === 'truce' ? 'TRUCE (COUNTDOWN)' : 'COALITION_BLOC'}
                              </span>
                              {alliance.status === 'truce' && (
                                <span className="text-p2 animate-pulse">WAR_AHEAD</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {membersList.map(member => (
                                <span key={member?.id} className="text-[10px] px-1 border border-opacity-40" style={{ color: member?.color, borderColor: member?.color }}>
                                  {getEmpireName(member)} ({member?.name})
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {containsMe && (
                            <button
                              onClick={() => { if (soundEnabled) playSound.klaxon(); onBreakAlliance(alliance.id); }}
                              className="w-full mt-1 border border-red-500 text-red-400 text-[9px] py-1 bg-black uppercase hover:bg-red-950 hover:bg-opacity-50 text-center"
                            >
                              DISSOLVE_ALLIANCE
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {alliances.filter(a => a.status === 'active' || a.status === 'truce').length === 0 && (
                      <div className="text-xs text-p1 opacity-45 uppercase text-center mt-6">NO ACTIVE COALITIONS</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Game Logs (Real-time telemetry feeds) */}
              <div className="h-64 p-4 border-t border-p1 flex flex-col justify-between flex-shrink-0">
                <h3 className="text-xs uppercase text-p1 opacity-60 mb-2 tracking-wider">TELEMETRY_FEED</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 font-mono text-[10px] leading-relaxed pr-2">
                  {logs.map((log) => (
                    <div key={log.id} className="border-b border-p1 border-opacity-10 pb-1">
                      <span className="opacity-40">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))}
                  <div ref={logEndRef}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Central Map Grid */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {/* Radar background grid */}
          <div className="radar-grid"></div>
          <div className="radar-sweep"></div>

          {/* On-Screen Combat Toast (Top Right Side, Compact) */}
          {lastCombatResult && (
            <div 
              key={lastCombatResult.id}
              className={`fixed top-20 right-6 z-40 px-3 py-2 border shadow-xl flex items-center gap-2 max-w-xs text-xs font-mono rounded ${
                lastCombatResult.type === 'conquer' ? 'bg-black border-green-500 text-green-400' :
                lastCombatResult.type === 'repelled' ? 'bg-black border-amber-500 text-amber-400' :
                lastCombatResult.type === 'scout_success' ? 'bg-black border-cyan-500 text-cyan-400' :
                'bg-black border-red-500 text-red-400'
              }`}
            >
              <span className="font-semibold uppercase truncate">{lastCombatResult.text}</span>
            </div>
          )}

          {/* Zoom / View Control Console (Floating Top-Left) */}
          <div className="absolute top-6 left-6 z-40 flex flex-col gap-1 border border-p1 border-opacity-40 p-1 bg-black bg-opacity-70 rounded">
            <button
              onClick={() => setZoom(prev => Math.min(4, prev + 0.25))}
              className="w-7 h-7 bg-black border border-p1 text-p1 font-bold text-sm flex items-center justify-center hover:bg-p1 hover:text-black rounded"
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.75, prev - 0.25))}
              className="w-7 h-7 bg-black border border-p1 text-p1 font-bold text-sm flex items-center justify-center hover:bg-p1 hover:text-black rounded"
              title="Zoom Out (-)"
            >
              −
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="w-7 h-7 bg-black border border-p1 text-p1 text-[10px] flex items-center justify-center hover:bg-p1 hover:text-black rounded"
              title="Reset View (0)"
            >
              ⟲
            </button>
            <button
              onClick={() => setShowHotkeyHelp(prev => !prev)}
              className="w-7 h-7 bg-black border border-p1 text-p1 text-[10px] flex items-center justify-center hover:bg-p1 hover:text-black rounded font-bold"
              title="Keyboard Shortcuts (H)"
            >
              ⌨
            </button>
          </div>

          {/* SVG Map Canvas */}
          <svg 
            ref={svgRef}
            viewBox="0 0 1000 700" 
            className="max-w-full max-h-full relative z-2 select-none cursor-grab active:cursor-grabbing touch-none"
            style={{ width: 'auto', height: 'auto', aspectRatio: '1000 / 700' }}
            onWheel={(e) => {
              e.preventDefault();
              const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
              setZoom(prev => Math.min(4, Math.max(0.75, prev * zoomFactor)));
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setSelectedNodeId(null);
              setTargetActionMode('none');
              if (soundEnabled) playSound.click();
            }}
            onPointerDown={(e) => {
              if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).id === 'map-bg') {
                setIsDragging(true);
                setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                (e.target as SVGElement).setPointerCapture(e.pointerId);
              }
            }}
            onPointerMove={(e) => {
              if (isDragging) {
                setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }
            }}
            onPointerUp={() => {
              setIsDragging(false);
            }}
          >
            {/* Background click target for panning */}
            <rect id="map-bg" x="0" y="0" width="1000" height="700" fill="transparent" pointerEvents="all" />

            {/* Scale & Pan Transform Group */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Lat & Long Ocean Grid */}
              <g opacity="0.12">
                {[120, 240, 360, 480, 600].map(y => (
                  <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="var(--glow-color)" strokeWidth="0.5" strokeDasharray="4,8" />
                ))}
                {[150, 300, 450, 600, 750, 900].map(x => (
                  <line key={`lng-${x}`} x1={x} y1="0" x2={x} y2="700" stroke="var(--glow-color)" strokeWidth="0.5" strokeDasharray="4,8" />
                ))}
              </g>

            {/* Detailed Realistic Continent Coastlines */}
            {DETAILED_CONTINENTS.map((cont, index) => (
              <path
                key={index}
                d={cont.d}
                stroke="var(--continent-stroke)"
                strokeWidth="1.75"
                fill="var(--continent-fill)"
                className="transition-all duration-500 opacity-90"
              />
            ))}

            {/* Country Territories (Updating Borders) */}
            {COUNTRY_PATHS.map((countryPath) => {
              const countryNodes = nodes.filter(n => n.countryId === countryPath.id);
              if (countryNodes.length === 0) return null; // Only draw countries active in the current era

              // Determine the owner of this country (capital owner or first node owner)
              const capitalNode = countryNodes.find(n => n.type === 'capital');
              const countryOwnerId = capitalNode ? capitalNode.ownerId : countryNodes[0]?.ownerId;
              const owner = countryOwnerId ? players.find(p => p.id === countryOwnerId) : null;

              const fillColor = owner ? owner.color : 'var(--country-unclaimed-fill)';
              const strokeColor = owner ? owner.color : 'var(--country-unclaimed-stroke)';
              const strokeWidth = owner ? '2' : '1';
              const fillOpacity = owner ? 0.16 : 0.02;

              return (
                <path
                  key={countryPath.id}
                  d={countryPath.d}
                  fill={fillColor}
                  fillOpacity={fillOpacity}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={owner ? undefined : '3,3'}
                  style={{ transition: 'fill 0.6s ease, stroke 0.6s ease, fill-opacity 0.6s ease' }}
                  pointerEvents="none"
                />
              );
            })}

            {/* Connection Lines */}
            {connections.map((c, index) => {
              const nodeFrom = nodes.find(n => n.id === c.from);
              const nodeTo = nodes.find(n => n.id === c.to);
              if (!nodeFrom || !nodeTo) return null;

              const isBarrier = !!c.barrierName;

              return (
                <g key={index}>
                  {/* Outer glow line */}
                  <line
                    x1={nodeFrom.x}
                    y1={nodeFrom.y}
                    x2={nodeTo.x}
                    y2={nodeTo.y}
                    stroke={isBarrier ? 'var(--p2-color)' : 'var(--border-color)'}
                    strokeWidth={isBarrier ? '3.5' : '1.5'}
                    strokeOpacity={isBarrier ? '0.4' : '0.6'}
                    className={isBarrier ? 'barrier-line' : ''}
                  />
                  {/* Core connector line */}
                  <line
                    x1={nodeFrom.x}
                    y1={nodeFrom.y}
                    x2={nodeTo.x}
                    y2={nodeTo.y}
                    stroke={isBarrier ? 'var(--p2-color)' : 'var(--connection-core)'}
                    strokeWidth={isBarrier ? '1.5' : '0.75'}
                    strokeDasharray={isBarrier ? '4,4' : undefined}
                  />
                  {/* Barrier Name Label */}
                  {isBarrier && (
                    <text
                      x={(nodeFrom.x + nodeTo.x) / 2}
                      y={(nodeFrom.y + nodeTo.y) / 2 - 8}
                      fill="#ffb700"
                      fontSize="8"
                      textAnchor="middle"
                      className="font-bold opacity-80"
                    >
                      {c.barrierName!.toUpperCase()} ({c.defenseMultiplier}x)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Traveling troops / explorers bubbles */}
            {transits.map((t) => {
              const nodeFrom = nodes.find(n => n.id === t.sourceNodeId);
              const nodeTo = nodes.find(n => n.id === t.targetNodeId);
              const owner = players.find(p => p.id === t.ownerId);
              if (!nodeFrom || !nodeTo) return null;

              // Calculate current x/y along the line based on progress
              const x = nodeFrom.x + (nodeTo.x - nodeFrom.x) * t.progress;
              const y = nodeFrom.y + (nodeTo.y - nodeFrom.y) * t.progress;

              const trailOffsets = [0.03, 0.06, 0.09];

              return (
                <g key={t.id}>
                  {/* Glowing Comet Trails */}
                  {trailOffsets.map((offset, idx) => {
                    const trailProgress = Math.max(0, t.progress - offset);
                    if (trailProgress <= 0 || trailProgress >= 1) return null;
                    const tx = nodeFrom.x + (nodeTo.x - nodeFrom.x) * trailProgress;
                    const ty = nodeFrom.y + (nodeTo.y - nodeFrom.y) * trailProgress;
                    return (
                      <circle
                        key={`${t.id}-trail-${idx}`}
                        cx={tx}
                        cy={ty}
                        r={t.isExplorer ? 4 - idx : 5 - idx}
                        fill={t.isExplorer ? '#ff9f00' : (owner?.color || 'var(--p1-color)')}
                        opacity={0.6 - idx * 0.2}
                        pointerEvents="none"
                      />
                    );
                  })}
                  {/* Bubble body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={t.isExplorer ? 6 : 7}
                    fill={t.isExplorer ? '#ff9f00' : (owner?.color || 'var(--p1-color)')}
                    stroke="#000"
                    strokeWidth="1.5"
                    className="glow-border animate-pulse"
                  />
                  {/* Icon inside bubble */}
                  {t.isExplorer ? (
                    <text
                      x={x}
                      y={y + 3}
                      fill="#000"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ▲
                    </text>
                  ) : (
                    <text
                      x={x}
                      y={y + 3.5}
                      fill="#000"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {t.count}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Country Nodes */}
            {nodes.map((node) => {
              const owner = players.find(p => p.id === node.ownerId);
              const isSelected = node.id === selectedNodeId;
              
              // Determine coordinate values
              const color = owner?.color || 'var(--neutral-color)';
              
              // Vulnerability blinking state
              const isVulnerable = node.vulnerableUntil ? node.vulnerableUntil > Date.now() : false;

              // Check if currently scouted by user
              const isScouted = node.scoutedBy[currentUserId] ? node.scoutedBy[currentUserId] > Date.now() : false;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                  onMouseEnter={(e) => {
                    setHoveredNodeId(node.id);
                    setCursorPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setCursorPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => {
                    setHoveredNodeId(null);
                  }}
                >
                  {/* Broad transparent mobile tap hitbox (Radius 20) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="transparent"
                    pointerEvents="all"
                  />

                  {/* Target Action Highlight ring */}
                  {targetActionMode !== 'none' && selectedNodeId && (
                    targetActionMode === 'attack'
                      ? canReachNode(selectedNodeId, node.id, currentUserId, nodes, connections, alliances)
                      : getConnection(selectedNodeId, node.id)
                  ) && (
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="none"
                      stroke={targetActionMode === 'attack' ? '#ff3b30' : '#ff9f00'}
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      className="animate-spin"
                      style={{ animationDuration: '4s' }}
                    />
                  )}

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Vulnerability Alarm ring */}
                  {isVulnerable && (
                    <circle
                      cx="0"
                      cy="0"
                      r="24"
                      fill="none"
                      stroke="#ff3b30"
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  )}

                  {/* Capital command pulse */}
                  {node.type === 'capital' && (
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      className="capital-pulse"
                      pointerEvents="none"
                    />
                  )}

                  {/* Fortification outer ring */}
                  {node.isFortified && (
                    <circle
                      cx="0"
                      cy="0"
                      r="18"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Node fill circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill="#000000"
                    stroke={color}
                    strokeWidth="2.5"
                    className="glow-border"
                  />

                  {/* Telemetry numbers / indicators inside circle */}
                  <text
                    cx="0"
                    cy="0"
                    y="3.5"
                    fill={color}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {node.troops}
                  </text>

                  {/* Scouted checkmark overlay */}
                  {isScouted && (
                    <text
                      x="9"
                      y="-9"
                      fill="var(--glow-color)"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      👁
                    </text>
                  )}

                  {/* Node Type tag */}
                  <g transform="translate(0, -22)">
                    <rect
                      x="-18"
                      y="-6"
                      width="36"
                      height="12"
                      fill="#000000"
                      stroke={color}
                      strokeWidth="0.75"
                    />
                    <text
                      y="3"
                      fill={color}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.type === 'capital' ? '★ CAP' : node.type === 'military_base' ? '⚔ BASE' : '🏙 CIT'}
                    </text>
                  </g>

                  {/* Node Name labels */}
                  <g transform="translate(0, 24)">
                    <rect
                      x="-45"
                      y="-5"
                      width="90"
                      height="10"
                      fill="#000000"
                      fillOpacity="1"
                    />
                    <text
                      y="3"
                      fill="#fff"
                      fontSize="8"
                      textAnchor="middle"
                      className="opacity-90 font-semibold"
                    >
                      {node.name.toUpperCase()}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Animated Troop & Scout Trajectories */}
            {activePayloads.map((payload) => {
              const curX = payload.fromX + (payload.toX - payload.fromX) * payload.progress;
              const curY = payload.fromY + (payload.toY - payload.fromY) * payload.progress;
              return (
                <g key={payload.id} pointerEvents="none">
                  <line
                    x1={payload.fromX}
                    y1={payload.fromY}
                    x2={curX}
                    y2={curY}
                    stroke={payload.color}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.8"
                  />
                  <circle
                    cx={curX}
                    cy={curY}
                    r={payload.isScout ? "8" : "10"}
                    fill="#000"
                    stroke={payload.color}
                    strokeWidth="2"
                    className="animate-ping"
                  />
                  <text
                    x={curX}
                    y={curY + 3.5}
                    fill={payload.color}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {payload.isScout ? '👁' : '⚔'}
                  </text>
                  <g transform={`translate(${curX}, ${curY - 14})`}>
                    <rect x="-25" y="-7" width="50" height="12" fill="#000000" stroke={payload.color} strokeWidth="0.75" />
                    <text y="2" fill={payload.color} fontSize="8" fontWeight="bold" textAnchor="middle">
                      {payload.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

          {/* Floating Hover Tactical Tooltip Card */}
          {hoveredNodeId && (() => {
            const hNode = nodes.find(n => n.id === hoveredNodeId);
            if (!hNode) return null;
            const hOwner = players.find(p => p.id === hNode.ownerId);
            const isConn = selectedNodeId && getConnection(selectedNodeId, hNode.id);

            return (
              <div 
                className="fixed z-50 pointer-events-none p-3 bg-black border-2 border-p1 shadow-2xl space-y-1 font-mono text-xs max-w-xs"
                style={{ top: cursorPos.y + 15, left: cursorPos.x + 15 }}
              >
                <div className="font-bold text-white uppercase flex justify-between gap-4 border-b border-p1 border-opacity-30 pb-1">
                  <span>{hNode.name}</span>
                  <span className="text-p2">{'★'.repeat(hNode.stars)}</span>
                </div>
                <div className="text-p1 opacity-70 text-[10px] uppercase">
                  Territory: {hNode.countryName} ({hNode.type})
                </div>
                <div className="text-[11px] pt-1 flex justify-between gap-4">
                  <span className="opacity-60">Sovereign:</span>
                  <span className="font-bold" style={{ color: hOwner?.color || 'var(--neutral-color)' }}>
                    {getEmpireName(hOwner, hNode.countryName)} {hOwner ? `(${hOwner.name})` : ''}
                  </span>
                </div>
                <div className="text-[11px] flex justify-between gap-4">
                  <span className="opacity-60">Garrison:</span>
                  <span className="font-bold text-white">{hNode.troops} Battalions</span>
                </div>
                <div className="text-[9px] pt-1.5 border-t border-p1 border-opacity-30 uppercase">
                  {targetActionMode === 'attack' && isConn ? (
                    <span className="text-green-400 font-bold animate-pulse">▶ CLICK TO MARCH FORCES HERE ({troopPercentage}%)</span>
                  ) : targetActionMode === 'explore' && isConn ? (
                    <span className="text-amber-400 font-bold animate-pulse">▶ CLICK TO SCOUT INTEL HERE</span>
                  ) : (
                    <span className="text-p1 opacity-60">Click node to target or inspect telemetry</span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Side: Control Actions & Details */}
        <div 
          className={`${rightCollapsed ? 'w-0 border-l-0' : 'w-80 border-l'} border-p1 flex flex-col justify-between bg-black bg-opacity-70 z-10 h-full relative transition-all duration-300 overflow-visible`}
        >
          {/* Collapse Handle Tab */}
          <button
            onClick={() => { if (soundEnabled) playSound.click(); setRightCollapsed(!rightCollapsed); }}
            className="absolute top-1/2 right-full transform -translate-y-1/2 bg-black border border-p1 text-p1 p-1 text-[10px] z-20 cursor-pointer hover:bg-p1 hover:text-black transition-colors flex items-center justify-center rounded-l"
            style={{ height: '60px', width: '16px', borderRight: 'none' }}
            title={rightCollapsed ? "EXPAND_COMMANDS" : "COLLAPSE_COMMANDS"}
          >
            {rightCollapsed ? '◀' : '▶'}
          </button>

          {!rightCollapsed && (
            <div className="flex-1 flex flex-col overflow-hidden h-full justify-between">
              {/* Selected Node Details */}
              <div className="p-4 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <h3 className="text-xs uppercase text-p1 opacity-60 mb-3 tracking-wider">NODE_TELEMETRY</h3>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-black border border-p1">
                      <div className="text-base font-bold text-white uppercase tracking-wider mb-1 flex justify-between">
                        <span>{selectedNode.name}</span>
                        <span className="text-p2">{'★'.repeat(selectedNode.stars)}</span>
                      </div>
                      <div className="text-[10px] text-p1 opacity-70 uppercase mb-3">
                        Nation: {selectedNode.countryName}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="text-p1 opacity-60">SOVEREIGN:</div>
                        <div className="font-semibold truncate flex flex-col" style={{ color: players.find(p => p.id === selectedNode.ownerId)?.color || 'var(--neutral-color)' }}>
                          <span>{getEmpireName(players.find(p => p.id === selectedNode.ownerId), selectedNode.countryName).toUpperCase()}</span>
                          {selectedNode.ownerId && (
                            <span className="text-[9px] opacity-60 font-normal">
                              ({players.find(p => p.id === selectedNode.ownerId)?.name})
                            </span>
                          )}
                        </div>
                        
                        <div className="text-p1 opacity-60">INFRA_TYPE:</div>
                        <div className="font-semibold uppercase">{selectedNode.type}</div>

                        <div className="text-p1 opacity-60">TROOPS:</div>
                        <div className="font-semibold text-white">{selectedNode.troops}</div>

                        <div className="text-p1 opacity-60">REGEN_RATE:</div>
                        <div className="font-semibold">
                          +{selectedNode.type === 'capital' ? '1.0' : selectedNode.type === 'city' ? '0.8' : '0.4'}/s
                        </div>
                      </div>
                    </div>

                    {/* Node active modifiers */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase text-p1 opacity-60 tracking-wider">ACTIVE_MODIFIERS</h4>
                      
                      {selectedNode.isFortified && (
                        <div className="p-2 border border-p1 text-[10px] bg-p1 bg-opacity-10 flex gap-2 items-center">
                          <Shield className="w-3.5 h-3.5 text-p1" />
                          <span>SYS_FORT_ON: Defense 1.5x (2.0x for 1★) / Production -50%</span>
                        </div>
                      )}

                      {selectedNode.vulnerableUntil && selectedNode.vulnerableUntil > Date.now() && (
                        <div className="p-2 border border-red-500 text-[10px] bg-red-950 bg-opacity-10 text-red-400 flex gap-2 items-center animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>WARN: SYS_DEPL - Attacking vulnerable (Defense 0.5x, Production 0)</span>
                        </div>
                      )}

                      {selectedNode.scoutedBy[currentUserId] && selectedNode.scoutedBy[currentUserId] > Date.now() && (
                        <div className="p-2 border border-p2 text-[10px] bg-p2 bg-opacity-10 text-p2 flex gap-2 items-center">
                          <Eye className="w-3.5 h-3.5" />
                          <span>SCOUT_INTEL: +25% Attack Multiplier Active</span>
                        </div>
                      )}

                      {!selectedNode.isFortified && !selectedNode.vulnerableUntil && !selectedNode.scoutedBy[currentUserId] && (
                        <div className="text-xs text-p1 opacity-45 uppercase">No active tactical status updates.</div>
                      )}
                    </div>

                    {/* Actions Panel (if owned by user) */}
                    {selectedNode.ownerId === currentUserId && (
                      <div className="border-t border-p1 border-opacity-30 pt-4 space-y-3">
                        <h4 className="text-[10px] uppercase text-p1 opacity-60 tracking-wider">COMMANDS</h4>
                        
                        <button
                          onClick={handleFortify}
                          disabled={selectedNode.troops <= 1}
                          className="w-full btn-radar py-2 text-xs uppercase font-semibold flex items-center justify-center gap-2 border-p1"
                        >
                          <Shield className="w-4 h-4" /> 
                          {selectedNode.isFortified ? 'DEACTIVATE_FORTIFY' : 'ACTIVATE_FORTIFY'}
                        </button>

                        <button
                          onClick={() => triggerAction('attack')}
                          disabled={selectedNode.troops <= 1}
                          className={`w-full btn-radar py-2 text-xs uppercase font-semibold flex items-center justify-center gap-2 border-p1 ${
                            targetActionMode === 'attack' ? 'bg-p1 bg-opacity-25 glow-border' : ''
                          }`}
                        >
                          <Target className="w-4 h-4" /> 
                          {targetActionMode === 'attack' ? 'SELECT_TARGET_NODE...' : 'LAUNCH_EXPEDITION'}
                        </button>

                        <button
                          onClick={() => triggerAction('explore')}
                          disabled={selectedNode.troops <= 5}
                          className={`w-full btn-radar py-2 text-xs uppercase font-semibold flex items-center justify-center gap-2 border-p1 ${
                            targetActionMode === 'explore' ? 'bg-p1 bg-opacity-25 glow-border' : ''
                          }`}
                        >
                          <Compass className="w-4 h-4" /> 
                          {targetActionMode === 'explore' ? 'SELECT_SCOUT_NODE...' : 'LEWIS_&_CLARK_SCOUT'}
                        </button>
                        
                        {/* Launch slider */}
                        {targetActionMode === 'attack' && (
                          <div className="p-3 bg-black border border-p1 space-y-2">
                            <div className="flex justify-between text-[10px] text-p1 opacity-80 uppercase">
                              <span>Payload Ratio</span>
                              <span>{troopPercentage}% ({Math.max(1, Math.round(((selectedNode.troops || 1) - 1) * (troopPercentage / 100)))} forces)</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={troopPercentage}
                              onChange={(e) => setTroopPercentage(Number(e.target.value))}
                              className="w-full bg-black border border-p1 accent-p1"
                            />
                            <div className="grid grid-cols-3 gap-1">
                              <button onClick={() => setTroopPercentage(25)} className="px-1 py-0.5 border border-p1 text-[8px] text-center hover:bg-p1 hover:bg-opacity-25">25%</button>
                              <button onClick={() => setTroopPercentage(50)} className="px-1 py-0.5 border border-p1 text-[8px] text-center hover:bg-p1 hover:bg-opacity-25">50%</button>
                              <button onClick={() => setTroopPercentage(100)} className="px-1 py-0.5 border border-p1 text-[8px] text-center hover:bg-p1 hover:bg-opacity-25">100%</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-p1 opacity-45 uppercase text-center mt-8 leading-relaxed">
                    SELECT NODE ON TELEMETRY GRID TO DISPLAY STATUS REPORT
                  </div>
                )}
              </div>

              {/* Footer warning indicators */}
              <div className="p-4 border-t border-p1 bg-black bg-opacity-40 flex-shrink-0">
                <div className="text-[9px] font-mono leading-relaxed text-p1 opacity-50 uppercase">
                  SECTOR_STATUS: ACTIVE_COMBAT_DRAFT
                  <br />
                  SYS_INTEGRITY: 99.8% (VECTOR_OK)
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 4. Game Over Modal */}
      {winnerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="radar-panel max-w-md w-full p-6 text-center glow-border border-p1">
            <h1 className="text-3xl font-bold mb-4 tracking-widest text-p1 animate-pulse">
              CAMPAIGN_RESOLVED
            </h1>
            <div className="loader-bar mb-6"></div>

            <Award className="w-16 h-16 mx-auto mb-4 text-p2" />

            <div className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {Array.isArray(winnerId) ? (
                <span>Coalition Victory: {winnerId.map(id => getEmpireName(players.find(p => p.id === id))).join(' & ')}</span>
              ) : (
                <span>Dominant Empire: {getEmpireName(players.find(p => p.id === winnerId))} ({players.find(p => p.id === winnerId)?.name})</span>
              )}
            </div>

            <p className="text-xs leading-relaxed text-p1 opacity-80 mb-6 uppercase">
              Global operations terminated. All opposing terminal signals deactivated. Map sovereignty established.
            </p>

            <button
              onClick={() => { if (soundEnabled) playSound.ping(); onReset(); }}
              className="w-full btn-radar py-2 text-sm font-semibold uppercase flex items-center justify-center gap-2 border-p1"
            >
              <RefreshCw className="w-4 h-4" /> Start New Deployment
            </button>
          </div>
        </div>
      )}

      {/* 5. Desktop Keyboard Shortcuts Modal */}
      {showHotkeyHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 font-mono">
          <div className="radar-panel max-w-lg w-full p-6 glow-border border-p1 relative text-p1">
            <button
              onClick={() => setShowHotkeyHelp(false)}
              className="absolute top-4 right-4 text-p1 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-4 border-b border-p1 pb-3">
              <Keyboard className="w-5 h-5 text-p1" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                TACTICAL KEYBOARD COMMANDS
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">ATTACK MODE</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">A</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">SCOUT MODE</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">S</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">TOGGLE FORTIFY</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">F</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">DESELECT / CANCEL</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">ESC / SPACE</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">TROOP RATIO (25%-100%)</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">1 - 4</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">CAPITAL FOCUS</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">C</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">CYCLE OWNED NODES</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">TAB</kbd>
              </div>
              <div className="p-2 border border-p1 border-opacity-40 bg-black flex justify-between items-center">
                <span className="opacity-70">ZOOM IN / OUT / RESET</span>
                <kbd className="px-2 py-0.5 bg-p1 bg-opacity-20 border border-p1 text-p1 font-bold rounded">+ / - / 0</kbd>
              </div>
            </div>

            <div className="text-[10px] text-p1 opacity-60 border-t border-p1 pt-3 uppercase leading-relaxed">
              💡 PRO-TIP: Click an owned territory node, then click a target node or use keys A/S/F to command troops! Right-click anywhere to cancel.
            </div>

            <button
              onClick={() => setShowHotkeyHelp(false)}
              className="w-full mt-4 btn-radar py-2 text-xs uppercase font-semibold border-p1"
            >
              CLOSE COMMAND SHEET
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
