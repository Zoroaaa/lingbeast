// 灵兽录 · 灵兽签名特征库
// 每个函数接收 (p, style, c)，用 style 的头/身锚点自适应位置。

const SIGNATURES = {};

function sigHead(style) { return style.head || { x: 32, y: 22, w: 14, h: 12 }; }
function sigBody(style) { return style.body || { x: 30, y: 40, w: 22, h: 16 }; }
function sigTop(style) { const h = sigHead(style); return { x: h.x, y: h.y - Math.round(h.h / 2) }; }

SIGNATURES.inkTips = function (p, style, c) {
  const b = sigBody(style);
  p.rect(b.x - Math.round(b.w / 2) - 2, b.y - 4, 5, 2, c.ink, 0.85);
  p.rect(b.x + Math.round(b.w / 2) - 2, b.y - 5, 5, 2, c.ink, 0.85);
  p.rect(b.x - 2, b.y + 1, 3, 2, c.ink, 0.7);
};

SIGNATURES.bell = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  p.rect(b.x - 3, b.y - Math.round(b.h / 2) + 1, 6, 2, c.dark);
  p.rect(b.x - 2, b.y - Math.round(b.h / 2) + 3, 4, 4, c.accent);
  p.rect(b.x - 1, b.y - Math.round(b.h / 2) + 7, 2, 1, c.dark);
  p.px(h.x + Math.round(h.w / 2) - 4, h.y + 2, c.glow);
};

SIGNATURES.eyeMask = function (p, style, c) {
  const h = sigHead(style);
  const y = h.y - Math.round(h.h * 0.4);
  p.rect(h.x - Math.round(h.w / 2) + 1, y, Math.round(h.w) - 2, 2, c.ink, 0.8);
  p.rect(h.x - Math.round(h.w / 2) + 1, y + 2, 2, 2, c.ink, 0.55);
  p.rect(h.x + Math.round(h.w / 2) - 3, y + 2, 2, 2, c.ink, 0.55);
  p.px(h.x + 1, y, c.pale);
};

SIGNATURES.goldCrown = function (p, style, c) {
  const top = sigTop(style);
  for (let i = 0; i < 3; i += 1) {
    const x = top.x - 6 + i * 4;
    const h = i === 1 ? 8 : 5;
    p.rect(x, top.y - h - 2, 2, h, c.dark);
    p.px(x, top.y - h - 2, c.glow);
    p.px(x + 1, top.y - h - 3, c.pale);
  }
};

SIGNATURES.flameTips = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  p.rect(b.x - Math.round(b.w / 2) - 3, b.y - 4, 5, 3, c.light);
  p.rect(b.x - Math.round(b.w / 2) - 4, b.y - 7, 3, 3, c.glow);
  p.rect(h.x + Math.round(h.w / 2) - 1, h.y - Math.round(h.h / 2) - 3, 3, 3, c.glow);
  p.px(h.x + Math.round(h.w / 2), h.y - Math.round(h.h / 2) - 4, c.pale);
};

SIGNATURES.earTufts = function (p, style, c) {
  const h = sigHead(style);
  const top = topOf(h);
  p.rect(h.x - 6, top - 5, 3, 6, c.dark);
  p.rect(h.x - 5, top - 4, 1, 4, c.pale);
  p.rect(h.x + 3, top - 6, 3, 7, c.dark);
  p.rect(h.x + 4, top - 5, 1, 5, c.light);
};

function topOf(h) { return h.y - Math.round(h.h / 2); }

SIGNATURES.starSpecks = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  [[0.2, 0.3], [0.45, 0.6], [0.7, 0.25], [0.3, 0.8], [0.8, 0.7]].forEach(function (s) {
    p.px(b.x - Math.round(b.w / 2) + Math.round(b.w * s[0]), b.y - Math.round(b.h / 2) + Math.round(b.h * s[1]), c.glow);
  });
  p.px(h.x + 4, h.y - 4, c.pale);
  p.px(h.x - 3, h.y + 2, c.glow);
};

