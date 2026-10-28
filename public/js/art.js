// 灵兽录 · 图像层工具：像素画布、契印、灵兽 SVG 入口
// 灵兽本体绘制已拆分到 art/beasts/*；本文件只保留共享画布与渲染入口。

const PIXEL_ELEMENT = {
  wood: { dark: '#14301b', base: '#3f8a4a', light: '#68c46a', pale: '#b8e88a', glow: '#dcff9a' },
  fire: { dark: '#3d0f0c', base: '#d04426', light: '#f2812f', pale: '#ffcf5c', glow: '#fff0a6' },
  earth: { dark: '#2c1d12', base: '#96663a', light: '#d2a260', pale: '#f4d9a2', glow: '#ffe7b0' },
  metal: { dark: '#1c232e', base: '#637a90', light: '#b2c8d8', pale: '#ecf8ff', glow: '#ffffff' },
  water: { dark: '#0d2738', base: '#2f7c9e', light: '#68c8de', pale: '#d0f4ff', glow: '#e8fdff' },
};

function PixelCanvas(size) {
  this.size = size || 64;
  this.parts = [];
}
PixelCanvas.prototype.rect = function (x, y, w, h, fill, opacity) {
  // 全部先取整再校验：亚像素宽度会被 Math.round 压成 0，产生非法 <rect width="0">
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);
  if (w <= 0 || h <= 0) return this;
  if (opacity == null || opacity >= 0.5) {
    const bb = this.bb || (this.bb = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
    bb.x0 = Math.min(bb.x0, x);
    bb.y0 = Math.min(bb.y0, y);
    bb.x1 = Math.max(bb.x1, x + w);
    bb.y1 = Math.max(bb.y1, y + h);
  }
  this.parts.push('<rect x="' + x + '" y="' + y + '" width="' + w +
    '" height="' + h + '" fill="' + fill + '"' + (opacity != null ? ' opacity="' + opacity + '"' : '') + '/>');
  return this;
};
PixelCanvas.prototype.px = function (x, y, fill) { return this.rect(x, y, 1, 1, fill); };
PixelCanvas.prototype.blob = function (cx, cy, rx, ry, fill, opacity) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    const dy = (y + 0.5 - cy) / ry;
    if (Math.abs(dy) > 1) continue;
    const half = rx * Math.sqrt(1 - dy * dy);
    const x0 = Math.round(cx - half);
    const x1 = Math.round(cx + half);
    // 圆钝到只剩不到 1px 时补 1px，避免 width="0" 的非法 rect（细尾/角/鳍常见）
    this.rect(x0, y, Math.max(1, x1 - x0), 1, fill, opacity);
  }
  return this;
};
PixelCanvas.prototype.outlineBlob = function (cx, cy, rx, ry, fill, outline) {
  this.blob(cx, cy, rx + 1.5, ry + 1.5, outline);
  this.blob(cx, cy, rx, ry, fill);
  return this;
};
PixelCanvas.prototype.outlineRect = function (x, y, w, h, fill, outline) {
  this.rect(x - 1, y - 1, w + 2, h + 2, outline);
  this.rect(x, y, w, h, fill);
  return this;
};
PixelCanvas.prototype.shadow = function (cx, cy, rx) {
  this.blob(cx, cy, rx, 2.6, '#070a12', 0.32);
  this.blob(cx, cy - 2, rx * 0.66, 1.6, '#070a12', 0.18);
  return this;
};
PixelCanvas.prototype.socket = function (x, y, white, pupil) {
  // 眼窝外沿 + 亮眼白 + 前侧瞳仁 + 上眼睑高光，44 像素下也能读成「有神的眼睛」
  this.rect(x - 1, y - 1, 6, 5, '#0b0d12');
  this.rect(x, y, 4, 3, white || '#f7f2df');
  this.rect(x + 2, y, 2, 2, pupil || '#10131a');
  this.px(x + 1, y, '#ffffff');
  this.px(x + 3, y + 2, mixHex(pupil || '#10131a', white || '#f7f2df', 0.5));
  return this;
};
PixelCanvas.prototype.gem = function (x, y, color) {
  this.rect(x - 1, y - 2, 2, 1, color);
  this.rect(x - 2, y - 1, 4, 2, color);
  this.rect(x - 1, y + 1, 2, 1, color);
  this.rect(x, y - 1, 1, 1, '#ffffff');
  return this;
};
PixelCanvas.prototype.line = function (x0, y0, x1, y1, fill) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const ex = Math.round(x1);
  const ey = Math.round(y1);
  const dx = Math.abs(ex - x);
  const sx = x < ex ? 1 : -1;
  const dy = -Math.abs(ey - y);
  const sy = y < ey ? 1 : -1;
  let err = dx + dy;
  for (let guard = 0; guard < 256; guard += 1) {
    this.px(x, y, fill);
    if (x === ex && y === ey) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
  return this;
};
PixelCanvas.prototype.diamond = function (cx, cy, r, fill) {
  for (let y = -r; y <= r; y += 1) {
    const w = r - Math.abs(y);
    this.rect(cx - w, cy + y, w * 2 + 1, 1, fill);
  }
  return this;
};
PixelCanvas.prototype.svg = function (label, scale) {
  const s = scale && Math.abs(scale - 1) > 0.001 ? Number(scale) : 1;
  const body = this.parts.join('');
  const inner = s === 1 ? body
    : '<g transform="translate(32 64) scale(' + s.toFixed(3) + ') translate(-32 -64)">' + body + '</g>';
  let bbox = '';
  if (this.bb && this.bb.x1 > this.bb.x0) {
    const f = function (v, o) { return (o + (v - o) * s).toFixed(1); };
    bbox = ' data-bbox="' + [f(this.bb.x0, 32), f(this.bb.y0, 64), f(this.bb.x1, 32), f(this.bb.y1, 64)].join(' ') + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" overflow="visible" shape-rendering="crispEdges" role="img" aria-label="' +
    label + '"' + bbox + '>' + inner + '</svg>';
};

function elementPalette(el) { return PIXEL_ELEMENT[el] || PIXEL_ELEMENT.wood; }

function artHash(str) {
  let h = 2166136261;
  const s = String(str || '');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shadeHex(hex, factor) {
  const h = String(hex || '#000000').replace('#', '');
  const n = parseInt(h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h, 16);
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((n & 255) * factor)));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function mixHex(a, b, t) {
  const pa = parseInt(String(a).replace('#', ''), 16);
  const pb = parseInt(String(b).replace('#', ''), 16);
  const f = Math.max(0, Math.min(1, t == null ? 0.5 : t));
  const r = Math.round(((pa >> 16) & 255) * (1 - f) + ((pb >> 16) & 255) * f);
  const g = Math.round(((pa >> 8) & 255) * (1 - f) + ((pb >> 8) & 255) * f);
  const bl = Math.round((pa & 255) * (1 - f) + (pb & 255) * f);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

const BEAST_SVG_CACHE = {};
const BEAST_URL_CACHE = {};

// 把立绘视口收紧到真实包围盒并补成正方形（地面对齐底边），避免尾巴/角冲出容器。
// big（战斗/详情）：只在溢出 64×64 时才放大视口，保持物种之间的相对体型。
// small（卡片图标）：紧贴包围盒，让立绘占满图标框。
function fitBeastViewBox(svg, big) {
  const m = /data-bbox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(svg);
  if (!m) return svg;
  let x0 = +m[1] - 1;
  let y0 = +m[2] - 1;
  let x1 = +m[3] + 1;
  let y1 = +m[4] + 3; // 给地面投影留 3px
  if (big) {
    x0 = Math.min(x0, 0); y0 = Math.min(y0, 0);
    x1 = Math.max(x1, 64); y1 = Math.max(y1, 64);
  }
  const side = Math.max(x1 - x0, y1 - y0);
  const vx = (x0 + x1) / 2 - side / 2;
  const vy = y1 - side;
  return svg.replace('viewBox="0 0 64 64"',
    'viewBox="' + vx.toFixed(1) + ' ' + vy.toFixed(1) + ' ' + side.toFixed(1) + ' ' + side.toFixed(1) + '"');
}

// 62 只灵兽共 1.3 万个 <rect>，内联会让图鉴 DOM 暴涨；转成 Blob URL 的 <img>，每只只占 1 个节点。
function beastImgUrl(key, svg) {
  if (BEAST_URL_CACHE[key]) return BEAST_URL_CACHE[key];
  if (typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) return null;
  BEAST_URL_CACHE[key] = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  return BEAST_URL_CACHE[key];
}

function beastSvg(spId, bigger) {
  const sp = typeof SPECIES !== 'undefined' ? SPECIES[spId] : null;
  const styles = typeof BEAST_STYLES !== 'undefined' ? BEAST_STYLES : null;
  const style = styles ? (styles[spId] || styles.__fallback) : null;
  const el = sp ? sp.el : 'wood';
  if (!style) {
    return '<div class="beast-svg el-' + el + (bigger ? ' big' : '') + '">' +
      '<span class="beast-unknown">?</span></div>';
  }
  const key = spId + '|' + (bigger ? 'big' : 'small');
  if (!BEAST_SVG_CACHE[key]) {
    BEAST_SVG_CACHE[key] = fitBeastViewBox(style.draw(style, !!(sp && sp.evolved)), !!bigger);
  }
  const svg = BEAST_SVG_CACHE[key];
  const url = beastImgUrl(key, svg);
  const body = url
    ? '<img class="beast-img" alt="' + (sp ? sp.name : '灵兽') + '" draggable="false" src="' + url + '">'
    : svg;
  return '<div class="beast-svg el-' + el + (bigger ? ' big' : '') +
    (sp && sp.evolved ? ' evolved' : '') + ' idle-' + (style.idle || 'sway') +
    '" data-beast="' + spId + '">' +
    (sp && sp.evolved ? '<span class="evo-aura" aria-hidden="true"></span>' : '') +
    body + '</div>';
}

function sealSvg(name, el) {
  const ch = (name || '灵').slice(0, 1);
  const c = elementPalette(el);
  return '<svg viewBox="0 0 64 64" shape-rendering="crispEdges" aria-hidden="true">' +
    '<path d="M12 4 H52 V8 H56 V12 H60 V52 H56 V56 H52 V60 H12 V56 H8 V52 H4 V12 H8 V8 H12 Z" fill="' + c.dark + '"/>' +
    '<path d="M14 8 H50 V12 H54 V14 H58 V50 H54 V52 H50 V56 H14 V52 H10 V50 H6 V14 H10 V12 H14 Z" fill="#f4e9c8"/>' +
    '<path d="M18 12 H46 V16 H50 V18 H52 V46 H48 V48 H46 V52 H18 V48 H14 V46 H12 V18 H16 V16 H18 Z" fill="' + c.base + '"/>' +
    '<rect x="18" y="18" width="28" height="28" fill="' + c.dark + '"/>' +
    '<text x="32" y="40" text-anchor="middle" font-size="25" fill="#fff6d6" font-family="Zpix, Microsoft YaHei, monospace">' + ch + '</text>' +
    '</svg>';
}
