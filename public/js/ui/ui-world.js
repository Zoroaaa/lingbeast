// 灵兽录 · 界面层 · 山河图、设置、存档、试炼与任务
// ---------- 山河图 ----------
var MAP_POS = {
  shanmen: [13, 55],
  qingxi: [28, 66],
  wuyin: [42, 48],
  luoxing: [57, 31],
  guixu: [74, 45],
  yunmeng: [86, 62],
  gutan: [68, 80],
  shenyuan: [47, 90],
};

var MAP_LINKS = [
  ['shanmen', 'qingxi'], ['qingxi', 'wuyin'], ['wuyin', 'luoxing'], ['luoxing', 'guixu'],
  ['guixu', 'yunmeng'], ['yunmeng', 'gutan'], ['gutan', 'shenyuan'],
];

function renderWorldMap(selected) {
  var s = LB.saveState();
  if (!s) return;
  var here = LB.region();
  var sel = selected && MAP_POS[selected] ? selected : here;

  var lines = MAP_LINKS.map(function (pair) {
    var a = MAP_POS[pair[0]];
    var b = MAP_POS[pair[1]];
    return '<line class="map-link" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" />';
  }).join('');
  lines += '<line class="map-link faded" x1="' + MAP_POS.shanmen[0] + '" y1="' + MAP_POS.shanmen[1] +
    '" x2="' + MAP_POS.gutan[0] + '" y2="' + MAP_POS.gutan[1] + '" stroke-dasharray="2 2" />';

  var nodes = REGION_ORDER.map(function (id) {
    var r = REGIONS[id];
    if (!r || !MAP_POS[id]) return '';
    var pos = MAP_POS[id];
    var unlocked = LB.regionUnlocked(id);
    var current = id === here;
    var cls = 'map-node' + (unlocked ? '' : ' locked') + (current ? ' current' : '');
    var label = unlocked ? (r.chapter ? '第 ' + r.chapter + ' 章' : '中枢') : '';
    return '<g class="' + cls + '" data-node="' + uiEsc(id) + '" role="button" tabindex="0">' +
      '<rect class="map-node-dot" x="' + (pos[0] - 3) + '" y="' + (pos[1] - 3) + '" width="6" height="6" />' +
      '<text x="' + pos[0] + '" y="' + (pos[1] - 5.4) + '" text-anchor="middle">' + uiEsc(unlocked ? r.name : '雾') + '</text>' +
      (label ? '<text class="map-node-sub" x="' + pos[0] + '" y="' + (pos[1] + 7) + '" text-anchor="middle">' + uiEsc(label) + '</text>' : '') +
      '<title>' + uiEsc(r.name) + '</title>' +
      '</g>';
  }).join('');

  var sr = REGIONS[sel];
  var selUnlocked = LB.regionUnlocked(sel);
  var info = '<div class="map-info">';
  if (sr && selUnlocked) {
    info += '<b>' + uiEsc(sr.name) + '</b> <span class="seal-chip">' + uiEsc(uiRegionChapterText(sel)) + '</span>' +
      (sel === here ? ' <span class="seal-chip current">当前</span>' : '') +
      '<p>' + uiEsc(sr.subtitle || '') + '</p>';
    if (sel === here) {
      info += '<p class="sheet-note">已在此境。</p>';
    } else if (uiTravelAllowed()) {
      info += '<button type="button" class="btn-sm solid" data-map-go="' + uiEsc(sel) + '">前往</button>';
    } else {
      info += '<p class="sheet-note">需回山门或归墟渡口方可传送。</p>';
    }
  } else if (sr) {
    info += '<b>未点亮</b><p>' + uiEsc(uiRegionLockText(sel)) + '</p>';
  }
  info += '</div>';

  var body = '<div class="sheet-page">' +
    '<div class="world-map-wrap">' +
    '<svg class="world-map" viewBox="0 0 100 100" role="img" aria-label="九嶂山河图">' +
    '<g class="map-links">' + lines + '</g><g class="map-nodes">' + nodes + '</g></svg>' +
    '</div>' + info +
    '<div class="seal-chip-row">已点亮：' +
    REGION_ORDER.filter(function (id) { return LB.regionUnlocked(id); }).map(function (id) {
      return '<span class="seal-chip">' + uiEsc(uiRegionName(id)) + '</span>';
    }).join('') +
    '</div></div>';

  LB.openModal('山河图 · 九嶂', body,
    '<button type="button" class="btn-sm solid" data-map-travel-list="1">传送列表</button>' +
    '<button type="button" class="btn-sm plain" data-close="1">合上</button>');

  uiBind('[data-node]', 'click', function (node) { renderWorldMap(node.getAttribute('data-node')); });
  uiBind('[data-map-go]', 'click', function (node) {
    var id = node.getAttribute('data-map-go');
    LB.closeModal();
    LB.travelTo(id);
  });
  uiBind('[data-map-travel-list]', 'click', function () { LB.openTravel(); });
  uiBindClose();
}

