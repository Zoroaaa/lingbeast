// 灵兽录 · 界面层 · 工具函数与面板基础
window.LB = window.LB || {};
var LB = window.LB;

var TALENT_STEPS = [
  { max: 0.95, label: '下' },
  { max: 1.02, label: '中' },
  { max: 1.07, label: '上' },
  { max: Infinity, label: '极品' },
];

// ---------- 基础工具 ----------
function $(id) { return document.getElementById(id); }

function uiEsc(v) {
  return String(v === undefined || v === null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function uiStateOrToast() {
  var s = LB.saveState();
  if (!s) { if (LB.toast) LB.toast('尚未入山'); return null; }
  return s;
}

function uiElOf(id) { return ELEMENTS[id] || ELEMENTS.wood; }

function uiElChip(el, text) {
  var d = uiElOf(el);
  return '<span class="seal-chip" style="--el:' + d.color + ';color:' + d.color + ';border-color:' + d.color + '">' +
    uiEsc(text || d.ch) + '</span>';
}

function uiTalentOf(t) {
  var v = typeof t === 'number' && t > 0 ? t : 1;
  for (var i = 0; i < TALENT_STEPS.length; i += 1) {
    if (v < TALENT_STEPS[i].max) return { label: TALENT_STEPS[i].label, value: v };
  }
  return { label: '极品', value: v };
}

function uiStatsOf(mon) {
  var d = SPECIES[mon && mon.sp];
  if (!d) return { hp: 1, atk: 1, def: 1, spd: 1, el: 'wood' };
  var t = typeof mon.talent === 'number' && mon.talent > 0 ? mon.talent : 1;
  var l = Math.max(1, Number(mon.lv) || 1);
  return {
    hp: Math.round((d.base.hp + d.grow.hp * (l - 1)) * t),
    atk: Math.round((d.base.atk + d.grow.atk * (l - 1)) * t),
    def: Math.round((d.base.def + d.grow.def * (l - 1)) * t),
    spd: Math.round((d.base.spd + d.grow.spd * (l - 1)) * t),
  };
}

function uiLearnedSkills(mon) {
  var d = SPECIES[mon && mon.sp];
  if (!d) return [];
  var out = [];
  (d.sk || []).forEach(function (entry) {
    if (mon.lv >= entry[0] && SKILLS[entry[1]] && out.indexOf(entry[1]) < 0) out.push(entry[1]);
  });
  return out;
}

function uiPctOf(cur, max) {
  if (!max || max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(cur / max * 100)));
}

function uiBarHtml(cur, max, cls) {
  return '<div class="' + (cls || 'beast-hp') + '"><i style="width:' + uiPctOf(cur, max) + '%"></i></div>';
}

function uiRegionName(id) {
  var r = REGIONS[id];
  return r ? r.name : '';
}

function uiRegionChapterText(id) {
  var r = REGIONS[id];
  if (!r) return '';
  return r.chapter ? '第 ' + r.chapter + ' 境' : '中枢';
}

function uiGiverText(giver) {
  if (!giver) return '';
  var r = REGIONS[giver.region];
  var name = '';
  if (r) {
    (r.npcs || []).forEach(function (npc) { if (npc.id === giver.npc) name = npc.name; });
  }
  return (r ? r.name : giver.region) + ' · ' + (name || giver.npc);
}

function uiFindMon(uid) {
  var s = LB.saveState();
  if (!s) return null;
  var i;
  for (i = 0; i < s.team.length; i += 1) {
    if (s.team[i].uid === uid) return { mon: s.team[i], from: 'team', index: i };
  }
  for (i = 0; i < s.storage.length; i += 1) {
    if (s.storage[i].uid === uid) return { mon: s.storage[i], from: 'storage', index: i };
  }
  return null;
}

function uiRewardText(reward) {
  if (!reward) return '无';
  var parts = [];
  if (reward.jade) parts.push('灵玉 +' + reward.jade);
  (reward.items || []).forEach(function (it) {
    parts.push((ITEMS[it.id] ? ITEMS[it.id].name : it.id) + ' +' + (it.count || 1));
  });
  (reward.mats || []).forEach(function (m) {
    parts.push((MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' +' + (m.count || 1));
  });
  return parts.length ? parts.join(' · ') : '无';
}

function uiTravelAllowed() {
  var here = LB.region ? LB.region() : 'shanmen';
  return here === 'shanmen' || here === 'guixu';
}

function uiRegionLockText(id) {
  var r = REGIONS[id];
  if (!r) return '此地不在册';
  var parts = [];
  if (r.chapter) parts.push('第 ' + r.chapter + ' 章后点亮');
  Object.keys(BOSSES).forEach(function (bid) {
    if (BOSSES[bid].region === id) parts.push('击败「' + BOSSES[bid].name + '」');
  });
  return parts.length ? parts.join(' · ') : '前路未开';
}

// 把面板内的旧按钮统一升级为 NES.css 像素组件
function uiPixelize(root) {
  if (!root) return;
  Array.prototype.forEach.call(root.querySelectorAll('button.btn-sm'), function (btn) {
    if (btn.classList.contains('nes-btn')) return;
    btn.classList.add('nes-btn');
    if (btn.classList.contains('solid')) btn.classList.add('is-success');
    else if (btn.classList.contains('danger')) btn.classList.add('is-error');
    else if (btn.classList.contains('warn')) btn.classList.add('is-warning');
  });
}

function uiBind(selector, event, fn, root) {
  var scope = root || $('modal');
  if (!scope) return;
  Array.prototype.forEach.call(scope.querySelectorAll(selector), function (node) {
    node.addEventListener(event, function (e) { fn(node, e); });
  });
}

function uiCloseFoot(extra) {
  return (extra || '') + '<button type="button" class="btn-sm plain" data-close="1">合上</button>';
}

function uiBindClose() {
  uiBind('[data-close]', 'click', function () { LB.closeModal(); });
}

function uiConfirmAction(title, text, okLabel, onOk, onCancel, danger) {
  LB.openModal(title,
    '<p class="sheet-note">' + uiEsc(text) + '</p>',
    '<button type="button" class="btn-sm plain" data-confirm-cancel="1">再想想</button>' +
    '<button type="button" class="btn-sm ' + (danger ? 'danger' : 'solid') + '" data-confirm-ok="1">' +
    uiEsc(okLabel) + '</button>');
  uiBind('[data-confirm-cancel]', 'click', function () {
    if (typeof onCancel === 'function') onCancel(); else LB.closeModal();
  });
  uiBind('[data-confirm-ok]', 'click', function () {
    LB.closeModal();
    if (typeof onOk === 'function') onOk();
  });
}
