// 灵兽录 · 主控层 · 状态、存档与迁移
// 灵兽录 · 主控层（v3）：状态、存档迁移、剧情任务、经济、图鉴、战斗桥接、结局与输入
// 经典脚本，无 import/export；面板 HTML 由 ui.js 提供。

window.LB = window.LB || {};

function byId(id) { return document.getElementById(id); }

const SAVE_KEY = 'lingbeast.save.v4';
const V3_KEY = 'lingbeast.save.v3';
const V2_KEY = 'lingbeast.save.v2';
const V1_KEY = 'lingbeast.save.v1';
const BACKUP_KEY = 'lingbeast.save.v3.backup';
const MAX_TEAM = 3;
const MAX_LV = 40;

const REP_KEYS = ['shanmen', 'yaolu', 'tiangongsi', 'guixu', 'chiyuan', 'shenyuan'];

const TEXT_DELAYS = { slow: 42, normal: 26, fast: 12, instant: 0 };

// 老存档的 NPC 既有标记（talk 类目标两种写法都认）
const TALK_FLAGS = {
  gate_elder: 'gateElderMet',
  valley_elder: 'elderMet',
  aheng: 'herbalistMet',
  zhuling: 'zhulingMet',
  haishi: 'haishiMet',
  yimin: 'yiminMet',
  trial_guard: 'trialGuardMet',
};

// Boss 胜利后的章节与附带标记
const BOSS_CHAPTER = { shougu: 2, wuyinxiao: 3, xingyun: 4, suolingjiao: 5, shenmu: 6, chiyuan: 7, wuxiang: 8 };
const BOSS_FLAGS = { xingyun: ['lockShard'], shenmu: ['mirageBroken'], chiyuan: ['wujiuAwake'] };

const BESTIARY_MILESTONES = [
  { pct: 25, flag: 'bestiary_25', text: function () { LB.giveJade(20); LB.revealCodex('shiershanmen'); return '灵玉 +20 · 山海志「十二山门」'; } },
  { pct: 50, flag: 'bestiary_50', text: function () { LB.giveJade(30); LB.giveItem('charm', 3); return '灵玉 +30 · 灵符 +3'; } },
  { pct: 75, flag: 'bestiary_75', text: function () { LB.giveJade(50); LB.givePassive('jianjia'); return '灵玉 +50 · 灵诀「坚甲」'; } },
  { pct: 100, flag: 'bestiary_100', text: function () { LB.giveJade(120); LB.givePassive('qixin'); LB.giveMaterial('shensha', 3); return '灵玉 +120 · 灵诀「契心」· 蜃砂 +3'; } },
];

let state = null;
let activeDialog = null;
let migratedNote = false;
let bootSyncDone = false;
let toastTimerId = null;
let regionTitleTimer = null;
let uidSeq = 0;

// ---------- 数值 ----------
function clampInt(v, a, b) { return Math.max(a, Math.min(b, Math.round(v))); }

function mkUid() {
  uidSeq += 1;
  return 'm' + Date.now().toString(36) + uidSeq.toString(36);
}

function normalizeGearRef(ref, slot) {
  if (!ref || typeof ref !== 'object' || !ref.uid) return null;
  const def = typeof GEAR !== 'undefined' ? GEAR[ref.id] : null;
  if (!def || def.slot !== slot) return null;
  return { uid: String(ref.uid), id: ref.id };
}

function normalizeGearSlots(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const out = {};
  if (typeof GEAR_SLOTS === 'undefined') return out;
  Object.keys(GEAR_SLOTS).forEach(function (slot) {
    out[slot] = normalizeGearRef(src[slot], slot);
  });
  return out;
}

function newMon(sp, lv, opts) {
  const o = opts || {};
  const sid = SPECIES[sp] ? sp : 'moyu';
  const level = clampInt(Number(lv) || 3, 1, MAX_LV);
  const talent = typeof o.talent === 'number' ? o.talent : 0.9 + Math.random() * 0.2;
  const mon = {
    uid: o.uid || mkUid(),
    sp: sid,
    lv: level,
    exp: 0,
    hp: 0,
    guard: 0,
    talent: Math.round(talent * 1000) / 1000,
    bond: typeof o.bond === 'number' ? o.bond : 0,
    passive: o.passive || null,
    statuses: {},
    cd: {},
    gear: normalizeGearSlots(o.gear),
  };
  mon.hp = statsOf(sid, level, mon).hp;
  return mon;
}

