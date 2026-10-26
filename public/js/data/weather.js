// 灵兽录 · 数据层 · 区域顺序、天时与天气
// 区域顺序由大陆图册的注册顺序决定，新增地图只需在 world-atlas.js 里登记。
const REGION_ORDER = Object.keys(WORLD_ATLAS.regions).filter(function (id) { return !!REGIONS[id]; });

// ---------- 天时与天气 ----------
const WEATHERS = {
  clear: { name: '晴', ch: '晴', desc: '云开一线，五行各安其位。', elMod: {}, rare: 0, particle: null },
  rain: { name: '雨', ch: '雨', desc: '细雨压尘，水势得援，火势受抑。', elMod: { water: 1.15, fire: 0.9 }, rare: 0.08, particle: 'rain' },
  fog: { name: '雾', ch: '雾', desc: '雾重如墨，木气渐长，金气难明。', elMod: { wood: 1.1, metal: 0.92 }, rare: 0.12, particle: 'fog' },
  ash: { name: '烬雨', ch: '烬', desc: '灰烬如雪，火势大盛，水势受灼。', elMod: { fire: 1.18, water: 0.9 }, rare: 0.18, particle: 'ash' },
};

const TIME_PHASES = {
  dawn: { name: '晨', ch: '晨', desc: '露重，木水相济。', elMod: { wood: 1.08, water: 1.06 }, rare: 0.05, tint: '#efe8d8' },
  day: { name: '昼', ch: '昼', desc: '日正，火土为盛。', elMod: { fire: 1.1, earth: 1.05 }, rare: 0, tint: '#f4efe2' },
  dusk: { name: '暮', ch: '暮', desc: '光斜，金气清而锐。', elMod: { metal: 1.12, fire: 0.95 }, rare: 0.06, tint: '#f0e2cd' },
  night: { name: '夜', ch: '夜', desc: '月隐，水气与幽息并起。', elMod: { water: 1.12, wood: 0.95 }, rare: 0.12, tint: '#e2dfe2' },
};

const TIME_ORDER = ['dawn', 'day', 'dusk', 'night'];
