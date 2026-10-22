// 灵兽录 · 战斗层 · 开战、场地与指令界面
function battleView(id) {
  if (window.LB && typeof LB.showView === 'function') { LB.showView(id); return; }
  if (typeof showView === 'function') { showView(id); return; }
  ['view-title', 'view-world', 'view-battle', 'view-end'].forEach((v) => {
    const el = $b(v);
    if (el) el.hidden = v !== id;
  });
}

function openBattle(cfg) {
  const s = saveGame();
  if (!s || !cfg || !SPECIES[cfg.sp]) return;
  const region = cfg.regionId && REGIONS[cfg.regionId] ? cfg.regionId : (s.region || 'qingxi');
  const boss = cfg.bossId ? BOSSES[cfg.bossId] : null;
  const trial = cfg.trialFloor ? TRIALS[cfg.trialFloor - 1] : null;
  const trialBoss = trial && trial.boss ? trial.boss : null;

  battle.on = true;
  battle.over = false;
  battle.busy = false;
  battle.forced = false;
  battle.lines = [];
  battle.bond = 0;
  battle.bondUsed = false;
  battle.bossId = cfg.bossId || null;
  battle.trialFloor = cfg.trialFloor || null;
  battle.regionId = region;
  battle.field = null;
  battle.phaseIndex = 0;

  const weather = s.weather && WEATHERS[s.weather] ? s.weather : ((REGIONS[region] && REGIONS[region].weather) || 'clear');
  const phase = s.time && TIME_PHASES[s.time.phase] ? s.time.phase : 'dawn';
  const merged = {};
  [WEATHERS[weather] || WEATHERS.clear, TIME_PHASES[phase] || TIME_PHASES.dawn].forEach((def) => {
    Object.keys(def.elMod || {}).forEach((el) => {
      merged[el] = (merged[el] || 1) * def.elMod[el];
    });
  });
  battle.elMod = merged;

  const d = SPECIES[cfg.sp];
  const lv = Math.max(1, Number(cfg.lv) || 1);
  const st = LB.statsOf(cfg.sp, lv);
  const hpMul = cfg.hpMul != null ? cfg.hpMul : (boss ? boss.hpMul : (trialBoss && trialBoss.hpMul != null ? trialBoss.hpMul : 1));
  const atkMul = cfg.atkMul != null ? cfg.atkMul : (boss ? boss.atkMul : (trialBoss && trialBoss.atkMul != null ? trialBoss.atkMul : 1));
  const maxHp = Math.max(1, Math.round(st.hp * hpMul));

  battle.foe = {
    sp: cfg.sp, lv: lv,
    name: cfg.displayName || (boss && boss.name) || d.name,
    el: boss && boss.el ? boss.el : d.el,
    maxHp: maxHp, hp: maxHp,
    atk: Math.round(st.atk * atkMul), def: st.def, spd: st.spd,
    isBoss: !!cfg.isBoss, cannotCatch: !!cfg.isBoss,
    ai: (boss && boss.ai) || 'aggressive',
    phases: boss && boss.phases ? boss.phases : [],
    guard: 0, statuses: {}, cd: {}, passive: null,
  };

  s.team.forEach((m) => {
    m.cd = {};
    m.guard = 0;
    m.statuses = {};
  });
  battle.idx = firstAlive();

  if (s.stats) s.stats.battles = (s.stats.battles || 0) + 1;
  if (typeof LB.bestiaryMark === 'function') LB.bestiaryMark(cfg.sp, 'seen');

  battleView('view-battle');
  const overlay = $b('battle-overlay');
  if (overlay) overlay.hidden = true;
  const banner = $b('boss-banner');
  if (banner) { banner.hidden = true; banner.classList.remove('show'); }
  const scene = $b('battle-scene');
  if (scene) scene.className = 'battle-scene bg-' + region;
  const bgNode = $b('battle-bg');
  if (bgNode) bgNode.innerHTML = battleBackdrop(region);

  if (cfg.isBoss && boss && boss.line) logAccent(boss.line);
  else logLine('草丛一动，有灵息逼近。');

  const envParts = [];
  Object.keys(merged).forEach((el) => {
    if (Math.abs(merged[el] - 1) < 0.001 || !ELEMENTS[el]) return;
    envParts.push(ELEMENTS[el].ch + '行' + (merged[el] > 1 ? '得援' : '受抑'));
  });
  if (envParts.length) {
    const wch = (WEATHERS[weather] || WEATHERS.clear).ch;
    logLine(wch + '势 · ' + envParts.join('，') + '。', 'accent');
  }
  if (trial) logLine('试炼第 ' + trial.floor + ' 层 · ' + trial.rule, 'accent');

  const mon = currentMon();
  const pe = mon ? passiveEffect(mon) : null;
  if (pe) logLine('灵诀「' + PASSIVES[mon.passive].name + '」· ' + PASSIVES[mon.passive].desc, 'accent');

  renderBattleUI();
  renderCommands();
  if (window.LB && typeof LB.pauseWorld === 'function') LB.pauseWorld();
}