SIGNATURES.lightningCrest = function (p, style, c) {
  const top = sigTop(style);
  p.line(top.x - 2, top.y, top.x + 2, top.y - 4, c.glow);
  p.line(top.x + 2, top.y - 4, top.x - 1, top.y - 7, c.pale);
  p.line(top.x - 1, top.y - 7, top.x + 4, top.y - 11, c.glow);
  p.px(top.x - 2, top.y - 1, c.pale);
};

SIGNATURES.boneMask = function (p, style, c) {
  const h = sigHead(style);
  p.rect(h.x - Math.round(h.w / 2) + 1, h.y - 3, Math.round(h.w) - 2, 5, c.pale);
  p.rect(h.x - 4, h.y - 1, 3, 3, c.ink);
  p.rect(h.x + 2, h.y - 1, 3, 3, c.ink);
  p.rect(h.x - 5, h.y + 3, 10, 2, c.pale, 0.8);
  p.rect(h.x - 3, h.y + 3, 1, 2, c.ink);
  p.rect(h.x + 3, h.y + 3, 1, 2, c.ink);
};

SIGNATURES.windRing = function (p, style, c) {
  const b = sigBody(style);
  p.line(b.x - Math.round(b.w / 2) - 4, b.y - 5, b.x + Math.round(b.w / 2) + 4, b.y - 8, c.light, 0.8);
  p.line(b.x - Math.round(b.w / 2) - 6, b.y - 1, b.x + Math.round(b.w / 2) + 6, b.y - 4, c.pale, 0.7);
  p.px(b.x - Math.round(b.w / 2) - 5, b.y - 6, c.glow);
};

SIGNATURES.cometTail = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) - 10;
  p.line(x, b.y, x - 8, b.y - 4, c.light);
  p.line(x, b.y + 1, x - 7, b.y - 2, c.pale);
  p.blob(x - 9, b.y - 5, 3, 3, c.glow);
  p.px(x - 9, b.y - 6, c.pale);
};

SIGNATURES.curvedBeak = function (p, style, c) {
  const h = sigHead(style);
  const x = h.x + Math.round(h.w / 2) + 5;
  const y = h.y + 2;
  p.rect(x, y, 2, 3, c.dark);
  p.rect(x + 1, y + 2, 2, 2, c.dark);
  p.px(x, y, c.pale);
};

SIGNATURES.frostTips = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  p.rect(b.x - Math.round(b.w / 2) - 3, b.y - 3, 3, 2, c.pale);
  p.rect(b.x + Math.round(b.w / 2) - 1, b.y - 4, 3, 2, c.pale);
  p.px(h.x - 4, h.y - Math.round(h.h / 2) - 2, c.pale);
  p.px(h.x + 4, h.y - Math.round(h.h / 2) - 2, c.pale);
};

SIGNATURES.cloudFluff = function (p, style, c) {
  const b = sigBody(style);
  p.blob(b.x - Math.round(b.w / 2) - 2, b.y - 2, 4, 3, c.pale, 0.9);
  p.blob(b.x + Math.round(b.w / 2) + 1, b.y - 3, 4, 3, c.pale, 0.9);
  p.blob(b.x, b.y - Math.round(b.h / 2) - 2, 6, 2, c.light, 0.7);
};

SIGNATURES.phoenixPlumes = function (p, style, c) {
  const b = sigBody(style);
  for (let i = 0; i < 5; i += 1) {
    const x = b.x - Math.round(b.w / 2) - 10 - i * 2;
    const y = b.y - 2 + i * 2;
    p.line(x, y, x + 10, y - 6, i % 2 ? c.glow : c.light);
    p.px(x, y, c.pale);
  }
};

SIGNATURES.vineAntlers = function (p, style, c) {
  const top = sigTop(style);
  [[-8, -4], [-4, -8], [4, -7], [8, -3]].forEach(function (o) {
    p.rect(top.x + o[0], top.y + o[1], 2, 2, c.light);
    p.px(top.x + o[0], top.y + o[1] - 1, c.pale);
  });
};

