// 灵兽录 · 程序化角色 sprite sheet
// 5 身形 × 衣色 / 发色 / 肤色 / 点缀色；16×16 帧，64×112 图，帧序与旧素材一致。

const CHAR_BODIES = ['villager', 'guard', 'traveler', 'child', 'elder'];
const CHAR_ROBES = [
  '#2f4a6b', '#8a4a32', '#4a6b45', '#9a7438', '#6b3f5a', '#2f6b6b',
  '#4a5560', '#d8c8a8', '#6b4f38', '#35584a', '#8a5a64', '#33343a',
];
const CHAR_HAIR = ['#1a1a20', '#3a2a20', '#5a4030', '#7a7a78', '#d8d4c8', '#6a3a28'];
const CHAR_SKIN = ['#e8c8a8', '#d8b090', '#b88868'];

const CHAR_REGION_POOLS = {
  shanmen: [7, 8, 3], qingxi: [2, 9, 3], wuyin: [2, 9, 5], luoxing: [3, 1, 7],
  guixu: [5, 6, 7], yunmeng: [2, 4, 5], gutan: [1, 8, 3], shenyuan: [6, 11, 7],
  yunzhan: [3, 6, 7], xuangu: [6, 11, 5], chenyu: [5, 6, 7], jiuzhang: [2, 9, 3],
  yaopu: [2, 3, 8], anshi: [11, 6, 1], rongku: [1, 8, 3], jingdi: [6, 9, 5],
  xingkeng: [6, 11, 3], shihai: [6, 7, 8], beilin: [6, 7, 3],
};

function npcLook(npc, regionId, index) {
  const n = npc || {};
  const id = String(n.id || 'npc');
  const h = artHash(id + ':' + (regionId || '') + ':' + (n.sprite || ''));
  const name = String(n.name || '');
  let body = 'villager';
  if (n.scale && n.scale <= 2.05) body = 'child';
  else if (/老|婆|翁|丈|隐者|僧|先生|读碑/.test(name)) body = 'elder';
  else if (/守|卫|巡|哨/.test(name)) body = 'guard';
  else if (n.sprite === 'ninja_blue') body = 'traveler';
  else {
    const r = h % 100;
    body = r < 60 ? 'villager' : r < 85 ? 'guard' : 'elder';
  }
  const pool = CHAR_REGION_POOLS[regionId] || [2, 5, 6, 7, 8];
  const robe = CHAR_ROBES[pool[(h + (index || 0) * 3) % pool.length]];
  const hair = CHAR_HAIR[(artHash(id + ':hair') % CHAR_HAIR.length)];
  const skin = CHAR_SKIN[(artHash(id + ':skin') % CHAR_SKIN.length)];
  let accent = '#c86a5a';
  if (n.tint != null) {
    const hex = ('000000' + Number(n.tint).toString(16)).slice(-6);
    accent = '#' + hex;
  }
  return {
    body: body,
    robe: robe,
    robeDark: shadeHex(robe, 0.62),
    robeLight: shadeHex(robe, 1.24),
    hair: hair,
    hairDark: shadeHex(hair, 0.65),
    skin: skin,
    skinDark: shadeHex(skin, 0.82),
    accent: accent,
  };
}

function characterTextureKey(regionId, npc, index) {
  return 'npc:' + (regionId || 'region') + ':' + String((npc && npc.id) || 'npc') + ':' + (index || 0);
}

const CHAR_SHEET_CACHE = {};

function charPx(c, x, y, w, h, color) {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}

function charBox(c, x, y, w, h, fill, outline) {
  if (outline) charPx(c, x - 1, y - 1, w + 2, h + 2, outline);
  charPx(c, x, y, w, h, fill);
}

const CHAR_INK = '#141018';
const CHAR_BOOT = '#2a2018';
const CHAR_METAL = '#8a9aa8';
const CHAR_METAL_DARK = '#5a6a78';
const CHAR_WOOD = '#7a5836';
const CHAR_WHITE = '#e8e0cc';

