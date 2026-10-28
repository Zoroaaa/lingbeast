// 灵兽录 · 界面层 · HUD、队伍与灵兽栏

// ---------- HUD ----------
function renderPartyMini(s) {
  var box = $('party-mini');
  if (!box) return;
  var html = '';
  var team = (s.team || []).slice(0, 3);
  team.forEach(function (mon) {
    var sp = SPECIES[mon.sp] || {};
    var st = uiStatsOf(mon);
    var el = uiElOf(sp.el);
    var label = (sp.name || '灵兽') + ' Lv.' + mon.lv + '，气血 ' + Math.max(0, mon.hp) + '/' + st.hp;
    html += '<button type="button" class="mini-mon' + (mon.hp <= 0 ? ' down' : '') + '" data-team-open="1" aria-label="' + uiEsc(label) + '" style="--el:' + el.color + ';--el-ink:' + (el.ink || el.color) + ';--el-soft:' + el.soft + '" title="' + uiEsc(sp.name) + '">' +
      '<span class="mini-el" aria-hidden="true">' + uiEsc(el.ch) + '</span>' +
      '<span class="mini-info"><b>' + uiEsc(sp.name || '灵兽') + '</b><i>Lv.' + mon.lv + '</i></span>' +
      '<span class="mini-bar" aria-hidden="true"><i style="width:' + uiPctOf(Math.max(0, mon.hp), st.hp) + '%"></i></span>' +
      '</button>';
  });
  for (var i = team.length; i < 3; i += 1) {
    html += '<button type="button" class="mini-mon empty" data-team-open="1" aria-label="空契位，待结契">' +
      '<span class="mini-el" aria-hidden="true">空</span>' +
      '<span class="mini-info"><b>契位</b><i>待结</i></span>' +
      '<span class="mini-bar" aria-hidden="true"><i style="width:0"></i></span>' +
      '</button>';
  }
  box.innerHTML = html;
  Array.prototype.forEach.call(box.querySelectorAll('[data-team-open]'), function (btn) {
    btn.addEventListener('click', function () { LB.openTeam(); });
  });
}

function renderHud() {
  var s = LB.saveState();
  var chapter = $('scene-chapter');
  var name = $('scene-name');
  var time = $('time-weather');
  var questTitle = $('quest-title');
  var questStep = $('quest-step');
  var jade = $('jade-count');
  var minimap = $('minimap-label');

  if (!s) {
    if (chapter) chapter.textContent = '';
    if (name) name.textContent = '';
    if (time) time.textContent = '';
    if (questTitle) questTitle.textContent = '';
    if (questStep) questStep.textContent = '';
    if (jade) jade.textContent = '0';
    if (minimap) minimap.textContent = '';
    var party = $('party-mini');
    if (party) party.innerHTML = '';
    return;
  }

  var r = REGIONS[s.region] || REGIONS.shanmen;
  if (chapter) chapter.textContent = s.region === 'shanmen' ? '中枢' : '第 ' + s.chapter + ' 章';
  if (name) name.textContent = r ? r.name : '';
  var phase = (s.time && TIME_PHASES[s.time.phase]) || TIME_PHASES.dawn;
  var weather = (r && WEATHERS[r.weather]) || WEATHERS.clear;
  if (time) time.textContent = phase.name + ' · ' + weather.name;
  if (jade) jade.textContent = String(s.jade || 0);
  if (minimap) minimap.textContent = r ? r.name : '';

  var mq = LB.mainQuestState ? LB.mainQuestState() : null;
  if (questTitle) questTitle.textContent = mq ? mq.title : '';
  var next = null;
  if (mq && mq.objectives) {
    for (var i = 0; i < mq.objectives.length; i += 1) {
      if (!mq.objectives[i].done) { next = mq.objectives[i]; break; }
    }
  }
  if (questStep) {
    if (next) questStep.textContent = next.text;
    else if (mq && mq.done) questStep.textContent = (s.postgame || LB.flag('boss_wuxiang')) ? '山海试炼已开' : '此章已了';
    else questStep.textContent = '';
  }

  renderPartyMini(s);
}