function statsOf(sp, lv, mon) {
  const d = SPECIES[sp];
  if (!d) return { hp: 1, atk: 1, def: 1, spd: 1, el: 'wood', name: '灵兽' };
  const t = mon && typeof mon.talent === 'number' && mon.talent > 0 ? mon.talent : 1;
  const l = Math.max(1, Number(lv) || 1);
  const b = d.base;
  const g = d.grow;
  // 稀有度直接决定强度
  const rm = typeof rarityOf === 'function' ? rarityOf(d).mult : 1;
  const ge = typeof gearEffect === 'function' ? gearEffect(mon) : {};
  const hpPct = 1 + (ge.hpPct || 0);
  const atkPct = 1 + (ge.atkPct || 0);
  const defPct = 1 + (ge.defPct || 0);
  const spdPct = 1 + (ge.spdPct || 0);
  return {
    hp: Math.round((b.hp + g.hp * (l - 1)) * rm * t * hpPct),
    atk: Math.round((b.atk + g.atk * (l - 1)) * rm * t * atkPct),
    def: Math.round((b.def + g.def * (l - 1)) * rm * t * defPct),
    spd: Math.round((b.spd + g.spd * (l - 1)) * rm * t * spdPct),
    el: d.el,
    name: d.name,
  };
}

function skillsOf(mon) {
  const d = SPECIES[mon && mon.sp];
  if (!d) return [];
  const out = [];
  (d.sk || []).forEach(function (entry) {
    if (mon.lv >= entry[0] && SKILLS[entry[1]] && out.indexOf(entry[1]) < 0) out.push(entry[1]);
  });
  return out;
}

function expNeed(lv) { return 22 + lv * 16; }

// ---------- 状态与默认值 ----------
function normalizeMon(m) {
  if (!m || typeof m !== 'object') return null;
  const sid = SPECIES[m.sp] ? m.sp : 'moyu';
  const lv = clampInt(Number(m.lv) || 3, 1, MAX_LV);
  const talent = typeof m.talent === 'number' && m.talent > 0.5 && m.talent < 2
    ? m.talent
    : 0.9 + Math.random() * 0.2;
  const mon = {
    uid: m.uid || mkUid(),
    sp: sid,
    lv: lv,
    exp: Number(m.exp) || 0,
    hp: 0,
    guard: 0,
    talent: Math.round(talent * 1000) / 1000,
    bond: Number(m.bond) || 0,
    passive: PASSIVES[m.passive] ? m.passive : null,
    statuses: m.statuses && typeof m.statuses === 'object' ? m.statuses : {},
    cd: m.cd && typeof m.cd === 'object' ? m.cd : {},
    gear: normalizeGearSlots(m.gear),
  };
  const max = statsOf(sid, lv, mon).hp;
  mon.hp = typeof m.hp === 'number' ? clampInt(m.hp, 0, max) : max;
  return mon;
}

