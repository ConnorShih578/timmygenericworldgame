import React, { useState } from 'react';
import { Shield, Target, Compass, Users, Award, ChevronRight, ChevronLeft, X } from 'lucide-react';
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
      title: 'NEUTRAL_TERRITORIES_&_EXPANSION',
      icon: <Award className="w-8 h-8 text-p1 animate-pulse" />,
      content: "Welcome, Commander, to Timmy's Generic World Game! \n\nIMPORTANT: Gray nodes on the map are unclaimed neutral territories. Marching any forces to a gray node claims it INSTANTLY with ZERO battle loss! All sent troops become the new garrison. Expand across neutral territories early to build your empire before attacking rival players!",
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,255,102,0.1)_0%,transparent_70%)]"></div>
          <div className="flex gap-10 z-10 items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-p1 flex items-center justify-center font-bold font-mono text-p1">25</div>
              <span className="text-[10px] mt-2 uppercase tracking-wider text-p1">Your Territory</span>
            </div>
            <div className="flex flex-col items-center text-p1 animate-bounce">
              <span className="text-[9px] font-bold border px-1 border-p1 bg-black">NO BATTLE LOSS</span>
              <span className="text-xs">──────▶</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-neutral border-dashed flex items-center justify-center font-bold font-mono text-neutral">0</div>
              <span className="text-[10px] mt-2 uppercase tracking-wider text-neutral">Gray Neutral Zone</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'INFRASTRUCTURE_METRICS',
      icon: <Shield className="w-8 h-8 text-p2" />,
      content: 'Nations are networks of sub-nodes rather than single points. There are three infrastructure classes: \n\n1. Capitals (★): High production (+1.0/s). If captured, all other owned nodes suffer a -50% Government Collapse production penalty. \n2. Cities (🏙): Moderate production (+0.8/s).\n3. Military Bases (⚔): Low production (+0.4/s) but grant +40% defense.',
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-40 p-3 flex flex-col justify-around">
          <div className="flex justify-around text-[11px] font-mono">
            <div className="flex items-center gap-2 border border-p1 p-1 bg-black w-24">
              <span className="text-p2 font-bold">★</span>
              <span>CAPITAL</span>
            </div>
            <div className="flex items-center gap-2 border border-p1 p-1 bg-black w-24">
              <span>🏙</span>
              <span>CITY</span>
            </div>
            <div className="flex items-center gap-2 border border-p1 p-1 bg-black w-24">
              <span>⚔</span>
              <span>BASE</span>
            </div>
          </div>
          <div className="text-[10px] leading-relaxed text-p1 opacity-80 text-center font-mono uppercase">
            Capitals fuel production. Bases choke connections. If a capital collapses, production decays by 50% across all sectors.
          </div>
        </div>
      )
    },
    {
      title: 'DEPLOYMENT_&_VULNERABILITY',
      icon: <Target className="w-8 h-8 text-p3" />,
      content: 'Launch troops by clicking your node, selecting Target, and dragging the slider to deploy a portion of your forces. \n\nCAUTION: Sending attacks leaves your home node disorganized. For 5 seconds after launching forces, the origin node enters Vulnerability Cooldown (flashing red): its troop generation is frozen and it takes double damage (0.5x defense).',
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-red-950 bg-opacity-10"></div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center font-bold text-red-500 animate-pulse">5</div>
              <div className="text-red-500 animate-ping">⚡</div>
              <div className="w-10 h-10 rounded-full border border-p1 flex items-center justify-center font-bold">12</div>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 border border-red-500 animate-pulse">
              WARN: SYS_DEPL - 0.5x Defense Active
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'LEWIS_&_CLARK_ESPIONAGE',
      icon: <Compass className="w-8 h-8 text-p2 animate-spin" style={{ animationDuration: '6s' }} />,
      content: 'Conduct undercover scouting missions against adjacent nodes for 5 troops. Resolution is 50% Success or 50% Captured: \n\n- SUCCESS: Reveals exact details, and grants +25% attack strength (bypasses mountain and naval barriers like the Great Wall or Alps).\n- CAPTURED: Explorer is executed, targets mobilize (+10 troops), target counter-attacks, and war starts instantly (breaks alliances).',
      schematic: (
        <div className="relative w-full h-40 border border-p1 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full px-6 font-mono text-[10px] text-center">
            <div className="p-2 border border-p1 bg-green-950 bg-opacity-20">
              <span className="text-p1 font-bold">SUCCESS (50%)</span>
              <div className="mt-1 opacity-70">Intel Advantage</div>
              <div className="text-[8px] mt-1 text-p1 border border-p1">+25% ATTACK SOVEREIGNTY</div>
            </div>
            <div className="p-2 border border-red-500 bg-red-950 bg-opacity-20 text-red-400">
              <span className="font-bold">CAUGHT (50%)</span>
              <div className="mt-1 opacity-70">Diplomatic Crisis</div>
              <div className="text-[8px] mt-1 border border-red-500">INSTANT WAR / REBEL STRIKE</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'COALITIONS_&_BETRAYAL',
      icon: <Users className="w-8 h-8 text-p4" />,
      content: 'Propose coalitions to other players through the scoreboard to form large alliances (like the UN or Small Nation Blocs). Allies share open borders to route troops and reinforce each other. If all active players are allied, you win together! \n\nYou can break an alliance at any time, but doing so triggers a 10-second Truce warning to give them time to prepare for backstabs.',
      schematic: (
        <div className="w-full h-40 border border-p1 bg-black bg-opacity-40 flex items-center justify-center font-mono">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4 items-center">
              <span className="px-2 py-1 border border-p1 text-p1 text-xs">P1 (YOU)</span>
              <span className="text-p1">🤝</span>
              <span className="px-2 py-1 border border-p3 text-p3 text-xs">P2 (ALLY)</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-p1 opacity-80 text-center">
              Open Borders Enabled // Direct Transit Reinforcements Active
            </div>
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

      <div className="radar-panel max-w-xl w-full p-6 border-p1 glow-border relative z-10 flex flex-col justify-between h-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <h2 className="text-lg font-bold tracking-widest text-p1 glow-text uppercase">
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
        
        <div className="loader-bar mb-4"></div>

        {/* Schematic Display */}
        <div className="mb-4">
          {currentStepData.schematic}
        </div>

        {/* Informational Text */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
          <p className="text-xs leading-relaxed text-p1 opacity-90 whitespace-pre-line font-mono">
            {currentStepData.content}
          </p>
        </div>

        {/* Foot navigations */}
        <div className="flex justify-between items-center border-t border-p1 border-opacity-30 pt-4">
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
