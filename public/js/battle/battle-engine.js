// 灵兽录 · 战斗层 · 行动、AI、结契与遁走
// ---------- 行动 ----------
async function playerSkill(id) {
  if (battle.busy || battle.over || !battle.foe) return;
  const mon = currentMon();
  const skill = SKILLS[id];
  if (!mon || !skill) return;
  battle.busy = true;
  renderCommands();
  mon.cd = mon.cd || {};
  const first = effStats(mon, false).spd >= effStats(battle.foe, true).spd;

  if (first) {
    await cast(mon, battle.foe, id, mon, null, false);
    mon.cd[id] = skill.cd;
    if (!(await checkBattleEnd())) {
      await foeTurn();
      await checkBattleEnd();
    }
  } else {
    await foeTurn();
    if (!(await checkBattleEnd())) {
      await cast(mon, battle.foe, id, mon, null, false);
      mon.cd[id] = skill.cd;
      await checkBattleEnd();
    }
  }
  await endRound();
}

async function playerBond(benchIdx) {
  const s = saveGame();
  if (!s || battle.busy || battle.over || battle.bondUsed) return;
  if (battle.bond < 100) return;
  const lead = currentMon();
  const bench = s.team[benchIdx];
  if (!lead || !bench || bench === lead || bench.hp <= 0) return;

  battle.busy = true;
  battle.bondUsed = true;
  battle.bond = 0;
  updateBondUI();
  renderCommands();

  const leadEl = monEl(lead);
  const benchEl = monEl(bench);
  let rel = 'beat';
  if (leadEl === benchEl) rel = 'same';
  else if ((GENERATES[leadEl] === benchEl) || (GENERATES[benchEl] === leadEl)) rel = 'gen';
  const art = BOND_ARTS[rel] || BOND_ARTS.beat;

  showBossBanner('合契', art.name + ' · ' + monName(lead) + ' × ' + monName(bench), 1800);
  logAccent('契势已满，' + monName(lead) + ' 与 ' + monName(bench) + ' 同声应契 · ' + art.name);
  await wait(700);

  const strikes = [lead, bench];
  for (let i = 0; i < strikes.length; i += 1) {
    if (battle.foe.hp <= 0) break;
    const mon = strikes[i];
    const el = monEl(mon);
    const sk = { name: art.name + ' · 击', el: el, power: Math.round(randInt(18, 22) * art.mult) };
    await cast(mon, battle.foe, sk, mon, null, false);
    await wait(180);
  }

  if (art.status) applyStatus(battle.foe, art.status, art.turns || 2);
  if (art.shield) {
    applyStatus(lead, 'shield', 2);
    applyStatus(bench, 'shield', 2);
  }
  if (rel === 'gen') advanceCombo(benchEl);

  [lead, bench].forEach((m) => {
    const max = monMax(m);
    const heal = Math.max(1, Math.round(max * art.heal));
    const before = m.hp;
    m.hp = Math.min(max, m.hp + heal);
    const real = m.hp - before;
    if (real > 0) {
      logLine(monName(m) + ' 契息回流 +' + real, 'accent');
      floatOver($b('self-art'), '+' + real, 'heal');
    }
  });

  renderBattleUI();
  if (!(await checkBattleEnd())) await foeTurn();
  await checkBattleEnd();
  await endRound();
}

