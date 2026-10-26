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
  // 扩充灵兽后补充的术法
  lingming: { name: '铃鸣', el: 'metal', power: 15, cd: 0, desc: '铃音穿耳，扰其灵息', status: 'slow', statusTurns: 1 },
  suojin: { name: '锁金', el: 'metal', power: 22, cd: 2, desc: '金气锁脉，破其甲', status: 'break', statusTurns: 2 },
  genshu: { name: '根守', el: 'wood', power: 0, guard: 2, cd: 3, desc: '根须盘结，减伤四成', status: 'shield', statusTurns: 2 },
  jingsheng: { name: '荆生', el: 'wood', power: 18, cd: 1, desc: '荆棘抽生，蚀其筋骨', status: 'corrode', statusTurns: 1 },
  liuxing: { name: '流萤', el: 'fire', power: 14, cd: 0, desc: '火星四散，留一点余烬', status: 'burn', statusTurns: 1 },
  fenxin: { name: '焚心', el: 'fire', power: 27, cd: 3, desc: '心火倒卷，灼烧不止', status: 'burn', statusTurns: 2 },
  suishi: { name: '碎石', el: 'earth', power: 15, cd: 0, desc: '掷石碎甲' },
  shanyong: { name: '山涌', el: 'earth', power: 24, cd: 2, desc: '地脉涌动，甲片崩裂', status: 'break', statusTurns: 2 },
  xiliu: { name: '细流', el: 'water', power: 14, cd: 0, desc: '水线切隙' },
  chaohu: { name: '潮护', el: 'water', power: 0, guard: 2, cd: 3, desc: '潮水成幕，减伤四成', status: 'shield', statusTurns: 2 },
  // 第二卷新增十式
  yunpo: { name: '云破', el: 'metal', power: 28, cd: 2, desc: '云层裂开一线，风刃随光落下', status: 'slow', statusTurns: 2 },
  fengren: { name: '风刃', el: 'wood', power: 24, cd: 1, desc: '风里藏刃，割其甲片', status: 'break', statusTurns: 2 },
  leiyin: { name: '雷引', el: 'fire', power: 30, cd: 3, desc: '引雷入焰，声震四野', status: 'burn', statusTurns: 2, selfCharge: true },
  rongke: { name: '熔壳', el: 'earth', power: 0, guard: 2, cd: 3, desc: '熔岩凝壳，护身两回合', status: 'shield', statusTurns: 2 },
  luyan: { name: '炉焰', el: 'fire', power: 29, cd: 2, desc: '炉心之火喷薄，灼烧不止', status: 'burn', statusTurns: 3 },
  chenxi: { name: '沉息', el: 'water', power: 0, heal: 0.3, cd: 3, desc: '沉入潮息，回复三成气血' },
  shanhuizhang: { name: '珊瑚障', el: 'wood', power: 0, guard: 2, cd: 3, desc: '珊瑚成障，减伤四成', status: 'shield', statusTurns: 2 },
  xingyun: { name: '星陨', el: 'metal', power: 32, cd: 4, desc: '星屑坠地，贯甲而下', status: 'break', statusTurns: 3 },
  genfu: { name: '根缚', el: 'wood', power: 18, cd: 2, desc: '天根缠足，滞其行止', status: 'slow', statusTurns: 3 },
  jiuzhang: { name: '九嶂', el: 'earth', power: 34, cd: 4, desc: '九嶂压顶，破甲震魂', status: 'break', statusTurns: 3 },
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
  yunxing: { name: '云行', desc: '云栈风势相助，速度提升一成。', effect: { spdPct: 0.1 } },
  luxin: { name: '炉心', desc: '炉火淬体，火属术法威力提升两成。', effect: { firePct: 0.2 } },
  chenxi: { name: '沉息', desc: '潮息护脉，每回合回复少量气血。', effect: { regenPct: 0.05 } },
  genshou: { name: '根守', desc: '天根护体，防御提升两成。', effect: { defPct: 0.2 } },
};

// ---------- 合契技 ----------
// 同源 / 相生 / 相克三种关系，由合契双方五行决定
const BOND_ARTS = {
  same: { name: '合契·同源', mult: 1.5, heal: 0.12, shield: true },
  gen: { name: '合契·相生', mult: 1.9, heal: 0.18 },
  beat: { name: '合契·相克', mult: 2.4, status: 'break', turns: 2 },
};
