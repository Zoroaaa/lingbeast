// 灵兽录 · 数据层 · 灵器、词条与套装
// 灵器只从探索、Boss 首杀与剧情抉择获得，不出售。

const GEAR_SLOTS = {
  seal: { name: '契印', ch: '印', order: 0 },
  talisman: { name: '护符', ch: '符', order: 1 },
  bell: { name: '灵铃', ch: '铃', order: 2 },
};

const GEAR_MOD_KEYS = [
  'hpPct', 'atkPct', 'defPct', 'spdPct', 'critPct', 'defPierce', 'regenPct',
  'catchPct', 'bondGainPct', 'statusResistPct',
  'woodPct', 'firePct', 'earthPct', 'metalPct', 'waterPct',
];

const GEAR_MOD_LABELS = {
  hpPct: '气血', atkPct: '攻击', defPct: '防御', spdPct: '速度',
  critPct: '会心', defPierce: '破防', regenPct: '回灵',
  catchPct: '结契', bondGainPct: '契势', statusResistPct: '抗性',
  woodPct: '木伤', firePct: '火伤', earthPct: '土伤', metalPct: '金伤', waterPct: '水伤',
};

const GEAR_RARITY = {
  common: { id: 'common', label: '旧', color: '#8a7a5c', sell: 40 },
  fine: { id: 'fine', label: '良', color: '#3c6f8c', sell: 80 },
  rare: { id: 'rare', label: '珍', color: '#8a4a8c', sell: 150 },
  epic: { id: 'epic', label: '绝', color: '#b04a30', sell: 260 },
};

// mods 为百分比小数：0.06 = +6%
const GEAR = {
  shanmen_bell: {
    id: 'shanmen_bell', name: '山门旧铃', slot: 'bell', rarity: 'common', set: 'oldgate', unique: true,
    mods: { hpPct: 0.05, bondGainPct: 0.1 },
    desc: '旧山门挂在廊下的铜铃，铃舌早已磨短，声音却还认得回家的路。',
  },
  qingxi_seal: {
    id: 'qingxi_seal', name: '溪畔契印', slot: 'seal', rarity: 'common', set: 'oldgate', unique: true,
    mods: { atkPct: 0.06, spdPct: 0.04 },
    desc: '溪石上拓下的旧契，边角带着水纹。',
  },
  wuyin_talisman: {
    id: 'wuyin_talisman', name: '药庐护符', slot: 'talisman', rarity: 'fine', set: 'oldgate', unique: true,
    mods: { hpPct: 0.06, regenPct: 0.02 },
    desc: '阿蘅用三层药纸叠成的护符，闻起来像雨后的草。',
  },
  luoxing_seal: {
    id: 'luoxing_seal', name: '星屑契印', slot: 'seal', rarity: 'fine', set: 'abyss', unique: true,
    mods: { critPct: 0.05, metalPct: 0.08 },
    desc: '以星屑压成的契印，夜里会浮出极细的一线光。',
  },
  guixu_talisman: {
    id: 'guixu_talisman', name: '潮生护符', slot: 'talisman', rarity: 'fine', set: 'tide', unique: true,
    mods: { waterPct: 0.08, catchPct: 0.04 },
    desc: '退潮时从栈桥下拾得的护符，内侧刻着半句鲛歌。',
  },
  yunmeng_talisman: {
    id: 'yunmeng_talisman', name: '蜃景护符', slot: 'talisman', rarity: 'rare', set: 'tide', unique: true,
    mods: { spdPct: 0.06, statusResistPct: 0.12 },
    desc: '护符里封着一小片会动的雾，握久了会听见自己的脚步。',
  },
  gutan_bell: {
    id: 'gutan_bell', name: '烬尾铃', slot: 'bell', rarity: 'rare', set: 'abyss', unique: true,
    mods: { firePct: 0.1, atkPct: 0.05 },
    desc: '铃身沾着不冷的灰，摇一下便亮起一串火星。',
  },
  shenyuan_seal: {
    id: 'shenyuan_seal', name: '无相残印', slot: 'seal', rarity: 'rare', set: 'abyss', unique: true,
    mods: { defPierce: 0.08, critPct: 0.04 },
    desc: '印面没有字，只有一道新裂。看久了会觉得那道裂在动。',
  },
  shougu_bell: {
    id: 'shougu_bell', name: '守谷铃', slot: 'bell', rarity: 'fine', set: 'oldgate', unique: true,
    mods: { defPct: 0.08, hpPct: 0.04 },
    desc: '守谷灵颈下系过的旧铃，铃声沉，像有人在山口替你应门。',
  },
  xingyun_seal: {
    id: 'xingyun_seal', name: '星核契印', slot: 'seal', rarity: 'rare', set: 'abyss', unique: true,
    mods: { atkPct: 0.08, earthPct: 0.08 },
    desc: '星陨傀背甲里掉出的核，压成印后仍带着下坠的劲。',
  },
  suolingjiao_talisman: {
    id: 'suolingjiao_talisman', name: '鲛歌护符', slot: 'talisman', rarity: 'rare', set: 'tide', unique: true,
    mods: { waterPct: 0.1, spdPct: 0.04 },
    desc: '护符里封着一段没有词的调子，靠近水时会自己响。',
  },
  wuxiang_seal: {
    id: 'wuxiang_seal', name: '无相面', slot: 'seal', rarity: 'epic', set: 'abyss', unique: true,
    mods: { critPct: 0.06, defPierce: 0.1, atkPct: 0.06 },
    desc: '一张薄得透光的旧面，戴上时能听见很多人在远处叫你。',
  },
  tiangong_seal: {
    id: 'tiangong_seal', name: '天工契印', slot: 'seal', rarity: 'rare', unique: true,
    mods: { atkPct: 0.08, defPierce: 0.05 },
    desc: '锁灵器残料重铸的契印，炉火的气味还没散。',
  },
  tide_song_bell: {
    id: 'tide_song_bell', name: '鲛歌旧铃', slot: 'bell', rarity: 'rare', set: 'tide', unique: true,
    mods: { waterPct: 0.1, catchPct: 0.06 },
    desc: '珠娘挂在礁石上的旧铃，铃声像退潮时留在岸上的一口气。',
  },
  mengyin_talisman: {
    id: 'mengyin_talisman', name: '梦引护符', slot: 'talisman', rarity: 'rare', set: 'tide', unique: true,
    mods: { statusResistPct: 0.18, regenPct: 0.03 },
    desc: '凝着蜃梦的护符。戴着它，梦里受的伤不会带到醒时。',
  },
  chiyuan_bell: {
    id: 'chiyuan_bell', name: '赤渊火铃', slot: 'bell', rarity: 'rare', set: 'abyss', unique: true,
    mods: { firePct: 0.12, atkPct: 0.04 },
    desc: '火种铸成的铃，铃声很清，听久了会想起坛底的名字。',
  },
  nameless_bell: {
    id: 'nameless_bell', name: '无名铃', slot: 'bell', rarity: 'rare', set: 'abyss', unique: true,
    mods: { atkPct: 0.08, defPierce: 0.06 },
    desc: '铃上刻着一个没有写完的名字。摇铃的人，会被它记住一半。',
  },
  xin_qiyin: {
    id: 'xin_qiyin', name: '新契印', slot: 'seal', rarity: 'epic', unique: true,
    mods: { hpPct: 0.08, atkPct: 0.06, defPct: 0.06, spdPct: 0.06 },
    desc: '碑林新刻的契印，印面只有一个字：名。',
  },
  duan_ling: {
    id: 'duan_ling', name: '断灵铃', slot: 'bell', rarity: 'epic', set: 'abyss', unique: true,
    mods: { atkPct: 0.1, critPct: 0.06, defPierce: 0.08 },
    desc: '旧契绳割断后铸成的铃。铃响时，灵息会自己让开一条路。',
  },
};