function drawCharFrame(c, ox, oy, look, dir, frame) {
  const step = frame === 1 ? 1 : frame === 3 ? -1 : 0;
  const bob = step !== 0 ? -1 : 0;
  const body = look.body;
  const isChild = body === 'child';
  const isElder = body === 'elder';
  const isGuard = body === 'guard';
  const isTraveler = body === 'traveler';
  const skin = look.skin;
  const skinDark = look.skinDark;
  const robe = look.robe;
  const robeDark = look.robeDark;
  const robeLight = look.robeLight;
  const hair = look.hair;
  const hairDark = look.hairDark;
  const accent = look.accent;
  const side = dir === 'side';

  /* 腿与靴 */
  const legY = isChild ? 12 : 12;
  const legH = isChild ? 2 : 3;
  const lx1 = side ? 6 : 5;
  const lx2 = side ? 9 : 9;
  if (side) {
    charBox(c, ox + lx1 + (step > 0 ? 1 : 0), oy + legY, 2, legH, robeDark, CHAR_INK);
    charBox(c, ox + lx2 + (step < 0 ? 1 : 0), oy + legY, 2, legH, robeDark, CHAR_INK);
    charPx(c, ox + lx1 + (step > 0 ? 1 : 0) - 1, oy + legY + legH, 4, 2, CHAR_BOOT);
    charPx(c, ox + lx2 + (step < 0 ? 1 : 0) - 1, oy + legY + legH, 4, 2, CHAR_BOOT);
  } else {
    charBox(c, ox + lx1, oy + legY + (step > 0 ? 1 : 0), 2, legH, robeDark, CHAR_INK);
    charBox(c, ox + lx2, oy + legY + (step < 0 ? 1 : 0), 2, legH, robeDark, CHAR_INK);
    charPx(c, ox + lx1 - 1, oy + legY + legH + (step > 0 ? 1 : 0), 4, 2, CHAR_BOOT);
    charPx(c, ox + lx2 - 1, oy + legY + legH + (step < 0 ? 1 : 0), 4, 2, CHAR_BOOT);
  }

  /* 躯干 */
  let bx = 4;
  let by = 7 + bob;
  let bw = 8;
  let bh = 6;
  if (isChild) { bx = 5; by = 9 + bob; bw = 6; bh = 4; }
  else if (isElder) { bx = 4; by = 8 + bob; bw = 9; bh = 5; }
  else if (isTraveler) { bx = 4; by = 7 + bob; bw = 9; bh = 6; }
  else if (isGuard) { bx = 4; by = 7 + bob; bw = 8; bh = 5; }
  if (side) { bx = isChild ? 6 : 5; bw = isChild ? 5 : 6; }
  charBox(c, ox + bx, oy + by, bw, bh, robe, CHAR_INK);
  charPx(c, ox + bx + 2, oy + by + 1, 1, bh - 2, robeLight);
  if (dir === 'up') charPx(c, ox + bx + Math.floor(bw / 2), oy + by + 1, 1, bh - 2, robeDark);

  /* 下摆 */
  const lowerY = by + bh;
  const lowerX = bx - (isChild ? 1 : 1);
  const lowerW = bw + (isChild ? 2 : 2);
  charBox(c, ox + lowerX, oy + lowerY, lowerW, isChild ? 2 : 2, robeDark, CHAR_INK);
  charPx(c, ox + lowerX + 1, oy + lowerY, lowerW - 2, 1, robe);

  /* 腰带 / 点缀 */
  const sashY = by + (isChild ? 2 : isGuard ? 3 : 4);
  charPx(c, ox + bx, oy + sashY, bw, 1, accent);
  if (dir !== 'up') {
    charPx(c, ox + bx + Math.floor(bw / 2) - 1, oy + sashY, 2, 2, accent);
    charPx(c, ox + bx + Math.floor(bw / 2), oy + sashY + 1, 1, 1, look.robeDark);
  }

  if (isGuard) {
    charPx(c, ox + bx + 1, oy + by + 1, bw - 2, 2, CHAR_METAL);
    charPx(c, ox + bx + 1, oy + by + 2, bw - 2, 1, CHAR_METAL_DARK);
    charPx(c, ox + bx + 2, oy + by + 1, 1, 1, CHAR_WHITE);
    for (let i = 0; i < 3; i += 1) charPx(c, ox + bx + 1 + i * 3, oy + by + 4, 1, 1, CHAR_METAL);
  }
  if (isTraveler) {
    charPx(c, ox + bx, oy + by, bw, 1, robeDark);
    charPx(c, ox + bx + 1, oy + by + 1, bw - 2, 1, accent);
    charPx(c, ox + bx - 1, oy + by + 3, 1, 3, robeDark);
  }

  /* 手臂 */
  const armY = by + (isChild ? 1 : 1);
  const armH = isChild ? 3 : 4;
  if (side) {
    charBox(c, ox + 10, oy + armY + (step < 0 ? 1 : 0), 2, armH, isTraveler ? robeDark : robe, CHAR_INK);
    charPx(c, ox + 10, oy + armY + armH + (step < 0 ? 1 : 0), 2, 1, skin);
  } else {
    const lx = bx - 2;
    const rx = bx + bw;
    charBox(c, ox + lx, oy + armY + (step > 0 ? 1 : 0), 2, armH, isTraveler ? robeDark : robe, CHAR_INK);
    charBox(c, ox + rx, oy + armY + (step < 0 ? 1 : 0), 2, armH, isTraveler ? robeDark : robe, CHAR_INK);
    charPx(c, ox + lx, oy + armY + armH + (step > 0 ? 1 : 0), 2, 1, skin);
    charPx(c, ox + rx, oy + armY + armH + (step < 0 ? 1 : 0), 2, 1, skin);
    if (isGuard) {
      charPx(c, ox + lx - 1, oy + armY + 1 + (step > 0 ? 1 : 0), 3, 2, CHAR_METAL);
      charPx(c, ox + rx, oy + armY + 1 + (step < 0 ? 1 : 0), 3, 2, CHAR_METAL);
    }
  }

  /* 头 */
  const headY = isChild ? 3 + bob : isElder ? 3 + bob : 2 + bob;
  const headX = side ? 6 : 5;
  const headW = side ? 5 : isElder ? 5 : 6;
  const headH = isChild ? 5 : 6;
  if (isTraveler) {
    // 兜帽
    charBox(c, ox + 4, oy + headY - 1, 8, headH + 1, robeDark, CHAR_INK);
    charPx(c, ox + 5, oy + headY, 6, 2, robe);
    charPx(c, ox + 6, oy + headY + 2, 4, isChild ? 2 : 3, skin);
    if (dir !== 'up') {
      charPx(c, ox + 6, oy + headY + 3, 1, 1, CHAR_INK);
      charPx(c, ox + 9, oy + headY + 3, 1, 1, CHAR_INK);
    }
    charPx(c, ox + 5, oy + headY + 5, 6, 1, accent);
  } else {
    charBox(c, ox + headX, oy + headY, headW, headH, skin, CHAR_INK);
    // 头发
    charPx(c, ox + headX, oy + headY - 1, headW, 2, hair);
    charPx(c, ox + headX, oy + headY, 1, Math.max(2, headH - 2), hairDark);
    charPx(c, ox + headX + headW - 1, oy + headY, 1, Math.max(2, headH - 2), hairDark);
    charPx(c, ox + headX + 1, oy + headY - 1, 2, 1, look.robeLight);
    if (dir === 'up') {
      charPx(c, ox + headX, oy + headY, headW, headH - 1, hair);
      charPx(c, ox + headX + 1, oy + headY + 1, 1, headH - 2, hairDark);
    } else if (side) {
      charPx(c, ox + headX + 1, oy + headY + 2, 3, isChild ? 2 : 3, skin);
      charPx(c, ox + headX + 3, oy + headY + 3, 1, 1, CHAR_INK);
      charPx(c, ox + headX + 4, oy + headY + 3, 1, 1, skinDark);
      charPx(c, ox + headX, oy + headY + 1, 2, headH - 2, hair);
    } else {
      charPx(c, ox + headX + 1, oy + headY + 2, 4, isChild ? 2 : 3, skin);
      charPx(c, ox + headX + 1, oy + headY + 3, 1, 1, CHAR_INK);
      charPx(c, ox + headX + 4, oy + headY + 3, 1, 1, CHAR_INK);
      charPx(c, ox + headX + 2, oy + headY + 5, 2, 1, skinDark);
    }
    if (isElder) {
      charPx(c, ox + headX, oy + headY - 1, headW, 2, CHAR_WHITE);
      charPx(c, ox + headX + 1, oy + headY + headH - 1, headW - 2, 3, CHAR_WHITE);
      charPx(c, ox + headX + 1, oy + headY + headH, headW - 2, 1, '#c8c4b8');
    }
    if (isGuard) {
      charPx(c, ox + headX - 1, oy + headY - 2, headW + 2, 2, CHAR_METAL);
      charPx(c, ox + headX - 1, oy + headY - 1, headW + 2, 1, CHAR_METAL_DARK);
      charPx(c, ox + headX + 2, oy + headY - 3, 2, 1, accent);
      charPx(c, ox + headX - 2, oy + headY, 1, 2, CHAR_METAL);
      charPx(c, ox + headX + headW + 1, oy + headY, 1, 2, CHAR_METAL);
    }
  }

  /* 长者木杖 */
  if (isElder) {
    const sx = side ? 2 : 13;
    charPx(c, ox + sx, oy + 3, 1, 12, CHAR_WOOD);
    charPx(c, ox + sx, oy + 3, 1, 1, '#b08a5a');
    charPx(c, ox + sx - 1, oy + 2, 3, 2, '#8ad0a8');
    charPx(c, ox + sx, oy + 2, 1, 1, CHAR_WHITE);
  }
}