function openMap() {
  if (!uiStateOrToast()) return;
  renderWorldMap(LB.region());
}

// ---------- 设置 ----------
function renderSettings() {
  var s = LB.saveState();
  if (!s) return;
  var settings = s.settings || {};
  var speeds = [['slow', '慢'], ['normal', '中'], ['fast', '快'], ['instant', '瞬']];
  var seg = '<div class="segmented">' + speeds.map(function (pair) {
    return '<button type="button" class="seg-btn' + (settings.textSpeed === pair[0] ? ' active' : '') + '" data-speed="' + pair[0] + '">' + pair[1] + '</button>';
  }).join('') + '</div>';

  function toggleRow(key, label, desc) {
    var on = !!settings[key];
    return '<div class="setting-row"><div class="sheet-main"><b>' + uiEsc(label) + '</b><p class="sheet-note">' + uiEsc(desc) + '</p></div>' +
      '<button type="button" class="toggle' + (on ? ' on' : '') + '" data-toggle="' + key + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
      (on ? '开' : '关') + '</button></div>';
  }

  var body = '<section class="sheet-page">' +
    '<div class="setting-row"><div class="sheet-main"><b>文字速度</b><p class="sheet-note">对白逐字显现的快慢。</p></div>' + seg + '</div>' +
    toggleRow('reduceMotion', '减少动效', '关闭大幅转场与漂浮动画，保留必要反馈。') +
    toggleRow('shake', '震屏', '技能命中与 Boss 换阶段时的镜头轻震。') +
    toggleRow('confirm', '确认提示', '放归等不可逆操作前再问一次。') +
    '<p class="sheet-note">设置写入本地存档，随云存档同步。</p>' +
    '</section>';

  LB.openModal('设置 · 契者之约', body, uiCloseFoot());
  uiBind('[data-speed]', 'click', function (node) {
    var st = LB.saveState();
    if (!st) return;
    st.settings.textSpeed = node.getAttribute('data-speed');
    LB.persist();
    LB.toast('设置已记下');
    renderSettings();
  });
  uiBind('[data-toggle]', 'click', function (node) {
    var st = LB.saveState();
    if (!st) return;
    var key = node.getAttribute('data-toggle');
    st.settings[key] = !st.settings[key];
    LB.persist();
    LB.toast('设置已记下');
    renderSettings();
  });
  uiBindClose();
}

function openSettings() {
  if (!uiStateOrToast()) return;
  renderSettings();
}

// ---------- 存档 ----------
function formatTime(ts) {
  if (!ts) return '未落笔';
  try {
    return new Date(ts).toLocaleString('zh-CN', { hour12: false });
  } catch (e) {
    return '未落笔';
  }
}

function renderSave() {
  var s = LB.saveState();
  if (!s) return;
  var r = REGIONS[s.region];
  var ch = MAIN_CHAPTERS[(s.chapter || 1) - 1];
  var bp = LB.bestiaryProgress();
  var sides = LB.sideQuestDoneCount();
  var cloud = window.Cloud;
  var online = !!(cloud && cloud.online);

  var body = '<section class="sheet-page save-panel">' +
    '<ul class="save-list">' +
    '<li>区域<b>' + uiEsc(r ? r.name : '') + '</b></li>' +
    '<li>章节<b>第 ' + s.chapter + ' 章 · ' + uiEsc(ch ? ch.title : '') + '</b></li>' +
    '<li>队伍<b>' + s.team.length + ' 只</b></li>' +
    '<li>图鉴<b>' + bp.seen + '/' + bp.total + '</b></li>' +
    '<li>支线<b>' + sides + '/' + SIDE_QUESTS.length + '</b></li>' +
    '<li>灵玉<b>' + (s.jade || 0) + '</b></li>' +
    '<li>落笔<b>' + uiEsc(formatTime(s.updatedAt)) + '</b></li>' +
    '</ul>' +
    '<p class="sheet-note">云存档：' + (online ? '已连接 · ' + uiEsc(cloud.username || '道号') : '未登录 · 仅本机') + '</p>' +
    '<p class="sheet-note">落笔后会先写本地，再自动同步云端；未登录也可完整游玩。</p>' +
    '</section>';

  LB.openModal('存档 · 落笔为凭', body,
    '<button type="button" class="btn-sm plain" data-open-account="1">打开账号</button>' +
    '<button type="button" class="btn-sm plain" data-open-settings="1">设置</button>' +
    '<button type="button" class="btn-sm plain" data-back-title="1">回标题</button>' +
    '<button type="button" class="btn-sm solid" data-save-now="1">落笔</button>');

  uiBind('[data-save-now]', 'click', function () {
    LB.persist();
    LB.toast('已落笔 · ' + formatTime(LB.saveState().updatedAt));
    renderSave();
  });
  uiBind('[data-open-account]', 'click', function () {
    var chip = $('account-chip');
    if (chip) chip.click();
  });
  uiBind('[data-open-settings]', 'click', function () { openSettings(); });
  uiBind('[data-back-title]', 'click', function () {
    var exit = $('btn-exit');
    if (exit) exit.click();
    else if (LB.backToTitle) LB.backToTitle();
  });
  uiBindClose();
}

