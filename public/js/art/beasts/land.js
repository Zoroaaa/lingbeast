// 灵兽录 · 走兽家族（20 种）
// 鹿 / 狐 / 獾 / 鼬 / 犀，每只独立 style。

registerBeast('qingheng', {
  family: 'deer', idle: 'sway',
  palette: pal('#1a2418', '#2f4a2c', '#5a8a4a', '#8ac46a', '#d8f0a8', '#dcff9a', '#d9c69b'),
  body: { x: 30, y: 38, w: 26, h: 18 }, head: { x: 46, y: 19, w: 14, h: 12 },
  horns: { kind: 'branch', len: 12, count: 2 },
  pattern: { kind: 'spots', zone: [19, 31, 24, 10] }, scale: 1,
  signature: 'vineAntlers',
});

registerBeast('qingling', {
  family: 'deer', idle: 'sway',
  palette: pal('#16240f', '#2f5a24', '#4f9a3a', '#8ad85a', '#e0ffa0', '#dcff9a', '#c8f0d0'),
  body: { x: 30, y: 38, w: 28, h: 19 }, head: { x: 46, y: 18, w: 14, h: 12 },
  horns: { kind: 'branch', len: 16, count: 2 },
  pattern: { kind: 'glow', zone: [18, 31, 26, 11] }, scale: 1.03,
  signature: 'vineAntlers',
});

registerBeast('xianyao', {
  family: 'deer', idle: 'sway',
  palette: pal('#20261a', '#4a5a2a', '#8a9a4a', '#b8d070', '#f0f8c0', '#fff3c0', '#c87a4a'),
  body: { x: 30, y: 38, w: 25, h: 17 }, head: { x: 46, y: 19, w: 14, h: 12 },
  horns: { kind: 'branch', len: 11, count: 2 },
  pattern: { kind: 'spots', zone: [19, 31, 22, 10] }, scale: 1,
  signature: 'herbPouch',
});

registerBeast('shanhu', {
  family: 'deer', idle: 'sway',
  palette: pal('#2a1820', '#5a2a3a', '#a84a5a', '#e08a9a', '#ffe0e8', '#ffd8ef', '#68c8c8'),
  body: { x: 30, y: 38, w: 26, h: 18 }, head: { x: 46, y: 19, w: 14, h: 12 },
  horns: { kind: 'coral', len: 10, count: 2 },
  pattern: { kind: 'spots', zone: [19, 31, 24, 10] }, scale: 1,
  signature: 'coralAntlers',
});

registerBeast('shanhuxian', {
  family: 'deer', idle: 'sway',
  palette: pal('#2a1420', '#6a2a3a', '#c85a6a', '#f0a0b0', '#fff0f4', '#ffd8ef', '#68c8c8'),
  body: { x: 30, y: 38, w: 28, h: 19 }, head: { x: 46, y: 18, w: 14, h: 12 },
  horns: { kind: 'coral', len: 14, count: 2 },
  pattern: { kind: 'glow', zone: [18, 31, 26, 11] }, scale: 1.03,
  signature: 'coralAntlers',
});

registerBeast('yanwei', {
  family: 'fox', idle: 'sway',
  palette: pal('#2a120a', '#6a2414', '#c84a24', '#f08a3a', '#ffd76a', '#fff0a6', '#fff6d6'),
  body: { x: 28, y: 42, w: 24, h: 16 }, head: { x: 44, y: 28, w: 16, h: 13 },
  ears: { kind: 'point', size: 8 }, tail: { kind: 'flame', len: 18, count: 1 },
  scale: 1, signature: 'flameTips',
});

registerBeast('jiuyan', {
  family: 'fox', idle: 'float',
  palette: pal('#2a1810', '#7a3a1a', '#d88a2a', '#f8c85a', '#fff4c0', '#fff0a6', '#ffffff'),
  body: { x: 28, y: 41, w: 26, h: 18 }, head: { x: 45, y: 27, w: 16, h: 13 },
  ears: { kind: 'point', size: 9 }, tail: { kind: 'multi', len: 13, count: 9 },
  pattern: { kind: 'glow', zone: [18, 35, 20, 11] }, scale: 1.05,
  signature: 'nineTails',
});

registerBeast('chier', {
  family: 'fox', idle: 'sway',
  palette: pal('#2a2018', '#7a4a32', '#c88a5a', '#e8b888', '#fff0d8', '#ffe08a', '#c8381f'),
  body: { x: 28, y: 42, w: 22, h: 15 }, head: { x: 44, y: 29, w: 15, h: 12 },
  ears: { kind: 'long', size: 10 }, tail: { kind: 'bushy', len: 12, count: 1 },
  pattern: { kind: 'sand', zone: [18, 36, 18, 9] }, scale: 0.96,
  signature: 'redEars',
});

registerBeast('danxin', {
  family: 'fox', idle: 'sway',
  palette: pal('#2a1414', '#6a2a2a', '#c85a5a', '#e8a0a0', '#fff0f0', '#fff0a6', '#f2d06a'),
  body: { x: 28, y: 42, w: 24, h: 16 }, head: { x: 44, y: 28, w: 16, h: 13 },
  ears: { kind: 'point', size: 8 }, tail: { kind: 'bushy', len: 14, count: 1 },
  scale: 1, signature: 'heartMark',
});

registerBeast('feiyan', {
  family: 'fox', idle: 'sway',
  palette: pal('#2a0e20', '#6a1a4a', '#c82a7a', '#f07ab0', '#ffd0e8', '#ffd8ef', '#f2d06a'),
  body: { x: 28, y: 41, w: 26, h: 17 }, head: { x: 45, y: 27, w: 16, h: 13 },
  ears: { kind: 'point', size: 9 }, tail: { kind: 'flame', len: 20, count: 1 },
  pattern: { kind: 'glow', zone: [18, 35, 20, 10] }, scale: 1.03,
  signature: 'flameTips',
});