async function cast(actor, target, id, actorMon, targetMon, fromFoe) {
  const s = typeof id === 'string' ? SKILLS[id] : id;
  if (!s || !actor || !target) return;
  const actorIsFoe = actor === battle.foe;
  const targetIsFoe = target === battle.foe;
  const actorArt = actorIsFoe ? $b('foe-art') : $b('self-art');
  const targetArt = targetIsFoe ? $b('foe-art') : $b('self-art');
  const label = nameOf(actor, actorIsFoe);

  animateAttack(actorArt);
  await wait(170);

  const healActor = async (ratio, text) => {
    const max = maxHpOf(actor, actorIsFoe);
    const before = actor.hp;
    actor.hp = Math.min(max, actor.hp + Math.max(1, Math.round(max * ratio)));
    const real = actor.hp - before;
    if (real > 0) {
      logLine(text.replace('{n}', real), 'accent');
      floatOver(actorArt, '+' + real, 'heal');
      renderBattleUI();
      battleSfx('heal');
      await wait(420);
    }
  };

  if (s.power > 0) {
    const dmg = calcDamage(actor, target, s, { aIsFoe: actorIsFoe, dIsFoe: targetIsFoe });
    target.hp = Math.max(0, target.hp - dmg.value);
    const tag = dmg.mult > 1 ? ' <span class="tag-strong">克制</span>'
      : dmg.mult < 1 ? ' <span class="tag-weak">受制</span>' : '';
    logLine(label + ' 施「' + s.name + '」· 造成 ' + dmg.value + ' 伤害' + tag +
      (dmg.crit ? ' <span class="tag-crit">会心</span>' : ''), dmg.mult > 1 ? 'accent' : '');
    animateHit(targetArt);
    floatOver(targetArt, '-' + dmg.value, dmg.crit ? 'crit' : dmg.mult > 1 ? 'strong' : '');
    spawnInkBurst(targetArt, s.el, dmg.crit || dmg.mult > 1);
    if (dmg.crit || dmg.mult > 1) screenShake();
    battleSfx(dmg.crit ? 'crit' : 'hit');
    if (targetIsFoe && typeof tutorialEvent === 'function' && battle.foe &&
      battle.foe.hp > 0 && battle.foe.hp / battle.foe.maxHp <= 0.5) {
      tutorialEvent('battle:weaken');
    }

    if (actorIsFoe) {
      if ((target.guard || 0) > 0 || (target.statuses && target.statuses.shield)) gainBond(8);
      else if (dmg.mult > 1) gainBond(6);
    } else {
      if (dmg.mult > 1) gainBond(18);
      if (dmg.crit) gainBond(12);
    }

    if (actor.statuses && actor.statuses.charge) delete actor.statuses.charge;
    if (s.status && target.hp > 0) {
      applyStatus(target, s.status, s.statusTurns);
      logLine('「' + STATUSES[s.status].name + '」附于' + nameOf(target, targetIsFoe) + '。', 'accent');
    }
    if (s.selfCharge) {
      applyStatus(actor, 'charge', randInt(1, 2));
      logLine(label + ' 蓄势待发。', 'accent');
    }
    if (!actorIsFoe && s.power > 0) {
      advanceCombo(s.el);
      if (battle.combo.n > 0) {
        logLine('灵连 · ' + ELEMENTS[battle.combo.el].ch + ' 生 ' + ELEMENTS[s.el].ch + ' ×' + battle.combo.n, 'accent');
      }
    }
    renderBattleUI();
    checkBossPhase();
    await wait(520);
    if (!actorIsFoe && battle.combo && battle.combo.n >= 3 && s.power > 0) {
      await healActor(0.06, label + ' 灵连圆满 · 回气 +{n}');
      if (s.status && target.hp > 0) applyStatus(target, s.status, (s.statusTurns || 2) + 1);
    }
    if (s.heal && actor.hp > 0) await healActor(skillHealAt(s, actor.lv || 1), label + ' 借「' + s.name + '」回气 +{n}');
  } else if (s.heal) {
    await healActor(skillHealAt(s, actor.lv || 1), label + ' 施「' + s.name + '」· 气血回复 +{n}');
  } else if (s.guard) {
    if (s.status) applyStatus(actor, s.status, s.statusTurns || 2);
    else actor.guard = s.guard;
    logLine(label + ' 运起「' + s.name + '」，周身结甲。', 'accent');
    renderBattleUI();
    battleSfx('guard');
    await wait(520);
  } else {
    if (s.status) {
      applyStatus(target, s.status, s.statusTurns);
      logLine(label + ' 施「' + s.name + '」，「' + STATUSES[s.status].name + '」附于' + nameOf(target, targetIsFoe) + '。', 'accent');
    }
    if (s.selfCharge) {
      applyStatus(actor, 'charge', randInt(1, 2));
      logLine(label + ' 蓄势待发。', 'accent');
    }
    renderBattleUI();
    await wait(420);
  }
}