function battleBackdrop(regionId) {
  const P = BACKDROPS[regionId] || BACKDROPS.qingxi;
  const bands = P.sky.map((c, i) => '<rect x="0" y="' + Math.round(i * 100) + '" width="1200" height="100" fill="' + c + '"/>').join('');
  let clouds = '';
  [[120, 92, 1], [520, 70, 0.8], [850, 112, 0.6], [1010, 56, 0.9]].forEach(function (c, i) {
    const x = c[0], y = c[1], s = c[2];
    clouds += '<g fill="' + P.cloud + '" opacity="' + (0.55 + i * 0.08) + '">' +
      '<rect x="' + x + '" y="' + y + '" width="' + (84 * s) + '" height="' + (12 * s) + '"/>' +
      '<rect x="' + (x + 14 * s) + '" y="' + (y - 12 * s) + '" width="' + (46 * s) + '" height="' + (12 * s) + '"/>' +
      '<rect x="' + (x + 8 * s) + '" y="' + (y - 22 * s) + '" width="' + (24 * s) + '" height="' + (12 * s) + '"/>' +
      '</g>';
  });
  let stars = '';
  if (P.stars) {
    [[180, 56], [268, 36], [352, 88], [720, 42], [1042, 64], [612, 96]].forEach(function (s) {
      stars += '<rect x="' + s[0] + '" y="' + s[1] + '" width="4" height="4" fill="' + P.accent + '"/>';
    });
  }
  const far = '<path d="M0 330 L80 330 L80 310 L160 310 L160 290 L240 290 L240 310 L320 310 L320 330 L400 330 L400 300 L480 300 L480 280 L560 280 L560 300 L640 300 L640 320 L720 320 L720 290 L800 290 L800 270 L880 270 L880 290 L960 290 L960 310 L1040 310 L1040 290 L1120 290 L1120 310 L1200 310 L1200 600 L0 600 Z" fill="' + P.far + '"/>';
  const mid = '<path d="M0 410 L100 410 L100 380 L200 380 L200 360 L300 360 L300 390 L400 390 L400 370 L500 370 L500 400 L600 400 L600 380 L700 380 L700 360 L800 360 L800 390 L900 390 L900 370 L1000 370 L1000 400 L1100 400 L1100 380 L1200 380 L1200 600 L0 600 Z" fill="' + P.mid + '"/>';
  const ground = '<path d="M0 480 L120 480 L120 464 L240 464 L240 480 L360 480 L360 470 L480 470 L480 486 L600 486 L600 470 L720 470 L720 486 L840 486 L840 476 L960 476 L960 490 L1080 490 L1080 478 L1200 478 L1200 600 L0 600 Z" fill="' + P.near + '"/>';
  const mist = P.mist
    ? '<g fill="' + P.cloud + '" opacity=".22"><rect x="0" y="286" width="620" height="16"/><rect x="430" y="330" width="770" height="12"/><rect x="0" y="372" width="520" height="10"/></g>'
    : '';
  const water = P.water
    ? '<g fill="' + P.waterCol + '" opacity=".5"><rect x="0" y="524" width="1200" height="6"/><rect x="60" y="540" width="420" height="4"/><rect x="560" y="556" width="560" height="5"/><rect x="220" y="574" width="300" height="4"/></g>'
    : '';
  return '<svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" aria-hidden="true">' +
    bands + stars + clouds +
    '<rect x="120" y="64" width="64" height="64" fill="' + P.sun + '" opacity=".8"/>' +
    '<rect x="112" y="72" width="80" height="48" fill="' + P.sun + '" opacity=".2"/>' +
    '<rect x="136" y="56" width="32" height="8" fill="' + P.sun + '" opacity=".35"/>' +
    far + mist + mid + ground + water +
    '<rect x="0" y="592" width="1200" height="8" fill="' + P.ink + '" opacity=".8"/>' +
    '</svg>';
}

