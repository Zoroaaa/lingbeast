// 灵兽录 · 探索层 · 像素地面与场景物件

// 全范围 0..1 哈希（data.js 的 hash2 只到 0.5，仅用于地图生成；视觉细节改用本函数）
function hash01(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

// 每境一套 16-bit 地表色板
const REGION_PAL = {
  // 八境各有一套明确色相：石庭、春溪、雾林、金原、盐海、翠泽、赤坛、寒墟
  shanmen: { base: '#c9b892', base2: '#bfae87', path: '#e0cfa4', path2: '#d2be92', grass: '#93ad72', grass2: '#84a065', tree: '#557a56', water: '#5aa8b4', water2: '#438f9c', wood: '#a87b4e', stone: '#b7ad97', sand: '#e4d3ab', cliff: '#a0947c', lava: '#d97a44', plank: '#b98c5c', marsh: '#8fae7e', flower: '#f6dd8c' },
  qingxi: { base: '#84ab60', base2: '#769c55', path: '#cfb183', path2: '#bfa074', grass: '#6b9450', grass2: '#5d8546', tree: '#3d6b45', water: '#4fb2bd', water2: '#3a96a4', wood: '#9c7145', stone: '#9a967e', sand: '#dcc59a', cliff: '#8b8670', lava: '#cc6b36', plank: '#ae8050', marsh: '#74a37d', flower: '#f7e69a' },
  wuyin: { base: '#6f8f78', base2: '#647f6b', path: '#a89a7a', path2: '#97896c', grass: '#587a5e', grass2: '#4d6c53', tree: '#3a5c46', water: '#4a8894', water2: '#3a707c', wood: '#836240', stone: '#7d8478', sand: '#bcb294', cliff: '#6e776c', lava: '#b86a3d', plank: '#947047', marsh: '#6b9180', flower: '#c9eccf' },
  luoxing: { base: '#c4a45f', base2: '#b69754', path: '#ddbe7d', path2: '#cbaa6a', grass: '#a89252', grass2: '#988247', tree: '#6b6740', water: '#4f9aa8', water2: '#3c8292', wood: '#9f7445', stone: '#9b8d7a', sand: '#e6cf95', cliff: '#8f7b63', lava: '#d9803f', plank: '#b3844f', marsh: '#9a9a62', flower: '#ffd375' },
  guixu: { base: '#d6c49a', base2: '#cab88d', path: '#e8d6ab', path2: '#d8c497', grass: '#a5b47c', grass2: '#95a46c', tree: '#4f7054', water: '#3fa3b8', water2: '#2d879c', wood: '#a57a4a', stone: '#b3ac96', sand: '#f2e3bd', cliff: '#998d76', lava: '#d97a44', plank: '#b08555', marsh: '#8fb29a', flower: '#f6e3b0' },
  yunmeng: { base: '#8bb474', base2: '#7ea468', path: '#bfa980', path2: '#ad9570', grass: '#74a05c', grass2: '#669150', tree: '#436b4c', water: '#5aa8b0', water2: '#468f96', wood: '#8f6c44', stone: '#929a86', sand: '#d8c79c', cliff: '#7d8870', lava: '#c96a3a', plank: '#a67d47', marsh: '#6fa387', flower: '#f5b0d2' },
  gutan: { base: '#b3856a', base2: '#a6785e', path: '#c9a07f', path2: '#b78e6f', grass: '#a3815f', grass2: '#927150', tree: '#6d5140', water: '#b85a3c', water2: '#9c4830', wood: '#8a6244', stone: '#9c8b79', sand: '#d3b58f', cliff: '#8e6f5c', lava: '#f2903f', plank: '#997550', marsh: '#9c9070', flower: '#ffab55' },
  shenyuan: { base: '#96a3b8', base2: '#8b98ad', path: '#bcc5d2', path2: '#adb7c5', grass: '#8c9bad', grass2: '#7f8ea0', tree: '#73839a', water: '#6c9eb5', water2: '#57879e', wood: '#a196a8', stone: '#b0b8c2', sand: '#ccd0d6', cliff: '#8592a4', lava: '#bb7a95', plank: '#a294a8', marsh: '#86a8b0', flower: '#e4f4ff' },
};

function palOf(region) { return REGION_PAL[region.id] || REGION_PAL.qingxi; }

function groundColor(t, h, pal) {
  if (t === ',') return h > 0.5 ? pal.path : pal.path2;
  if (t === 'g') return h > 0.5 ? pal.grass : pal.grass2;
  if (t === 'W') return h > 0.5 ? pal.water : pal.water2;
  if (t === 'Z') return h > 0.5 ? pal.marsh : pal.water2;
  if (t === 'T') return pal.tree;
  if (t === 'R') return pal.base2;
  if (t === 'H') return pal.wood;
  if (t === 'C') return pal.cliff;
  if (t === 'A') return pal.stone;
  if (t === 'L') return pal.lava;
  if (t === 'D') return pal.sand;
  if (t === 'M') return pal.plank;
  if (t === 'S' || t === 'E') return pal.path;
  return pal.base;
}

// 2px 网格铺设：让所有地面细节保持像素颗粒
function pxRect(c, x, y, w, h, color, alpha) {
  if (w <= 0 || h <= 0) return;
  c.globalAlpha = alpha == null ? 1 : alpha;
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  c.globalAlpha = 1;
}

Object.assign(WorldScene.prototype, {
  buildGround() {
    const r = this.region, W = this.worldW, H = this.worldH;
    const key = 'ground-' + r.id;
    Object.keys(this.textures.list).forEach((k) => {
      if (k.indexOf('ground-') === 0 && k !== key) this.textures.remove(k);
    });
    if (this.textures.exists(key)) this.textures.remove(key);
    const canvas = this.textures.createCanvas(key, W, H);
    if (!canvas) return;
    const c = canvas.getContext();
    const pal = palOf(r);
    const tileAt = (x, y) => this.tileAt(x, y);

    for (let y = 0; y < r.h; y += 1) {
      for (let x = 0; x < r.w; x += 1) {
        const t = tileAt(x, y);
        const px = x * TILE, py = y * TILE;
        const h = hash01(x, y);
        this.drawGroundTile(c, px, py, t, x, y, pal, h);
        this.decorateTile(c, px, py, t, x, y, pal, h);
      }
    }

    // 水岸与路缘：2px 硬边，替代旧水墨晕染
    for (let y = 0; y < r.h; y += 1) {
      for (let x = 0; x < r.w; x += 1) {
        const t = tileAt(x, y);
        const px = x * TILE, py = y * TILE;
        if (t === ',') {
          if (tileAt(x, y - 1) !== ',') pxRect(c, px, py, TILE, 2, pal.path2);
          if (tileAt(x, y + 1) !== ',') pxRect(c, px, py + TILE - 2, TILE, 2, pal.path2);
          if (tileAt(x - 1, y) !== ',') pxRect(c, px, py, 2, TILE, pal.path2);
          if (tileAt(x + 1, y) !== ',') pxRect(c, px + TILE - 2, py, 2, TILE, pal.path2);
        }
        if (t === 'W' || t === 'Z') {
          if (tileAt(x, y - 1) !== 'W' && tileAt(x, y - 1) !== 'Z') pxRect(c, px, py, TILE, 2, '#d8f4f0', 0.75);
          if (tileAt(x, y + 1) !== 'W' && tileAt(x, y + 1) !== 'Z') pxRect(c, px, py + TILE - 2, TILE, 2, pal.water2);
          if (tileAt(x - 1, y) !== 'W' && tileAt(x - 1, y) !== 'Z') pxRect(c, px, py, 2, TILE, '#d8f4f0', 0.5);
          if (tileAt(x + 1, y) !== 'W' && tileAt(x + 1, y) !== 'Z') pxRect(c, px + TILE - 2, py, 2, TILE, pal.water2);
        }
      }
    }

    this.ditherEdges(c);
    canvas.refresh();
    this.add.image(0, 0, key).setOrigin(0, 0).setDepth(-20);
    this.add.rectangle(0, 0, W, H, worldHex(r.tint || '#f2ede2'), 0.03).setOrigin(0, 0).setDepth(-19);
  },

  // 材质交界锯齿化：把相邻地表色咬进边角，消除横平竖直的格子感
  ditherEdges(c) {
    const r = this.region;
    const pal = palOf(r);
    const soft = { '.': 1, g: 1, ',': 1, D: 1, Z: 1 };
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let y = 1; y < r.h - 1; y += 1) {
      for (let x = 1; x < r.w - 1; x += 1) {
        const t = r.tiles[y][x];
        if (!soft[t]) continue;
        for (let d = 0; d < 4; d += 1) {
          const nt = this.tileAt(x + dirs[d][0], y + dirs[d][1]);
          if (nt === t || !soft[nt]) continue;
          const seed = hash01(x * 37 + d * 11, y * 53 + d * 7);
          if (seed < 0.42) continue;
          const col = groundColor(nt, seed, pal);
          const px = x * TILE;
          const py = y * TILE;
          for (let i = 0; i < 2; i += 1) {
            const o = Math.floor(hash01(x + i * 7 + d * 13, y + i * 5 + d * 3) * (TILE - 5));
            const s = 2 + (i % 2) * 2;
            if (d === 0) pxRect(c, px + o, py, s + 1, s, col);
            else if (d === 1) pxRect(c, px + TILE - s, py + o, s, s, col);
            else if (d === 2) pxRect(c, px + o, py + TILE - s, s + 1, s, col);
            else pxRect(c, px, py + o, s, s, col);
          }
        }
      }
    }
  },

  drawGroundTile(c, px, py, t, x, y, pal, h) {
    const base = groundColor(t, h, pal);
    pxRect(c, px, py, TILE, TILE, base);

    // 2px 棋盘微差，避免纯色块
    if (h > 0.56) pxRect(c, px + 2, py + 2, 6, 2, base, 0.5);
    if (h < 0.18) pxRect(c, px + TILE - 10, py + TILE - 6, 6, 2, '#000000', 0.08);

    // 山门中庭：大块错缝石板，避免整张图出现均匀网格
    if (t === '.' && this.region.id === 'shanmen') {
      const slab = hash01(Math.floor(x / 3) + 91, Math.floor(y / 2) + 57);
      if (slab > 0.66) pxRect(c, px, py, TILE, TILE, '#cdbb95', 0.3);
      else if (slab < 0.28) pxRect(c, px, py, TILE, TILE, '#b9a780', 0.16);
      // 横向接缝：每两行一条，且并非每条都画全
      if (y % 2 === 0 && slab > 0.18) {
        pxRect(c, px, py, TILE, 2, '#8a7b5e', 0.28);
        pxRect(c, px + 2, py + 2, TILE - 6, 1, '#e6d7b2', 0.16);
      }
      // 纵向接缝：相邻石板行错位一格
      const shift = Math.floor(y / 2) % 2 ? 1 : 0;
      if ((x - shift) % 3 === 0 && x > 0) {
        pxRect(c, px, py, 2, TILE, '#8a7b5e', 0.26);
        pxRect(c, px + 2, py + 2, 1, TILE - 6, '#e6d7b2', 0.14);
      }
      // 磨损坑洼
      if (h > 0.8) pxRect(c, px + 6 + Math.floor(hash01(x + 5, y + 11) * 14), py + 9, 6, 2, '#a2947a', 0.5);
    } else if (t === '.' && this.region.id === 'luoxing') {
      pxRect(c, px + 3, py + 6, 11, 2, '#7d6c42', 0.5);
      pxRect(c, px + 16, py + 20, 9, 2, '#8d7c4c', 0.5);
    } else if (t === '.' && this.region.id === 'shenyuan') {
      pxRect(c, px + 2, py + 2, TILE - 4, 2, '#46506a', 0.4);
      pxRect(c, px + 2, py + TILE - 4, TILE - 4, 2, '#222a3c', 0.6);
    }

    if (t === 'W' || t === 'Z') {
      const rowY = py + 8 + Math.floor(h * 12);
      pxRect(c, px + 3, rowY, 12, 2, '#9fe4e0', 0.45);
      pxRect(c, px + 19, rowY + 6, 9, 2, '#d8f4f0', 0.3);
      if (hash01(y, x) > 0.72) pxRect(c, px + 8, py + 22, 4, 2, '#ffffff', 0.55);
      if (t === 'Z') {
        pxRect(c, px + 4, py + 3, 5, 5, pal.grass2);
        pxRect(c, px + 18, py + 18, 7, 4, pal.grass);
      }
    } else if (t === 'L') {
      pxRect(c, px + 2, py + 10, 12, 2, '#ffcf6a', 0.85);
      pxRect(c, px + 16, py + 16, 10, 2, '#ff9c4a', 0.7);
      pxRect(c, px + 6, py + 24, 7, 2, '#7a2418', 0.6);
    } else if (t === 'C') {
      pxRect(c, px + 2, py + 6, TILE - 4, 3, '#5a5148', 0.6);
      pxRect(c, px + 6, py + 18, TILE - 12, 3, '#8a7f6c', 0.45);
      pxRect(c, px + 10, py + 26, TILE - 20, 2, '#4a433b', 0.5);
    } else if (t === 'A') {
      pxRect(c, px + 2, py + 2, TILE - 4, TILE - 4, pal.stone);
      pxRect(c, px + 6, py + 6, TILE - 12, TILE - 12, '#a89a7c');
      pxRect(c, px, py + TILE / 2 - 1, TILE, 2, '#6d6352', 0.7);
      pxRect(c, px + TILE / 2 - 1, py, 2, TILE, '#6d6352', 0.7);
    } else if (t === ',') {
      // 石板错缝
      const off = (y % 2) * 8;
      for (let i = 0; i < 2; i += 1) {
        pxRect(c, px + 2 + ((i * 16 + off) % 28), py + 4 + i * 13, 12, 2, pal.path2, 0.6);
      }
    } else if (t === 'M' || t === 'b') {
      for (let i = 0; i < 4; i += 1) {
        pxRect(c, px, py + i * 8 + 7, TILE, 2, '#6b4a2c', 0.75);
      }
      pxRect(c, px + 2, py, 2, TILE, '#6b4a2c', 0.5);
      pxRect(c, px + TILE - 4, py, 2, TILE, '#6b4a2c', 0.5);
    } else if (t === 'D') {
      pxRect(c, px + 4, py + 6, 3, 2, '#e0c88f', 0.8);
      pxRect(c, px + 18, py + 18, 4, 2, '#9a7f52', 0.6);
      if (h > 0.7) pxRect(c, px + 9, py + 25, 9, 2, '#b89a64', 0.6);
    } else if (t === 'H') {
      for (let i = 0; i < 3; i += 1) pxRect(c, px, py + i * 11 + 8, TILE, 2, '#5f3f22', 0.7);
    } else if (t === 'T') {
      pxRect(c, px + 4, py + 5, 7, 3, pal.tree, 0.9);
      pxRect(c, px + 20, py + 20, 9, 3, '#1c3324', 0.8);
      if (h > 0.6) pxRect(c, px + 10, py + 26, 12, 2, '#4b7350', 0.6);
    }
  },

  decorateTile(c, px, py, t, x, y, pal, h) {
    if (t !== '.' && t !== 'g' && t !== ',' && t !== 'D' && t !== 'Z' && t !== 'A') return;
    const r = this.region.id;
    const flower = pal.flower;
    const h2 = hash01(x + 17, y + 31);
    const h3 = hash01(x + 41, y + 7);

    // 通用：草簇（每格至少一处，避免大面积空地）
    if (t === 'g' || t === '.' || t === 'Z') {
      const gx = px + 4 + Math.floor(hash01(x + 3, y + 7) * 20);
      const gy = py + 8 + Math.floor(hash01(y + 5, x + 2) * 16);
      pxRect(c, gx, gy, 2, 4 + (h > 0.5 ? 2 : 0), pal.grass2);
      pxRect(c, gx - 2, gy + 2, 2, 3, pal.grass2);
      pxRect(c, gx + 2, gy + 1, 2, 4, '#315c3d', 0.85);
      if (h2 > 0.55) {
        const gx2 = px + 6 + Math.floor(hash01(x + 11, y + 3) * 18);
        const gy2 = py + 14 + Math.floor(hash01(y + 9, x + 4) * 12);
        pxRect(c, gx2, gy2, 2, 5, pal.grass2, 0.9);
        pxRect(c, gx2 + 2, gy2 + 2, 2, 3, '#2a5136', 0.8);
      }
      if (h3 > 0.5) {
        pxRect(c, gx + 5, gy - 1, 2, 2, flower);
        pxRect(c, gx + 6, gy, 1, 1, '#fff6d0');
        if (h3 > 0.76) pxRect(c, gx + 1, gy + 6, 2, 2, flower, 0.9);
      }
      if (h2 > 0.74) {
        pxRect(c, px + 22, py + 19, 2, 2, '#6e6758', 0.7);
        pxRect(c, px + 23, py + 20, 1, 1, '#a39a88', 0.6);
      }
    }
    if (t === ',' && h > 0.4) {
      pxRect(c, px + 6, py + 8, 3, 2, '#8d7a5c', 0.8);
      pxRect(c, px + 20, py + 22, 2, 2, '#e0d0ac', 0.7);
      if (h > 0.72) pxRect(c, px + 12, py + 17, 4, 2, '#6f5f46', 0.6);
    }
    if (t === '.' && h < 0.3) {
      pxRect(c, px + 14, py + 20, 2, 2, '#6e6758', 0.55);
      pxRect(c, px + 22, py + 7, 3, 2, '#7d7362', 0.4);
    }
    if (t === 'A' && h > 0.6) {
      pxRect(c, px + 4, py + 4, 2, 2, pal.flower, 0.8);
      pxRect(c, px + 24, py + 24, 2, 2, '#fff6d0', 0.7);
    }
    if (t === '.' && this.region.id === 'shanmen' && h > 0.82) {
      // 石缝青苔与草皮
      pxRect(c, px + 4, py + 21, 9, 4, pal.grass2, 0.75);
      pxRect(c, px + 7, py + 18, 4, 3, pal.grass, 0.7);
      pxRect(c, px + 21, py + 6, 6, 3, pal.grass2, 0.55);
      pxRect(c, px + 6, py + 23, 2, 2, '#8fdf8a', 0.6);
    }

    // 区域专属点缀
    if (r === 'shanmen' || r === 'qingxi') {
      if (h > 0.56) {
        pxRect(c, px + 8, py + 12, 2, 3, '#f2e08a');
        pxRect(c, px + 7, py + 11, 4, 1, '#fff6c8');
      }
      if (h > 0.84) {
        // 落叶
        pxRect(c, px + 19, py + 8, 3, 2, '#c07a3a', 0.8);
        pxRect(c, px + 22, py + 9, 2, 1, '#8f5a2a', 0.7);
      }
    } else if (r === 'wuyin') {
      if (h > 0.62) {
        pxRect(c, px + 12, py + 16, 2, 4, '#d8d0c0');
        pxRect(c, px + 10, py + 14, 6, 2, '#9b6a7a');
      }
      if (h2 > 0.8) pxRect(c, px + 5, py + 23, 5, 2, '#5aa866', 0.6);
    } else if (r === 'luoxing') {
      if (h > 0.55) {
        pxRect(c, px + 8, py + 14, 3, 2, '#d8cfa8');
        pxRect(c, px + 11, py + 12, 2, 2, '#9aa4b0');
      }
      if (h2 > 0.78) pxRect(c, px + 18, py + 6, 4, 2, '#6d5a36', 0.7);
    } else if (r === 'guixu') {
      if (h > 0.56) {
        pxRect(c, px + 10, py + 18, 4, 3, '#f0e2c0');
        pxRect(c, px + 11, py + 19, 2, 1, '#c9a878');
      }
      if (t === 'D' && h2 > 0.7) pxRect(c, px + 4, py + 8, 2, 2, '#e8d8a8', 0.8);
    } else if (r === 'yunmeng') {
      if (t === 'Z' && h > 0.55) {
        pxRect(c, px + 8, py + 10, 6, 3, '#4f8f5c');
        pxRect(c, px + 13, py + 8, 2, 3, '#f0b8d8');
      }
      if (t === 'g' && h2 > 0.72) pxRect(c, px + 20, py + 20, 2, 5, '#8fbf6a', 0.9);
    } else if (r === 'gutan') {
      if (h > 0.5) pxRect(c, px + 8, py + 12, 2, 2, '#ff9c4a', 0.9);
      if (h > 0.8) pxRect(c, px + 20, py + 20, 3, 2, '#ffcf6a', 0.6);
      if (h2 > 0.7) pxRect(c, px + 16, py + 6, 3, 2, '#2a1a16', 0.8);
    } else if (r === 'shenyuan') {
      if (h > 0.5) {
        pxRect(c, px + 10, py + 14, 2, 6, '#7fd0e8', 0.75);
        pxRect(c, px + 8, py + 18, 6, 2, '#4f9ab8', 0.7);
      }
      if (h2 > 0.75) pxRect(c, px + 22, py + 7, 2, 2, '#b9e6ff', 0.8);
    }
  }
});