function openSave() {
  if (!uiStateOrToast()) return;
  renderSave();
}

// ---------- 试炼 ----------
function renderTrials() {
  var s = LB.saveState();
  if (!s) return;
  var open = !!(s.postgame || LB.flag('boss_wuxiang'));
  if (!open) {
    LB.openModal('山海试炼 · 五层', '<p class="sheet-note">击败无相后开启。</p>', uiCloseFoot());
    uiBindClose();
    return;
  }
  var list = LB.trials();
  var cleared = list.filter(function (t) { return t.cleared; }).length;
  var body = '<div class="sheet-bar">已通关 <b>' + cleared + '</b>/' + list.length + '</div><section class="sheet-page"><div class="sheet-list">';
  list.forEach(function (t, i) {
    var available = t.cleared || i === 0 || LB.trialCleared(t.floor - 1);
    var status = t.cleared ? '<span class="seal-chip">已过</span>' : (available ? '<span class="seal-chip">可挑战</span>' : '<span class="seal-chip muted">未解锁</span>');
    var bossName = t.boss && BOSSES[t.boss.ref] ? BOSSES[t.boss.ref].name : '';
    body += '<div class="sheet-row">' +
      '<div class="sheet-main"><b>' + uiEsc(t.name) + '</b> ' + status +
      '<p>' + uiEsc(t.desc) + '</p>' +
      '<p class="sheet-note">规矩：' + uiEsc(t.rule) + '</p>' +
      '<p class="sheet-note">' + (bossName ? '对手：' + uiEsc(bossName) + (t.boss && t.boss.lv ? ' · Lv.' + t.boss.lv : '') + ' · ' : '') +
      '赏：' + uiEsc(uiRewardText(t.reward)) + '</p>' +
      (available ? '' : '<p class="sheet-note">先过第 ' + (t.floor - 1) + ' 层。</p>') +
      '</div>' +
      (available
        ? '<button type="button" class="btn-sm ' + (t.cleared ? 'plain' : 'solid') + '" data-trial="' + t.floor + '">' + (t.cleared ? '重温' : '开始') + '</button>'
        : '<button type="button" class="btn-sm plain" disabled>未解锁</button>') +
      '</div>';
  });
  body += '</div></section>';
  LB.openModal('山海试炼 · 五层', body, uiCloseFoot());
  uiBind('[data-trial]', 'click', function (node) {
    var floor = Number(node.getAttribute('data-trial')) || 1;
    LB.closeModal();
    LB.startTrial(floor);
  });
  uiBindClose();
}

function openTrials() {
  if (!uiStateOrToast()) return;
  renderTrials();
}

// ---------- 任务 ----------
function mainQuestHtml() {
  var mq = LB.mainQuestState();
  var html = '<div class="quest-block">' +
    '<h4>第 ' + mq.chapter + ' 章 · ' + uiEsc(mq.title) + '</h4>' +
    '<p class="sheet-note">' + uiEsc(mq.summary) + '</p><div class="sheet-list">';
  var activeMarked = false;
  (mq.objectives || []).forEach(function (o) {
    var cls = o.done ? ' done' : (!activeMarked ? ' active' : '');
    if (!o.done && !activeMarked) activeMarked = true;
    html += '<div class="quest-line' + cls + '"><span>' + (o.done ? '✓' : '·') + '</span>' + uiEsc(o.text) + '</div>';
  });
  if (mq.done) html += '<div class="quest-line done"><span>✓</span>' + ((LB.saveState().postgame || LB.flag('boss_wuxiang')) ? '山海试炼已开' : '此章已了') + '</div>';
  html += '</div></div>';
  return html;
}

