// 灵兽录 · 水族家族（9 种）
// 鲛 / 蚌 / 蜃贝，每只独立 style。

registerBeast('guixujiao', {
  family: 'mermaid', idle: 'float',
  palette: pal('#0b2230', '#1f4a5a', '#2f7c8e', '#68c8c8', '#d0f4ee', '#e8fff6', '#c05668'),
  body: { x: 32, y: 30, w: 13, h: 16 }, head: { x: 32, y: 14, w: 14, h: 12 },
  tail: { kind: 'fish', len: 26, fin: 16 },
  hair: { len: 14, style: 'long', color: '#c05668' },
  pattern: { kind: 'scales', zone: [26, 36, 12, 16] }, scale: 1,
  signature: 'redHair',
});

registerBeast('qianxi', {
  family: 'mermaid', idle: 'float',
  palette: pal('#10303a', '#1f5a66', '#3a8a92', '#7ad0c8', '#e0fff8', '#e8fff6', '#8ae0c8'),
  body: { x: 32, y: 31, w: 11, h: 14 }, head: { x: 32, y: 16, w: 13, h: 11 },
  tail: { kind: 'short', len: 18, fin: 12 },
  hair: { len: 8, style: 'short', color: '#2a6a6a' },
  pattern: { kind: 'scales', zone: [27, 38, 10, 12] }, scale: 0.94,
  signature: 'waveScales',
});

registerBeast('shentan', {
  family: 'mermaid', idle: 'float',
  palette: pal('#081a2a', '#123a52', '#1f5a6a', '#4a9aa8', '#c0e8f0', '#e8fff6', '#8ad0ff'),
  body: { x: 32, y: 29, w: 14, h: 17 }, head: { x: 32, y: 13, w: 14, h: 12 },
  tail: { kind: 'flowing', len: 28, fin: 18 },
  hair: { len: 20, style: 'long', color: '#2a4a5a' },
  pattern: { kind: 'scales', zone: [26, 35, 13, 18] }, scale: 1.04,
  signature: 'deepScales',
});

registerBeast('cangming', {
  family: 'mermaid', idle: 'float',
  palette: pal('#0a1c30', '#14405a', '#1f6a8a', '#4fa0c0', '#c8f0ff', '#e8fff6', '#f2d06a'),
  body: { x: 32, y: 28, w: 15, h: 18 }, head: { x: 32, y: 12, w: 15, h: 13 },
  tail: { kind: 'flowing', len: 30, fin: 20 },
  hair: { len: 22, style: 'long', color: '#1f4a6a' },
  crown: { kind: 'coral' },
  pattern: { kind: 'wave', zone: [25, 34, 14, 19] }, scale: 1.06,
  signature: 'seaCrown',
});

registerBeast('chaowen', {
  family: 'mermaid', idle: 'float',
  palette: pal('#0e2830', '#1f4a52', '#3a7a7a', '#7ac0b0', '#d8f8e8', '#e8fff6', '#68c8c8'),
  body: { x: 32, y: 30, w: 13, h: 16 }, head: { x: 32, y: 14, w: 14, h: 12 },
  tail: { kind: 'fish', len: 24, fin: 14 },
  hair: { len: 12, style: 'long', color: '#2a5a5a' },
  pattern: { kind: 'wave', zone: [26, 36, 12, 16] }, scale: 1,
  signature: 'waveScales',
});

registerBeast('chaodeng', {
  family: 'mermaid', idle: 'float',
  palette: pal('#1a1408', '#4a3212', '#8a6a2a', '#d8b050', '#fff0c0', '#ffe08a', '#ff8a3a'),
  body: { x: 32, y: 31, w: 12, h: 15 }, head: { x: 32, y: 15, w: 13, h: 11 },
  tail: { kind: 'lantern', len: 20, fin: 10 },
  hair: { len: 10, style: 'short', color: '#4a3418' },
  pattern: { kind: 'glow', zone: [27, 37, 10, 14] }, scale: 0.98,
  signature: 'lanternLure',
});

registerBeast('yunmengbei', {
  family: 'clam', idle: 'float',
  palette: pal('#24182e', '#4a3458', '#8a76a3', '#c4b0d6', '#fff6d6', '#ffd8ef', '#f2d06a'),
  body: { x: 32, y: 40, w: 36, h: 16 }, head: { x: 32, y: 33, w: 14, h: 10 },
  shell: { kind: 'clam', layers: 2 },
  pattern: { kind: 'cloud', zone: [14, 20, 36, 26] }, scale: 1,
  signature: 'fogLantern',
});

registerBeast('chenzhu', {
  family: 'clam', idle: 'float',
  palette: pal('#1a1420', '#3a2a48', '#6a5a7a', '#a090b0', '#e8e0f0', '#ffd8ef', '#c8a25a'),
  body: { x: 32, y: 41, w: 36, h: 17 }, head: { x: 32, y: 34, w: 14, h: 10 },
  shell: { kind: 'layered', layers: 3 },
  pattern: { kind: 'none' }, scale: 1.02,
  signature: 'layeredShell',
});

registerBeast('mingzhu', {
  family: 'clam', idle: 'float',
  palette: pal('#2a1c2e', '#5a3a58', '#a06a9a', '#e0aec8', '#fff0f8', '#ffd8ef', '#f2d06a'),
  body: { x: 32, y: 41, w: 38, h: 18 }, head: { x: 32, y: 34, w: 15, h: 11 },
  shell: { kind: 'jewel', layers: 3 },
  pattern: { kind: 'glow', zone: [14, 20, 38, 27] }, scale: 1.04,
  signature: 'jewelShell',
});
