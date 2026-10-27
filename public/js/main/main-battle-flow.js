// 灵兽录 · 主控层 · 战斗桥接与结局
// ---------- 战斗桥接 ----------
function pauseWorld() {
  if (window.World && typeof World.pause === 'function') World.pause();
}

function startWildBattle() {
  if (!state || battleActive()) return;
  const r = REGIONS[state.region];
  const pool = r ? r.pool : null;
  if (!pool || !pool.length) { toast('此处无灵迹可遇'); return; }
  if (typeof battleStartWild !== 'function') { toast('战斗尚未准备'); return; }
  closeModal();
  pauseWorld();
  battleStartWild(state.region);
}

function startBossBattle(bossId, opts) {
  if (!state || battleActive()) return;
  const id = bossId && typeof bossId === 'object' ? bossId.id : bossId;
  if (!id || !BOSSES[id]) return;
  if (typeof battleStartBoss !== 'function') { toast('战斗尚未准备'); return; }
  closeModal();
  pauseWorld();
  battleStartBoss(id, opts);
}

function startTrial(floor) {
  if (!state || battleActive()) return;
  const f = clampInt(Number(floor) || 1, 1, TRIALS.length);
  if (!flag('boss_wuxiang')) { toast('无相未败 · 试炼门未开'); return; }
  if (f > 1 && !trialCleared(f - 1)) { toast('先过第 ' + (f - 1) + ' 层试炼'); return; }
  if (typeof battleStartTrial !== 'function') { toast('试炼尚未准备'); return; }
  closeModal();
  pauseWorld();
  battleStartTrial(f);
}

async function returnToWorld(result) {
  if (!state) return;
  const r = result || {};
  if (typeof battle !== 'undefined' && battle) {
    battle.on = false;
    battle.autoPending = false;
  }
  const overlay = byId('battle-overlay');
  if (overlay) overlay.hidden = true;

  if (r.win) {
    state.stats.wins = (state.stats.wins || 0) + 1;
    if (r.jade) giveJade(r.jade);
    (r.drops || []).forEach(function (d) {
      const n = d.count || 1;
      if (d.kind === 'mat') giveMaterial(d.id, n); else giveItem(d.id, n);
    });
    if (r.foeSp) bestiaryMark(r.foeSp, 'defeated');
    if (r.caught) {
      state.stats.catches = (state.stats.catches || 0) + 1;
      if (r.foeSp) bestiaryMark(r.foeSp, 'caught');
      if (r.foeSp) giveMon(r.foeSp, r.foeLv || 1);
    }
    bountyProgress('hunt', { region: state.region, wins: 1 });
    bountyProgress('patrol', { region: state.region, wins: 1 });
  }

  if (r.bossId && !r.trialFloor) {
    const bid = r.bossId;
    const firstClear = !flag('boss_' + bid);
    flagSet('boss_' + bid, true);
    (BOSS_FLAGS[bid] || []).forEach(function (f) { flagSet(f, true); });
    if (firstClear && BOSSES[bid] && BOSSES[bid].gear) giveGear(BOSSES[bid].gear);
    if (BOSS_CHAPTER[bid]) setStory(BOSS_CHAPTER[bid]);
    if (bid === 'wuxiang') setTimeout(openEndingChoice, 1200);
    if (bid === 'tiangen') setTimeout(showFinalEnding, 1200);
  }

  if (r.trialFloor) {
    const floor = r.trialFloor;
    if (!state.trials) state.trials = {};
    state.trials[floor] = true;
    const t = TRIALS[floor - 1];
    if (t && t.reward) {
      if (t.reward.jade) giveJade(t.reward.jade);
      (t.reward.items || []).forEach(function (it) { giveItem(it.id, it.count || 1); });
      (t.reward.mats || []).forEach(function (m) { giveMaterial(m.id, m.count || 1); });
    }
    if (t) toast('试炼已过 · ' + t.name);
  }

  bountyAdvanceBattle();
  checkSideQuests();

  await fadeTo(function () {
    enterRegion(state.region, state.pos, { title: false });
  });
  if (r.message) toast(r.message);
  persist();
  updateHud();
  if (typeof processPendingCloudConflict === 'function') {
    setTimeout(processPendingCloudConflict, 700);
  }
}