function sideQuestHtml() {
  var list = LB.sideQuestList();
  var html = '<div class="sheet-list">';
  list.forEach(function (q) {
    var status;
    var action = '';
    if (q.rewarded) status = '<span class="quest-badge">已完成</span>';
    else if (!q.unlocked) {
      status = '<span class="quest-badge">未启</span>';
      action = '<button type="button" class="btn-sm plain" disabled>第 ' + q.unlockChapter + ' 章后可接</button>';
    } else if (!q.accepted) {
      status = '<span class="quest-badge">未接</span>';
      action = '<button type="button" class="btn-sm solid" data-accept-quest="' + uiEsc(q.id) + '">接取</button>';
    } else if (!q.done) {
      status = '<span class="quest-badge">进行中</span>';
      action = '<button type="button" class="btn-sm plain" disabled>尚未达成</button>';
    } else {
      status = '<span class="quest-badge">待领</span>';
      action = '<button type="button" class="btn-sm solid" data-claim-quest="' + uiEsc(q.id) + '">领取</button>';
    }
    html += '<div class="quest-block sheet-card">' +
      '<h4>' + uiEsc(q.title) + ' ' + status + '</h4>' +
      '<p class="sheet-note">' + uiEsc(uiGiverText(q.giver)) + '</p>' +
      '<p>' + uiEsc(q.desc) + '</p>' +
      '<div class="sheet-list">' + (q.stages || []).map(function (step) {
        var cls = step.done ? ' done' : (step.current ? ' active' : '');
        var mark = step.done ? '✓' : (step.current ? '▶' : '·');
        return '<div class="quest-line' + cls + '"><span>' + mark + '</span>' + uiEsc(step.text) + '</div>';
      }).join('') + '</div>' +
      (action ? '<div class="beast-actions">' + action + '</div>' : '') +
      '</div>';
  });
  html += '</div>';
  return html;
}

function renderQuests(active) {
  var s = LB.saveState();
  if (!s) return;
  var tab = active === 'side' || active === 'bounty' ? active : 'main';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'main' ? ' active' : '') + '" data-sheet-tab="main">主线</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'side' ? ' active' : '') + '" data-sheet-tab="side">支线 ' + LB.sideQuestDoneCount() + '/' + SIDE_QUESTS.length + '</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'bounty' ? ' active' : '') + '" data-sheet-tab="bounty">悬赏</button>' +
    '</div>';
  var page;
  if (tab === 'side') page = sideQuestHtml();
  else if (tab === 'bounty') page = bountyRowsHtml();
  else page = mainQuestHtml();

  LB.openModal('任务 · 山海契录', tabs + '<section class="sheet-page">' + page + '</section>',
    '<button type="button" class="btn-sm solid" data-track-main="1">追踪主线</button>' +
    '<button type="button" class="btn-sm plain" data-close="1">合上</button>');

  uiBind('[data-sheet-tab]', 'click', function (node) { renderQuests(node.getAttribute('data-sheet-tab')); });
  uiBind('[data-accept-quest]', 'click', function (node) {
    var id = node.getAttribute('data-accept-quest');
    LB.acceptSideQuest(id);
    LB.persist();
    renderQuests('side');
  });
  uiBind('[data-claim-quest]', 'click', function (node) {
    var id = node.getAttribute('data-claim-quest');
    LB.checkSideQuests();
    var after = null;
    LB.sideQuestList().forEach(function (q) { if (q.id === id) after = q; });
    if (!after || !after.rewarded) LB.toast('尚未达成 · 再走一步');
    renderQuests('side');
  });
  uiBind('[data-track-main]', 'click', function () {
    LB.closeModal();
    var mq = LB.mainQuestState();
    var next = null;
    (mq.objectives || []).forEach(function (o) { if (!next && !o.done) next = o; });
    LB.toast(next ? '追踪 · ' + mq.title + ' · ' + next.text : '主线已了 · ' + ((LB.saveState().postgame || LB.flag('boss_wuxiang')) ? '山海试炼已开' : '此章已了'));
  });
  if (tab === 'bounty') bindBountyActions(function () { renderQuests('bounty'); });
  uiBindClose();
}

function openQuests() {
  if (!uiStateOrToast()) return;
  renderQuests('main');
}
