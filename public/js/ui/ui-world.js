// 灵兽录 · 界面层 · 山河图、设置、存档、试炼与任务
// ---------- 山河图 · 九嶂大陆 ----------
var ATLAS_CELL_CACHE = null;

var ATLAS_KINDS = {
  hub: { name: '中枢', color: '#d9a527' },
  main: { name: '主境', color: '#4a7a5c' },
  side: { name: '支线', color: '#2f9e64' },
  secret: { name: '秘境', color: '#8a5fc9' },
};

function atlasKindOf(id) {
  var a = WORLD_ATLAS.regions[id];
  return a && ATLAS_KINDS[a.kind] ? a.kind : 'main';
}

function atlasPlot(id) {
  var a = WORLD_ATLAS.regions[id];
  if (!a) return null;
  return {
    x: a.at[0], y: a.at[1], w: a.size[0], h: a.size[1],
    cx: a.at[0] + a.size[0] / 2, cy: a.at[1] + a.size[1] / 2,
  };
}

// 用椭圆块 + hash 噪声生成像素大陆
function atlasLandGrid() {
  if (ATLAS_CELL_CACHE) return ATLAS_CELL_CACHE;
  var g = WORLD_ATLAS.grid;
  var land = [];
  for (var y = 0; y < g.h; y += 1) {
    land.push([]);
    for (var x = 0; x < g.w; x += 1) {
      var isLand = false;
      for (var i = 0; i < WORLD_ATLAS.land.length; i += 1) {
        var b = WORLD_ATLAS.land[i];
        var nx = (x + 0.5 - b.x) / b.rx;
        var ny = (y + 0.5 - b.y) / b.ry;
        if (nx * nx + ny * ny <= 1 - 0.2 * hash2(x + 5, y + 11)) { isLand = true; break; }
      }
      land[y][x] = isLand;
    }
  }
  ATLAS_CELL_CACHE = land;
  return land;
}

function atlasBiomeAt(x, y) {
  var list = WORLD_ATLAS.biomes || [];
  var found = null;
  for (var i = 0; i < list.length; i += 1) {
    var b = list[i];
    var nx = (x + 0.5 - b.x) / b.rx;
    var ny = (y + 0.5 - b.y) / b.ry;
    if (nx * nx + ny * ny <= 1 - 0.12 * hash2(x + 3, y + 7)) found = b;
  }
  return found;
}

function atlasDeepSeaAt(x, y) {
  var list = WORLD_ATLAS.deepSea || [];
  for (var i = 0; i < list.length; i += 1) {
    var b = list[i];
    var nx = (x + 0.5 - b.x) / b.rx;
    var ny = (y + 0.5 - b.y) / b.ry;
    if (nx * nx + ny * ny <= 1) return true;
  }
  return false;
}

// 地貌纹理：草簇、灌木、碎石、苇草、烬痕、雪点
function atlasTextureLayer(land, out) {
  var g = WORLD_ATLAS.grid;
  for (var y = 2; y < g.h - 1; y += 3) {
    for (var x = 2; x < g.w - 1; x += 3) {
      if (!land[y][x]) continue;
      var bio = atlasBiomeAt(x, y);
      if (!bio) continue;
      var h = hash2(x + 41, y + 23);
      if (bio.type === 'meadow' && h > 0.38) {
        out.push('<path d="M' + (x + 0.12) + ' ' + (y + 0.92) + 'l0.16 -0.4M' + (x + 0.34) + ' ' + (y + 0.92) + 'l0.08 -0.5M' + (x + 0.54) + ' ' + (y + 0.92) + 'l0.18 -0.34M' + (x + 0.74) + ' ' + (y + 0.92) + 'l0.12 -0.28" stroke="#5f7038" stroke-width="0.11" stroke-linecap="square" opacity="0.75"/>');
      } else if (bio.type === 'forest' && h > 0.44) {
        out.push('<rect x="' + (x + 0.38) + '" y="' + (y + 0.48) + '" width="0.14" height="0.32" fill="#5b4a32" opacity="0.7"/>');
        out.push('<path d="M' + (x + 0.26) + ' ' + (y + 0.56) + 'l0.2 -0.34l0.2 0.34Z" fill="#4a6340" opacity="0.75"/>');
        out.push('<rect x="' + (x + 0.08) + '" y="' + (y + 0.78) + '" width="0.14" height="0.1" fill="#6b7f4a" opacity="0.55"/>');
      } else if ((bio.type === 'highland' || bio.type === 'rock') && h > 0.42) {
        out.push('<path d="M' + (x + 0.12) + ' ' + (y + 0.9) + 'l0.3 -0.5l0.32 0.5Z" fill="#7d6847" stroke="#5f4e36" stroke-width="0.06" opacity="0.75"/>');
        if (h > 0.68) out.push('<rect x="' + (x + 0.64) + '" y="' + (y + 0.76) + '" width="0.18" height="0.12" fill="#6d5a3d" opacity="0.6"/>');
      } else if (bio.type === 'marsh' && h > 0.36) {
        out.push('<path d="M' + (x + 0.22) + ' ' + (y + 0.94) + 'v-0.54M' + (x + 0.44) + ' ' + (y + 0.94) + 'v-0.36M' + (x + 0.68) + ' ' + (y + 0.94) + 'v-0.44" stroke="#4f6a4a" stroke-width="0.1" stroke-linecap="square" opacity="0.72"/>');
        out.push('<rect x="' + (x + 0.3) + '" y="' + (y + 0.56) + '" width="0.3" height="0.1" fill="#6f9aa8" opacity="0.55"/>');
      } else if (bio.type === 'ash' && h > 0.44) {
        out.push('<path d="M' + (x + 0.16) + ' ' + (y + 0.52) + 'l0.22 0.2l-0.1 0.22" stroke="#6b4a36" stroke-width="0.09" opacity="0.72"/>');
        if (h > 0.7) {
          out.push('<rect class="atlas-ember" x="' + (x + 0.5) + '" y="' + (y + 0.54) + '" width="0.14" height="0.14" fill="#e07a3a" style="animation-delay:-' + (h * 4).toFixed(1) + 's"/>');
          out.push('<rect class="atlas-ember" x="' + (x + 0.44) + '" y="' + (y + 0.48) + '" width="0.26" height="0.26" fill="#f3b06a" opacity="0.25" style="animation-delay:-' + (h * 4).toFixed(1) + 's"/>');
        }
      } else if (bio.type === 'void' && h > 0.4) {
        out.push('<rect x="' + (x + 0.36) + '" y="' + (y + 0.42) + '" width="0.16" height="0.16" fill="#f7f2fb" opacity="0.75"/>');
        if (h > 0.66) out.push('<path d="M' + (x + 0.62) + ' ' + (y + 0.86) + 'l0.12 -0.2l0.12 0.2Z" fill="#8f7fa3" opacity="0.55"/>');
      }
    }
  }
}

