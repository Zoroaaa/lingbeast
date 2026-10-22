// 灵兽录 · 战斗层 · Boss 阶段、结算与入口
// ---------- Boss 阶段 ----------
let bannerTimer = null;

function showBossBanner(eyebrow, text, ms) {
  const box = $b('boss-banner');
  if (!box) return;
  const eb = $b('boss-banner-eyebrow');
  const tx = $b('boss-banner-text');
  if (eb) eb.textContent = eyebrow;
  if (tx) tx.textContent = text || '';
  box.hidden = false;
  box.classList.remove('show');
  void box.offsetWidth;
  box.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    box.hidden = true;
    box.classList.remove('show');
  }, ms || 1800);
}

function checkBossPhase() {
  const foe = battle.foe;
  if (!foe || !foe.isBoss || !foe.phases || !foe.phases.length) return;
  if (foe.hp <= 0) return;
  let fired = false;

  while (battle.phaseIndex < foe.phases.length) {
    const ph = foe.phases[battle.phaseIndex];
    if (!ph || foe.hp / foe.maxHp > ph.at) break;
    battle.phaseIndex += 1;
    fired = true;
    battle.field = ph.field || battle.field;

    const abyss = battle.bossId === 'chiyuan' || battle.bossId === 'wuxiang';
    showBossBanner(abyss ? '渊兽异动' : '守脉灵异动', ph.text, 1800);
    logAccent('场地 · ' + (ph.field || '灵息翻涌'));

    if (foe.ai === 'aggressive') {
      foe.atk = Math.round(foe.atk * 1.1);
      logLine(foe.name + ' 攻势更盛。', 'accent');
    } else if (foe.ai === 'guardian') {
      foe.def = Math.round(foe.def * 1.15);
      logLine(foe.name + ' 退守阵眼，甲气更厚。', 'accent');
    } else if (foe.ai === 'healer') {
      const heal = Math.max(1, Math.round(foe.maxHp * 0.08));
      foe.hp = Math.min(foe.maxHp, foe.hp + heal);
      logLine(foe.name + ' 借雾回气 +' + heal, 'accent');
      floatOver($b('foe-art'), '+' + heal, 'heal');
    } else {
      const pool = ['burn', 'corrode', 'slow', 'break'];
      const sid = pool[randInt(0, pool.length - 1)];
      const mon = currentMon();
      if (mon) {
        applyStatus(mon, sid, STATUSES[sid].duration);
        logLine(foe.name + ' 借影作祟，你染上「' + STATUSES[sid].name + '」。', 'accent');
      }
    }

    if (ph.summon) {
      logWarn(ph.summon);
      applyStatus(foe, 'shield', 1);
    }

    const scene = $b('battle-scene');
    if (scene && !reduceMotion()) {
      scene.classList.add('boss-phase');
      setTimeout(() => scene.classList.remove('boss-phase'), 1200);
    }
    screenShake();
  }

  if (fired) renderBattleUI();
}

// ---------- 回合结算 ----------
async function endRound() {
  if (!battle.on || battle.over || battle.forced) return;
  battle.busy = false;
  const mon = currentMon();
  if (mon && mon.cd) Object.keys(mon.cd).forEach((k) => { if (mon.cd[k] > 0) mon.cd[k] -= 1; });
  if (battle.foe && battle.foe.cd) {
    Object.keys(battle.foe.cd).forEach((k) => { if (battle.foe.cd[k] > 0) battle.foe.cd[k] -= 1; });
  }
  if (mon && mon.guard > 0) mon.guard -= 1;
  if (battle.foe && battle.foe.guard > 0) battle.foe.guard -= 1;

  const meDead = mon && mon.hp > 0 ? tickStatuses(mon, false) : false;
  const foeDead = battle.foe && battle.foe.hp > 0 ? tickStatuses(battle.foe, true) : false;
  renderBattleUI();

  if (meDead || foeDead) {
    if (await checkBattleEnd()) return;
  }
  if (battle.on && !battle.over && !battle.forced) {
    battle.busy = false;
    renderCommands();
  }
}

// ---------- 胜利 / 成长 / 失败 ----------
async function victory() {
  if (battle.over || !battle.foe) return;
  battle.over = true;
  battle.busy = true;
  const s = saveGame();
  const foe = battle.foe;
  const box = $b('commands');
  if (box) box.innerHTML = '';
  logAccent(foe.name + ' 伏地，灵息散去。');
  await wait(720);

  const exp = (20 + foe.lv * 9) * (foe.isBoss ? 2 : 1);
  const me = currentMon();
  const notes = me ? gainExp(me, exp) : [];
  const jade = calcJade(foe);
  const drops = rollDrops(foe);

  if (s && s.team) {
    s.team.forEach((m) => {
      m.statuses = {};
      m.guard = 0;
    });
  }
  if (window.LB && typeof LB.persist === 'function') LB.persist();

  const dropText = drops.length
    ? ' · 得' + drops.map((d) => (MATERIALS[d.id] ? MATERIALS[d.id].name : d.id) + ' ×' + d.count).join('、')
    : '';
  const head = foe.isBoss ? (battle.trialFloor ? '试炼已过' : 'Boss 已伏') : '得胜';
  const message = head + ' · 经验 +' + exp + (notes.length ? ' · ' + notes.join(' · ') : '') + dropText;

  if (window.LB && typeof LB.returnToWorld === 'function') {
    await LB.returnToWorld({
      win: true,
      bossId: battle.bossId || undefined,
      trialFloor: battle.trialFloor || undefined,
      foeSp: foe.sp, foeLv: foe.lv, foeName: foe.name,
      exp: exp, jade: jade, drops: drops, message: message,
    });
  }
}

