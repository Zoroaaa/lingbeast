// 灵兽录 · 鸟类家族（15 种）
// 雀 / 隼 / 雕 / 鸮 / 鹰 / 鹮 / 鹤 / 凰，每只独立 style。

registerBeast('moyu', {
  family: 'bird', idle: 'hop',
  palette: pal('#15171c', '#262c3a', '#4b5872', '#a2b4cf', '#f2f6fb', '#fff3c0', '#e8e0cc'),
  // 头压在身体前上方、不再用细颈相连，轮廓是一团圆润的墨色雀
  body: { x: 31, y: 43, w: 22, h: 17 }, head: { x: 43, y: 32, w: 16, h: 15 },
  beak: { len: 6, curve: 0, width: 3, color: '#8a92a0' },
  wing: { kind: 'folded', span: 22, rows: 3 }, tail: { kind: 'fan', len: 11, count: 3 },
  crest: { kind: 'single', len: 4, color: '#262c3a' }, legs: { len: 7, thick: 2, count: 2 },
  scale: 1.0, signature: 'inkTips',
});

registerBeast('moxun', {
  family: 'bird', idle: 'hop',
  palette: pal('#10141c', '#1c2634', '#354454', '#6f8298', '#dce8f4', '#fff3c0', '#c8d8e8'),
  body: { x: 30, y: 38, w: 24, h: 18 }, head: { x: 45, y: 21, w: 16, h: 14 },
  beak: { len: 11, curve: 1, width: 3, color: '#c8a25a' },
  wing: { kind: 'pointed', span: 36, rows: 3 }, tail: { kind: 'fork', len: 16 },
  crest: { kind: 'double', len: 8, color: '#c8d8e8' }, legs: { len: 9, thick: 2, count: 2 },
  scale: 1.0, signature: 'eyeMask',
});

registerBeast('tongling', {
  family: 'bird', idle: 'hop',
  palette: pal('#2a1c10', '#5a3a20', '#a86a32', '#d8a050', '#f6e0b0', '#ffe08a', '#c8a25a'),
  body: { x: 30, y: 39, w: 18, h: 18 }, head: { x: 43, y: 22, w: 14, h: 13 },
  beak: { len: 6, curve: 0, width: 3, color: '#8a6a2a' },
  wing: { kind: 'round', span: 22, rows: 2 }, tail: { kind: 'fan', len: 10, count: 4 },
  crest: { kind: 'single', len: 6, color: '#c8a25a' }, scale: 0.92,
  signature: 'bell',
});

registerBeast('liujin', {
  family: 'crane', idle: 'sway',
  palette: pal('#2a2014', '#6a4a20', '#c89a42', '#e8c86a', '#fff0c8', '#ffe08a', '#f2d06a'),
  body: { x: 30, y: 38, w: 17, h: 15 }, head: { x: 46, y: 13, w: 12, h: 10 },
  neck: { x: 40, y: 20, w: 4, h: 19, curve: 1 },
  wing: { kind: 'feather', span: 26, rows: 4 }, tail: { kind: 'plume', len: 16, count: 4 },
  crest: { kind: 'crown', len: 6, color: '#f2d06a' }, legs: { len: 17, thick: 1, count: 2 },
  scale: 1.02, signature: 'goldCrown',
});

registerBeast('zhuojin', {
  family: 'bird', idle: 'hop',
  palette: pal('#2a1408', '#6a3214', '#c87a24', '#f0b04a', '#ffe8a0', '#fff0a6', '#f2d06a'),
  body: { x: 31, y: 37, w: 26, h: 20 }, head: { x: 46, y: 20, w: 16, h: 14 },
  beak: { len: 11, curve: 1, width: 3, color: '#8a4a20' },
  wing: { kind: 'feather', span: 36, rows: 5 }, tail: { kind: 'fan', len: 16, count: 4 },
  crest: { kind: 'crown', len: 7, color: '#f2d06a' }, legs: { len: 10, thick: 2, count: 2 },
  scale: 1.04, signature: 'flameTips',
});

