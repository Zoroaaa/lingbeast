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
  return '<span class="seal-chip" style="--el:' + d.color + ';--el-ink:' + (d.ink || d.color) +
    ';--el-soft:' + d.soft + '">' + uiEsc(text || d.ch) + '</span>';
}

function uiTalentOf(t) {
  var v = typeof t === 'number' && t > 0 ? t : 1;
  for (var i = 0; i < TALENT_STEPS.length; i += 1) {
    if (v < TALENT_STEPS[i].max) return { label: TALENT_STEPS[i].label, value: v };
  }
  return { label: '极品', value: v };
}

function uiStatsOf(mon) {
  if (window.LB && typeof LB.statsOf === 'function' && mon) {
    return LB.statsOf(mon.sp, mon.lv, mon);
  }
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

function uiRarityOf(rarity) {
  return (typeof GEAR_RARITY !== 'undefined' && GEAR_RARITY[rarity]) || { label: '旧', color: '#8a7a5c', sell: 40 };
}

function uiGearModsText(mods) {
  if (!mods || typeof GEAR_MOD_KEYS === 'undefined') return '';
  return GEAR_MOD_KEYS.filter(function (key) {
    return Math.abs(Number(mods[key]) || 0) > 0.0001;
  }).map(function (key) {
    return (GEAR_MOD_LABELS[key] || key) + ' +' + Math.round(Number(mods[key]) * 100) + '%';
  }).join(' · ');
}

function uiGearSetText(def) {
  if (!def || !def.set || typeof GEAR_SETS === 'undefined' || !GEAR_SETS[def.set]) return '';
  var set = GEAR_SETS[def.set];
  return '套装 · ' + set.name + '（2 件：' + uiGearModsText(set.bonus) + '）';
}

function uiGearChipHtml(def) {
  if (!def) return '';
  var r = uiRarityOf(def.rarity);
  return '<span class="gear-chip" style="--rarity:' + r.color + '">' + uiEsc(r.label) + ' · ' + uiEsc(def.name) + '</span>';
}

function uiGearSlotLineHtml(mon) {
  if (typeof GEAR_SLOTS === 'undefined') return '';
  return Object.keys(GEAR_SLOTS).map(function (slot) {
    var ref = typeof gearRefOf === 'function' ? gearRefOf(mon, slot) : null;
    var def = ref ? GEAR[ref.id] : null;
    return '<span class="gear-slot' + (def ? '' : ' empty') + '" title="' + uiEsc(GEAR_SLOTS[slot].name) + '"' +
      (def ? ' style="--rarity:' + uiRarityOf(def.rarity).color + '"' : '') + '>' +
      uiEsc(GEAR_SLOTS[slot].ch) + ' ' + uiEsc(def ? def.name : '未佩') +
      '</span>';
  }).join('');
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

function uiBarHtml(cur, max, cls, label) {
  var pct = uiPctOf(cur, max);
  var maxv = Math.max(1, Number(max) || 1);
  var curv = Math.max(0, Math.min(maxv, Number(cur) || 0));
  return '<div class="' + (cls || 'beast-hp') + '" role="progressbar" aria-label="' + uiEsc(label || '进度') +
    '" aria-valuemin="0" aria-valuemax="' + maxv + '" aria-valuenow="' + curv + '" aria-valuetext="' +
    curv + ' / ' + maxv + '"><i style="width:' + pct + '%"></i></div>';
}

function uiRegionName(id) {
  var r = REGIONS[id];
  return r ? r.name : '';
}

function uiRegionChapterText(id) {
  var r = REGIONS[id];
  if (!r) return '';
  if (r.kind === 'hub') return '中枢';
  if (r.kind === 'side') return '支线境';
  if (r.kind === 'secret') return '秘境';
  return r.chapter ? '第 ' + r.chapter + ' 境' : '';
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
  var r = REGIONS[here];
  return !!(r && (r.travelHub || r.kind === 'hub')) || here === 'shanmen' || here === 'guixu';
}

function uiRegionLockText(id) {
  var r = REGIONS[id];
  if (!r) return '此地不在册';
  var u = r.unlock;
  if (u) {
    if (u.quest) {
      var q = typeof SIDE_QUESTS !== 'undefined' ? SIDE_QUESTS.filter(function (x) { return x.id === u.quest; })[0] : null;
      return q ? '完成支线「' + q.title + '」后点亮' : '完成对应支线后点亮';
    }
    if (u.flag) return '循线追索，方可点亮';
    if (u.codexPct) return '图鉴达 ' + u.codexPct + '% 后点亮';
    if (u.postgame) return '通关第一卷后点亮';
    if (u.chapter) return '第 ' + u.chapter + ' 章后点亮';
  }
  if (r.kind === 'secret') return '秘境 · 尚未寻得入口';
  if (r.kind === 'side') return '支线境 · 尚未寻得入口';
  var parts = [];
  if (r.chapter) parts.push('第 ' + r.chapter + ' 章后点亮');
  Object.keys(BOSSES).forEach(function (bid) {
    if (BOSSES[bid].region === id) parts.push('击败「' + BOSSES[bid].name + '」');
  });
  return parts.length ? parts.join(' · ') : '前路未开';
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
    '<button type="button" class="btn-sm plain" data-confirm-cancel="1" data-autofocus="1">再想想</button>' +
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

// ---------- 焦点与册页通用 ----------

var UI_FOCUS_ATTRS = [
  'data-focus-key', 'data-sheet-tab', 'data-toggle', 'data-range', 'data-speed',
  'data-battle-speed-setting', 'data-use-item', 'data-buy-item', 'data-sell-item',
  'data-craft', 'data-trial', 'data-codex-beast', 'data-atlas-node', 'data-confirm-cancel',
  'data-detail-back', 'data-gear-back', 'data-passive-back', 'data-close',
  'data-text-scale-setting', 'data-touch-setting',
];

function uiFocusables(root) {
  if (!root) return [];
  return Array.prototype.filter.call(root.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  ), function (el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  });
}

function uiFocusToken(el) {
  if (!el || el === document.body || el === document.documentElement) return null;
  if (el.id) return { kind: 'id', value: el.id };
  for (var i = 0; i < UI_FOCUS_ATTRS.length; i += 1) {
    var attr = UI_FOCUS_ATTRS[i];
    if (el.hasAttribute && el.hasAttribute(attr)) {
      return { kind: 'attr', attr: attr, value: el.getAttribute(attr) };
    }
  }
  return null;
}

function uiRestoreFocus(token) {
  if (!token) return false;
  var el = null;
  if (token.kind === 'id') {
    el = document.getElementById(token.value);
  } else {
    var val = String(token.value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    el = document.querySelector('[' + token.attr + '="' + val + '"]');
  }
  if (!el || !el.focus) return false;
  try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) { return false; } }
  return true;
}

// Tab 焦点陷阱；返回 release 函数
function uiTrapFocus(root) {
  if (!root) return function () {};
  function onKey(e) {
    if (e.key !== 'Tab') return;
    var list = uiFocusables(root);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0];
    var last = list[list.length - 1];
    var active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !root.contains(active)) { e.preventDefault(); last.focus(); }
    } else if (active === last || !root.contains(active)) {
      e.preventDefault(); first.focus();
    }
  }
  document.addEventListener('keydown', onKey, true);
  return function () { document.removeEventListener('keydown', onKey, true); };
}

