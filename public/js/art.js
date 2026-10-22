// 灵兽录 · 图像层（v2.1 像素版）：灵兽像素立绘与契印
// 全部使用内联 SVG 的整数像素块，保证离线可用与任意尺寸清晰。

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
  if (w <= 0 || h <= 0) return this;
  this.parts.push('<rect x="' + Math.round(x) + '" y="' + Math.round(y) + '" width="' + Math.round(w) +
    '" height="' + Math.round(h) + '" fill="' + fill + '"' + (opacity != null ? ' opacity="' + opacity + '"' : '') + '/>');
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
    this.rect(x0, y, x1 - x0, 1, fill, opacity);
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
  this.rect(x, y, 4, 3, '#0b0d12');
  this.rect(x + 1, y, 2, 2, white || '#f7f2df');
  this.rect(x + 2, y + 1, 1, 1, pupil || '#10131a');
  return this;
};
PixelCanvas.prototype.gem = function (x, y, color) {
  this.rect(x - 1, y - 2, 2, 1, color);
  this.rect(x - 2, y - 1, 4, 2, color);
  this.rect(x - 1, y + 1, 2, 1, color);
  this.rect(x, y - 1, 1, 1, '#ffffff');
  return this;
};
PixelCanvas.prototype.svg = function (label) {
  return '<svg viewBox="0 0 64 64" shape-rendering="crispEdges" role="img" aria-label="' + label + '">' +
    this.parts.join('') + '</svg>';
};

function elementPalette(el) { return PIXEL_ELEMENT[el] || PIXEL_ELEMENT.wood; }