function atlasBuildSvg(sel, here) {
  var g = WORLD_ATLAS.grid;
  var land = atlasLandGrid();
  var save = LB.saveState();
  var out = [];
  var i;

  out.push('<defs>' +
    '<pattern id="atlas-wave" width="3" height="3" patternUnits="userSpaceOnUse">' +
    '<rect width="3" height="3" fill="#2f6f8c"/>' +
    '<path d="M0.2 1.6h1.4M1.9 2.7h0.9" stroke="#4f8fa8" stroke-width="0.2" stroke-linecap="square"/>' +
    '</pattern>' +
    '<pattern id="atlas-hatch" width="1.5" height="1.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
    '<rect width="1.5" height="1.5" fill="#8d836f"/>' +
    '<rect width="0.5" height="1.5" fill="#776d5a"/>' +
    '</pattern>' +
    '<pattern id="atlas-grid" width="4" height="4" patternUnits="userSpaceOnUse">' +
    '<path d="M0 0.5h4M0.5 0v4" stroke="#2a2318" stroke-opacity="0.05" stroke-width="0.08"/>' +
    '</pattern>' +
    '</defs>');

  out.push('<rect width="' + g.w + '" height="' + g.h + '" fill="url(#atlas-wave)"/>');

  var wavesA = [];
  var wavesB = [];
  var foam = [];

  // 海面：深水区与动态波纹
  for (var sy = 0; sy < g.h; sy += 1) {
    for (var sx = 0; sx < g.w; sx += 1) {
      if (land[sy][sx]) continue;
      if (atlasDeepSeaAt(sx, sy) && hash2(sx + 9, sy + 13) > 0.38) {
        out.push('<rect x="' + sx + '" y="' + sy + '" width="1.02" height="1.02" fill="#2a6079"/>');
      }
      if (hash2(sx + 21, sy + 5) > 0.86) {
        var wy = (sy + 0.5 + hash2(sx + 2, sy + 9) * 0.35).toFixed(2);
        var wl = hash2(sx + 4, sy + 8) > 0.5 ? '0.9' : '0.6';
        var wave = '<path d="M' + (sx + 0.15) + ' ' + wy + 'h' + wl + '" stroke="#7fb3c6" stroke-width="0.12" stroke-linecap="square" opacity="0.7"/>';
        if (hash2(sx + 7, sy + 2) > 0.5) wavesA.push(wave);
        else wavesB.push(wave);
      }
    }
  }

  // 陆地与海岸
  for (var y = 0; y < g.h; y += 1) {
    for (var x = 0; x < g.w; x += 1) {
      if (!land[y][x]) continue;
      var coast = false;
      if (x <= 0 || y <= 0 || x >= g.w - 1 || y >= g.h - 1) coast = true;
      else if (!land[y - 1][x] || !land[y + 1][x] || !land[y][x - 1] || !land[y][x + 1]) coast = true;
      var bio = atlasBiomeAt(x, y);
      var fill;
      if (coast) fill = '#b39a68';
      else if (bio) fill = hash2(x + 31, y + 17) > 0.52 ? bio.color : bio.color2;
      else fill = hash2(x + 31, y + 17) > 0.55 ? '#d8c69a' : '#d2bf8d';
      out.push('<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + fill + '"/>');
      if (coast) {
        if (y > 0 && !land[y - 1][x]) foam.push('<path d="M' + x + ' ' + (y + 0.14) + 'h1" stroke="#f7eed8" stroke-width="0.1" opacity="0.42"/>');
        if (y < g.h - 1 && !land[y + 1][x]) foam.push('<path d="M' + x + ' ' + (y + 0.9) + 'h1" stroke="#f7eed8" stroke-width="0.1" opacity="0.42"/>');
        if (x > 0 && !land[y][x - 1]) foam.push('<path d="M' + (x + 0.1) + ' ' + y + 'v1" stroke="#f7eed8" stroke-width="0.1" opacity="0.42"/>');
        if (x < g.w - 1 && !land[y][x + 1]) foam.push('<path d="M' + (x + 0.92) + ' ' + y + 'v1" stroke="#f7eed8" stroke-width="0.1" opacity="0.42"/>');
      }
    }
  }
  out.push('<g class="atlas-waves atlas-waves-a">' + wavesA.join('') + '</g>');
  out.push('<g class="atlas-waves atlas-waves-b">' + wavesB.join('') + '</g>');
  out.push('<g class="atlas-foam">' + foam.join('') + '</g>');
  atlasTextureLayer(land, out);
  out.push('<rect width="' + g.w + '" height="' + g.h + '" fill="url(#atlas-grid)" pointer-events="none"/>');

  // 湖
  (WORLD_ATLAS.lakes || []).forEach(function (lk) {
    var r = lk.r || 1;
    out.push('<rect x="' + (lk.x - r) + '" y="' + (lk.y - r) + '" width="' + (r * 2) + '" height="' + (r * 2) +
      '" fill="#3f7f9e" stroke="#2b5f78" stroke-width="0.18"/>');
    out.push('<rect class="atlas-lake-glint" x="' + (lk.x - r + 0.5) + '" y="' + (lk.y - r + 0.5) + '" width="' + Math.max(0.6, r) + '" height="0.2" fill="#bfe3ea" opacity="0.55"/>');
  });

  // 河流
  (WORLD_ATLAS.rivers || []).forEach(function (rv) {
    var d = rv.path.map(function (p, idx) { return (idx ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('');
    out.push('<path d="' + d + '" fill="none" stroke="#2b5f78" stroke-width="0.62" stroke-linejoin="miter"/>');
    out.push('<path d="' + d + '" fill="none" stroke="#7fb3c6" stroke-width="0.18" stroke-opacity="0.9" stroke-linejoin="miter"/>');
    out.push('<path class="atlas-river-flow" d="' + d + '" fill="none" stroke="#cdeef2" stroke-width="0.15" stroke-dasharray="0.5 1.3" stroke-linecap="square"/>');
  });

  // 山脉
  (WORLD_ATLAS.ridges || []).forEach(function (ridge) {
    var pts = ridge.path;
    var sz = ridge.size || 1;
    for (var k = 0; k < pts.length - 1; k += 1) {
      var x0 = pts[k][0], y0 = pts[k][1], x1 = pts[k + 1][0], y1 = pts[k + 1][1];
      var steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (var st = 0; st < steps; st += 2) {
        var mx = Math.round(x0 + (x1 - x0) * st / steps);
        var my = Math.round(y0 + (y1 - y0) * st / steps);
        if (!land[my] || !land[my][mx]) continue;
        out.push('<path d="M' + mx + ' ' + (my + 0.95) + 'l' + (0.5 * sz) + ' -' + (1.05 * sz) + 'l' + (0.5 * sz) + ' ' + (1.05 * sz) + 'Z" fill="#8a7350" stroke="#6d5a3d" stroke-width="0.1"/>');
        out.push('<path d="M' + (mx + 0.5 * sz) + ' ' + (my + 0.95) + 'l' + (0.36 * sz) + ' -' + (0.74 * sz) + 'l' + (0.36 * sz) + ' ' + (0.74 * sz) + 'Z" fill="#a8916a"/>');
        if (ridge.snow) {
          var peakX = mx + 0.5 * sz;
          var peakY = my + 0.95 - 1.05 * sz;
          out.push('<path d="M' + peakX + ' ' + (peakY + 0.02) + 'L' + (peakX + 0.2 * sz) + ' ' + (peakY + 0.4 * sz) + 'L' + (peakX - 0.2 * sz) + ' ' + (peakY + 0.4 * sz) + 'Z" fill="#f2ece0" opacity="0.9"/>');
        }
      }
    }
  });

  // 林带
  (WORLD_ATLAS.forests || []).forEach(function (f) {
    for (i = 0; i < f.n; i += 1) {
      var fx = f.x + Math.round((hash2(f.x + i, f.y + 3) - 0.5) * 4);
      var fy = f.y + Math.round((hash2(f.x + 7, f.y + i) - 0.5) * 4);
      if (!land[fy] || !land[fy][fx]) continue;
      out.push('<rect x="' + (fx + 0.34) + '" y="' + (fy + 0.45) + '" width="0.2" height="0.5" fill="#5b4a32"/>');
      out.push('<path d="M' + (fx + 0.44) + ' ' + (fy + 0.08) + 'l0.56 1.05h-1.12Z" fill="#3f6b48" stroke="#2c4a33" stroke-width="0.08"/>');
    }
  });

  // 云影
  (WORLD_ATLAS.clouds || []).forEach(function (c) {
    function cloudRects(x0, y0, w0) {
      return '<rect x="' + x0 + '" y="' + (y0 + 1.05) + '" width="' + w0 + '" height="0.8"/>' +
        '<rect x="' + (x0 + 0.7) + '" y="' + (y0 + 0.6) + '" width="' + (w0 * 0.34) + '" height="0.9"/>' +
        '<rect x="' + (x0 + w0 * 0.36) + '" y="' + (y0 + 0.28) + '" width="' + (w0 * 0.3) + '" height="1.12"/>' +
        '<rect x="' + (x0 + w0 * 0.64) + '" y="' + (y0 + 0.7) + '" width="' + (w0 * 0.28) + '" height="0.8"/>';
    }
    out.push('<g class="atlas-cloud" style="animation-duration:' + c.speed + 's;animation-delay:' + c.delay + 's">');
    out.push('<g fill="#5b4a32" opacity="0.08">' + cloudRects(c.x + 0.5, c.y + 0.5, c.w) + '</g>');
    out.push('<g fill="#fff7e6" opacity="0.2">' + cloudRects(c.x, c.y, c.w) + '</g>');
    out.push('</g>');
  });

  // 通路（先画，压在区域地块下）
  WORLD_ATLAS.routes.forEach(function (pair) {
    if (!REGIONS[pair[0]] || !REGIONS[pair[1]]) return;
    var a = atlasPlot(pair[0]);
    var b = atlasPlot(pair[1]);
    if (!a || !b) return;
    var lit = LB.regionUnlocked(pair[0]) && LB.regionUnlocked(pair[1]);
    var dashed = pair[2] === 1 || atlasKindOf(pair[0]) !== 'main' || atlasKindOf(pair[1]) !== 'main';
    var midX = (a.cx + b.cx) / 2;
    var d = 'M' + a.cx + ' ' + a.cy + 'H' + midX + 'V' + b.cy + 'H' + b.cx;
    out.push('<path d="' + d + '" fill="none" stroke="' + (lit ? '#f0e2bd' : '#7d6c4e') +
      '" stroke-opacity="' + (lit ? 0.9 : 0.42) + '" stroke-width="' + (lit ? 0.34 : 0.22) + '"' +
      (dashed ? ' stroke-dasharray="0.8 0.6"' : '') + '/>');
    if (lit) {
      out.push('<path class="atlas-route-flow" d="' + d + '" fill="none" stroke="#fff3c0" stroke-width="0.13" stroke-dasharray="0.4 1.15" stroke-linecap="square"/>');
    }
  });

  // 区域地块
  REGION_ORDER.forEach(function (id) {
    var r = REGIONS[id];
    var a = WORLD_ATLAS.regions[id];
    if (!r || !a) return;
    var p = atlasPlot(id);
    var unlocked = LB.regionUnlocked(id);
    var current = id === here;
    var selected = id === sel;
    var visited = !!(save && save.visited && save.visited[id]);
    var kind = atlasKindOf(id);
    var x = p.x + 0.16, y = p.y + 0.16, w = p.w - 0.32, h = p.h - 0.32;
    var small = p.w < 4;
    var glyph = unlocked
      ? (kind === 'hub' ? '门' : kind === 'side' ? '支' : kind === 'secret' ? '秘' : '境')
      : (kind === 'main' ? '雾' : '?');
    var label = unlocked
      ? (a.short || r.name)
      : (kind === 'side' ? '支线' : kind === 'secret' ? '秘境' : (r.chapter ? '第 ' + r.chapter + ' 境' : '未点亮'));
    var glyphSize = small ? 1.2 : 1.5;
    var labelSize = small ? 0.95 : 1.1;

    out.push('<g class="atlas-plot' + (unlocked ? '' : ' locked') + (current ? ' current' : '') + (selected ? ' selected' : '') +
      '" data-atlas-node="' + uiEsc(id) + '" role="button" tabindex="0" aria-label="' + uiEsc(unlocked ? r.name : '未点亮区域') + '">');
    out.push('<rect x="' + (x + 0.36) + '" y="' + (y + 0.36) + '" width="' + w + '" height="' + h + '" fill="#2a2318" opacity="0.28"/>');
    out.push('<rect class="atlas-plot-bg" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" fill="' + (unlocked ? a.color : 'url(#atlas-hatch)') + '" stroke="' + (current ? '#fff3c0' : '#2a2318') +
      '" stroke-width="' + (current ? 0.16 : 0.1) + '"/>');
    out.push('<rect x="' + (x + 0.24) + '" y="' + (y + 0.24) + '" width="' + (w - 0.48) + '" height="' + (h - 0.48) +
      '" fill="none" stroke="#fff7e6" stroke-opacity="' + (unlocked ? 0.38 : 0.12) + '" stroke-width="0.08"/>');
    if (!unlocked) {
      out.push('<rect class="atlas-lockfog" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#efe3c8" opacity="0.1"/>');
    }
    out.push('<text x="' + p.cx + '" y="' + (p.y + 1.72) + '" text-anchor="middle" font-size="' + glyphSize + '" fill="' +
      (unlocked ? '#2a2318' : '#f0e2bd') + '" fill-opacity="' + (unlocked ? 0.92 : 0.55) + '">' + glyph + '</text>');
    out.push('<text x="' + p.cx + '" y="' + (p.y + p.h - 0.48) + '" text-anchor="middle" font-size="' + labelSize + '" fill="' +
      (unlocked ? '#2a2318' : '#efe3c8') + '" fill-opacity="' + (unlocked ? 0.95 : 0.72) + '">' + uiEsc(label) + '</text>');
    if (unlocked && p.w >= 4) {
      out.push('<rect class="atlas-lamp" x="' + (p.x + 0.72) + '" y="' + (p.y + 0.62) + '" width="0.24" height="0.24" fill="#ffe9a8" style="animation-delay:-' + (hash2(p.x, p.y) * 4).toFixed(1) + 's"/>');
      out.push('<rect class="atlas-lamp" x="' + (p.x + p.w - 1.04) + '" y="' + (p.y + p.h - 0.98) + '" width="0.18" height="0.18" fill="#ffe9a8" style="animation-delay:-' + (hash2(p.y, p.x) * 5).toFixed(1) + 's"/>');
      for (var mi = 0; mi < 2; mi += 1) {
        var moteX = p.x + 0.55 + hash2(p.x + mi * 3, p.y + 2) * (p.w - 1.1);
        var moteY = p.y + 0.5 + hash2(p.y + mi * 5, p.x + 1) * (p.h - 1.0);
        out.push('<rect class="atlas-mote" x="' + moteX.toFixed(2) + '" y="' + moteY.toFixed(2) + '" width="0.12" height="0.12" fill="#ffe9a8" style="animation-delay:-' + (hash2(moteX, moteY) * 6).toFixed(1) + 's"/>');
      }
    }
    if (current) {
      out.push('<text x="' + p.cx + '" y="' + (p.y - 0.62) + '" text-anchor="middle" font-size="1.2" fill="#8a5a10" stroke="#fff3c0" stroke-width="0.22" paint-order="stroke">你在此</text>');
      out.push('<rect class="atlas-current-ring" x="' + (x - 0.48) + '" y="' + (y - 0.48) + '" width="' + (w + 0.96) + '" height="' + (h + 0.96) +
        '" fill="none" stroke="#fff3c0" stroke-width="0.14" stroke-dasharray="0.55 0.6"/>');
    }
    if (selected) {
      out.push('<rect class="atlas-selected-ring" x="' + (x - 0.46) + '" y="' + (y - 0.46) + '" width="' + (w + 0.92) + '" height="' + (h + 0.92) +
        '" fill="none" stroke="#fff7e6" stroke-width="0.16" stroke-dasharray="0.7 0.55"/>');
    }
    if (visited && !current) {
      out.push('<rect x="' + (p.x + p.w - 0.72) + '" y="' + (p.y + 0.36) + '" width="0.22" height="0.22" fill="#fff3c0" opacity="0.92"/>');
    }
    out.push('<title>' + uiEsc(unlocked ? r.name + ' · ' + (r.subtitle || '') : '未点亮') + '</title>');
    out.push('</g>');
  });

  // 已规划但尚未做内容的区域：淡显为「未辟」，让大陆保留扩展空间
  Object.keys(WORLD_ATLAS.regions).forEach(function (id) {
    if (REGIONS[id]) return;
    var a = WORLD_ATLAS.regions[id];
    var p = atlasPlot(id);
    if (!a || !p) return;
    out.push('<g class="atlas-planned" data-atlas-planned="' + uiEsc(id) + '" role="button" tabindex="0">');
    out.push('<rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h +
      '" fill="#c9b993" fill-opacity="0.2" stroke="#6d6452" stroke-opacity="0.7" stroke-width="0.12" stroke-dasharray="0.4 0.4" pointer-events="all"/>');
    out.push('<text x="' + p.cx + '" y="' + (p.cy + 0.36) + '" text-anchor="middle" font-size="1.15" fill="#5f5747" fill-opacity="0.82" pointer-events="none">未辟</text>');
    out.push('<title>未辟之地 · 待后续开辟</title>');
    out.push('</g>');
  });

  // 预留空白
  WORLD_ATLAS.reserved.forEach(function (b, idx) {
    var x = b.at[0], y = b.at[1], w = b.size[0], h = b.size[1];
    out.push('<g class="atlas-blank" data-atlas-blank="' + idx + '" role="button" tabindex="0">');
    out.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" fill="#c9b993" fill-opacity="0.2" stroke="#6d6452" stroke-width="0.16" stroke-dasharray="0.6 0.55"/>');
    out.push('<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 0.55) + '" text-anchor="middle" font-size="1.9" fill="#6d6452" fill-opacity="0.7">?</text>');
    out.push('<text x="' + (x + w / 2) + '" y="' + (y + h + 1.2) + '" text-anchor="middle" font-size="1.2" fill="#7d6c4e" stroke="#e8dcc0" stroke-width="0.2" paint-order="stroke">' + uiEsc(b.label || '未名之地') + '</text>');
    out.push('</g>');
  });

  // 罗盘
  out.push('<g transform="translate(3.8,3.8)" opacity="0.92">' +
    '<circle r="2.05" fill="#f3e7ca" fill-opacity="0.92" stroke="#2a2318" stroke-width="0.18"/>' +
    '<circle r="1.4" fill="none" stroke="#8a7350" stroke-width="0.1"/>' +
    '<g class="atlas-needle">' +
    '<path d="M0 -1.65 L0.42 0 L0 1.65 L-0.42 0 Z" fill="#cf4b3a"/>' +
    '<path d="M0 -1.65 L0.42 0 L0 0.15 Z" fill="#f0b27a"/>' +
    '</g>' +
    '<text y="-2.42" text-anchor="middle" font-size="0.95" fill="#2a2318" stroke="#f3e7ca" stroke-width="0.16" paint-order="stroke">北</text>' +
    '</g>');

  return '<svg class="atlas-svg" viewBox="0 0 ' + g.w + ' ' + g.h + '" role="img" aria-label="九嶂大荒山河图" shape-rendering="crispEdges">' +
    out.join('') + '</svg>';
}

function atlasStatHtml() {
  var s = LB.saveState();
  if (!s) return '';
  var built = REGION_ORDER.filter(function (id) { return !!REGIONS[id]; });
  var lit = built.filter(function (id) { return LB.regionUnlocked(id); }).length;
  var walked = built.filter(function (id) { return !!(s.visited && s.visited[id]); }).length;
  var chests = 0, chestsDone = 0, steles = 0, stelesDone = 0, quests = 0, questsDone = 0;
  var questDefs = typeof SIDE_QUESTS !== 'undefined' ? SIDE_QUESTS : [];
  built.forEach(function (id) {
    var r = REGIONS[id];
    (r.chests || []).forEach(function (c) { chests += 1; if (LB.flag(c.id)) chestsDone += 1; });
    (r.steles || []).forEach(function (st) { steles += 1; if (s.steles && s.steles[st.id]) stelesDone += 1; });
    questDefs.forEach(function (q) { if (q.giver && q.giver.region === id) quests += 1; });
  });
  if (typeof LB.sideQuestList === 'function') {
    var doneIds = {};
    LB.sideQuestList().forEach(function (q) { if (q.rewarded) doneIds[q.id] = 1; });
    questDefs.forEach(function (q) {
      if (q.giver && REGIONS[q.giver.region] && doneIds[q.id]) questsDone += 1;
    });
  }
  return '<span class="atlas-stat">已点亮 <b>' + lit + '</b>/' + built.length + '</span>' +
    '<span class="atlas-stat">已踏足 <b>' + walked + '</b>/' + built.length + '</span>' +
    '<span class="atlas-stat">宝箱 <b>' + chestsDone + '</b>/' + chests + '</span>' +
    '<span class="atlas-stat">碑文 <b>' + stelesDone + '</b>/' + steles + '</span>' +
    '<span class="atlas-stat">支线 <b>' + questsDone + '</b>/' + quests + '</span>';
}

function atlasProgressRows(id) {
  var r = REGIONS[id];
  var s = LB.saveState();
  if (!r || !s) return '';
  var rows = [];
  function row(label, done, total) {
    var pct = total ? Math.round(done / total * 100) : 0;
    rows.push('<div class="atlas-prog-row"><span>' + label + '</span>' +
      '<i class="atlas-track"><b style="width:' + pct + '%"></b></i><em>' + done + '/' + total + '</em></div>');
  }
  var chests = r.chests || [];
  row('宝箱', chests.filter(function (c) { return !!LB.flag(c.id); }).length, chests.length);
  var steles = r.steles || [];
  row('碑文', steles.filter(function (st) { return !!(s.steles && s.steles[st.id]); }).length, steles.length);
  var gathers = (r.gathers || []).filter(function (g) { return g.respawn !== 'weather'; });
  row('采集', gathers.filter(function (g) { return !!(s.gathered && s.gathered[g.id]); }).length, gathers.length);
  var questDefs = (typeof SIDE_QUESTS !== 'undefined' ? SIDE_QUESTS : []).filter(function (q) {
    return q.giver && q.giver.region === id;
  });
  var doneIds = {};
  if (typeof LB.sideQuestList === 'function') {
    LB.sideQuestList().forEach(function (q) { if (q.rewarded) doneIds[q.id] = 1; });
  }
  row('支线', questDefs.filter(function (q) { return doneIds[q.id]; }).length, questDefs.length);
  return rows.join('');
}

function atlasInfoHtml(sel, here) {
  var r = REGIONS[sel];
  if (!r) return '';
  var unlocked = LB.regionUnlocked(sel);
  var sv = LB.saveState();
  var visited = !!(sv && sv.visited && sv.visited[sel]);
  var kind = atlasKindOf(sel);
  var kindName = ATLAS_KINDS[kind] ? ATLAS_KINDS[kind].name : '主境';
  var html = '<div class="atlas-info">';
  if (unlocked) {
    html += '<div class="atlas-info-head"><b>' + uiEsc(r.name) + '</b>' +
      '<span class="atlas-kind ' + kind + '">' + kindName + '</span>' +
      (kind === 'hub' ? '' : '<span class="seal-chip">' + uiEsc(uiRegionChapterText(sel)) + '</span>') +
      (sel === here ? '<span class="seal-chip current">当前</span>' : (visited ? '<span class="seal-chip">已踏足</span>' : '')) + '</div>';
    html += '<p class="atlas-sub">' + uiEsc(r.subtitle || '') + '</p>';
    html += '<div class="atlas-prog">' + atlasProgressRows(sel) + '</div>';
    html += '<div class="atlas-actions">';
    if (sel === here) html += '<span class="atlas-note">已在此境。</span>';
    else if (uiTravelAllowed()) html += '<button type="button" class="btn-sm solid" data-map-go="' + uiEsc(sel) + '">前往</button>';
    else html += '<span class="atlas-note">需回山门或归墟渡口方可传送。</span>';
    html += '</div>';
  } else {
    html += '<div class="atlas-info-head"><b>未点亮</b>' +
      '<span class="atlas-kind ' + kind + '">' + kindName + '</span></div>';
    html += '<p class="atlas-sub">' + uiEsc(uiRegionLockText(sel)) + '</p>';
    html += '<p class="atlas-note">图上只显其位，不显其名。</p>';
  }
  html += '</div>';
  return html;
}

function atlasLegendHtml() {
  var planned = Object.keys(WORLD_ATLAS.regions).filter(function (id) { return !REGIONS[id]; }).length;
  return '<div class="atlas-legend">' +
    '<span><i style="background:#d9a527"></i>中枢</span>' +
    '<span><i style="background:#4a7a5c"></i>主线境</span>' +
    '<span><i class="side"></i>支线境</span>' +
    '<span><i class="secret"></i>秘境</span>' +
    '<span><i class="locked"></i>未点亮</span>' +
    (planned ? '<span><i class="planned"></i>未辟之地</span>' : '') +
    '<span><i class="blank"></i>未名之地</span>' +
    '</div>';
}

function renderWorldMap(selected) {
  var s = LB.saveState();
  if (!s) return;
  var here = LB.region();
  var sel = selected && REGIONS[selected] && WORLD_ATLAS.regions[selected] ? selected : here;
  var reduceMotion = !!(s.settings && s.settings.reduceMotion);

  var body = '<div class="atlas-page">' +
    '<div class="atlas-head">' +
    '<div class="atlas-title">九嶂大荒 · 山河全图<small>点地块查看详情 · 传送只往已点亮之处</small></div>' +
    '<div class="atlas-stats">' + atlasStatHtml() + '</div>' +
    '</div>' +
    '<div class="atlas-body">' +
    '<div class="atlas-mapcol">' +
    '<div class="atlas-frame' + (reduceMotion ? ' no-motion' : '') + '">' + atlasBuildSvg(sel, here) + '</div>' +
    atlasLegendHtml() +
    '</div>' +
    '<div class="atlas-sidecol">' + atlasInfoHtml(sel, here) + '</div>' +
    '</div>' +
    '</div>';

  LB.openModal('山河图 · 九嶂', body,
    '<button type="button" class="btn-sm solid" data-map-travel-list="1">传送列表</button>' +
    '<button type="button" class="btn-sm plain" data-close="1">合上</button>');

  uiBind('[data-atlas-node]', 'click', function (node) {
    renderWorldMap(node.getAttribute('data-atlas-node'));
  });
  uiBind('[data-atlas-node]', 'keydown', function (node, e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      renderWorldMap(node.getAttribute('data-atlas-node'));
    }
  });
  uiBind('[data-atlas-planned]', 'click', function () { LB.toast('此地尚在图中 · 待后续开辟'); });
  uiBind('[data-atlas-planned]', 'keydown', function (node, e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      LB.toast('此地尚在图中 · 待后续开辟');
    }
  });
  uiBind('[data-atlas-blank]', 'click', function () { LB.toast('此地方舆未载 · 留待后手'); });
  uiBind('[data-map-go]', 'click', function (node) {
    var id = node.getAttribute('data-map-go');
    LB.closeModal();
    LB.travelTo(id);
  });
  uiBind('[data-map-travel-list]', 'click', function () { LB.openTravel(); });
  uiBindClose();
}

function openMap() {
  if (!uiStateOrToast()) return;
  renderWorldMap(LB.region());
}

// ---------- 设置 ----------
function renderSettings() {
  var s = LB.saveState();
  if (!s) return;
  var settings = s.settings || {};
  var speeds = [['slow', '慢'], ['normal', '中'], ['fast', '快'], ['instant', '瞬']];
  var seg = '<div class="segmented">' + speeds.map(function (pair) {
    return '<button type="button" class="seg-btn' + (settings.textSpeed === pair[0] ? ' active' : '') + '" data-speed="' + pair[0] + '">' + pair[1] + '</button>';
  }).join('') + '</div>';

  function toggleRow(key, label, desc) {
    var on = !!settings[key];
    return '<div class="setting-row"><div class="sheet-main"><b>' + uiEsc(label) + '</b><p class="sheet-note">' + uiEsc(desc) + '</p></div>' +
      '<button type="button" class="toggle' + (on ? ' on' : '') + '" data-toggle="' + key + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
      (on ? '开' : '关') + '</button></div>';
  }

  var body = '<section class="sheet-page">' +
    '<div class="setting-row"><div class="sheet-main"><b>文字速度</b><p class="sheet-note">对白逐字显现的快慢。</p></div>' + seg + '</div>' +
    toggleRow('reduceMotion', '减少动效', '关闭大幅转场与漂浮动画，保留必要反馈。') +
    toggleRow('shake', '震屏', '技能命中与 Boss 换阶段时的镜头轻震。') +
    toggleRow('confirm', '确认提示', '放归等不可逆操作前再问一次。') +
    '<p class="sheet-note">设置写入本地存档，随云存档同步。</p>' +
    '</section>';

  LB.openModal('设置 · 契者之约', body, uiCloseFoot());
  uiBind('[data-speed]', 'click', function (node) {
    var st = LB.saveState();
    if (!st) return;
    st.settings.textSpeed = node.getAttribute('data-speed');
    LB.persist();
    LB.toast('设置已记下');
    renderSettings();
  });
  uiBind('[data-toggle]', 'click', function (node) {
    var st = LB.saveState();
    if (!st) return;
    var key = node.getAttribute('data-toggle');
    st.settings[key] = !st.settings[key];
    LB.persist();
    if (typeof applyMotionPreference === 'function') applyMotionPreference();
    LB.toast('设置已记下');
    renderSettings();
  });
  uiBindClose();
}

function openSettings() {
  if (!uiStateOrToast()) return;
  renderSettings();
}

// ---------- 存档 ----------
function formatTime(ts) {
  if (!ts) return '未落笔';
  try {
    return new Date(ts).toLocaleString('zh-CN', { hour12: false });
  } catch (e) {
    return '未落笔';
  }
}

function renderSave() {
  var s = LB.saveState();
  if (!s) return;
  var r = REGIONS[s.region];
  var ch = MAIN_CHAPTERS[(s.chapter || 1) - 1];
  var bp = LB.bestiaryProgress();
  var sides = LB.sideQuestDoneCount();
  var cloud = window.Cloud;
  var online = !!(cloud && cloud.online);

  var body = '<section class="sheet-page save-panel">' +
    '<ul class="save-list">' +
    '<li>区域<b>' + uiEsc(r ? r.name : '') + '</b></li>' +
    '<li>章节<b>第 ' + s.chapter + ' 章 · ' + uiEsc(ch ? ch.title : '') + '</b></li>' +
    '<li>队伍<b>' + s.team.length + ' 只</b></li>' +
    '<li>图鉴<b>' + bp.seen + '/' + bp.total + '</b></li>' +
    '<li>支线<b>' + sides + '/' + SIDE_QUESTS.length + '</b></li>' +
    '<li>灵玉<b>' + (s.jade || 0) + '</b></li>' +
    '<li>落笔<b>' + uiEsc(formatTime(s.updatedAt)) + '</b></li>' +
    '</ul>' +
    '<p class="sheet-note">云存档：' + (online ? '已连接 · ' + uiEsc(cloud.username || '道号') : '未登录 · 仅本机') + '</p>' +
    '<p class="sheet-note">落笔后会先写本地，再自动同步云端；未登录也可完整游玩。</p>' +
    '</section>';

  LB.openModal('存档 · 落笔为凭', body,
    '<button type="button" class="btn-sm plain" data-open-account="1">打开账号</button>' +
    '<button type="button" class="btn-sm plain" data-open-settings="1">设置</button>' +
    '<button type="button" class="btn-sm plain" data-back-title="1">回标题</button>' +
    '<button type="button" class="btn-sm solid" data-save-now="1">落笔</button>');

  uiBind('[data-save-now]', 'click', function () {
    LB.persist();
    LB.toast('已落笔 · ' + formatTime(LB.saveState().updatedAt));
    renderSave();
  });
  uiBind('[data-open-account]', 'click', function () {
    var chip = $('account-chip');
    if (chip) chip.click();
  });
  uiBind('[data-open-settings]', 'click', function () { openSettings(); });
  uiBind('[data-back-title]', 'click', function () {
    var exit = $('btn-exit');
    if (exit) exit.click();
    else if (LB.backToTitle) LB.backToTitle();
  });
  uiBindClose();
}

function openSave() {
  if (!uiStateOrToast()) return;
  renderSave();
}

// ---------- 试炼 ----------
function renderTrials() {
  var s = LB.saveState();
  if (!s) return;
  var open = !!(s.postgame || LB.flag('boss_wuxiang'));
  if (!open) {
    LB.openModal('山海试炼 · 八层', '<p class="sheet-note">击败无相后开启。</p>', uiCloseFoot());
    uiBindClose();
    return;
  }
  var list = LB.trials();
  var cleared = list.filter(function (t) { return t.cleared; }).length;
  var body = '<div class="sheet-bar">已通关 <b>' + cleared + '</b>/' + list.length + '</div><section class="sheet-page"><div class="sheet-list">';
  list.forEach(function (t, i) {
    var available = t.cleared || i === 0 || LB.trialCleared(t.floor - 1);
    var status = t.cleared ? '<span class="seal-chip">已过</span>' : (available ? '<span class="seal-chip">可挑战</span>' : '<span class="seal-chip muted">未解锁</span>');
    var bossName = t.boss && BOSSES[t.boss.ref] ? BOSSES[t.boss.ref].name : '';
    body += '<div class="sheet-row">' +
      '<div class="sheet-main"><b>' + uiEsc(t.name) + '</b> ' + status +
      '<p>' + uiEsc(t.desc) + '</p>' +
      '<p class="sheet-note">规矩：' + uiEsc(t.rule) + '</p>' +
      '<p class="sheet-note">' + (bossName ? '对手：' + uiEsc(bossName) + (t.boss && t.boss.lv ? ' · Lv.' + t.boss.lv : '') + ' · ' : '') +
      '赏：' + uiEsc(uiRewardText(t.reward)) + '</p>' +
      (available ? '' : '<p class="sheet-note">先过第 ' + (t.floor - 1) + ' 层。</p>') +
      '</div>' +
      (available
        ? '<button type="button" class="btn-sm ' + (t.cleared ? 'plain' : 'solid') + '" data-trial="' + t.floor + '">' + (t.cleared ? '重温' : '开始') + '</button>'
        : '<button type="button" class="btn-sm plain" disabled>未解锁</button>') +
      '</div>';
  });
  body += '</div></section>';
  LB.openModal('山海试炼 · 八层', body, uiCloseFoot());
  uiBind('[data-trial]', 'click', function (node) {
    var floor = Number(node.getAttribute('data-trial')) || 1;
    LB.closeModal();
    LB.startTrial(floor);
  });
  uiBindClose();
}

function openTrials() {
  if (!uiStateOrToast()) return;
  renderTrials();
}

// ---------- 任务 ----------
function mainQuestHtml() {
  var mq = LB.mainQuestState();
  var html = '<div class="quest-block">' +
    '<h4>第 ' + mq.chapter + ' 章 · ' + uiEsc(mq.title) + '</h4>' +
    '<p class="sheet-note">' + uiEsc(mq.summary) + '</p><div class="sheet-list">';
  var activeMarked = false;
  (mq.objectives || []).forEach(function (o) {
    var cls = o.done ? ' done' : (!activeMarked ? ' active' : '');
    if (!o.done && !activeMarked) activeMarked = true;
    html += '<div class="quest-line' + cls + '"><span>' + (o.done ? '✓' : '·') + '</span>' + uiEsc(o.text) + '</div>';
  });
  if (mq.done) html += '<div class="quest-line done"><span>✓</span>' + ((LB.saveState().postgame || LB.flag('boss_wuxiang')) ? '山海试炼已开' : '此章已了') + '</div>';
  html += '</div></div>';
  return html;
}

function sideQuestHtml() {
  var list = LB.sideQuestList();
  var html = '<div class="sheet-list">';
  list.forEach(function (q) {
    var status;
    var action = '';
    if (q.rewarded) status = '<span class="quest-badge">已完成</span>';
    else if (!q.unlocked) {
      status = '<span class="quest-badge">未启</span>';
      action = '<button type="button" class="btn-sm plain" disabled>第 ' + q.unlockChapter + ' 章后可接</button>';
    } else if (!q.accepted) {
      status = '<span class="quest-badge">未接</span>';
      action = '<button type="button" class="btn-sm solid" data-accept-quest="' + uiEsc(q.id) + '">接取</button>';
    } else if (!q.done) {
      status = '<span class="quest-badge">进行中</span>';
      action = '<button type="button" class="btn-sm plain" disabled>尚未达成</button>';
    } else {
      status = '<span class="quest-badge">待领</span>';
      action = '<button type="button" class="btn-sm solid" data-claim-quest="' + uiEsc(q.id) + '">领取</button>';
    }
    html += '<div class="quest-block sheet-card">' +
      '<h4>' + uiEsc(q.title) + ' ' + status + '</h4>' +
      '<p class="sheet-note">' + uiEsc(uiGiverText(q.giver)) + '</p>' +
      '<p>' + uiEsc(q.desc) + '</p>' +
      '<div class="sheet-list">' + (q.stages || []).map(function (step) {
        var cls = step.done ? ' done' : (step.current ? ' active' : '');
        var mark = step.done ? '✓' : (step.current ? '▶' : '·');
        return '<div class="quest-line' + cls + '"><span>' + mark + '</span>' + uiEsc(step.text) + '</div>';
      }).join('') + '</div>' +
      (action ? '<div class="beast-actions">' + action + '</div>' : '') +
      '</div>';
  });
  html += '</div>';
  return html;
}

function choiceTabHtml() {
  var list = LB.choiceList ? LB.choiceList() : [];
  var html = '<div class="sheet-list">';
  list.forEach(function (q) {
    var status = q.done ? '已抉择' : (q.available ? '可抉择' : '未至');
    html += '<div class="quest-block sheet-card">' +
      '<h4>' + uiEsc(q.title) + ' <span class="quest-badge">' + status + '</span></h4>' +
      '<p class="sheet-note">' + uiEsc(q.regionName) + ' · ' + uiEsc(q.npcName) + ' · 第 ' + q.chapter + ' 章</p>' +
      '<p>' + uiEsc(q.prompt) + '</p>';
    if (q.done) {
      html += '<div class="quest-line done"><span>✓</span>' + uiEsc(q.optionLabel) + '</div>' +
        '<p class="sheet-note">' + uiEsc(q.optionResponse) + '</p>';
    } else if (q.available) {
      html += '<p class="sheet-note">前往' + uiEsc(q.regionName) + '，与' + uiEsc(q.npcName) + '交谈即可抉择。</p>';
    } else {
      html += '<p class="sheet-note">' + uiEsc(q.hint) + '</p>';
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function renderQuests(active) {
  var s = LB.saveState();
  if (!s) return;
  var tab = active === 'side' || active === 'bounty' || active === 'choices' ? active : 'main';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'main' ? ' active' : '') + '" data-sheet-tab="main">主线</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'side' ? ' active' : '') + '" data-sheet-tab="side">支线 ' + LB.sideQuestDoneCount() + '/' + SIDE_QUESTS.length + '</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'bounty' ? ' active' : '') + '" data-sheet-tab="bounty">悬赏</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'choices' ? ' active' : '') + '" data-sheet-tab="choices">抉择</button>' +
    '</div>';
  var page;
  if (tab === 'side') page = sideQuestHtml();
  else if (tab === 'bounty') page = bountyRowsHtml();
  else if (tab === 'choices') page = choiceTabHtml();
  else page = mainQuestHtml();
  var stanceBar = '<div class="sheet-bar">倾向 <b>' + uiEsc(LB.stanceSummary ? LB.stanceSummary() : '两难 0') + '</b></div>';

  LB.openModal('任务 · 山海契录', tabs + stanceBar + '<section class="sheet-page">' + page + '</section>',
    '<button type="button" class="btn-sm solid" data-track-main="1">追踪主线</button>' +
    '<button type="button" class="btn-sm plain" data-close="1">合上</button>');

  uiBind('[data-sheet-tab]', 'click', function (node) { renderQuests(node.getAttribute('data-sheet-tab')); });
  uiBind('[data-accept-quest]', 'click', function (node) {
    var id = node.getAttribute('data-accept-quest');
    LB.acceptSideQuest(id);
    LB.persist();
    renderQuests('side');
  });
  uiBind('[data-claim-quest]', 'click', function (node) {
    var id = node.getAttribute('data-claim-quest');
    LB.checkSideQuests();
    var after = null;
    LB.sideQuestList().forEach(function (q) { if (q.id === id) after = q; });
    if (!after || !after.rewarded) LB.toast('尚未达成 · 再走一步');
    renderQuests('side');
  });
  uiBind('[data-track-main]', 'click', function () {
    LB.closeModal();
    var mq = LB.mainQuestState();
    var next = null;
    (mq.objectives || []).forEach(function (o) { if (!next && !o.done) next = o; });
    LB.toast(next ? '追踪 · ' + mq.title + ' · ' + next.text : '主线已了 · ' + ((LB.saveState().postgame || LB.flag('boss_wuxiang')) ? '山海试炼已开' : '此章已了'));
  });
  if (tab === 'bounty') bindBountyActions(function () { renderQuests('bounty'); });
  uiBindClose();
}

function openQuests() {
  if (!uiStateOrToast()) return;
  renderQuests('main');
}
