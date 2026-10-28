// 灵兽录 · 主控层 · 剧情、区域、任务与悬赏
// ---------- 剧情与标记 ----------
function story() { return state ? state.chapter : 1; }

function chapterDef() {
  if (!state) return MAIN_CHAPTERS[0];
  const idx = clampInt((state.chapter || 1) - 1, 0, MAIN_CHAPTERS.length - 1);
  return MAIN_CHAPTERS[idx];
}

function setStory(n) {
  if (!state) return;
  const next = clampInt(Number(n) || 1, 1, MAIN_CHAPTERS.length);
  if (next <= state.chapter) { updateHud(); persist(); return; }
  const prev = state.chapter || 1;
  state.chapter = next;
  for (let i = prev; i < next; i += 1) {
    const def = MAIN_CHAPTERS[i - 1];
    if (def && typeof def.onComplete === 'function') {
      try { def.onComplete(); } catch (e) { console.error('[灵兽录] 章节回调失败', e); }
    }
  }
  updateHud();
  persist();
  if (typeof tutorialEvent === 'function') tutorialEvent('chapter:' + state.chapter);
}

function flag(name) { return !!(state && state.flags && state.flags[name]); }

function flagSet(name, value) {
  if (!state) return;
  state.flags[name] = !!value;
  const wv = byId('view-world');
  if (wv && !wv.hidden && !battleActive()) updateHud();
}

// ---------- HUD 与标题 ----------
function updateHud() {
  if (state && typeof LB.renderHud === 'function') {
    try { LB.renderHud(); } catch (e) { console.error('[灵兽录] HUD 渲染失败', e); }
  }
  refreshTitle();
}

function refreshTitle() {
  if (typeof renderAccountChip === 'function') renderAccountChip();
  const cont = byId('btn-continue');
  if (cont) cont.hidden = !state;
  const prog = byId('title-progress');
  if (!prog) return;
  if (!state) {
    prog.hidden = true;
    prog.textContent = '';
    return;
  }
  const region = REGIONS[state.region];
  const bp = typeof bestiaryProgress === 'function' ? bestiaryProgress() : { seen: 0, total: 0 };
  prog.hidden = false;
  prog.textContent = '第 ' + state.chapter + ' 章 · ' + (region ? region.name : '') +
    (bp.total ? ' · 图鉴 ' + bp.seen + '/' + bp.total : '');
}

// ---------- 区域 ----------
function region() { return state ? state.region : 'shanmen'; }
function regionDef(id) { return REGIONS[id] || null; }

function regionUnlocked(id) {
  const r = REGIONS[id];
  if (!r) return false;
  if (id === 'shanmen') return true;
  const ch = state ? state.chapter : 1;
  const u = r.unlock;
  if (!u) return (r.chapter || 0) <= ch;
  if (u.postgame) return !!(state && state.postgame);
  if (u.chapter) return ch >= u.chapter;
  if (u.flag) return !!(state && state.flags && state.flags[u.flag]);
  if (u.quest) {
    const e = state && state.quests && state.quests.side ? state.quests.side[u.quest] : null;
    return !!(e && e.rewarded);
  }
  if (u.codexPct) return bestiaryProgress().pct >= u.codexPct;
  return true;
}

function refreshWeatherGathers(regionId) {
  if (!state || !state.gathered) return;
  const r = REGIONS[regionId];
  if (!r) return;
  (r.gathers || []).forEach(function (g) {
    if (g.respawn === 'weather') delete state.gathered[g.id];
  });
}

function showRegionTitle(r) {
  const box = byId('region-title');
  if (!box) return;
  const ch = byId('region-title-chapter');
  const nm = byId('region-title-name');
  const sub = byId('region-title-sub');
  if (ch) ch.textContent = r.chapter ? '第 ' + r.chapter + ' 境' : '中枢';
  if (nm) nm.textContent = r.name;
  if (sub) sub.textContent = r.subtitle || '';
  box.hidden = false;
  box.classList.remove('show');
  void box.offsetWidth;
  box.classList.add('show');
  const world = byId('view-world');
  if (world) world.classList.add('region-intro');
  if (typeof announce === 'function') announce(r.name + (r.subtitle ? ' · ' + r.subtitle : ''));
  clearTimeout(regionTitleTimer);
  regionTitleTimer = setTimeout(function () {
    box.hidden = true;
    box.classList.remove('show');
    if (world) world.classList.remove('region-intro');
  }, 2200);
}

function enterRegion(id, spawn, opts) {
  const r = REGIONS[id];
  if (!state || !r) return;
  const p = spawn || r.spawn;
  showView('view-world');
  state.region = id;
  if (!state.visited || typeof state.visited !== 'object') state.visited = {};
  state.visited[id] = true;
  state.pos = { x: p.x, y: p.y };
  refreshWeatherGathers(id);
  if (typeof showWorldLoading === 'function') showWorldLoading();
  if (window.World) {
    if (typeof World.resume === 'function') World.resume();
    if (typeof World.load === 'function') World.load(id, p);
  }
  updateHud();
  if (!opts || opts.title !== false) showRegionTitle(r);
  if (typeof tutorialEvent === 'function') tutorialEvent('region:' + id);
}