// ---------- 十一类灵兽 ----------
const BEAST_ART = {
  bird: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 16);
    // 尾羽：三根长短不一的羽片
    p.rect(10, 47, 14, 3, c.dark);
    p.rect(13, 50, 12, 3, c.base);
    p.rect(17, 52, 8, 2, c.light);
    p.rect(23, 45, 8, 3, c.dark);
    // 双翼：阶梯羽片（先深色轮廓，再羽色）
    const wingRows = [
      [2, 28, 16, 4, c.dark], [3, 29, 14, 3, c.base],
      [4, 32, 17, 4, c.dark], [5, 33, 15, 3, c.base],
      [7, 36, 16, 4, c.dark], [8, 37, 14, 3, c.light],
      [11, 40, 12, 3, c.dark], [12, 41, 10, 2, c.light],
    ];
    wingRows.forEach((r) => p.rect(r[0], r[1], r[2], r[3], r[4]));
    const wingRowsR = [
      [46, 28, 16, 4, c.dark], [47, 29, 14, 3, c.base],
      [43, 32, 17, 4, c.dark], [44, 33, 15, 3, c.base],
      [41, 36, 16, 4, c.dark], [42, 37, 14, 3, c.light],
      [41, 40, 12, 3, c.dark], [42, 41, 10, 2, c.light],
    ];
    wingRowsR.forEach((r) => p.rect(r[0], r[1], r[2], r[3], r[4]));
    // 羽尖深浅
    p.rect(6, 30, 8, 2, c.pale, 0.7); p.rect(50, 30, 8, 2, c.pale, 0.7);
    p.rect(9, 38, 8, 2, c.pale, 0.5); p.rect(47, 38, 8, 2, c.pale, 0.5);
    // 身体
    p.outlineBlob(32, 38, 13, 12, c.base, c.dark);
    p.blob(31, 34, 9, 6, c.light);
    p.rect(28, 43, 10, 6, c.pale);
    p.rect(24, 37, 3, 3, c.dark, 0.35);
    // 头
    p.outlineBlob(44, 21, 9, 8, c.base, c.dark);
    p.blob(45, 18, 6, 4, c.light);
    // 冠羽
    p.outlineRect(40, 10, 3, 8, evolved ? c.glow : c.light, c.dark);
    p.outlineRect(44, 8, 3, 9, evolved ? c.glow : c.base, c.dark);
    p.rect(45, 9, 1, 4, c.pale, 0.8);
    // 喙
    p.rect(52, 21, 4, 3, c.dark);
    p.rect(53, 22, 6, 2, c.pale);
    p.rect(54, 24, 4, 2, '#8a6a2a');
    // 眼
    p.socket(46, 18);
    // 腿
    p.outlineRect(28, 48, 3, 9, c.base, c.dark);
    p.outlineRect(35, 48, 3, 9, c.base, c.dark);
    p.rect(25, 56, 8, 2, c.dark); p.rect(34, 56, 8, 2, c.dark);
    p.gem(32, 37, c.glow);
    if (evolved) {
      p.rect(0, 24, 3, 9, c.glow); p.rect(61, 24, 3, 9, c.glow);
      p.rect(54, 16, 2, 2, c.pale); p.rect(8, 16, 2, 2, c.pale);
    }
    return p.svg('墨羽雀');
  },

  deer: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    const hoof = '#2a2018';
    p.shadow(31, 58, 18);
    // 四肢（外轮廓 + 蹄）
    [[19, 44], [26, 45], [36, 45], [43, 44]].forEach(function (leg, i) {
      p.outlineRect(leg[0], leg[1], 3, 13, i % 2 ? c.base : c.light, c.dark);
      p.rect(leg[0] - 1, 56, 5, 2, hoof);
    });
    // 身体
    p.outlineBlob(31, 38, 17, 10, c.base, c.dark);
    p.blob(31, 34, 14, 5, c.light);
    p.rect(22, 42, 16, 2, c.pale);
    // 颈
    p.outlineRect(38, 24, 8, 16, c.base, c.dark);
    p.rect(40, 25, 3, 13, c.light);
    // 头
    p.outlineBlob(46, 19, 8, 6, c.base, c.dark);
    p.rect(50, 18, 6, 4, c.base);
    p.rect(51, 20, 5, 2, c.pale);
    p.rect(48, 14, 4, 4, c.light);
    // 耳
    p.outlineRect(41, 11, 4, 7, c.light, c.dark);
    p.rect(42, 12, 2, 4, c.pale);
    // 眼与鼻
    p.socket(47, 16);
    p.rect(56, 20, 2, 2, c.dark);
    // 鹿角（连通的主梁与分叉）
    const antler = evolved ? c.glow : '#d9c69b';
    p.rect(42, 3, 3, 9, c.dark);
    p.rect(38, 1, 6, 3, c.dark); p.rect(38, 1, 2, 2, antler);
    p.rect(34, 4, 6, 3, c.dark); p.rect(34, 4, 2, 2, antler);
    p.rect(47, 3, 3, 9, c.dark);
    p.rect(47, 1, 5, 3, c.dark); p.rect(48, 1, 2, 2, antler);
    p.rect(49, 5, 5, 3, c.dark); p.rect(51, 5, 2, 2, antler);
    p.rect(43, 6, 2, 6, antler); p.rect(48, 6, 1, 5, antler);
    if (evolved) {
      p.rect(31, 1, 4, 3, c.dark); p.rect(31, 1, 2, 2, antler);
      p.rect(54, 2, 4, 3, c.dark); p.rect(55, 2, 2, 2, antler);
      p.rect(41, 10, 2, 2, c.glow); p.rect(49, 9, 2, 2, c.glow);
    }
    // 斑纹
    p.rect(24, 34, 3, 2, c.pale); p.rect(30, 37, 3, 2, c.pale); p.rect(37, 32, 2, 2, c.pale);
    p.gem(31, 37, c.glow);
    return p.svg('青蘅鹿');
  },

  fox: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    const flame = ['#5a1610', '#a82c19', '#e0561f', '#f2a03a', '#ffd76a', '#fff0a6'];
    p.shadow(30, 58, 18);
    // 焰尾：沿曲线堆叠，避免直立方块
    const tail = [[45, 43, 7], [50, 40, 7], [54, 36, 6], [56, 31, 6], [55, 26, 5], [53, 21, 4], [52, 17, 3]];
    tail.forEach(function (t, i) {
      p.blob(t[0], t[1], t[2], t[2] - 1, flame[Math.min(i + 1, 5)]);
    });
    p.blob(48, 41, 4, 3, flame[4]);
    p.blob(55, 29, 3, 3, flame[5]);
    // 尾焰外轮廓（深色背衬）
    p.rect(44, 45, 12, 3, flame[0]);
    p.rect(52, 19, 4, 3, flame[0]);
    if (evolved) {
      p.blob(40, 38, 6, 5, flame[2]);
      p.blob(58, 22, 4, 4, flame[3]);
      p.rect(51, 13, 3, 4, flame[5]);
      p.rect(43, 33, 2, 2, '#fff0a6');
    }
    // 四肢
    [[19, 45], [27, 46], [35, 46]].forEach(function (leg) {
      p.outlineRect(leg[0], leg[1], 3, 11, c.base, c.dark);
    });
    p.rect(17, 55, 6, 2, c.dark); p.rect(34, 55, 6, 2, c.dark);
    // 身体
    p.outlineBlob(29, 42, 15, 9, c.base, c.dark);
    p.blob(28, 46, 10, 3, c.pale);
    p.rect(24, 38, 10, 3, c.light);
    // 头与吻
    p.outlineBlob(44, 28, 9, 7, c.base, c.dark);
    p.blob(45, 25, 6, 4, c.light);
    p.rect(49, 29, 8, 4, c.pale);
    p.rect(55, 30, 3, 2, c.dark);
    p.rect(44, 31, 4, 2, c.pale);
    // 耳
    p.rect(38, 16, 6, 10, c.dark);
    p.rect(39, 17, 4, 7, c.base);
    p.rect(40, 18, 1, 4, c.pale, 0.9);
    p.rect(48, 15, 6, 10, c.dark);
    p.rect(49, 16, 4, 7, c.light);
    p.rect(50, 17, 1, 4, c.pale, 0.9);
    // 眼与额纹
    p.socket(40, 25, '#fff3c0', '#2a120a');
    p.socket(46, 25, '#fff3c0', '#2a120a');
    p.rect(42, 23, 3, 1, c.dark, 0.6);
    p.gem(29, 41, c.glow);
    return p.svg('焰尾狐');
  },

  croc: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 22);
    // 尾
    p.outlineRect(4, 44, 14, 8, c.base, c.dark);
    p.rect(2, 47, 5, 4, c.dark);
    p.rect(8, 45, 8, 2, c.light);
    // 四肢
    p.outlineRect(16, 44, 7, 8, c.base, c.dark);
    p.outlineRect(40, 44, 7, 8, c.base, c.dark);
    p.rect(13, 50, 10, 3, c.dark); p.rect(40, 50, 10, 3, c.dark);
    // 身体
    p.outlineBlob(31, 41, 21, 9, c.base, c.dark);
    p.blob(31, 38, 17, 4, c.light);
    // 背甲棘
    [[13, 34], [20, 31], [27, 30], [34, 32]].forEach(function (sp, i) {
      p.rect(sp[0], sp[1], 5, 9, c.dark);
      p.rect(sp[0] + 1, sp[1] + 2, 2, 6, c.light);
      p.rect(sp[0] + 1, sp[1], 1, 2, c.pale, 0.7);
    });
    // 头与长吻
    p.outlineBlob(46, 41, 10, 7, c.base, c.dark);
    p.outlineRect(51, 41, 11, 5, c.base, c.dark);
    p.rect(52, 44, 9, 2, c.pale);
    p.rect(54, 45, 7, 1, c.dark, 0.7);
    p.socket(47, 37, '#ffe9a8', '#10131a');
    p.rect(45, 35, 8, 3, c.light);
    // 甲纹
    p.rect(20, 44, 4, 2, c.dark); p.rect(30, 45, 4, 2, c.dark); p.rect(39, 44, 4, 2, c.dark);
    p.gem(31, 39, c.glow);
    if (evolved) {
      p.rect(8, 32, 4, 9, c.dark); p.rect(9, 29, 2, 5, c.light);
      p.rect(46, 28, 4, 8, c.dark); p.rect(47, 25, 2, 5, c.light);
      p.rect(14, 43, 34, 2, c.light);
      p.rect(56, 31, 4, 4, c.dark); p.rect(57, 31, 2, 2, c.glow);
    }
    return p.svg('石甲鼍');
  },

  dragon: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 20);
    // 身躯（S 形）与背鳍
    const spine = [[12, 48, 7], [18, 44, 7], [24, 40, 6], [30, 36, 6], [36, 33, 5], [41, 30, 5]];
    spine.forEach(function (s, i) {
      p.outlineBlob(s[0], s[1], s[2], 5, i % 2 ? c.light : c.base, c.dark);
      p.blob(s[0], s[1] - 1, s[2] - 2, 3, c.light);
      p.rect(s[0] - 2, s[1] + 2, 3, 2, c.pale, 0.8);
    });
    [[11, 36], [18, 33], [25, 29], [32, 26], [38, 23]].forEach(function (f) {
      p.rect(f[0], f[1], 4, 8, c.dark);
      p.rect(f[0] + 1, f[1] + 2, 2, 5, c.light);
    });
    // 头
    p.outlineBlob(46, 25, 9, 8, c.base, c.dark);
    p.rect(47, 21, 7, 4, c.light);
    p.outlineRect(52, 24, 9, 5, c.base, c.dark);
    p.rect(53, 27, 8, 2, c.pale);
    p.rect(54, 28, 6, 1, c.dark, 0.6);
    p.socket(49, 22, '#e8fbff', '#0b1620');
    // 龙角
    p.rect(42, 14, 3, 8, c.dark); p.rect(42, 10, 3, 5, c.dark); p.rect(38, 8, 7, 2, c.dark);
    p.rect(48, 12, 3, 8, c.dark); p.rect(48, 8, 3, 5, c.dark); p.rect(50, 6, 6, 2, c.dark);
    p.rect(39, 9, 2, 3, c.light); p.rect(52, 7, 2, 2, c.light);
    // 龙须
    p.rect(55, 31, 6, 2, c.light); p.rect(59, 33, 4, 2, c.pale);
    p.rect(43, 30, 5, 2, c.pale);
    // 尾鳍
    p.rect(5, 50, 8, 3, c.dark); p.rect(3, 53, 9, 3, c.base);
    // 腹甲
    p.rect(18, 43, 10, 3, c.pale); p.rect(24, 38, 9, 3, c.pale); p.rect(30, 33, 7, 2, c.pale);
    p.gem(31, 36, c.glow);
    if (evolved) {
      p.rect(7, 42, 5, 2, c.glow); p.rect(13, 38, 5, 2, c.glow); p.rect(20, 34, 4, 2, c.glow);
      p.rect(34, 19, 3, 3, c.light); p.rect(57, 18, 2, 5, c.light);
      p.rect(24, 20, 3, 2, c.accent || c.glow, 0.8);
    }
    return p.svg('潮汐螭');
  },

  crane: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 15);
    // 长腿
    [[29, 45], [36, 45]].forEach(function (leg) {
      p.outlineRect(leg[0], leg[1], 2, 13, c.base, c.dark);
      p.rect(leg[0] - 2, 56, 5, 2, c.dark);
    });
    // 身体
    p.outlineBlob(31, 39, 14, 9, c.base, c.dark);
    p.blob(32, 35, 10, 5, c.light);
    p.rect(22, 43, 9, 3, c.pale);
    // 长颈
    p.outlineRect(38, 20, 7, 21, c.base, c.dark);
    p.rect(40, 21, 3, 18, c.light);
    p.rect(41, 14, 5, 8, c.base);
    // 头
    p.outlineBlob(45, 11, 7, 5, c.base, c.dark);
    p.rect(49, 10, 9, 2, c.pale);
    p.rect(52, 12, 5, 1, c.dark);
    p.rect(53, 13, 3, 1, '#8a6a2a');
    // 丹冠
    p.rect(42, 4, 5, 3, '#c8381f');
    p.rect(43, 3, 3, 2, '#ef5d4a');
    p.socket(46, 9);
    // 金羽
    p.outlineRect(16, 31, 13, 5, c.light, c.dark);
    p.outlineRect(13, 35, 15, 5, c.base, c.dark);
    p.rect(18, 33, 9, 2, c.glow);
    p.rect(15, 37, 11, 2, c.pale, 0.8);
    p.rect(20, 42, 6, 3, c.light);
    if (evolved) {
      p.rect(41, 2, 2, 4, c.glow); p.rect(37, 5, 4, 2, c.glow);
      p.rect(11, 28, 5, 3, c.glow); p.rect(9, 32, 5, 3, c.pale);
      p.rect(14, 43, 2, 6, c.light); p.rect(23, 44, 2, 7, c.light);
    }
    p.gem(31, 38, c.glow);
    return p.svg('金羽鹮');
  },

  spirit: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 14);
    // 雾脚
    p.blob(32, 47, 12, 5, c.dark);
    p.rect(20, 48, 4, 5, c.dark); p.rect(28, 49, 4, 6, c.dark); p.rect(36, 48, 4, 5, c.dark);
    p.rect(21, 51, 2, 2, c.base); p.rect(37, 51, 2, 2, c.base);
    // 幽体
    p.outlineBlob(32, 33, 12, 14, c.base, c.dark);
    p.blob(32, 34, 9, 10, c.light);
    p.rect(26, 42, 4, 3, c.pale, 0.8);
    p.rect(34, 44, 4, 2, c.pale, 0.6);
    // 头
    p.outlineBlob(32, 23, 10, 9, c.base, c.dark);
    p.rect(27, 17, 11, 5, c.light);
    // 枝角
    p.rect(22, 12, 3, 9, c.dark); p.rect(18, 7, 3, 6, c.dark); p.rect(13, 5, 6, 2, c.dark);
    p.rect(40, 12, 3, 9, c.dark); p.rect(44, 7, 3, 6, c.dark); p.rect(45, 4, 6, 2, c.dark);
    p.rect(19, 8, 1, 3, c.light); p.rect(46, 5, 3, 1, c.light);
    // 发光眼
    p.rect(25, 22, 5, 4, '#0b0d12');
    p.rect(35, 22, 5, 4, '#0b0d12');
    p.rect(26, 23, 3, 2, c.glow);
    p.rect(36, 23, 3, 2, c.glow);
    p.rect(32, 28, 3, 2, c.dark);
    // 雾纹
    p.rect(24, 37, 7, 2, c.light); p.rect(33, 40, 6, 2, c.light);
    if (evolved) {
      p.rect(11, 16, 2, 6, c.glow); p.rect(51, 16, 2, 6, c.glow);
      p.rect(15, 43, 2, 2, c.glow); p.rect(48, 39, 2, 2, c.glow);
      p.rect(29, 11, 2, 3, c.glow); p.rect(38, 13, 2, 3, c.glow);
      p.rect(31, 6, 2, 3, c.pale, 0.7);
    }
    p.gem(32, 32, c.glow);
    return p.svg('幽木魈');
  },

  rhino: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(30, 58, 21);
    // 四肢
    [[15, 45], [25, 46], [36, 46], [45, 45]].forEach(function (leg) {
      p.outlineRect(leg[0], leg[1], 6, 12, c.base, c.dark);
      p.rect(leg[0] - 1, 56, 8, 2, c.dark);
    });
    // 身体
    p.outlineBlob(31, 40, 20, 11, c.base, c.dark);
    p.blob(29, 35, 15, 5, c.light);
    // 头
    p.outlineBlob(46, 36, 11, 9, c.base, c.dark);
    p.blob(45, 33, 7, 4, c.light);
    p.outlineRect(53, 33, 7, 9, c.base, c.dark);
    p.rect(54, 36, 6, 3, c.pale);
    p.rect(55, 39, 4, 1, c.dark, 0.7);
    p.socket(47, 31, '#ffe9a8', '#10131a');
    // 独角
    p.rect(51, 22, 6, 10, c.dark);
    p.rect(52, 18, 5, 6, c.dark);
    p.rect(53, 13, 4, 6, c.light);
    p.rect(54, 10, 3, 4, c.glow);
    p.rect(54, 11, 1, 2, '#ffffff');
    // 耳
    p.outlineRect(38, 27, 5, 6, c.base, c.dark);
    p.rect(39, 28, 2, 3, c.light);
    // 星纹与甲板
    p.rect(20, 37, 4, 3, c.pale); p.rect(29, 33, 3, 2, c.glow); p.rect(37, 40, 4, 2, c.pale);
    p.rect(14, 32, 10, 2, c.dark, 0.4);
    p.rect(24, 29, 14, 2, c.dark, 0.3);
    p.gem(46, 35, c.glow);
    if (evolved) {
      p.rect(28, 22, 9, 3, c.light); p.rect(30, 19, 5, 3, c.glow);
      p.rect(11, 34, 6, 2, c.light); p.rect(13, 38, 4, 2, c.pale);
      p.rect(42, 18, 3, 3, c.glow);
    }
    return p.svg('星犀');
  },

  mermaid: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    const skin = '#b8e6e2';
    const hair = '#c05668';
    const hairDark = '#8a3b52';
    p.shadow(32, 58, 17);
    // 尾鳍：左右展开的扇形
    p.outlineRect(24, 50, 8, 5, c.base, c.dark);
    p.rect(14, 52, 10, 5, c.dark); p.rect(40, 52, 10, 5, c.dark);
    p.rect(15, 53, 8, 3, c.light); p.rect(41, 53, 8, 3, c.light);
    p.rect(17, 55, 5, 2, c.pale); p.rect(42, 55, 5, 2, c.pale);
    p.rect(27, 49, 11, 3, c.pale);
    // 尾身：S 形
    const spine = [[32, 45, 7, 6], [31, 40, 7, 5], [32, 35, 6, 4]];
    spine.forEach(function (s, i) {
      p.outlineBlob(s[0], s[1], s[2], s[3], i % 2 ? c.light : c.base, c.dark);
    });
    p.rect(29, 40, 2, 2, c.pale); p.rect(34, 44, 2, 2, c.pale); p.rect(30, 47, 2, 2, c.pale);
    // 上身与鳞衣
    p.outlineBlob(32, 28, 7, 9, skin, c.dark);
    p.blob(32, 30, 6, 5, c.base);
    p.rect(28, 30, 8, 2, c.light);
    p.rect(29, 34, 2, 2, c.pale);
    // 左臂上举，右臂轻垂
    p.outlineRect(24, 20, 3, 10, skin, c.dark);
    p.rect(25, 19, 4, 3, c.pale);
    p.outlineRect(38, 24, 3, 11, skin, c.dark);
    p.rect(37, 33, 4, 3, c.pale);
    // 长发
    p.rect(23, 8, 5, 13, hairDark);
    p.rect(25, 6, 8, 4, hair);
    p.rect(36, 7, 5, 13, hairDark);
    p.rect(34, 5, 7, 4, hair);
    p.rect(24, 18, 2, 6, hairDark);
    p.rect(38, 18, 2, 6, hairDark);
    // 头与面
    p.outlineBlob(32, 14, 8, 7, skin, c.dark);
    p.rect(27, 10, 10, 4, hair, 0.9);
    p.rect(28, 15, 8, 5, skin);
    p.socket(28, 15, '#e8fbff', '#10131a');
    p.socket(34, 15, '#e8fbff', '#10131a');
    p.rect(31, 20, 3, 1, hairDark);
    // 发饰
    p.rect(39, 9, 3, 3, c.glow);
    p.rect(22, 10, 2, 2, c.pale);
    if (evolved) {
      p.rect(45, 20, 3, 8, c.glow, 0.8);
      p.rect(18, 24, 2, 6, c.glow, 0.6);
      p.rect(30, 3, 2, 3, c.pale);
      p.rect(42, 5, 2, 2, c.glow);
      p.gem(32, 31, c.glow);
    }
    return p.svg('归墟鲛');
  },

  clam: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(32, 58, 20);
    // 下壳
    p.outlineBlob(32, 45, 20, 9, '#7d6b93', c.dark);
    p.blob(32, 43, 18, 7, '#b9a5c9');
    p.rect(14, 44, 36, 3, '#d8c7e4');
    // 上壳
    p.outlineBlob(32, 33, 20, 15, '#9c89b5', c.dark);
    p.blob(32, 30, 17, 12, '#c4b0d6');
    p.blob(32, 24, 13, 8, '#ddd0e8');
    // 壳纹
    for (let i = 0; i < 5; i += 1) {
      const x = 16 + i * 7;
      p.rect(x, 21 + (i % 2) * 3, 2, 15 - (i % 3) * 2, i % 2 ? '#8a76a3' : '#a08ab8');
    }
    p.rect(15, 37, 34, 2, '#7d6b93');
    // 珍珠与小眼
    p.outlineBlob(32, 34, 8, 7, c.glow, c.dark);
    p.blob(32, 33, 6, 5, '#fff6d6');
    p.rect(30, 31, 3, 2, '#ffffff');
    p.socket(27, 32, '#10131a', '#ffffff');
    p.socket(35, 32, '#10131a', '#ffffff');
    // 水光
    p.rect(10, 24, 3, 2, c.pale); p.rect(50, 19, 2, 2, c.pale);
    p.rect(7, 33, 2, 2, c.light);
    if (evolved) {
      p.rect(21, 10, 3, 3, c.glow); p.rect(38, 8, 2, 2, c.glow);
      p.rect(46, 13, 3, 2, c.light);
      p.rect(11, 44, 4, 4, c.light); p.rect(49, 43, 4, 4, c.light);
    }
    return p.svg('云梦蜃贝');
  },

  badger: function (el, evolved) {
    const p = new PixelCanvas();
    const c = elementPalette(el);
    p.shadow(30, 58, 18);
    // 焰尾
    p.rect(42, 41, 12, 8, '#5a1610');
    p.rect(47, 36, 10, 8, '#a82c19');
    p.rect(50, 31, 8, 7, '#e0561f');
    p.rect(52, 27, 6, 6, '#f2a03a');
    p.rect(54, 23, 5, 5, '#ffd76a');
    if (evolved) {
      p.rect(56, 19, 3, 5, '#fff0a6');
      p.rect(44, 33, 7, 5, '#e0561f');
    }
    // 四肢
    [[17, 47], [28, 48], [39, 48]].forEach(function (leg) {
      p.outlineRect(leg[0], leg[1], 5, 9, '#3c3a42', c.dark);
    });
    p.rect(15, 55, 9, 2, c.dark);
    // 身体
    p.outlineBlob(30, 43, 17, 8, '#3c3a42', c.dark);
    p.rect(20, 39, 17, 3, '#6b6673');
    p.rect(24, 45, 12, 2, '#4d4a55');
    // 头
    p.outlineBlob(16, 37, 9, 8, '#2b2a30', c.dark);
    // 耳
    p.outlineRect(9, 32, 4, 6, c.dark, c.dark);
    p.rect(10, 33, 2, 3, '#e6e0cf');
    p.outlineRect(19, 31, 4, 6, c.dark, c.dark);
    p.rect(20, 32, 2, 3, '#e6e0cf');
    // 白面纹
    p.rect(13, 32, 8, 3, '#e6e0cf');
    p.rect(12, 35, 4, 5, '#e6e0cf');
    p.rect(17, 39, 6, 2, '#e6e0cf');
    p.socket(12, 35, '#ffcf6a', '#10131a');
    p.rect(8, 39, 6, 2, c.dark);
    // 甲纹
    p.rect(28, 40, 3, 2, '#e6e0cf'); p.rect(35, 43, 3, 2, '#e6e0cf');
    p.gem(30, 43, c.glow);
    if (evolved) {
      p.rect(38, 35, 4, 4, '#f2a03a'); p.rect(41, 32, 3, 3, '#ffd76a');
      p.rect(48, 39, 2, 2, '#fff0a6');
    }
    return p.svg('烬尾獾');
  },
};

function beastSvg(art, el, bigger, evolved) {
  const fn = BEAST_ART[art] || BEAST_ART.spirit;
  const svg = fn(el, !!evolved);
  return '<div class="beast-svg el-' + el + (bigger ? ' big' : '') + (evolved ? ' evolved' : '') + '">' +
    (evolved ? '<span class="evo-aura" aria-hidden="true"></span>' : '') + svg + '</div>';
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
