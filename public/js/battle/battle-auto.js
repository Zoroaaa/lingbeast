// 灵兽录 · 战斗层 · 自动战斗决策
// 只做“玩家回合该按哪个按钮”的判断，所有结算仍走 battle-engine 的既有入口。

function autoSettings() {
  const s = saveGame();
  const g = s && s.settings ? s.settings : {};
  return {
    on: !!g.autoBattle,
    potionPct: Number(g.autoPotionPct) || 0,
    catchOn: !!g.autoCatch,
    catchPct: Number(g.autoCatchPct) || 30,
  };
}

function autoBattleOn() {
  return !!(battle.on && !battle.over && autoSettings().on);
}

function autoLog(text) {
  logLine('（自动）' + text, 'accent');
}

// 自动行动前的停顿：受 1x/2x/跳过与减少动效影响
function scheduleAutoTurn(ms) {
  if (!autoBattleOn() || battle.busy || battle.forced || battle.over) return;
  if (battle.autoPending) return;
  battle.autoPending = true;
  setTimeout(function () {
    battle.autoPending = false;
    runAutoTurn();
  }, battleDelay(ms == null ? 520 : ms));
}

function autoHealItems() {
  const s = saveGame();
  if (!s || !s.items) return [];
  return Object.keys(ITEMS).filter(function (id) {
    return ITEMS[id].battle && ITEMS[id].use === 'heal' && (s.items[id] || 0) > 0;
  }).sort(function (a, b) {
    return (ITEMS[a].value || 0) - (ITEMS[b].value || 0);
  });
}

function pickAutoPotion(mon) {
  const missing = monMax(mon) - mon.hp;
  if (missing <= 0) return null;
  const ids = autoHealItems();
  if (!ids.length) return null;
  // 优先用刚好能补满的最小丹药，避免残血十点吞掉天根露
  for (let i = 0; i < ids.length; i += 1) {
    if ((ITEMS[ids[i]].value || 0) >= missing) return ids[i];
  }
  return ids[ids.length - 1];
}

function autoElementMult(atkEl, defEl) {
  if (typeof BEATS === 'undefined') return 1;
  if (BEATS[atkEl] === defEl) return 1.6;
  if (BEATS[defEl] === atkEl) return 0.65;
  return 1;
}

function pickAutoSkill(mon, foe) {
  if (!mon || !foe) return null;
  const cd = mon.cd || {};
  const ids = LB.skillsOf(mon).filter(function (id) {
    return SKILLS[id] && !(cd[id] > 0);
  });
  if (!ids.length) return null;

  const hpPct = mon.hp / monMax(mon);
  if (hpPct <= 0.3) {
    const heal = ids.find(function (id) { return SKILLS[id].heal && mon.hp < monMax(mon); });
    if (heal) return heal;
  }

  let best = null;
  let bestScore = -1;
  ids.forEach(function (id) {
    const sk = SKILLS[id];
    let score = (sk.power || 0) * autoElementMult(sk.el, foe.el);
    if (sk.status) score += 4;
    if (sk.guard) score += 2;
    if (!sk.power && !sk.heal && !sk.guard && !sk.status) score = 0.1;
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  });
  return best;
}

function pickAutoSwitch() {
  const s = saveGame();
  const foe = battle.foe;
  if (!s || !foe) return -1;
  let best = -1;
  let bestScore = -Infinity;
  s.team.forEach(function (m, i) {
    if (i === battle.idx || m.hp <= 0) return;
    const st = monStats(m);
    const el = st.el;
    let score = m.lv * 2 + (m.hp / st.hp) * 12;
    score += autoElementMult(el, foe.el) * 10;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

// 术法全在冷却：用一回合凝息护体，等待冷却回转
async function autoGuardTurn() {
  const mon = currentMon();
  const foe = battle.foe;
  if (!mon || !foe) return;
  battle.busy = true;
  renderCommands();
  autoLog('术法未备，凝息护体');
  await cast(mon, foe, { name: '凝息护体', el: monEl(mon), power: 0, guard: 1 }, mon, null, false);
  await foeTurn();
  await checkBattleEnd();
  await endRound();
}

function runAutoTurn() {
  if (!autoBattleOn() || battle.busy || battle.forced || battle.over) return;
  const s = saveGame();
  const mon = currentMon();
  const foe = battle.foe;
  if (!s || !mon || !foe || mon.hp <= 0 || foe.hp <= 0) return;

  const cfg = autoSettings();
  const hpPct = (mon.hp / monMax(mon)) * 100;
  const foePct = (foe.hp / foe.maxHp) * 100;

  // 1. 自己血量低于阈值先吃药
  if (cfg.potionPct > 0 && hpPct <= cfg.potionPct) {
    const potion = pickAutoPotion(mon);
    if (potion) {
      autoLog('气血偏低，服下' + ITEMS[potion].name);
      useBattleItem(potion);
      return;
    }
  }

  // 2. 野生灵兽低于捕捉阈值，尝试结契
  if (cfg.catchOn && !foe.isBoss && !foe.cannotCatch && foePct <= cfg.catchPct) {
    autoLog('灵息已弱，引契收服');
    attemptCatch();
    return;
  }

  // 3. 选威力与克制收益最高的可用术法
  const skillId = pickAutoSkill(mon, foe);
  if (skillId) {
    playerSkill(skillId);
    return;
  }

  // 4. 全在冷却：凝息一回合，绝不空转
  autoGuardTurn();
}
