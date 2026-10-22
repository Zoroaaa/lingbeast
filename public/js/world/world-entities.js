// 灵兽录 · 探索层 · 实体、Boss 与像素小物件

function gRect(g, color, x, y, w, h, alpha) {
  g.fillStyle(color, alpha == null ? 1 : alpha);
  g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

const PIXEL_FONT = '"Zpix","Fusion Pixel 12px","Microsoft YaHei",monospace';

Object.assign(WorldScene.prototype, {
  buildEntities() {
    const r = this.region;

    (r.npcs || []).forEach((npc) => this.addNpc(npc));
    (r.herbs || []).forEach((herb) => this.addHerb(herb));
    (r.gathers || []).forEach((node) => this.addGather(node));
    (r.steles || []).forEach((stele, i) => this.addStele(stele, i));
    (r.chests || []).forEach((chest) => this.addChest(chest));
    (typeof SECRETS !== 'undefined' ? SECRETS : []).forEach((secret) => {
      if (secret.region === r.id) this.addSecret(secret);
    });

    const boss = BOSSES[r.boss];
    if (boss && !LB.flag('boss_' + boss.id)) {
      this.buildBoss(boss);
      this.blockTile(boss.x, boss.y);
      this.entitySprites.push({
        kind: 'boss', x: boss.x, y: boss.y, ref: boss, node: this.bossNode, hit: this.bossHit, extras: [],
      });
    }

    this.buildExitHints();
  },

  addNpc(npc) {
    const tex = TEX_FOR_SPRITE[npc.sprite] || 'npc';
    const sp = this.add.sprite(npc.x * TILE + TILE / 2, (npc.y + 1) * TILE - 2, tex);
    sp.setOrigin(0.5, 1).setScale(npc.scale || 2.6).setDepth((npc.y + 1) * TILE + 2);
    if (npc.tint) sp.setTint(npc.tint);
    const f = DIR[npc.dir || 'down'];
    sp.setFrame(f === 0 ? 0 : f === 1 ? 4 : 8);
    if (f === 2) sp.setFlipX(true);
    sp.setData('kind', 'npc');
    sp.setData('ref', npc);
    // 用更大的透明热区承接点击：人物本体只有 16×16，直接点精灵很容易落空
    const hit = this.add.zone(sp.x, sp.y, 48, 74).setOrigin(0.5, 1).setDepth(sp.depth + 1);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'npc', ref: npc, x: npc.x, y: npc.y });
    });

    this.blockTile(npc.x, npc.y);
    this.addShadow(npc.x, npc.y, 0.9);
    const label = this.addNameTag(npc, sp);

    let mark = null;
    let markText = '';
    let markColor = '#4fd68c';
    if (npc.mark === 'main') markText = '!';
    else if (npc.service || npc.mark === 'side') {
      markText = '?';
      markColor = npc.service === 'shop' || npc.service === 'stable' || npc.service === 'travel' ? '#f4c542' : '#5cc8e6';
    }
    if (markText) {
      mark = this.add.text(sp.x, sp.y - sp.displayHeight - 8, markText, {
        fontFamily: PIXEL_FONT, fontSize: '20px', color: markColor, fontStyle: 'bold',
      }).setOrigin(0.5, 1).setDepth(sp.depth + 40);
      mark.setStroke('#0b1020', 5);
      mark.setData('kind', 'mark');
      if (!this.reduceMotion) {
        this.tweens.add({ targets: mark, y: mark.y - 5, yoyo: true, repeat: -1, duration: 900, ease: 'Linear' });
      }
    }

    this.entitySprites.push({
      kind: 'npc', x: npc.x, y: npc.y, ref: npc, node: sp, hit: hit, extras: [label, mark],
    });
  },

  addHerb(herb) {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    if (st && st.gathered && st.gathered[herb.id]) return;
    const px = herb.x * TILE + TILE / 2, py = (herb.y + 1) * TILE - 6;
    const g = this.add.graphics().setDepth((herb.y + 1) * TILE + 6);
    gRect(g, 0x0a0d14, px - 9, py - 1, 18, 3, 0.2);
    gRect(g, 0x3f7a4e, px - 8, py - 14, 4, 14);
    gRect(g, 0x5aa866, px - 5, py - 18, 4, 18);
    gRect(g, 0x2f5c3b, px + 2, py - 12, 4, 12);
    gRect(g, 0x8fdf8a, px - 4, py - 20, 3, 3);
    gRect(g, 0xfff1b8, px + 3, py - 15, 3, 3);
    g.setData('kind', 'herb');
    g.setData('ref', herb);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: g, alpha: { from: 0.7, to: 1 }, yoyo: true, repeat: -1, duration: 1200, ease: 'Linear' });
    }
    const hit = this.add.zone(px, py - 8, 34, 34).setOrigin(0.5, 1).setDepth(g.depth + 1);
    hit.setData('kind', 'herb');
    hit.setData('ref', herb);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'herb', ref: herb, x: herb.x, y: herb.y });
    });
    this.blockTile(herb.x, herb.y);
    this.entitySprites.push({ kind: 'herb', x: herb.x, y: herb.y, ref: herb, node: g, hit: hit, extras: [] });
  },

  isGatherAvailable(node) {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    if (!st || !st.gathered) return true;
    const rec = st.gathered[node.id];
    if (!rec) return true;
    const respawn = node.respawn || 'chapter';
    if (respawn === 'chapter') return rec.chapter !== st.chapter;
    if (respawn === 'weather') {
      const weather = st.weather || this.region.weather || 'clear';
      const phase = st.time ? st.time.phase : 'dawn';
      const sameWeather = !rec.weather || rec.weather === weather;
      const samePhase = !rec.phase || rec.phase === phase;
      return !(rec.chapter === st.chapter && sameWeather && samePhase);
    }
    return false;
  },

  addGather(node) {
    if (!this.isGatherAvailable(node)) return;
    const px = node.x * TILE + TILE / 2;
    const py = (node.y + 1) * TILE - 3;
    const g = this.add.graphics().setDepth((node.y + 1) * TILE + 6);
    this.drawGatherArt(g, node.mat, px, py, hash01(node.x, node.y));
    g.setData('kind', 'gather');
    g.setData('ref', node);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: g, alpha: { from: 0.68, to: 1 }, yoyo: true, repeat: -1, duration: 1400 + hash01(node.x, node.y) * 800, ease: 'Linear' });
    }
    const hit = this.add.zone(px, py - 8, 32, 32).setOrigin(0.5, 1).setDepth(g.depth + 1);
    hit.setData('kind', 'gather');
    hit.setData('ref', node);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'gather', ref: node, x: node.x, y: node.y });
    });
    this.blockTile(node.x, node.y);
    this.entitySprites.push({ kind: 'gather', x: node.x, y: node.y, ref: node, node: g, hit: hit, extras: [] });
  },

  drawGatherArt(g, mat, px, py, h) {
    gRect(g, 0x0a0d14, px - 13, py - 1, 26, 3, 0.22);
    if (mat === 'lucao') {
      gRect(g, 0x3f7a4e, px - 9, py - 12, 3, 12);
      gRect(g, 0x5aa866, px - 4, py - 18, 3, 18);
      gRect(g, 0x7fc47a, px + 2, py - 14, 3, 14);
      gRect(g, 0xfff3c0, px - 5, py - 20, 3, 3);
      gRect(g, 0xfff3c0, px + 6, py - 16, 2, 2);
    } else if (mat === 'xingxie') {
      gRect(g, 0x6d7890, px - 10, py - 5, 20, 5);
      gRect(g, 0x9aa4c0, px - 7, py - 12, 4, 8);
      gRect(g, 0xc8d0e0, px - 7, py - 12, 2, 5);
      gRect(g, 0x9aa4c0, px + 2, py - 15, 4, 10);
      gRect(g, 0xe6f0ff, px + 2, py - 15, 2, 5);
      gRect(g, 0xb8c4da, px + 7, py - 8, 3, 5);
    } else if (mat === 'haiyan') {
      gRect(g, 0xe8e4d4, px - 10, py - 4, 8, 4);
      gRect(g, 0xe8e4d4, px - 7, py - 8, 7, 4);
      gRect(g, 0xe8e4d4, px - 4, py - 12, 6, 4);
      gRect(g, 0xf8f4e8, px - 4, py - 12, 3, 2);
      gRect(g, 0xb8c4c8, px + 2, py - 5, 8, 3);
      gRect(g, 0xb8c4c8, px + 5, py - 8, 6, 3);
    } else if (mat === 'tanzha') {
      gRect(g, 0x33211c, px - 10, py - 7, 8, 7);
      gRect(g, 0x4a2c24, px - 6, py - 11, 7, 6);
      gRect(g, 0x33211c, px + 3, py - 6, 9, 6);
      gRect(g, 0xc4622f, px - 4, py - 9, 2, 2);
      gRect(g, 0xff9c4a, px + 6, py - 4, 2, 2);
    } else if (mat === 'shensha') {
      gRect(g, 0x9a8aa0, px - 10, py - 5, 20, 5);
      gRect(g, 0xb4a4bc, px - 7, py - 9, 3, 4);
      gRect(g, 0xe0d6e8, px - 2, py - 12, 3, 4);
      gRect(g, 0xb4a4bc, px + 5, py - 8, 3, 3);
    } else if (mat === 'lingmu') {
      gRect(g, 0x8a5f38, px - 2, py - 18, 4, 18);
      gRect(g, 0x8a5f38, px + 2, py - 14, 7, 3);
      gRect(g, 0x5aa866, px + 6, py - 17, 5, 4);
      gRect(g, 0x8fdf8a, px + 7, py - 18, 2, 2);
    } else if (mat === 'xuantie') {
      gRect(g, 0x3d3f46, px - 11, py - 6, 22, 6);
      gRect(g, 0x4e515a, px - 8, py - 13, 15, 8);
      gRect(g, 0x6d707c, px - 6, py - 16, 9, 5);
      gRect(g, 0x9aa0ae, px - 5, py - 16, 4, 3);
      gRect(g, 0x2a2b30, px + 5, py - 4, 5, 2);
    } else {
      gRect(g, 0x5aa866, px - 8, py - 13, 4, 13);
      gRect(g, 0x3f7a4e, px - 1, py - 18, 4, 18);
      gRect(g, 0x7fc47a, px + 5, py - 11, 3, 11);
    }
  },

  addStele(stele, index) {
    const px = stele.x * TILE + TILE / 2;
    const py = (stele.y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 2);
    gRect(g, 0x0a0d14, px - 18, py - 2, 36, 4, 0.24);
    gRect(g, 0x6d6758, px - 14, py - 8, 28, 8);
    gRect(g, 0x7d7566, px - 11, py - 37, 22, 29);
    gRect(g, 0x9a9280, px - 9, py - 37, 16, 26);
    gRect(g, 0x5a5448, px - 13, py - 42, 26, 5);
    gRect(g, 0xb8b09a, px - 8, py - 42, 14, 2);

    const carve = this.add.graphics().setDepth(py + 3);
    const redraw = () => {
      const st = window.LB && LB.saveState ? LB.saveState() : null;
      const read = !!(st && st.steles && st.steles[stele.id]);
      carve.clear();
      const col = read ? 0xd06a4a : 0x5a5448;
      for (let k = 0; k < 4; k += 1) {
        const yy = py - 32 + k * 6;
        gRect(carve, col, px - 6, yy, 9 - (k % 2) * 3, 2, read ? 0.8 : 0.5);
      }
      if (read) gRect(carve, 0xff7a5c, px + 4, py - 21, 3, 3, 0.9);
    };
    redraw();

    const label = this.add.text(px, py - 48, stele.title, {
      fontFamily: PIXEL_FONT, fontSize: '11px', color: '#d9c69b',
    }).setOrigin(0.5, 1).setDepth(py + 4);
    label.setStroke('#0b1020', 4);

    const hit = this.add.zone(px, py - 20, 40, 50).setOrigin(0.5, 1).setDepth(py + 5);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'stele', ref: stele, x: stele.x, y: stele.y });
    });

    this.blockTile(stele.x, stele.y);
    this.entitySprites.push({
      kind: 'stele', x: stele.x, y: stele.y, ref: stele, node: g, hit: hit, extras: [label], redraw: redraw,
    });
  },

  addChest(chest) {
    if (LB.flag(chest.id) || (chest.flag && LB.flag(chest.flag))) return;
    const px = chest.x * TILE + TILE / 2, py = (chest.y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 6);
    gRect(g, 0x0a0d14, px - 16, py - 2, 32, 4, 0.24);
    gRect(g, 0x6b4a28, px - 14, py - 20, 28, 20);
    gRect(g, 0x8a6238, px - 12, py - 18, 24, 12);
    gRect(g, 0x4d3520, px - 14, py - 20, 28, 5);
    gRect(g, 0xd8b45a, px - 2, py - 13, 4, 7);
    gRect(g, 0xffe69a, px - 1, py - 12, 2, 3);
    gRect(g, 0xb8913f, px - 13, py - 8, 26, 2);
    const hit = this.add.zone(px, py - 12, 36, 32).setOrigin(0.5, 1).setDepth(py + 7);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'chest', ref: chest, x: chest.x, y: chest.y });
    });
    this.blockTile(chest.x, chest.y);
    this.entitySprites.push({ kind: 'chest', x: chest.x, y: chest.y, ref: chest, node: g, hit: hit, extras: [] });
  },

  addSecret(secret) {
    if (LB.flag('secret_' + secret.id)) return;
    const px = secret.x * TILE + TILE / 2;
    const py = (secret.y + 1) * TILE;
    const g = this.add.graphics().setDepth(py + 4);
    gRect(g, 0x0a0d14, px - 19, py - 2, 38, 4, 0.22);
    gRect(g, 0x6d6455, px - 13, py - 12, 26, 11);
    gRect(g, 0x857c6b, px - 10, py - 15, 18, 5);
    gRect(g, 0x4f4a40, px - 2, py - 12, 2, 6);
    gRect(g, 0x4f4a40, px + 4, py - 9, 4, 2);
    const glint = this.add.rectangle(px + 6, py - 11, 6, 6, 0xffe69a, 0.7).setDepth(py + 5);
    if (!this.reduceMotion) {
      this.tweens.add({ targets: glint, alpha: { from: 0.15, to: 0.8 }, yoyo: true, repeat: -1, duration: 1500, ease: 'Linear' });
    }
    const hit = this.add.zone(px, py - 10, 36, 30).setOrigin(0.5, 1).setDepth(py + 6);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'secret', ref: secret, x: secret.x, y: secret.y });
    });
    this.blockTile(secret.x, secret.y);
    this.entitySprites.push({ kind: 'secret', x: secret.x, y: secret.y, ref: secret, node: g, hit: hit, extras: [glint] });
  },

  buildBoss(boss) {
    const px = boss.x * TILE + TILE / 2;
    const py = (boss.y + 1) * TILE - 2;
    const sp = SPECIES[boss.sp];
    const elKey = boss.el || (sp ? sp.el : 'wood');
    const el = ELEMENTS[elKey] || ELEMENTS.wood;
    const elColor = worldHex(el.color);
    const container = this.add.container(px, py).setDepth(py + 3);

    const aura = this.add.graphics();
    gRect(aura, elColor, -64, -96, 128, 128, 0.08);
    aura.lineStyle(2, elColor, 0.4);
    aura.strokeRect(-56, -88, 112, 112);
    aura.lineStyle(1, elColor, 0.25);
    aura.strokeRect(-44, -76, 88, 88);
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      gRect(aura, elColor, Math.cos(a) * 56 - 2, -32 + Math.sin(a) * 56 - 2, 4, 4, 0.7);
    }
    container.add(aura);

    const g = this.add.graphics();
    this.drawBossArt(g, sp ? sp.art : 'fox', boss, elColor);
    container.add(g);

    const label = this.add.text(0, -104, boss.name, {
      fontFamily: PIXEL_FONT, fontSize: '15px', color: '#f6e9c9', fontStyle: 'bold',
    }).setOrigin(0.5, 1);
    label.setStroke('#0b1020', 5);
    container.add(label);
    const tag = this.add.text(0, -86, '不可结契 · Lv.' + boss.lv, {
      fontFamily: PIXEL_FONT, fontSize: '10px', color: '#f4c542',
    }).setOrigin(0.5, 1);
    tag.setStroke('#0b1020', 4);
    container.add(tag);

    const hit = this.add.zone(px, py - 20, 110, 120).setOrigin(0.5, 1).setDepth(py + 4);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (pointer) => {
      if (pointer && pointer.event && pointer.event.stopPropagation) pointer.event.stopPropagation();
      this.interactWith({ kind: 'boss', ref: boss, x: boss.x, y: boss.y });
    });

    this.bossNode = container;
    this.bossHit = hit;
    if (!this.reduceMotion) {
      this.tweens.add({ targets: container, y: py - 4, yoyo: true, repeat: -1, duration: 2200, ease: 'Linear' });
    }
  },

  drawBossArt(g, art, boss, elColor) {
    const ink = 0x151824;
    const belly = 0xd9e6e2;
    const eye = 0xffe69a;
    const base = 0x2a3040;
    if (art === 'deer') {
      gRect(g, ink, -26, -18, 52, 16);
      gRect(g, ink, -22, -6, 10, 10); gRect(g, ink, -6, -6, 10, 10); gRect(g, ink, 10, -6, 10, 10);
      gRect(g, base, -20, -54, 12, 38);
      gRect(g, base, 10, -48, 14, 32);
      gRect(g, ink, 8, -62, 20, 16);
      gRect(g, base, 10, -60, 16, 12);
      gRect(g, ink, 24, -72, 4, 12); gRect(g, ink, 19, -80, 3, 10); gRect(g, ink, 15, -84, 8, 3);
      gRect(g, ink, 14, -68, 4, 10); gRect(g, ink, 8, -76, 3, 10); gRect(g, ink, 4, -80, 8, 3);
      gRect(g, eye, 20, -58, 3, 3); gRect(g, 0x0b0d12, 21, -57, 1, 1);
      gRect(g, elColor, -8, -20, 6, 16, 0.75);
      gRect(g, elColor, 2, -22, 6, 14, 0.6);
    } else if (art === 'spirit') {
      gRect(g, ink, -30, -82, 60, 10);
      gRect(g, ink, -22, -72, 44, 40);
      gRect(g, ink, -14, -32, 28, 14);
      gRect(g, ink, -22, -18, 10, 8); gRect(g, ink, -4, -14, 8, 8); gRect(g, ink, 12, -18, 10, 8);
      gRect(g, base, -18, -72, 36, 34);
      gRect(g, base, -10, -38, 20, 10);
      gRect(g, belly, -10, -58, 20, 18);
      gRect(g, ink, -6, -56, 4, 5); gRect(g, ink, 3, -56, 4, 5);
      gRect(g, elColor, -6, -55, 2, 2); gRect(g, elColor, 4, -55, 2, 2);
      gRect(g, ink, -26, -92, 3, 12); gRect(g, ink, -30, -96, 8, 3);
      gRect(g, ink, 23, -92, 3, 12); gRect(g, ink, 23, -96, 8, 3);
      gRect(g, elColor, -18, -44, 3, 3); gRect(g, elColor, 15, -34, 3, 3);
    } else if (art === 'rhino') {
      gRect(g, ink, -40, -32, 68, 24);
      gRect(g, ink, -30, -10, 12, 12); gRect(g, ink, -8, -10, 12, 12); gRect(g, ink, 14, -10, 12, 12);
      gRect(g, ink, 18, -48, 32, 24);
      gRect(g, base, -36, -30, 60, 18);
      gRect(g, base, 22, -44, 24, 18);
      gRect(g, ink, 34, -58, 6, 18); gRect(g, ink, 38, -68, 4, 12); gRect(g, ink, 40, -76, 3, 10);
      gRect(g, eye, 40, -40, 3, 3);
      gRect(g, elColor, 32, -50, 4, 4, 0.9);
      gRect(g, elColor, -24, -22, 4, 4, 0.7);
      gRect(g, ink, -44, -26, 8, 4);
    } else if (art === 'mermaid') {
      gRect(g, ink, -12, -32, 24, 20);
      gRect(g, ink, -20, -12, 12, 8); gRect(g, ink, 8, -12, 12, 8);
      gRect(g, ink, -8, -8, 16, 8);
      gRect(g, base, -8, -30, 16, 18);
      gRect(g, belly, -10, -46, 20, 18);
      gRect(g, ink, -10, -60, 20, 16);
      gRect(g, base, -8, -58, 16, 12);
      gRect(g, 0x8a3b52, -14, -64, 5, 18); gRect(g, 0xc05668, -14, -64, 4, 5);
      gRect(g, 0x8a3b52, 9, -64, 5, 18); gRect(g, 0xc05668, 10, -64, 4, 5);
      gRect(g, eye, -6, -56, 3, 3); gRect(g, eye, 3, -56, 3, 3);
      gRect(g, elColor, 0, -22, 4, 10, 0.7);
    } else if (art === 'clam') {
      gRect(g, ink, -36, -32, 72, 28);
      gRect(g, ink, -30, -46, 60, 18);
      gRect(g, 0x7d6b93, -32, -30, 64, 22);
      gRect(g, 0x9c89b5, -28, -44, 56, 16);
      gRect(g, 0xb9a5c9, -24, -26, 48, 14);
      for (let i = 0; i < 4; i += 1) gRect(g, 0x6d5a83, -24 + i * 15, -42, 3, 18);
      gRect(g, 0x2a3040, -8, -22, 16, 8);
      gRect(g, elColor, -6, -20, 12, 6, 0.9);
      gRect(g, 0xfff6d6, -4, -19, 8, 4);
      gRect(g, eye, -10, -34, 4, 4); gRect(g, eye, 6, -34, 4, 4);
    } else if (art === 'bird') {
      gRect(g, ink, -16, -34, 32, 24);
      gRect(g, ink, 8, -58, 18, 18);
      gRect(g, base, -14, -32, 28, 20);
      gRect(g, base, 10, -56, 14, 16);
      gRect(g, ink, -34, -50, 18, 8); gRect(g, ink, -30, -42, 12, 5);
      gRect(g, ink, 12, -50, 18, 8); gRect(g, ink, 16, -42, 12, 5);
      gRect(g, elColor, -30, -48, 10, 4, 0.6); gRect(g, elColor, 18, -48, 10, 4, 0.6);
      gRect(g, 0xf4c542, 24, -52, 12, 4);
      gRect(g, eye, 18, -52, 3, 3);
      gRect(g, ink, -8, -10, 4, 10); gRect(g, ink, 4, -10, 4, 10);
      gRect(g, elColor, -2, -30, 4, 4, 0.9);
    } else if (art === 'croc') {
      gRect(g, ink, -44, -24, 76, 20);
      gRect(g, ink, 26, -28, 28, 16);
      gRect(g, base, -40, -22, 68, 16);
      gRect(g, base, 28, -26, 22, 12);
      gRect(g, ink, -20, -32, 8, 10); gRect(g, ink, -6, -34, 8, 12); gRect(g, ink, 8, -32, 8, 10);
      gRect(g, elColor, -18, -30, 4, 6, 0.75); gRect(g, elColor, -4, -32, 4, 8, 0.75); gRect(g, elColor, 10, -30, 4, 6, 0.75);
      gRect(g, 0xe6dfcd, 42, -24, 5, 5);
      gRect(g, eye, 34, -22, 3, 3);
      gRect(g, ink, -30, -8, 10, 8); gRect(g, ink, 4, -8, 10, 8);
      gRect(g, ink, -52, -18, 12, 8);
    } else if (art === 'dragon') {
      gRect(g, ink, -36, -28, 20, 16);
      gRect(g, ink, -24, -40, 20, 14);
      gRect(g, ink, -6, -48, 22, 14);
      gRect(g, ink, 10, -58, 18, 14);
      gRect(g, base, -32, -26, 16, 12);
      gRect(g, base, -20, -38, 16, 10);
      gRect(g, base, -2, -46, 18, 10);
      gRect(g, base, 12, -56, 14, 10);
      gRect(g, ink, 22, -70, 20, 18);
      gRect(g, base, 24, -68, 16, 14);
      gRect(g, ink, 24, -78, 3, 10); gRect(g, ink, 38, -78, 3, 10);
      gRect(g, ink, 16, -52, 10, 4); gRect(g, 0xd8f4f0, 20, -54, 10, 3, 0.8);
      gRect(g, eye, 34, -66, 4, 4);
      gRect(g, elColor, -14, -36, 3, 3); gRect(g, elColor, 4, -44, 3, 3);
      gRect(g, ink, -44, -20, 10, 4);
    } else {
      gRect(g, ink, -30, -24, 56, 20);
      gRect(g, ink, -22, -26, 12, 20); gRect(g, ink, 2, -26, 12, 20);
      gRect(g, ink, 18, -48, 20, 18);
      gRect(g, ink, 16, -58, 6, 12); gRect(g, ink, 34, -58, 6, 12);
      gRect(g, base, -26, -22, 48, 16);
      gRect(g, base, 20, -46, 16, 14);
      gRect(g, 0xc4622f, 23, -38, 12, 10, 0.9);
      gRect(g, 0xff9c4a, 34, -30, 14, 8, 0.8);
      gRect(g, eye, 26, -42, 3, 3); gRect(g, eye, 33, -42, 3, 3);
      gRect(g, elColor, -8, -18, 4, 4, 0.8);
      gRect(g, ink, -18, -6, 5, 8); gRect(g, ink, 12, -6, 5, 8);
    }
  },

  buildExitHints() {
    (this.region.exits || []).forEach((exit) => {
      const px = exit.x * TILE + TILE / 2;
      const py = (exit.y + 1) * TILE - 5;
      const g = this.add.graphics().setDepth((exit.y + 1) * TILE - 3);
      g.lineStyle(2, 0x62e0d8, 0.7);
      g.strokeRect(-14, -8, 28, 16);
      g.lineStyle(1, 0x62e0d8, 0.45);
      g.strokeRect(-8, -13, 16, 5);
      gRect(g, 0x62e0d8, -2, -20, 4, 8, 0.9);
      g.setPosition(px, py);
      if (!this.reduceMotion) {
        this.tweens.add({ targets: g, alpha: { from: 0.35, to: 0.9 }, yoyo: true, repeat: -1, duration: 1400, ease: 'Linear' });
      }
    });
  },

  addShadow(x, y, scale) {
    const g = this.add.graphics().setDepth((y + 1) * TILE);
    const s = scale || 1;
    gRect(g, 0x05070d, 0, 0, 34 * s, 5, 0.22);
    gRect(g, 0x05070d, -12 * s, -4, 24 * s, 4, 0.22);
    g.setPosition(x * TILE + TILE / 2, (y + 1) * TILE - 2);
    return g;
  },

  addNameTag(npc, sprite) {
    const label = this.add.text(sprite.x, sprite.y - sprite.displayHeight - 6, npc.name, {
      fontFamily: PIXEL_FONT, fontSize: '12px', color: '#f6e9c9',
    }).setOrigin(0.5, 1).setDepth(sprite.depth + 30);
    label.setStroke('#0b1020', 4);
    sprite.setData('label', label);
    return label;
  },

  buildPlayer() {
    const p = this.playerTile;
    this.player = this.add.sprite(p.x * TILE + TILE / 2, (p.y + 1) * TILE - 2, 'hero');
    this.player.setOrigin(0.5, 1).setScale(2.9).setDepth((p.y + 1) * TILE + 3);
    this.player.play('idle-down');
    this.playerShadow = this.add.graphics().setDepth((p.y + 1) * TILE + 2);
    gRect(this.playerShadow, 0x05070d, -17, -4, 34, 5, 0.24);
    gRect(this.playerShadow, 0x05070d, -12, -8, 24, 4, 0.24);
    this.playerShadow.setPosition(this.player.x, this.player.y - 2);
    this.player.setData('dir', 'down');
  },

  regionElement() {
    const r = this.region;
    let el = null;
    if (r.boss && BOSSES[r.boss]) {
      const b = BOSSES[r.boss];
      el = b.el || (SPECIES[b.sp] ? SPECIES[b.sp].el : null);
    }
    if (!el && r.pool && r.pool.length) {
      const first = SPECIES[r.pool[0].sp];
      if (first) el = first.el;
    }
    return el || 'wood';
  },

  buildAmbience() {
    const r = this.region;
    if (r.fog) {
      const fog = this.add.tileSprite(0, 0, this.worldW, this.worldH, 'fog').setOrigin(0, 0).setAlpha(0.26).setDepth(5000);
      fog.setTileScale(2.2, 2.2);
      this.fog = fog;
      const mist = this.add.rectangle(0, 0, this.worldW, this.worldH, 0xeee9dd, 0.08).setOrigin(0, 0).setDepth(5001);
      mist.setBlendMode(Phaser.BlendModes.SCREEN);
    }
    if (r.id === 'gutan') {
      this.add.rectangle(0, 0, this.worldW, this.worldH, 0x8a3f24, 0.05).setOrigin(0, 0).setDepth(4999);
    }

    this.buildCritters();

    const lava = r.id === 'gutan' || r.tiles.some((row) => row.indexOf('L') >= 0);
    const color = lava ? 0xff9c4a : worldHex((ELEMENTS[this.regionElement()] || ELEMENTS.wood).soft);
    const count = this.reduceMotion ? 8 : (r.fog ? 22 : 16);
    for (let i = 0; i < count; i += 1) {
      const fx = 40 + hash01(i, 7) * (this.worldW - 80);
      const fy = 60 + hash01(i, 11) * (this.worldH - 120);
      const size = 3 + Math.round(hash01(i, 3) * 3);
      const dot = this.add.rectangle(fx, fy, size, size, color, 0.75).setDepth(5100);
      if (!this.reduceMotion) {
        this.tweens.add({
          targets: dot,
          y: fy - 12 - hash01(i, 5) * 24,
          x: fx + (hash01(i, 9) - 0.5) * 30,
          alpha: { from: 0.2, to: 0.9 },
          yoyo: true, repeat: -1, duration: 2200 + hash01(i, 2) * 2600, ease: 'Linear',
        });
      }
    }
  },

  buildCritters() {
    if (this.reduceMotion) return;
    const r = this.region;
    const count = r.id === 'shenyuan' || r.id === 'gutan' ? 3 : 6;
    const colors = r.id === 'gutan' ? [0xff9c4a, 0xffcf6a] : [0xffe69a, 0x9fe4e0, 0xf0b8d8];
    for (let i = 0; i < count; i += 1) {
      const x = 80 + hash01(i, 21) * (this.worldW - 160);
      const y = 80 + hash01(i, 33) * (this.worldH - 160);
      const col = colors[i % colors.length];
      const c = this.add.container(x, y).setDepth(5200);
      const w1 = this.add.rectangle(-3, -2, 4, 4, col, 0.9);
      const w2 = this.add.rectangle(3, -2, 4, 4, col, 0.9);
      const body = this.add.rectangle(0, 0, 3, 5, 0x1a1520, 1);
      c.add([w1, w2, body]);
      this.tweens.add({
        targets: c,
        x: x + (hash01(i, 5) - 0.5) * 120,
        y: y + (hash01(i, 9) - 0.5) * 90,
        duration: 4200 + hash01(i, 11) * 3800,
        yoyo: true, repeat: -1, ease: 'Linear',
      });
      this.tweens.add({
        targets: [w1, w2],
        scaleX: { from: 1, to: 0.3 },
        duration: 260, yoyo: true, repeat: -1, ease: 'Linear',
      });
    }
  },
});
