import React, { useState } from 'react';
import { Shield, Target, Compass, Users, Award, ChevronRight, ChevronLeft, X, Dices, Keyboard, MousePointer } from 'lucide-react';
import { playSound } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  icon: React.ReactNode;
  content: string;
  schematic: React.ReactNode;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: TutorialStep[] = [
    {
      title: '1. HOW_TO_PLAY_&_COMMAND_CONTROLS',
      icon: <MousePointer className="w-8 h-8 text-p1 animate-bounce" />,
      content: "HOW TO CONTROLS & MARCH FORCES:\n\n1. SELECT NODE: Click any node on the map to inspect its garrison, production rate, and owner.\n2. MARCH TROOPS: Click a node you own ➔ Click 'LAUNCH EXPEDITION' (or press [A]) ➔ Drag the Payload % slider (25%, 50%, 100%) ➔ Click an adjacent connected node (marked with a spinning target ring) to dispatch forces!\n3. MAP NAVIGATION: Left-click & drag empty map space to PAN. Use mouse scroll wheel to ZOOM.\n4. KEYBOARD SHORTCUTS:\n   • [A] - Toggle Launch / Attack Mode\n   • [S] - Toggle Lewis & Clark Scout Mode\n   • [F] - Toggle Fortify Defense Shield\n   • [ESC] or [SPACE] - Deselect Node / Cancel Mode",
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-50 p-3 flex flex-col justify-around font-mono">
          <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
            <div className="p-2 border border-p1 bg-black flex flex-col items-center">
              <span className="text-p1 font-bold text-xs">1. CLICK NODE</span>
              <span className="text-white mt-1">Select Source</span>
              <span className="text-[8px] text-p1 opacity-80 mt-1">OPEN INSPECTOR</span>
            </div>
            <div className="p-2 border border-p3 bg-black flex flex-col items-center">
              <span className="text-p3 font-bold text-xs">2. PRESS [A] / SLIDER</span>
              <span className="text-white mt-1">Set Payload %</span>
              <span className="text-[8px] text-p3 opacity-80 mt-1">CHOOSE RATIO</span>
            </div>
            <div className="p-2 border border-p2 bg-black flex flex-col items-center">
              <span className="text-p2 font-bold text-xs">3. CLICK TARGET</span>
              <span className="text-white mt-1">Launch Troops</span>
              <span className="text-[8px] text-p2 opacity-80 mt-1">SPINNING RING</span>
            </div>
          </div>
          <div className="flex justify-around text-[9px] text-p1 bg-p1 bg-opacity-10 border border-p1 p-1">
            <span>[A] ATTACK</span>
            <span>[S] SCOUT</span>
            <span>[F] FORTIFY</span>
            <span>[ESC] DESELECT</span>
            <span>DRAG = PAN | SCROLL = ZOOM</span>
          </div>
        </div>
      )
    },
    {
      title: '2. GAME_INITIATION_&_DRAFTING',
      icon: <Dices className="w-8 h-8 text-p1 animate-spin" style={{ animationDuration: '10s' }} />,
      content: "Drafting determines starting territory power:\n\n- ROCK PAPER SCISSORS: Every campaign begins with a Rock Paper Scissors selection to determine drafting order.\n- DRAFT BRACKETS: 1st place earns 3-Star (★3) Superpowers, 2nd earns 2-Star (★2) Regional powers, and 3rd/4th earn 1-Star (★1) Guerrilla nations.\n- GUERRILLA HANDICAP: 1-Star class powers receive +15 extra starting troops per node and a passive +30% Guerrilla Defense bonus on home nodes!\n- EMPIRE NAMING: Custom design your empire title or inherit historical country designations.",
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-50 p-3 flex flex-col justify-between font-mono">
          <div className="flex justify-around items-center pt-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-p1">RPS CHOICE</span>
              <div className="flex gap-1.5 text-sm my-1">🪨 📄 ✂️</div>
              <span className="text-[9px] text-p2">DRAFT SELECTION</span>
            </div>
            <span className="text-p1 text-sm">▶</span>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-p2 font-bold">DRAFT CLASS</span>
              <div className="text-xs text-white my-1 font-bold">★3 / ★2 / ★1</div>
              <span className="text-[9px] text-p1 opacity-80">STAR BRACKETS</span>
            </div>
            <span className="text-p1 text-sm">▶</span>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-p4 font-bold">EMPIRE TITLE</span>
              <div className="text-xs text-p4 my-1 border border-p4 px-1.5 py-0.5 bg-black">[CUSTOM]</div>
              <span className="text-[9px] text-p4">SOVEREIGN</span>
            </div>
          </div>
          <div className="text-[10px] text-p2 bg-p2 bg-opacity-10 border border-p2 p-1.5 text-center">
            ★1 Division Special: +15 Extra Troops per Node & +30% Guerrilla Home Defense!
          </div>
        </div>
      )
    },
    {
      title: '3. INFRASTRUCTURE_&_CAPITAL_INTEGRITY',
      icon: <Shield className="w-8 h-8 text-p2" />,
      content: 'Nations are networks of sub-nodes rather than single points. Infrastructure classes provide specific advantages:\n\n1. Capitals (★): Command centers producing +1.0 troops/second.\n2. Cities (🏙): Industrial hubs producing +0.8 troops/second.\n3. Military Bases (⚔): Outposts producing +0.4 troops/second with defensive perks.\n\nCRITICAL WARNING — GOVERNMENT COLLAPSE: If your Capital is captured by an enemy, your empire suffers Government Collapse! Troop production is reduced by -50% across all your remaining sectors until the capital is reclaimed.',
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-50 p-3 flex flex-col justify-around font-mono">
          <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
            <div className="p-2 border border-p2 bg-black flex flex-col items-center">
              <span className="text-p2 font-bold text-xs">★ CAPITAL</span>
              <span className="text-white mt-1">+1.0 troops/s</span>
              <span className="text-[8px] text-p2 opacity-80 mt-1">COMMAND CORE</span>
            </div>
            <div className="p-2 border border-p1 bg-black flex flex-col items-center">
              <span className="text-p1 font-bold text-xs">🏙 CITY</span>
              <span className="text-white mt-1">+0.8 troops/s</span>
              <span className="text-[8px] text-p1 opacity-80 mt-1">URBAN CLUSTER</span>
            </div>
            <div className="p-2 border border-p1 bg-black flex flex-col items-center">
              <span className="text-p1 font-bold text-xs">⚔ MILITARY BASE</span>
              <span className="text-white mt-1">+0.4 troops/s</span>
              <span className="text-[8px] text-p1 opacity-80 mt-1">FORTRESS OUTPOST</span>
            </div>
          </div>
          <div className="text-[10px] text-red-400 bg-red-950 bg-opacity-30 border border-red-500 p-1.5 text-center animate-pulse">
            ⚠ CAPITAL FALL = GOVERNMENT COLLAPSE: -50% PRODUCTION ACROSS ALL SECTORS!
          </div>
        </div>
      )
    },
    {
      title: '4. NEUTRAL_EXPANSION_&_REINFORCEMENT',
      icon: <Award className="w-8 h-8 text-p1 animate-pulse" />,
      content: 'Early expansion is vital to establishing a dominant empire footprint:\n\n- NEUTRAL GRAY NODES: Unclaimed gray nodes across the map start neutral with small garrisons.\n- ZERO BATTLE LOSS: Marching troops to a gray node claims it INSTANTLY with ZERO combat loss! All dispatched forces become the new home garrison.\n- EXPAND EARLY: Secure adjacent neutral clusters before rival commanders reach them.\n- EMPIRE TRANSPORT: You can transport troops freely through any connected network of friendly or allied nodes to reinforce threatened frontiers.',
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden font-mono">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,255,102,0.1)_0%,transparent_70%)]"></div>
          <div className="flex gap-8 z-10 items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-p1 flex items-center justify-center font-bold text-p1 bg-black">25</div>
              <span className="text-[10px] mt-1.5 text-p1 uppercase">Home Capital</span>
            </div>
            <div className="flex flex-col items-center text-p1">
              <span className="text-[9px] font-bold border px-1 border-p1 bg-black text-p1 animate-pulse">100% CLAIM</span>
              <span className="text-xs my-0.5">────────▶</span>
              <span className="text-[8px] text-p1 opacity-80">ZERO BATTLE LOSS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-neutral border-dashed flex items-center justify-center font-bold text-neutral bg-black">0</div>
              <span className="text-[10px] mt-1.5 text-neutral uppercase">Gray Neutral Zone</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '5. TACTICAL_DEPLOYMENT_&_VULNERABILITY',
      icon: <Target className="w-8 h-8 text-p3" />,
      content: 'Commanding troops requires balancing offensive pressure against origin defense:\n\n- DEPLOYMENT: Select your node, click Target, use the percentage slider (25%, 50%, 100%), and select a target destination.\n- VULNERABILITY COOLDOWN: For 5 seconds after launching forces, the origin node enters Vulnerability (flashing red): troop production halts and defense drops to 0.5x (Double Damage taken)!\n- FORTIFICATION MODE: Click Fortify to boost node defense by +50% (+100% / 2.0x for 1★ class) at the cost of -50% troop growth.\n- NATURAL BARRIERS: Borders over rivers (Rhine), mountains (Alps), or walls (Great Wall) grant defenders 1.5x - 2.5x defense multipliers.',
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden font-mono p-3">
          <div className="flex flex-col items-center gap-2 z-10 w-full">
            <div className="flex items-center gap-4 justify-center w-full">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center font-bold text-red-500 bg-black animate-pulse">5</div>
                <span className="text-[9px] text-red-400 mt-1">Origin Node</span>
              </div>
              <div className="flex flex-col items-center text-red-500">
                <span className="text-[9px] font-bold text-amber-400">50% FORCE PAYLOAD</span>
                <span className="text-xs">━━━━▶</span>
                <span className="text-[8px] text-red-400">LAUNCH DISORGANIZATION</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-p1 flex items-center justify-center font-bold text-white bg-black">12</div>
                <span className="text-[9px] text-p1 mt-1">Target Node</span>
              </div>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-red-400 bg-red-950 px-3 py-1 border border-red-500 animate-pulse text-center w-full">
              ⚡ 5s VULNERABILITY COOLDOWN: Defense 0.5x (Double Damage Taken) + Zero Production!
            </div>
          </div>
        </div>
      )
    },
    {
      title: '6. ESPIONAGE_&_SCOUTING_MISSIONS',
      icon: <Compass className="w-8 h-8 text-p2 animate-spin" style={{ animationDuration: '6s' }} />,
      content: 'Dispatch undercover Lewis & Clark scout missions against adjacent nodes for 5 troops. Missions resolve with a 50/50 outcome:\n\n- SUCCESS (50%): Uncovers exact enemy troop counts & fortification status, and grants +25% attack strength on subsequent strikes—completely bypassing natural border barriers (mountains & rivers)!\n- CAPTURED (50%): Scout is executed! The target node mobilizes +10 emergency garrison troops, triggers an instant counter-attack, and breaks active peace agreements.',
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-50 flex items-center justify-center font-mono p-3">
          <div className="grid grid-cols-2 gap-4 w-full text-center text-[10px]">
            <div className="p-2 border border-p1 bg-green-950 bg-opacity-20 flex flex-col justify-between">
              <div>
                <span className="text-p1 font-bold">SUCCESS (50%)</span>
                <div className="mt-1 text-white">Full Telemetry Intel</div>
              </div>
              <div className="text-[8px] mt-1 text-p1 border border-p1 p-1 bg-black">
                +25% ATTACK SOVEREIGNTY (BYPASSES BARRIERS)
              </div>
            </div>
            <div className="p-2 border border-red-500 bg-red-950 bg-opacity-20 text-red-400 flex flex-col justify-between">
              <div>
                <span className="font-bold text-red-400">CAPTURED (50%)</span>
                <div className="mt-1 text-white">Scout Executed</div>
              </div>
              <div className="text-[8px] mt-1 border border-red-500 p-1 bg-black">
                ENEMY +10 TROOPS / INSTANT COUNTER-WAR
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '7. COALITIONS_&_DIPLOMATIC_VICTORY',
      icon: <Users className="w-8 h-8 text-p4" />,
      content: 'Diplomacy provides a path to shared global hegemony:\n\n- FORMING ALLIANCES: Propose coalitions to other players via the scoreboard. Allies share open border routing to transport troops and reinforce one another.\n- ALLIED VICTORY: If all surviving commanders on the map enter a formal Coalition, Allied Victory is declared for everyone in the bloc!\n- DISBANDING & TRUCE WARNING: Breaking an alliance triggers a 10-second Truce countdown warning, granting former allies time to prepare before hostile fire re-engages.',
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-3 font-mono p-3">
          <div className="flex gap-4 items-center">
            <span className="px-2 py-1 border border-p1 text-p1 text-xs bg-black">EMPIRE A (YOU)</span>
            <span className="text-p1 text-base">🤝</span>
            <span className="px-2 py-1 border border-p3 text-p3 text-xs bg-black">EMPIRE B (ALLY)</span>
          </div>
          <div className="text-[10px] text-p1 opacity-90 text-center">
            Shared Open Borders for Reinforcements // All Surviving Players Allied = JOINT VICTORY!
          </div>
          <div className="text-[9px] text-p2 border border-p2 bg-black px-2 py-0.5 text-center">
            Dissolving Coalition triggers a 10s Truce Warning before hostile weapons unlock.
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    playSound.click();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    playSound.click();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      {/* Curved CRT Curvature Glass Effect overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.75)_100%)] pointer-events-none"></div>

      <div className="radar-panel max-w-xl w-full p-6 border-p1 glow-border relative z-10 flex flex-col justify-between h-[470px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <h2 className="text-base sm:text-lg font-bold tracking-widest text-p1 glow-text uppercase truncate max-w-[360px]">
              TACTICAL_BRIEFING // {currentStepData.title}
            </h2>
          </div>
          <button 
            onClick={() => { playSound.ping(); onClose(); }}
            className="text-p1 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="loader-bar mb-3"></div>

        {/* Schematic Display */}
        <div className="mb-3">
          {currentStepData.schematic}
        </div>

        {/* Informational Text */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-3">
          <p className="text-xs leading-relaxed text-p1 opacity-90 whitespace-pre-line font-mono">
            {currentStepData.content}
          </p>
        </div>

        {/* Foot navigations */}
        <div className="flex justify-between items-center border-t border-p1 border-opacity-30 pt-3">
          <div className="text-[10px] text-p1 opacity-50 uppercase tracking-widest font-mono">
            LOG_PAGE: {currentStep + 1} / {steps.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="btn-radar px-3 py-1.5 text-[10px] uppercase font-semibold flex items-center gap-1 border-p1 text-p1 disabled:opacity-30"
            >
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <button
              onClick={handleNext}
              className="btn-radar px-4 py-1.5 text-[10px] uppercase font-semibold flex items-center gap-1 border-p1 text-p1 animate-pulse"
            >
              {currentStep === steps.length - 1 ? 'Terminate Briefing' : 'Continue'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