async function foeTurn() {
  if (battle.over || !battle.foe || battle.foe.hp <= 0) return;
  await wait(260);
  const pick = pickFoeSkill();
  if (!pick) return;
  const sk = SKILLS[pick.id];
  if (!sk) return;
  battle.foe.cd[pick.id] = sk.cd;
  const self = pick.target === 'self';
  await cast(battle.foe, self ? battle.foe : currentMon(), pick.id, null, self ? null : currentMon(), true);
}

function pickFoeSkill() {
  const foe = battle.foe;
  if (!foe) return null;
  const ids = LB.skillsOf({ sp: foe.sp, lv: foe.lv });
  if (!ids.length) return null;
  let cand = ids.filter((id) => !(foe.cd[id] > 0));
  if (!cand.length) cand = ids.slice();
  const hpR = foe.hp / foe.maxHp;
  const ai = foe.ai || 'aggressive';
  const playerEl = monEl(currentMon());
  const elMult = (el) => {
    if (BEATS[el] === playerEl) return 1.6;
    if (BEATS[playerEl] === el) return 0.65;
    return 1;
  };

  let best = null;
  let bestScore = -Infinity;
  cand.forEach((id) => {
    const sk = SKILLS[id];
    if (!sk) return;
    const isHeal = !!sk.heal;
    const isGuard = !!sk.guard;
    const em = elMult(sk.el);
    let score = 0;
    if (ai === 'aggressive') {
      if (isHeal) score = hpR < 0.4 ? 18 : -6;
      else if (isGuard) score = hpR < 0.5 ? 10 : 2;
      else score = (sk.power || 0) * em * 1.2;
    } else if (ai === 'guardian') {
      if ((isHeal || isGuard) && hpR < 0.55) score = 40 + (sk.power || 0);
      else if (isGuard) score = 12;
      else score = (sk.power || 0) * em;
    } else if (ai === 'healer') {
      if (isHeal) score = hpR < 0.6 ? 80 : 4;
      else if (sk.status) score = 20 + (sk.power || 0) * em;
      else score = (sk.power || 0) * em;
    } else {
      if (sk.status) score = 35 + (sk.power || 0) * em * 0.5;
      else score = (sk.power || 0) * em * 0.9;
      if (isHeal) score = hpR < 0.4 ? 30 : 6;
    }
    score += Math.random() * 0.6;
    if (score > bestScore) {
      bestScore = score;
      best = { id: id, target: isHeal || isGuard ? 'self' : 'foe' };
    }
  });
  return best || { id: cand[0], target: 'foe' };
}

async function checkBattleEnd() {
  const foe = battle.foe;
  if (!foe) return false;
  if (battle.over) return true;
  if (foe.hp > 0) checkBossPhase();
  if (foe.hp <= 0) { await victory(); return true; }
  const mon = currentMon();
  if (mon && mon.hp <= 0) {
    mon.hp = 0;
    await handleSelfFaint();
    return true;
  }
  return false;
}

