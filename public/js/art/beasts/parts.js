// 灵兽录 · 灵兽部件构建器
// 每个构建器读取 style 的数值/枚举，只负责解剖结构；物种差异由 style + pattern + signature 叠加。

const FAMILY_DEFAULTS = {
  bird: {
    body: { x: 30, y: 38, w: 22, h: 20 },
    head: { x: 44, y: 21, w: 16, h: 15 },
    beak: { len: 9, curve: 0, width: 3, color: '#8a6a2a' },
    eye: { x: 47, y: 21 },
    wing: { kind: 'feather', span: 30, rows: 4, droop: 1 },
    tail: { kind: 'fan', len: 13, count: 3, spread: 1 },
    crest: { kind: 'single', len: 9 },
    ears: { kind: 'none', size: 4 },
    legs: { len: 8, thick: 2, count: 2 },
    pattern: { kind: 'none', zone: [19, 30, 22, 12] },
    scale: 0.98,
  },
  crane: {
    body: { x: 30, y: 38, w: 18, h: 16 },
    head: { x: 46, y: 13, w: 12, h: 10 },
    neck: { x: 40, y: 20, w: 4, h: 20, curve: 1 },
    beak: { len: 10, curve: 1, width: 2, color: '#c8a25a' },
    eye: { x: 49, y: 12 },
    wing: { kind: 'feather', span: 24, rows: 3, droop: 1 },
    tail: { kind: 'plume', len: 15, count: 3, spread: 1 },
    crest: { kind: 'crown', len: 5 },
    legs: { len: 16, thick: 1, count: 2 },
    pattern: { kind: 'none', zone: [20, 33, 20, 10] },
    scale: 1,
  },
  deer: {
    body: { x: 30, y: 38, w: 26, h: 18 },
    head: { x: 46, y: 19, w: 14, h: 12 },
    neck: { x: 39, y: 25, w: 7, h: 15 },
    ears: { kind: 'long', size: 5 },
    horns: { kind: 'branch', len: 12, count: 2 },
    tail: { kind: 'bushy', len: 6, count: 1 },
    legs: { len: 13, thick: 2, count: 4 },
    pattern: { kind: 'spots', zone: [19, 31, 24, 10] },
    scale: 1,
  },
  fox: {
    body: { x: 28, y: 42, w: 24, h: 16 },
    head: { x: 44, y: 28, w: 16, h: 13 },
    ears: { kind: 'point', size: 8 },
    tail: { kind: 'flame', len: 18, count: 1, spread: 1 },
    legs: { len: 10, thick: 2, count: 3 },
    pattern: { kind: 'none', zone: [18, 36, 20, 10] },
    scale: 1,
  },
  badger: {
    body: { x: 28, y: 43, w: 28, h: 14 },
    head: { x: 44, y: 36, w: 14, h: 12 },
    ears: { kind: 'round', size: 4 },
    tail: { kind: 'ember', len: 12, count: 1 },
    legs: { len: 8, thick: 3, count: 3 },
    pattern: { kind: 'mask', zone: [14, 34, 22, 12] },
    scale: 1,
  },
  rhino: {
    body: { x: 30, y: 40, w: 34, h: 18 },
    head: { x: 47, y: 35, w: 14, h: 11 },
    ears: { kind: 'round', size: 4 },
    horns: { kind: 'single', len: 10, count: 1 },
    tail: { kind: 'thin', len: 7, count: 1 },
    legs: { len: 12, thick: 5, count: 4 },
    pattern: { kind: 'none', zone: [14, 31, 30, 12] },
    scale: 1.02,
  },
  croc: {
    body: { x: 28, y: 42, w: 34, h: 14 },
    head: { x: 46, y: 40, w: 12, h: 9 },
    snout: { len: 12, width: 5 },
    tail: { kind: 'thick', len: 16, count: 1 },
    horns: { kind: 'ridge', len: 5, count: 4 },
    legs: { len: 7, thick: 3, count: 4 },
    pattern: { kind: 'scales', zone: [12, 34, 34, 10] },
    scale: 1,
  },
  dragon: {
    body: { x: 30, y: 38, w: 16, h: 14 },
    head: { x: 46, y: 24, w: 15, h: 12 },
    neck: { x: 38, y: 28, w: 8, h: 12 },
    horns: { kind: 'branch', len: 9, count: 2 },
    tail: { kind: 'fin', len: 16, count: 1 },
    legs: { len: 7, thick: 2, count: 2 },
    pattern: { kind: 'scales', zone: [16, 30, 28, 14] },
    scale: 1,
  },
  spirit: {
    body: { x: 32, y: 36, w: 22, h: 24 },
    head: { x: 32, y: 21, w: 16, h: 14 },
    horns: { kind: 'branch', len: 10, count: 2 },
    arms: { show: false, pose: 0 },
    tendrils: { count: 4, len: 8 },
    pattern: { kind: 'moss', zone: [24, 28, 18, 16] },
    eyes: { mode: 'two' },
    shape: 'orb',
    scale: 1,
  },
  mermaid: {
    body: { x: 32, y: 30, w: 13, h: 16 },
    head: { x: 32, y: 14, w: 14, h: 12 },
    tail: { kind: 'fish', len: 24, fin: 14 },
    hair: { len: 12, style: 'long' },
    arms: { show: true, pose: 1 },
    crown: { kind: 'none' },
    pattern: { kind: 'scales', zone: [26, 36, 12, 14] },
    scale: 1,
  },
  clam: {
    body: { x: 32, y: 40, w: 36, h: 16 },
    head: { x: 32, y: 33, w: 14, h: 10 },
    shell: { kind: 'clam', layers: 2 },
    pattern: { kind: 'none', zone: [14, 20, 36, 26] },
    scale: 1,
  },
};

// 头颈接驳：头没有贴住身体的物种，用一段渐细的颈把头和身体连起来；
// 已有 style.neck 的物种保留自己的颈柱。
function beastNeck(p, style, c) {
  if (style.neck) return;
  const b = style.body;
  const h = style.head;
  const dx = h.x - b.x;
  const dy = h.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(3, Math.round(dist));
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = b.x + dx * t;
    const y = b.y + dy * t;
    const r = 2.6 - t * 0.6;
    p.rect(Math.round(x - r), Math.round(y - 1), Math.round(r * 2), 3, c.base);
    p.rect(Math.round(x - r), Math.round(y - 1), 1, 1, c.light);
    p.px(Math.round(x + r - 1), Math.round(y + 1), c.dark);
    p.px(Math.round(x - r), Math.round(y + 1), c.dark);
  }
}

function beastShadow(p, style) {
  const b = style.body;
  p.shadow(b.x, 58, Math.max(10, b.w * 0.72));
  if (style.palette) beastNeck(p, style, style.palette);
}

function beastEye(p, style, c, x, y) {
  p.socket(x, y, c.pale, c.ink);
  const e = style.eye || {};
  if (e.glow) p.px(x + 2, y + 2, c.glow);
  if (e.mode === 'many') {
    p.px(x - 3, y + 2, c.pale);
    p.px(x + 6, y + 1, c.pale);
  }
}

