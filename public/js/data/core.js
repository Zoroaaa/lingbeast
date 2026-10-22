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