async function handleSelfFaint() {
  const mon = currentMon();
  if (!mon) return;
  logWarn(monName(mon) + ' 力竭，退出战斗。');
  const art = $b('self-art');
  if (art) art.classList.add('fainted');
  await wait(700);
  if (aliveCount() === 0) { await defeat(); return; }

  const s = saveGame();
  if (!s) return;
  if (typeof autoBattleOn === 'function' && autoBattleOn()) {
    const next = pickAutoSwitch();
    if (next >= 0) {
      logAccent('自动 · ' + monName(s.team[next]) + '接替。');
      await wait(420);
      forceSwitch(next);
      return;
    }
  }

  battle.forced = true;
  battle.busy = true;
  const box = $b('commands');
  if (box) box.innerHTML = '';
  logLine('择一灵兽接替。', 'accent');
  s.team.forEach((m, i) => {
    if (i === battle.idx) return;
    const st = monView(m);
    addCmd(st.name, m.hp <= 0 ? '已力竭' : 'Lv.' + m.lv + ' · ' + m.hp + '/' + st.maxHp,
      () => forceSwitch(i), m.hp <= 0, 'skill el-' + st.el);
  });
  renderBattleUI();
}

function forceSwitch(i) {
  const s = saveGame();
  if (!s || !s.team[i] || s.team[i].hp <= 0) return;
  battle.idx = i;
  battle.forced = false;
  battle.busy = false;
  logLine(monName(s.team[i]) + ' 入场。', 'accent');
  renderBattleUI();
  renderCommands();
  if (typeof autoBattleOn === 'function' && autoBattleOn()) scheduleAutoTurn(420);
}

async function playerSwitch(i) {
  const s = saveGame();
  if (!s || battle.busy || battle.over) return;
  if (!s.team[i] || s.team[i].hp <= 0) return;
  battle.busy = true;
  battle.idx = i;
  resetCombo();
  renderBattleUI();
  logLine(monName(s.team[i]) + ' 入场。', 'accent');
  await wait(460);
  await foeTurn();
  await checkBattleEnd();
  await endRound();
}

// ---------- 道具 ----------
async function useBattleItem(id) {
  const s = saveGame();
  if (!s || battle.busy || battle.over) return;
  const item = ITEMS[id];
  const have = s.items[id] || 0;
  if (!item || have <= 0) return;
  if (item.use === 'escape' && battle.foe && battle.foe.isBoss) {
    logWarn('坛上之灵锁住四方，遁符无效。');
    return;
  }
  const mon = currentMon();
  if (!mon) return;

  battle.busy = true;
  renderCommands();
  s.items[id] = have - 1;

  if (item.use === 'heal') {
    const max = monMax(mon);
    const value = item.value || 40;
    const before = mon.hp;
    mon.hp = Math.min(max, mon.hp + value);
    const real = mon.hp - before;
    logLine('服下' + item.name + '，气血回复 ' + real + '。', 'accent');
    floatOver($b('self-art'), '+' + real, 'heal');
  } else if (item.use === 'cleanse') {
    if (mon.statuses) {
      ['burn', 'corrode', 'slow', 'break'].forEach((k) => { delete mon.statuses[k]; });
    }
    logLine(item.name + '化开，灼、蚀、滞、破尽去。', 'accent');
  } else if (item.use === 'focus') {
    applyStatus(mon, 'charge', item.value || 2);
    logLine(item.name + '引雷入体，' + monName(mon) + ' 蓄势待发。', 'accent');
  } else if (item.use === 'revive') {
    let target = null;
    s.team.forEach((m) => { if (!target && m.hp <= 0) target = m; });
    if (!target) { s.items[id] = have; logWarn('没有力竭的灵兽。'); battle.busy = false; renderCommands(); return; }
    const max = monMax(target);
    target.hp = Math.max(1, Math.round(max * (item.value || 0.5)));
    target.statuses = {};
    target.guard = 0;
    logLine(item.name + ' 唤回 ' + monName(target) + '，气血回复半数。', 'accent');
    floatOver($b('party-strip'), '+' + target.hp, 'heal');
  } else if (item.use === 'escape') {
    logLine(item.name + '一燃，身形随墨色退去。', 'accent');
    await wait(420);
    if (window.LB && typeof LB.returnToWorld === 'function') {
      await LB.returnToWorld({ win: false, fled: true, message: '遁走 · ' + item.name });
    }
    return;
  }

  renderBattleUI();
  if (window.LB && typeof LB.persist === 'function') LB.persist();
  await wait(560);
  await foeTurn();
  await checkBattleEnd();
  await endRound();
}

