// 灵兽录 · 战斗层 · 状态与基础表现
// 灵兽录 · 战斗层（v3）：状态、灵诀、合契、Boss 阶段、AI、试炼
// 经典脚本，无 import/export；battle 为全局 const，main.js 的 isBlocked 依赖它。

const battle = {
  on: false, foe: null, idx: 0, busy: false, over: false, forced: false, lines: [],
  bond: 0, bondUsed: false, bossId: null, trialFloor: null, regionId: 'qingxi',
  field: null, phaseIndex: 0, elMod: {},
  combo: { el: null, n: 0 }, autoPending: false,
};

const $b = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));

// ---------- 术法成长 ----------
function skillPowerAt(sk, lv) {
  if (!sk) return 0;
  const level = Math.max(1, Number(lv) || 1);
  return Math.round((sk.power || 0) * (1 + Math.min(0.4, 0.01 * (level - 1))));
}
function skillHealAt(sk, lv) {
  if (!sk || !sk.heal) return 0;
  const level = Math.max(1, Number(lv) || 1);
  return sk.heal * (1 + Math.min(0.3, 0.008 * (level - 1)));
}
function resetCombo() {
  battle.combo = { el: null, n: 0 };
  if (typeof renderComboMeter === 'function') renderComboMeter();
}
function advanceCombo(el) {
  if (!battle.combo) battle.combo = { el: null, n: 0 };
  const c = battle.combo;
  if (!c.el) { c.el = el; c.n = 0; }
  else if (typeof GENERATES !== 'undefined' && GENERATES[c.el] === el) c.n = Math.min(3, c.n + 1);
  else c.n = 0;
  c.el = el;
  if (typeof renderComboMeter === 'function') renderComboMeter();
}

// ---------- 基础 ----------
function saveGame() {
  return window.LB && typeof LB.saveState === 'function' ? LB.saveState() : null;
}
function reduceMotion() {
  const s = saveGame();
  return !!(s && s.settings && s.settings.reduceMotion);
}
function battleWaitScale() {
  const s = saveGame();
  const speed = s && s.settings ? s.settings.battleSpeed : '1';
  if (speed === 'skip') return 0;
  if (speed === '2') return 0.5;
  return 1;
}
function battleDelay(ms) {
  const scale = battleWaitScale();
  if (scale <= 0) return 0;
  return Math.max(1, Math.round(ms * (reduceMotion() ? 0.35 : 1) * scale));
}
function wait(ms) {
  return sleep(battleDelay(ms));
}
function shakeAllowed() {
  const s = saveGame();
  return !(s && s.settings && s.settings.shake === false);
}
function battleSfx(name) {
  if (window.LB && LB.audio && typeof LB.audio.sfx === 'function') LB.audio.sfx(name);
}
function needExp(lv) {
  if (window.LB && typeof LB.expNeed === 'function') return LB.expNeed(lv);
  if (typeof expNeed === 'function') return expNeed(lv);
  return 22 + lv * 16;
}

function monStats(m) { return LB.statsOf(m.sp, m.lv, m); }
function monName(m) { return monStats(m).name; }
function monEl(m) { return SPECIES[m.sp] ? SPECIES[m.sp].el : 'wood'; }
function monMax(m) { return monStats(m).hp; }
function nameOf(c, isFoe) { return isFoe ? c.name : monName(c); }
function elOf(c, isFoe) { return isFoe ? c.el : monEl(c); }
function maxHpOf(c, isFoe) { return isFoe ? c.maxHp : monMax(c); }

function passiveEffect(mon) {
  if (!mon || !mon.passive || !PASSIVES[mon.passive]) return null;
  const s = saveGame();
  if (!s || !s.passives || !s.passives[mon.passive]) return null;
  return PASSIVES[mon.passive].effect || {};
}

function currentMon() {
  const s = saveGame();
  if (!s || !s.team || !s.team.length) return null;
  return s.team[battle.idx] || s.team[0];
}
function aliveCount() {
  const s = saveGame();
  if (!s || !s.team) return 0;
  return s.team.filter((m) => m.hp > 0).length;
}
function faintCount() {
  const s = saveGame();
  if (!s || !s.team) return 0;
  return s.team.filter((m) => m.hp <= 0).length;
}
function firstAlive() {
  const s = saveGame();
  if (!s || !s.team) return 0;
  for (let i = 0; i < s.team.length; i += 1) if (s.team[i].hp > 0) return i;
  return 0;
}
function monView(m) {
  const st = monStats(m);
  return {
    sp: m.sp, name: st.name, el: st.el, lv: m.lv, maxHp: st.hp,
    hp: clamp(m.hp, 0, st.hp), atk: st.atk, def: st.def, spd: st.spd,
    guard: m.guard || 0, exp: m.exp || 0, statuses: m.statuses || {}, passive: m.passive || null,
  };
}

// ---------- 日志 / 表现 ----------
function logLine(text, cls) {
  battle.lines.push({ text: text, cls: cls || '' });
  if (battle.lines.length > 5) battle.lines.shift();
  renderLog();
}
function renderLog() {
  const box = $b('battle-log');
  if (!box) return;
  box.innerHTML = battle.lines.map((l, i) =>
    '<p class="log-line ' + l.cls + '" style="opacity:' + (0.4 + (i + 1) / battle.lines.length * 0.6) + '">' + l.text + '</p>'
  ).join('');
}
function logAccent(t) { logLine(t, 'accent'); }
function logWarn(t) { logLine(t, 'warn'); }

function setText(id, text) {
  const el = $b(id);
  if (el) el.textContent = text;
}
function setBar(node, ratio) {
  if (!node) return;
  node.style.transform = 'scaleX(' + clamp(ratio, 0, 1) + ')';
}

function floatOver(container, text, cls) {
  if (!container) return;
  const layer = $b('float-layer');
  if (!layer) return;
  const r = container.getBoundingClientRect();
  const lr = layer.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-num ' + (cls || '');
  el.textContent = text;
  el.style.left = (r.left - lr.left + r.width / 2 - 20) + 'px';
  el.style.top = (r.top - lr.top + r.height / 2 - 24) + 'px';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function animateHit(container) {
  if (!container) return;
  container.classList.remove('hurt');
  void container.offsetWidth;
  container.classList.add('hurt');
  setTimeout(() => container.classList.remove('hurt'), battleDelay(420));
}
function animateAttack(container) {
  if (!container) return;
  container.classList.remove('attack');
  void container.offsetWidth;
  container.classList.add('attack');
  setTimeout(() => container.classList.remove('attack'), battleDelay(420));
}
function spawnInkBurst(container, el, strong) {
  if (!container || reduceMotion()) return;
  const node = document.createElement('span');
  node.className = 'ink-burst el-' + (el || 'wood') + (strong ? ' strong' : '');
  container.appendChild(node);
  setTimeout(() => node.remove(), 1000);
}
function screenShake() {
  if (!shakeAllowed()) return;
  const scene = $b('battle-scene');
  if (!scene) return;
  scene.classList.remove('shake');
  void scene.offsetWidth;
  scene.classList.add('shake');
  setTimeout(() => scene.classList.remove('shake'), 220);
}

// ---------- 开战 ----------
