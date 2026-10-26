// 灵兽录 · 精怪家族（10 种）
// 魈 / 童 / 魇 / 翁 / 猿 / 藤，每只独立 style。

registerBeast('youmu', {
  family: 'spirit', idle: 'float',
  palette: pal('#0f1a12', '#243a26', '#4a7a4a', '#7fc46a', '#d8ffb0', '#dcff9a', '#8ae0c8'),
  body: { x: 32, y: 36, w: 22, h: 24 }, head: { x: 32, y: 21, w: 16, h: 14 },
  horns: { kind: 'branch', len: 10, count: 2 },
  pattern: { kind: 'moss', zone: [24, 28, 18, 16] }, scale: 1,
  signature: 'branchAntlers',
});

registerBeast('taiyi', {
  family: 'spirit', idle: 'float',
  palette: pal('#1a2414', '#33501e', '#5a8a2a', '#8ac84a', '#d8f8a0', '#dcff9a', '#c8f0d0'),
  body: { x: 32, y: 38, w: 18, h: 20 }, head: { x: 32, y: 22, w: 15, h: 13 },
  horns: { kind: 'none' }, shape: 'cloak', tendrils: { count: 3, len: 6 },
  pattern: { kind: 'moss', zone: [24, 30, 16, 14] }, scale: 0.94,
  signature: 'mossCloak',
});

registerBeast('linyan', {
  family: 'spirit', idle: 'float',
  palette: pal('#0a0e0c', '#1a2a1e', '#2f4a32', '#5a7a4a', '#a8c090', '#ff8a5a', '#c8381f'),
  body: { x: 32, y: 35, w: 24, h: 26 }, head: { x: 32, y: 20, w: 16, h: 14 },
  horns: { kind: 'branch', len: 12, count: 2 }, eyes: { mode: 'many' },
  pattern: { kind: 'moss', zone: [23, 27, 18, 18] }, scale: 1.04,
  signature: 'manyEyes',
});

registerBeast('senluo', {
  family: 'spirit', idle: 'float',
  palette: pal('#0e1a10', '#1f3a22', '#3a6a2a', '#6a9a4a', '#c8e8a0', '#dcff9a', '#f2d06a'),
  body: { x: 32, y: 34, w: 26, h: 28 }, head: { x: 32, y: 19, w: 17, h: 15 },
  horns: { kind: 'branch', len: 16, count: 2 }, eyes: { mode: 'many' },
  pattern: { kind: 'moss', zone: [22, 26, 20, 20] }, scale: 1.08,
  signature: 'forestCrown',
});

registerBeast('taishi', {
  family: 'spirit', idle: 'float',
  palette: pal('#1a1a16', '#35352e', '#6a6a5a', '#9a9a86', '#d8d8c8', '#c8f0d0', '#8ae0c8'),
  body: { x: 32, y: 38, w: 22, h: 22 }, head: { x: 32, y: 23, w: 15, h: 13 },
  horns: { kind: 'none' }, shape: 'cloak', tendrils: { count: 3, len: 6 },
  pattern: { kind: 'moss', zone: [24, 30, 16, 14] }, scale: 0.96,
  signature: 'stoneStaff',
});

registerBeast('ludeng', {
  family: 'spirit', idle: 'float',
  palette: pal('#1a140c', '#4a3418', '#8a6a2a', '#d8b050', '#fff0c0', '#ffe08a', '#ff8a3a'),
  body: { x: 32, y: 38, w: 20, h: 22 }, head: { x: 32, y: 22, w: 14, h: 14, kind: 'lantern' },
  horns: { kind: 'none' },
  pattern: { kind: 'none' }, scale: 1,
  signature: 'fogLantern',
});

registerBeast('hansui', {
  family: 'spirit', idle: 'float',
  palette: pal('#101c24', '#24404e', '#4a7080', '#8ac0d0', '#e0f8ff', '#aef0ff', '#c8e8ff'),
  body: { x: 32, y: 36, w: 22, h: 24 }, head: { x: 32, y: 21, w: 16, h: 14 },
  horns: { kind: 'branch', len: 10, count: 2 },
  pattern: { kind: 'frost', zone: [24, 28, 18, 16] }, scale: 1,
  signature: 'iceSpine',
});

registerBeast('luxinyuan', {
  family: 'spirit', idle: 'sway',
  palette: pal('#1a1010', '#3a2018', '#6a3a28', '#a86a3a', '#ffb86a', '#ff8a3a', '#ffd76a'),
  body: { x: 32, y: 37, w: 22, h: 22 }, head: { x: 32, y: 22, w: 15, h: 13 },
  horns: { kind: 'none' }, shape: 'ape', arms: { show: true, pose: 1 },
  pattern: { kind: 'crack', zone: [24, 29, 18, 15] }, scale: 1,
  signature: 'furnaceChest',
});

registerBeast('tiangen', {
  family: 'spirit', idle: 'float',
  palette: pal('#101a0f', '#243a20', '#3a6a32', '#6a9a4a', '#c8e8a0', '#dcff9a', '#f2d06a'),
  body: { x: 32, y: 34, w: 26, h: 28 }, head: { x: 32, y: 19, w: 17, h: 15 },
  horns: { kind: 'branch', len: 14, count: 2 }, shape: 'root',
  tendrils: { count: 8, len: 14 },
  pattern: { kind: 'moss', zone: [22, 26, 20, 20] }, scale: 1.08,
  signature: 'rootTendrils',
});

registerBeast('luyuan', {
  family: 'spirit', idle: 'sway',
  palette: pal('#20100a', '#4a2014', '#8a3a1a', '#c86a2a', '#ffc06a', '#ff8a3a', '#fff0a6'),
  body: { x: 32, y: 36, w: 24, h: 24 }, head: { x: 32, y: 21, w: 16, h: 14 },
  horns: { kind: 'none' }, shape: 'ape', arms: { show: true, pose: 1 },
  pattern: { kind: 'crack', zone: [23, 28, 20, 16] }, scale: 1.05,
  signature: 'emberFists',
});