const BACKDROPS = {
  shanmen: { sky: ['#24315a', '#31416c', '#4a5b89', '#7a7198', '#c08a70', '#e7b36c'], cloud: '#d9e2f5', far: '#3f4f7c', mid: '#2c3a5e', near: '#1a2340', sun: '#ffe6a0', accent: '#ffe08a', ink: '#0b1020', waterCol: '#5cc8e6' },
  qingxi: { sky: ['#1b3550', '#234763', '#2f6473', '#4b8a7e', '#8fbd8a', '#cfe0a2'], cloud: '#d7f0e8', far: '#376c68', mid: '#285550', near: '#183a38', sun: '#f6f0b8', accent: '#cdffb0', ink: '#071a18', waterCol: '#5cc8e6', mist: true },
  wuyin: { sky: ['#252f46', '#303c55', '#445267', '#6c7486', '#9aa0ab', '#c3c7c9'], cloud: '#e2e6e8', far: '#4e596b', mid: '#3a4557', near: '#252e40', sun: '#e6e8dd', accent: '#c9f2ff', ink: '#101722', waterCol: '#78a8b8', mist: true },
  luoxing: { sky: ['#1b2340', '#2c3158', '#4b3f6d', '#7c5273', '#bd6f68', '#e8a361'], cloud: '#f0cfa8', far: '#5a4266', mid: '#42304e', near: '#281c36', sun: '#ffe08a', accent: '#fff3b8', ink: '#0d0a18', stars: true, waterCol: '#5cc8e6' },
  guixu: { sky: ['#102b40', '#164158', '#216078', '#3d8ba0', '#8dc9cf', '#d8f2ee'], cloud: '#e2fbf7', far: '#2c6d78', mid: '#215460', near: '#123440', sun: '#fff6c8', accent: '#c9f2ff', ink: '#06161c', waterCol: '#63d6e8', water: true },
  yunmeng: { sky: ['#20263f', '#2d3653', '#4b4e6f', '#7a6f8f', '#b39bb0', '#e0cbbd'], cloud: '#f4e8e2', far: '#5c5874', mid: '#443f58', near: '#2a273c', sun: '#ffe6d0', accent: '#ffd8ef', ink: '#100d18', waterCol: '#79c8d8', water: true, mist: true },
  gutan: { sky: ['#2b1320', '#471b24', '#76282a', '#b3442e', '#e07a3c', '#f6be64'], cloud: '#f0b088', far: '#6c2c2e', mid: '#4e1f26', near: '#2c121a', sun: '#ffcf6a', accent: '#ff9c4a', ink: '#140609', waterCol: '#ff7a3c' },
  shenyuan: { sky: ['#10131f', '#181e30', '#242c45', '#39435f', '#5a6680', '#8b96a8'], cloud: '#b8c2cf', far: '#333c54', mid: '#262e42', near: '#151b2a', sun: '#dfe8f0', accent: '#b9e6ff', ink: '#05070d', waterCol: '#4fa8c8', water: true },
};

