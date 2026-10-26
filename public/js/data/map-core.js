// 灵兽录 · 数据层 · 地图画笔与区域注册表
// ---------- 地图画笔 ----------
// . 空地  , 土路  g 草地(遇敌)  b 木桥  S 出生点  E 出口
// T 树  R 岩石  H 屋  W 水  C 断崖  A 祭坛  L 熔岩
// 新增：D 沙地/星原  M 海市木板  Z 泽地/浅水
const WALKABLE = { '.': 1, ',': 1, g: 1, b: 1, S: 1, E: 1, D: 1, M: 1, Z: 1 };

function hash2(x, y) {
  var h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function makeRegion(cfg) {
  var w = cfg.w, h = cfg.h;
  var tiles = [];
  for (var y = 0; y < h; y += 1) tiles.push(new Array(w).fill(cfg.base || '.'));
  var api = {
    w: w, h: h,
    put: function (x, y2, c) { if (x >= 0 && x < w && y2 >= 0 && y2 < h) tiles[y2][x] = c; },
    rect: function (x, y2, rw, rh, c) {
      for (var j = 0; j < rh; j += 1) for (var i = 0; i < rw; i += 1) api.put(x + i, y2 + j, c);
    },
    line: function (x, y2, x2, y3, c) {
      var dx = Math.abs(x2 - x), dy = Math.abs(y3 - y2);
      var sx = x < x2 ? 1 : -1, sy = y2 < y3 ? 1 : -1;
      var err = dx - dy;
      for (;;) {
        api.put(x, y2, c);
        if (x === x2 && y2 === y3) break;
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x += sx; }
        if (e2 < dx) { err += dx; y2 += sy; }
      }
    },
    blob: function (cx, cy, r, c) {
      for (var j = -r; j <= r; j += 1) for (var i = -r; i <= r; i += 1) {
        if (i * i + j * j <= r * r + hash2(cx + i, cy + j)) api.put(cx + i, cy + j, c);
      }
    },
    border: function (c, t) {
      t = t || 1;
      var j;
      for (j = 0; j < w; j += 1) for (var k = 0; k < t; k += 1) { api.put(j, k, c); api.put(j, h - 1 - k, c); }
      for (j = 0; j < h; j += 1) for (var k2 = 0; k2 < t; k2 += 1) { api.put(k2, j, c); api.put(w - 1 - k2, j, c); }
    },
  };
  cfg.paint(api);
  if (cfg.spawn) api.put(cfg.spawn.x, cfg.spawn.y, 'S');
  return {
    id: cfg.id, name: cfg.name, chapter: cfg.chapter, subtitle: cfg.subtitle,
    kind: cfg.kind || 'main', unlock: cfg.unlock || null, travelHub: !!cfg.travelHub,
    w: w, h: h, tiles: tiles, spawn: cfg.spawn, base: cfg.base || '.',
    exits: cfg.exits || [], pool: cfg.pool || [], boss: cfg.boss || null,
    npcs: cfg.npcs || [], herbs: cfg.herbs || [], chests: cfg.chests || [],
    gathers: cfg.gathers || [], props: cfg.props || [], steles: cfg.steles || [],
    encounterTiles: cfg.encounterTiles || ['g'],
    fog: !!cfg.fog, tint: cfg.tint || '#f2ede2', weather: cfg.weather || 'clear',
    timeTint: cfg.timeTint || cfg.tint || '#f2ede2', trial: !!cfg.trial,
  };
}

// ---------- 八境 ----------
const REGIONS = {};
