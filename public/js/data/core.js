// 灵兽录 · 数据层 · 基础常量与五行
// 灵兽录 · 九嶂内容注册表（v3，纯数据，无 DOM 依赖）
// 区块：五行 / 状态 / 技能 / 灵诀 / 图鉴 / 材料 / 道具 / 配方 / 商店 / Boss
//       地图画笔 / 八境 / 天时天气 / 主线 / 支线 / 悬赏 / 山海志 / 试炼 / 校验

const TILE = 32;

const ELEMENTS = {
  wood: { ch: '木', color: '#4a7a5c', soft: '#cddfd7' },
  fire: { ch: '火', color: '#b04a30', soft: '#f0d8cf' },
  earth: { ch: '土', color: '#8a6b3f', soft: '#e6dcc9' },
  metal: { ch: '金', color: '#6d6a60', soft: '#dedcd3' },
  water: { ch: '水', color: '#3c6f8c', soft: '#d3e3ea' },
};

// 克：木→土→水→火→金→木
const BEATS = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

// ---------- 灵兽资质 ----------
// 稀有度直接决定强度：S > A > B > C > D。
// C/D 为后续内容预留，当前只少量使用。
const RARITY = {
  S: { name: '绝', color: '#c8912f', soft: '#f6e2b2', ink: '#3a2a10', mult: 1.18, order: 5 },
  A: { name: '珍', color: '#7c4fb8', soft: '#e2d4f4', ink: '#2a1c40', mult: 1.1, order: 4 },
  B: { name: '良', color: '#2f6fa8', soft: '#cfe2f2', ink: '#16283c', mult: 1, order: 3 },
  C: { name: '常', color: '#5c7a5a', soft: '#d8e4d2', ink: '#20301f', mult: 0.92, order: 2 },
  D: { name: '凡', color: '#7d7466', soft: '#e3dcce', ink: '#2c2820', mult: 0.85, order: 1 },
};
const RARITY_ORDER = ['D', 'C', 'B', 'A', 'S'];

function rarityOf(sp) { return RARITY[sp && sp.rarity] || RARITY.B; }

// 成长资质：四项每级成长折成综合评级，与稀有度分离展示
function growthInfo(sp) {
  const g = (sp && sp.grow) || { hp: 0, atk: 0, def: 0, spd: 0 };
  const score = g.hp / 8 + g.atk / 2 + g.def / 2 + g.spd;
  let rank = 'D';
  if (score >= 4.5) rank = 'S';
  else if (score >= 4.15) rank = 'A';
  else if (score >= 3.6) rank = 'B';
  else if (score >= 3.2) rank = 'C';
  return {
    hp: g.hp, atk: g.atk, def: g.def, spd: g.spd,
    total: Math.round((g.hp + g.atk + g.def + g.spd) * 10) / 10,
    score: Math.round(score * 100) / 100,
    rank: rank,
  };
}

// ---------- 状态 ----------
// kind: dot 持续伤害 / debuff 削弱 / buff 增益
const STATUSES = {
  burn: {
    name: '灼烧', ch: '灼', color: '#b04a30', kind: 'dot', duration: 2,
    desc: '每回合流失气血，火属伤害更盛。', mod: { atkPct: -0.08 },
  },
  corrode: {
    name: '腐蚀', ch: '蚀', color: '#6b7a4a', kind: 'dot', duration: 2,
    desc: '每回合流失气血，防御随之变薄。', mod: { defPct: -0.15 },
  },
  slow: {
    name: '迟滞', ch: '滞', color: '#3c6f8c', kind: 'debuff', duration: 2,
    desc: '行动次序后移，速度下降三成。', mod: { spdPct: -0.3 },
  },
  break: {
    name: '破甲', ch: '破', color: '#8a6b3f', kind: 'debuff', duration: 2,
    desc: '甲片崩裂，防御下降三成五。', mod: { defPct: -0.35 },
  },
  shield: {
    name: '护盾', ch: '护', color: '#6d6a60', kind: 'buff', duration: 2,
    desc: '以灵息结甲，吸收部分伤害。', mod: { absorbPct: 0.35 },
  },
  charge: {
    name: '蓄势', ch: '蓄', color: '#b07a30', kind: 'buff', duration: 2,
    desc: '灵息聚于一处，下一次攻击威力提升。', mod: { atkPct: 0.5 },
  },
};
