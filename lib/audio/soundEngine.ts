/**
 * LAUME — PROSEDÜREL SES MOTORU
 *
 * Dosya yok, gecikme yok: her ses Web Audio ile anlık üretilir. Tasarım
 * ilkesi keşif deneyiminin kendisiyle aynı — hiçbir ses "ödül jingle'ı" gibi
 * duymaz. Malzeme sesleri (kâğıt, toz, mum mührü) filtrelenmiş gürültüden;
 * atmosfer çok alçak, hafif dalgalanan bir hava katmanından gelir.
 *
 * Tüm sesler ilk kullanıcı hareketine kadar başlamaz ve deneyim tamamen
 * sessizken de eksiksiz çalışır (spec §9).
 */

const MUTE_KEY = "laume_audio_muted";
const LEGACY_MUTE_KEY = "layar_audio_muted";
const MASTER_LEVEL = 0.26;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Tüm malzeme seslerinin ortak "oda" tonu. */
  private voice: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private ambience: {
    gain: GainNode;
    sources: AudioScheduledSourceNode[];
    lfo: OscillatorNode;
  } | null = null;

  // Ses açık bir tercih olmalı; ilk genel tıklamada kendiliğinden başlamaz.
  private muted = true;
  private initialized = false;
  private lastFrictionAt = 0;
  private lastSlideAt = 0;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      const stored =
        window.localStorage.getItem(MUTE_KEY) ?? window.localStorage.getItem(LEGACY_MUTE_KEY);
      this.muted = stored === null ? true : stored === "true";
    } catch {
      this.muted = true;
    }
  }

  // ------------------------------------------------------------------ kurulum
  public init() {
    if (typeof window === "undefined" || this.initialized) return;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;

      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.muted ? 0 : MASTER_LEVEL, this.ctx.currentTime);

      // Hafif bir "oda": tiz uçları yumuşatır, sesler plastik durmaz.
      this.voice = this.ctx.createBiquadFilter();
      this.voice.type = "lowshelf";
      this.voice.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.voice.gain.setValueAtTime(2, this.ctx.currentTime);

      this.voice.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.initialized = true;
    } catch {
      // Ses desteklenmiyorsa deneyim sessiz devam eder.
    }
  }

  private ensure(): boolean {
    this.init();
    if (!this.ctx || !this.voice || this.muted) return false;
    if (this.ctx.state === "suspended") void this.ctx.resume().catch(() => undefined);
    return true;
  }

  /** Malzeme sesleri için tekrar kullanılan 2 saniyelik pembe-imsi gürültü. */
  private noise(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Basit pembe gürültü yaklaşımı — beyaz gürültüden çok daha "doğal".
      b0 = 0.99765 * b0 + white * 0.099;
      b1 = 0.963 * b1 + white * 0.2965;
      b2 = 0.57 * b2 + white * 1.0526;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.22;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Filtrelenmiş, zarflı tek bir gürültü darbesi — kâğıt, toz ve mum
   * seslerinin tamamı bunun türevi.
   */
  private burst(options: {
    at?: number;
    duration: number;
    level: number;
    type: BiquadFilterType;
    from: number;
    to?: number;
    q?: number;
    attack?: number;
  }) {
    if (!this.ctx || !this.voice) return;
    const buffer = this.noise();
    if (!buffer) return;

    const now = this.ctx.currentTime + (options.at ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.playbackRate.setValueAtTime(0.8 + Math.random() * 0.5, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = options.type;
    filter.frequency.setValueAtTime(options.from, now);
    if (options.to && options.to !== options.from) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(40, options.to),
        now + options.duration
      );
    }
    filter.Q.setValueAtTime(options.q ?? 1, now);

    const gain = this.ctx.createGain();
    const attack = options.attack ?? 0.006;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, options.level), now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.voice);
    src.start(now);
    src.stop(now + options.duration + 0.05);
  }

  /** Yumuşak, saf bir ton — yalnızca eşik anlarında kullanılır. */
  private tone(options: {
    at?: number;
    freq: number;
    to?: number;
    duration: number;
    level: number;
    type?: OscillatorType;
  }) {
    if (!this.ctx || !this.voice) return;
    const now = this.ctx.currentTime + (options.at ?? 0);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = options.type ?? "sine";
    osc.frequency.setValueAtTime(options.freq, now);
    if (options.to) {
      osc.frequency.exponentialRampToValueAtTime(options.to, now + options.duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(options.level, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + options.duration);

    osc.connect(gain);
    gain.connect(this.voice);
    osc.start(now);
    osc.stop(now + options.duration + 0.05);
  }

  // -------------------------------------------------------------------- sessiz
  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      window.localStorage.setItem(MUTE_KEY, String(this.muted));
    } catch {
      // izin yoksa sessizce geç
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.muted ? 0 : MASTER_LEVEL,
        this.ctx.currentTime,
        0.08
      );
    }
    return this.muted;
  }

  public getMuted(): boolean {
    return this.muted;
  }

  // ----------------------------------------------------------------- atmosfer
  /**
   * Ortam: duyulur bir "uğultu" değil, odanın havası. Yavaşça nefes alan,
   * ağır filtrelenmiş gürültü + çok alçak iki tonlu bir yastık.
   */
  public startAmbience() {
    if (!this.ensure() || !this.ctx || !this.voice || this.ambience) return;
    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setTargetAtTime(0.16, now, 3.5);
      gain.connect(this.voice);

      const sources: AudioScheduledSourceNode[] = [];

      // 1) Hava — çok alçaktan kesilmiş sürekli gürültü.
      const buffer = this.noise();
      if (buffer) {
        const air = this.ctx.createBufferSource();
        air.buffer = buffer;
        air.loop = true;
        const airFilter = this.ctx.createBiquadFilter();
        airFilter.type = "bandpass";
        airFilter.frequency.setValueAtTime(420, now);
        airFilter.Q.setValueAtTime(0.6, now);
        const airGain = this.ctx.createGain();
        airGain.gain.setValueAtTime(0.09, now);
        air.connect(airFilter);
        airFilter.connect(airGain);
        airGain.connect(gain);
        air.start(now);
        sources.push(air);
      }

      // 2) Yastık — beşli aralık, neredeyse duyulmayan bir zemin.
      [98, 147].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(i === 0 ? 0.055 : 0.03, now);
        osc.connect(oscGain);
        oscGain.connect(gain);
        osc.start(now);
        sources.push(osc);
      });

      // 3) Nefes — 22 saniyelik çok yavaş bir seviye dalgalanması.
      const lfo = this.ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(1 / 22, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.055, now);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start(now);

      this.ambience = { gain, sources, lfo };
    } catch {
      // yok sayılabilir
    }
  }

  public stopAmbience() {
    if (!this.ctx || !this.ambience) return;
    const { gain, sources, lfo } = this.ambience;
    this.ambience = null;
    try {
      gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6);
      window.setTimeout(() => {
        try {
          sources.forEach((source) => {
            source.stop();
            source.disconnect();
          });
          lfo.stop();
          lfo.disconnect();
          gain.disconnect();
        } catch {
          // yok sayılabilir
        }
      }, 1600);
    } catch {
      // yok sayılabilir
    }
  }

  // ------------------------------------------------------------------ keşif
  /**
   * İz üstüne basma. Toz üzerinde yumuşak bir temas; hedefe yaklaştıkça
   * hafifçe tizleşir, böylece yol ilerledikçe ritim yükseliyormuş gibi olur.
   */
  public playStep(progress: number) {
    if (!this.ensure()) return;
    const p = Math.min(1, Math.max(0, progress));
    this.burst({
      duration: 0.16,
      level: 0.16,
      type: "bandpass",
      from: 520 + p * 520,
      to: 240 + p * 200,
      q: 1.1,
      attack: 0.004,
    });
    this.tone({ freq: 300 + p * 260, to: 180 + p * 160, duration: 0.2, level: 0.028 });
  }

  /** Yerden kâğıt parçası kalkması — kuru, kısa bir hışırtı. */
  public playPaperFragment() {
    if (!this.ensure()) return;
    this.burst({ duration: 0.34, level: 0.14, type: "highpass", from: 900, to: 2600, q: 0.7 });
    this.burst({ at: 0.12, duration: 0.22, level: 0.08, type: "bandpass", from: 1800, q: 1.4 });
  }

  /** Zarf bulundu: sıcak, tek bir açılma. Zafer değil, fark ediş. */
  public playReveal() {
    if (!this.ensure()) return;
    this.tone({ freq: 196, to: 293.66, duration: 1.1, level: 0.05 });
    this.tone({ at: 0.08, freq: 392, to: 587.33, duration: 0.9, level: 0.022 });
    this.burst({ duration: 0.5, level: 0.06, type: "lowpass", from: 700, to: 300 });
  }

  /** Mühre bastıkça duyulan mum sürtünmesi — ilerleme arttıkça gerilir. */
  public playWaxFriction(progress: number) {
    if (!this.ensure()) return;
    const now = performance.now();
    if (now - this.lastFrictionAt < 90) return;
    this.lastFrictionAt = now;
    const p = Math.min(1, Math.max(0, progress));
    this.burst({
      duration: 0.13,
      level: 0.03 + p * 0.075,
      type: "bandpass",
      from: 180 + p * 520,
      q: 4.5,
      attack: 0.02,
    });
  }

  /** Mührün kırılması: kuru bir çatlak + dökülen mum kırıntıları. */
  public playSealBreak() {
    if (!this.ensure()) return;
    // Çatlak — çok kısa, tiz, gürültülü.
    this.burst({ duration: 0.09, level: 0.3, type: "bandpass", from: 2600, to: 900, q: 2.2, attack: 0.002 });
    // Gövde — mumun kendi ağırlığı.
    this.tone({ freq: 150, to: 62, duration: 0.34, level: 0.12, type: "triangle" });
    // Kırıntılar — birbirinden bağımsız üç küçük düşüş.
    [0.07, 0.13, 0.21].forEach((at, i) => {
      this.burst({
        at,
        duration: 0.1,
        level: 0.07 - i * 0.018,
        type: "bandpass",
        from: 1500 + i * 500,
        q: 3,
        attack: 0.002,
      });
    });
  }

  /** Mektup zarftan kayarken; sürükleme hızıyla orantılı. */
  public playPaperSlide(intensity: number) {
    if (!this.ensure()) return;
    const now = performance.now();
    if (now - this.lastSlideAt < 110) return;
    this.lastSlideAt = now;
    const p = Math.min(1, Math.max(0, intensity));
    if (p < 0.05) return;
    this.burst({
      duration: 0.2,
      level: 0.02 + p * 0.09,
      type: "bandpass",
      from: 1400 + p * 1800,
      to: 700,
      q: 0.9,
      attack: 0.03,
    });
  }

  /** Mektup tamamen çıktı ve açıldı. */
  public playPaperOpen() {
    if (!this.ensure()) return;
    this.burst({ duration: 0.55, level: 0.13, type: "highpass", from: 1200, to: 2400, q: 0.6 });
    this.tone({ at: 0.1, freq: 261.63, duration: 1.4, level: 0.04 });
    this.tone({ at: 0.18, freq: 392, duration: 1.3, level: 0.026 });
  }

  /** Kapanış: açık, çözülmüş bir akor. Yavaş girer, uzun sürer. */
  public playResolution() {
    if (!this.ensure()) return;
    [174.61, 261.63, 349.23, 523.25].forEach((freq, i) => {
      this.tone({ at: i * 0.14, freq, duration: 2.4 - i * 0.2, level: 0.045 - i * 0.007 });
    });
  }
}

export const soundEngine = new SoundEngine();