// 统一 tab 条：role/aria-selected/roving tabindex 由这里生成
function uiTabBar(items, active, prefix) {
  var id = prefix || 'sheet';
  return '<div class="sheet-tabs" role="tablist">' + (items || []).map(function (it) {
    var on = it.key === active;
    return '<button type="button" class="sheet-tab' + (on ? ' active' : '') +
      '" id="' + uiEsc(id) + '-tab-' + uiEsc(it.key) + '" role="tab" aria-selected="' + (on ? 'true' : 'false') +
      '" tabindex="' + (on ? '0' : '-1') + '" aria-controls="' + uiEsc(id) + '-panel-' + uiEsc(it.key) +
      '" data-sheet-tab="' + uiEsc(it.key) + '">' + uiEsc(it.label) + '</button>';
  }).join('') + '</div>';
}

function uiFocusTab(key) {
  var scope = $('modal') || document;
  var tabs = scope.querySelectorAll('[data-sheet-tab]');
  for (var i = 0; i < tabs.length; i += 1) {
    if (tabs[i].getAttribute('data-sheet-tab') !== key) continue;
    try { tabs[i].focus({ preventScroll: true }); } catch (e) { try { tabs[i].focus(); } catch (e2) { return false; } }
    return true;
  }
  return false;
}

function uiBindTabs(handler) {
  uiBind('[data-sheet-tab]', 'click', function (node) {
    var key = node.getAttribute('data-sheet-tab');
    handler(key);
    // 面板重渲染后把焦点还给当前 tab，避免焦点停在已失效的旧节点上
    uiFocusTab(key);
  });
  uiBind('[data-sheet-tab]', 'keydown', function (node, e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    var tabs = Array.prototype.slice.call(node.parentNode.querySelectorAll('[data-sheet-tab]'));
    if (!tabs.length) return;
    var idx = tabs.indexOf(node);
    var next = idx;
    if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    e.preventDefault();
    var key = tabs[next].getAttribute('data-sheet-tab');
    handler(key);
    uiFocusTab(key);
  });
}

