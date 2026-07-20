import { useState, useEffect, useRef } from 'react';
import type { Player, TransitTroops, Alliance, GameLog, GameState, Posture, CountryNode } from './types/game';
import { ERAS } from './constants/eras';
import { RenderConfig } from './components/RenderConfig';
import { Lobby } from './components/Lobby';
import { Preamble } from './components/Preamble';
import { RockPaperScissors } from './components/RockPaperScissors';
import { CountrySelection } from './components/CountrySelection';
import { GameBoard } from './components/GameBoard';
import { playSound } from './utils/audio';
import { TutorialModal } from './components/TutorialModal';

// Helper to check if two players are allied
const areAllied = (playerAId: string | null, playerBId: string | null, alliances: Alliance[]) => {
  if (!playerAId || !playerBId || playerAId === playerBId) return false;
  return alliances.some(
    a => a.status === 'active' && a.members.includes(playerAId) && a.members.includes(playerBId)
  );
};

const areInTruce = (playerAId: string | null, playerBId: string | null, alliances: Alliance[]) => {
  if (!playerAId || !playerBId || playerAId === playerBId) return false;
  return alliances.some(
    a => a.status === 'truce' && a.members.includes(playerAId) && a.members.includes(playerBId)
  );
};

// Helper to generate a random room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Generate user ID and default name
const myPlayerId = 'usr_' + Math.random().toString(36).substring(2, 9);
const myPlayerName = 'COMMANDER_' + Math.floor(1000 + Math.random() * 9000);
const playerColors = [
  '#33ff66', // Green
  '#ffb700', // Amber
  '#00e5ff', // Cyan
  '#e040fb', // Violet
];