function normalizeState(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const s = obj;
  s.v = 4;
  s.region = REGIONS[s.region] ? s.region : 'shanmen';
  s.chapter = clampInt(Number(s.chapter) || 1, 1, 8);
  const region = REGIONS[s.region] || REGIONS.shanmen;
  if (!s.pos || typeof s.pos.x !== 'number' || typeof s.pos.y !== 'number') {
    s.pos = { x: region.spawn.x, y: region.spawn.y };
  }
  const team = [];
  (Array.isArray(s.team) ? s.team : []).forEach(function (m) {
    const mon = normalizeMon(m);
    if (mon) team.push(mon);
  });
  s.team = team.length ? team : [newMon('moyu', 3)];
  const storage = [];
  (Array.isArray(s.storage) ? s.storage : []).forEach(function (m) {
    const mon = normalizeMon(m);
    if (mon) storage.push(mon);
  });
  s.storage = storage;
  s.items = Object.assign({ pill: 0, charm: 0 }, s.items || {});
  s.materials = Object.assign({}, s.materials || {});
  s.jade = Number(s.jade) || 0;
  s.flags = Object.assign({}, s.flags || {});
  s.quests = s.quests && typeof s.quests === 'object' ? s.quests : {};
  s.quests.side = s.quests.side && typeof s.quests.side === 'object' ? s.quests.side : {};
  s.quests.bounty = s.quests.bounty && typeof s.quests.bounty === 'object' ? s.quests.bounty : {};
  s.bestiary = s.bestiary && typeof s.bestiary === 'object' ? s.bestiary : {};
  Object.keys(s.bestiary).forEach(function (sp) {
    const b = s.bestiary[sp] || {};
    s.bestiary[sp] = { seen: !!b.seen, defeated: !!b.defeated, caught: !!b.caught, evolved: !!b.evolved };
  });
  s.codex = s.codex && typeof s.codex === 'object' ? s.codex : {};
  s.steles = s.steles && typeof s.steles === 'object' ? s.steles : {};
  s.passives = s.passives && typeof s.passives === 'object' ? s.passives : {};
  s.recipes = s.recipes && typeof s.recipes === 'object' ? s.recipes : {};
  s.trials = s.trials && typeof s.trials === 'object' ? s.trials : {};
  s.gathered = s.gathered && typeof s.gathered === 'object' ? s.gathered : {};
  s.stance = clampInt(Number(s.stance) || 0, -20, 20);
  const repSrc = s.rep && typeof s.rep === 'object' ? s.rep : {};
  s.rep = {};
  REP_KEYS.forEach(function (key) {
    s.rep[key] = clampInt(Number(repSrc[key]) || 0, -3, 3);
  });
  const choiceSrc = s.choices && typeof s.choices === 'object' ? s.choices : {};
  s.choices = {};
  Object.keys(choiceSrc).forEach(function (cid) {
    const entry = choiceSrc[cid];
    if (!entry || typeof entry !== 'object') return;
    const option = Number(entry.option);
    if (option !== 0 && option !== 1) return;
    s.choices[cid] = { option: option, at: Number(entry.at) || Date.now() };
  });
  const bagSrc = Array.isArray(s.gearBag) ? s.gearBag : [];
  s.gearBag = [];
  const gearSeen = {};
  bagSrc.forEach(function (entry) {
    if (!entry || typeof entry !== 'object' || !entry.uid) return;
    const def = typeof GEAR !== 'undefined' ? GEAR[entry.id] : null;
    if (!def || gearSeen[entry.uid]) return;
    gearSeen[entry.uid] = true;
    s.gearBag.push({ uid: String(entry.uid), id: entry.id });
  });
  s.gearSeq = Number(s.gearSeq) || 0;
  s.cageLevel = clampInt(Number(s.cageLevel) || 1, 1, 5);
  s.ending = s.ending === 'new' || s.ending === 'cut' ? s.ending : null;
  s.postgame = !!s.postgame;
  const stats = s.stats || {};
  s.stats = {
    battles: Number(stats.battles) || 0,
    wins: Number(stats.wins) || 0,
    catches: Number(stats.catches) || 0,
    steps: Number(stats.steps) || 0,
    startedAt: Number(stats.startedAt) || Date.now(),
  };
  s.settings = Object.assign({ textSpeed: 'normal', reduceMotion: false, shake: true, confirm: true }, s.settings || {});
  if (TEXT_DELAYS[s.settings.textSpeed] === undefined) s.settings.textSpeed = 'normal';
  s.time = Object.assign({ phase: 'dawn', steps: 0 }, s.time || {});
  if (!TIME_PHASES[s.time.phase]) s.time.phase = 'dawn';
  Object.keys(RECIPES).forEach(function (id) {
    const rec = RECIPES[id];
    if (rec.unlock && rec.unlock.kind === 'start') s.recipes[id] = true;
  });
  s.updatedAt = Number(s.updatedAt) || Date.now();
  return s;
}

function freshState() {
  const starter = newMon('moyu', 3);
  const best = {};
  best[starter.sp] = { seen: true, defeated: false, caught: true, evolved: false };
  return normalizeState({
    v: 4,
    region: 'shanmen',
    pos: { x: REGIONS.shanmen.spawn.x, y: REGIONS.shanmen.spawn.y },
    chapter: 1,
    team: [starter],
    storage: [],
    items: { pill: 3, charm: 2 },
    materials: {},
    jade: 20,
    flags: {},
    quests: { side: {}, bounty: {} },
    bestiary: best,
    codex: {},
    steles: {},
    passives: {},
    recipes: {},
    trials: {},
    gathered: {},
    stance: 0,
    rep: {},
    choices: {},
    gearBag: [],
    gearSeq: 0,
    cageLevel: 1,
    ending: null,
    postgame: false,
    stats: { battles: 0, wins: 0, catches: 0, steps: 0, startedAt: Date.now() },
    settings: { textSpeed: 'normal', reduceMotion: false, shake: true, confirm: true },
    time: { phase: 'dawn', steps: 0 },
    updatedAt: Date.now(),
  });
}

// ---------- 存档 / 迁移 ----------
function readSave(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return null;
    if (!obj.v && !Array.isArray(obj.team) && !obj.pos && !obj.gates && obj.story === undefined) return null;
    return obj;
  } catch (e) { return null; }
}

