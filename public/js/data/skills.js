// 灵兽录 · 数据层 · 术法与灵诀
// ---------- 技能 ----------
const SKILLS = {
  // 旧有十四式
  zhuo: { name: '啄空', el: 'metal', power: 13, cd: 0, desc: '短促而准的一击' },
  chuanyun: { name: '穿云', el: 'metal', power: 23, cd: 2, desc: '贯空而下，甲片迸裂', status: 'break', statusTurns: 2 },
  tengfu: { name: '藤缚', el: 'wood', power: 15, cd: 0, desc: '藤蔓抽击' },
  huichun: { name: '回春', el: 'wood', power: 0, heal: 0.34, cd: 3, desc: '回复三成气血' },
  huoliao: { name: '火燎', el: 'fire', power: 16, cd: 0, desc: '尾焰扫过，留一线余烬', status: 'burn', statusTurns: 2 },
  juyan: { name: '聚焰', el: 'fire', power: 26, cd: 2, desc: '蓄焰一击', selfCharge: true },
  yanzhui: { name: '岩坠', el: 'earth', power: 20, cd: 1, desc: '落石压顶' },
  jianbi: { name: '坚壁', el: 'earth', power: 0, guard: 2, cd: 3, desc: '两回合内减伤四成', status: 'shield', statusTurns: 2 },
  chaoyong: { name: '潮涌', el: 'water', power: 17, cd: 0, desc: '水势推挤' },
  hanxi: { name: '寒息', el: 'water', power: 22, cd: 2, desc: '吐息成霜，迟滞其步', status: 'slow', statusTurns: 2 },
  jinyu: { name: '金羽斩', el: 'metal', power: 18, cd: 0, desc: '羽刃横掠' },
  liekong: { name: '裂空', el: 'metal', power: 27, cd: 3, desc: '一鸣开天', selfCharge: true },
  fuye: { name: '腐叶', el: 'wood', power: 19, cd: 0, desc: '腐叶缠身，蚀其筋骨', status: 'corrode', statusTurns: 2 },
  shihun: { name: '噬魂', el: 'wood', power: 20, heal: 0.3, cd: 3, desc: '伤人亦自养', status: 'corrode', statusTurns: 1 },
  // 新增十式
  tengwang: { name: '藤网', el: 'wood', power: 14, cd: 2, desc: '藤网罩落，缚住四足', status: 'slow', statusTurns: 2 },
  huoyu: { name: '火雨', el: 'fire', power: 24, cd: 2, desc: '火雨覆野，余烬不熄', status: 'burn', statusTurns: 3 },
  baoyan: { name: '爆焰', el: 'fire', power: 31, cd: 3, desc: '焰心骤裂，声震四野', status: 'burn', statusTurns: 2, selfCharge: true },
  luoshi: { name: '落石', el: 'earth', power: 25, cd: 2, desc: '山石崩落，压其肩背', status: 'break', statusTurns: 2 },
  diyin: { name: '地印', el: 'earth', power: 0, guard: 3, cd: 3, desc: '地脉成印，护身三回合', status: 'shield', statusTurns: 3 },
  shuiyu: { name: '水狱', el: 'water', power: 20, cd: 2, desc: '水壁合围，滞其行止', status: 'slow', statusTurns: 3 },
  bingfeng: { name: '冰封', el: 'water', power: 28, cd: 3, desc: '寒气封脉，行动迟滞', status: 'slow', statusTurns: 2 },
  jinren: { name: '金刃', el: 'metal', power: 21, cd: 1, desc: '金气成刃，破其甲', status: 'break', statusTurns: 2 },
  wanjian: { name: '万剑', el: 'metal', power: 33, cd: 4, desc: '万剑归一，贯阵而下', status: 'break', statusTurns: 3 },
  zhuihun: { name: '坠魂', el: 'wood', power: 26, cd: 3, desc: '拽魂坠地，蚀其灵息', status: 'corrode', statusTurns: 2 },
};

// ---------- 灵诀（被动） ----------
const PASSIVES = {
  xianfa: { name: '先发', desc: '开战先手，速度提升一成二。', effect: { spdPct: 0.12 } },
  lingxi: { name: '灵犀', desc: '与灵兽心意相通，会心率提升。', effect: { critPct: 0.08 } },
  jianjia: { name: '坚甲', desc: '以灵息护体，防御提升一成五。', effect: { defPct: 0.15 } },
  huiling: { name: '回灵', desc: '每回合回复少量气血。', effect: { regenPct: 0.06 } },
  liehuo: { name: '烈火', desc: '火属术法威力提升一成五。', effect: { firePct: 0.15 } },
  runze: { name: '润泽', desc: '水属术法威力提升一成五。', effect: { waterPct: 0.15 } },
  pojia: { name: '破甲', desc: '攻击无视两成防御。', effect: { defPierce: 0.2 } },
  qixin: { name: '契心', desc: '结契成功率提升一成二。', effect: { catchPct: 0.12 } },
};
