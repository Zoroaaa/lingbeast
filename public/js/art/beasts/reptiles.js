// 灵兽录 · 鼍龙家族（8 种）
// 鼍 / 螭 / 龙，每只独立 style。

registerBeast('shijiatuo', {
  family: 'croc', idle: 'crawl',
  palette: pal('#14201a', '#2c3a2e', '#4f6a4a', '#7f9a6a', '#d8e0b8', '#ffe08a', '#c8b060'),
  body: { x: 28, y: 42, w: 34, h: 14 }, head: { x: 46, y: 40, w: 12, h: 9 },
  snout: { len: 12, width: 5 }, tail: { kind: 'thick', len: 16, count: 1 },
  horns: { kind: 'ridge', len: 5, count: 4 },
  pattern: { kind: 'scales', zone: [12, 34, 34, 10] }, scale: 1,
  signature: 'rockPlates',
});

registerBeast('xuanjia', {
  family: 'croc', idle: 'crawl',
  palette: pal('#101418', '#1f2a30', '#354a52', '#5f7a82', '#c8d8d8', '#aef0ff', '#8ad0ff'),
  body: { x: 28, y: 42, w: 36, h: 15 }, head: { x: 46, y: 40, w: 12, h: 9 },
  snout: { len: 13, width: 5 }, tail: { kind: 'thick', len: 18, count: 1 },
  horns: { kind: 'ridge', len: 6, count: 6 },
  pattern: { kind: 'scales', zone: [12, 34, 36, 11] }, scale: 1.03,
  signature: 'rockPlates',
});

registerBeast('shaxing', {
  family: 'croc', idle: 'crawl',
  palette: pal('#2a2418', '#6a5632', '#a88a52', '#d8b878', '#f8e8c0', '#ffe08a', '#c86a3a'),
  body: { x: 28, y: 42, w: 34, h: 13 }, head: { x: 46, y: 40, w: 12, h: 9 },
  snout: { len: 12, width: 5 }, tail: { kind: 'fin', len: 16, count: 1 },
  horns: { kind: 'ridge', len: 4, count: 3 },
  pattern: { kind: 'sand', zone: [12, 34, 34, 10] }, scale: 0.98,
  signature: 'windSwirl',
});

registerBeast('rongjia', {
  family: 'croc', idle: 'crawl',
  palette: pal('#1a1210', '#3a2018', '#6a3a28', '#a86a3a', '#ffb86a', '#ff8a3a', '#ffd76a'),
  body: { x: 28, y: 42, w: 34, h: 14 }, head: { x: 46, y: 40, w: 12, h: 9 },
  snout: { len: 12, width: 5 }, tail: { kind: 'thick', len: 16, count: 1 },
  horns: { kind: 'ridge', len: 5, count: 4 },
  pattern: { kind: 'crack', zone: [12, 34, 34, 10] }, scale: 1,
  signature: 'lavaCracks',
});

registerBeast('rongjiawang', {
  family: 'croc', idle: 'crawl',
  palette: pal('#20100a', '#4a1e12', '#8a3a1a', '#d86a24', '#ffc06a', '#ff8a3a', '#fff0a6'),
  body: { x: 28, y: 42, w: 38, h: 16 }, head: { x: 46, y: 40, w: 12, h: 9 },
  snout: { len: 13, width: 6 }, tail: { kind: 'thick', len: 20, count: 1 },
  horns: { kind: 'crown', len: 6, count: 4 },
  pattern: { kind: 'crack', zone: [12, 34, 38, 11] }, scale: 1.05,
  signature: 'magmaCore',
});

registerBeast('chaoxi', {
  family: 'dragon', idle: 'crawl',
  palette: pal('#0d2738', '#1d4a5e', '#2f7c9e', '#68c8de', '#d0f4ff', '#e8fdff', '#f2d06a'),
  body: { x: 30, y: 38, w: 16, h: 14 }, head: { x: 46, y: 24, w: 15, h: 12 },
  neck: { x: 38, y: 28, w: 8, h: 12 },
  horns: { kind: 'branch', len: 9, count: 2 }, tail: { kind: 'fin', len: 16, count: 1 },
  pattern: { kind: 'wave', zone: [16, 30, 28, 14] }, scale: 1,
  signature: 'waveFins',
});

registerBeast('canglan', {
  family: 'dragon', idle: 'float',
  palette: pal('#0a1c2e', '#123a52', '#1f5a7a', '#4fa0c0', '#c0ecff', '#e8fdff', '#f2d06a'),
  body: { x: 30, y: 38, w: 18, h: 15 }, head: { x: 46, y: 24, w: 16, h: 12 },
  neck: { x: 38, y: 28, w: 9, h: 13 },
  horns: { kind: 'branch', len: 12, count: 2 }, tail: { kind: 'fin', len: 20, count: 1 },
  pattern: { kind: 'wave', zone: [16, 30, 30, 15] }, scale: 1.05,
  signature: 'whiskers',
});

registerBeast('denglong', {
  family: 'dragon', idle: 'float',
  palette: pal('#1a1008', '#4a2a10', '#8a5a20', '#d8a040', '#fff0c0', '#ffe08a', '#ff8a3a'),
  body: { x: 30, y: 38, w: 16, h: 14 }, head: { x: 46, y: 24, w: 15, h: 12 },
  neck: { x: 38, y: 28, w: 8, h: 12 },
  horns: { kind: 'branch', len: 8, count: 2 }, tail: { kind: 'fin', len: 14, count: 1 },
  pattern: { kind: 'glow', zone: [16, 30, 28, 14] }, scale: 1.04,
  signature: 'lanternLure',
});