export default function App() {
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>('');
  
  // Core game state
  const [gameState, setGameState] = useState<GameState>({
    roomId: '',
    roomCode: '',
    eraId: 'modern',
    phase: 'lobby',
    players: [],
    nodes: [],
    connections: [],
    transits: [],
    alliances: [],
    logs: [],
    winnerId: null,
  });

  // Track if a tie happened in the current RPS round
  const [tieOccurred, setTieOccurred] = useState<boolean>(false);

  // Ref to hold state for animation loop updates
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const handlePlayOffline = () => {
    setIsOffline(true);
    initializeOfflineLobby();
  };

  const handleHostGame = (url: string) => {
    setIsConnecting(true);
    setConnectionError('');
    
    const host: Player = {
      id: myPlayerId,
      name: myPlayerName,
      color: playerColors[0],
      starsAssigned: null,
      selectedCountryId: null,
      posture: null,
      isHost: true,
      isBot: false,
      isAlive: true,
    };

    setGameState(prev => ({
      ...prev,
      roomId: 'hosting',
      players: [host]
    }));

    initializeOnlineLobby(url);
  };

  const handleJoinGame = (url: string, code: string) => {
    setIsConnecting(true);
    setConnectionError('');

    const guest: Player = {
      id: myPlayerId,
      name: myPlayerName,
      color: playerColors[1],
      starsAssigned: null,
      selectedCountryId: null,
      posture: null,
      isHost: false,
      isBot: false,
      isAlive: true,
    };

    setGameState(prev => ({
      ...prev,
      roomId: `online_${code}`,
      roomCode: code,
      players: [guest]
    }));

    joinOnlineLobby(url, code, guest);
  };

  // ----------------------------------------------------
  // OFFLINE GAME LAUNCH
  // ----------------------------------------------------
  const initializeOfflineLobby = () => {
    const code = generateRoomCode();
    const host: Player = {
      id: myPlayerId,
      name: myPlayerName,
      color: playerColors[0],
      starsAssigned: null,
      selectedCountryId: null,
      posture: null,
      isHost: true,
      isBot: false,
      isAlive: true,
    };
    
    setGameState({
      roomId: 'local_room',
      roomCode: code,
      eraId: 'modern',
      phase: 'lobby',
      players: [host],
      nodes: [],
      connections: [],
      transits: [],
      alliances: [],
      logs: [{ id: 'init', message: 'Offline combat console activated.', timestamp: new Date().toLocaleTimeString() }],
      winnerId: null,
    });
  };

  const handleAddBot = () => {
    if (gameState.players.length >= 4) return;
    const botCount = gameState.players.filter(p => p.isBot).length;
    const botColor = playerColors[gameState.players.length];
    
    const bot: Player = {
      id: `bot_${botCount}_${Math.random().toString(36).substring(2, 6)}`,
      name: `COMBAT_BOT_${botCount + 1}`,
      color: botColor,
      starsAssigned: null,
      selectedCountryId: null,
      posture: null,
      isHost: false,
      isBot: true,
      isAlive: true,
    };

    updateGameState({
      players: [...gameState.players, bot],
      logs: addLog(`AI Terminal sync: ${bot.name} online.`)
    });
  };

  const handleRemovePlayer = (id: string) => {
    updateGameState({
      players: gameState.players.filter(p => p.id !== id),
      logs: addLog(`Terminal disconnected.`)
    });
  };

  // ----------------------------------------------------
  // ONLINE MATCHMAKING (Render WebSockets)
  // ----------------------------------------------------
  const initializeOnlineLobby = (serverUrl: string) => {
    const code = generateRoomCode();
    const ws = new WebSocket(serverUrl);
    
    ws.onopen = () => {
      setIsConnecting(false);
      setRenderUrl(serverUrl);
      setGameState(prev => ({
        ...prev,
        roomId: `online_${code}`,
        roomCode: code,
        logs: [{ id: 'init', message: `Encrypted lobby hosting on ${code}`, timestamp: new Date().toLocaleTimeString() }]
      }));
    };

    ws.onmessage = async (event) => {
      try {
        let text = '';
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else if (typeof event.data === 'string') {
          text = event.data;
        } else if (event.data instanceof ArrayBuffer) {
          text = new TextDecoder().decode(event.data);
        } else {
          text = event.data.toString();
        }

        const msg = JSON.parse(text);
        if (msg.roomCode !== code) return; // Room filter!

        switch (msg.event) {
          case 'player_join':
            handleOnlinePlayerJoined(msg.data);
            break;
          case 'state_sync':
            handleOnlineStateSync(msg.data);
            break;
          case 'action':
            handleOnlineAction({ senderId: msg.senderId, event: msg.data.event, data: msg.data.data });
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket connection error:', err);
      setIsConnecting(false);
      setConnectionError('Connection failed. Server might be booting up or offline.');
      setRenderUrl(null);
    };

    ws.onclose = () => {
      setIsConnecting(false);
      setRenderUrl(null);
      setGameState(prev => ({
        ...prev,
        logs: [...prev.logs, { id: 'disc', message: 'Connection to server lost.', timestamp: new Date().toLocaleTimeString() }]
      }));
    };

    setSocket(ws);
  };

  const joinOnlineLobby = (serverUrl: string, code: string, guest: Player) => {
    const ws = new WebSocket(serverUrl);
    
    ws.onopen = () => {
      setIsConnecting(false);
      setRenderUrl(serverUrl);
      setGameState(prev => ({
        ...prev,
        logs: [{ id: 'init_join', message: `Connected to sector ${code}. Awaiting host data...`, timestamp: new Date().toLocaleTimeString() }]
      }));

      // Signal join to host
      ws.send(JSON.stringify({
        roomCode: code,
        event: 'player_join',
        data: { player: guest }
      }));
    };

    ws.onmessage = async (event) => {
      try {
        let text = '';
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else if (typeof event.data === 'string') {
          text = event.data;
        } else if (event.data instanceof ArrayBuffer) {
          text = new TextDecoder().decode(event.data);
        } else {
          text = event.data.toString();
        }

        const msg = JSON.parse(text);
        if (msg.roomCode !== code) return; // Room filter!

        switch (msg.event) {
          case 'player_join':
            handleOnlinePlayerJoined(msg.data);
            break;
          case 'state_sync':
            handleOnlineStateSync(msg.data);
            break;
          case 'action':
            handleOnlineAction({ senderId: msg.senderId, event: msg.data.event, data: msg.data.data });
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket connection error:', err);
      setIsConnecting(false);
      setConnectionError('Connection failed. Server might be booting up or offline.');
      setRenderUrl(null);
    };

    ws.onclose = () => {
      setIsConnecting(false);
      setRenderUrl(null);
      setGameState(prev => ({
        ...prev,
        logs: [...prev.logs, { id: 'disc', message: 'Connection to server lost.', timestamp: new Date().toLocaleTimeString() }]
      }));
    };

    setSocket(ws);
  };

  const handleOnlinePlayerJoined = (payload: { player: Player }) => {
    if (!stateRef.current.players.some(p => p.id === payload.player.id)) {
      const updatedPlayers = [...stateRef.current.players, {
        ...payload.player,
        color: playerColors[stateRef.current.players.length]
      }];
      
      updateGameState({
        players: updatedPlayers,
        logs: addLog(`Remote terminal connected: ${payload.player.name}`)
      });

      // Host syncs state to new joiners
      const myPlayer = stateRef.current.players.find(p => p.id === myPlayerId);
      if (myPlayer?.isHost && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          roomCode: stateRef.current.roomCode,
          event: 'state_sync',
          data: { state: { ...stateRef.current, players: updatedPlayers } }
        }));
      }
    }
  };

  const handleOnlineStateSync = (payload: { state: GameState }) => {
    // Only non-hosts follow state sync
    const myPlayer = stateRef.current.players.find(p => p.id === myPlayerId);
    const isMeHost = myPlayer?.isHost === true;
    if (!isMeHost) {
      setGameState(payload.state);
    }
  };

  // Helper to send game actions over broadcast channel
  const broadcastAction = (event: string, data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        roomCode: stateRef.current.roomCode,
        senderId: myPlayerId,
        event: 'action',
        data: { event, data }
      }));
    }
  };

  const handleOnlineAction = (payload: { senderId: string; event: string; data: any }) => {
    const { event, data } = payload;
    
    switch (event) {
      case 'posture_submit':
        handlePostureChosen(payload.senderId, data.posture);
        break;
      case 'country_draft':
        handleCountryDrafted(payload.senderId, data.countryId);
        break;
      case 'fortify_toggle':
        handleFortifyToggled(data.nodeId);
        break;
      case 'launch_transit':
        handleLaunchTransitBroadcast(data);
        break;
      case 'alliance_propose':
        handleAllianceProposedBroadcast(data.senderId || payload.senderId, data.targetId);
        break;
      case 'alliance_accept':
        handleAllianceAcceptedBroadcast(data.allianceId);
        break;
      case 'alliance_reject':
        handleAllianceRejectedBroadcast(data.allianceId);
        break;
      case 'alliance_break':
        handleAllianceBrokenBroadcast(data.allianceId);
        break;
      default:
        break;
    }
  };

  // ----------------------------------------------------
  // GENERAL GAME STATEMACHINE TRANSITIONS
  // ----------------------------------------------------
  const updateGameState = (updatedFields: Partial<GameState>) => {
    setGameState(prev => {
      const next = { ...prev, ...updatedFields };
      // Keep online non-hosts synchronized from broadcast events
      return next;
    });
  };

  const addLog = (msg: string): GameLog[] => {
    const time = new Date().toLocaleTimeString();
    const logItem: GameLog = {
      id: Math.random().toString(36).substring(2, 9),
      message: msg,
      timestamp: time,
    };
    return [...stateRef.current.logs, logItem];
  };

  const handleStartGame = () => {
    updateGameState({
      phase: 'preamble',
      logs: addLog('Decrypting historical chronologies...')
    });
    
    if (!isOffline) {
      broadcastAction('phase_change', { phase: 'preamble' });
    }
  };

  const handlePreambleComplete = () => {
    updateGameState({
      phase: 'rps',
      logs: addLog('Establishing tactical postures for drafting bracket determination.')
    });
  };

  // ----------------------------------------------------
  // RPS POSTURE LOGIC
  // ----------------------------------------------------
  const handleSelectPosture = (posture: Posture) => {
    handlePostureChosen(myPlayerId, posture);
    
    if (!isOffline) {
      broadcastAction('posture_submit', { posture });
    }
  };

  const handlePostureChosen = (playerId: string, posture: Posture) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p => 
        p.id === playerId ? { ...p, posture } : p
      );
      
      const allSubmitted = updatedPlayers.every(p => p.posture !== null || p.isBot);
      
      let nextPhase = prev.phase;
      let logs = [...prev.logs];
      let players = updatedPlayers;
      let nextTie = false;

      if (allSubmitted) {
        // If in offline mode, make bots pick postures
        const finalPlayers = updatedPlayers.map(p => {
          if (p.isBot && p.posture === null) {
            const postures: Posture[] = ['offensive', 'defensive', 'infiltration'];
            const botPosture = postures[Math.floor(Math.random() * postures.length)];
            return { ...p, posture: botPosture };
          }
          return p;
        });

        // Resolve outcomes
        const resolved = resolvePostureBrackets(finalPlayers);
        
        if (resolved.isTie) {
          nextTie = true;
          // Reset postures for a replay
          players = finalPlayers.map(p => ({ ...p, posture: null }));
          const time = new Date().toLocaleTimeString();
          logs.push({
            id: Math.random().toString(),
            message: 'Conflict tie! Posture alignment failed. Re-calibrating immediately.',
            timestamp: time
          });
        } else {
          players = resolved.players;
          nextPhase = 'selection';
          const time = new Date().toLocaleTimeString();
          logs.push({
            id: Math.random().toString(),
            message: 'Brackets resolved. Initiating starting territory draft.',
            timestamp: time
          });
        }
      }

      setTieOccurred(nextTie);

      return {
        ...prev,
        players,
        phase: nextPhase,
        logs
      };
    });
  };

  // Resolves Rock-Paper-Scissors head-to-head matchups for 2-4 players
  const resolvePostureBrackets = (currentPlayers: Player[]): { players: Player[]; isTie: boolean } => {
    // Determine wins for each player
    const scoreMap: { [id: string]: number } = {};
    currentPlayers.forEach(p => { scoreMap[p.id] = 0; });

    for (let i = 0; i < currentPlayers.length; i++) {
      for (let j = i + 1; j < currentPlayers.length; j++) {
        const p1 = currentPlayers[i];
        const p2 = currentPlayers[j];
        
        if (p1.posture === p2.posture) continue;

        // Defensive (Rock) beats Offensive (Scissors)
        // Offensive (Scissors) beats Infiltration (Paper)
        // Infiltration (Paper) beats Defensive (Rock)
        if (
          (p1.posture === 'defensive' && p2.posture === 'offensive') ||
          (p1.posture === 'offensive' && p2.posture === 'infiltration') ||
          (p1.posture === 'infiltration' && p2.posture === 'defensive')
        ) {
          scoreMap[p1.id]++;
        } else {
          scoreMap[p2.id]++;
        }
      }
    }

    // Sort players by score
    const sorted = [...currentPlayers].sort((a, b) => scoreMap[b.id] - scoreMap[a.id]);

    // Check if there is a flat tie where everyone got the same score
    const firstScore = scoreMap[sorted[0].id];
    const allSame = sorted.every(p => scoreMap[p.id] === firstScore);
    if (allSame && currentPlayers.length > 2) {
      return { players: currentPlayers, isTie: true };
    }

    // Map sorted spots to stars brackets
    // 1st: 3 Stars, 2nd: 2 Stars, 3rd/4th: 1 Star
    const updatedPlayers = currentPlayers.map(p => {
      const idx = sorted.findIndex(s => s.id === p.id);
      let starsAssigned: 1 | 2 | 3 = 1;
      if (idx === 0) starsAssigned = 3;
      else if (idx === 1) starsAssigned = 2;
      
      return {
        ...p,
        starsAssigned
      };
    });

    return { players: updatedPlayers, isTie: false };
  };

  // ----------------------------------------------------
  // COUNTRY DRAFT SELECTION
  // ----------------------------------------------------
  const handleSelectCountry = (countryId: string) => {
    handleCountryDrafted(myPlayerId, countryId);

    if (!isOffline) {
      broadcastAction('country_draft', { countryId });
    }
  };

  const handleCountryDrafted = (playerId: string, countryId: string) => {
    setGameState(prev => {
      // Find the player
      const updatedPlayers = prev.players.map(p => 
        p.id === playerId ? { ...p, selectedCountryId: countryId } : p
      );

      // Check if all players have completed drafting
      const allDrafted = updatedPlayers.every(p => p.selectedCountryId !== null || p.isBot);

      let nextPhase = prev.phase;
      let nodes = [...prev.nodes];
      let connections = [...prev.connections];
      let players = updatedPlayers;
      let logs = [...prev.logs];

      if (allDrafted) {
        const era = ERAS.find(e => e.id === prev.eraId) || ERAS[0];
        nodes = JSON.parse(JSON.stringify(era.nodes));
        connections = JSON.parse(JSON.stringify(era.connections));

        // Assign starting country nodes to players
        const finalPlayers = [...updatedPlayers];
        for (let i = 0; i < finalPlayers.length; i++) {
          const p = finalPlayers[i];
          if (p.isBot && p.selectedCountryId === null) {
            // Bot selects random available country in their bracket
            const grouped = era.nodes.reduce((acc: string[], n: CountryNode) => {
              if (n.stars === p.starsAssigned && !acc.includes(n.countryId)) acc.push(n.countryId);
              return acc;
            }, [] as string[]);
            
            const picked = finalPlayers.map(fp => fp.selectedCountryId).filter(Boolean) as string[];
            const available = grouped.filter((cId: string) => !picked.includes(cId));
            const botChoice = available[Math.floor(Math.random() * available.length)] || grouped[0];
            finalPlayers[i] = { ...p, selectedCountryId: botChoice };
          }
        }

        players = finalPlayers;

        // Color and occupy nodes for each player
        nodes.forEach(node => {
          const owner = finalPlayers.find(p => p.selectedCountryId === node.countryId);
          if (owner) {
            node.ownerId = owner.id;
            if (node.type === 'capital') {
              node.troops = 25;
            } else {
              node.troops = 15;
            }
            // 1-star handicaps starts with +15 extra troops
            if (owner.starsAssigned === 1) {
              node.troops += 15;
            }
          } else {
            // Lower neutral garrison for easy early player expansion
            node.troops = Math.min(node.troops, 6);
          }
        });

        nextPhase = 'game';
        const time = new Date().toLocaleTimeString();
        logs.push({
          id: Math.random().toString(),
          message: 'Draft completed. Sovereign boundaries initialized. Game active.',
          timestamp: time
        });
        
        playSound.victoryFanfare();
      }

      return {
        ...prev,
        players,
        nodes,
        connections,
        phase: nextPhase,
        logs
      };
    });
  };

  // ----------------------------------------------------
  // CONQUEST ACTIVE GAMEBOARD COMMANDS
  // ----------------------------------------------------
  const handleFortifyToggle = (nodeId: string) => {
    handleFortifyToggled(nodeId);

    if (!isOffline) {
      broadcastAction('fortify_toggle', { nodeId });
    }
  };

  const handleFortifyToggled = (nodeId: string) => {
    setGameState(prev => {
      const nodes = prev.nodes.map(n => {
        if (n.id === nodeId) {
          return { ...n, isFortified: !n.isFortified };
        }
        return n;
      });

      const nodeName = prev.nodes.find(n => n.id === nodeId)?.name || 'Node';
      const isFortified = nodes.find(n => n.id === nodeId)?.isFortified;

      return {
        ...prev,
        nodes,
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: `${nodeName.toUpperCase()} defense shields ${isFortified ? 'ACTIVATED' : 'DEACTIVATED'}.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  const handleLaunchTroops = (sourceId: string, targetId: string, count: number, isExplorer: boolean, ownerId: string = myPlayerId) => {
    const actionData = {
      id: 'tr_' + Math.random().toString(36).substring(2, 9),
      sourceNodeId: sourceId,
      targetNodeId: targetId,
      count,
      ownerId,
      isExplorer
    };

    handleLaunchTransitBroadcast(actionData);

    if (!isOffline) {
      broadcastAction('launch_transit', actionData);
    }
  };

  const handleLaunchTransitBroadcast = (data: {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    count: number;
    ownerId: string;
    isExplorer: boolean;
  }) => {
    setGameState(prev => {
      // Subtract troops from source
      const nodes = prev.nodes.map(n => {
        if (n.id === data.sourceNodeId) {
          return { ...n, troops: Math.max(1, n.troops - data.count) };
        }
        return n;
      });

      const sourceNode = prev.nodes.find(n => n.id === data.sourceNodeId);
      const targetNode = prev.nodes.find(n => n.id === data.targetNodeId);

      // Travel time distance-based calculation (speed tuned for snappy ~1s flight)
      const dist = Math.hypot(targetNode!.x - sourceNode!.x, targetNode!.y - sourceNode!.y);
      const speed = 5.0 / Math.max(10, dist);

      const newTransit: TransitTroops = {
        id: data.id,
        sourceNodeId: data.sourceNodeId,
        targetNodeId: data.targetNodeId,
        count: data.count,
        ownerId: data.ownerId,
        progress: 0,
        isExplorer: data.isExplorer,
        speed
      };

      const sender = prev.players.find(p => p.id === data.ownerId);
      const msg = data.isExplorer 
        ? `${sender?.name} launched an undercover explorer towards ${targetNode?.name.toUpperCase()}.`
        : `${sender?.name} deployed ${data.count} troops towards ${targetNode?.name.toUpperCase()}.`;

      // Set origin country to Vulnerable post-battle cooldown (if troop transit and not explorer)
      if (!data.isExplorer) {
        nodes.forEach(n => {
          if (n.id === data.sourceNodeId) {
            n.vulnerableUntil = Date.now() + 5000; // 5 seconds vulnerability
          }
        });
      }

      return {
        ...prev,
        nodes,
        transits: [...prev.transits, newTransit],
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: msg,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  // ----------------------------------------------------
  // ALLIANCE BROADCAST LOGIC
  // ----------------------------------------------------
  const handleProposeAlliance = (targetId: string, senderId: string = myPlayerId) => {
    handleAllianceProposedBroadcast(senderId, targetId);

    if (!isOffline) {
      broadcastAction('alliance_propose', { senderId, targetId });
    }
  };

  const handleAllianceProposedBroadcast = (senderId: string, targetId: string) => {
    setGameState(prev => {
      // Check if duplicate pending exists
      const duplicate = prev.alliances.some(
        a => a.status === 'pending' && a.members.includes(senderId) && a.members.includes(targetId)
      );
      if (duplicate) return prev;

      const newAlliance: Alliance = {
        id: 'all_' + Math.random().toString(36).substring(2, 9),
        members: [senderId, targetId],
        status: 'pending',
        proposedBy: senderId,
        truceUntil: null
      };

      const sender = prev.players.find(p => p.id === senderId);
      const receiver = prev.players.find(p => p.id === targetId);

      return {
        ...prev,
        alliances: [...prev.alliances, newAlliance],
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: `${sender?.name} proposed a Coalition Bloc to ${receiver?.name}.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  const handleAcceptAlliance = (allianceId: string) => {
    handleAllianceAcceptedBroadcast(allianceId);

    if (!isOffline) {
      broadcastAction('alliance_accept', { allianceId });
    }
  };

  const handleAllianceAcceptedBroadcast = (allianceId: string) => {
    setGameState(prev => {
      const alliances = prev.alliances.map(a => 
        a.id === allianceId ? { ...a, status: 'active' as const } : a
      );

      const targetAlliance = prev.alliances.find(a => a.id === allianceId);
      const membersText = targetAlliance?.members
        ?.map(mId => prev.players.find(p => p.id === mId)?.name || 'Unknown')
        .join(' and ') || 'Unknown Terminals';

      return {
        ...prev,
        alliances,
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: `Alliance established between ${membersText}. Open borders activated.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  const handleRejectAlliance = (allianceId: string) => {
    handleAllianceRejectedBroadcast(allianceId);

    if (!isOffline) {
      broadcastAction('alliance_reject', { allianceId });
    }
  };

  const handleAllianceRejectedBroadcast = (allianceId: string) => {
    setGameState(prev => {
      const targetAlliance = prev.alliances.find(a => a.id === allianceId);
      const sender = prev.players.find(p => p.id === targetAlliance?.proposedBy);
      
      return {
        ...prev,
        alliances: prev.alliances.filter(a => a.id !== allianceId),
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: `Coalition proposal by ${sender?.name} declined.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  const handleBreakAlliance = (allianceId: string) => {
    handleAllianceBrokenBroadcast(allianceId);

    if (!isOffline) {
      broadcastAction('alliance_break', { allianceId });
    }
  };

  const handleAllianceBrokenBroadcast = (allianceId: string) => {
    setGameState(prev => {
      // When broken, alliances go into "Truce" mode for 10 seconds (represented as 10s cooldown)
      const alliances = prev.alliances.map(a => {
        if (a.id === allianceId) {
          return {
            ...a,
            status: 'truce' as const,
            truceUntil: Date.now() + 10000 // 10s truce
          };
        }
        return a;
      });

      const targetAlliance = prev.alliances.find(a => a.id === allianceId);
      const members = targetAlliance?.members
        ?.map(mId => prev.players.find(p => p.id === mId)?.name || 'Unknown')
        .join(' & ') || 'Unknown Terminals';

      return {
        ...prev,
        alliances,
        logs: [
          ...prev.logs,
          {
            id: Math.random().toString(),
            message: `Sovereignty ALERT: Alliance broken between ${members}. 10-second non-aggression truce active.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      };
    });
  };

  // ----------------------------------------------------
  // GAME ENGINE SIMULATION LOOP (Animation and Logic Ticks)
  // ----------------------------------------------------
  useEffect(() => {
    let animationFrameId: number;
    let lastTickTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const delta = now - lastTickTime;
      
      // We only run loop checks when in game phase
      if (stateRef.current.phase === 'game') {
        let stateChanged = false;
        
        // 1. Move and resolve transits
        const updatedTransits = stateRef.current.transits.map(t => {
          const nextProgress = t.progress + t.speed * (delta / 16.6); // Normalize to 60fps
          return { ...t, progress: Math.min(1.0, nextProgress) };
        });

        const arrivedTransits = updatedTransits.filter(t => t.progress >= 1.0);
        const activeTransits = updatedTransits.filter(t => t.progress < 1.0);

        if (arrivedTransits.length > 0 || stateRef.current.transits.length > 0) {
          stateChanged = true;
        }

        // Process arrivals
        let nodes = [...stateRef.current.nodes];
        let alliances = [...stateRef.current.alliances];
        let logs = [...stateRef.current.logs];
        let lastCombatResult: any = stateRef.current.lastCombatResult;

        arrivedTransits.forEach(transit => {
          const target = nodes.find(n => n.id === transit.targetNodeId);
          if (!target) return;

          const attacker = stateRef.current.players.find(p => p.id === transit.ownerId);

          if (transit.isExplorer) {
            // Lewis & Clark Espionage Resolution
            const success = Math.random() < 0.5;
            if (success) {
              // Success: +25% permanent attack modifier (scoutedBy holds scout timestamps)
              target.scoutedBy[transit.ownerId] = Date.now() + 30000; // Scouted for 30s
              playSound.ping();
              
              const msg = `Espionage SUCCESS: ${attacker?.name} scouted ${target.name.toUpperCase()}. Vector defense mapping complete.`;
              logs.push({
                id: Math.random().toString(),
                message: msg,
                timestamp: new Date().toLocaleTimeString()
              });

              lastCombatResult = {
                id: Math.random().toString(),
                type: 'scout_success',
                text: `👁️ ESPIONAGE SUCCESS: ${attacker?.name} mapped ${target.name.toUpperCase()} (+25% ATK Bonus Active!)`,
                timestamp: Date.now()
              };
            } else {
              // Captured: trigger war, give targets +10 troops, launch immediate counter-strike
              playSound.klaxon();
              
              // 1. Target gets +10 troops
              target.troops += 10;
              
              // 2. Break active alliances/truces with target owner immediately
              if (target.ownerId) {
                alliances = alliances.filter(a => {
                  const matches = a.members.includes(transit.ownerId) && a.members.includes(target.ownerId!);
                  if (matches) {
                    logs.push({
                      id: Math.random().toString(),
                      message: `DIPLOMATIC CRISIS: Espionage failure triggers war! Alliances broken immediately.`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }
                  return !matches;
                });
              }

              // 3. Target launches counter-strike (5 troops) if it has spare forces
              if (target.troops > 6 && target.ownerId) {
                const counterId = 'tr_counter_' + Math.random().toString(36).substring(2, 7);
                const sourceNode = nodes.find(n => n.id === transit.targetNodeId);
                const destNode = nodes.find(n => n.id === transit.sourceNodeId);
                const dist = Math.hypot(destNode!.x - sourceNode!.x, destNode!.y - sourceNode!.y);
                const speed = 5.0 / Math.max(10, dist);

                activeTransits.push({
                  id: counterId,
                  sourceNodeId: transit.targetNodeId,
                  targetNodeId: transit.sourceNodeId,
                  count: 5,
                  ownerId: target.ownerId,
                  progress: 0,
                  isExplorer: false,
                  speed
                });
                
                target.troops -= 5;
              }

              const msg = `Espionage FAILURE: ${attacker?.name} caught infiltrating ${target.name.toUpperCase()}. Telemetry alert triggered!`;
              logs.push({
                id: Math.random().toString(),
                message: msg,
                timestamp: new Date().toLocaleTimeString()
              });

              lastCombatResult = {
                id: Math.random().toString(),
                type: 'scout_failed',
                text: `🚨 ESPIONAGE FAILED: ${attacker?.name} caught at ${target.name.toUpperCase()}! Counter-strike triggered!`,
                timestamp: Date.now()
              };
            }
          } else {
            // Standard Troop attack / reinforcement resolution
            const connection = stateRef.current.connections.find(
              c => (c.from === transit.sourceNodeId && c.to === transit.targetNodeId) || 
                   (c.from === transit.targetNodeId && c.to === transit.sourceNodeId)
            );

            // Compute defensive barriers & fortifications
            let defenseMultiplier = 1.0;
            
            // 1. Natural chokepoints
            if (connection && connection.barrierName) {
              // Bypassed if target is scouted
              const isScouted = target.scoutedBy[transit.ownerId] && target.scoutedBy[transit.ownerId] > Date.now();
              if (!isScouted) {
                defenseMultiplier *= connection.defenseMultiplier;
              }
            }

            // 2. Active Fortification
            if (target.isFortified) {
              defenseMultiplier *= (target.stars === 1 ? 2.0 : 1.5);
            }

            // 3. Vulnerability Cooldown
            const isVulnerable = target.vulnerableUntil ? target.vulnerableUntil > Date.now() : false;
            if (isVulnerable) {
              defenseMultiplier *= 0.5;
            }

            // 4. Guerrilla Defense catch-up (1-star countries)
            if (target.stars === 1 && target.ownerId) {
              const ownerNodes = stateRef.current.nodes.filter(n => n.ownerId === target.ownerId);
              defenseMultiplier *= (ownerNodes.length === 1 ? 1.5 : 1.3);
            }

            // Resolve combat or instant neutral claim
            if (target.ownerId === null) {
              // Unclaimed neutral node: Instant claim without battle!
              target.ownerId = transit.ownerId;
              target.troops = transit.count;
              target.isFortified = false;
              playSound.explosion(true);

              const msg = `${attacker?.name} CLAIMED neutral territory ${target.name.toUpperCase()} without resistance.`;
              logs.push({
                id: Math.random().toString(),
                message: msg,
                timestamp: new Date().toLocaleTimeString()
              });

              lastCombatResult = {
                id: Math.random().toString(),
                type: 'conquer',
                text: `🚩 NEUTRAL CLAIMED: ${attacker?.name} occupied ${target.name.toUpperCase()}! (${transit.count} garrison troops)`,
                timestamp: Date.now()
              };
            } else if (target.ownerId === transit.ownerId || areAllied(target.ownerId, transit.ownerId, alliances)) {
              // Friendly/Ally reinforcement
              target.troops += transit.count;
              playSound.click();
              logs.push({
                id: Math.random().toString(),
                message: `${attacker?.name} reinforced allied ${target.name.toUpperCase()} with ${transit.count} troops.`,
                timestamp: new Date().toLocaleTimeString()
              });
            } else {
              // Hostile attack
              const effectiveDefense = Math.max(1, Math.round(target.troops * defenseMultiplier));
              const outcome = transit.count - effectiveDefense;

              if (outcome > 0) {
                // Attacker wins and captures node
                const prevOwner = stateRef.current.players.find(p => p.id === target.ownerId);
                target.ownerId = transit.ownerId;
                target.troops = outcome;
                target.isFortified = false; // Reset fortification
                playSound.explosion(true);

                const msg = `${attacker?.name} CONQUERED ${target.name.toUpperCase()} from ${prevOwner?.name || 'NEUTRAL'}.`;
                logs.push({
                  id: Math.random().toString(),
                  message: msg,
                  timestamp: new Date().toLocaleTimeString()
                });

                lastCombatResult = {
                  id: Math.random().toString(),
                  type: 'conquer',
                  text: `🔥 TERRITORY CONQUERED: ${attacker?.name} captured ${target.name.toUpperCase()}! (${outcome} troops remaining)`,
                  timestamp: Date.now()
                };

                // If target was a Capital, trigger government collapse production penalty on other nodes
                if (target.type === 'capital' && prevOwner) {
                  logs.push({
                    id: Math.random().toString(),
                    message: `GOVERNMENT COLLAPSE: Remaining territories of ${prevOwner.name} suffer -50% troop generation penalty.`,
                    timestamp: new Date().toLocaleTimeString()
                  });
                }
              } else {
                // Defender wins
                const troopsLost = Math.round(transit.count / defenseMultiplier);
                target.troops = Math.max(1, target.troops - troopsLost);
                playSound.explosion(false);

                const msg = `Attack failed at ${target.name.toUpperCase()}. Defender held position.`;
                logs.push({
                  id: Math.random().toString(),
                  message: msg,
                  timestamp: new Date().toLocaleTimeString()
                });

                lastCombatResult = {
                  id: Math.random().toString(),
                  type: 'repelled',
                  text: `🛡️ DEFENSE HELD: Attack at ${target.name.toUpperCase()} repelled! Defender lost ${troopsLost} forces.`,
                  timestamp: Date.now()
                };
              }
            }
          }
        });

        // 2. Clean up expired Truces
        const updatedAlliances = alliances.map(a => {
          if (a.status === 'truce' && a.truceUntil && a.truceUntil <= Date.now()) {
            return null; // Delete truce
          }
          return a;
        }).filter(Boolean) as Alliance[];

        if (updatedAlliances.length !== stateRef.current.alliances.length) {
          stateChanged = true;
        }

        // 3. Check Victory conditions
        // Find how many unique alive players own nodes
        const activeOwners = Array.from(new Set(nodes.map(n => n.ownerId).filter(Boolean)));
        let winnerId: string | string[] | null = null;

        if (activeOwners.length === 1) {
          // Single winner
          winnerId = activeOwners[0] as string;
        } else if (activeOwners.length > 1) {
          // Check if active owners are all members of a single active alliance
          const activeAlliedBlocs = updatedAlliances.filter(a => a.status === 'active');
          const coalitionWinner = activeAlliedBlocs.find(a => 
            activeOwners.every(ownerId => a.members.includes(ownerId!))
          );
          
          if (coalitionWinner) {
            winnerId = coalitionWinner.members;
          }
        }

        if (winnerId) {
          playSound.victoryFanfare();
        }

        if (stateChanged || winnerId) {
          setGameState(prev => ({
            ...prev,
            nodes,
            transits: activeTransits,
            alliances: updatedAlliances,
            winnerId,
            phase: winnerId ? 'gameover' : prev.phase,
            logs,
            lastCombatResult
          }));
        }
      }

      lastTickTime = now;
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // ----------------------------------------------------
  // TROOP GENERATION LOOP (Ticks every 1s)
  // ----------------------------------------------------
  useEffect(() => {
    if (gameState.phase !== 'game') return;

    // Track fractional troop accumulators for nodes to support high precision decimal rates
    const accumulators: { [nodeId: string]: number } = {};

    const genInterval = setInterval(() => {
      setGameState(prev => {
        let stateChanged = false;
        
        const nodes = prev.nodes.map(node => {
          if (!node.ownerId) return node;

          const owner = prev.players.find(p => p.id === node.ownerId);
          if (!owner) return node;

          // Check if owner's Capital node is captured (Government Collapse check)
          const capitals = prev.nodes.filter(n => n.ownerId === node.ownerId && n.type === 'capital');
          const hasCollapse = capitals.length === 0;

          // Base rate
          let rate = 0;
          if (node.type === 'capital') rate = 1.0;
          else if (node.type === 'city') rate = 0.8;
          else if (node.type === 'military_base') rate = 0.4;

          // Penalties & Bonuses
          if (node.vulnerableUntil && node.vulnerableUntil > Date.now()) {
            rate = 0; // Paused during vulnerability
          } else {
            if (node.isFortified) rate *= 0.5; // Halved in fortify
            if (hasCollapse) rate *= 0.5; // Halved during collapse
          }

          // Catch-up Guerrilla rate for 1-node players
          const ownerNodes = prev.nodes.filter(n => n.ownerId === node.ownerId);
          if (ownerNodes.length === 1) {
            rate += 0.5;
          }

          // Accumulate decimals
          if (!accumulators[node.id]) accumulators[node.id] = 0;
          accumulators[node.id] += rate;

          if (accumulators[node.id] >= 1.0) {
            const added = Math.floor(accumulators[node.id]);
            accumulators[node.id] -= added;
            stateChanged = true;
            return { ...node, troops: node.troops + added };
          }

          return node;
        });

        return stateChanged ? { ...prev, nodes } : prev;
      });
    }, 1000);

    return () => clearInterval(genInterval);
  }, [gameState.phase]);

  // ----------------------------------------------------
  // AI BOT STRATEGY LOOP (Ticks every 2.5s)
  // ----------------------------------------------------
  useEffect(() => {
    if (gameState.phase !== 'game') return;

    // Only the host manages AI Bot strategies in online mode, or anyone in offline mode
    const isHost = gameState.players[0]?.id === myPlayerId;
    if (!isOffline && !isHost) return;

    const botInterval = setInterval(() => {
      const activeBots = stateRef.current.players.filter(p => p.isBot && p.isAlive);
      
      activeBots.forEach(bot => {
        // 1. Check for pending alliance invitations and accept them
        const pendingInvites = stateRef.current.alliances.filter(
          a => a.status === 'pending' && a.members.includes(bot.id) && a.proposedBy !== bot.id
        );
        if (pendingInvites.length > 0) {
          const invite = pendingInvites[0];
          handleAcceptAlliance(invite.id);
          return; // Skip other actions this tick
        }

        // 2. Propose alliance with a small chance
        if (Math.random() < 0.05) {
          const potentialPartners = stateRef.current.players.filter(
            p => p.id !== bot.id && p.isAlive && 
            !stateRef.current.alliances.some(a => a.members.includes(bot.id) && a.members.includes(p.id))
          );
          if (potentialPartners.length > 0) {
            const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
            handleProposeAlliance(partner.id, bot.id);
          }
        }

        // 3. Choose country nodes with enough attacking force
        const botNodes = stateRef.current.nodes.filter(n => n.ownerId === bot.id);
        if (botNodes.length === 0) return;

        const attackerNode = botNodes.find(n => n.troops > 7 && !n.isFortified);
        if (!attackerNode) {
          // If all nodes are low on troops, try to fortify the most vulnerable border node
          const borderNodes = botNodes.filter(n => 
            stateRef.current.connections.some(c => 
              (c.from === n.id || c.to === n.id) && 
              stateRef.current.nodes.find(other => 
                (other.id === (c.from === n.id ? c.to : c.from)) && 
                other.ownerId !== bot.id
              )
            )
          );
          if (borderNodes.length > 0 && !borderNodes[0].isFortified && Math.random() < 0.2) {
            handleFortifyToggle(borderNodes[0].id);
          }
          return;
        }

        // Find adjacent targets
        const adjacentLinks = stateRef.current.connections.filter(
          c => c.from === attackerNode.id || c.to === attackerNode.id
        );
        
        const targets = adjacentLinks.map(c => {
          const targetId = c.from === attackerNode.id ? c.to : c.from;
          return stateRef.current.nodes.find(n => n.id === targetId)!;
        }).filter(n => n.ownerId !== bot.id);

        if (targets.length > 0) {
          // Filter targets: skip active allies, truces, and pending alliances
          const validTargets = targets.filter(t => 
            !areAllied(t.ownerId, bot.id, stateRef.current.alliances) && 
            !areInTruce(t.ownerId, bot.id, stateRef.current.alliances) &&
            !stateRef.current.alliances.some(a => a.status === 'pending' && t.ownerId && a.members.includes(t.ownerId) && a.members.includes(bot.id))
          );

          if (validTargets.length > 0) {
            // Sort by easiest (lowest troops)
            validTargets.sort((a, b) => a.troops - b.troops);
            const target = validTargets[0];

            // Decide payload size: 70% of available forces
            const count = Math.round((attackerNode.troops - 1) * 0.7);

            if (count > 0) {
              // 50% chance to run a scout explorer first if target is a high-starred capital
              const isTargetCapital = target.type === 'capital';
              const targetScouted = target.scoutedBy[bot.id] && target.scoutedBy[bot.id] > Date.now();
              
              if (isTargetCapital && !targetScouted && attackerNode.troops > 12 && Math.random() < 0.4) {
                // Send explorer instead of attack, passing bot.id as owner
                handleLaunchTroops(attackerNode.id, target.id, 5, true, bot.id);
              } else {
                // Regular attack launch, passing bot.id as owner
                handleLaunchTroops(attackerNode.id, target.id, count, false, bot.id);
              }
            }
          }
        }
      });
    }, 2500);

    return () => clearInterval(botInterval);
  }, [gameState.phase, isOffline]);

  // Handle restarting match
  const handleReset = () => {
    setIsOffline(false);
    setRenderUrl(null);
    if (socket) {
      socket.close();
    }
    setSocket(null);
    setGameState({
      roomId: '',
      roomCode: '',
      eraId: 'modern',
      phase: 'lobby',
      players: [],
      nodes: [],
      connections: [],
      transits: [],
      alliances: [],
      logs: [],
      winnerId: null,
    });
  };

  // Render orchestrator depending on current phase
  return (
    <div className="crt-container h-full w-full">
      {gameState.phase === 'lobby' && !renderUrl && !isOffline && (
        <RenderConfig
          onHostGame={handleHostGame}
          onJoinGame={handleJoinGame}
          onPlayOffline={handlePlayOffline}
          isConnecting={isConnecting}
          connectionError={connectionError}
        />
      )}

      {gameState.phase === 'lobby' && (renderUrl || isOffline) && (
        <Lobby
          roomCode={gameState.roomCode}
          players={gameState.players}
          currentUserId={myPlayerId}
          isHost={gameState.players.find(p => p.id === myPlayerId)?.isHost === true}
          selectedEraId={gameState.eraId}
          onSelectEra={(eraId) => updateGameState({ eraId })}
          onAddBot={handleAddBot}
          onRemovePlayer={handleRemovePlayer}
          onStartGame={handleStartGame}
          onLeaveLobby={handleReset}
        />
      )}

      {gameState.phase === 'preamble' && (
        <Preamble
          era={ERAS.find(e => e.id === gameState.eraId) || ERAS[0]}
          onComplete={handlePreambleComplete}
        />
      )}

      {gameState.phase === 'rps' && (
        <RockPaperScissors
          players={gameState.players}
          currentUserId={myPlayerId}
          onSelectPosture={handleSelectPosture}
          tieOccurred={tieOccurred}
        />
      )}

      {gameState.phase === 'selection' && (
        <CountrySelection
          era={ERAS.find(e => e.id === gameState.eraId) || ERAS[0]}
          players={gameState.players}
          currentUserId={myPlayerId}
          onSelectCountry={handleSelectCountry}
        />
      )}

      {(gameState.phase === 'game' || gameState.phase === 'gameover') && (
        <GameBoard
          players={gameState.players}
          nodes={gameState.nodes}
          connections={gameState.connections}
          transits={gameState.transits}
          alliances={gameState.alliances}
          logs={gameState.logs}
          currentUserId={myPlayerId}
          onFortifyToggle={handleFortifyToggle}
          onLaunchTroops={handleLaunchTroops}
          onProposeAlliance={handleProposeAlliance}
          onBreakAlliance={handleBreakAlliance}
          onAcceptAlliance={handleAcceptAlliance}
          onRejectAlliance={handleRejectAlliance}
          winnerId={gameState.winnerId}
          onReset={handleReset}
          onLaunchTutorial={() => setShowTutorial(true)}
        />
      )}
      
      {/* Tutorial Overlay */}
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