function setPosition(x, y) {
  if (state) state.pos = { x: x, y: y };
}

async function tryExit(exit) {
  if (!state || !exit || activeDialog || battleActive()) return;
  const need = exit.need;
  if (need && need.chapter && state.chapter < need.chapter) {
    toast('前路未开');
    return;
  }
  const target = exit.to;
  if (!REGIONS[target]) return;
  if (!regionUnlocked(target)) {
    toast('那片区域还未点亮');
    return;
  }
  await fadeTo(function () {
    state.region = target;
    state.pos = { x: REGIONS[target].spawn.x, y: REGIONS[target].spawn.y };
    enterRegion(target, REGIONS[target].spawn);
    toast('进入 · ' + REGIONS[target].name);
  });
  persist();
}

async function travelTo(id) {
  if (!state || activeDialog || battleActive()) return;
  if (!REGIONS[id]) { toast('阵法不通此境'); return; }
  if (!regionUnlocked(id)) { toast('阵眼未亮 · 先过前一境主线'); return; }
  await fadeTo(function () {
    enterRegion(id, REGIONS[id].spawn);
    toast('阵法一转 · ' + REGIONS[id].name);
  });
  persist();
}

// ---------- 主线 ----------
function objectiveDone(ob) {
  if (!state || !ob) return false;
  if (ob.type === 'talk') {
    if (flag('talked_' + ob.key)) return true;
    const alt = TALK_FLAGS[ob.key];
    return !!(alt && flag(alt));
  }
  if (ob.type === 'boss') return flag('boss_' + ob.key);
  if (ob.type === 'region') return state.region === ob.key;
  if (ob.type === 'flag') return !!state.flags[ob.key];
  if (ob.type === 'item') {
    const need = ob.count || 1;
    const have = (state.items[ob.key] || 0) + (state.materials[ob.key] || 0);
    return have >= need;
  }
  if (ob.type === 'catch') return (state.stats.catches || 0) >= (ob.count || 1);
  if (ob.type === 'count') {
    if (ob.key === 'sideQuests') return sideQuestDoneCount() >= (ob.count || 1);
    if (ob.key === 'steles') return stelesCount() >= (ob.count || 1);
    return false;
  }
  return false;
}

function mainQuestState() {
  const def = chapterDef();
  if (!def) return { chapter: 1, title: '', summary: '', objectives: [], done: false };
  const objectives = (def.objectives || []).map(function (ob) {
    return { text: ob.text, done: objectiveDone(ob) };
  });
  return {
    chapter: state ? state.chapter : 1,
    title: def.title,
    summary: def.summary || '',
    objectives: objectives,
    done: objectives.length > 0 && objectives.every(function (o) { return o.done; }),
  };
}

// ---------- 支线 ----------
function findQuest(id) {
  for (let i = 0; i < SIDE_QUESTS.length; i += 1) if (SIDE_QUESTS[i].id === id) return SIDE_QUESTS[i];
  return null;
}

// 支线统一为“阶段链”：旧任务没有 stages 时，自动视为单阶段。
function questStages(q) {
  if (q.stages && q.stages.length) return q.stages;
  return [{
    text: (q.steps && q.steps[0]) || q.desc || '',
    check: q.check,
  }];
}

function stageDone(stage) {
  if (!stage) return false;
  if (typeof stage.check === 'function') {
    try { return !!stage.check(); } catch (e) { return false; }
  }
  if (stage.flag) return !!flag(stage.flag);
  return false;
}

function sideQuestList() {
  const chapter = state ? state.chapter : 1;
  return SIDE_QUESTS.map(function (q) {
    const entry = state && state.quests.side ? state.quests.side[q.id] : null;
    const stages = questStages(q);
    const stageIdx = entry && typeof entry.stage === 'number' ? entry.stage : 0;
    const rewarded = !!(entry && entry.rewarded);
    return {
      id: q.id,
      title: q.title,
      desc: q.desc,
      stages: stages.map(function (st, i) {
        return { text: st.text, done: rewarded || i < stageIdx, current: !rewarded && i === stageIdx };
      }),
      stageIndex: stageIdx,
      stageCount: stages.length,
      giver: q.giver,
      unlockChapter: q.unlockChapter || 1,
      unlocked: chapter >= (q.unlockChapter || 1),
      accepted: !!(entry && entry.accepted),
      done: rewarded || stageIdx >= stages.length,
      rewarded: rewarded,
    };
  });
}

function acceptSideQuest(id, silent) {
  if (!state) return false;
  const q = findQuest(id);
  if (!q) return false;
  if (state.chapter < (q.unlockChapter || 1)) {
    if (!silent) toast('尚未到接取之时');
    return false;
  }
  if (!state.quests.side[id]) {
    state.quests.side[id] = { accepted: true, rewarded: false, stage: 0, at: Date.now() };
    if (!silent) toast('接下支线 · ' + q.title);
    persist();
    updateHud();
    return true;
  }
  if (!silent) toast('此支线已在册');
  return true;
}