function sheetForLook(look) {
  const key = [look.body, look.robe, look.hair, look.skin, look.accent].join('|');
  if (CHAR_SHEET_CACHE[key]) return CHAR_SHEET_CACHE[key];
  const cv = document.createElement('canvas');
  cv.width = 64;
  cv.height = 112;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, 64, 112);
  const dirs = ['down', 'up', 'side'];
  dirs.forEach(function (dir, row) {
    for (let col = 0; col < 4; col += 1) {
      drawCharFrame(c, col * 16, row * 16, look, dir, col);
    }
  });
  const url = cv.toDataURL('image/png');
  CHAR_SHEET_CACHE[key] = url;
  return url;
}

function characterSheetDataURL(npc, regionId, index) {
  return sheetForLook(npcLook(npc, regionId, index));
}

function heroSheetDataURL() {
  return sheetForLook({
    body: 'guard',
    robe: '#2f4a6b',
    robeDark: shadeHex('#2f4a6b', 0.62),
    robeLight: shadeHex('#2f4a6b', 1.24),
    hair: '#1a1a20',
    hairDark: shadeHex('#1a1a20', 0.65),
    skin: '#e8c8a8',
    skinDark: shadeHex('#e8c8a8', 0.82),
    accent: '#f2d06a',
  });
}

// 标题页主角：用 CSS 变量注入第一帧
if (typeof document !== 'undefined' && document.documentElement) {
  try {
    document.documentElement.style.setProperty('--hero-sheet', 'url("' + heroSheetDataURL() + '")');
  } catch (e) { /* 忽略标题页注入失败 */ }
}
