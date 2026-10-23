// 灵兽录 · 探索层 · 核心场景与创建流程
// 灵兽录 · 探索层（Phaser 3）：八境区域、点击寻路、小地图、昼夜天气、采集与碑文、移动端摇杆

const WORLD_ASSETS = {
  hero: 'assets/ninja/samurai_blue.png',
  npc: 'assets/ninja/samurai_green.png',
  ninja: 'assets/ninja/ninja_blue.png',
  village: 'assets/ninja/tileset_village.png',
  fog: 'assets/ninja/fog.png',
};

const TEX_FOR_SPRITE = { samurai_blue: 'hero', samurai_green: 'npc', ninja_blue: 'ninja' };

const DIR = { down: 0, up: 1, left: 2, right: 3 };

function worldHex(hex) {
  return Phaser.Display.Color.HexStringToColor(hex || '#ece6d6').color;
}

function worldShade(hex, factor) {
  const c = Phaser.Display.Color.HexStringToColor(hex || '#ece6d6');
  const r = Math.max(0, Math.min(255, Math.round(c.red * factor)));
  const g = Math.max(0, Math.min(255, Math.round(c.green * factor)));
  const b = Math.max(0, Math.min(255, Math.round(c.blue * factor)));
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

class WorldScene extends Phaser.Scene {
  constructor() { super('world'); }
}

Object.assign(WorldScene.prototype, {
  init(data) {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    const fallback = (st && REGIONS[st.region]) ? st.region : 'shanmen';
    const id = data && data.region && REGIONS[data.region] ? data.region : fallback;
    this.regionId = id;
    this.region = REGIONS[id] || REGIONS.shanmen;
    this.regionId = this.region.id;
    this.spawnOverride = data && data.spawn ? data.spawn : null;

    this.worldW = this.region.w * TILE;
    this.worldH = this.region.h * TILE;
    const savedPos = st && st.pos && st.pos.x >= 0 && st.pos.y >= 0
      && st.pos.x < this.region.w && st.pos.y < this.region.h
      && WALKABLE[this.region.tiles[st.pos.y][st.pos.x]] ? st.pos : null;
    const fixedSpawn = this.spawnOverride && WALKABLE[this.region.tiles[this.spawnOverride.y] && this.region.tiles[this.spawnOverride.y][this.spawnOverride.x]]
      ? this.spawnOverride : null;
    this.playerTile = fixedSpawn || savedPos || this.region.spawn || { x: 2, y: 2 };

    this.walking = false;
    this.path = [];
    this.pathDone = null;
    this.moveTween = null;
    this.pendingTile = null;
    this.encounterSteps = 0;
    this.encounterThreshold = 7 + Math.floor(Math.random() * 6);
    this.blocked = {};
    this.entitySprites = [];
    this.explored = new Set();
    this.marker = null;
    this.bossNode = null;
    this.fog = null;
    this.weatherFog = null;
    this.weatherGfx = null;
    this.weatherParticles = [];
    this.weatherKind = null;
    this.dayNight = null;
    this.mapCanvas = null;
    this.mapCtx = null;
    this.joyDir = { x: 0, y: 0 };
    this.joyActive = false;
    this.joyPointer = null;
    this.joyCenter = { x: 0, y: 0 };
    this.lastJoyStep = 0;
    this.domCleanup = [];
    this.reduceMotion = !!(st && st.settings && st.settings.reduceMotion);
  },

  preload() {
    if (!this.textures.exists('hero')) {
      this.load.spritesheet('hero', WORLD_ASSETS.hero, { frameWidth: 16, frameHeight: 16 });
    }
    if (!this.textures.exists('npc')) {
      this.load.spritesheet('npc', WORLD_ASSETS.npc, { frameWidth: 16, frameHeight: 16 });
    }
    if (!this.textures.exists('ninja')) {
      this.load.spritesheet('ninja', WORLD_ASSETS.ninja, { frameWidth: 16, frameHeight: 16 });
    }
    if (!this.textures.exists('village')) this.load.image('village', WORLD_ASSETS.village);
    if (!this.textures.exists('fog')) this.load.image('fog', WORLD_ASSETS.fog);
  },

  create() {
    const r = this.region;

    this.makeAnims();
    this.registerFrames();
    this.buildGround();
    this.buildProps();
    this.buildEntities();
    this.buildPlayer();
    this.buildAmbience();
    this.buildWeather();
    this.buildDayNight();
    this.buildMinimap();
    this.bindInput();

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.worldW, this.worldH);
    cam.startFollow(this.player, true, 0.14, 0.14);
    // v2.1：PC 视野从 1.9 缩到约 0.95；同时保证小地图不被拉出黑边
    const vw = this.scale.width || window.innerWidth || 960;
    const vh = this.scale.height || window.innerHeight || 540;
    const fitZoom = Math.max(vw / this.worldW, vh / this.worldH);
    const baseZoom = vw < 720 ? 1.25 : 1.2;
    cam.setZoom(Math.max(baseZoom, fitZoom));
    this.layoutWeather();
    if (!this.reduceMotion) cam.fadeIn(420, 233, 223, 197);

    this.updateDepth();
    this.syncRegionWeather();
    this._pauseHandler = () => this.resetJoystick();
    this.events.on('pause', this._pauseHandler);
    this.events.once('shutdown', () => this.onShutdown());
    if (window.LB && LB.onWorldReady) LB.onWorldReady(r);
  },

  syncRegionWeather() {
    const st = window.LB && LB.saveState ? LB.saveState() : null;
    if (!st) return;
    if (st.weather !== this.region.weather) {
      st.weather = this.region.weather;
      if (LB.persist) LB.persist();
    }
  },

  onShutdown() {
    this.domCleanup.forEach((fn) => { try { fn(); } catch (e) { /* 忽略卸载异常 */ } });
    this.domCleanup = [];
    if (this._pauseHandler && this.events) this.events.off('pause', this._pauseHandler);
    if (this.input) {
      if (this.input.keyboard) {
        if (this._keyHandler) this.input.keyboard.off('keydown', this._keyHandler);
        if (this._talkHandler) {
          this.input.keyboard.off('keydown-SPACE', this._talkHandler);
          this.input.keyboard.off('keydown-E', this._talkHandler);
        }
      }
      if (this._pointerHandler) this.input.off('pointerdown', this._pointerHandler);
    }
    if (this.scale && this._resizeHandler) this.scale.off('resize', this._resizeHandler);
    this.resetJoystick();
    this._joyKnob = null;
  },

  registerFrames() {
    const tex = this.textures.get('village');
    if (!tex) return;
    if (!tex.has('tree-big')) {
      tex.add('tree-big', 0, 0, 96, 48, 80);
      tex.add('tree-small', 0, 48, 96, 32, 32);
      tex.add('house1', 0, 192, 96, 64, 64);
      tex.add('house2', 0, 256, 96, 64, 64);
      tex.add('ruin1', 0, 128, 0, 48, 32);
    }
  },

  makeAnims() {
    if (this.anims.exists('walk-down')) return;
    const mk = (key, start, end, rate) => {
      this.anims.create({
        key: key,
        frames: this.anims.generateFrameNumbers('hero', { start: start, end: end }),
        frameRate: rate || 8,
        repeat: -1,
      });
    };
    mk('walk-down', 0, 3);
    mk('walk-up', 4, 7);
    mk('walk-side', 8, 11);
    this.anims.create({ key: 'idle-down', frames: [{ key: 'hero', frame: 0 }], frameRate: 1 });
    this.anims.create({ key: 'idle-up', frames: [{ key: 'hero', frame: 4 }], frameRate: 1 });
    this.anims.create({ key: 'idle-side', frames: [{ key: 'hero', frame: 8 }], frameRate: 1 });
  },

  tileAt(x, y) {
    const r = this.region;
    if (x < 0 || y < 0 || x >= r.w || y >= r.h) return 'T';
    return r.tiles[y][x];
  },
});