function grantQuestRecipes(questId) {
  Object.keys(RECIPES).forEach(function (rid) {
    const rec = RECIPES[rid];
    if (rec.unlock && rec.unlock.kind === 'quest' && rec.unlock.id === questId) giveRecipe(rid);
  });
}

function checkSideQuests() {
  if (!state) return;
  SIDE_QUESTS.forEach(function (q) {
    const entry = state.quests.side[q.id];
    if (!entry || !entry.accepted || entry.rewarded) return;
    const stages = questStages(q);
    let idx = typeof entry.stage === 'number' ? entry.stage : 0;
    let advanced = false;
    while (idx < stages.length && stageDone(stages[idx])) {
      idx += 1;
      advanced = true;
    }
    if (!advanced) return;
    if (idx >= stages.length) {
      entry.stage = idx;
      entry.rewarded = true;
      let gained = '';
      try { gained = q.reward() || ''; } catch (e) { gained = ''; }
      grantQuestRecipes(q.id);
      toast('支线完成 · ' + q.title + (gained ? ' · ' + gained : ''));
    } else {
      entry.stage = idx;
      toast('支线推进 · ' + q.title + ' · ' + stages[idx].text);
    }
    persist();
    updateHud();
  });
}

function sideQuestDoneCount() {
  if (!state || !state.quests.side) return 0;
  return Object.keys(state.quests.side).filter(function (id) {
    return state.quests.side[id] && state.quests.side[id].rewarded;
  }).length;
}

// ---------- 悬赏 ----------
function findBounty(id) {
  for (let i = 0; i < BOUNTIES.length; i += 1) if (BOUNTIES[i].id === id) return BOUNTIES[i];
  return null;
}

function bountyList() {
  return BOUNTIES.map(function (def) {
    const entry = state && state.quests.bounty ? state.quests.bounty[def.id] : null;
    return {
      id: def.id,
      title: def.title,
      desc: def.desc,
      type: def.type,
      target: def.target,
      count: def.count,
      reward: def.reward,
      active: !!(entry && entry.active),
      progress: entry ? (entry.progress || 0) : 0,
      ready: !!(entry && entry.ready),
      cooldown: entry ? (entry.cooldown || 0) : 0,
    };
  });
}

function acceptBounty(id) {
  if (!state) return false;
  const def = findBounty(id);
  if (!def) return false;
  const entry = state.quests.bounty[id];
  if (entry && entry.cooldown > 0) { toast('悬赏冷却 · 还要 ' + entry.cooldown + ' 场'); return false; }
  if (entry && entry.active) { toast('此悬赏已在行事'); return false; }
  state.quests.bounty[id] = { active: true, progress: 0, ready: false, cooldown: 0 };
  toast('接下悬赏 · ' + def.title);
  persist();
  updateHud();
  return true;
}

function bountyProgress(type, data) {
  if (!state) return;
  const d = data || {};
  BOUNTIES.forEach(function (def) {
    if (def.type !== type) return;
    const entry = state.quests.bounty[def.id];
    if (!entry || !entry.active || entry.ready) return;
    if (type === 'hunt' || type === 'patrol') {
      const rid = d.region || state.region;
      if (def.target !== rid) return;
      entry.progress += Math.max(1, Number(d.wins) || 1);
    } else if (type === 'gather') {
      if (def.target !== d.mat) return;
      entry.progress += Math.max(1, Number(d.count) || 1);
    }
    if (entry.progress >= def.count) {
      entry.progress = def.count;
      entry.ready = true;
      toast('悬赏可领取 · ' + def.title);
    }
  });
}

function claimBounty(id) {
  if (!state) return { ok: false, msg: '无存档' };
  const def = findBounty(id);
  if (!def) return { ok: false, msg: '悬赏不存在' };
  const entry = state.quests.bounty[id];
  if (!entry || !entry.ready) return { ok: false, msg: '尚未达成' };
  const parts = [];
  const reward = def.reward || {};
  if (reward.jade) { giveJade(reward.jade); parts.push('灵玉 +' + reward.jade); }
  (reward.items || []).forEach(function (it) {
    const n = it.count || 1;
    giveItem(it.id, n);
    parts.push((ITEMS[it.id] ? ITEMS[it.id].name : it.id) + ' +' + n);
  });
  (reward.mats || []).forEach(function (m) {
    const n = m.count || 1;
    giveMaterial(m.id, n);
    parts.push((MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' +' + n);
  });
  entry.active = false;
  entry.ready = false;
  entry.progress = 0;
  entry.cooldown = def.cooldown || 3;
  toast('悬赏已结 · ' + def.title + (parts.length ? ' · ' + parts.join(' · ') : ''));
  persist();
  updateHud();
  checkSideQuests();
  return { ok: true, msg: '悬赏已结' };
}

function bountyAdvanceBattle() {
  if (!state) return;
  Object.keys(state.quests.bounty).forEach(function (id) {
    const entry = state.quests.bounty[id];
    if (entry && entry.cooldown > 0) entry.cooldown -= 1;
  });
}