function defeatRetreat() {
  if (!state) return;
  if (typeof battle !== 'undefined' && battle) battle.on = false;
  const overlay = byId('battle-overlay');
  if (overlay) overlay.hidden = true;
  state.team.forEach(function (m) {
    const st = statsOf(m.sp, m.lv, m);
    m.hp = Math.max(1, Math.round(st.hp / 2));
    m.guard = 0;
  });
  const r = REGIONS[state.region];
  const spawn = r ? r.spawn : state.pos;
  state.pos = { x: spawn.x, y: spawn.y };
  showView('view-world');
  enterRegion(state.region, spawn, { title: false });
  toast('退回入口 · 灵兽略作调息');
  persist();
}

function defeatReload() {
  const obj = loadLocal();
  if (!obj) { toast('没有可用的存档'); return; }
  state = obj;
  if (typeof battle !== 'undefined' && battle) battle.on = false;
  const overlay = byId('battle-overlay');
  if (overlay) overlay.hidden = true;
  showView('view-world');
  enterRegion(state.region, state.pos, { title: false });
  toast('已回溯至上一处落笔');
  updateHud();
}

// ---------- 结局 ----------
function openEndingChoice() {
  if (!state) return;
  closeModal();
  const sides = sideQuestDoneCount();
  const steles = stelesCount();
  const sVal = typeof stance === 'function' ? stance() : 0;
  const canNew = sides >= 8 && steles >= 6 && sVal >= 0;
  openModal('归墟已断 · 择契',
    '<p class="note">无相已散，归墟深处只余两条路：以旧灵笼为引，重立新契；或以锁灵器封死归墟，从此两不相欠。</p>' +
    '<p class="note">倾向：' + (typeof stanceSummary === 'function' ? stanceSummary() : '两难 0') + '</p>' +
    '<p class="note">新契之约：支线 ' + sides + ' / 8 · 碑文 ' + steles + ' / 6' +
    (canNew ? ' · 可立新契' : (sVal < 0 ? ' · 锁心太重，新契不认你' : ' · 尚不足以立新契')) + '</p>',
    '<button class="btn-sm plain" data-ending="cut">封归墟</button>' +
    '<button class="btn-sm solid" data-ending="new"' + (canNew ? '' : ' disabled title="锁心太重 · 新契不认你"') + '>立新契</button>');
  const foot = byId('modal-foot');
  if (!foot) return;
  Array.prototype.forEach.call(foot.querySelectorAll('[data-ending]'), function (btn) {
    btn.addEventListener('click', function () {
      const kind = btn.getAttribute('data-ending');
      if (kind === 'new' && !canNew) return;
      closeModal();
      showEnding(kind === 'new' ? 'new' : 'cut');
    });
  });
}