function migrate(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.v === 4) return normalizeState(obj);
  if (obj.v === 3) {
    try {
      if (!localStorage.getItem(BACKUP_KEY)) localStorage.setItem(BACKUP_KEY, JSON.stringify(obj));
    } catch (e) {}
    migratedNote = true;
    return normalizeState(Object.assign({}, obj, { v: 4 }));
  }

  // 保留原始 v2/v1 payload，已有备份则不覆盖
  try {
    if (!localStorage.getItem(BACKUP_KEY)) localStorage.setItem(BACKUP_KEY, JSON.stringify(obj));
  } catch (e) {}

  migratedNote = true;
  const isV1 = !obj.v || obj.v === 1;
  let story = Number(obj.story) || 0;
  const gates = Array.isArray(obj.gates) ? obj.gates : [];
  if (isV1 && gates[0]) story = Math.max(story, 2);

  const sceneMap = ['qingxi', 'wuyin', 'gutan'];
  const region = sceneMap[Number(obj.scene) || 0] || 'qingxi';
  const chapterMap = [1, 1, 2, 2, 2, 3, 6, 8];
  let chapter = chapterMap[story] === undefined ? 1 : chapterMap[story];
  chapter = clampInt(chapter, 1, 8);

  const flags = Object.assign({}, obj.flags || {});
  const gateBoss = ['shougu', 'wuyinxiao', 'chiyuan'];
  gateBoss.forEach(function (bid, i) { if (gates[i]) flags['boss_' + bid] = true; });
  if (isV1) {
    if (gates[0]) flags.boss_shougu = true;
    if (gates[1]) flags.boss_wuyinxiao = true;
  }

  const team = [];
  (Array.isArray(obj.team) ? obj.team : []).forEach(function (m) {
    const mon = normalizeMon(m);
    if (mon) team.push(mon);
  });
  if (!team.length) team.push(newMon('moyu', 3));
  // 老存档队伍可能超过 3 只，多出的移入灵兽栏，避免丢兽
  const storage = [];
  while (team.length > MAX_TEAM) storage.push(team.pop());

  const bestiary = {};
  team.concat(storage).forEach(function (m) {
    const b = bestiary[m.sp] || { seen: false, defeated: false, caught: false, evolved: false };
    b.seen = true;
    b.caught = true;
    if (SPECIES[m.sp] && SPECIES[m.sp].evolved) b.evolved = true;
    bestiary[m.sp] = b;
  });
  Object.keys(obj.bestiary || {}).forEach(function (sp) {
    if (!SPECIES[sp]) return;
    const b = Object.assign({ seen: false, defeated: false, caught: false, evolved: false }, obj.bestiary[sp]);
    bestiary[sp] = {
      seen: !!b.seen || !!bestiary[sp],
      defeated: !!b.defeated,
      caught: !!b.caught || !!bestiary[sp],
      evolved: !!b.evolved,
    };
  });

  const stats = obj.stats || {};
  return normalizeState({
    v: 4,
    region: region,
    pos: { x: REGIONS[region].spawn.x, y: REGIONS[region].spawn.y },
    chapter: chapter,
    team: team,
    storage: storage,
    items: Object.assign({ pill: 3, charm: 2 }, obj.items || {}),
    materials: Object.assign({}, obj.materials || {}),
    jade: Math.max(30, Number(obj.jade) || 0),
    flags: flags,
    quests: { side: {}, bounty: {} },
    bestiary: bestiary,
    codex: {},
    steles: {},
    passives: {},
    recipes: {},
    trials: {},
    gathered: {},
    cageLevel: 1,
    ending: null,
    postgame: false,
    stats: {
      battles: Number(stats.battles) || 0,
      wins: Number(stats.wins) || 0,
      catches: Number(stats.catches) || 0,
      steps: Number(stats.steps) || 0,
      startedAt: Number(stats.startedAt) || Date.now(),
    },
    settings: { textSpeed: 'normal', reduceMotion: false, shake: true, confirm: true },
    time: { phase: 'dawn', steps: 0 },
    updatedAt: Number(obj.updatedAt) || Date.now(),
  });
}

function loadLocal() {
  try {
    const v4 = readSave(SAVE_KEY);
    if (v4) return normalizeState(v4);
    const v3 = readSave(V3_KEY);
    if (v3) return migrate(v3);
    const v2 = readSave(V2_KEY);
    if (v2) return migrate(v2);
    const v1 = readSave(V1_KEY);
    if (v1) return migrate(v1);
  } catch (e) { return null; }
  return null;
}

function hasStoredSave() {
  try {
    return !!(localStorage.getItem(SAVE_KEY) || localStorage.getItem(V3_KEY) ||
      localStorage.getItem(V2_KEY) || localStorage.getItem(V1_KEY));
  } catch (e) { return false; }
}

function persist() {
  if (!state) return;
  state.updatedAt = Date.now();
  const payload = JSON.stringify(state);
  try { localStorage.setItem(SAVE_KEY, payload); } catch (e) {}
  if (window.Cloud && typeof Cloud.push === 'function') {
    try { Cloud.push(payload, state.updatedAt); } catch (e) {}
  }
}