SIGNATURES.herbPouch = function (p, style, c) {
  const h = sigHead(style);
  p.rect(h.x - 2, h.y + 4, 7, 5, c.accent);
  p.rect(h.x - 1, h.y + 5, 5, 3, c.dark);
  p.px(h.x + 1, h.y + 6, c.glow);
  p.line(h.x - 1, h.y + 4, h.x - 4, h.y + 1, c.light);
};

SIGNATURES.coralAntlers = function (p, style, c) {
  const top = sigTop(style);
  p.line(top.x - 4, top.y, top.x - 8, top.y - 8, c.accent);
  p.line(top.x, top.y, top.x, top.y - 10, c.accent);
  p.line(top.x + 4, top.y, top.x + 8, top.y - 7, c.accent);
  p.blob(top.x - 8, top.y - 9, 2, 2, c.pale);
  p.blob(top.x, top.y - 11, 2, 2, c.pale);
  p.blob(top.x + 8, top.y - 8, 2, 2, c.pale);
};

SIGNATURES.nineTails = function (p, style, c) {
  const b = sigBody(style);
  const cx = b.x - Math.round(b.w / 2) + 2;
  const cy = b.y - 3;
  for (let i = 0; i < 9; i += 1) {
    const a = (-75 + i * 18.75) * Math.PI / 180;
    const ex = cx + Math.cos(a) * 12;
    const ey = cy + Math.sin(a) * 12;
    p.px(ex, ey, i % 2 ? c.glow : c.pale);
  }
};

SIGNATURES.heartMark = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x;
  const y = b.y - 2;
  p.rect(x - 2, y, 2, 2, c.accent);
  p.rect(x + 1, y, 2, 2, c.accent);
  p.rect(x - 3, y + 1, 7, 2, c.accent);
  p.rect(x - 2, y + 3, 5, 1, c.accent);
  p.rect(x - 1, y + 4, 3, 1, c.accent);
  p.px(x - 2, y + 1, c.pale);
};

SIGNATURES.ringedTail = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) - 8;
  p.rect(x, b.y - 3, 3, 6, c.pale, 0.85);
  p.rect(x + 4, b.y - 4, 2, 7, c.pale, 0.7);
};

SIGNATURES.emberTail = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) - 10;
  p.blob(x, b.y - 3, 4, 3, c.light);
  p.blob(x, b.y - 5, 2, 2, c.glow);
  p.px(x, b.y - 6, c.pale);
};

SIGNATURES.windSwirl = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) - 12;
  p.line(x, b.y - 1, x + 8, b.y - 6, c.light);
  p.line(x + 2, b.y + 2, x + 10, b.y - 3, c.pale);
  p.px(x + 8, b.y - 7, c.glow);
};

SIGNATURES.whiskers = function (p, style, c) {
  const h = sigHead(style);
  const x = h.x + Math.round(h.w / 2) + 2;
  const y = h.y + 2;
  p.line(x, y, x + 9, y - 3, c.pale);
  p.line(x, y + 1, x + 10, y + 2, c.light);
  p.line(h.x - Math.round(h.w / 2) - 2, y, h.x - Math.round(h.w / 2) - 9, y - 2, c.pale);
};

SIGNATURES.starHide = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  [[0.15, 0.2], [0.4, 0.45], [0.65, 0.2], [0.3, 0.7], [0.75, 0.6]].forEach(function (s) {
    p.px(b.x - Math.round(b.w / 2) + Math.round(b.w * s[0]), b.y - Math.round(b.h / 2) + Math.round(b.h * s[1]), c.glow);
  });
  p.gem(h.x + Math.round(h.w / 2) - 4, h.y - Math.round(h.h / 2), c.glow);
};

SIGNATURES.rockPlates = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) + 3;
  const y = b.y - Math.round(b.h / 2) + 2;
  for (let i = 0; i < 4; i += 1) {
    const w = 6 + (i % 2) * 3;
    p.rect(x + i * 6, y + (i % 2) * 2, w, 2, c.dark, 0.85);
    p.rect(x + i * 6, y + (i % 2) * 2, w - 1, 1, c.light, 0.8);
  }
  p.rect(b.x - 4, b.y + Math.round(b.h / 2) - 4, 8, 3, c.dark, 0.7);
};