function beastFeet(p, x, y, w, c) {
  p.rect(x, y, w, 2, c.dark);
  p.rect(x, y + 2, w - 1, 1, mixHex(c.dark, '#000000', 0.35), 0.6);
  p.px(x, y + 1, c.base);
  p.px(x + w - 1, y + 1, c.base);
  p.rect(x + 1, y + 1, 1, 1, c.light, 0.55);
}

function drawLegs(p, style, c) {
  const b = style.body;
  const l = style.legs || {};
  const count = l.count || 2;
  const thick = l.thick || 2;
  const len = l.len || 8;
  const xs = count === 4
    ? [b.x - Math.round(b.w * 0.34), b.x - Math.round(b.w * 0.12), b.x + Math.round(b.w * 0.12), b.x + Math.round(b.w * 0.34)]
    : [b.x - 6, b.x + 5];
  xs.forEach(function (x) {
    const top = b.y + Math.round(b.h / 2) - 2;
    p.outlineRect(x, top, thick, len, l.color || c.base, c.dark);
    // 膝节 + 胫前高光，避免腿是一根纯色竖条
    const knee = top + Math.max(2, Math.round(len * 0.5));
    p.rect(x + 1, knee, Math.max(1, thick - 1), 1, c.light, 0.75);
    p.rect(x, top + 1, 1, 1, c.light, 0.55);
    beastFeet(p, x - 1, top + len, thick + 3, c);
  });
}

function drawAntlers(p, style, c) {
  const h = style.head;
  const horn = style.horns || {};
  const kind = horn.kind || 'none';
  if (kind === 'none') return;
  const len = horn.len || 10;
  const hx = h.x;
  const hy = h.y - Math.round(h.h / 2);
  const color = horn.color || c.pale;

  if (kind === 'branch' || kind === 'vine') {
    // 左右两根主枝，再各分两叉
    [-1, 1].forEach(function (side) {
      const bx = hx + side * 4;
      p.line(bx, hy, bx + side * 5, hy - len, c.dark);
      p.line(bx + side, hy, bx + side * 5, hy - len, color);
      p.line(bx + side * 2, hy - Math.round(len * 0.45), bx + side * 8, hy - Math.round(len * 0.65), c.dark);
      p.line(bx + side * 2, hy - Math.round(len * 0.45), bx + side * 8, hy - Math.round(len * 0.65), color);
      p.line(bx + side * 3, hy - Math.round(len * 0.75), bx + side * 7, hy - len - 2, c.dark);
    });
    if (kind === 'vine') {
      [[-9, -1], [-3, -6], [3, -4], [8, -2]].forEach(function (leaf) {
        p.rect(hx + leaf[0], hy + leaf[1], 2, 2, c.light);
      });
    }
  } else if (kind === 'coral') {
    [-1, 1].forEach(function (side) {
      const bx = hx + side * 4;
      p.line(bx, hy, bx + side * 6, hy - len, c.dark);
      p.line(bx + side * 2, hy - 4, bx + side * 8, hy - 7, c.dark);
      p.blob(bx + side * 6, hy - len, 2.5, 2.5, color);
      p.blob(bx + side * 8, hy - 7, 2, 2, c.light);
    });
  } else if (kind === 'crown') {
    const n = horn.count || 3;
    for (let i = 0; i < n; i += 1) {
      const x = hx - 6 + i * 4;
      p.rect(x, hy - len, 2, len, c.dark);
      p.rect(x, hy - len, 2, 2, color);
      p.px(x, hy - len - 1, c.glow);
    }
  } else if (kind === 'single') {
    p.rect(hx + 2, hy - len, 4, len, c.dark);
    p.rect(hx + 3, hy - len + 1, 2, len - 2, color);
    p.px(hx + 3, hy - len, c.pale);
  } else if (kind === 'double') {
    [-4, 4].forEach(function (side) {
      p.rect(hx + side, hy - len, 3, len, c.dark);
      p.rect(hx + side + 1, hy - len + 1, 1, len - 2, color);
    });
  } else if (kind === 'ridge') {
    const n = horn.count || 4;
    for (let i = 0; i < n; i += 1) {
      const x = hx - 10 + i * 6;
      p.rect(x, hy - len + (i % 2), 3, len, c.dark);
      p.rect(x + 1, hy - len + 1 + (i % 2), 1, len - 2, color);
    }
  } else if (kind === 'ninePeaks') {
    for (let i = 0; i < 9; i += 1) {
      const x = hx - 22 + i * 5;
      const hh = len - Math.abs(i - 4) * 2;
      p.rect(x, hy - hh, 3, hh, c.dark);
      p.rect(x + 1, hy - hh + 1, 1, Math.max(2, hh - 2), color);
    }
  }
}

function drawFeatherWing(p, style, c, far) {
  const w = style.wing || {};
  if (!w.kind || w.kind === 'none') return;
  const b = style.body;
  // 翼展收在体宽以内：旧版 span 36–40 会把包围盒撑宽，fitBeastViewBox 反而把整只灵兽缩小
  const span = w.kind === 'folded'
    ? Math.min(w.span || 28, Math.round(b.w * 1.1))
    : Math.min(w.span || 28, Math.round(b.w * 0.9));
  const rows = w.rows || 4;
  const baseX = b.x - Math.round(b.w * 0.45) + (far ? 3 : 0);
  const baseY = b.y - Math.round(b.h * 0.42) + (far ? -2 : 0);
  const dark = far ? c.dark : c.dark;
  const mid = far ? c.base : c.base;
  const lite = far ? c.light : c.light;

  if (w.kind === 'folded') {
    // 收翼：贴着身侧的圆润翼面 + 向后下垂的羽尖，只画近侧
    if (far) return;
    const rx = Math.max(5, Math.round(span * 0.38));
    const ry = Math.max(4, Math.round(b.h * 0.34));
    const cx = b.x - 2;
    const cy = b.y - 1;
    for (let i = 0; i < rows; i += 1) {
      p.rect(cx - rx - 4 + i, cy + 1 + i * 3, 7 - i, 2, c.dark);
      p.rect(cx - rx - 3 + i, cy + 1 + i * 3, 5 - i, 1, i % 2 ? c.light : c.base);
    }
    p.outlineBlob(cx, cy, rx, ry, c.base, c.dark);
    p.blob(cx - 1, cy - 2, rx - 3, Math.max(2, ry - 3), c.light);
    p.rect(cx - 3, cy, 7, 1, c.pale);
    p.rect(cx - 2, cy + 2, 5, 1, c.pale, 0.8);
    return;
  }

  if (w.kind === 'feather') {
    for (let i = 0; i < rows; i += 1) {
      const len = span - i * 4;
      const y = baseY + i * 4;
      const x = baseX - len;
      p.rect(x, y, len, 4, dark);
      p.rect(x + 1, y, Math.max(2, len - 2), 2, i % 2 ? lite : mid);
      p.rect(x + len - 7, y + 2, 6, 2, far ? mid : c.pale);
      // 羽排分界：一条低透明度墨线，让叠羽有层次
      p.rect(x, y + 3, len, 1, c.ink, 0.3);
      // 羽尖收窄 1px，避免每根羽毛都是齐头方块
      p.rect(x - 1, y + 1, 1, 1, far ? mid : c.pale, 0.75);
    }
  } else if (w.kind === 'pointed') {
    for (let i = 0; i < rows; i += 1) {
      const len = span - i * 3;
      const y = baseY + i * 3;
      p.rect(baseX - len, y, len, 2, dark);
      p.rect(baseX - len + 1, y, len - 2, 1, lite);
      p.rect(baseX - len, y + 1, len, 1, c.ink, 0.35);
      p.rect(baseX - len - 2, y + 1, 2, 1, far ? mid : c.pale, 0.9);
    }
    p.rect(baseX - span - 2, baseY - 2, 4, 3, c.pale);
  } else if (w.kind === 'round') {
    p.blob(baseX - Math.round(span * 0.35), baseY + 5, Math.round(span * 0.35), 6, dark);
    p.blob(baseX - Math.round(span * 0.35), baseY + 4, Math.round(span * 0.3), 4, mid);
    p.blob(baseX - Math.round(span * 0.4), baseY + 3, Math.round(span * 0.2), 2, lite);
  } else if (w.kind === 'skeletal') {
    for (let i = 0; i < 3; i += 1) {
      const y = baseY + i * 5;
      p.line(baseX - span + i * 2, y, baseX, y + 3, c.pale);
      p.line(baseX - span + 4 + i * 2, y - 2, baseX - span + 4 + i * 2, y + 5, c.light);
    }
  } else if (w.kind === 'storm') {
    for (let i = 0; i < rows; i += 1) {
      const y = baseY + i * 4;
      p.line(baseX - span + i * 2, y, baseX - 4, y + 1, c.glow);
      p.line(baseX - span + 4 + i * 2, y - 2, baseX - 2, y - 1, c.pale);
    }
  }
}