function gainExp(mon, amount) {
  const notes = [];
  if (!mon) return notes;
  mon.exp = (mon.exp || 0) + amount;
  let guard = 0;
  while (mon.exp >= needExp(mon.lv) && mon.lv < 40 && guard < 50) {
    mon.exp -= needExp(mon.lv);
    const before = LB.skillsOf(mon).length;
    mon.lv += 1;
    mon.hp = monMax(mon);
    const now = LB.skillsOf(mon);
    if (now.length > before) notes.push('习得「' + SKILLS[now[now.length - 1]].name + '」');
    else notes.push('升至 Lv.' + mon.lv);
    guard += 1;
  }
  return notes;
}

function rollDrops(foe) {
  const regionId = battle.regionId;
  const pool = Object.keys(MATERIALS).filter((id) => (MATERIALS[id].regions || []).indexOf(regionId) >= 0);
  if (!pool.length) return [];
  const count = foe.isBoss ? randInt(1, 2) : (Math.random() < 0.3 ? 1 : 0);
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const id = pool[randInt(0, pool.length - 1)];
    const found = out.find((d) => d.id === id);
    if (found) found.count += 1;
    else out.push({ kind: 'mat', id: id, count: 1 });
  }
  return out;
}

async function defeat() {
  battle.over = true;
  battle.busy = true;
  const overlay = $b('battle-overlay');
  if (!overlay) return;
  overlay.hidden = false;
  overlay.innerHTML = '<div class="panel">' +
    '<p class="eyebrow">全队力竭</p>' +
    '<h3>灵息已散</h3>' +
    '<p>山雾漫上来。可以退回入口重整旗鼓，或回到上一次落笔处。</p>' +
    '<div class="row"><button class="btn-sm solid" id="ov-retreat">退回入口</button>' +
    '<button class="btn-sm plain" id="ov-load">读取存档</button></div></div>';
  if (typeof uiPixelize === 'function') uiPixelize(overlay);
  const retreat = $b('ov-retreat');
  if (retreat) retreat.addEventListener('click', () => {
    overlay.hidden = true;
    if (window.LB && typeof LB.defeatRetreat === 'function') LB.defeatRetreat();
  });
  const load = $b('ov-load');
  if (load) load.addEventListener('click', () => {
    overlay.hidden = true;
    if (window.LB && typeof LB.defeatReload === 'function') LB.defeatReload();
  });
}

// ---------- 入口 ----------
function battleStartWild(regionId) {
  const s = saveGame();
  if (!s) return;
  const rid = regionId && REGIONS[regionId] ? regionId : (s.region || 'qingxi');
  const r = REGIONS[rid];
  const pool = r && r.pool ? r.pool : [];
  if (!pool.length) {
    if (window.LB && typeof LB.toast === 'function') LB.toast('此处无灵迹可遇');
    return;
  }
  const pick = pool[randInt(0, pool.length - 1)];
  const lv = randInt(pick.lv[0], pick.lv[1]);
  openBattle({ sp: pick.sp, lv: lv, isBoss: false, regionId: rid });
}

function battleStartBoss(bossId, opts) {
  const b = BOSSES[bossId];
  if (!b) return;
  const o = opts || {};
  openBattle({
    sp: b.sp,
    lv: o.lv || b.lv,
    isBoss: true,
    bossId: b.id,
    hpMul: o.hpMul != null ? o.hpMul : b.hpMul,
    atkMul: o.atkMul != null ? o.atkMul : b.atkMul,
    displayName: o.displayName || b.name,
    regionId: o.regionId || b.region,
  });
}

function battleStartTrial(floor) {
  const t = TRIALS[floor - 1];
  if (!t || !t.boss) return;
  const b = BOSSES[t.boss.ref];
  if (!b) return;
  openBattle({
    sp: b.sp,
    lv: t.boss.lv || b.lv,
    isBoss: true,
    bossId: b.id,
    trialFloor: floor,
    hpMul: t.boss.hpMul != null ? t.boss.hpMul : b.hpMul,
    atkMul: t.boss.atkMul != null ? t.boss.atkMul : b.atkMul,
    displayName: '试炼 · ' + b.name,
    regionId: b.region,
  });
}
