
import { Language } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private menuDrone: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playMenuMusic() {
    this.initCtx();
    if (this.menuDrone) return;

    const ctx = this.ctx!;
    this.menuDrone = ctx.createOscillator();
    this.droneGain = ctx.createGain();

    this.menuDrone.type = 'sine';
    this.menuDrone.frequency.setValueAtTime(40, ctx.currentTime);
    
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(42, ctx.currentTime);

    this.droneGain.gain.setValueAtTime(0, ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);

    this.menuDrone.connect(this.droneGain);
    osc2.connect(this.droneGain);
    this.droneGain.connect(ctx.destination);

    this.menuDrone.start();
    osc2.start();
  }

  public stopMenuMusic() {
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        this.menuDrone?.stop();
        this.menuDrone = null;
      }, 1100);
    }
  }

  public playScream() {
    this.initCtx();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start();
    whiteNoise.start();
    osc.stop(ctx.currentTime + 1);
    whiteNoise.stop(ctx.currentTime + 1);
  }

  public speakHuman(text: string, language: Language = 'tr') {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  public playLavaSound() {
    this.initCtx();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    // Low rumble
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(30, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 2);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 3);

    // Bubbling sound
    for (let i = 0; i < 5; i++) {
      const bubble = ctx.createOscillator();
      const bGain = ctx.createGain();
      bubble.frequency.setValueAtTime(100 + Math.random() * 200, now + i * 0.5);
      bGain.gain.setValueAtTime(0.05, now + i * 0.5);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.5 + 0.3);
      bubble.connect(bGain);
      bGain.connect(ctx.destination);
      bubble.start(now + i * 0.5);
      bubble.stop(now + i * 0.5 + 0.3);
    }
  }

  public playEntityWhisper(language: Language = 'tr') {
    this.initCtx();
    const trWords = ["Buradayım...", "Kaçamazsın...", "Paşabahçe...", "Karanlık...", "Camlar kırılacak..."];
    const enWords = ["I am here...", "You can't escape...", "Glass Factory...", "Darkness...", "Windows will shatter..."];
    
    const words = language === 'tr' ? trWords : enWords;
    const word = words[Math.floor(Math.random() * words.length)];
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US';
    utterance.rate = 0.5;
    utterance.pitch = 0.1;
    window.speechSynthesis.speak(utterance);
  }

  public playPoliceSiren() {
    this.initCtx();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    const now = ctx.currentTime;
    for(let i=0; i<4; i++) {
        osc.frequency.setValueAtTime(440, now + i*0.5);
        osc.frequency.setValueAtTime(660, now + i*0.5 + 0.25);
    }

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 2);
  }
}

export const soundManager = new SoundManager();
