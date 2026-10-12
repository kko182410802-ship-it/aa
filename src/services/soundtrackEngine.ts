/**
 * Cinematic Web Audio Soundtrack & Sound FX Engine for 「말은 남는다」
 * Features procedural cinematic scoring synchronized to the 60-second narrative:
 * 0~7s: Lonely cold drone + delicate minor felt piano + notification chime
 * 7~17s: Tension build, heartbeats, digital noise/glitch clicks
 * 17~27s: Gradual fade out into total breathless silence
 * 27~37s: Sacred silence, followed by subtle pure warm glass harmonics
 * 37~50s: Hopeful, emotional acoustic piano chords + warm morning strings
 * 50~60s: Sustained deep reverberant bell chime and gentle fade out
 */

class SoundtrackEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private isRunning: boolean = false;
  private volume: number = 0.8;
  private isMuted: boolean = false;

  // Active oscillator/nodes tracking
  private activeNodes: (AudioNode | number)[] = [];
  private lastTriggeredTime: number = -1;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public stopAll() {
    this.isRunning = false;
    this.lastTriggeredTime = -1;
    // Fade down master gain quickly to avoid click
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  // Play a soft acoustic piano note
  private playPianoNote(freq: number, startTime: number, duration: number, velocity: number = 0.5, warm: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const now = startTime;

    // Fundamental oscillator (triangle for felt piano)
    const osc1 = this.ctx.createOscillator();
    osc1.type = warm ? 'triangle' : 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Subtle overtone for brightness
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Note Gain Envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.02); // gentle attack
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.15, now + 0.3); // initial decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);     // sustain decay

    // Lowpass filter for felt / soft intimacy
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(warm ? 1800 : 1100, now);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    filter.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  // Play a subtle heartbeat thump
  private playHeartbeat(time: number, intensity: number = 0.4) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.18);

    gain.gain.setValueAtTime(intensity * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  // Play a subtle high digital notification ping
  public playNotificationPing() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    osc.frequency.setValueAtTime(1318.5, now + 0.08); // E6

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Play a subtle digital glitch click
  private playGlitchTick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400 + Math.random() * 1200, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // Play warm celestial pad chord
  private playWarmChord(freqs: number[], startTime: number, duration: number, vol: number = 0.2) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, startTime);
      filter.frequency.linearRampToValueAtTime(1400, startTime + duration * 0.5);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.12, startTime + 1.2);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.2);
    });
  }

  /**
   * Main synchronization tick: called on animation frames during playback
   * @param currentSec Current film playback position in seconds (0.00 to 60.00)
   */
  public updateAtTime(currentSec: number, isPlaying: boolean) {
    if (!isPlaying) {
      return;
    }

    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const rounded = Math.floor(currentSec * 4) / 4; // 250ms quantum
    if (rounded === this.lastTriggeredTime) return;
    this.lastTriggeredTime = rounded;

    // --- SCENE 1 (0 ~ 7s): Cold, quiet, solitary ---
    if (rounded === 0.25) {
      this.playPianoNote(261.63, now, 3.5, 0.35); // C4
      this.playPianoNote(130.81, now, 5.0, 0.25); // C3 low base
    }
    if (rounded === 2.25) {
      this.playNotificationPing();
    }
    if (rounded === 3.5) {
      this.playPianoNote(311.13, now, 3.0, 0.3); // Eb4 (melancholy)
    }
    if (rounded === 5.25) {
      this.playPianoNote(293.66, now, 2.5, 0.28); // D4
    }

    // --- SCENE 2 (7 ~ 17s): Accumulating comments, digital glitch & tension ---
    if (rounded >= 7.0 && rounded < 17.0) {
      // Heartbeats every ~1.2s speeding up slightly
      const beatMod = rounded % 1.25;
      if (beatMod < 0.25) {
        this.playHeartbeat(now, 0.35 + (rounded - 7) * 0.03);
      }
      // Occasional digital clicks
      if (rounded === 7.5 || rounded === 8.75 || rounded === 10.25 || rounded === 12.0 || rounded === 13.5 || rounded === 15.0) {
        this.playGlitchTick(now);
      }
      // Distressed piano notes
      if (rounded === 8.0) {
        this.playPianoNote(196.00, now, 2.5, 0.32); // G3
      }
      if (rounded === 10.5) {
        this.playPianoNote(233.08, now, 2.2, 0.35); // Bb3
      }
      if (rounded === 13.25) {
        this.playPianoNote(174.61, now, 2.5, 0.3); // F3
      }
      if (rounded === 15.5) {
        this.playPianoNote(164.81, now, 2.0, 0.3); // E3
      }
    }

    // --- SCENE 3 (17 ~ 27s): Music attenuates and completely halts into silence ---
    if (rounded === 17.5) {
      this.playPianoNote(130.81, now, 4.0, 0.2); // Fading C3
    }
    if (rounded === 20.0) {
      this.playPianoNote(196.00, now, 3.0, 0.12); // Very quiet G3
    }
    if (rounded === 22.5) {
      this.playPianoNote(155.56, now, 2.5, 0.05); // Barely audible Eb3
    }
    // 24.0 ~ 27.0s: Total silence as requested: "배경 음악은 점점 작아지다가 완전히 멈춘다"

    // --- SCENE 4 (27 ~ 37s): Brief silence, then emergence of small warm light ---
    // 27.0 ~ 31.0s: Absolute breathless silence ("잠시 아무 소리도 들리지 않는다")
    if (rounded === 32.0) {
      // Gentle pure crystalline warmth emerges
      this.playPianoNote(523.25, now, 4.5, 0.2, true); // C5 crystalline
      this.playPianoNote(659.25, now + 0.3, 4.0, 0.18, true); // E5
    }
    if (rounded === 34.5) {
      this.playWarmChord([261.63, 329.63, 392.00], now, 3.5, 0.18); // C major chord
    }

    // --- SCENE 5 (37 ~ 50s): Warm morning sunrise, hopeful piano music resumes ---
    if (rounded === 37.0) {
      // Warm hopeful F major chord progression
      this.playPianoNote(174.61, now, 5.0, 0.35, true); // F3 bass
      this.playPianoNote(349.23, now + 0.1, 4.0, 0.45, true); // F4
      this.playPianoNote(440.00, now + 0.25, 4.0, 0.42, true); // A4
      this.playPianoNote(523.25, now + 0.4, 4.5, 0.4, true); // C5
      this.playWarmChord([174.61, 261.63, 349.23, 440.00], now, 5.0, 0.3);
    }
    if (rounded === 40.0) {
      // C major warmth
      this.playPianoNote(130.81, now, 4.5, 0.35, true); // C3
      this.playPianoNote(329.63, now + 0.15, 3.5, 0.4, true); // E4
      this.playPianoNote(392.00, now + 0.3, 3.5, 0.38, true); // G4
      this.playPianoNote(523.25, now + 0.45, 4.0, 0.42, true); // C5
    }
    if (rounded === 43.0) {
      // D minor to Bb major (tender resolve)
      this.playPianoNote(146.83, now, 4.0, 0.32, true); // D3
      this.playPianoNote(349.23, now + 0.2, 3.5, 0.38, true); // F4
      this.playPianoNote(440.00, now + 0.4, 3.5, 0.4, true); // A4
      this.playPianoNote(587.33, now + 0.6, 4.0, 0.45, true); // D5
    }
    if (rounded === 46.0) {
      // Bb major uplifting resolution
      this.playPianoNote(116.54, now, 4.5, 0.35, true); // Bb2
      this.playPianoNote(293.66, now + 0.15, 3.5, 0.4, true); // D4
      this.playPianoNote(349.23, now + 0.3, 3.5, 0.42, true); // F4
      this.playPianoNote(466.16, now + 0.45, 4.5, 0.45, true); // Bb4
      this.playWarmChord([233.08, 293.66, 349.23, 466.16], now, 4.5, 0.3);
    }

    // --- SCENE 6 (50 ~ 60s): Deep contemplative outro ---
    if (rounded === 50.5) {
      // Final deep reverberant peace chime
      this.playPianoNote(87.31, now, 8.0, 0.35, true); // F2 low sustained
      this.playPianoNote(174.61, now + 0.1, 7.5, 0.3, true); // F3
      this.playPianoNote(349.23, now + 0.3, 7.0, 0.38, true); // F4
      this.playPianoNote(523.25, now + 0.5, 7.0, 0.35, true); // C5
      this.playPianoNote(698.46, now + 0.7, 7.5, 0.32, true); // F5
    }
    if (rounded === 54.5) {
      this.playPianoNote(440.00, now, 5.0, 0.2, true); // Soft A4 chime
      this.playPianoNote(523.25, now + 0.3, 5.0, 0.18, true); // Soft C5 chime
    }
  }
}

export const soundtrack = new SoundtrackEngine();
