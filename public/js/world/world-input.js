// 灵兽录 · 探索层 · 输入、交互与寻路
Object.assign(WorldScene.prototype, {
  bindInput() {
    this.input.on('pointerdown', this._pointerHandler = (pointer, over) => {
      if (over && over.length) return;
      // 仅接受画布本身的指针；对话框、模态框等 HTML 覆盖层上的点击不得触发寻路
      const domTarget = pointer && pointer.event ? pointer.event.target : null;
      if (domTarget && domTarget !== this.game.canvas) return;
      // UI 关闭后的同一手势可能继续冒泡到画布，短暂屏蔽避免角色被带走
      if (window.__uiTapGuardUntil && Date.now() < window.__uiTapGuardUntil) return;
      // 实体点击与场景点击可能在同一帧先后触发，避免重复动作
      if (this._lastInteractAt && this.time.now - this._lastInteractAt < 160) return;
      if (window.LB && LB.isBlocked && LB.isBlocked()) return;
      const wx = pointer.worldX, wy = pointer.worldY;
      const tx = Math.floor(wx / TILE), ty = Math.floor(wy / TILE);
      const ent = this.entityAt(tx, ty);
      if (ent) { this.interactWith(ent); return; }
      this.clickMarker(wx, wy);
      const target = this.nearestWalkable(tx, ty);
      if (!target) { if (LB.toast) LB.toast('此处无路可行'); return; }
      this.pathTo(target.x, target.y, null);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this._talkHandler = () => {
      if (window.LB && LB.isBlocked && LB.isBlocked()) return;
      this.interactNearby();
    };
    this.input.keyboard.on('keydown-SPACE', this._talkHandler);
    this.input.keyboard.on('keydown-E', this._talkHandler);

    this._keyHandler = (e) => {
      if (window.LB && LB.isBlocked && LB.isBlocked()) return;
      const map = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
        W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0],
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      if (this.walking) return;
      this.tryStep(dir[0], dir[1]);
    };
    this.input.keyboard.on('keydown', this._keyHandler);

    this.bindJoystick();
  },

  bindJoystick() {
    const joy = document.getElementById('joystick');
    const knob = document.getElementById('joystick-knob');
    if (!joy) return;
    const max = 34;

    const setKnob = (x, y) => { if (knob) knob.style.transform = 'translate(' + x + 'px,' + y + 'px)'; };

    const onDown = (e) => {
      if (window.LB && LB.isBlocked && LB.isBlocked()) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = joy.getBoundingClientRect();
      this.joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this.joyPointer = e.pointerId;
      this.joyActive = true;
      if (joy.setPointerCapture) {
        try { joy.setPointerCapture(e.pointerId); } catch (err) { /* 部分浏览器不支持捕获 */ }
      }
      onMove(e);
    };

    const onMove = (e) => {
      if (!this.joyActive || e.pointerId !== this.joyPointer) return;
      e.preventDefault();
      e.stopPropagation();
      let dx = e.clientX - this.joyCenter.x;
      let dy = e.clientY - this.joyCenter.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > max) { dx = dx / len * max; dy = dy / len * max; }
      setKnob(dx, dy);
      this.joyDir = { x: dx / max, y: dy / max };
    };

    const onUp = (e) => {
      if (e.pointerId !== this.joyPointer) return;
      this.resetJoystick();
    };
    const onWindowUp = (e) => {
      if (e.pointerId === this.joyPointer) this.resetJoystick();
    };

    joy.addEventListener('pointerdown', onDown, { passive: false });
    joy.addEventListener('pointermove', onMove, { passive: false });
    joy.addEventListener('pointerup', onUp);
    joy.addEventListener('pointercancel', onUp);
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);
    this.domCleanup.push(() => {
      joy.removeEventListener('pointerdown', onDown);
      joy.removeEventListener('pointermove', onMove);
      joy.removeEventListener('pointerup', onUp);
      joy.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
    });
    this._joyKnob = knob;
  },

  resetJoystick() {
    this.joyActive = false;
    this.joyPointer = null;
    this.joyDir = { x: 0, y: 0 };
    if (this._joyKnob) this._joyKnob.style.transform = 'translate(0px,0px)';
  },

  entityAt(tx, ty) {
    for (let i = 0; i < this.entitySprites.length; i += 1) {
      const e = this.entitySprites[i];
      if (e.x === tx && e.y === ty) return e;
    }
    return null;
  },

  interactNearby() {
    if (!this.player) return;
    const p = this.playerTile;
    const near = this.entitySprites.find((e) => {
      if (['npc', 'boss', 'gather', 'chest', 'stele', 'herb', 'secret'].indexOf(e.kind) < 0) return false;
      return Math.max(Math.abs(e.x - p.x), Math.abs(e.y - p.y)) <= 1;
    });
    if (near) this.interactWith(near);
  },

  talkNearby() {
    this.interactNearby();
  },

  interactWith(ent) {
    if (!ent) return;
    this._lastInteractAt = this.time.now;
    if (this.walking) this.stopWalking();
    const run = (fn) => {
      if (typeof fn !== 'function') return;
      try { fn(); } catch (e) { console.error('[灵兽录] 交互失败', e); }
      this.drawMinimap();
    };
    if (ent.kind === 'npc') {
      this.approach(ent, () => run(() => LB.talkTo(ent.ref.id)));
    } else if (ent.kind === 'boss') {
      this.approach(ent, () => run(() => LB.bossTalk(ent.ref.id)));
    } else if (ent.kind === 'gather') {
      this.approach(ent, () => run(() => LB.gatherNode(ent.ref)));
    } else if (ent.kind === 'herb') {
      this.approach(ent, () => run(() => LB.collectHerb(ent.ref)));
    } else if (ent.kind === 'chest') {
      this.approach(ent, () => run(() => LB.openChest(ent.ref)));
    } else if (ent.kind === 'secret') {
      this.approach(ent, () => run(() => LB.openSecret(ent.ref)));
    } else if (ent.kind === 'stele') {
      this.approach(ent, () => {
        run(() => LB.readStele(ent.ref));
        if (typeof ent.redraw === 'function') ent.redraw();
      });
    }
  },

  approach(ent, done) {
    const p = this.playerTile;
    if (Math.max(Math.abs(ent.x - p.x), Math.abs(ent.y - p.y)) <= 1) { done(); return; }
    let best = null, bestLen = Infinity;
    const around = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    around.forEach((d) => {
      const nx = ent.x + d[0], ny = ent.y + d[1];
      if (!this.isWalkable(nx, ny)) return;
      const path = this.findPath(p.x, p.y, nx, ny);
      if (path && path.length < bestLen) { bestLen = path.length; best = path; }
    });
    if (!best) { if (LB.toast) LB.toast('靠近些再试'); return; }
    this.walkPath(best, done);
  },

  tryStep(dx, dy) {
    if (!dx && !dy) return false;
    const nx = this.playerTile.x + dx, ny = this.playerTile.y + dy;
    if (!this.isWalkable(nx, ny)) return false;
    this.walkPath([{ x: nx, y: ny }], null);
    return true;
  },

  blockTile(x, y) { this.blocked[x + ',' + y] = 1; },

  unblockTile(x, y) { delete this.blocked[x + ',' + y]; },

  isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= this.region.w || y >= this.region.h) return false;
    if (!WALKABLE[this.region.tiles[y][x]]) return false;
    return !this.blocked[x + ',' + y];
  },

  nearestWalkable(tx, ty) {
    if (this.isWalkable(tx, ty)) return { x: tx, y: ty };
    for (let r = 1; r <= 3; r += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dx = -r; dx <= r; dx += 1) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          if (this.isWalkable(tx + dx, ty + dy)) return { x: tx + dx, y: ty + dy };
        }
      }
    }
    return null;
  },

  findPath(sx, sy, tx, ty) {
    if (!this.isWalkable(tx, ty)) return null;
    if (sx === tx && sy === ty) return [];
    const key = (x, y) => x + ',' + y;
    const open = [{ x: sx, y: sy, g: 0, f: 0, p: null }];
    const seen = new Map();
    seen.set(key(sx, sy), 0);
    const dirs = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4], [1, -1, 1.4], [-1, 1, 1.4], [-1, -1, 1.4]];
    let guard = 0;
    while (open.length && guard < 4000) {
      guard += 1;
      open.sort((a, b) => a.f - b.f);
      const cur = open.shift();
      if (cur.x === tx && cur.y === ty) {
        const out = [];
        let n = cur;
        while (n.p) { out.unshift({ x: n.x, y: n.y }); n = n.p; }
        return out;
      }
      for (let i = 0; i < dirs.length; i += 1) {
        const nx = cur.x + dirs[i][0], ny = cur.y + dirs[i][1];
        if (!this.isWalkable(nx, ny)) continue;
        if (dirs[i][0] && dirs[i][1]) {
          if (!this.isWalkable(cur.x + dirs[i][0], cur.y) || !this.isWalkable(cur.x, cur.y + dirs[i][1])) continue;
        }
        const g = cur.g + dirs[i][2];
        const k = key(nx, ny);
        if (seen.has(k) && seen.get(k) <= g) continue;
        seen.set(k, g);
        const h = Math.abs(tx - nx) + Math.abs(ty - ny);
        open.push({ x: nx, y: ny, g: g, f: g + h, p: cur });
      }
    }
    return null;
  },

  pathTo(tx, ty, done) {
    // 行走中改道：以正在前往的格为起点续算，避免双补间冲突
    const from = this.walking && this.pendingTile ? this.pendingTile : this.playerTile;
    const path = this.findPath(from.x, from.y, tx, ty);
    if (!path) { if (LB.toast) LB.toast('走不过去'); return; }
    if (this.walking && this.moveTween) {
      this.path = path.slice();
      this.pathDone = done || null;
      return;
    }
    if (!path.length) { if (done) done(); return; }
    this.walkPath(path, done);
  },

  walkPath(path, done) {
    if (!path || !path.length) { if (done) done(); return; }
    this.path = path.slice();
    this.pathDone = done || null;
    this.walking = true;
    this.stepAlong();
  },

  stopWalking() {
    this.walking = false;
    this.path = [];
    this.pathDone = null;
    this.pendingTile = null;
    if (this.moveTween) { this.moveTween.stop(); this.moveTween = null; }
    if (this.player) {
      this.player.stop();
      this.playIdle();
    }
  },

  stepAlong() {
    if (!this.walking) return;
    if (!this.path.length) {
      const cb = this.pathDone;
      this.walking = false;
      this.pathDone = null;
      this.pendingTile = null;
      this.player.stop();
      this.playIdle();
      if (cb) cb();
      return;
    }
    const next = this.path.shift();
    this.pendingTile = next;
    const from = this.playerTile;
    const dx = next.x - from.x, dy = next.y - from.y;
    let dir = 'down';
    if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? 'right' : 'left';
    else if (dy !== 0) dir = dy > 0 ? 'down' : 'up';
    this.player.setData('dir', dir);
    this.animateWalk(dir);
    const tx = next.x * TILE + TILE / 2;
    const ty = (next.y + 1) * TILE - 2;
    this.moveTween = this.tweens.add({
      targets: this.player,
      x: tx,
      y: ty,
      duration: 150,
      ease: 'Linear',
      onUpdate: () => {
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = this.player.y - 2;
        this.updateDepth();
      },
      onComplete: () => {
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = this.player.y - 2;
        this.playerTile = { x: next.x, y: next.y };
        this.updateDepth();
        if (window.LB && LB.setPosition) LB.setPosition(next.x, next.y);
        this.onStep(next);
        this.stepAlong();
      },
    });
  },

  animateWalk(dir) {
    if (dir === 'left' || dir === 'right') {
      this.player.play('walk-side', true);
      this.player.setFlipX(dir === 'left');
    } else {
      this.player.play('walk-' + dir, true);
      this.player.setFlipX(false);
    }
  },

  playIdle() {
    const dir = this.player.getData('dir') || 'down';
    if (dir === 'left' || dir === 'right') {
      this.player.play('idle-side', true);
      this.player.setFlipX(dir === 'left');
    } else {
      this.player.play('idle-' + dir, true);
    }
  },

  onStep(tile) {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    if (st && st.time) {
      st.time.steps = (st.time.steps || 0) + 1;
      if (st.time.steps >= 120) this.advanceTimePhase();
    }

    this.revealAround(tile.x, tile.y, 5);
    this.drawMinimap();

    const exit = (this.region.exits || []).find((e) => e.x === tile.x && e.y === tile.y);
    if (exit) {
      this.stopWalking();
      if (LB.tryExit) LB.tryExit(exit);
      return;
    }

    const t = this.tileAt(tile.x, tile.y);
    if ((this.region.encounterTiles || ['g']).indexOf(t) >= 0) {
      this.encounterSteps += 1;
      if (this.encounterSteps >= this.encounterThreshold) {
        this.encounterSteps = 0;
        this.encounterThreshold = 7 + Math.floor(Math.random() * 6);
        this.stopWalking();
        this.playEncounterCue(function () {
          if (LB.startWildBattle) LB.startWildBattle();
        });
      }
    }
  },

  playEncounterCue(done) {
    if (this.encounterCueActive) { done(); return; }
    this.encounterCueActive = true;
    if (window.LB && LB.audio) LB.audio.sfx('encounter');
    const px = this.player.x;
    const py = this.player.y;
    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      this.encounterCueActive = false;
      done();
    };
    if (this.reduceMotion) {
      this.time.delayedCall(80, finish);
      return;
    }

    const colors = [0x4c8a58, 0x6fae6a, 0x9ad08a];
    for (let i = 0; i < 6; i += 1) {
      const rx = px + (hash01(i, 1) - 0.5) * 30;
      const ry = py - 2;
      const dot = this.add.rectangle(rx, ry, 3, 3, colors[i % colors.length], 0.9)
        .setDepth(py + 40);
      this.tweens.add({
        targets: dot,
        x: px + (hash01(i, 5) - 0.5) * 64,
        y: py - 8 - hash01(i, 9) * 18,
        alpha: 0,
        duration: 320,
        ease: 'Quad.easeOut',
        onComplete: () => dot.destroy(),
      });
    }

    const mark = this.add.text(px, py - this.player.displayHeight - 10, '!', {
      fontFamily: PIXEL_FONT, fontSize: '22px', color: '#ffe08a', fontStyle: 'bold',
    }).setOrigin(0.5, 1).setDepth(py + 80);
    mark.setStroke('#0b1020', 5);
    this.tweens.add({
      targets: mark,
      scale: { from: 0.4, to: 1.1 },
      y: mark.y - 6,
      duration: 180,
      yoyo: true,
      hold: 80,
      onComplete: () => mark.destroy(),
    });
    this.cameras.main.shake(90, 0.0015);
    this.time.delayedCall(420, finish);
  },

  updateDepth() {
    if (this.player) this.player.setDepth(this.player.y + 1);
    if (this.playerShadow) this.playerShadow.setDepth(this.player.y - 2);
  },

  update(time, delta) {
    if (this.fog) this.fog.tilePositionX += delta * 0.006;
    if (this.weatherFog) this.weatherFog.tilePositionX += delta * 0.004;
    if (!this.player) return;
    this.playerShadow.x = this.player.x;
    this.playerShadow.y = this.player.y - 2;

    this.updateWeather(delta);

    const jx = this.joyDir.x, jy = this.joyDir.y;
    if (!this.walking && (Math.abs(jx) > 0.3 || Math.abs(jy) > 0.3)) {
      if (time - this.lastJoyStep >= 120) {
        if (!(window.LB && LB.isBlocked && LB.isBlocked())) {
          const ax = Math.abs(jx), ay = Math.abs(jy);
          const dx = ax >= ay ? (jx > 0 ? 1 : -1) : 0;
          const dy = ax >= ay ? 0 : (jy > 0 ? 1 : -1);
          this.lastJoyStep = time;
          this.tryStep(dx, dy);
        }
      }
    }
  },

  clickMarker(wx, wy) {
    if (this.marker) this.marker.destroy();
    const ring = this.add.graphics().setDepth(860);
    ring.fillStyle(0x4fd68c, 0.85);
    ring.fillRect(-2, -10, 4, 4);
    ring.fillRect(-2, 6, 4, 4);
    ring.fillRect(-10, -2, 4, 4);
    ring.fillRect(6, -2, 4, 4);
    ring.lineStyle(2, 0x4fd68c, 0.55);
    ring.strokeRect(-7, -7, 14, 14);
    ring.setPosition(wx, wy);
    this.marker = ring;
    this.tweens.add({
      targets: ring, scale: { from: 1.4, to: 0.7 }, alpha: { from: 0.9, to: 0 },
      duration: 560, ease: 'Linear', onComplete: () => ring.destroy(),
    });
  },

  removeEntity(kind, id) {
    const idx = this.entitySprites.findIndex((e) => e.kind === kind && ((e.ref && e.ref.id === id) || !id));
    if (idx < 0) return;
    const e = this.entitySprites[idx];
    if (e.node) e.node.destroy();
    if (e.hit) e.hit.destroy();
    (e.extras || []).forEach((extra) => { if (extra) extra.destroy(); });
    this.unblockTile(e.x, e.y);
    this.entitySprites.splice(idx, 1);
    if (kind === 'boss') { this.bossNode = null; this.bossHit = null; }
    this.drawMinimap();
  },

  highlightEntity() {},
});
