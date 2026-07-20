// Web Audio API Synthesizer for Retro Military Radar Sound Effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  // 1. Sonar Ping (Menu clicks, lobby joins, alliance proposals)
  ping: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    // Frequency decay for sonar effect
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.2);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  },

  // 2. Telemetry Click (Troop movements, countdowns)
  click: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  // 3. Radar Scan Sweep (Low-frequency screen refresh sweep)
  sweep: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  },

  // 4. Combat Explosion (Static noise blast when attacks land)
  explosion: (isVictory: boolean = false) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * (isVictory ? 0.8 : 0.4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + (isVictory ? 0.8 : 0.4));

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isVictory ? 0.8 : 0.4));

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + (isVictory ? 0.8 : 0.4));

    // If it is a victory, add a high pitch sub-beep
    if (isVictory) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);

      oscGain.gain.setValueAtTime(0.15, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  },

  // 5. Espionage Failure Warning (Klaxon when Lewis & Clark is caught)
  klaxon: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.5;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(380, start);
      osc1.frequency.linearRampToValueAtTime(440, start + 0.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(190, start);
      osc2.frequency.linearRampToValueAtTime(220, start + 0.2);

      gainNode.gain.setValueAtTime(0, start);
      gainNode.gain.linearRampToValueAtTime(0.12, start + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, start + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + 0.4);
      osc2.stop(start + 0.4);
    }
  },

  // 6. Victory Fanfare (Game Over win)
  victoryFanfare: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const noteStart = now + idx * 0.2;
      const noteDuration = idx === notes.length - 1 ? 0.8 : 0.25;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
    });
  },

  // 7. Defeat Bugle (Game Over loss)
  defeatBugle: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [392.00, 311.13, 261.63]; // G4, Eb4, C4
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const noteStart = now + idx * 0.35;
      const noteDuration = idx === notes.length - 1 ? 1.0 : 0.4;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
    });
  }
};