// ---------- 队伍 / 灵兽栏 ----------
function uiEvolveLine(mon) {
  var sp = SPECIES[mon.sp];
  if (!sp) return '';
  if (!sp.evolve) return '此灵已至形尽，不再化形。';
  var ev = sp.evolve;
  var mats = (ev.mats || []).map(function (m) {
    return (MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' ' + LB.matCount(m.id) + '/' + m.count;
  }).join(' · ');
  return '化形：Lv.' + ev.lv + ' → ' + (SPECIES[ev.to] ? SPECIES[ev.to].name : ev.to) + (mats ? ' · ' + mats : '');
}

function beastCardHtml(mon, index, place) {
  var sp = SPECIES[mon.sp];
  if (!sp) return '';
  var el = uiElOf(sp.el);
  var st = uiStatsOf(mon);
  var tal = uiTalentOf(mon.talent);
  var skills = uiLearnedSkills(mon);
  var skillLine = skills.length ? skills.map(function (id) {
    var sk = SKILLS[id];
    if (!sk) return '';
    var pw = sk.power && typeof skillPowerAt === 'function' ? '·威' + skillPowerAt(sk, mon.lv) : '';
    return uiEsc(sk.name + pw);
  }).join(' · ') : '尚未习得';
  var check = LB.canEvolve ? LB.canEvolve(mon) : { ok: false, msg: '' };
  var isLead = place === 'team' && index === 0;
  var passive = mon.passive && PASSIVES[mon.passive] ? PASSIVES[mon.passive] : null;

  var actions = '';
  if (place === 'team') {
    if (!isLead) actions += '<button type="button" class="btn-sm plain" data-lead="' + uiEsc(mon.uid) + '">设为首发</button>';
    actions += '<button type="button" class="btn-sm plain" data-store="' + uiEsc(mon.uid) + '">存入灵兽栏</button>';
    actions += '<button type="button" class="btn-sm ' + (check.ok ? 'solid' : 'plain') + '" data-evolve="' + uiEsc(mon.uid) + '"' +
      (check.ok ? '' : ' disabled title="' + uiEsc(check.msg) + '"') + '>进化</button>';
    actions += '<button type="button" class="btn-sm plain" data-passive="' + uiEsc(mon.uid) + '">灵诀</button>';
    actions += '<button type="button" class="btn-sm plain" data-gear="' + uiEsc(mon.uid) + '">灵器</button>';
  } else {
    actions += '<button type="button" class="btn-sm solid" data-take="' + uiEsc(mon.uid) + '">取出到队伍</button>';
    actions += '<button type="button" class="btn-sm plain" data-view="' + uiEsc(mon.uid) + '">查看</button>';
    actions += '<button type="button" class="btn-sm danger" data-release="' + uiEsc(mon.uid) + '">放归</button>';
  }

  return '<article class="beast-card" style="--el:' + el.color + ';--el-ink:' + (el.ink || el.color) + ';--el-soft:' + el.soft + '">' +
    '<div class="beast-head">' +
    beastSvg(mon.sp) +
    '<div class="beast-title"><b>' + uiEsc(sp.name) + '</b><span>Lv.' + mon.lv + ' · ' + uiEsc(el.ch) + '</span></div>' +
    (isLead ? '<span class="badge lead">首发</span>' : '') +
    '</div>' +
    '<div class="beast-stats">' +
    uiBarHtml(mon.hp, st.hp, 'beast-hp', '气血') +
    '<span>气血 ' + Math.max(0, mon.hp) + '/' + st.hp + '</span>' +
    '<span>攻 ' + st.atk + '</span><span>防 ' + st.def + '</span><span>速 ' + st.spd + '</span>' +
    '<span>资质 ' + tal.label + '</span><span>亲密 ' + (mon.bond || 0) + '</span>' +
    '</div>' +
    '<div class="beast-skills">技能：' + skillLine + '</div>' +
    '<div class="gear-line">灵器：' + uiGearSlotLineHtml(mon) + '</div>' +
    '<div class="trait-line">' + (passive ? '灵诀「' + uiEsc(passive.name) + '」· ' + uiEsc(passive.desc) : '灵诀：未佩') + '</div>' +
    '<div class="trait-line">' + uiEsc((sp.evolve && check.ok ? check.msg + '；' : '') + uiEvolveLine(mon)) + '</div>' +
    '<div class="beast-actions">' + actions + '</div>' +
    '</article>';
}

function cageHtml(s) {
  var lv = s.cageLevel || 1;
  var cap = LB.storageCap();
  var cost = LB.cageCost();
  var maxed = lv >= 5;
  var mats = (cost.mats || []).map(function (m) {
    return (MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' ' + LB.matCount(m.id) + '/' + m.count;
  }).join(' · ');
  var can = !maxed && (s.jade || 0) >= cost.jade && (cost.mats || []).every(function (m) { return LB.matCount(m.id) >= m.count; });
  return '<div class="sheet-bar cage-bar">' +
    '<span>灵笼 ' + lv + ' 阶 · 可容 ' + cap + ' 只</span>' +
    '<span class="sheet-note">' + (maxed ? '已至最稳' : '升至 ' + (lv + 1) + ' 阶：灵玉 ' + cost.jade + (mats ? ' · ' + uiEsc(mats) : '')) + '</span>' +
    '<button type="button" class="btn-sm ' + (can ? 'solid' : 'plain') + '" data-cage-upgrade="1"' +
    (can ? '' : ' disabled') + '>升级灵笼</button>' +
    '</div>';
}

function renderTeam(active, stable) {
  var s = LB.saveState();
  if (!s) return;
  var tab = active === 'storage' ? 'storage' : 'team';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'team' ? ' active' : '') + '" data-sheet-tab="team">队伍 ' + s.team.length + '/3</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'storage' ? ' active' : '') + '" data-sheet-tab="storage">灵兽栏 ' + s.storage.length + '/' + LB.storageCap() + '</button>' +
    '</div>';

  var list = '';
  if (tab === 'team') {
    list = '<div class="sheet-list">';
    s.team.forEach(function (mon, i) { list += beastCardHtml(mon, i, 'team'); });
    list += '</div>';
    if (stable) list += '<p class="sheet-note">在此可设首发、存入灵兽栏、进化与更换灵诀。队伍至少留一只同行。</p>';
  } else {
    list = '<div class="sheet-list">';
    if (!s.storage.length) list += '<p class="sheet-note">灵兽栏空着。队伍满员后结契的灵兽会安置在此。</p>';
    s.storage.forEach(function (mon) { list += beastCardHtml(mon, 0, 'storage'); });
    list += '</div>';
    list += '<p class="sheet-note">取出需队伍未满三只；放归会解除灵契，但图鉴记录保留。</p>';
  }

  LB.openModal(stable ? '灵兽栏 · 纳契之所' : '队伍 · 契灵之册',
    tabs + '<section class="sheet-page">' +
      list + '</section>' + cageHtml(s),
    uiCloseFoot());

  uiBindTabs(function (tab) {
    renderTeam(tab, stable);
    uiPanelTop();
  });

  uiBind('[data-lead]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-lead'));
    var st = LB.saveState();
    if (!found || !st) return;
    var idx = st.team.indexOf(found.mon);
    if (idx < 0) return;
    st.team.splice(idx, 1);
    st.team.unshift(found.mon);
    LB.persist();
    LB.updateHud();
    LB.toast('首发已换 · ' + (SPECIES[found.mon.sp] ? SPECIES[found.mon.sp].name : ''));
    renderTeam(tab, stable);
  });

  uiBind('[data-store]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-store'));
    var st = LB.saveState();
    if (!found || !st) return;
    if (st.team.length <= 1) { LB.toast('至少留一只同行'); return; }
    if (st.storage.length >= LB.storageCap()) { LB.toast('灵兽栏已满 · 先升级灵笼'); return; }
    var idx = st.team.indexOf(found.mon);
    if (idx < 0) return;
    st.team.splice(idx, 1);
    st.storage.push(found.mon);
    LB.persist();
    LB.updateHud();
    LB.toast('已存入灵兽栏');
    renderTeam(tab, stable);
  });

  uiBind('[data-take]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-take'));
    var st = LB.saveState();
    if (!found || !st) return;
    if (st.team.length >= 3) { LB.toast('队伍已满三只'); return; }
    var idx = st.storage.indexOf(found.mon);
    if (idx < 0) return;
    st.storage.splice(idx, 1);
    st.team.push(found.mon);
    LB.persist();
    LB.updateHud();
    LB.toast('已取出 · ' + (SPECIES[found.mon.sp] ? SPECIES[found.mon.sp].name : ''));
    renderTeam(tab, stable);
  });

  uiBind('[data-view]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-view'));
    if (!found) return;
    openBeastDetail(found.mon.sp, function () { renderTeam(tab, stable); }, '返回灵兽栏');
  });

  uiBind('[data-release]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-release'));
    var st = LB.saveState();
    if (!found || !st) return;
    var nm = SPECIES[found.mon.sp] ? SPECIES[found.mon.sp].name : '灵兽';
    function doRelease() {
      if (typeof GEAR_SLOTS !== 'undefined') {
        Object.keys(GEAR_SLOTS).forEach(function (slot) {
          if (found.mon.gear && found.mon.gear[slot]) LB.unequipGear(found.mon, slot);
        });
      }
      var i = st.storage.indexOf(found.mon);
      if (i >= 0) st.storage.splice(i, 1);
      LB.persist();
      LB.updateHud();
      LB.toast('「' + nm + '」已归山');
      renderTeam(tab, stable);
    }
    if (st.settings && st.settings.confirm) {
      uiConfirmAction('放归 · ' + nm, '「' + nm + '」将解除灵契回到山中。图鉴记录会保留，但此灵不再随行。',
        '放归', doRelease, function () { renderTeam(tab, stable); }, true);
    } else {
      doRelease();
    }
  });

  uiBind('[data-evolve]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-evolve'));
    if (!found) return;
    var check = LB.canEvolve(found.mon);
    if (!check.ok) { LB.toast(check.msg); return; }
    var res = LB.evolveMon(found.mon);
    if (res && res.ok) {
      LB.persist();
      LB.toast(res.msg);
      LB.updateHud();
    }
    renderTeam(tab, stable);
  });

  uiBind('[data-passive]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-passive'));
    if (!found) return;
    openPassivePicker(found.mon, function () { renderTeam(tab, stable); });
  });

  uiBind('[data-gear]', 'click', function (node) {
    var found = uiFindMon(node.getAttribute('data-gear'));
    if (!found) return;
    openGearPicker(found.mon, function () { renderTeam(tab, stable); });
  });

  uiBind('[data-cage-upgrade]', 'click', function () {
    var res = LB.upgradeCage();
    LB.toast(res && res.msg ? res.msg : '灵笼未能再固');
    if (res && res.ok) LB.persist();
    renderTeam(tab, stable);
  });

  uiBindClose();
}

