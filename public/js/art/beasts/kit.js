// 灵兽录 · 灵兽图像注册表与公共绘制辅助
// 依赖 art.js 的 PixelCanvas / shadeHex / mixHex；parts.js 提供 BEAST_BUILDERS。

const BEAST_STYLES = {};

const BEAST_IDLE_DEFAULT = {
  bird: 'hop', crane: 'sway', deer: 'sway', fox: 'sway', badger: 'sway',
  rhino: 'sway', croc: 'crawl', dragon: 'crawl', spirit: 'float',
  mermaid: 'float', clam: 'float',
};

const BEAST_PALETTE_FALLBACK = {
  ink: '#141018', dark: '#2a2a32', base: '#5a5a66', light: '#9a9aa6',
  pale: '#e8e8f0', glow: '#fff3c0', accent: '#e8d8b8',
};

const BEAST_SECTIONS = [
  'body', 'head', 'beak', 'eye', 'wing', 'tail', 'crest', 'legs', 'ears',
  'horns', 'shell', 'neck', 'hair', 'arms', 'pattern', 'tendrils', 'crown',
  'spine', 'fins', 'lure',
];

function pal(ink, dark, base, light, pale, glow, accent) {
  return { ink: ink, dark: dark, base: base, light: light, pale: pale, glow: glow, accent: accent || pale };
}

function normalizeBeastStyle(style) {
  const fam = style.family || 'spirit';
  const def = (typeof FAMILY_DEFAULTS !== 'undefined' && FAMILY_DEFAULTS[fam]) || {};
  const out = Object.assign({}, def, style);
  BEAST_SECTIONS.forEach(function (key) {
    if (def[key] || style[key]) out[key] = Object.assign({}, def[key] || {}, style[key] || {});
  });
  out.palette = Object.assign({}, BEAST_PALETTE_FALLBACK, def.palette || {}, style.palette || {});
  out.pattern = Object.assign({ kind: 'none' }, def.pattern || {}, style.pattern || {});
  out.scale = style.scale != null ? style.scale : (def.scale != null ? def.scale : 1);
  out.idle = style.idle || def.idle || BEAST_IDLE_DEFAULT[fam] || 'sway';
  if (['hop', 'sway', 'float', 'crawl'].indexOf(out.idle) < 0) out.idle = 'sway';
  out.signature = style.signature || def.signature || 'none';
  return out;
}

function registerBeast(id, style) {
  if (!style || !style.family) throw new Error('[灵兽录] 灵兽样式缺少 family：' + id);
  const s = normalizeBeastStyle(style);
  s.id = id;
  s.draw = function (st, evolved) {
    const fn = typeof BEAST_BUILDERS !== 'undefined' ? BEAST_BUILDERS[s.family] : null;
    if (!fn) return new PixelCanvas().svg('灵兽');
    return fn(st || s, !!evolved);
  };
  BEAST_STYLES[id] = s;
  return s;
}

