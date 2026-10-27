// 灵兽录 · 音频层：WebAudio 程序化音效与环境乐
// 不依赖任何音频文件；首次触摸/按键后才创建 AudioContext，避免自动播放拦截。
(function () {
  const LB = window.LB = window.LB || {};
  let ctx = null;
  let master = null;
  let musicBus = null;
  let sfxBus = null;
  let loopTimer = null;
  let sceneName = 'title';
  let stepIndex = 0;
  let nextAt = 0;
  let unlocked = false;

  const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  const PATTERNS = {
    title: { step: 0.92, notes: [0, null, 4, null, 2, null, 5, null, 3, null, 4, null] },
    world: { step: 0.7, notes: [0, 2, 4, null, 5, 4, 2, null, 1, 3, 5, null, 4, 3, 2, null] },
    battle: { step: 0.34, notes: [0, 4, 2, 5, 0, 3, 4, null, 2, 5, 3, 4, 0, 4, 2, 5] },
    end: { step: 1.1, notes: [0, null, 3, null, 4, null, 5, null] },
  };

  function settings() {
    const s = typeof LB.saveState === 'function' ? LB.saveState() : null;
    return (s && s.settings) || {};
  }

  function volumes() {
    const g = settings();
    const music = g.musicVol == null ? 32 : Number(g.musicVol);
    const sfx = g.sfxVol == null ? 60 : Number(g.sfxVol);
    return { music: Math.max(0, Math.min(100, music)) / 100, sfx: Math.max(0, Math.min(100, sfx)) / 100 };
  }

  function applyVolumes() {
    const v = volumes();
    if (musicBus) musicBus.gain.value = v.music * 0.3;
    if (sfxBus) sfxBus.gain.value = v.sfx * 0.55;
  }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicBus = ctx.createGain();
    sfxBus = ctx.createGain();
    musicBus.connect(master);
    sfxBus.connect(master);
    applyVolumes();
    return ctx;
  }

  function tone(freq, dur, type, gain, when, bus) {
    if (!ctx) return;
    const t = when == null ? ctx.currentTime : when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(bus || sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function noise(dur, gain, when, cutoff) {
    if (!ctx) return;
    const t = when == null ? ctx.currentTime : when;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff || 1200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(sfxBus);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  function arp(freqs, step, gain, type) {
    if (!ctx) return;
    const t = ctx.currentTime;
    freqs.forEach(function (f, i) {
      tone(f, step * 1.6, type || 'sine', gain, t + i * step, sfxBus);
    });
  }

  function sfx(name) {
    if (!ctx || ctx.state === 'suspended') return;
    const t = ctx.currentTime;
    if (name === 'tap') { tone(880, 0.035, 'square', 0.035, t); return; }
    if (name === 'guide') { arp([659.25, 880], 0.07, 0.05); return; }
    if (name === 'hit') {
      noise(0.1, 0.16, t, 900);
      tone(110, 0.11, 'triangle', 0.09, t);
      return;
    }
    if (name === 'crit') {
      noise(0.14, 0.2, t, 1100);
      tone(98, 0.16, 'triangle', 0.12, t);
      tone(880, 0.07, 'square', 0.05, t + 0.02);
      return;
    }
    if (name === 'heal') { arp([523.25, 659.25, 783.99], 0.06, 0.05); return; }
    if (name === 'guard') { tone(220, 0.12, 'triangle', 0.07, t); return; }
    if (name === 'catch') { arp([659.25, 880, 1046.5, 1318.5], 0.07, 0.06); return; }
    if (name === 'catchFail') { tone(233, 0.12, 'sine', 0.06, t); tone(185, 0.16, 'sine', 0.05, t + 0.1); return; }
    if (name === 'victory') { arp([523.25, 659.25, 783.99, 1046.5], 0.1, 0.07); return; }
    if (name === 'faint') { arp([329.63, 246.94, 164.81], 0.12, 0.06, 'triangle'); return; }
    if (name === 'level') { arp([783.99, 987.77, 1174.66], 0.08, 0.06); return; }
    if (name === 'encounter') { tone(196, 0.08, 'square', 0.05, t); tone(261.63, 0.1, 'square', 0.05, t + 0.1); return; }
    if (name === 'error') { tone(164.81, 0.14, 'sawtooth', 0.05, t); return; }
    if (name === 'coin') { arp([1046.5, 1318.5], 0.05, 0.04); return; }
    tone(660, 0.05, 'sine', 0.03, t);
  }

  function stopMusic() {
    if (loopTimer) clearInterval(loopTimer);
    loopTimer = null;
  }

  function startMusic() {
    stopMusic();
    if (!ctx || ctx.state !== 'running') return;
    if (volumes().music <= 0) return;
    const pattern = PATTERNS[sceneName] || PATTERNS.world;
    stepIndex = 0;
    nextAt = ctx.currentTime + 0.12;
    loopTimer = setInterval(function () {
      if (!ctx) return;
      const now = ctx.currentTime;
      while (nextAt < now + 1.1) {
        const note = pattern.notes[stepIndex % pattern.notes.length];
        if (note != null) tone(SCALE[note], pattern.step * 0.85, 'triangle', 0.06, nextAt, musicBus);
        if (stepIndex % 4 === 0) tone(SCALE[0] / 2, pattern.step * 3, 'sine', 0.045, nextAt, musicBus);
        if (sceneName === 'battle' && stepIndex % 2 === 0) tone(98, 0.07, 'square', 0.028, nextAt, musicBus);
        nextAt += pattern.step;
        stepIndex += 1;
      }
    }, 420);
  }

  function setScene(id) {
    const next = id === 'view-battle' ? 'battle'
      : id === 'view-title' ? 'title'
        : id === 'view-end' ? 'end' : 'world';
    if (next === sceneName) return;
    sceneName = next;
    if (ctx && unlocked) startMusic();
  }

  function unlock() {
    const c = ensure();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (!unlocked) {
      unlocked = true;
      applyVolumes();
      startMusic();
    }
  }

  function applySettings() {
    applyVolumes();
    if (unlocked) startMusic();
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', function (e) {
      unlock();
      const target = e.target;
      if (target && target.closest && target.closest('button')) sfx('tap');
    }, true);
    document.addEventListener('keydown', unlock, true);
    document.addEventListener('visibilitychange', function () {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (unlocked) {
        ctx.resume();
        startMusic();
      }
    });
  }

  LB.audio = {
    unlock: unlock,
    scene: setScene,
    sfx: sfx,
    applySettings: applySettings,
    get running() { return !!(ctx && ctx.state === 'running'); },
  };
})();