SIGNATURES.doubleHorn = function (p, style, c) {
  const h = sigHead(style);
  const x = h.x + Math.round(h.w / 2) - 6;
  p.rect(x, h.y - Math.round(h.h / 2) - 9, 3, 9, c.dark);
  p.rect(x + 1, h.y - Math.round(h.h / 2) - 8, 1, 7, c.pale);
  p.rect(x - 5, h.y - Math.round(h.h / 2) - 6, 3, 6, c.dark);
  p.rect(x - 4, h.y - Math.round(h.h / 2) - 5, 1, 4, c.light);
};

SIGNATURES.mountainRidge = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) + 2;
  const y = b.y - Math.round(b.h / 2) - 4;
  p.line(x, y + 4, x + 8, y - 2, c.dark);
  p.line(x + 8, y - 2, x + 14, y + 3, c.dark);
  p.line(x + 14, y + 3, x + 22, y - 3, c.dark);
  p.line(x + 5, y + 3, x + 8, y - 1, c.pale);
  p.line(x + 16, y + 2, x + 18, y - 1, c.light);
};

SIGNATURES.ninePeaks = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2);
  const y = b.y - Math.round(b.h / 2);
  for (let i = 0; i < 9; i += 1) {
    const px = x + i * 4;
    const h = 4 + (i % 3) * 3;
    p.rect(px, y - h, 3, h, c.dark);
    p.rect(px + 1, y - h + 1, 1, Math.max(1, h - 2), c.pale);
  }
};

SIGNATURES.lavaCracks = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) + 4;
  const y = b.y - Math.round(b.h / 2) + 3;
  p.line(x, y, x + 6, y + 4, c.glow);
  p.line(x + 6, y + 4, x + 4, y + 8, c.glow);
  p.line(x + 12, y + 1, x + 17, y + 5, c.light);
  p.line(x + 17, y + 5, x + 15, y + 9, c.glow);
  p.px(x + 6, y + 4, c.pale);
};

SIGNATURES.magmaCore = function (p, style, c) {
  const b = sigBody(style);
  p.outlineBlob(b.x, b.y, 6, 5, c.glow, c.dark);
  p.blob(b.x, b.y - 1, 4, 3, c.pale);
  p.px(b.x - 1, b.y - 2, '#ffffff');
  p.rect(b.x - 8, b.y - 3, 3, 2, c.light);
  p.rect(b.x + 6, b.y + 1, 3, 2, c.light);
};

SIGNATURES.waveFins = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) + 2;
  const y = b.y - Math.round(b.h / 2) - 3;
  for (let i = 0; i < 4; i += 1) {
    p.rect(x + i * 6, y - (i % 2) * 2, 4, 5, c.dark);
    p.rect(x + i * 6 + 1, y - (i % 2) * 2 + 1, 2, 3, c.light);
  }
};

SIGNATURES.lanternLure = function (p, style, c) {
  const h = sigHead(style);
  const x = h.x + Math.round(h.w / 2) + 6;
  const y = h.y - Math.round(h.h / 2) - 2;
  p.line(h.x + Math.round(h.w / 2) - 2, h.y - 2, x, y, c.dark);
  p.outlineRect(x - 2, y - 4, 5, 6, c.glow, c.dark);
  p.rect(x - 1, y - 3, 3, 4, c.pale);
  p.px(x, y - 2, '#ffffff');
};

SIGNATURES.branchAntlers = function (p, style, c) {
  const top = sigTop(style);
  p.line(top.x - 3, top.y, top.x - 7, top.y - 8, c.dark);
  p.line(top.x + 3, top.y, top.x + 7, top.y - 8, c.dark);
  p.line(top.x - 7, top.y - 5, top.x - 10, top.y - 7, c.light);
  p.line(top.x + 7, top.y - 5, top.x + 10, top.y - 7, c.light);
  p.px(top.x - 7, top.y - 9, c.pale);
  p.px(top.x + 7, top.y - 9, c.pale);
};