/* ---------------- bird ---------------- */

function drawBird(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 尾羽
  const t = style.tail || {};
  if (t.kind && t.kind !== 'none') {
    if (t.kind === 'fan') {
      const n = t.count || 3;
      for (let i = 0; i < n; i += 1) {
        const len = (t.len || 13) - i * 3;
        const y = b.y - 3 + i * 3;
        const x = b.x - Math.round(b.w / 2) + 1 - len;
        p.rect(x, y, len, 3, c.dark);
        p.rect(x + 1, y, Math.max(2, len - 2), 1, i % 2 ? c.light : c.base);
      }
    } else if (t.kind === 'flame') {
      const cx = b.x - Math.round(b.w / 2) - 2;
      const cy = b.y + 1;
      [[5, 3, c.dark], [8, 4, c.base], [10, 3, c.light], [7, 2, c.glow]].forEach(function (f, i) {
        p.blob(cx - i * 3, cy - i * 2, f[0], f[1], f[2]);
      });
    } else if (t.kind === 'comet') {
      const x0 = b.x - Math.round(b.w / 2);
      p.line(x0, b.y, x0 - (t.len || 14), b.y - 4, c.light);
      p.line(x0, b.y + 1, x0 - (t.len || 14) + 2, b.y - 3, c.pale);
      p.blob(x0 - (t.len || 14), b.y - 4, 3, 3, c.glow);
    } else if (t.kind === 'fork') {
      const x0 = b.x - Math.round(b.w / 2);
      p.rect(x0 - 12, b.y - 2, 12, 2, c.dark);
      p.rect(x0 - 18, b.y - 8, 8, 2, c.dark);
      p.rect(x0 - 18, b.y + 2, 8, 2, c.dark);
      p.rect(x0 - 17, b.y - 8, 6, 1, c.light);
      p.rect(x0 - 17, b.y + 2, 6, 1, c.light);
    } else if (t.kind === 'plume') {
      const n = t.count || 3;
      for (let i = 0; i < n; i += 1) {
        const len = (t.len || 15) - i * 2;
        const x = b.x - Math.round(b.w / 2) - len;
        p.line(x, b.y + i * 2, x + len, b.y - 2 + i * 3, i % 2 ? c.light : c.pale);
        p.rect(x, b.y + i * 2, 3, 2, c.dark);
      }
    }
  }

  // 远侧翼
  drawFeatherWing(p, style, c, true);

  // 颈（可选）：先画颈，再让身体与头部压住两端，避免头部悬空
  const nk = style.neck;
  if (nk) {
    const nx = nk.x;
    const ny = nk.y;
    const nw = nk.w || 4;
    const nh = nk.h || 6;
    p.rect(nx, ny, nw, nh, c.dark);
    p.rect(nx + 1, ny, Math.max(1, nw - 2), nh, c.base);
    p.rect(nx + 1, ny, 1, nh, c.light);
    p.rect(nx + nw - 2, ny, 1, nh, c.dark);
  }

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 3, b.h / 3, c.light);
  p.rect(b.x - Math.round(b.w * 0.28), b.y + Math.round(b.h * 0.22), Math.round(b.w * 0.5), 3, c.pale, 0.9);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 3, b.w - 6, b.h - 4]);

  // 近侧翼
  drawFeatherWing(p, style, c, false);
  drawLegs(p, style, c);

  // 头
  if (style.ears && style.ears.kind === 'tuft') {
    p.outlineRect(h.x - 5, h.y - Math.round(h.h / 2) - 4, 3, 5, c.base, c.dark);
    p.outlineRect(h.x + 3, h.y - Math.round(h.h / 2) - 4, 3, 5, c.base, c.dark);
  }
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.blob(h.x - 1, h.y - 2, h.w / 2 - 3, h.h / 3, c.light);
  p.rect(h.x - Math.round(h.w * 0.3), h.y - Math.round(h.h * 0.35), Math.round(h.w * 0.55), 2, c.pale, 0.85);

  // 喙
  const bk = style.beak || {};
  const bx = h.x + Math.round(h.w / 2) - 1;
  const by = h.y + Math.round(h.h * 0.12);
  p.rect(bx, by, bk.len || 8, bk.width || 3, c.dark);
  p.rect(bx + 1, by + 1, (bk.len || 8) - 1, Math.max(1, (bk.width || 3) - 1), bk.color || c.dark);
  if (bk.curve) p.rect(bx + (bk.len || 8) - 1, by + (bk.curve > 0 ? 2 : -1), 3, 2, c.dark);

  // 眼
  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || (h.y - 1));

  // 冠羽
  const cr = style.crest || {};
  if (cr.kind && cr.kind !== 'none') {
    const color = cr.color || c.light;
    const cx = h.x - Math.round(h.w * 0.25);
    const cy = h.y - Math.round(h.h / 2) - 1;
    const len = cr.len || 8;
    if (cr.kind === 'single') {
      p.outlineRect(cx, cy - len, 3, len, color, c.dark);
      p.rect(cx + 1, cy - len + 1, 1, len - 2, c.pale);
    } else if (cr.kind === 'double') {
      p.outlineRect(cx - 2, cy - len, 3, len, color, c.dark);
      p.outlineRect(cx + 3, cy - len + 2, 3, len - 2, color, c.dark);
    } else if (cr.kind === 'lightning') {
      p.line(cx, cy, cx + 2, cy - 4, c.glow);
      p.line(cx + 2, cy - 4, cx, cy - 7, c.pale);
      p.line(cx, cy - 7, cx + 3, cy - 10, c.glow);
    } else if (cr.kind === 'crown') {
      for (let i = 0; i < 3; i += 1) {
        p.rect(cx - 3 + i * 4, cy - len + (i === 1 ? -2 : 0), 2, len, c.dark);
        p.px(cx - 3 + i * 4, cy - len + (i === 1 ? -2 : 0), color);
      }
    } else if (cr.kind === 'bone') {
      p.rect(cx - 2, cy - len, 2, len, c.pale);
      p.rect(cx + 3, cy - len + 2, 2, len - 2, c.pale);
    }
  }

  // 进化：额外翼尖与胸晶
  if (evolved) {
    p.rect(b.x - 2, b.y - 1, 4, 3, c.glow);
    p.px(b.x - 1, b.y - 2, c.pale);
    p.rect(b.x - Math.round(b.w / 2) - 2, b.y - 6, 3, 2, c.glow, 0.9);
    p.rect(b.x + Math.round(b.w / 2) - 1, b.y - 6, 3, 2, c.glow, 0.9);
  }

  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- crane ---------------- */