function showEnding(kind) {
  if (!state) return;
  const k = kind === 'new' ? 'new' : 'cut';
  state.ending = k;
  state.postgame = true;
  state.chapter = 8;
  flagSet('ending', true);
  flagSet('endingDone', true);
  pauseWorld();
  showView('view-end');

  const prog = bestiaryProgress();
  const eyebrow = byId('end-eyebrow');
  const title = byId('end-title');
  const text = byId('end-text');
  const stats = byId('end-stats');
  const extra = byId('end-extra');
  if (eyebrow) eyebrow.textContent = k === 'new' ? '新契' : '断契';
  if (title) title.textContent = k === 'new' ? '山门重开' : '归墟断链';
  if (text) {
    const base = k === 'new'
      ? '你把旧灵笼放在坛心，灵息自掌心流出——不锁，不抽，只问一句愿不愿意。九嶂的雾退了一层，山门重新亮起灯。此后契成于互选，一方欲去，契便自解。'
      : '你以锁灵器封死归墟。渊底的嗡鸣停了，灵脉归于沉寂。人与灵兽从此两不相欠，山门依旧开着，只是夜里少了许多声音。';
    const echoes = typeof endingEchoes === 'function' ? endingEchoes(k) : [];
    text.textContent = base + (echoes.length ? '\n\n' + echoes.join('\n') : '');
  }
  if (stats) {
    stats.innerHTML =
      '<li>收契<b>' + (state.stats.catches || 0) + '</b></li>' +
      '<li>图鉴<b>' + prog.seen + ' / ' + prog.total + '（' + prog.pct + '%）</b></li>' +
      '<li>支线<b>' + sideQuestDoneCount() + ' / ' + SIDE_QUESTS.length + '</b></li>' +
      '<li>战斗<b>' + (state.stats.battles || 0) + '</b></li>' +
      '<li>倾向<b>' + (typeof stanceSummary === 'function' ? stanceSummary() : '两难 0') + '</b></li>' +
      '<li>结局<b>' + (k === 'new' ? '新契' : '断契') + '</b></li>';
  }
  if (extra) extra.textContent = '存档已保留 · 可回山门继续支线、图鉴与山海试炼。';
  persist();
  updateHud();
}

function showFinalEnding() {
  if (!state) return;
  const k = state.ending === 'cut' ? 'cut' : 'new';
  state.chapter = 12;
  state.postgame = true;
  flagSet('ending2', true);
  flagSet('ending2Done', true);
  pauseWorld();
  showView('view-end');

  const prog = bestiaryProgress();
  const eyebrow = byId('end-eyebrow');
  const title = byId('end-title');
  const text = byId('end-text');
  const stats = byId('end-stats');
  const extra = byId('end-extra');
  if (eyebrow) eyebrow.textContent = '第二卷终 · 天根';
  if (title) title.textContent = k === 'new' ? '山海同流' : '万灵自去';
  if (text) {
    text.textContent = k === 'new'
      ? '天根兽伏在祭坛前，五色石一块块归位。你没有再问山愿不愿意——山先开了口，风从石林间穿过，像一声很长很长的应。云栈、玄炉、沉城、天根，四座遗门重新点灯。此后九嶂不只守着旧契，也守着新契：人呼其名，灵应其声；一方欲去，契便自解。'
      : '天根兽散作五色石屑，灵脉归于沉静。你带着断契的心走完九嶂，四座遗门没有点灯，只把门开着。人不欠灵，灵不欠人；山外还有山，但不再有人替它取名。';
  }
  if (stats) {
    stats.innerHTML =
      '<li>第二卷<b>四门皆过</b></li>' +
      '<li>图鉴<b>' + prog.seen + ' / ' + prog.total + '（' + prog.pct + '%）</b></li>' +
      '<li>支线<b>' + sideQuestDoneCount() + ' / ' + SIDE_QUESTS.length + '</b></li>' +
      '<li>碑文<b>' + stelesCount() + '</b></li>' +
      '<li>战斗<b>' + (state.stats.battles || 0) + '</b></li>' +
      '<li>终局<b>' + (k === 'new' ? '山海同流' : '万灵自去') + '</b></li>';
  }
  if (extra) extra.textContent = '天根已定 · 存档保留，可继续补完支线、图鉴与山海试炼。';
  persist();
  updateHud();
}

function postgameEnter() {
  if (!state) return;
  state.postgame = true;
  closeModal();
  if (state.chapter < 9) {
    state.chapter = 9;
    flagSet('volume2Open', true);
    persist();
    fadeTo(function () {
      enterRegion('shanmen', REGIONS.shanmen.spawn, { title: true });
      toast('山外有山 · 云栈遗门已现 · 山河图可前往');
    });
    return;
  }
  fadeTo(function () {
    enterRegion('shanmen', REGIONS.shanmen.spawn, { title: true });
    toast('山门重开 · 可往碑林、告示板与试炼');
  });
}