registerBeast('yuntie', {
  family: 'bird', idle: 'sway',
  palette: pal('#181a20', '#2a303a', '#4a5560', '#7a8a98', '#d8e0e8', '#aef0ff', '#c8a25a'),
  body: { x: 30, y: 39, w: 22, h: 18 }, head: { x: 43, y: 22, w: 18, h: 16 },
  beak: { len: 6, curve: 1, width: 3, color: '#8a7a5a' },
  wing: { kind: 'round', span: 26, rows: 2 }, tail: { kind: 'fan', len: 12, count: 3 },
  crest: { kind: 'none' }, ears: { kind: 'tuft', size: 5 },
  pattern: { kind: 'star', zone: [20, 32, 22, 12] }, scale: 0.97,
  signature: 'starSpecks',
});

registerBeast('leiyu', {
  family: 'bird', idle: 'hop',
  palette: pal('#101a2a', '#1f3a5a', '#3a6a9a', '#7ac8e8', '#e0f8ff', '#aef0ff', '#f2d06a'),
  body: { x: 30, y: 38, w: 22, h: 18 }, head: { x: 44, y: 21, w: 15, h: 14 },
  wing: { kind: 'storm', span: 34, rows: 4 }, tail: { kind: 'fork', len: 16 },
  crest: { kind: 'lightning', len: 10, color: '#aef0ff' },
  pattern: { kind: 'glow', zone: [20, 31, 22, 12] }, scale: 1,
  signature: 'lightningCrest',
});

registerBeast('xinghai', {
  family: 'bird', idle: 'float',
  palette: pal('#16141c', '#2a2634', '#4a4658', '#8a86a0', '#e8e4f0', '#c8e8ff', '#f2d06a'),
  body: { x: 30, y: 38, w: 22, h: 18 }, head: { x: 44, y: 21, w: 15, h: 14 },
  wing: { kind: 'skeletal', span: 34, rows: 3 }, tail: { kind: 'comet', len: 16 },
  crest: { kind: 'bone', len: 8 }, pattern: { kind: 'star', zone: [20, 31, 22, 12] },
  scale: 1, signature: 'boneMask',
});

registerBeast('fengying', {
  family: 'bird', idle: 'hop',
  palette: pal('#1a2a1a', '#3a5a3a', '#6a9a5a', '#a8d88a', '#e8f8d0', '#dcff9a', '#e8f0cc'),
  body: { x: 30, y: 38, w: 22, h: 16 }, head: { x: 45, y: 21, w: 14, h: 13 },
  wing: { kind: 'pointed', span: 38, rows: 3 }, tail: { kind: 'fork', len: 16 },
  crest: { kind: 'single', len: 7, color: '#e8f0cc' }, scale: 1,
  signature: 'windRing',
});

registerBeast('xingkongniao', {
  family: 'bird', idle: 'float',
  palette: pal('#0e1020', '#1e2440', '#3a4a80', '#7a90d0', '#e0e8ff', '#c8f0ff', '#f2d06a'),
  body: { x: 31, y: 37, w: 26, h: 20 }, head: { x: 46, y: 20, w: 16, h: 14 },
  wing: { kind: 'feather', span: 40, rows: 5 }, tail: { kind: 'comet', len: 18 },
  crest: { kind: 'crown', len: 6, color: '#c8f0ff' },
  pattern: { kind: 'star', zone: [18, 30, 26, 14] }, scale: 1.06,
  signature: 'cometTail',
});