SIGNATURES.mossCloak = function (p, style, c) {
  const b = sigBody(style);
  const h = sigHead(style);
  p.rect(b.x - Math.round(b.w / 2) + 2, b.y - Math.round(b.h / 2) + 1, 5, 3, c.light);
  p.rect(b.x + Math.round(b.w / 2) - 8, b.y - Math.round(b.h / 2) + 2, 5, 3, c.light);
  p.rect(h.x - 5, h.y - Math.round(h.h / 2), 10, 2, c.light);
  p.px(h.x - 3, h.y - Math.round(h.h / 2) + 2, c.pale);
  p.px(h.x + 2, h.y - Math.round(h.h / 2) + 2, c.pale);
};

SIGNATURES.manyEyes = function (p, style, c) {
  const b = sigBody(style);
  [[-6, -3], [0, -5], [6, -2], [-4, 4], [4, 5]].forEach(function (o) {
    p.rect(b.x + o[0], b.y + o[1], 3, 3, c.ink);
    p.rect(b.x + o[0] + 1, b.y + o[1] + 1, 1, 1, c.glow);
  });
};

SIGNATURES.forestCrown = function (p, style, c) {
  const h = sigHead(style);
  const y = h.y - Math.round(h.h / 2) - 2;
  p.rect(h.x - 10, y - 4, 20, 4, c.dark);
  p.blob(h.x - 8, y - 5, 4, 3, c.light);
  p.blob(h.x, y - 7, 5, 3, c.base);
  p.blob(h.x + 8, y - 5, 4, 3, c.light);
  p.px(h.x - 4, y - 8, c.pale);
  p.px(h.x + 4, y - 9, c.glow);
};

SIGNATURES.stoneStaff = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) - 8;
  p.rect(x, b.y - 10, 2, 26, c.dark);
  p.rect(x + 1, b.y - 9, 1, 22, c.base);
  p.gem(x + 1, b.y - 12, c.glow);
};

SIGNATURES.fogLantern = function (p, style, c) {
  const h = sigHead(style);
  p.blob(h.x - 10, h.y - 6, 4, 4, c.glow, 0.7);
  p.blob(h.x + 10, h.y - 3, 3, 3, c.pale, 0.6);
  p.rect(h.x - 2, h.y - Math.round(h.h / 2) - 6, 4, 2, c.dark);
  p.rect(h.x - 1, h.y - Math.round(h.h / 2) - 5, 2, 2, c.glow);
};

SIGNATURES.iceSpine = function (p, style, c) {
  const b = sigBody(style);
  const x = b.x - Math.round(b.w / 2) + 2;
  const y = b.y - Math.round(b.h / 2);
  for (let i = 0; i < 5; i += 1) {
    const h = 4 + (i % 3) * 2;
    p.rect(x + i * 5, y - h, 2, h, c.pale);
    p.px(x + i * 5, y - h - 1, c.glow);
  }
};

SIGNATURES.furnaceChest = function (p, style, c) {
  const b = sigBody(style);
  p.outlineBlob(b.x, b.y + 1, 7, 6, c.dark, c.ink);
  p.rect(b.x - 4, b.y - 1, 8, 5, c.glow);
  p.rect(b.x - 2, b.y, 4, 3, c.pale);
  p.rect(b.x - 1, b.y + 1, 2, 1, '#ffffff');
  p.rect(b.x - 9, b.y - 4, 3, 2, c.light);
  p.rect(b.x + 7, b.y - 3, 3, 2, c.light);
};

SIGNATURES.rootTendrils = function (p, style, c) {
  const b = sigBody(style);
  for (let i = 0; i < 7; i += 1) {
    const x = b.x - Math.round(b.w / 2) + 2 + i * 4;
    p.line(x, b.y + Math.round(b.h / 2) - 2, x + (i % 2 ? 4 : -4), b.y + Math.round(b.h / 2) + 8, i % 2 ? c.dark : c.base);
    p.px(x + (i % 2 ? 4 : -4), b.y + Math.round(b.h / 2) + 8, c.light);
  }
};