// ---------- 属性与伤害 ----------
function effStats(c, isFoe) {
  if (!c) return { atk: 1, def: 0, spd: 1 };
  let atk;
  let def;
  let spd;
  if (isFoe) {
    atk = c.atk || 1;
    def = c.def || 0;
    spd = c.spd || 1;
  } else {
    const st = monStats(c);
    atk = st.atk;
    def = st.def;
    spd = st.spd;
  }
  let atkPct = 0;
  let defPct = 0;
  let spdPct = 0;
  if (!isFoe) {
    const pe = passiveEffect(c);
    if (pe) {
      spdPct += pe.spdPct || 0;
      defPct += pe.defPct || 0;
    }
  }
  const sts = c.statuses || {};
  Object.keys(sts).forEach((k) => {
    const mod = STATUSES[k] && STATUSES[k].mod;
    if (!mod) return;
    atkPct += mod.atkPct || 0;
    defPct += mod.defPct || 0;
    spdPct += mod.spdPct || 0;
  });
  return {
    atk: Math.max(1, Math.round(atk * (1 + atkPct))),
    def: Math.max(0, Math.round(def * (1 + defPct))),
    spd: Math.max(1, Math.round(spd * (1 + spdPct))),
  };
}

function calcDamage(attacker, defender, skill, opts) {
  const o = opts || {};
  const aIsFoe = !!o.aIsFoe;
  const dIsFoe = !!o.dIsFoe;
  const atkStats = effStats(attacker, aIsFoe);
  const defStats = effStats(defender, dIsFoe);
  const pe = aIsFoe ? null : passiveEffect(attacker);

  let def = defStats.def;
  if (pe && pe.defPierce) def = def * (1 - pe.defPierce);

  let mult = 1;
  const defEl = elOf(defender, dIsFoe);
  if (BEATS[skill.el] === defEl) mult = 1.6;
  else if (BEATS[defEl] === skill.el) mult = 0.65;

  const critChance = 0.12 + (pe && pe.critPct ? pe.critPct : 0);
  const crit = Math.random() < critChance;

  let total = atkStats.atk * (skill.power / 10) * (1 - def / (def + 34));
  total *= mult;
  total *= battle.elMod[skill.el] || 1;
  if (crit) total *= 1.5;
  if (pe && skill.el === 'fire') total *= 1 + (pe.firePct || 0);
  if (pe && skill.el === 'water') total *= 1 + (pe.waterPct || 0);
  if ((defender.guard || 0) > 0) total *= 0.6;
  if (defender.statuses && defender.statuses.shield) total *= 0.65;
  total *= rand(0.92, 1.08);

  return { value: Math.max(1, Math.round(total)), mult: mult, crit: crit, el: skill.el };
}

function applyStatus(target, id, turns) {
  const def = STATUSES[id];
  if (!target || !def) return;
  if (!target.statuses) target.statuses = {};
  const t = Math.max(1, Math.round(turns || def.duration || 1));
  const old = target.statuses[id];
  target.statuses[id] = {
    turns: old ? Math.max(old.turns, t) : t,
    value: 0,
    absorb: (def.mod && def.mod.absorbPct) || 0,
    fresh: true,
  };
}

function gainBond(n) {
  if (battle.bondUsed) return;
  battle.bond = clamp(battle.bond + n, 0, 100);
  updateBondUI();
}

function tickStatuses(combatant, isFoe) {
  if (!combatant || !combatant.statuses) return false;
  const sts = combatant.statuses;
  const max = maxHpOf(combatant, isFoe);
  const nm = nameOf(combatant, isFoe);
  const art = isFoe ? $b('foe-art') : $b('self-art');
  let died = false;

  Object.keys(sts).slice().forEach((k) => {
    const def = STATUSES[k];
    const entry = sts[k];
    if (!def || !entry) { delete sts[k]; return; }
    if (k === 'burn' || k === 'corrode') {
      const dmg = Math.max(1, Math.round(max * 0.06));
      combatant.hp = Math.max(0, combatant.hp - dmg);
      logLine(nm + ' ' + def.name + ' · 损失 ' + dmg, 'warn');
      floatOver(art, '-' + dmg, 'dot');
      if (combatant.hp <= 0) died = true;
    }
    if (entry.fresh) entry.fresh = false;
    else entry.turns -= 1;
    if (entry.turns <= 0) {
      delete sts[k];
      logLine(nm + ' 的「' + def.name + '」已散。');
    }
  });

  if (!isFoe && combatant.hp > 0) {
    const pe = passiveEffect(combatant);
    if (pe && pe.regenPct) {
      const heal = Math.max(1, Math.round(max * pe.regenPct));
      const before = combatant.hp;
      combatant.hp = Math.min(max, combatant.hp + heal);
      const real = combatant.hp - before;
      if (real > 0) {
        logLine(nm + ' 回灵 · 气血 +' + real, 'accent');
        floatOver(art, '+' + real, 'heal');
      }
    }
  }
  return died;
}

