// 灵兽录 · 探索层 · Phaser 启动与场景门面

window.World = {
  game: null,
  boot() {
    if (this.game) return;
    this.game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: 'game-canvas',
      backgroundColor: '#efe5cb',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.NO_CENTER, width: '100%', height: '100%' },
      scene: [WorldScene],
      render: { antialias: false, powerPreference: 'high-performance' },
    });
  },
  load(regionId, spawn) {
    if (!this.game) this.boot();
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    let id = regionId && REGIONS[regionId] ? regionId : null;
    if (!id) id = st && REGIONS[st.region] ? st.region : 'shanmen';
    const data = { region: id, spawn: spawn || null };
    if (!this.game.isBooted) {
      this._pendingLoad = data;
      if (!this._readyBound) {
        this._readyBound = true;
        this.game.events.once('ready', () => {
          const pending = this._pendingLoad;
          this._pendingLoad = null;
          if (pending) this.load(pending.region, pending.spawn);
        });
      }
      return;
    }
    const scene = this.game.scene.getScene('world');
    if (!scene) { this.game.scene.start('world', data); return; }
    const plugin = scene.scene;
    if (plugin && (plugin.isActive() || plugin.isPaused())) {
      if (plugin.isPaused()) plugin.resume();
      plugin.restart(data);
    } else {
      this.game.scene.start('world', data);
    }
  },
  pause() { if (this.game) this.game.scene.pause('world'); },
  resume() { if (this.game) this.game.scene.resume('world'); },
  refresh() {
    if (!this.game) return;
    const scene = this.scene();
    if (!scene) return;
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    const region = scene.regionId || (st && st.region) || 'shanmen';
    const spawn = (st && st.pos) || scene.playerTile || null;
    if (scene.scene && (scene.scene.isActive() || scene.scene.isPaused())) {
      if (scene.scene.isPaused()) scene.scene.resume();
      scene.scene.restart({ region: region, spawn: spawn });
    } else {
      this.load(region, spawn);
    }
  },
  scene() {
    if (!this.game) return null;
    return this.game.scene.getScene('world');
  },
};