SIGNATURES.emberFists = function (p, style, c) {
  const b = sigBody(style);
  p.blob(b.x - Math.round(b.w / 2) - 2, b.y + 7, 4, 3, c.dark);
  p.blob(b.x - Math.round(b.w / 2) - 2, b.y + 6, 3, 2, c.glow);
  p.blob(b.x + Math.round(b.w / 2) + 2, b.y + 7, 4, 3, c.dark);
  p.blob(b.x + Math.round(b.w / 2) + 2, b.y + 6, 3, 2, c.glow);
};

SIGNATURES.redHair = function (p, style, c) {
  const h = sigHead(style);
  p.rect(h.x - 9, h.y - 2, 3, 14, c.accent);
  p.rect(h.x + 6, h.y - 2, 3, 12, c.accent);
  p.rect(h.x - 10, h.y + 2, 2, 8, c.light);
  p.rect(h.x + 8, h.y + 1, 2, 8, c.light);
};

SIGNATURES.deepScales = function (p, style, c) {
  const b = sigBody(style);
  for (let i = 0; i < 4; i += 1) {
    p.rect(b.x - Math.round(b.w / 2) + 3 + i * 6, b.y - 2 + (i % 2) * 3, 5, 2, c.dark, 0.75);
  }
  p.gem(b.x, b.y - 1, c.glow);
};

SIGNATURES.seaCrown = function (p, style, c) {
  const h = sigHead(style);
  const y = h.y - Math.round(h.h / 2) - 2;
  p.rect(h.x - 8, y - 2, 16, 2, c.dark);
  p.line(h.x - 6, y - 2, h.x - 9, y - 8, c.accent);
  p.line(h.x, y - 2, h.x, y - 10, c.accent);
  p.line(h.x + 6, y - 2, h.x + 9, y - 8, c.accent);
  p.px(h.x - 9, y - 9, c.pale);
  p.px(h.x, y - 11, c.glow);
  p.px(h.x + 9, y - 9, c.pale);
};

SIGNATURES.waveScales = function (p, style, c) {
  const b = sigBody(style);
  for (let i = 0; i < 3; i += 1) {
    p.rect(b.x - Math.round(b.w / 2) + 3, b.y - 4 + i * 4, Math.round(b.w * 0.5), 1, c.light, 0.8);
    p.rect(b.x + 1, b.y - 3 + i * 4, Math.round(b.w * 0.35), 1, c.pale, 0.7);
  }
};

SIGNATURES.pearlEyes = function (p, style, c) {
  const h = sigHead(style);
  p.blob(h.x - 4, h.y - 2, 3, 3, c.glow);
  p.blob(h.x + 3, h.y - 2, 2, 2, c.pale);
  p.px(h.x - 4, h.y - 3, '#ffffff');
};

SIGNATURES.layeredShell = function (p, style, c) {
  const b = sigBody(style);
  p.rect(b.x - Math.round(b.w / 2) + 4, b.y - 18, b.w - 8, 2, c.pale, 0.8);
  p.rect(b.x - Math.round(b.w / 2) + 7, b.y - 23, b.w - 14, 2, c.light, 0.8);
  p.rect(b.x - Math.round(b.w / 2) + 10, b.y - 27, b.w - 20, 2, c.pale, 0.7);
};

SIGNATURES.jewelShell = function (p, style, c) {
  const b = sigBody(style);
  p.gem(b.x - 12, b.y - 12, c.glow);
  p.gem(b.x + 12, b.y - 10, c.accent);
  p.gem(b.x - 2, b.y - 26, c.pale);
  p.rect(b.x - Math.round(b.w / 2) + 2, b.y - 8, b.w - 4, 1, c.glow, 0.8);
};

SIGNATURES.redEars = function (p, style, c) {
  const h = sigHead(style);
  const top = h.y - Math.round(h.h / 2);
  p.rect(h.x - 7, top - 7, 4, 9, c.dark);
  p.rect(h.x - 6, top - 6, 2, 6, c.accent);
  p.rect(h.x + 3, top - 6, 4, 8, c.dark);
  p.rect(h.x + 4, top - 5, 2, 5, c.accent);
};
