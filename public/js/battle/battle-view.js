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
  battle.combo = { el: null, n: 0 };
  battle.autoPending = false;

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
    name: cfg.displayName || (boss && boss.name) || (cfg.isBoss || cfg.trialFloor ? d.name : '野生 · ' + d.name),
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
  applyBattleSpeedClass();
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
  if (cfg.incense) logLine('引灵香余烟未散，灵息里裹着一缕异香。', 'accent');
  // 首次野外遭遇：一句话教会削弱 + 结契
  if (!cfg.isBoss && !cfg.trialFloor && typeof LB.saveState === 'function') {
    const tut = LB.saveState();
    if (tut && tut.flags && !tut.flags.wildTut) {
      tut.flags.wildTut = true;
      logLine('（野外灵兽可先削弱，再以「结契」收服；灵符可再提一成八成功率。）', 'accent');
      if (typeof LB.persist === 'function') LB.persist();
    }
    if (typeof tutorialEvent === 'function') tutorialEvent('battle:start');
  }

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
  bindBattleTools();
  renderBattleTools();
  if (typeof autoBattleOn === 'function' && autoBattleOn()) scheduleAutoTurn(760);
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
  // 地面压暗：把立绘脚下压进阴影里，拉开前中后景
  let floor = '';
  for (let i = 0; i < 5; i += 1) {
    floor += '<rect x="0" y="' + (472 + i * 26) + '" width="1200" height="26" fill="' + P.ink + '" opacity="' + (0.05 + i * 0.04).toFixed(2) + '"/>';
  }
  return '<svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" aria-hidden="true">' +
    bands + stars + clouds +
    '<rect x="120" y="64" width="64" height="64" fill="' + P.sun + '" opacity=".8"/>' +
    '<rect x="112" y="72" width="80" height="48" fill="' + P.sun + '" opacity=".2"/>' +
    '<rect x="136" y="56" width="32" height="8" fill="' + P.sun + '" opacity=".35"/>' +
    far + mist + mid + ground + water + floor +
    '<rect x="0" y="592" width="1200" height="8" fill="' + P.ink + '" opacity=".8"/>' +
    '</svg>';
}

const BACKDROPS = {
  // 八境战斗天幕统一为明亮日间，只保留地貌色相差异
  shanmen: { sky: ['#a8c9dd', '#bcd6e3', '#d6e2df', '#ecdcc0', '#f2d49a', '#f7e0ae'], cloud: '#fbf7ec', far: '#a3b4c4', mid: '#93a7b8', near: '#7c9284', sun: '#fff2c0', accent: '#ffe08a', ink: '#3a3226', waterCol: '#5cc8e6' },
  qingxi: { sky: ['#8fc0d6', '#a3cbdb', '#c0d9d6', '#e5dfc0', '#f0cf9c', '#f6e2b8'], cloud: '#fbf7ec', far: '#7fa294', mid: '#527f6a', near: '#3a624e', sun: '#fff0c0', accent: '#ffe08a', ink: '#243a2c', waterCol: '#5cc8e6', mist: true },
  wuyin: { sky: ['#b6c6cc', '#c2d0d2', '#d2dcd8', '#e2e6dd', '#eef0e6', '#f6f7f0'], cloud: '#ffffff', far: '#a7b5b2', mid: '#95a5a2', near: '#7d9089', sun: '#f4f6e8', accent: '#c9f2ff', ink: '#35443f', waterCol: '#78a8b8', mist: true },
  luoxing: { sky: ['#b9c1d8', '#cbc9dd', '#e2ccd0', '#f0d0a8', '#f5c07c', '#f8d79a'], cloud: '#fbf1dc', far: '#b99fb0', mid: '#a88f9c', near: '#8c7466', sun: '#ffe6a0', accent: '#fff3b8', ink: '#3f3428', waterCol: '#5cc8e6' },
  guixu: { sky: ['#9fd4e4', '#b3deea', '#cbe9ee', '#dff2ef', '#e9f6ee', '#f5fbf4'], cloud: '#ffffff', far: '#8dbcc4', mid: '#7cabb4', near: '#5f8f96', sun: '#fffbe0', accent: '#c9f2ff', ink: '#284850', waterCol: '#63d6e8', water: true },
  yunmeng: { sky: ['#bcc7e0', '#cbd2e6', '#ddd9e6', '#efe0dc', '#f5e2cc', '#f9ecd6'], cloud: '#fdf6f0', far: '#b0a8bc', mid: '#9f94a8', near: '#877c8c', sun: '#ffe6d0', accent: '#ffd8ef', ink: '#3c3242', waterCol: '#79c8d8', water: true, mist: true },
  gutan: { sky: ['#d3b7a2', '#dcb69c', '#e5b28e', '#efb07d', '#f2b06a', '#f8cd8e'], cloud: '#f7dcc4', far: '#c98e78', mid: '#b87b66', near: '#96604c', sun: '#ffd98c', accent: '#ff9c4a', ink: '#4c2c20', waterCol: '#ff7a3c' },
  shenyuan: { sky: ['#b9c7d6', '#c3cfdc', '#d2dbe4', '#e0e6ec', '#eceff3', '#f6f7f8'], cloud: '#ffffff', far: '#aab6c2', mid: '#9aa8b6', near: '#8392a2', sun: '#fdfbe8', accent: '#b9e6ff', ink: '#39424e', waterCol: '#4fa8c8', water: true },
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
  const ge = aIsFoe || typeof gearEffect !== 'function' ? {} : gearEffect(attacker);

  let def = defStats.def;
  const pierce = (pe && pe.defPierce ? pe.defPierce : 0) + (ge.defPierce || 0);
  if (pierce) def = def * (1 - pierce);

  let mult = 1;
  const defEl = elOf(defender, dIsFoe);
  if (BEATS[skill.el] === defEl) mult = 1.6;
  else if (BEATS[defEl] === skill.el) mult = 0.65;

  const critChance = 0.12 + (pe && pe.critPct ? pe.critPct : 0) + (ge.critPct || 0);
  const crit = Math.random() < critChance;

  let total = atkStats.atk * (skillPowerAt(skill, attacker.lv || 1) / 10) * (1 - def / (def + 34));
  total *= mult;
  total *= battle.elMod[skill.el] || 1;
  if (!aIsFoe && battle.combo && battle.combo.n > 0) total *= 1 + 0.08 * battle.combo.n;
  if (crit) total *= 1.5;
  const elKey = skill.el + 'Pct';
  const elBoost = (pe && pe[elKey] ? pe[elKey] : 0) + (ge[elKey] || 0);
  if (elBoost) total *= 1 + elBoost;
  if ((defender.guard || 0) > 0) total *= 0.6;
  if (defender.statuses && defender.statuses.shield) total *= 0.65;
  total *= rand(0.92, 1.08);

  return { value: Math.max(1, Math.round(total)), mult: mult, crit: crit, el: skill.el };
}