function hasNegative(mon) {
  if (!mon || !mon.statuses) return false;
  return ['burn', 'corrode', 'slow', 'break'].some((k) => !!mon.statuses[k]);
}

// ---------- 渲染 ----------
function setArt(slot, sp, el, combatant) {
  if (!slot) return;
  const d = SPECIES[sp];
  const art = d ? d.art : 'spirit';
  const evolved = !!(d && d.evolved);
  slot.innerHTML = beastSvg(art, el, true, evolved);
  ['wood', 'fire', 'earth', 'metal', 'water'].forEach((k) => slot.classList.remove('el-' + k));
  slot.classList.add('el-' + el);
  if (combatant) slot.classList.toggle('fainted', combatant.hp <= 0);
}

function renderStatusChips(box, statuses) {
  if (!box) return;
  const keys = Object.keys(statuses || {}).filter((k) => STATUSES[k]);
  if (!keys.length) { box.innerHTML = ''; return; }
  box.innerHTML = keys.map((k) =>
    '<span class="status-chip" style="--st:' + STATUSES[k].color + '" title="' + STATUSES[k].desc + '">' +
    STATUSES[k].ch + ' ' + statuses[k].turns + '</span>'
  ).join('');
}

function updateBondUI() {
  const fill = $b('bond-fill');
  if (fill) fill.style.transform = 'scaleX(' + clamp(battle.bond / 100, 0, 1) + ')';
  const label = $b('bond-label');
  if (label) {
    if (battle.bondUsed) label.textContent = '合契已用';
    else label.textContent = battle.bond >= 100 ? '可合契' : '契势 ' + Math.round(battle.bond);
  }
  const bond = $b('bond');
  if (bond) bond.classList.toggle('ready', battle.bond >= 100 && !battle.bondUsed);
}

function renderBattleUI() {
  const s = saveGame();
  const foe = battle.foe;
  const mon = currentMon();
  if (!s || !foe || !mon) return;

  setText('foe-name', foe.name);
  setText('foe-meta', 'Lv.' + foe.lv + ' · ' + (ELEMENTS[foe.el] ? ELEMENTS[foe.el].ch : '?') +
    (foe.isBoss ? ' · 妖' : '') + (battle.trialFloor ? ' · 试炼' : ''));
  setText('foe-hpnum', foe.hp + ' / ' + foe.maxHp);
  setBar($b('foe-hp'), foe.hp / foe.maxHp);

  const mv = monView(mon);
  setText('self-name', mv.name);
  setText('self-meta', 'Lv.' + mv.lv + ' · ' + ELEMENTS[mv.el].ch + ' · ' + mv.hp + '/' + mv.maxHp);
  setBar($b('self-hp'), mv.hp / mv.maxHp);
  setBar($b('self-exp'), (mon.exp || 0) / needExp(mon.lv));

  setArt($b('foe-art'), foe.sp, foe.el, foe);
  setArt($b('self-art'), mon.sp, mv.el, mon);

  renderStatusChips($b('foe-status'), foe.statuses);
  renderStatusChips($b('self-status'), mon.statuses);
  updateBondUI();

  renderPartyStrip();
  renderTurnOrder();
}