registerBeast('chisha', {
  family: 'fox', idle: 'sway',
  palette: pal('#2a2010', '#7a5a2a', '#c8a050', '#e8c880', '#fff0c0', '#ffe08a', '#c86a3a'),
  body: { x: 28, y: 42, w: 22, h: 15 }, head: { x: 44, y: 29, w: 15, h: 12 },
  ears: { kind: 'long', size: 9 }, tail: { kind: 'ringed', len: 13, count: 1 },
  pattern: { kind: 'sand', zone: [18, 36, 18, 9] }, scale: 0.96,
  signature: 'ringedTail',
});

registerBeast('jinta', {
  family: 'badger', idle: 'sway',
  palette: pal('#1c1a20', '#33323a', '#5a5662', '#8a8494', '#e6e0cf', '#ffcf6a', '#c8381f'),
  body: { x: 28, y: 43, w: 28, h: 14 }, head: { x: 44, y: 36, w: 14, h: 12 },
  tail: { kind: 'ember', len: 12, count: 1 },
  pattern: { kind: 'mask', zone: [14, 34, 22, 12] }, scale: 1,
  signature: 'emberTail',
});

registerBeast('fengli', {
  family: 'badger', idle: 'sway',
  palette: pal('#1a2a20', '#355a40', '#6a9a7a', '#a8d0b0', '#e8f8e0', '#dcff9a', '#c8f0d0'),
  body: { x: 28, y: 43, w: 24, h: 14 }, head: { x: 44, y: 36, w: 14, h: 12 },
  tail: { kind: 'wind', len: 14, count: 1 },
  scale: 0.98, signature: 'windSwirl',
});

registerBeast('tongxu', {
  family: 'badger', idle: 'sway',
  palette: pal('#2a1c10', '#6a4a20', '#a86a32', '#d8a050', '#f6e0b0', '#ffe08a', '#c8a25a'),
  body: { x: 28, y: 40, w: 24, h: 15 }, head: { x: 43, y: 32, w: 14, h: 13 },
  legs: { len: 8, thick: 2, count: 2 }, tail: { kind: 'bushy', len: 10, count: 1 },
  scale: 0.96, signature: 'whiskers',
});

registerBeast('jinxu', {
  family: 'badger', idle: 'sway',
  palette: pal('#2a2008', '#7a5a10', '#d8a828', '#f8d860', '#fff8c0', '#ffe08a', '#f2d06a'),
  body: { x: 28, y: 43, w: 28, h: 13 }, head: { x: 44, y: 36, w: 14, h: 12 },
  tail: { kind: 'bushy', len: 13, count: 1 },
  pattern: { kind: 'glow', zone: [14, 34, 24, 11] }, scale: 1.03,
  signature: 'whiskers',
});

registerBeast('xingxi', {
  family: 'rhino', idle: 'sway',
  palette: pal('#1a1628', '#2e2a4a', '#5a5a8a', '#8a8ac0', '#e8e8ff', '#c8e8ff', '#f2d06a'),
  body: { x: 30, y: 40, w: 34, h: 18 }, head: { x: 47, y: 35, w: 14, h: 11 },
  horns: { kind: 'single', len: 11, count: 1 },
  pattern: { kind: 'star', zone: [14, 31, 30, 12] }, scale: 1.02,
  signature: 'starHide',
});

registerBeast('yanbei', {
  family: 'rhino', idle: 'sway',
  palette: pal('#1e1a16', '#3a3228', '#7a6a52', '#a89a7e', '#e8dcc0', '#ffe7b0', '#8ad0ff'),
  body: { x: 30, y: 40, w: 34, h: 18 }, head: { x: 47, y: 35, w: 14, h: 11 },
  horns: { kind: 'single', len: 8, count: 1 }, scale: 1.02,
  signature: 'rockPlates',
});

registerBeast('panyan', {
  family: 'rhino', idle: 'sway',
  palette: pal('#16140f', '#332e24', '#6a604a', '#968a70', '#d8d0b8', '#ffe7b0', '#8ad0ff'),
  body: { x: 30, y: 40, w: 36, h: 19 }, head: { x: 47, y: 35, w: 14, h: 11 },
  horns: { kind: 'double', len: 9, count: 2 }, scale: 1.05,
  signature: 'rockPlates',
});

registerBeast('yueji', {
  family: 'rhino', idle: 'sway',
  palette: pal('#18201a', '#3a4a32', '#6a7a52', '#9aa87a', '#e0e8c0', '#ffe7b0', '#c8f0d0'),
  body: { x: 30, y: 40, w: 38, h: 20 }, head: { x: 47, y: 35, w: 14, h: 11 },
  horns: { kind: 'single', len: 14, count: 1 }, scale: 1.06,
  signature: 'mountainRidge',
});

registerBeast('jiuzhangshou', {
  family: 'rhino', idle: 'sway',
  palette: pal('#18241c', '#2f4a2c', '#4a7a4a', '#7aa86a', '#d8f0b8', '#dcff9a', '#f2d06a'),
  body: { x: 30, y: 40, w: 38, h: 20 }, head: { x: 47, y: 35, w: 14, h: 11 },
  horns: { kind: 'ninePeaks', len: 12, count: 9 },
  pattern: { kind: 'glow', zone: [14, 31, 32, 13] }, scale: 1.08,
  signature: 'ninePeaks',
});