function applyStatus(target, id, turns) {
  const def = STATUSES[id];
  if (!target || !def) return;
  if (def.kind !== 'buff' && typeof gearEffect === 'function') {
    const ge = gearEffect(target);
    if (ge.statusResistPct && Math.random() < ge.statusResistPct) {
      logLine('灵器一挡，灵息未侵。', 'accent');
      return;
    }
  }
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
  let add = n;
  const mon = currentMon();
  if (mon && typeof gearEffect === 'function') {
    const ge = gearEffect(mon);
    if (ge.bondGainPct) add = n * (1 + ge.bondGainPct);
  }
  battle.bond = clamp(battle.bond + add, 0, 100);
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
    const ge = typeof gearEffect === 'function' ? gearEffect(combatant) : {};
    const regen = (pe && pe.regenPct ? pe.regenPct : 0) + (ge.regenPct || 0);
    if (regen > 0) {
      const heal = Math.max(1, Math.round(max * regen));
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
  slot.innerHTML = beastSvg(sp, true);
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

function renderComboMeter() {
  const box = $b('combo-meter');
  if (!box) return;
  const c = battle.combo || { el: null, n: 0 };
  if (!battle.on || !c.n) { box.hidden = true; return; }
  box.hidden = false;
  const chain = $b('combo-chain');
  if (chain) chain.textContent = '灵连 ×' + c.n + (c.el && ELEMENTS[c.el] ? ' · ' + ELEMENTS[c.el].ch : '');
  const pips = $b('combo-pips');
  if (pips) {
    Array.prototype.forEach.call(pips.children, function (pip, i) {
      pip.className = i < c.n ? 'on' : '';
    });
  }
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
  renderComboMeter();

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
  // 只有一只灵兽时，上方契位条与下方状态条信息重复，直接隐藏
  box.className = 'party-strip' + (s.team.length > 1 ? '' : ' solo');
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
  return Object.keys(ITEMS).filter((id) => ITEMS[id].battle && (s.items[id] || 0) > 0);
}

// ---------- 战斗工具条：自动 / 速度 ----------
let battleToolsBound = false;

function currentBattleSpeed() {
  const s = saveGame();
  return (s && s.settings && s.settings.battleSpeed) || '1';
}

function applyBattleSpeedClass() {
  const scene = $b('battle-scene');
  if (!scene) return;
  const speed = currentBattleSpeed();
  scene.classList.toggle('speed-2', speed === '2');
  scene.classList.toggle('speed-skip', speed === 'skip');
}

function bindBattleTools() {
  if (battleToolsBound) return;
  battleToolsBound = true;
  const auto = $b('bt-auto');
  if (auto) auto.addEventListener('click', function () { toggleAutoBattle(); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-battle-speed]'), function (b) {
    b.addEventListener('click', function () { setBattleSpeed(b.getAttribute('data-battle-speed')); });
  });
}

function renderBattleTools() {
  const s = saveGame();
  const auto = $b('bt-auto');
  const on = !!(s && s.settings && s.settings.autoBattle);
  if (auto) {
    auto.textContent = '自动 · ' + (on ? '开' : '关');
    auto.classList.toggle('on', on);
    auto.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  const speed = currentBattleSpeed();
  Array.prototype.forEach.call(document.querySelectorAll('[data-battle-speed]'), function (b) {
    b.classList.toggle('active', b.getAttribute('data-battle-speed') === speed);
  });
}

function setBattleSpeed(value) {
  const s = saveGame();
  if (!s || ['1', '2', 'skip'].indexOf(value) < 0) return;
  s.settings.battleSpeed = value;
  if (window.LB && typeof LB.persist === 'function') LB.persist();
  applyBattleSpeedClass();
  renderBattleTools();
  if (typeof autoBattleOn === 'function' && autoBattleOn() && !battle.busy) scheduleAutoTurn(140);
}

function toggleAutoBattle(force) {
  const s = saveGame();
  if (!s) return;
  const on = typeof force === 'boolean' ? force : !s.settings.autoBattle;
  s.settings.autoBattle = on;
  if (window.LB && typeof LB.persist === 'function') LB.persist();
  renderBattleTools();
  if (on) {
    logAccent('自动战斗已开。');
    if (battle.forced) {
      const next = pickAutoSwitch();
      if (next >= 0) { forceSwitch(next); return; }
    }
    scheduleAutoTurn(260);
  } else {
    logLine('自动战斗已关。');
    if (!battle.busy && !battle.over && !battle.forced) renderCommands();
  }
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

  if (typeof autoBattleOn === 'function' && autoBattleOn()) {
    const cfg = autoSettings();
    box.className = 'commands auto-panel';
    box.innerHTML = '<div class="auto-card">' +
      '<p class="auto-title">自动战斗中</p>' +
      '<p class="auto-note">气血 ≤ ' + cfg.potionPct + '% 服丹 · ' +
      (cfg.catchOn ? '灵兽 ≤ ' + cfg.catchPct + '% 结契' : '不自动结契') + '</p>' +
      '<button type="button" class="btn-sm plain" id="auto-off">关闭自动</button>' +
      '</div>';
    const off = $b('auto-off');
    if (off) off.addEventListener('click', function () { toggleAutoBattle(false); });
    return;
  }

  const skills = LB.skillsOf(mon);
  const items = battleItemIds().filter((id) => !itemBlockReason(id, mon)).length;
  const benchAlive = s.team.filter((m, i) => i !== battle.idx && m.hp > 0).length;

  addCmd('术法', skills.length + ' 式', showSkills, skills.length === 0, 'primary');
  addCmd('结契', battle.foe.cannotCatch ? '不可结契' : ((s.items.charm || 0) > 0 ? '灵符 ' + s.items.charm : '徒手'),
    attemptCatch, battle.foe.cannotCatch);
  addCmd('换灵', aliveCount() > 1 ? '可战 ' + aliveCount() : '仅一', showSwitch, aliveCount() <= 1, 'ghost');
  addCmd('丹药', items > 0 ? '道具 ' + items : '无可用', showBattleItems, items <= 0, 'ghost');

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
    const linkHint = battle.combo && battle.combo.el && GENERATES[battle.combo.el] === s.el ? ' · 可生' : '';
    const sub = left > 0 ? '冷却 ' + left : el.ch + (s.power ? ' · 威力 ' + skillPowerAt(s, mon.lv) + linkHint : ' · 辅助');
    addCmd(s.name, sub, () => playerSkill(id), left > 0, 'skill el-' + s.el);
  });
  addCmd('返回', '收起', renderCommands, false, 'back');
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
  addCmd('返回', '收起', renderCommands, false, 'back');
}

function itemBlockReason(id, mon) {
  const it = ITEMS[id];
  if (!it) return '不可用';
  if (it.use === 'heal') return mon.hp >= monMax(mon) ? '气血已满' : '';
  if (it.use === 'cleanse') return hasNegative(mon) ? '' : '无负面状态';
  if (it.use === 'revive') return faintCount() > 0 ? '' : '无力竭后备';
  if (it.use === 'escape') return battle.foe && battle.foe.isBoss ? 'Boss 不可遁' : '';
  if (it.use === 'focus') return mon.statuses && mon.statuses.charge ? '已蓄势' : '';
  return '';
}

function itemEffect(id) {
  const it = ITEMS[id];
  if (!it) return '';
  if (it.use === 'heal') return '回气 ' + it.value;
  if (it.use === 'cleanse') return '解灼蚀滞破';
  if (it.use === 'revive') return '救力竭';
  if (it.use === 'escape') return '脱身';
  if (it.use === 'focus') return '蓄势 ' + (it.value || 2);
  return '';
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
  addCmd('返回', '收起', renderCommands, false, 'back');
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
  addCmd('返回', '收起', renderCommands, false, 'back');
}