const GEAR_SETS = {
  oldgate: {
    id: 'oldgate', name: '旧山门', need: 2,
    bonus: { hpPct: 0.05 },
    members: ['shanmen_bell', 'qingxi_seal', 'wuyin_talisman', 'shougu_bell'],
  },
  tide: {
    id: 'tide', name: '潮声', need: 2,
    bonus: { catchPct: 0.05 },
    members: ['guixu_talisman', 'yunmeng_talisman', 'suolingjiao_talisman', 'tide_song_bell', 'mengyin_talisman'],
  },
  abyss: {
    id: 'abyss', name: '渊火', need: 2,
    bonus: { atkPct: 0.06 },
    members: ['luoxing_seal', 'gutan_bell', 'shenyuan_seal', 'xingyun_seal', 'wuxiang_seal', 'chiyuan_bell', 'nameless_bell', 'duan_ling'],
  },
};

function gearAddMods(target, mods) {
  if (!mods) return;
  Object.keys(mods).forEach(function (key) {
    if (GEAR_MOD_KEYS.indexOf(key) < 0) return;
    target[key] = (target[key] || 0) + Number(mods[key] || 0);
  });
}

// 返回该灵兽当前装备的合计词条（含 2 件套）
function gearEffect(mon) {
  const out = {};
  if (!mon || !mon.gear) return out;
  const setCount = {};
  Object.keys(GEAR_SLOTS).forEach(function (slot) {
    const ref = mon.gear[slot];
    const def = ref && GEAR[ref.id];
    if (!def || def.slot !== slot) return;
    gearAddMods(out, def.mods);
    if (def.set && GEAR_SETS[def.set]) setCount[def.set] = (setCount[def.set] || 0) + 1;
  });
  Object.keys(setCount).forEach(function (sid) {
    const set = GEAR_SETS[sid];
    if (!set) return;
    if (setCount[sid] >= (set.need || 2)) gearAddMods(out, set.bonus);
  });
  return out;
}

function gearRefOf(mon, slot) {
  if (!mon || !mon.gear) return null;
  const ref = mon.gear[slot];
  if (!ref || !GEAR[ref.id] || GEAR[ref.id].slot !== slot) return null;
  return ref;
}

function gearSetCount(mon) {
  const counts = {};
  if (!mon || !mon.gear) return counts;
  Object.keys(GEAR_SLOTS).forEach(function (slot) {
    const ref = mon.gear[slot];
    const def = ref && GEAR[ref.id];
    if (def && def.set) counts[def.set] = (counts[def.set] || 0) + 1;
  });
  return counts;
}