function uiPanelTop() {
  var body = $('modal-body');
  if (body) body.scrollTop = 0;
}

function uiSnapshotPanel() {
  var body = $('modal-body');
  return {
    scrollTop: body ? body.scrollTop : 0,
    focus: typeof uiFocusToken === 'function' ? uiFocusToken(document.activeElement) : null,
  };
}

function uiRestorePanel(snap) {
  if (!snap) return;
  var body = $('modal-body');
  if (body) body.scrollTop = snap.scrollTop || 0;
  if (snap.focus && typeof uiRestoreFocus === 'function') uiRestoreFocus(snap.focus);
}

// 给各面板手写的 .sheet-tabs 补上基础 ARIA（不要求调用方重写模板）
function uiEnhanceTabs(root) {
  if (!root) return;
  Array.prototype.forEach.call(root.querySelectorAll('.sheet-tabs'), function (bar) {
    bar.setAttribute('role', 'tablist');
    var activeKey = '';
    var activeTab = null;
    Array.prototype.forEach.call(bar.querySelectorAll('.sheet-tab'), function (tab) {
      var on = tab.classList.contains('active');
      var key = tab.getAttribute('data-sheet-tab') || String(tab.textContent || '').trim();
      var safe = key.replace(/[^a-zA-Z0-9_-]/g, '-');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (!tab.id) tab.id = 'sheet-tab-' + safe;
      if (on) {
        tab.setAttribute('data-autofocus', '1');
        tab.setAttribute('aria-controls', 'sheet-panel-' + safe);
        activeKey = safe;
        activeTab = tab;
      } else {
        tab.removeAttribute('data-autofocus');
        tab.removeAttribute('aria-controls');
      }
    });
    if (!activeTab) return;
    var page = bar.parentNode ? bar.parentNode.querySelector('.sheet-page') : null;
    if (page) {
      page.id = 'sheet-panel-' + activeKey;
      page.setAttribute('role', 'tabpanel');
      page.setAttribute('aria-labelledby', activeTab.id);
    }
  });
  Array.prototype.forEach.call(root.querySelectorAll('.sheet-page'), function (panel) {
    if (!panel.hasAttribute('role')) panel.setAttribute('role', 'tabpanel');
  });
}
