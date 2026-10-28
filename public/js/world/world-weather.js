// 灵兽录 · 探索层 · 天气、昼夜与小地图
Object.assign(WorldScene.prototype, {
  buildWeather() {
    const weather = WEATHERS[this.region.weather] || WEATHERS.clear;
    const kind = weather.particle;
    this.weatherKind = kind;
    this.weatherGfx = this.add.graphics().setScrollFactor(0).setDepth(7000);
    this.layoutWeather();
    this._resizeHandler = () => this.layoutWeather();
    this.scale.on('resize', this._resizeHandler);

    const w = this.weatherView.w;
    const h = this.weatherView.h;

    if (kind === 'rain') {
      const n = this.reduceMotion ? 20 : 52;
      for (let i = 0; i < n; i += 1) {
        this.weatherParticles.push({
          x: Math.random() * w - 20,
          y: Math.random() * h,
          len: 8 + Math.random() * 10,
          vy: 460 + Math.random() * 260,
          vx: -60 - Math.random() * 40,
        });
      }
    } else if (kind === 'ash') {
      const n = this.reduceMotion ? 14 : 34;
      for (let i = 0; i < n; i += 1) {
        this.weatherParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 1.4,
          vy: 16 + Math.random() * 22,
          sway: 8 + Math.random() * 18,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (kind === 'fog' && !this.region.fog) {
      const fog = this.add.tileSprite(0, 0, this.worldW, this.worldH, 'fog').setOrigin(0, 0).setAlpha(0.16).setDepth(5002);
      fog.setTileScale(2.6, 2.6);
      this.weatherFog = fog;
    }
  },

  layoutWeather() {
    if (!this.weatherGfx) return;
    const cam = this.cameras.main;
    const w = this.scale.width || (cam && cam.width) || window.innerWidth || 960;
    const h = this.scale.height || (cam && cam.height) || window.innerHeight || 540;
    const z = (cam && cam.zoom) || 1;
    this.weatherView = { w: w, h: h };
    this.weatherGfx.setScale(1 / z);
    this.weatherGfx.setPosition(w / 2 * (z - 1) / z, h / 2 * (z - 1) / z);
  },

  updateWeather(delta) {
    const g = this.weatherGfx;
    if (!g) return;
    g.clear();
    const view = this.weatherView || { w: this.scale.width || 960, h: this.scale.height || 540 };
    if (this.weatherKind === 'rain') {
      const w = view.w;
      const h = view.h;
      g.lineStyle(1, 0xb9c8cd, 0.5);
      const dt = Math.min(delta, 60) / 1000;
      this.weatherParticles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y > h + p.len) { p.y = -p.len; p.x = Math.random() * w; }
        if (p.x < -24) p.x = w + 12;
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(p.x - 2.5, p.y + p.len);
        g.strokePath();
      });
    } else if (this.weatherKind === 'ash') {
      const h = view.h;
      const dt = Math.min(delta, 60) / 1000;
      const t = this.time.now / 1000;
      g.fillStyle(0xff7a3c, 0.55);
      this.weatherParticles.forEach((p) => {
        p.y += p.vy * dt;
        if (p.y > h + 6) p.y = -6;
        const s = Math.max(2, Math.round(p.r * 2));
        g.fillRect(Math.round(p.x + Math.sin(t + p.phase) * p.sway), Math.round(p.y), s, s);
      });
    }
  },

  buildDayNight() {
    this.dayNight = this.add.rectangle(0, 0, this.worldW, this.worldH, 0xf4efe2, 0.04).setOrigin(0, 0).setDepth(6000);
    this.applyDayTint();
  },

  applyDayTint() {
    if (!this.dayNight) return;
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    const key = st && st.time && TIME_PHASES[st.time.phase] ? st.time.phase : 'day';
    const phase = TIME_PHASES[key];
    let color = worldHex(phase.tint);
    let alpha = 0.08;
    if (key === 'dawn') alpha = 0.10;
    else if (key === 'dusk') alpha = 0.16;
    else if (key === 'night') { color = 0x2f3550; alpha = 0.26; }
    this.dayNight.setFillStyle(color, alpha);
  },

  advanceTimePhase() {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    if (!st || !st.time) return;
    const cur = TIME_ORDER.indexOf(st.time.phase);
    const next = TIME_ORDER[(cur + 1) % TIME_ORDER.length];
    st.time.phase = next;
    st.time.steps = 0;
    this.applyDayTint();
    if (LB.updateHud) LB.updateHud();
    this.drawMinimap();
    if (LB.toast) LB.toast('天时 · ' + TIME_PHASES[next].name);
    if (LB.persist) LB.persist();
  },

  buildMinimap() {
    const canvas = document.getElementById('minimap');
    this.mapCanvas = canvas;
    if (!canvas) return;
    this.mapCtx = canvas.getContext('2d');
    const cw = canvas.width || 180;
    const ch = canvas.height || 120;
    const r = this.region;
    const scale = Math.min(cw / r.w, ch / r.h);
    this.mapBw = Math.max(3, Math.min(6, scale));
    this.mapOx = (cw - r.w * this.mapBw) / 2;
    this.mapOy = (ch - r.h * this.mapBw) / 2;

    const label = document.getElementById('minimap-label');
    if (label) label.textContent = r.name;

    this.revealAround(this.playerTile.x, this.playerTile.y, 6);
    this.drawMinimap();
  },

  minimapTileColor(t) {
    // 小地图跟随本境地表色板，八境一眼可辨
    const pal = this.region && typeof palOf === 'function' ? palOf(this.region) : null;
    if (pal) {
      if (t === 'W') return pal.water;
      if (t === 'g') return pal.grass;
      if (t === ',') return pal.path;
      if (t === 'b' || t === 'M') return pal.plank;
      if (t === 'D') return pal.sand;
      if (t === 'Z') return pal.marsh;
      if (t === 'T') return pal.tree;
      if (t === 'R' || t === 'C') return pal.cliff;
      if (t === 'H') return pal.wood;
      if (t === 'A') return pal.stone;
      if (t === 'L') return pal.lava;
      return pal.base;
    }
    if (t === 'W') return '#2f8fa8';
    if (t === 'g') return '#5f8c49';
    if (t === ',') return '#b99a6e';
    if (t === 'b') return '#9c7046';
    if (t === 'D') return '#d6bc84';
    if (t === 'M') return '#9a7448';
    if (t === 'Z') return '#4f8f7c';
    if (t === 'T') return '#274d33';
    if (t === 'R') return '#7d7a68';
    if (t === 'H') return '#8f6339';
    if (t === 'C') return '#6f6b5b';
    if (t === 'A') return '#a89a7c';
    if (t === 'L') return '#ef7a32';
    return '#6f9d55';
  },

  revealAround(cx, cy, radius) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx * dx + dy * dy > radius * radius + radius) continue;
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= this.region.w || y >= this.region.h) continue;
        this.explored.add(x + ',' + y);
      }
    }
  },

  drawMinimap() {
    const ctx = this.mapCtx;
    // 战斗/标题态会隐藏探索视图；此时整图重绘没有意义，也省掉每步一次的全量 fillRect。
    if (!ctx || !this.mapCanvas || !this.mapCanvas.isConnected || this.mapCanvas.offsetParent === null) return;
    const r = this.region;
    const cw = this.mapCanvas.width || 180;
    const ch = this.mapCanvas.height || 120;
    const bw = this.mapBw || 4;
    ctx.clearRect(0, 0, cw, ch);
    // 未探索区域用深色雾遮住，已走过的地形成图，避免小地图看起来像一块空白羊皮
    ctx.fillStyle = '#3b3427';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = 'rgba(240,225,190,.05)';
    for (let gy = 0; gy < ch; gy += 6) ctx.fillRect(0, gy, cw, 1);

    const size = Math.ceil(bw);
    for (let y = 0; y < r.h; y += 1) {
      for (let x = 0; x < r.w; x += 1) {
        if (!this.explored.has(x + ',' + y)) continue;
        ctx.fillStyle = this.minimapTileColor(r.tiles[y][x]);
        ctx.fillRect(this.mapOx + x * bw, this.mapOy + y * bw, size, size);
      }
    }

    (r.exits || []).forEach((exit) => {
      if (!this.explored.has(exit.x + ',' + exit.y)) return;
      ctx.fillStyle = '#4aa5a0';
      ctx.fillRect(this.mapOx + exit.x * bw, this.mapOy + exit.y * bw, size, size);
    });

    const dot = (x, y, color, radius) => {
      if (!this.explored.has(x + ',' + y)) return;
      ctx.fillStyle = color;
      const s = Math.max(2, Math.round(radius * 2));
      ctx.fillRect(Math.round(this.mapOx + x * bw + bw / 2 - s / 2), Math.round(this.mapOy + y * bw + bw / 2 - s / 2), s, s);
    };

    const colors = {
      npc: '#f4c542', boss: '#ef5d4a', chest: '#d8b45a',
      gather: '#5fe39b', herb: '#5fe39b', stele: '#a9c0d2',
    };
    this.entitySprites.forEach((e) => {
      const color = colors[e.kind];
      if (!color) return;
      dot(e.x, e.y, color, e.kind === 'boss' ? 2.8 : 2);
    });

    const p = this.playerTile;
    dot(p.x, p.y, '#ffffff', Math.max(2.4, bw * 0.7));
  },
});