function applyPattern(p, style, fallbackZone) {
  const pat = style.pattern || {};
  const kind = pat.kind || 'none';
  if (kind === 'none') return;
  const c = style.palette;
  const z = pat.zone || fallbackZone || [18, 30, 28, 14];
  const x = Math.round(z[0]);
  const y = Math.round(z[1]);
  const w = Math.max(1, Math.round(z[2]));
  const h = Math.max(1, Math.round(z[3]));
  const at = function (fx, fy, ww, hh, color, op) {
    p.rect(x + Math.round(fx * w), y + Math.round(fy * h), ww, hh, color, op);
  };

  if (kind === 'spots') {
    [[0.12, 0.2], [0.38, 0.55], [0.62, 0.25], [0.78, 0.68], [0.48, 0.82]].forEach(function (s) {
      at(s[0], s[1], 2, 2, c.pale, 0.85);
      at(s[0] + 0.03, s[1] + 0.04, 1, 1, c.light, 0.9);
    });
  } else if (kind === 'stripes') {
    [0.1, 0.3, 0.5, 0.7].forEach(function (fx) {
      at(fx, 0.1, 1, Math.max(3, Math.round(h * 0.7)), c.dark, 0.7);
    });
  } else if (kind === 'scales') {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        at(0.12 + col * 0.2, 0.16 + row * 0.26, 3, 1, row % 2 ? c.light : c.pale, 0.85);
      }
    }
  } else if (kind === 'ink') {
    [[0.05, 0.55, 0.28, 0.2], [0.55, 0.2, 0.3, 0.18], [0.38, 0.72, 0.24, 0.18]].forEach(function (b) {
      at(b[0], b[1], Math.round(b[2] * w), Math.round(b[3] * h), c.ink, 0.55);
    });
  } else if (kind === 'glow') {
    [[0.15, 0.25], [0.42, 0.5], [0.68, 0.2], [0.55, 0.78], [0.82, 0.58], [0.28, 0.68]].forEach(function (s) {
      at(s[0], s[1], 2, 2, c.glow, 0.85);
    });
  } else if (kind === 'mask') {
    at(0.05, 0.35, Math.round(w * 0.9), Math.max(3, Math.round(h * 0.22)), c.pale, 0.9);
  } else if (kind === 'cloud') {
    [[0.08, 0.3, 0.32, 0.12], [0.55, 0.2, 0.3, 0.1], [0.28, 0.62, 0.4, 0.12]].forEach(function (b) {
      at(b[0], b[1], Math.round(b[2] * w), Math.max(2, Math.round(b[3] * h)), c.pale, 0.8);
    });
  } else if (kind === 'star') {
    [[0.12, 0.2], [0.3, 0.55], [0.5, 0.25], [0.68, 0.7], [0.82, 0.35], [0.42, 0.82]].forEach(function (s) {
      at(s[0], s[1], 1, 1, c.glow, 0.95);
      at(s[0] - 0.02, s[1] + 0.03, 1, 1, c.pale, 0.7);
    });
  } else if (kind === 'crack') {
    [[0.2, 0.1, 0.55], [0.5, 0.4, 0.75], [0.35, 0.7, 0.8]].forEach(function (s) {
      at(s[0], s[1], 2, 1, c.glow, 0.95);
      at(s[0] + 0.05, s[1] + 0.1, 1, 2, c.glow, 0.8);
    });
  } else if (kind === 'wave') {
    [0.2, 0.45, 0.7].forEach(function (fy) {
      at(0.05, fy, 0.25, 1, c.light, 0.8);
      at(0.3, fy - 0.03, 0.22, 1, c.pale, 0.8);
      at(0.55, fy + 0.03, 0.28, 1, c.light, 0.8);
    });
  } else if (kind === 'moss') {
    [[0.08, 0.2], [0.3, 0.55], [0.5, 0.3], [0.68, 0.7], [0.82, 0.42]].forEach(function (s) {
      at(s[0], s[1], 3, 2, c.light, 0.85);
      at(s[0] + 0.03, s[1], 1, 1, c.pale, 0.8);
    });
  } else if (kind === 'sand') {
    for (let i = 0; i < 8; i += 1) {
      at((i * 0.13) % 0.9, (i * 0.21) % 0.8, 1, 1, i % 2 ? c.pale : c.light, 0.8);
    }
  } else if (kind === 'frost') {
    [[0.15, 0.2], [0.5, 0.35], [0.8, 0.2], [0.3, 0.7], [0.65, 0.75]].forEach(function (s) {
      p.diamond(x + Math.round(s[0] * w), y + Math.round(s[1] * h), 1, c.pale);
    });
  }
}

function drawSignature(p, style, c) {
  const sig = style.signature;
  if (!sig || sig === 'none') return;
  if (typeof sig === 'function') { sig(p, style, c || style.palette); return; }
  if (typeof SIGNATURES !== 'undefined' && SIGNATURES[sig]) {
    SIGNATURES[sig](p, style, c || style.palette);
  }
}

function validateBeastStyles() {
  const missing = [];
  if (typeof SPECIES === 'undefined') return missing;
  Object.keys(SPECIES).forEach(function (id) {
    const s = BEAST_STYLES[id];
    if (!s || typeof s.draw !== 'function' || !s.family) missing.push(id);
  });
  if (missing.length) console.error('[灵兽录] 缺少灵兽立绘样式：' + missing.join(', '));
  return missing;
}