registerBeast('jinyu', {
  family: 'crane', idle: 'sway',
  palette: pal('#2a2010', '#7a5a20', '#c8a040', '#f0d070', '#fff6d0', '#ffe08a', '#c8381f'),
  body: { x: 30, y: 38, w: 18, h: 16 }, head: { x: 46, y: 13, w: 12, h: 10 },
  neck: { x: 40, y: 20, w: 4, h: 19, curve: 1 },
  beak: { len: 12, curve: 1, width: 2, color: '#c8381f' },
  wing: { kind: 'feather', span: 24, rows: 4 }, tail: { kind: 'plume', len: 15, count: 4 },
  crest: { kind: 'crown', len: 5, color: '#c8381f' }, legs: { len: 17, thick: 1, count: 2 },
  scale: 1, signature: 'curvedBeak',
});

registerBeast('shuangling', {
  family: 'crane', idle: 'sway',
  palette: pal('#182a38', '#3a5a70', '#7aa8c0', '#b8e0f0', '#f0fbff', '#e8fdff', '#c8e8ff'),
  body: { x: 30, y: 38, w: 18, h: 16 }, head: { x: 46, y: 13, w: 12, h: 10 },
  neck: { x: 40, y: 20, w: 4, h: 20, curve: 1 },
  wing: { kind: 'feather', span: 26, rows: 4 }, tail: { kind: 'plume', len: 16, count: 4 },
  crest: { kind: 'crown', len: 5, color: '#e8fdff' }, legs: { len: 17, thick: 1, count: 2 },
  pattern: { kind: 'frost', zone: [20, 33, 20, 10] }, scale: 1,
  signature: 'frostTips',
});

registerBeast('yunhe', {
  family: 'crane', idle: 'float',
  palette: pal('#20242a', '#3a4250', '#6a7a90', '#a8b8c8', '#f0f4f8', '#ffffff', '#ffd8ef'),
  body: { x: 30, y: 38, w: 19, h: 17 }, head: { x: 46, y: 13, w: 12, h: 10 },
  neck: { x: 40, y: 20, w: 4, h: 20, curve: 1 },
  wing: { kind: 'feather', span: 26, rows: 4 }, tail: { kind: 'plume', len: 16, count: 4 },
  crest: { kind: 'crown', len: 5, color: '#ffffff' }, legs: { len: 17, thick: 1, count: 2 },
  pattern: { kind: 'cloud', zone: [20, 33, 20, 10] }, scale: 1,
  signature: 'cloudFluff',
});

registerBeast('yunhuang', {
  family: 'crane', idle: 'float',
  palette: pal('#2a1008', '#7a2a12', '#d86a24', '#f0a040', '#ffe090', '#fff0a6', '#f2d06a'),
  body: { x: 30, y: 37, w: 21, h: 18 }, head: { x: 46, y: 12, w: 12, h: 10 },
  neck: { x: 40, y: 19, w: 4, h: 20, curve: 1 },
  wing: { kind: 'feather', span: 30, rows: 5 }, tail: { kind: 'plume', len: 20, count: 5 },
  crest: { kind: 'crown', len: 7, color: '#f2d06a' }, legs: { len: 17, thick: 1, count: 2 },
  pattern: { kind: 'glow', zone: [19, 32, 22, 11] }, scale: 1.06,
  signature: 'phoenixPlumes',
});

registerBeast('leihuang', {
  family: 'crane', idle: 'float',
  palette: pal('#101420', '#1e2a44', '#3a5a8a', '#7aa8d8', '#e0f0ff', '#aef0ff', '#f2d06a'),
  body: { x: 30, y: 37, w: 20, h: 17 }, head: { x: 46, y: 12, w: 12, h: 10 },
  neck: { x: 40, y: 19, w: 4, h: 20, curve: 1 },
  wing: { kind: 'storm', span: 32, rows: 5 }, tail: { kind: 'plume', len: 18, count: 4 },
  crest: { kind: 'crown', len: 7, color: '#aef0ff' }, legs: { len: 17, thick: 1, count: 2 },
  pattern: { kind: 'glow', zone: [19, 32, 22, 11] }, scale: 1.05,
  signature: 'lightningCrest',
});
