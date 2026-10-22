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
  shanmen: { base: '#9c8d72', base2: '#92836a', path: '#c3aa7b', path2: '#b19566', grass: '#6f9d55', grass2: '#5f8c49', tree: '#2f5a3b', water: '#3f97a6', water2: '#2d7a8a', wood: '#8f6339', stone: '#8b8371', sand: '#c9b184', cliff: '#7d735f', lava: '#d06a32', plank: '#a9794a', marsh: '#7fa66a', flower: '#f2d06a' },
  qingxi: { base: '#6f9d55', base2: '#65924c', path: '#b99a6e', path2: '#a5875e', grass: '#567f42', grass2: '#4a7139', tree: '#274d33', water: '#3f9aa8', water2: '#2c7684', wood: '#8a5f38', stone: '#7d7a68', sand: '#c6ad7f', cliff: '#6f6b5b', lava: '#c4622f', plank: '#9c7046', marsh: '#63906c', flower: '#f4e08a' },
  wuyin: { base: '#476b52', base2: '#3e6049', path: '#8a7a5c', path2: '#78694e', grass: '#355a42', grass2: '#2c4d38', tree: '#1d3a2a', water: '#2f6e78', water2: '#235760', wood: '#6d4e32', stone: '#5f665e', sand: '#a39b7f', cliff: '#545b55', lava: '#b0562f', plank: '#7d5a38', marsh: '#4d7767', flower: '#b7e6c1' },
  luoxing: { base: '#a68652', base2: '#9a7b49', path: '#c0a269', path2: '#ad8e57', grass: '#8a7a45', grass2: '#7a6c3c', tree: '#4c4a2c', water: '#3f8296', water2: '#2f6a80', wood: '#8a5f34', stone: '#817762', sand: '#d6bc84', cliff: '#6d6150', lava: '#d07034', plank: '#9a7142', marsh: '#7f8a56', flower: '#ffcf6a' },
  guixu: { base: '#b9a876', base2: '#ad9c6c', path: '#c8b283', path2: '#b59d6f', grass: '#8fa06a', grass2: '#7f905c', tree: '#3d5a44', water: '#2f8fa8', water2: '#227288', wood: '#8f6a3e', stone: '#8f8874', sand: '#dcc694', cliff: '#7a705d', lava: '#cc6a38', plank: '#9a7448', marsh: '#7fa08a', flower: '#f0d9a0' },
  yunmeng: { base: '#7fa06a', base2: '#73945e', path: '#a99570', path2: '#96825f', grass: '#648850', grass2: '#587a46', tree: '#325440', water: '#4f8f9c', water2: '#3d7784', wood: '#7d5c39', stone: '#7d8474', sand: '#c8b98f', cliff: '#666e5e', lava: '#c05c32', plank: '#92703f', marsh: '#5d8f7c', flower: '#f0b8d8' },
  gutan: { base: '#5a4a44', base2: '#51413c', path: '#7a5f4a', path2: '#6a5140', grass: '#6b5a45', grass2: '#5d4d3c', tree: '#332a26', water: '#a34a2e', water2: '#8a3a24', wood: '#5f4630', stone: '#6a6156', sand: '#8f7a60', cliff: '#574c44', lava: '#ef7a32', plank: '#6f5238', marsh: '#6a6650', flower: '#ff9c4a' },
  shenyuan: { base: '#30384f', base2: '#2a3146', path: '#4b556e', path2: '#3e4760', grass: '#3c4a5f', grass2: '#334052', tree: '#1d2436', water: '#2f5f78', water2: '#244d64', wood: '#4a3f52', stone: '#4b536a', sand: '#59617a', cliff: '#414a61', lava: '#a34a6a', plank: '#4f4560', marsh: '#3f5866', flower: '#b9e6ff' },
};

function palOf(region) { return REGION_PAL[region.id] || REGION_PAL.qingxi; }

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

    canvas.refresh();
    this.add.image(0, 0, key).setOrigin(0, 0).setDepth(-20);
    this.add.rectangle(0, 0, W, H, worldHex(r.tint || '#f2ede2'), 0.03).setOrigin(0, 0).setDepth(-19);
  },

  drawGroundTile(c, px, py, t, x, y, pal, h) {
    let base = pal.base;
    if (t === ',') base = h > 0.5 ? pal.path : pal.path2;
    else if (t === 'g') base = h > 0.5 ? pal.grass : pal.grass2;
    else if (t === 'W') base = h > 0.5 ? pal.water : pal.water2;
    else if (t === 'Z') base = h > 0.5 ? pal.marsh : pal.water2;
    else if (t === 'T') base = pal.tree;
    else if (t === 'R') base = pal.base2;
    else if (t === 'H') base = pal.wood;
    else if (t === 'C') base = pal.cliff;
    else if (t === 'A') base = pal.stone;
    else if (t === 'L') base = pal.lava;
    else if (t === 'D') base = pal.sand;
    else if (t === 'M') base = pal.plank;
    else if (t === 'S' || t === 'E') base = pal.path;
    pxRect(c, px, py, TILE + 1, TILE + 1, base);

    // 2px 棋盘微差，避免纯色块
    if (h > 0.56) pxRect(c, px + 2, py + 2, 6, 2, base, 0.5);
    if (h < 0.18) pxRect(c, px + TILE - 10, py + TILE - 6, 6, 2, '#000000', 0.08);

    // 山门中庭：石板铺装
    if (t === '.' && this.region.id === 'shanmen') {
      const off = (y % 2) * 8;
      pxRect(c, px, py + 15, TILE, 2, '#7a6d58', 0.55);
      pxRect(c, px + 15, py, 2, TILE, '#7a6d58', 0.4);
      pxRect(c, px + 7 + off, py, 2, 16, '#85775f', 0.35);
      pxRect(c, px + 23 - off, py + 17, 2, 15, '#85775f', 0.35);
      if (h > 0.7) pxRect(c, px + 5, py + 5, 4, 2, '#b3a487', 0.45);
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