function renderTurnOrder() {
  const box = $b('turn-order');
  if (!box || !battle.foe) return;
  const mon = currentMon();
  if (!mon) return;
  const meSpd = effStats(mon, false).spd;
  const foeSpd = effStats(battle.foe, true).spd;
  const order = meSpd >= foeSpd ? [monName(mon), battle.foe.name] : [battle.foe.name, monName(mon)];
  box.innerHTML = order.map((n, i) =>
    '<span class="turn-token' + (i === 0 ? ' first' : '') + '">' + n + '</span>'
  ).join('<span class="turn-sep">→</span>');
}

function renderPartyStrip() {
  const box = $b('party-strip');
  const s = saveGame();
  if (!box || !s) return;
  box.innerHTML = s.team.map((m, i) => {
    const st = monStats(m);
    const pct = Math.round(clamp(m.hp / st.hp, 0, 1) * 100);
    const chips = Object.keys(m.statuses || {}).filter((k) => STATUSES[k]).map((k) =>
      '<span class="pc-st" title="' + STATUSES[k].name + '">' + STATUSES[k].ch + '</span>'
    ).join('');
    return '<button class="party-chip' + (i === battle.idx ? ' active' : '') + (m.hp <= 0 ? ' down' : '') + '" data-switch="' + i + '">' +
      '<span class="pc-name">' + st.name + '</span>' +
      '<span class="pc-lv">Lv.' + m.lv + '</span>' +
      (chips ? '<span class="pc-states">' + chips + '</span>' : '') +
      '<span class="pc-bar"><i style="width:' + pct + '%"></i></span>' +
      '</button>';
  }).join('');
  Array.prototype.forEach.call(box.querySelectorAll('[data-switch]'), (b) => {
    b.addEventListener('click', () => {
      const i = Number(b.getAttribute('data-switch'));
      if (battle.busy || battle.over) return;
      if (i === battle.idx) return;
      const s2 = saveGame();
      if (!s2 || !s2.team[i]) return;
      if (s2.team[i].hp <= 0) { logWarn(monName(s2.team[i]) + ' 已力竭'); return; }
      playerSwitch(i);
    });
  });
}

// ---------- 指令 ----------
function addCmd(label, sub, handler, disabled, cls) {
  const b = document.createElement('button');
  b.className = 'cmd ' + (cls || '');
  b.innerHTML = '<span class="cmd-label">' + label + '</span>' + (sub ? '<span class="cmd-sub">' + sub + '</span>' : '');
  b.disabled = !!disabled;
  if (!disabled && handler) b.addEventListener('click', handler);
  const box = $b('commands');
  if (box) box.appendChild(b);
  return b;
}

function battleItemIds() {
  const s = saveGame();
  if (!s) return [];
  return ['pill', 'great_pill', 'cleanse', 'revive', 'escape'].filter((id) => ITEMS[id] && (s.items[id] || 0) > 0);
}

function renderCommands() {
  const box = $b('commands');
  if (!box) return;
  box.innerHTML = '';
  box.className = 'commands command-grid';
  if (!battle.on || battle.busy || battle.over || !battle.foe) return;
  const s = saveGame();
  const mon = currentMon();
  if (!s || !mon) return;

  const skills = LB.skillsOf(mon);
  const items = battleItemIds().filter((id) => !itemBlockReason(id, mon)).length;
  const benchAlive = s.team.filter((m, i) => i !== battle.idx && m.hp > 0).length;

  addCmd('术法', skills.length + ' 式', showSkills, skills.length === 0);
  addCmd('结契', battle.foe.cannotCatch ? '不可结契' : ((s.items.charm || 0) > 0 ? '灵符 ' + s.items.charm : '徒手'),
    attemptCatch, battle.foe.cannotCatch);
  addCmd('换灵', aliveCount() > 1 ? '可战 ' + aliveCount() : '仅一', showSwitch, aliveCount() <= 1);
  addCmd('丹药', items > 0 ? '道具 ' + items : '无可用', showBattleItems, items <= 0);

  let bondSub = '契势 ' + Math.round(battle.bond) + '/100';
  let bondOff = battle.bond < 100;
  if (battle.bondUsed) { bondSub = '本战已用'; bondOff = true; }
  else if (battle.bond >= 100 && benchAlive === 0) { bondSub = '无后备'; bondOff = true; }
  else if (battle.bond >= 100) bondSub = '契势 100 · 可合';
  addCmd('合契', bondSub, showBondTargets, bondOff);

  addCmd('遁走', battle.foe.isBoss ? 'Boss 不可' : '六成', flee, battle.foe.isBoss, 'danger');
}