function drawCrane(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  const n = style.neck || {};
  beastShadow(p, style);

  // 尾羽
  const t = style.tail || {};
  if (t.kind === 'plume') {
    const count = t.count || 3;
    for (let i = 0; i < count; i += 1) {
      const len = (t.len || 15) - i * 2;
      const x = b.x - Math.round(b.w / 2) - len + 3;
      p.line(x, b.y + 2 + i * 2, x + len, b.y - 3 + i * 2, i % 2 ? c.light : c.base);
      p.rect(x, b.y + 2 + i * 2, 3, 2, c.dark);
    }
  } else if (t.kind && t.kind !== 'none') {
    p.outlineRect(b.x - Math.round(b.w / 2) - 10, b.y - 2, 10, 4, c.base, c.dark);
  }

  drawFeatherWing(p, style, c, true);

  // 长腿
  const l = style.legs || {};
  const legLen = l.len || 16;
  [b.x - 5, b.x + 6].forEach(function (x) {
    p.outlineRect(x, b.y + Math.round(b.h / 2) - 2, 1, legLen, c.base, c.dark);
    p.rect(x - 2, b.y + Math.round(b.h / 2) - 2 + legLen, 5, 1, c.dark);
  });

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 3, b.h / 3, c.light);
  p.rect(b.x - Math.round(b.w * 0.3), b.y + Math.round(b.h * 0.25), Math.round(b.w * 0.55), 2, c.pale, 0.9);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 3, b.w - 6, b.h - 4]);
  drawFeatherWing(p, style, c, false);

  // 颈
  const nx = n.x || (b.x + 8);
  const ny = n.y || (b.y - Math.round(b.h / 2) - 2);
  const nh = n.h || 18;
  p.outlineRect(nx, ny, n.w || 4, nh, c.base, c.dark);
  p.rect(nx + 1, ny + 1, Math.max(1, (n.w || 4) - 2), nh - 2, c.light);
  if (n.curve) {
    p.rect(nx - 2, ny + Math.round(nh * 0.55), (n.w || 4), 2, c.base);
  }

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.rect(h.x - Math.round(h.w * 0.3), h.y - Math.round(h.h * 0.35), Math.round(h.w * 0.6), 2, c.light, 0.9);

  // 长喙
  const bk = style.beak || {};
  const bx = h.x + Math.round(h.w / 2) - 1;
  const by = h.y + 1;
  p.rect(bx, by, bk.len || 10, bk.width || 2, c.dark);
  p.rect(bx + 1, by + 1, (bk.len || 10) - 2, 1, bk.color || c.accent);
  if (bk.curve) p.rect(bx + (bk.len || 10) - 2, by + 2, 2, 2, c.dark);

  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || h.y);

  // 冠
  const cr = style.crest || {};
  if (cr.kind && cr.kind !== 'none') {
    const color = cr.color || c.accent;
    const cx = h.x;
    const cy = h.y - Math.round(h.h / 2) - 1;
    if (cr.kind === 'crown') {
      for (let i = 0; i < 3; i += 1) {
        p.rect(cx - 4 + i * 4, cy - (cr.len || 5) + (i === 1 ? -2 : 0), 2, (cr.len || 5), c.dark);
        p.px(cx - 4 + i * 4, cy - (cr.len || 5) + (i === 1 ? -2 : 0), color);
      }
    } else {
      p.rect(cx - 1, cy - (cr.len || 5), 3, (cr.len || 5), color);
    }
  }

  if (evolved) {
    p.rect(h.x - 1, h.y - 2, 3, 2, c.glow);
    p.rect(b.x - 1, b.y - 1, 3, 2, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- deer ---------------- */

function drawDeer(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  drawAntlers(p, style, c);
  drawLegs(p, style, c);

  // 尾
  const t = style.tail || {};
  if (t.kind === 'bushy') {
    p.outlineBlob(b.x - Math.round(b.w / 2) - 1, b.y - 1, 5, 4, c.light, c.dark);
  } else if (t.kind === 'thin') {
    p.rect(b.x - Math.round(b.w / 2) - 5, b.y - 2, 5, 2, c.dark);
  }

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 4, b.h / 3, c.light);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 2, b.w - 6, b.h - 4]);

  // 颈
  const n = style.neck || {};
  p.outlineRect(n.x || (b.x + 8), n.y || (b.y - 12), n.w || 7, n.h || 15, c.base, c.dark);
  p.rect((n.x || (b.x + 8)) + 1, (n.y || (b.y - 12)) + 1, Math.max(1, (n.w || 7) - 2), (n.h || 15) - 2, c.light);

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.rect(h.x - Math.round(h.w * 0.25), h.y - Math.round(h.h * 0.35), Math.round(h.w * 0.6), 2, c.light, 0.9);
  // 吻
  p.rect(h.x + Math.round(h.w / 2) - 2, h.y + 1, 5, 3, c.base);
  p.rect(h.x + Math.round(h.w / 2) + 1, h.y + 2, 2, 1, c.pale);
  // 耳
  const ears = style.ears || {};
  if (ears.kind === 'long') {
    p.outlineRect(h.x - 6, h.y - Math.round(h.h / 2) - 6, 3, 8, c.base, c.dark);
    p.rect(h.x - 5, h.y - Math.round(h.h / 2) - 5, 1, 5, c.pale);
    p.outlineRect(h.x + 2, h.y - Math.round(h.h / 2) - 5, 3, 7, c.base, c.dark);
  } else if (ears.kind === 'point') {
    p.outlineRect(h.x - 7, h.y - Math.round(h.h / 2) - 5, 3, 7, c.base, c.dark);
    p.outlineRect(h.x + 2, h.y - Math.round(h.h / 2) - 4, 3, 6, c.base, c.dark);
  }
  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || (h.y - 1));
  // 鼻
  p.px(h.x + Math.round(h.w / 2) + 2, h.y + 2, c.ink);

  if (evolved) {
    p.gem(h.x, h.y - Math.round(h.h / 2) - 2, c.glow);
    p.gem(b.x, b.y - 1, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- fox ---------------- */

function drawFox(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 尾（先画，压在身体后）
  const t = style.tail || {};
  if (t.kind === 'flame') {
    const cx = b.x - Math.round(b.w / 2) - 2;
    const cy = b.y + 2;
    const layers = [[7, 4, c.dark], [9, 5, c.base], [8, 4, c.light], [6, 3, c.pale], [4, 2, c.glow]];
    layers.forEach(function (l, i) {
      p.blob(cx - i * 3, cy - i * 4, l[0], l[1], l[2]);
    });
    if (evolved) p.blob(cx - 12, cy - 14, 5, 4, c.glow, 0.8);
  } else if (t.kind === 'multi') {
    const count = t.count || 9;
    const cx = b.x - Math.round(b.w / 2) + 1;
    const cy = b.y - 2;
    for (let i = 0; i < count; i += 1) {
      const a = (-70 + i * (140 / Math.max(1, count - 1))) * Math.PI / 180;
      const len = (t.len || 12) + (i % 3) * 3;
      const ex = cx + Math.cos(a) * len - 3;
      const ey = cy + Math.sin(a) * len;
      p.blob(ex, ey, 4, 3, i % 2 ? c.light : c.base);
      p.blob(ex + 1, ey - 2, 2, 2, c.glow);
    }
  } else if (t.kind === 'bushy') {
    p.outlineBlob(b.x - Math.round(b.w / 2) - 3, b.y - 3, 8, 6, c.base, c.dark);
    p.blob(b.x - Math.round(b.w / 2) - 5, b.y - 5, 4, 3, c.light);
    p.blob(b.x - Math.round(b.w / 2) - 7, b.y - 8, 2, 2, c.pale);
  } else if (t.kind === 'ringed') {
    p.outlineBlob(b.x - Math.round(b.w / 2) - 3, b.y - 3, 8, 5, c.base, c.dark);
    p.rect(b.x - Math.round(b.w / 2) - 9, b.y - 2, 2, 5, c.pale);
    p.rect(b.x - Math.round(b.w / 2) - 5, b.y - 4, 2, 6, c.pale);
  } else if (t.kind === 'wind') {
    p.line(b.x - Math.round(b.w / 2) - 2, b.y - 1, b.x - Math.round(b.w / 2) - 14, b.y - 8, c.light);
    p.line(b.x - Math.round(b.w / 2) - 2, b.y + 1, b.x - Math.round(b.w / 2) - 12, b.y + 3, c.pale);
    p.blob(b.x - Math.round(b.w / 2) - 14, b.y - 8, 3, 2, c.glow);
  }

  drawLegs(p, style, c);

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 4, b.h / 3, c.light);
  p.rect(b.x - Math.round(b.w * 0.3), b.y + Math.round(b.h * 0.24), Math.round(b.w * 0.55), 2, c.pale, 0.85);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 3, b.w - 6, b.h - 4]);

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.blob(h.x - 1, h.y - 2, h.w / 2 - 3, h.h / 3, c.light);
  // 吻
  p.rect(h.x + Math.round(h.w / 2) - 2, h.y + 1, 6, 3, c.pale);
  p.px(h.x + Math.round(h.w / 2) + 4, h.y + 2, c.ink);
  // 耳
  const ears = style.ears || {};
  if (ears.kind === 'point') {
    p.rect(h.x - 7, h.y - Math.round(h.h / 2) - 7, 4, 10, c.dark);
    p.rect(h.x - 6, h.y - Math.round(h.h / 2) - 6, 2, 7, c.base);
    p.rect(h.x + 3, h.y - Math.round(h.h / 2) - 6, 4, 9, c.dark);
    p.rect(h.x + 4, h.y - Math.round(h.h / 2) - 5, 2, 6, c.light);
  } else if (ears.kind === 'long') {
    p.rect(h.x - 8, h.y - Math.round(h.h / 2) - 9, 3, 12, c.dark);
    p.rect(h.x + 4, h.y - Math.round(h.h / 2) - 8, 3, 11, c.dark);
  }
  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 2), e.y || (h.y - 1));

  if (evolved) {
    p.gem(h.x, h.y - Math.round(h.h / 2) - 1, c.glow);
    p.gem(b.x, b.y - 1, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- badger ---------------- */

function drawBadger(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  const t = style.tail || {};
  if (t.kind === 'ember') {
    const cx = b.x - Math.round(b.w / 2) - 1;
    const cy = b.y - 2;
    [[6, 4, c.dark], [7, 4, c.base], [5, 3, c.light], [3, 2, c.glow]].forEach(function (l, i) {
      p.blob(cx - i * 3, cy - i * 3, l[0], l[1], l[2]);
    });
  } else if (t.kind === 'bushy') {
    p.outlineBlob(b.x - Math.round(b.w / 2) - 3, b.y - 2, 8, 5, c.base, c.dark);
  } else {
    p.rect(b.x - Math.round(b.w / 2) - 6, b.y - 1, 6, 2, c.dark);
  }

  drawLegs(p, style, c);

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 4, b.h / 3, c.light);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 2, b.w - 6, b.h - 3]);

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  // 面罩
  p.rect(h.x - Math.round(h.w / 2) + 2, h.y - 2, Math.round(h.w * 0.75), 3, c.pale);
  p.rect(h.x - Math.round(h.w / 2) + 1, h.y + 1, 3, 4, c.pale);
  p.rect(h.x + Math.round(h.w / 2) - 2, h.y + 1, 2, 4, c.pale);
  // 耳
  p.outlineRect(h.x - 6, h.y - Math.round(h.h / 2) - 4, 4, 6, c.dark, c.dark);
  p.rect(h.x - 5, h.y - Math.round(h.h / 2) - 3, 2, 3, c.pale);
  p.outlineRect(h.x + 3, h.y - Math.round(h.h / 2) - 3, 4, 5, c.dark, c.dark);
  // 吻
  p.rect(h.x + Math.round(h.w / 2) - 1, h.y + 1, 5, 3, c.dark);
  p.px(h.x + Math.round(h.w / 2) + 3, h.y + 2, c.pale);
  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x - 1), e.y || (h.y - 1));

  if (evolved) {
    p.gem(b.x, b.y - 1, c.glow);
    p.gem(h.x, h.y - Math.round(h.h / 2) - 1, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- rhino ---------------- */

function drawRhino(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  drawLegs(p, style, c);

  // 尾
  const t = style.tail || {};
  if (t.kind === 'thin') {
    p.line(b.x - Math.round(b.w / 2) - 1, b.y - 2, b.x - Math.round(b.w / 2) - 8, b.y + 4, c.dark);
  } else if (t.kind === 'bushy') {
    p.outlineBlob(b.x - Math.round(b.w / 2) - 3, b.y - 2, 5, 4, c.base, c.dark);
  }

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 4, b.w / 2 - 5, b.h / 3, c.light);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 3, b.w - 6, b.h - 4]);

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.blob(h.x - 1, h.y - 2, h.w / 2 - 3, h.h / 3, c.light);
  // 吻
  p.rect(h.x + Math.round(h.w / 2) - 2, h.y + 1, 6, 4, c.base);
  p.rect(h.x + Math.round(h.w / 2) + 1, h.y + 2, 3, 2, c.pale);
  p.px(h.x + Math.round(h.w / 2) + 5, h.y + 3, c.dark);
  // 耳
  p.outlineRect(h.x - 7, h.y - Math.round(h.h / 2) - 4, 4, 6, c.base, c.dark);
  p.outlineRect(h.x + 2, h.y - Math.round(h.h / 2) - 3, 4, 5, c.base, c.dark);

  // 角
  const horn = style.horns || {};
  if (horn.kind === 'single') {
    const len = horn.len || 10;
    p.rect(h.x + Math.round(h.w / 2) - 5, h.y - Math.round(h.h / 2) - len + 2, 4, len, c.dark);
    p.rect(h.x + Math.round(h.w / 2) - 4, h.y - Math.round(h.h / 2) - len + 3, 2, len - 2, c.pale);
    p.px(h.x + Math.round(h.w / 2) - 4, h.y - Math.round(h.h / 2) - len + 2, c.glow);
  } else if (horn.kind === 'double') {
    [-1, 1].forEach(function (side) {
      const x = h.x + side * 3;
      p.rect(x, h.y - Math.round(h.h / 2) - 7, 3, 8, c.dark);
      p.rect(x + 1, h.y - Math.round(h.h / 2) - 6, 1, 6, c.pale);
    });
  } else if (horn.kind === 'ninePeaks') {
    drawAntlers(p, style, c);
  }

  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || (h.y - 1));

  if (evolved) {
    p.gem(b.x, b.y - 1, c.glow);
    p.rect(b.x - 10, b.y - Math.round(b.h / 2) - 2, 6, 3, c.light);
    p.rect(b.x + 4, b.y - Math.round(b.h / 2) - 2, 6, 3, c.light);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- croc ---------------- */

function drawCroc(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 尾
  const t = style.tail || {};
  if (t.kind === 'thick') {
    p.outlineRect(b.x - Math.round(b.w / 2) - (t.len || 16) + 4, b.y - 2, t.len || 16, 7, c.base, c.dark);
    p.rect(b.x - Math.round(b.w / 2) - (t.len || 16) + 4, b.y, (t.len || 16) - 2, 2, c.light);
  } else if (t.kind === 'fin') {
    p.rect(b.x - Math.round(b.w / 2) - 8, b.y - 2, 10, 6, c.base);
    p.rect(b.x - Math.round(b.w / 2) - 12, b.y - 6, 4, 8, c.light);
  }

  drawLegs(p, style, c);

  // 身体
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x - 1, b.y - 3, b.w / 2 - 5, b.h / 3, c.light);
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - 2, b.w - 6, b.h - 2]);

  // 背棘
  const horn = style.horns || {};
  if (horn.kind === 'ridge') {
    const n = horn.count || 4;
    for (let i = 0; i < n; i += 1) {
      const x = b.x - Math.round(b.w * 0.35) + i * 7;
      const len = (horn.len || 5) + (i % 2);
      p.rect(x, b.y - Math.round(b.h / 2) - len + 2, 3, len, c.dark);
      p.rect(x + 1, b.y - Math.round(b.h / 2) - len + 3, 1, len - 2, c.pale);
    }
  } else if (horn.kind === 'crown') {
    drawAntlers(p, style, c);
  }

  // 头与长吻
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  const sn = style.snout || {};
  const sx = h.x + Math.round(h.w / 2) - 2;
  const sy = h.y + 1;
  p.outlineRect(sx, sy, sn.len || 12, sn.width || 5, c.base, c.dark);
  p.rect(sx + 1, sy + 1, (sn.len || 12) - 2, 1, c.light);
  p.rect(sx + 2, sy + (sn.width || 5) - 2, (sn.len || 12) - 3, 1, c.dark, 0.8);
  // 牙
  p.px(sx + 3, sy + (sn.width || 5) - 2, c.pale);
  p.px(sx + 7, sy + (sn.width || 5) - 2, c.pale);
  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || (h.y - 2));

  if (evolved) {
    p.rect(b.x - 12, b.y - Math.round(b.h / 2) - 4, 4, 4, c.light);
    p.rect(b.x + 6, b.y - Math.round(b.h / 2) - 3, 4, 3, c.light);
    p.gem(b.x, b.y - 1, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- dragon ---------------- */

function drawDragon(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const h = style.head;
  const b = style.body;
  beastShadow(p, style);

  const spine = [
    [12, 48, 7], [18, 44, 7], [24, 40, 6], [30, 36, 6], [36, 33, 5], [41, 30, 5],
  ];
  // 尾鳍
  const t = style.tail || {};
  if (t.kind === 'fin') {
    p.rect(4, 50, 9, 3, c.dark);
    p.rect(2, 53, 10, 3, c.base);
    p.rect(5, 48, 5, 2, c.light);
  }
  // 身躯
  spine.forEach(function (s, i) {
    p.outlineBlob(s[0], s[1], s[2], 5, i % 2 ? c.light : c.base, c.dark);
    p.blob(s[0], s[1] - 1, s[2] - 2, 3, c.light);
    p.rect(s[0] - 2, s[1] + 2, 3, 2, c.pale, 0.8);
  });
  applyPattern(p, style, [14, 30, 30, 14]);
  // 背鳍
  [[11, 36], [18, 33], [25, 29], [32, 26], [38, 23]].forEach(function (f, i) {
    const len = 6 + (i % 2) * 2;
    p.rect(f[0], f[1], 3, len, c.dark);
    p.rect(f[0] + 1, f[1] + 2, 1, len - 2, c.light);
  });

  // 颈
  const n = style.neck || {};
  p.outlineRect(n.x || 38, n.y || 28, n.w || 8, n.h || 12, c.base, c.dark);
  p.rect((n.x || 38) + 1, (n.y || 28) + 1, Math.max(1, (n.w || 8) - 2), (n.h || 12) - 2, c.light);

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
  p.rect(h.x - Math.round(h.w * 0.25), h.y - Math.round(h.h * 0.35), Math.round(h.w * 0.55), 2, c.light, 0.9);
  // 吻
  p.rect(h.x + Math.round(h.w / 2) - 2, h.y + 1, 9, 4, c.base);
  p.rect(h.x + Math.round(h.w / 2) + 1, h.y + 2, 6, 2, c.pale);
  p.rect(h.x + Math.round(h.w / 2) + 2, h.y + 4, 5, 1, c.dark, 0.7);

  // 角
  drawAntlers(p, style, c);

  // 龙须
  p.line(h.x + Math.round(h.w / 2) + 5, h.y + 3, h.x + Math.round(h.w / 2) + 13, h.y + 6, c.light);
  p.line(h.x + Math.round(h.w / 2) + 6, h.y + 4, h.x + Math.round(h.w / 2) + 12, h.y + 8, c.pale);
  p.line(h.x - Math.round(h.w / 2) + 1, h.y + 3, h.x - Math.round(h.w / 2) - 5, h.y + 6, c.light);

  const e = style.eye || {};
  beastEye(p, style, c, e.x || (h.x + 1), e.y || (h.y - 1));

  // 小前肢
  const l = style.legs || {};
  if ((l.count || 2) > 0) {
    p.outlineRect(h.x - 8, h.y + 8, 3, l.len || 7, c.base, c.dark);
    p.rect(h.x - 10, h.y + 8 + (l.len || 7), 6, 2, c.dark);
  }

  if (evolved) {
    p.rect(6, 42, 6, 2, c.glow);
    p.rect(13, 38, 6, 2, c.glow);
    p.gem(32, 36, c.glow);
    p.rect(h.x + 2, h.y - Math.round(h.h / 2) - 10, 2, 4, c.glow);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- spirit ---------------- */

function drawSpirit(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 下方雾脚/藤蔓
  const td = style.tendrils || {};
  const tCount = td.count || 4;
  for (let i = 0; i < tCount; i += 1) {
    const x = b.x - Math.round(b.w * 0.36) + i * Math.round((b.w * 0.72) / Math.max(1, tCount - 1));
    const len = (td.len || 8) + (i % 3) * 2;
    p.line(x, b.y + Math.round(b.h / 2) - 2, x + (i % 2 ? 2 : -2), b.y + Math.round(b.h / 2) + len, i % 2 ? c.dark : c.base);
    p.px(x + (i % 2 ? 2 : -2), b.y + Math.round(b.h / 2) + len, c.light);
  }

  // 手臂
  const arms = style.arms || {};
  if (arms.show) {
    const ay = b.y + 1;
    p.outlineRect(b.x - Math.round(b.w / 2) - 3, ay, 4, 12, c.base, c.dark);
    p.outlineRect(b.x + Math.round(b.w / 2) - 1, ay, 4, 12, c.base, c.dark);
    p.rect(b.x - Math.round(b.w / 2) - 4, ay + 10, 5, 4, c.light);
    p.rect(b.x + Math.round(b.w / 2) - 2, ay + 10, 5, 4, c.light);
  }

  // 身体
  if (style.shape === 'cloak' || style.shape === 'root') {
    p.outlineRect(b.x - Math.round(b.w / 2), b.y - Math.round(b.h / 2), b.w, b.h, c.base, c.dark);
    p.rect(b.x - Math.round(b.w / 2) + 2, b.y - Math.round(b.h / 2) + 2, b.w - 4, Math.round(b.h * 0.45), c.light);
    if (style.shape === 'root') {
      for (let i = 0; i < 6; i += 1) {
        p.line(b.x - Math.round(b.w / 2) + 2 + i * 4, b.y - 2, b.x - Math.round(b.w / 2) - 4 + i * 5, b.y + Math.round(b.h / 2) + 6, i % 2 ? c.dark : c.base);
      }
    }
  } else if (style.shape === 'ape') {
    p.outlineBlob(b.x, b.y + 1, b.w / 2, b.h / 2, c.base, c.dark);
    p.blob(b.x, b.y + 4, b.w / 2 - 3, b.h / 3, c.light);
    p.rect(b.x - 5, b.y - 1, 10, 8, c.dark);
    p.rect(b.x - 3, b.y + 1, 6, 4, c.glow);
  } else {
    p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
    p.blob(b.x - 1, b.y - 3, b.w / 2 - 4, b.h / 3, c.light);
    p.rect(b.x - Math.round(b.w * 0.3), b.y + Math.round(b.h * 0.22), Math.round(b.w * 0.55), 2, c.pale, 0.85);
  }
  applyPattern(p, style, [b.x - Math.round(b.w / 2) + 3, b.y - Math.round(b.h / 2) + 3, b.w - 6, b.h - 6]);

  // 头
  const headKind = (style.head && style.head.kind) || 'orb';
  if (headKind === 'lantern') {
    p.outlineRect(h.x - 6, h.y - 6, 12, 12, c.dark, c.ink);
    p.rect(h.x - 4, h.y - 4, 8, 8, c.glow);
    p.rect(h.x - 2, h.y - 2, 4, 4, c.pale);
    p.rect(h.x - 7, h.y - 8, 14, 2, c.dark);
  } else {
    p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.base, c.dark);
    p.rect(h.x - Math.round(h.w * 0.3), h.y - Math.round(h.h * 0.35), Math.round(h.w * 0.6), 2, c.light, 0.9);
    const eyes = (style.eyes && style.eyes.mode) || 'two';
    if (eyes === 'many') {
      [[-6, -2], [0, -3], [6, -1], [-4, 4], [3, 4]].forEach(function (o) {
        p.rect(h.x + o[0], h.y + o[1], 3, 3, c.ink);
        p.rect(h.x + o[0] + 1, h.y + o[1] + 1, 1, 1, c.glow);
      });
    } else {
      p.rect(h.x - 6, h.y - 1, 5, 4, c.ink);
      p.rect(h.x + 1, h.y - 1, 5, 4, c.ink);
      p.rect(h.x - 5, h.y, 3, 2, c.glow);
      p.rect(h.x + 2, h.y, 3, 2, c.glow);
    }
    p.rect(h.x - 1, h.y + 5, 3, 1, c.dark);
  }

  // 角/枝角
  if (hornsVisible(style)) drawAntlers(p, style, c);

  if (evolved) {
    p.rect(b.x - 2, b.y - 1, 4, 3, c.glow);
    p.rect(h.x - 1, h.y - Math.round(h.h / 2) - 2, 2, 3, c.pale);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

function hornsVisible(style) {
  return style.horns && style.horns.kind && style.horns.kind !== 'none';
}

/* ---------------- mermaid ---------------- */

function drawMermaid(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 尾
  const t = style.tail || {};
  const tailKind = t.kind || 'fish';
  if (tailKind === 'fish' || tailKind === 'flowing' || tailKind === 'lantern') {
    const spine = [[32, 50, 7, 5], [31, 44, 7, 5], [32, 38, 6, 4]];
    spine.forEach(function (s, i) {
      p.outlineBlob(s[0], s[1], s[2], s[3], i % 2 ? c.light : c.base, c.dark);
    });
    const fin = t.fin || 14;
    p.rect(32 - fin / 2, 54, fin, 4, c.dark);
    p.rect(33 - fin / 2, 55, fin - 2, 2, c.light);
    p.rect(32 - fin / 3, 53, fin / 1.6, 1, c.pale);
    if (tailKind === 'lantern') {
      p.blob(32, 57, 4, 3, c.glow);
      p.rect(31, 56, 2, 2, c.pale);
    }
  } else if (tailKind === 'short') {
    p.outlineBlob(32, 49, 7, 5, c.base, c.dark);
    p.rect(25, 53, 14, 3, c.dark);
  }

  // 长发（先画，压在身后）
  const hair = style.hair || {};
  const hairColor = hair.color || c.ink;
  if (hair.style === 'long') {
    p.rect(h.x - 8, h.y - 2, 4, (hair.len || 12), hairColor);
    p.rect(h.x + 4, h.y - 2, 4, (hair.len || 12), hairColor);
    p.rect(h.x - 9, h.y - 4, 3, 8, hairColor);
    p.rect(h.x + 6, h.y - 4, 3, 8, hairColor);
  }

  // 上身
  p.outlineBlob(b.x, b.y, b.w / 2, b.h / 2, c.base, c.dark);
  p.rect(b.x - Math.round(b.w * 0.3), b.y - 2, Math.round(b.w * 0.6), 3, c.light);
  p.rect(b.x - Math.round(b.w * 0.3), b.y + 3, Math.round(b.w * 0.6), 2, c.pale, 0.9);

  // 手臂
  const arms = style.arms || {};
  if (arms.show) {
    const pose = arms.pose || 0;
    p.outlineRect(b.x - Math.round(b.w / 2) - 3, b.y - 4, 3, 10, c.light, c.dark);
    p.outlineRect(b.x + Math.round(b.w / 2), b.y - 4 + (pose ? -2 : 0), 3, 10, c.light, c.dark);
    p.rect(b.x - Math.round(b.w / 2) - 4, b.y + 5, 4, 3, c.pale);
    p.rect(b.x + Math.round(b.w / 2), b.y + 5, 4, 3, c.pale);
  }

  // 头
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.light, c.dark);
  // 发顶
  p.rect(h.x - Math.round(h.w / 2) + 1, h.y - Math.round(h.h / 2), Math.round(h.w) - 2, 4, c.ink);
  p.rect(h.x - Math.round(h.w / 2) + 3, h.y - Math.round(h.h / 2) - 2, Math.round(h.w) - 6, 3, c.ink);
  // 眼
  p.socket(h.x - 4, h.y - 1, c.pale, c.ink);
  p.socket(h.x + 1, h.y - 1, c.pale, c.ink);
  p.rect(h.x - 2, h.y + 4, 4, 1, c.accent);

  // 冠饰
  const crown = style.crown || {};
  if (crown.kind && crown.kind !== 'none') {
    const cx = h.x;
    const cy = h.y - Math.round(h.h / 2) - 2;
    if (crown.kind === 'gold') {
      for (let i = 0; i < 3; i += 1) {
        p.rect(cx - 5 + i * 4, cy - 5 + (i === 1 ? -2 : 0), 2, 5, c.glow);
        p.px(cx - 5 + i * 4, cy - 5 + (i === 1 ? -2 : 0), c.pale);
      }
    } else if (crown.kind === 'coral') {
      p.line(cx - 6, cy, cx - 8, cy - 6, c.accent);
      p.line(cx, cy, cx, cy - 8, c.accent);
      p.line(cx + 6, cy, cx + 8, cy - 5, c.accent);
      p.blob(cx - 8, cy - 7, 2, 2, c.pale);
      p.blob(cx, cy - 9, 2, 2, c.pale);
      p.blob(cx + 8, cy - 6, 2, 2, c.pale);
    } else {
      p.rect(cx - 6, cy - 3, 12, 3, c.glow);
    }
  }

  applyPattern(p, style, [26, 36, 12, 16]);

  if (evolved) {
    p.gem(b.x, b.y + 1, c.glow);
    p.rect(h.x - 2, h.y + 7, 5, 1, c.pale);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

/* ---------------- clam ---------------- */

function drawClam(style, evolved) {
  const p = new PixelCanvas();
  const c = style.palette;
  const b = style.body;
  const h = style.head;
  beastShadow(p, style);

  // 下壳
  p.outlineBlob(b.x, b.y + 1, b.w / 2, b.h / 2, c.base, c.dark);
  p.blob(b.x, b.y, b.w / 2 - 2, b.h / 2 - 2, c.light);
  p.rect(b.x - Math.round(b.w / 2) + 3, b.y + 1, b.w - 6, 3, c.pale);

  // 上壳
  const shellKind = (style.shell && style.shell.kind) || 'clam';
  p.outlineBlob(b.x, b.y - 9, b.w / 2, 11, c.dark, c.ink);
  p.blob(b.x, b.y - 11, b.w / 2 - 2, 9, c.base);
  p.blob(b.x, b.y - 14, b.w / 2 - 6, 6, c.light);
  if (shellKind === 'layered') {
    p.rect(b.x - Math.round(b.w / 2) + 3, b.y - 12, b.w - 6, 2, c.pale, 0.75);
    p.rect(b.x - Math.round(b.w / 2) + 6, b.y - 17, b.w - 12, 2, c.pale, 0.65);
  } else if (shellKind === 'jewel') {
    p.gem(b.x - 10, b.y - 12, c.glow);
    p.gem(b.x + 10, b.y - 11, c.accent);
  }
  // 壳纹
  for (let i = 0; i < 5; i += 1) {
    const x = b.x - Math.round(b.w / 2) + 5 + i * 6;
    p.rect(x, b.y - 18 + (i % 2) * 2, 2, 12, i % 2 ? c.dark : c.light, 0.7);
  }
  p.rect(b.x - Math.round(b.w / 2) + 3, b.y - 7, b.w - 6, 2, c.dark);

  // 珍珠 / 脸
  p.outlineBlob(h.x, h.y, h.w / 2, h.h / 2, c.glow, c.ink);
  p.blob(h.x, h.y - 1, h.w / 2 - 2, h.h / 2 - 2, c.pale);
  p.rect(h.x - 4, h.y - 2, 3, 2, c.ink);
  p.rect(h.x + 2, h.y - 2, 3, 2, c.ink);
  p.rect(h.x - 3, h.y - 2, 1, 1, c.pale);
  p.rect(h.x + 3, h.y - 2, 1, 1, c.pale);
  applyPattern(p, style, [14, 20, 36, 26]);

  if (evolved) {
    p.gem(b.x, b.y - 20, c.glow);
    p.rect(b.x - 14, b.y - 24, 4, 2, c.accent);
    p.rect(b.x + 10, b.y - 24, 4, 2, c.accent);
  }
  drawSignature(p, style, c);
  return p.svg(style.id, style.scale);
}

const BEAST_BUILDERS = {
  bird: drawBird,
  crane: drawCrane,
  deer: drawDeer,
  fox: drawFox,
  badger: drawBadger,
  rhino: drawRhino,
  croc: drawCroc,
  dragon: drawDragon,
  spirit: drawSpirit,
  mermaid: drawMermaid,
  clam: drawClam,
};

// 未知 id 的兜底：不参与 62 种校验，只在数据损坏时避免空白
registerBeast('__fallback', {
  family: 'spirit',
  idle: 'float',
  palette: pal('#141018', '#243a26', '#4a7a4a', '#7fc46a', '#d8ffb0', '#dcff9a', '#8ae0c8'),
  pattern: { kind: 'none' },
  signature: 'none',
});
