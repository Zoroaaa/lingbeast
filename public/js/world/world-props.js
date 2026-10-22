// 灵兽录 · 探索层 · 像素物件与地表装饰

Object.assign(WorldScene.prototype, {

  buildProps() {
    const r = this.region;
    for (let y = 0; y < r.h; y += 1) {
      for (let x = 0; x < r.w; x += 1) {
        const t = r.tiles[y][x];
        if (t === 'T') {
          // 密林不必每格都放树：留出少量树隙，显著降低绘制对象数
          if (hash01(x * 3 + 1, y * 5 + 2) > 0.16) this.addTree(x, y);
        } else if (t === 'R') this.addRock(x, y);
      }
    }
    (r.props || []).forEach((p) => this.addProp(p));
    this.scatterDecor();
    if (r.id === 'shanmen') {
      this.addBanner(12, 20);
      this.addBanner(24, 21);
      this.addBanner(16, 12);
      this.addCrate(11, 17, 0.3);
      this.addCrate(12, 17, 0.7);
      this.addCrate(21, 20, 0.5);
      this.addGardenBed(7, 21);
      this.addGardenBed(25, 24);
      this.addGardenBed(31, 20);
      this.addBench(15, 23);
      this.addBench(23, 24);
      this.addStoneLantern(12, 23);
      this.addStoneLantern(26, 23);
      this.addTrainingDummy(30, 22);
      this.addWeaponRack(29, 23);
      this.addFence(9, 20, 3);
      this.addFence(27, 20, 3);
    } else if (r.id === 'guixu') {
      this.addBanner(10, 12);
    } else if (r.id === 'gutan') {
      this.addBanner(22, 12);
    }
  },

  addBanner(x, y) {
    this.ensureDecorTextures();
    const img = this.add.image(x * TILE + TILE / 2, (y + 1) * TILE, 'pixel-banner');
    img.setOrigin(0.5, 1).setDepth((y + 1) * TILE + 2);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: img, scaleX: { from: 1, to: 0.92 }, yoyo: true, repeat: -1, duration: 1800, ease: 'Linear' });
    }
  },

  addGardenBed(x, y) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 1);
    gRect(g, 0x0a0d14, px - 26, py - 4, 52, 4, 0.2);
    gRect(g, 0x5b4128, px - 26, py - 14, 52, 10);
    gRect(g, 0x3f2c18, px - 22, py - 12, 44, 6);
    for (let i = 0; i < 6; i += 1) {
      const fx = px - 20 + i * 8;
      gRect(g, 0x3f7a4e, fx, py - 17, 2, 6);
      gRect(g, i % 2 ? 0xf2d06a : 0xef8ab8, fx - 1, py - 19, 4, 3);
      gRect(g, 0xfff6d0, fx, py - 18, 1, 1);
    }
  },

  addBench(x, y) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 2);
    gRect(g, 0x0a0d14, px - 22, py - 3, 44, 4, 0.2);
    gRect(g, 0x6d6352, px - 22, py - 14, 44, 6);
    gRect(g, 0x9a9280, px - 22, py - 16, 44, 3);
    gRect(g, 0x4f4a40, px - 18, py - 10, 4, 10);
    gRect(g, 0x4f4a40, px + 14, py - 10, 4, 10);
  },

  addStoneLantern(x, y) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 6);
    gRect(g, 0x0a0d14, px - 14, py - 3, 28, 4, 0.22);
    gRect(g, 0x6d6352, px - 9, py - 8, 18, 7);
    gRect(g, 0x8d8471, px - 5, py - 26, 10, 18);
    gRect(g, 0x5a5448, px - 10, py - 32, 20, 6);
    gRect(g, 0xffe69a, px - 7, py - 30, 14, 4);
    gRect(g, 0x8d8471, px - 11, py - 38, 22, 4);
    gRect(g, 0xfff6d0, px - 2, py - 36, 4, 3);
    gRect(g, 0x2f7e6f, px - 16, py - 40, 32, 8, 0.18);
  },

  addTrainingDummy(x, y) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 5);
    gRect(g, 0x0a0d14, px - 14, py - 3, 28, 4, 0.2);
    gRect(g, 0x5b4128, px - 2, py - 44, 5, 44);
    gRect(g, 0x7d5a38, px - 13, py - 34, 27, 5);
    gRect(g, 0x9a7448, px - 11, py - 46, 22, 14);
    gRect(g, 0xd8b46a, px - 8, py - 43, 16, 9);
    gRect(g, 0xc8381f, px - 5, py - 40, 10, 4);
    gRect(g, 0xd8d0ba, px - 1, py - 40, 2, 2);
    gRect(g, 0x7d5a38, px - 4, py - 10, 9, 3);
  },

  addWeaponRack(x, y) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 5);
    gRect(g, 0x0a0d14, px - 18, py - 3, 36, 4, 0.2);
    gRect(g, 0x5b4128, px - 15, py - 32, 3, 32);
    gRect(g, 0x5b4128, px + 12, py - 32, 3, 32);
    gRect(g, 0x7d5a38, px - 15, py - 28, 30, 3);
    gRect(g, 0x9aa4b0, px - 9, py - 42, 2, 16);
    gRect(g, 0xe8f0ff, px - 10, py - 46, 4, 5);
    gRect(g, 0x9aa4b0, px + 3, py - 40, 2, 14);
    gRect(g, 0xe8f0ff, px + 2, py - 44, 4, 5);
  },

  addFence(x, y, len) {
    for (let i = 0; i < len; i += 1) {
      this.blockTile(x + i, y);
      const px = (x + i) * TILE + TILE / 2;
      const py = (y + 1) * TILE;
      const g = this.add.graphics().setDepth(py + 3);
      gRect(g, 0x0a0d14, px - 16, py - 2, 32, 3, 0.18);
      gRect(g, 0x5b4128, px - 13, py - 22, 4, 22);
      gRect(g, 0x5b4128, px + 9, py - 22, 4, 22);
      gRect(g, 0x8a6238, px - 16, py - 19, 32, 4);
      gRect(g, 0xb08a58, px - 16, py - 12, 32, 3);
      gRect(g, 0xb08a58, px - 16, py - 19, 32, 1);
    }
  },

  // 在空地上撒灌木、花丛、芦苇与木箱，提升单图密度（纯装饰，不阻挡寻路）
  scatterDecor() {
    this.ensureDecorTextures();
    const r = this.region;
    const used = {};
    const mark = (x, y) => { used[x + ',' + y] = 1; };
    (r.props || []).forEach((p) => mark(p.x, p.y));
    (r.npcs || []).forEach((n) => mark(n.x, n.y));
    (r.herbs || []).forEach((h) => mark(h.x, h.y));
    (r.gathers || []).forEach((g) => mark(g.x, g.y));
    (r.chests || []).forEach((c) => mark(c.x, c.y));
    (r.steles || []).forEach((s) => mark(s.x, s.y));
    (r.exits || []).forEach((e) => mark(e.x, e.y));
    (typeof SECRETS !== 'undefined' ? SECRETS : []).forEach((s) => {
      if (s.region === r.id) mark(s.x, s.y);
    });
    if (r.spawn) mark(r.spawn.x, r.spawn.y);
    if (r.boss) {
      const b = BOSSES[r.boss];
      if (b) mark(b.x, b.y);
    }

    for (let y = 1; y < r.h - 1; y += 1) {
      for (let x = 1; x < r.w - 1; x += 1) {
        if (used[x + ',' + y]) continue;
        const t = r.tiles[y][x];
        const h = hash01(x * 7 + 3, y * 11 + 5);
        if ((t === '.' || t === 'g') && h > 0.88) {
          this.addBush(x, y, h);
        } else if ((t === 'W' || t === 'Z') && h > 0.86) {
          this.addReeds(x, y, h);
        }
      }
    }
  },

  ensureDecorTextures() {
    const specs = [
      ['pixel-bush-a', 32, 26, '#2f5c3c', '#4c8a58', '#79b87a'],
      ['pixel-bush-b', 28, 22, '#355a30', '#5a8f45', '#8ac86a'],
      ['pixel-bush-c', 34, 24, '#264d3a', '#3f7a55', '#6fb87a'],
      ['pixel-reeds', 24, 32, '#3f6b46', '#7d9a4a', '#c9d88a'],
      ['pixel-crate', 24, 22, '#6b4a28', '#8a6238', '#c9a36a'],
      ['pixel-banner', 16, 44, '#3b4b78', '#ef5d4a', '#f4c542'],
    ];
    specs.forEach((sp) => {
      const key = sp[0];
      if (this.textures.exists(key)) return;
      const w = sp[1], h = sp[2], a = sp[3], b = sp[4], c = sp[5];
      const cv = this.textures.createCanvas(key, w, h);
      if (!cv) return;
      const ctx = cv.getContext();
      if (key.indexOf('bush') >= 0) {
        pxRect(ctx, 2, h - 6, w - 4, 6, a);
        pxRect(ctx, 0, h - 12, w, 7, b);
        pxRect(ctx, 4, h - 18, w - 8, 8, b);
        pxRect(ctx, 8, h - 22, w - 16, 6, c);
        pxRect(ctx, 6, h - 16, 4, 3, c);
        pxRect(ctx, w - 10, h - 13, 4, 3, c);
      } else if (key === 'pixel-reeds') {
        pxRect(ctx, 3, 10, 2, 22, a);
        pxRect(ctx, 8, 4, 2, 28, b);
        pxRect(ctx, 13, 8, 2, 24, a);
        pxRect(ctx, 18, 2, 2, 30, b);
        pxRect(ctx, 7, 2, 4, 3, c);
        pxRect(ctx, 17, 0, 4, 3, c);
      } else if (key === 'pixel-crate') {
        pxRect(ctx, 1, 2, w - 2, h - 3, a);
        pxRect(ctx, 3, 4, w - 6, h - 7, b);
        pxRect(ctx, 3, 4, w - 6, 3, c);
        pxRect(ctx, 3, h - 6, w - 6, 3, c);
        pxRect(ctx, w / 2 - 1, 5, 2, h - 9, a);
      } else {
        pxRect(ctx, 2, 0, 3, 44, a);
        pxRect(ctx, 5, 2, 9, 24, b);
        pxRect(ctx, 5, 4, 9, 3, c);
        pxRect(ctx, 5, 28, 9, 3, a);
        pxRect(ctx, 5, 34, 4, 8, b, 0.8);
      }
      cv.refresh();
    });
  },

  addBush(x, y, h) {
    const key = ['pixel-bush-a', 'pixel-bush-b', 'pixel-bush-c'][Math.floor(h * 97) % 3];
    const img = this.add.image(x * TILE + TILE / 2 + (h - 0.5) * 8, (y + 1) * TILE - 1, key);
    img.setOrigin(0.5, 1).setDepth((y + 1) * TILE + 2).setScale(0.9 + h * 0.3);
  },

  addReeds(x, y, h) {
    const img = this.add.image(x * TILE + TILE / 2 + (h - 0.5) * 10, (y + 1) * TILE - 4, 'pixel-reeds');
    img.setOrigin(0.5, 1).setDepth((y + 1) * TILE + 2);
    img.setAlpha(0.9);
  },

  addCrate(x, y, h) {
    this.blockTile(x, y);
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 3);
    g.fillStyle(0x0a0d14, 0.2);
    g.fillRect(px - 13, py - 3, 26, 4);
    const img = this.add.image(px + (h - 0.5) * 8, py, 'pixel-crate');
    img.setOrigin(0.5, 1).setDepth(py + 4);
  },

  ensureTreeTextures() {
    ['pixel-tree-a', 'pixel-tree-b'].forEach((key, variant) => {
      if (this.textures.exists(key)) return;
      const cv = this.textures.createCanvas(key, 48, 64);
      if (!cv) return;
      const c = cv.getContext();
      const dark = variant ? '#1d3a28' : '#23452f';
      const mid = variant ? '#2f5c3c' : '#376b47';
      const lit = variant ? '#4c8a58' : '#5a9c64';
      const hi = variant ? '#79b87a' : '#8ac889';
      const trunk = variant ? '#5b4128' : '#66492c';
      const trunkHi = variant ? '#7a5836' : '#86623b';
      // 树干
      pxRect(c, 22, 38, 6, 24, trunk);
      pxRect(c, 23, 38, 2, 24, trunkHi);
      pxRect(c, 18, 60, 14, 4, trunk, 0.55);
      // 树冠：阶梯像素团
      const rows = [
        [14, 10, 20, 10, dark],
        [10, 16, 28, 10, dark],
        [8, 24, 32, 10, mid],
        [10, 32, 28, 8, mid],
        [14, 38, 20, 5, dark],
        [16, 8, 16, 8, mid],
        [12, 18, 24, 10, mid],
        [14, 26, 20, 10, lit],
        [18, 14, 12, 8, lit],
        [20, 22, 8, 8, hi],
        [16, 32, 10, 4, lit],
      ];
      rows.forEach((r2) => pxRect(c, r2[0], r2[1], r2[2], r2[3], r2[4]));
      // 像素叶簇
      pxRect(c, 10, 22, 4, 4, hi);
      pxRect(c, 34, 28, 4, 4, hi);
      pxRect(c, 24, 10, 3, 3, lighten(hi));
      pxRect(c, 30, 20, 3, 3, lit);
      cv.refresh();
    });
  },

  addTree(x, y) {
    this.ensureTreeTextures();
    const h = hash01(x, y);
    const key = h > 0.5 ? 'pixel-tree-a' : 'pixel-tree-b';
    const px = x * TILE + TILE / 2 + (h - 0.5) * 8;
    const py = (y + 1) * TILE + 5;
    const img = this.add.image(px, py, key);
    img.setOrigin(0.5, 1).setDepth((y + 1) * TILE + 6).setScale(0.85 + h * 0.32);
    const regionTint = {
      gutan: 0x9a7058, shenyuan: 0x7f8fa8, luoxing: 0xb8a878,
      wuyin: 0x7f9a88, guixu: 0x9ac0a8, yunmeng: 0x9ab08a,
    }[this.region.id];
    if (regionTint) img.setTint(regionTint);
    else if (h < 0.3) img.setTint(0xb9d0b0);
    else if (h > 0.82) img.setTint(0x8fb88a);
  },

  addRock(x, y) {
    const px = x * TILE + TILE / 2, py = (y + 1) * TILE;
    const h = hash01(y, x);
    const w = 24 + Math.floor(h * 12);
    const ht = 14 + Math.floor(h * 8);
    const g = this.add.graphics().setDepth(py);
    // 阴影
    g.fillStyle(0x0a0d14, 0.22);
    g.fillRect(px - w / 2 - 2, py - 3, w + 4, 4);
    // 阶梯石块
    g.fillStyle(0x4d483c, 1);
    g.fillRect(px - w / 2, py - ht * 0.55, w, ht * 0.55);
    g.fillRect(px - w / 2 + 4, py - ht, w - 8, ht * 0.5);
    g.fillStyle(0x6f695b, 1);
    g.fillRect(px - w / 2 + 3, py - ht * 0.5, w - 6, ht * 0.4);
    g.fillStyle(0x8e8778, 1);
    g.fillRect(px - w / 2 + 6, py - ht + 2, w - 14, 5);
    g.fillStyle(0xa9a294, 1);
    g.fillRect(px - w / 2 + 8, py - ht + 2, 6, 3);
    g.fillStyle(0x3f3b32, 0.5);
    g.fillRect(px + 1, py - ht * 0.8, 2, ht * 0.6);
    if (h < 0.45) {
      g.fillStyle(0x6f8a6a, 0.8);
      g.fillRect(px - w / 2 + 4, py - ht * 0.9, 6, 3);
      g.fillRect(px + 2, py - ht * 0.45, 5, 2);
    }
  },

  addProp(p) {
    if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return;
    const px = p.x * TILE + TILE / 2;
    const py = (p.y + 1) * TILE;
    if (p.type === 'house') {
      const img = this.add.image(px, py, 'village', p.frame || 'house1');
      img.setOrigin(0.5, 1).setScale(1.6).setDepth(py + 10);
      const g = this.add.graphics().setDepth(py + 9);
      g.fillStyle(0x0a0d14, 0.18);
      g.fillRect(px - 52, py - 5, 104, 5);
      g.fillRect(px - 42, py - 9, 84, 4);
    } else if (p.type === 'altar') {
      this.addAltar(p.x, p.y);
    } else if (p.type === 'lantern') {
      this.addLantern(px, py);
    } else if (p.type === 'sign') {
      this.addSign(px, py);
    } else if (p.type === 'well') {
      this.addWell(px, py);
    } else if (p.type === 'ruin') {
      this.addRuin(px, py);
    } else if (p.type === 'stall') {
      this.addStall(px, py);
    } else if (p.type === 'dock') {
      this.addDock(px, py);
    }
  },

  addAltar(x, y) {
    const px = x * TILE + TILE / 2;
    const py = (y + 1) * TILE;
    const g = this.add.graphics().setDepth(py - 6);
    // 三级像素石台
    g.fillStyle(0x0a0d14, 0.22); g.fillRect(px - 54, py - 3, 108, 5);
    g.fillStyle(0x6d6352, 1); g.fillRect(px - 50, py - 12, 100, 10);
    g.fillStyle(0x8d8471, 1); g.fillRect(px - 44, py - 20, 88, 9);
    g.fillStyle(0xc9bda3, 1); g.fillRect(px - 38, py - 27, 76, 8);
    g.fillStyle(0xd9d0ba, 1); g.fillRect(px - 30, py - 31, 60, 5);
    g.fillStyle(0x564e40, 0.45); g.fillRect(px - 50, py - 12, 100, 2);
    // 阵纹
    const boss = BOSSES[this.region.boss];
    let col = 0x2f7e6f;
    if (boss && SPECIES[boss.sp]) col = worldHex(ELEMENTS[SPECIES[boss.sp].el].color);
    const ring = this.add.graphics().setDepth(py - 5);
    ring.fillStyle(col, 0.75);
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ring.fillRect(Math.round(Math.cos(a) * 26 - 1), Math.round(Math.sin(a) * 14 - 1), 3, 3);
    }
    ring.fillRect(-2, -16, 4, 4); ring.fillRect(-2, 12, 4, 4);
    ring.fillRect(-28, -2, 4, 4); ring.fillRect(24, -2, 4, 4);
    ring.setPosition(px, py - 16);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: ring, alpha: { from: 0.45, to: 1 }, duration: 1700, yoyo: true, repeat: -1, ease: 'Linear' });
    }
  },

  addLantern(px, py) {
    const g = this.add.graphics().setDepth(py + 8);
    g.fillStyle(0x0a0d14, 0.2); g.fillRect(px - 12, py - 3, 24, 4);
    g.fillStyle(0x4a4032, 1); g.fillRect(px - 3, py - 38, 6, 38);
    g.fillStyle(0xe8c15c, 1); g.fillRect(px - 8, py - 48, 16, 12);
    g.fillStyle(0xfff0a6, 1); g.fillRect(px - 5, py - 46, 10, 8);
    g.fillStyle(0x2f7e6f, 0.28); g.fillRect(px - 14, py - 52, 28, 20);
    g.fillStyle(0x2f7e6f, 0.16); g.fillRect(px - 20, py - 44, 40, 12);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: g, alpha: { from: 1, to: 0.7 }, yoyo: true, repeat: -1, duration: 1600, ease: 'Linear' });
    }
  },

  addSign(px, py) {
    const g = this.add.graphics().setDepth(py + 8);
    g.fillStyle(0x0a0d14, 0.2); g.fillRect(px - 18, py - 3, 36, 4);
    g.fillStyle(0x5b4128, 1); g.fillRect(px - 3, py - 26, 6, 26);
    g.fillStyle(0xc9b48a, 1); g.fillRect(px - 18, py - 42, 36, 18);
    g.fillStyle(0x8d744f, 1); g.fillRect(px - 18, py - 42, 36, 3);
    this.add.text(px, py - 39, this.region.name.slice(0, 2), {
      fontFamily: '"Zpix","Microsoft YaHei",monospace', fontSize: '10px', color: '#2a2118',
    }).setOrigin(0.5, 0).setDepth(py + 9);
  },

  addWell(px, py) {
    const g = this.add.graphics().setDepth(py + 6);
    g.fillStyle(0x0a0d14, 0.2); g.fillRect(px - 22, py - 3, 44, 4);
    g.fillStyle(0x6f6a5c, 1); g.fillRect(px - 20, py - 16, 40, 14);
    g.fillStyle(0x8f8a7a, 1); g.fillRect(px - 17, py - 20, 34, 6);
    g.fillStyle(0x9fb4b0, 1); g.fillRect(px - 12, py - 16, 24, 8);
    g.fillStyle(0x2c3a3a, 0.8); g.fillRect(px - 8, py - 14, 16, 5);
  },

  addRuin(px, py) {
    const g = this.add.graphics().setDepth(py + 8);
    g.fillStyle(0x0a0d14, 0.2); g.fillRect(px - 14, py - 3, 28, 4);
    g.fillStyle(0x7c7364, 1); g.fillRect(px - 10, py - 38, 20, 38);
    g.fillStyle(0x9c9383, 1); g.fillRect(px - 8, py - 40, 14, 32);
    g.fillStyle(0x5f584c, 1); g.fillRect(px - 14, py - 42, 28, 5);
    g.fillStyle(0x4f4a40, 0.8); g.fillRect(px + 1, py - 34, 2, 16);
    g.fillRect(px - 4, py - 20, 10, 2);
  },

  addStall(px, py) {
    const g = this.add.graphics().setDepth(py + 10);
    g.fillStyle(0x0a0d14, 0.2); g.fillRect(px - 34, py - 3, 68, 4);
    g.fillStyle(0x8a6b3f, 1);
    g.fillRect(px - 28, py - 30, 4, 30);
    g.fillRect(px + 24, py - 30, 4, 30);
    // 条纹雨棚
    for (let i = 0; i < 6; i += 1) {
      g.fillStyle(i % 2 ? 0xe8dcc0 : 0xbf4c38, 1);
      g.fillRect(px - 34 + i * 12, py - 42, 12, 10);
    }
    g.fillStyle(0x5a4430, 1); g.fillRect(px - 32, py - 12, 64, 6);
    g.fillStyle(0xd8b06a, 1); g.fillRect(px - 20, py - 10, 8, 5);
    g.fillStyle(0x9ad0a8, 1); g.fillRect(px - 4, py - 10, 9, 5);
  },

  addDock(px, py) {
    const g = this.add.graphics().setDepth(py + 6);
    g.fillStyle(0x5b4128, 1);
    g.fillRect(px - 24, py - 26, 6, 26);
    g.fillRect(px + 18, py - 26, 6, 26);
    g.fillStyle(0x9a7448, 1); g.fillRect(px - 30, py - 32, 60, 7);
    g.fillStyle(0x7d5a38, 1); g.fillRect(px - 30, py - 25, 60, 4);
    g.fillStyle(0x5b4128, 0.6); g.fillRect(px - 12, py - 32, 2, 7);
    g.fillRect(px + 4, py - 32, 2, 7);
  },
});

function lighten(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + 26);
  const g = Math.min(255, ((n >> 8) & 255) + 26);
  const b = Math.min(255, (n & 255) + 26);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