function showSkills() {
  const box = $b('commands');
  const mon = currentMon();
  if (!box || !mon) return;
  box.innerHTML = '';
  box.className = 'commands command-grid skills';
  const cd = mon.cd || (mon.cd = {});
  LB.skillsOf(mon).forEach((id) => {
    const s = SKILLS[id];
    if (!s) return;
    const left = cd[id] || 0;
    const el = ELEMENTS[s.el];
    const sub = left > 0 ? '冷却 ' + left : el.ch + (s.power ? ' · 威力 ' + s.power : ' · 辅助');
    addCmd(s.name, sub, () => playerSkill(id), left > 0, 'skill el-' + s.el);
  });
  addCmd('返回', '收起', renderCommands, false, 'ghost');
}

function showSwitch() {
  const box = $b('commands');
  const s = saveGame();
  if (!box || !s) return;
  box.innerHTML = '';
  box.className = 'commands command-grid';
  s.team.forEach((m, i) => {
    if (i === battle.idx) return;
    const st = monView(m);
    addCmd(st.name, m.hp <= 0 ? '已力竭' : 'Lv.' + m.lv + ' · ' + m.hp + '/' + st.maxHp,
      () => playerSwitch(i), m.hp <= 0, 'skill el-' + st.el);
  });
  addCmd('返回', '收起', renderCommands, false, 'ghost');
}

function itemBlockReason(id, mon) {
  if (id === 'pill' || id === 'great_pill') return mon.hp >= monMax(mon) ? '气血已满' : '';
  if (id === 'cleanse') return hasNegative(mon) ? '' : '无负面状态';
  if (id === 'revive') return faintCount() > 0 ? '' : '无力竭后备';
  if (id === 'escape') return battle.foe && battle.foe.isBoss ? 'Boss 不可遁' : '';
  return '';
}

function itemEffect(id) {
  if (id === 'pill' || id === 'great_pill') return '回气 ' + ITEMS[id].value;
  if (id === 'cleanse') return '解灼蚀滞破';
  if (id === 'revive') return '救力竭';
  if (id === 'escape') return '脱身';
  return '引契';
}

function showBattleItems() {
  const box = $b('commands');
  const s = saveGame();
  const mon = currentMon();
  if (!box || !s || !mon) return;
  box.innerHTML = '';
  box.className = 'commands command-grid';
  const ids = battleItemIds();
  if (!ids.length) addCmd('无可用道具', '行囊空空', null, true);
  ids.forEach((id) => {
    const item = ITEMS[id];
    const n = s.items[id] || 0;
    const reason = itemBlockReason(id, mon);
    addCmd(item.name, reason || ('x' + n + ' · ' + itemEffect(id)), () => useBattleItem(id), !!reason, 'item');
  });
  addCmd('返回', '收起', renderCommands, false, 'ghost');
}

function showBondTargets() {
  const box = $b('commands');
  const s = saveGame();
  if (!box || !s) return;
  box.innerHTML = '';
  box.className = 'commands command-grid';
  let n = 0;
  s.team.forEach((m, i) => {
    if (i === battle.idx || m.hp <= 0) return;
    n += 1;
    addCmd(monName(m), 'Lv.' + m.lv + ' · ' + m.hp + '/' + monMax(m),
      () => playerBond(i), false, 'skill el-' + monEl(m));
  });
  if (!n) addCmd('合契', '无后备灵兽', null, true);
  addCmd('返回', '收起', renderCommands, false, 'ghost');
}