async function usePill() {
  return useBattleItem('pill');
}

// ---------- 结契 / 遁走 ----------
function calcJade(foe) {
  return foe && foe.isBoss ? 40 + foe.lv * 3 : 6 + foe.lv * 2;
}

async function attemptCatch() {
  const s = saveGame();
  if (!s || battle.busy || battle.over || !battle.foe) return;
  const foe = battle.foe;
  if (foe.cannotCatch) { logWarn('坛上之灵不受契约。'); return; }

  battle.busy = true;
  renderCommands();
  const useCharm = (s.items.charm || 0) > 0;
  if (useCharm) s.items.charm -= 1;
  const me = currentMon();
  const pe = passiveEffect(me);
  const ge = typeof gearEffect === 'function' ? gearEffect(me) : {};
  const qixin = (pe && pe.catchPct ? pe.catchPct : 0) + (ge.catchPct || 0);
  const ratio = 1 - foe.hp / foe.maxHp;
  let p = 0.12 + ratio * 0.6 + (useCharm ? 0.18 : 0) + qixin - (foe.lv - me.lv) * 0.02;
  p = clamp(p, 0.04, 0.9);

  logLine('以' + (useCharm ? '灵符' : '掌心') + '引契，灵息交缠……');
  const art = $b('foe-art');
  if (art) art.classList.add('catching');
  await wait(900);
  if (art) art.classList.remove('catching');

  if (Math.random() < p) {
    battle.over = true;
    logAccent('契约成。');
    floatOver($b('foe-art'), '契成', 'heal');
    battleSfx('catch');
    if (typeof tutorialEvent === 'function') tutorialEvent('catch:success');
    await wait((typeof effectiveReduceMotion === 'function' && effectiveReduceMotion()) ? 0 : 500);
    const catchJade = calcJade(foe);
    if (typeof showBattleResult === 'function') {
      await showBattleResult({
        eyebrow: '契成',
        title: '结契',
        foeName: foe.name,
        rows: [
          { label: '灵玉', value: '+' + catchJade, accent: true },
          { label: '图鉴', value: foe.name + ' · 已记' },
          { label: '同伴', value: '收入队伍或灵兽栏', accent: true },
        ],
        note: typeof autoBattleOn === 'function' && autoBattleOn() ? '自动战斗中，即将返回山海。' : '',
        auto: typeof autoBattleOn === 'function' && autoBattleOn(),
      });
    }
    if (window.LB && typeof LB.returnToWorld === 'function') {
      await LB.returnToWorld({
        win: true, caught: true,
        foeSp: foe.sp, foeLv: foe.lv, foeName: foe.name,
        jade: catchJade, drops: [],
        message: '结契成功 · ' + foe.name + ' 随你同行',
      });
    }
    return;
  }

  logWarn('灵息一散，契未成。');
  battleSfx('catchFail');
  await wait(380);
  await foeTurn();
  await checkBattleEnd();
  await endRound();
  if (window.LB && typeof LB.persist === 'function') LB.persist();
}

async function flee() {
  if (battle.busy || battle.over || !battle.foe || battle.foe.isBoss) return;
  battle.busy = true;
  resetCombo();
  renderCommands();
  if (Math.random() < 0.6) {
    logLine('循雾而去，退出了战斗。');
    await wait(420);
    if (window.LB && typeof LB.returnToWorld === 'function') {
      await LB.returnToWorld({ win: false, fled: true, message: '遁走' });
    }
    return;
  }
  logWarn('未能脱身。');
  await wait(380);
  await foeTurn();
  await checkBattleEnd();
  await endRound();
}
