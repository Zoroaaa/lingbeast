// 灵兽录 · 主控层 · 经济、收契、图鉴与进化

// ---------- 经济 ----------
function jade() { return state ? (state.jade || 0) : 0; }

function giveJade(n) {
  if (!state) return;
  state.jade = (state.jade || 0) + (Number(n) || 0);
  updateHud();
}

function spendJade(n) {
  if (!state) return false;
  const cost = Number(n) || 0;
  if ((state.jade || 0) < cost) return false;
  state.jade -= cost;
  updateHud();
  return true;
}

function itemCount(id) { return state && state.items ? (state.items[id] || 0) : 0; }

function giveItem(id, n) {
  if (!state) return false;
  if (!ITEMS[id]) return false;
  state.items[id] = (state.items[id] || 0) + (Number(n) || 1);
  updateHud();
  return true;
}

function consumeItem(id, n) {
  if (!state) return false;
  const cost = Number(n) || 1;
  if ((state.items[id] || 0) < cost) return false;
  state.items[id] -= cost;
  updateHud();
  return true;
}

function matCount(id) { return state && state.materials ? (state.materials[id] || 0) : 0; }

function giveMaterial(id, n) {
  if (!state) return false;
  if (!MATERIALS[id]) return false;
  state.materials[id] = (state.materials[id] || 0) + (Number(n) || 1);
  updateHud();
  return true;
}

function consumeMaterial(id, n) {
  if (!state) return false;
  const cost = Number(n) || 1;
  if ((state.materials[id] || 0) < cost) return false;
  state.materials[id] -= cost;
  updateHud();
  return true;
}

function hasRecipe(id) { return !!(state && state.recipes && state.recipes[id]); }

function giveRecipe(id, silent) {
  if (!state || !RECIPES[id] || state.recipes[id]) return false;
  state.recipes[id] = true;
  if (!silent) toast('得丹方 · ' + RECIPES[id].name);
  return true;
}

function hasPassive(id) { return !!(state && state.passives && state.passives[id]); }

function givePassive(id, silent) {
  if (!state || !PASSIVES[id] || state.passives[id]) return false;
  state.passives[id] = true;
  if (!silent) toast('得灵诀 · ' + PASSIVES[id].name);
  return true;
}

function storageCap() {
  const lv = state ? (state.cageLevel || 1) : 1;
  return 6 + (lv - 1) * 6;
}

function cageCost() {
  const lv = state ? (state.cageLevel || 1) : 1;
  return { jade: 120 + (lv - 1) * 80, mats: [{ id: 'xuantie', count: 1 + (lv - 1) }] };
}