function openTeam(tab) {
  if (!uiStateOrToast()) return;
  if (typeof tutorialEvent === 'function') tutorialEvent('team:open');
  renderTeam(tab === 'storage' ? 'storage' : 'team', false);
}

function openStable() {
  if (!uiStateOrToast()) return;
  renderTeam('storage', true);
}

function openPassivePicker(mon, back) {
  var s = LB.saveState();
  if (!s) return;
  var snap = typeof uiSnapshotPanel === 'function' ? uiSnapshotPanel() : null;
  var backToTeam = function () {
    if (typeof back === 'function') back();
    if (typeof uiRestorePanel === 'function') uiRestorePanel(snap);
  };
  var owned = Object.keys(PASSIVES).filter(function (id) { return LB.hasPassive(id); });
  var rows = '';
  if (!owned.length) {
    rows = '<p class="sheet-note">尚未得任何灵诀。图鉴里程碑、支线与碑文会赠予灵诀。</p>';
  } else {
    rows = '<div class="sheet-list">';
    owned.forEach(function (id) {
      var p = PASSIVES[id];
      var equipped = mon.passive === id;
      rows += '<div class="sheet-row">' +
        '<div class="sheet-main"><b>' + uiEsc(p.name) + '</b><p>' + uiEsc(p.desc) + '</p></div>' +
        '<button type="button" class="btn-sm ' + (equipped ? 'plain' : 'solid') + '" data-passive-pick="' + uiEsc(id) + '"' +
        (equipped ? ' disabled' : '') + '>' + (equipped ? '已佩' : '装备') + '</button>' +
        '</div>';
    });
    rows += '</div>';
  }
  var current = mon.passive && PASSIVES[mon.passive] ? PASSIVES[mon.passive] : null;
  var foot = (current ? '<button type="button" class="btn-sm danger" data-passive-clear="1">卸下灵诀</button>' : '') +
    '<button type="button" class="btn-sm plain" data-passive-back="1">返回</button>';
  LB.openModal('灵诀 · ' + (SPECIES[mon.sp] ? SPECIES[mon.sp].name : '灵兽'),
    '<p class="sheet-note">当前：' + (current ? '「' + uiEsc(current.name) + '」· ' + uiEsc(current.desc) : '未佩灵诀') + '</p>' + rows,
    foot);

  uiBind('[data-passive-pick]', 'click', function (node) {
    var id = node.getAttribute('data-passive-pick');
    if (!PASSIVES[id]) return;
    mon.passive = id;
    LB.persist();
    LB.toast('已佩灵诀 · ' + PASSIVES[id].name);
    LB.updateHud();
    backToTeam();
  });
  uiBind('[data-passive-clear]', 'click', function () {
    mon.passive = null;
    LB.persist();
    LB.toast('灵诀已卸下');
    LB.updateHud();
    backToTeam();
  });
  uiBind('[data-passive-back]', 'click', backToTeam);
}