function upgradeCage() {
  if (!state) return { ok: false, msg: '无存档' };
  if (state.cageLevel >= 5) return { ok: false, msg: '灵笼已至最稳' };
  const cost = cageCost();
  if ((state.jade || 0) < cost.jade) return { ok: false, msg: '灵玉不足 · 需 ' + cost.jade };
  for (let i = 0; i < cost.mats.length; i += 1) {
    const m = cost.mats[i];
    if (matCount(m.id) < m.count) {
      return { ok: false, msg: '缺少' + (MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' ×' + m.count };
    }
  }
  spendJade(cost.jade);
  cost.mats.forEach(function (m) { consumeMaterial(m.id, m.count); });
  state.cageLevel += 1;
  toast('灵笼已固 · 灵兽栏可容 ' + storageCap() + ' 只');
  persist();
  updateHud();
  return { ok: true, msg: '灵笼升至 ' + state.cageLevel + ' 阶' };
}

// ---------- 收契与图鉴 ----------
function giveMon(sp, lv, opts) {
  if (!state || !SPECIES[sp]) return null;
  const mon = newMon(sp, lv, opts);
  bestiaryMark(sp, 'seen');
  if (state.team.length < MAX_TEAM) {
    state.team.push(mon);
    toast(statsOf(sp, mon.lv, mon).name + ' 入队');
  } else if (state.storage.length < storageCap()) {
    state.storage.push(mon);
    toast(statsOf(sp, mon.lv, mon).name + ' 入灵兽栏');
  } else {
    toast('灵兽栏已满 · 契未落定');
    return null;
  }
  updateHud();
  return mon;
}

function bestiaryProgress() {
  const total = Object.keys(SPECIES).length;
  let seen = 0;
  let caught = 0;
  const b = state && state.bestiary ? state.bestiary : {};
  Object.keys(b).forEach(function (sp) {
    if (!SPECIES[sp]) return;
    if (b[sp] && b[sp].seen) seen += 1;
    if (b[sp] && b[sp].caught) caught += 1;
  });
  return { seen: seen, caught: caught, total: total, pct: total ? Math.round(seen / total * 100) : 0 };
}

function bestiaryMark(sp, key) {
  if (!state || !SPECIES[sp]) return;
  if (!state.bestiary) state.bestiary = {};
  const b = state.bestiary[sp] || { seen: false, defeated: false, caught: false, evolved: false };
  b.seen = true;
  if (key === 'seen' || key === 'defeated' || key === 'caught' || key === 'evolved') b[key] = true;
  state.bestiary[sp] = b;

  const prog = bestiaryProgress();
  BESTIARY_MILESTONES.forEach(function (m) {
    if (prog.pct >= m.pct && !flag(m.flag)) {
      flagSet(m.flag, true);
      const text = m.text();
      toast('灵兽录 ' + m.pct + '% · ' + text);
    }
  });
  Object.keys(CODEX).forEach(function (cid) {
    const c = CODEX[cid];
    if (c.unlock && c.unlock.type === 'codexPct' && prog.pct >= (c.unlock.value || 0)) revealCodex(cid);
  });
}

function codexEntries() {
  return Object.keys(CODEX).map(function (id) {
    const e = CODEX[id];
    return {
      id: id,
      category: e.category,
      title: e.title,
      body: e.body,
      unlock: e.unlock,
      unlocked: !!(state && state.codex && state.codex[id]),
    };
  });
}

function codexUnlocked(id) { return !!(state && state.codex && state.codex[id]); }

function revealCodex(id) {
  if (!state || !CODEX[id]) return false;
  if (state.codex[id]) return false;
  state.codex[id] = true;
  Object.keys(RECIPES).forEach(function (rid) {
    const rec = RECIPES[rid];
    if (rec.unlock && rec.unlock.kind === 'codex' && rec.unlock.id === id) giveRecipe(rid, true);
  });
  toast('山海志 · ' + CODEX[id].title);
  return true;
}

function stelesCount() {
  if (!state || !state.steles) return 0;
  return Object.keys(state.steles).filter(function (k) { return !!state.steles[k]; }).length;
}

function trials() {
  return TRIALS.map(function (t) {
    return {
      floor: t.floor,
      name: t.name,
      desc: t.desc,
      rule: t.rule,
      boss: t.boss,
      reward: t.reward,
      cleared: trialCleared(t.floor),
    };
  });
}

function trialCleared(floor) { return !!(state && state.trials && state.trials[floor]); }

// ---------- 进化 ----------
function canEvolve(mon) {
  if (!mon || !SPECIES[mon.sp]) return { ok: false, name: '', msg: '灵兽不可辨' };
  const d = SPECIES[mon.sp];
  if (!d.evolve) return { ok: false, name: d.name, msg: '此灵已至形尽，不可再化' };
  const ev = d.evolve;
  if (mon.lv < ev.lv) return { ok: false, name: d.name, msg: '需达 Lv.' + ev.lv + ' 方可化形' };
  for (let i = 0; i < (ev.mats || []).length; i += 1) {
    const m = ev.mats[i];
    if (matCount(m.id) < m.count) {
      return { ok: false, name: d.name, msg: '缺少' + (MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' ×' + m.count };
    }
  }
  return { ok: true, name: d.name, msg: '可化为「' + SPECIES[ev.to].name + '」' };
}

function evolveMon(mon) {
  const check = canEvolve(mon);
  if (!check.ok) return check;
  const from = mon.sp;
  const def = SPECIES[from];
  const ev = def.evolve;
  const oldMax = statsOf(mon.sp, mon.lv, mon).hp;
  const ratio = oldMax > 0 ? Math.max(0, Math.min(1, mon.hp / oldMax)) : 1;
  (ev.mats || []).forEach(function (m) { consumeMaterial(m.id, m.count); });
  mon.sp = ev.to;
  const newMax = statsOf(mon.sp, mon.lv, mon).hp;
  mon.hp = Math.max(1, Math.round(newMax * ratio));
  bestiaryMark(from, 'evolved');
  bestiaryMark(ev.to, 'seen');
  bestiaryMark(ev.to, 'evolved');
  toast('「' + def.name + '」化形为「' + SPECIES[ev.to].name + '」');
  persist();
  updateHud();
  checkSideQuests();
  return { ok: true, name: SPECIES[ev.to].name, msg: '化形已成 · ' + SPECIES[ev.to].name };
}
