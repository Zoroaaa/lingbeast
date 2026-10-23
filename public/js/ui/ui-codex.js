// 灵兽录 · 界面层 · 灵兽录与行囊
// ---------- 灵兽录 / 山海志 ----------
function milestoneText(pct, flag, text) {
  return '<span class="seal-chip' + (flag ? '' : ' muted') + '">' + pct + '% · ' + uiEsc(text) + (flag ? ' · 已达' : ' · 未达') + '</span>';
}

function bestiaryCardHtml(spid) {
  var s = LB.saveState();
  var sp = SPECIES[spid];
  if (!sp) return '';
  var b = (s.bestiary && s.bestiary[spid]) || {};
  var known = !!b.seen;
  var r = rarityOf(sp);
  var gi = growthInfo(sp);
  var marks = '';
  if (known && b.caught) marks += '<span class="seal-chip">已契</span>';
  if (known && b.defeated) marks += '<span class="seal-chip">已遇</span>';
  if (known && sp.evolved) marks += '<span class="seal-chip">进化</span>';
  // 未见过的灵兽不泄露立绘，只留一枚问号印
  var art = known ? beastSvg(sp.art, sp.el) : '<span class="beast-unknown">?</span>';
  // 稀有度始终显示：未见的灵兽只封住立绘，不封住卡框，让收藏目标有层次
  var badge = '<span class="rarity-badge" title="稀有度 ' + sp.rarity + ' · ' + r.name + '">' + sp.rarity + '</span>';
  return '<article class="beast-card r-' + sp.rarity + (known ? '' : ' locked') + '" data-codex-beast="' + uiEsc(spid) + '" role="button" tabindex="0" style="--el:' + uiElOf(sp.el).color + ';--rar:' + r.color + ';--rar-soft:' + r.soft + '">' +
    '<div class="beast-head">' +
    '<div class="beast-art-wrap">' + art + badge + '</div>' +
    '<div class="beast-title"><b>' + uiEsc(known ? sp.name : '未识之灵') + '</b><span>' +
    uiEsc(known ? uiElOf(sp.el).ch + ' · ' + sp.habitat : '尚未显影') + '</span>' +
    (known ? '<span class="growth-line gr-' + gi.rank + '">成长 ' + gi.rank + ' · 每级 +' + gi.total + '</span>' : '') +
    '</div>' +
    '</div>' +
    (marks ? '<div class="beast-stats">' + marks + '</div>' : '') +
    '</article>';
}

function codexEntryHtml(e, key) {
  if (!e.unlocked) {
    if (key === 'chron') {
      return '<li class="codex-node locked-node"><span class="codex-dot"></span><span class="codex-lock-line">未解 · 墨渍未干</span></li>';
    }
    return '<article class="codex-card locked"><span class="codex-lock-seal">墨</span><span class="codex-lock-text">未解</span></article>';
  }
  var body = '<h4>' + uiEsc(e.title) + '</h4><p>' + uiEsc(e.body) + '</p>';
  if (key === 'chron') {
    return '<li class="codex-node"><span class="codex-dot"></span><article class="codex-card">' + body + '</article></li>';
  }
  if (key === 'elem') {
    return '<article class="codex-card elem"><span class="codex-glyph">' + uiEsc(e.title.charAt(0)) + '</span>' + body + '</article>';
  }
  if (key === 'person') {
    return '<article class="codex-card person"><span class="codex-seal">' + uiEsc(e.title.charAt(0)) + '</span>' + body + '</article>';
  }
  return '<article class="codex-card">' + body + '</article>';
}

function codexPageHtml(entries) {
  var cats = ['年表', '五灵', '山门', '势力', '地理', '术语', '人物'];
  var keys = { '年表': 'chron', '五灵': 'elem', '山门': 'sect', '势力': 'faction', '地理': 'geo', '术语': 'term', '人物': 'person' };
  var unlocked = 0;
  entries.forEach(function (e) { if (e.unlocked) unlocked += 1; });
  var html = '<div class="sheet-bar">山海志 · 已解锁 <b>' + unlocked + '</b>/' + entries.length + '</div>';
  cats.forEach(function (cat) {
    var group = entries.filter(function (e) { return e.category === cat; });
    if (!group.length) return;
    var key = keys[cat] || 'term';
    var inner = group.map(function (e) { return codexEntryHtml(e, key); }).join('');
    var wrap;
    if (key === 'chron') wrap = '<ol class="codex-timeline">' + inner + '</ol>';
    else if (key === 'elem') wrap = '<div class="codex-elem-grid">' + inner + '</div>';
    else if (key === 'person') wrap = '<div class="codex-person-grid">' + inner + '</div>';
    else if (key === 'geo') wrap = '<div class="codex-geo-grid">' + inner + '</div>';
    else wrap = '<div class="codex-term-list">' + inner + '</div>';
    html += '<section class="codex-group cat-' + key + '"><h4>' + uiEsc(cat) + '<i>' + group.length + '</i></h4>' + wrap + '</section>';
  });
  return html;
}

function renderCodex(active) {
  var s = LB.saveState();
  if (!s) return;
  var prog = LB.bestiaryProgress();
  if (prog.pct >= 25 && !LB.codexUnlocked('shiershanmen')) {
    LB.revealCodex('shiershanmen');
    LB.persist();
  }

  var tab = active === 'codex' ? 'codex' : 'bestiary';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'bestiary' ? ' active' : '') + '" data-sheet-tab="bestiary">灵兽录</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'codex' ? ' active' : '') + '" data-sheet-tab="codex">山海志</button>' +
    '</div>';

  var body = tabs;
  if (tab === 'bestiary') {
    var counts = {};
    RARITY_ORDER.forEach(function (k) { counts[k] = 0; });
    Object.keys(SPECIES).forEach(function (id) {
      var rr = SPECIES[id].rarity || 'B';
      counts[rr] = (counts[rr] || 0) + 1;
    });
    var legend = RARITY_ORDER.slice().reverse().map(function (k) {
      return '<span class="rar-legend r-' + k + '"><i>' + k + '</i><b>' + counts[k] + '</b></span>';
    }).join('');
    body += '<div class="sheet-bar bestiary-progress">' +
      '<span>图鉴 <b>' + prog.seen + '</b>/' + prog.total + ' · ' + prog.pct + '%</span>' +
      '<div class="progress-track"><i style="width:' + prog.pct + '%"></i></div>' +
      '<div class="rar-legend-row">' + legend + '</div>' +
      '<div class="milestone-row">' +
      milestoneText(25, LB.flag('bestiary_25'), '灵玉 +20 · 十二山门') +
      milestoneText(50, LB.flag('bestiary_50'), '灵玉 +30 · 灵符 +3') +
      milestoneText(75, LB.flag('bestiary_75'), '灵玉 +50 · 坚甲') +
      milestoneText(100, LB.flag('bestiary_100'), '灵玉 +120 · 契心') +
      '</div></div>';
    body += '<section class="sheet-page">';
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(function (el) {
      var group = Object.keys(SPECIES).filter(function (id) { return SPECIES[id].el === el; });
      if (!group.length) return;
      body += '<section class="quest-block"><h4>' + uiEsc(uiElOf(el).ch) + ' · 五灵</h4>' +
        '<div class="sheet-list beast-grid">' +
        group.map(bestiaryCardHtml).join('') +
        '</div></section>';
    });
    body += '</section>';
  } else {
    var entries = LB.codexEntries();
    body += '<section class="sheet-page">' + codexPageHtml(entries) + '</section>';
  }

  LB.openModal(tab === 'bestiary' ? '灵兽录 · 山海图鉴' : '山海志 · 九嶂纪事', body, uiCloseFoot());
  uiBind('[data-sheet-tab]', 'click', function (node) { renderCodex(node.getAttribute('data-sheet-tab')); });
  uiBind('[data-codex-beast]', 'click', function (node) {
    openBeastDetail(node.getAttribute('data-codex-beast'), function () { renderCodex('bestiary'); }, '返回图鉴');
  });
  uiBindClose();
}

function openCodex(tab) {
  if (!uiStateOrToast()) return;
  renderCodex(tab === 'codex' ? 'codex' : 'bestiary');
}

function openBeastDetail(spid, back, backLabel) {
  var s = uiStateOrToast();
  if (!s) return;
  var sp = SPECIES[spid];
  if (!sp) return;
  var b = (s.bestiary && s.bestiary[spid]) || {};
  var known = !!b.seen;
  var body;
  if (!known) {
    body = '<section class="beast-detail locked">' +
      '<div class="beast-detail-art">' + beastSvg(sp.art, sp.el, true) + '</div>' +
      '<h3 class="beast-detail-name">未识之灵</h3>' +
      '<p class="sheet-note">尚未在九嶂见过此灵。见过、击败或结契之后，条目才会显影。</p>' +
      '</section>';
  } else {
    var st = uiStatsOf({ sp: spid, lv: 1, talent: 1 });
    var rar = rarityOf(sp);
    var gi = growthInfo(sp);
    var skills = (sp.sk || []).map(function (entry) {
      var sk = SKILLS[entry[1]];
      if (!sk) return '';
      return '<span class="mat-chip" style="--el:' + uiElOf(sk.el).color + '">' + uiEsc(sk.name) + ' <i>Lv.' + entry[0] +
        (sk.power ? ' · 威 ' + sk.power : '') + '</i></span>';
    }).join('');
    var growthCells = [['气血', gi.hp], ['攻击', gi.atk], ['防御', gi.def], ['速度', gi.spd]].map(function (g) {
      return '<li><i>' + g[0] + '</i><b>+' + g[1] + '</b></li>';
    }).join('');
    body = '<section class="beast-detail r-' + sp.rarity + '" style="--el:' + uiElOf(sp.el).color + ';--rar:' + rar.color + ';--rar-soft:' + rar.soft + '">' +
      '<div class="beast-detail-art">' + beastSvg(sp.art, sp.el, true) + '</div>' +
      '<div class="beast-detail-name">' + sealSvg(sp.name, sp.el) + '<b>' + uiEsc(sp.name) + '</b>' +
      '<span class="rarity-badge lg" title="稀有度 ' + sp.rarity + ' · ' + rar.name + '">' + sp.rarity + '</span></div>' +
      '<div class="rarity-line">稀有度 ' + sp.rarity + ' · ' + rar.name + ' · 属性 ×' + rar.mult.toFixed(2) + '</div>' +
      '<div class="growth-panel">' +
      '<div class="growth-rank gr-' + gi.rank + '"><b>' + gi.rank + '</b><span>成长资质</span></div>' +
      '<ul class="growth-list">' + growthCells + '</ul>' +
      '<p class="growth-total">每级合计<br><b>+' + gi.total + '</b></p>' +
      '</div>' +
      '<div class="beast-stats">' + uiElChip(sp.el) +
      '<span>栖息地：' + uiEsc(sp.habitat) + '</span>' +
      '<span>弱点：' + uiEsc(uiElOf(sp.weakness).ch) + '</span>' +
      '<span>' + (sp.wild ? '野外可结契' : (sp.evolved ? '进化形态' : '特殊形态')) + '</span>' +
      '<span>基础气血 ' + st.hp + ' · 攻 ' + st.atk + ' · 防 ' + st.def + ' · 速 ' + st.spd + '</span>' +
      '</div>' +
      '<div class="beast-skills">' + (skills || '无术法记录') + '</div>' +
      '<p class="codex-text">' + uiEsc(sp.codex || sp.flavor || '') + '</p>' +
      '<p class="trait-line">' + uiEsc(uiEvolveLine({ sp: spid, lv: 1 })) + '</p>' +
      '</section>';
  }
  LB.openModal(known ? sp.name : '未识之灵', body,
    '<button type="button" class="btn-sm plain" data-close="1">合上</button>' +
    '<button type="button" class="btn-sm solid" data-detail-back="1">' + uiEsc(backLabel || '返回图鉴') + '</button>');
  uiBind('[data-detail-back]', 'click', function () { if (typeof back === 'function') back(); });
  uiBindClose();
}

// ---------- 行囊 ----------
function itemButton(id) {
  var s = LB.saveState();
  var count = LB.itemCount(id);
  var it = ITEMS[id];
  var lead = s.team[0];
  var leadMax = lead ? uiStatsOf(lead).hp : 0;
  if (it.use === 'heal') {
    if (count <= 0) return { label: '使用', disabled: true, title: '行囊中无此物' };
    if (!lead || lead.hp >= leadMax) return { label: '使用', disabled: true, title: '首发气血已满' };
    return { label: '使用', disabled: false, title: '' };
  }
  if (it.use === 'cleanse') {
    if (count <= 0) return { label: '使用', disabled: true, title: '行囊中无此物' };
    if (!lead || !Object.keys(lead.statuses || {}).length) return { label: '使用', disabled: true, title: '首发并无负面状态' };
    return { label: '使用', disabled: false, title: '' };
  }
  if (it.use === 'incense') {
    if (count <= 0) return { label: '使用', disabled: true, title: '行囊中无此物' };
    if (s.flags && s.flags.incenseArmed) return { label: '使用', disabled: true, title: '引灵香已在焚' };
    return { label: '使用', disabled: false, title: '' };
  }
  if (it.use === 'upgrade') return { label: '灵兽栏中用', disabled: true, title: '在灵兽栏升级灵笼' };
  if (it.battle) return { label: '战斗中用', disabled: true, title: '仅可在战斗中使用' };
  return { label: '暂不可用', disabled: true, title: it.desc };
}

function useItem(id, rerender) {
  var s = LB.saveState();
  var it = ITEMS[id];
  if (!s || !it) return;
  if (LB.itemCount(id) <= 0) { LB.toast('行囊中无此物'); return; }
  var lead = s.team[0];
  if (it.use === 'heal') {
    var max = lead ? uiStatsOf(lead).hp : 0;
    if (!lead || lead.hp >= max) { LB.toast('首发气血已满'); return; }
    lead.hp = Math.min(max, lead.hp + (it.value || 0));
  } else if (it.use === 'cleanse') {
    if (!lead || !Object.keys(lead.statuses || {}).length) { LB.toast('首发并无负面状态'); return; }
    lead.statuses = {};
  } else if (it.use === 'incense') {
    if (s.flags.incenseArmed) { LB.toast('引灵香已在焚'); return; }
    s.flags.incenseArmed = true;
  } else {
    LB.toast(it.desc);
    return;
  }
  LB.consumeItem(id, 1);
  LB.persist();
  LB.toast(it.use === 'incense' ? '引灵香已燃 · 下一场遭遇生效' : '用了 · ' + it.name);
  LB.updateHud();
  if (typeof rerender === 'function') rerender();
}

function materialsHtml() {
  var html = '<div class="sheet-list">';
  Object.keys(MATERIALS).forEach(function (id) {
    var m = MATERIALS[id];
    var count = LB.matCount(id);
    html += '<div class="sheet-row">' +
      '<div class="sheet-main"><b>' + uiEsc(m.name) + '</b> <span class="seal-chip">×' + count + '</span>' +
      '<p>' + uiEsc(m.desc) + '</p></div>' +
      '<span class="price">售价 ' + m.price + '</span>' +
      '<span class="seal-chip">可出售</span>' +
      '</div>';
  });
  html += '</div>';
  return html;
}

function recipeRowHtml(rec) {
  if (!rec) return '';
  var unlocked = LB.hasRecipe(rec.id);
  var out = ITEMS[rec.out.item];
  var matsHtml = (rec.mats || []).map(function (m) {
    var have = LB.matCount(m.id);
    var short = have < m.count;
    return '<span class="mat-chip' + (short ? ' short' : '') + '">' +
      uiEsc(MATERIALS[m.id] ? MATERIALS[m.id].name : m.id) + ' ' + have + '/' + m.count + '</span>';
  }).join('');
  var enough = (rec.mats || []).every(function (m) { return LB.matCount(m.id) >= m.count; });
  var can = unlocked && enough && (LB.jade() >= rec.jade);
  var reason = !unlocked ? unlockText(rec) : (!enough ? '材料不足' : (LB.jade() < rec.jade ? '灵玉不足' : ''));
  return '<div class="craft-row sheet-card">' +
    '<div class="sheet-main"><b>' + uiEsc(rec.name) + '</b> ' + (unlocked ? '<span class="seal-chip">已解锁</span>' : '<span class="seal-chip muted">未解锁</span>') +
    '<p>产物：' + uiEsc(out ? out.name : rec.out.item) + ' ×' + rec.out.count + '</p>' +
    '<div class="mat-row">' + matsHtml + '<span class="price">灵玉 ' + rec.jade + '</span></div>' +
    (reason ? '<p class="sheet-note">' + uiEsc(reason) + '</p>' : '') +
    '</div>' +
    '<button type="button" class="btn-sm ' + (can ? 'solid' : 'plain') + '" data-craft="' + uiEsc(rec.id) + '"' +
    (can ? '' : ' disabled title="' + uiEsc(reason || '尚不可制') + '"') + '>' +
    (unlocked ? '制作' : '未解锁') + '</button>' +
    '</div>';
}

function unlockText(rec) {
  var u = rec.unlock || { kind: 'start' };
  if (u.kind === 'start') return '初始即得';
  if (u.kind === 'quest') {
    var q = null;
    SIDE_QUESTS.forEach(function (item) { if (item.id === u.id) q = item; });
    return '完成支线「' + (q ? q.title : u.id) + '」';
  }
  if (u.kind === 'codex') {
    return '解锁山海志「' + (CODEX[u.id] ? CODEX[u.id].title : u.id) + '」';
  }
  if (u.kind === 'stele') {
    var found = null;
    Object.keys(REGIONS).forEach(function (rid) {
      (REGIONS[rid].steles || []).forEach(function (st) {
        if (st.id === u.id) found = { region: rid, stele: st };
      });
    });
    return found ? '拓印「' + found.stele.title + '」（' + REGIONS[found.region].name + '）' : '拓印碑文';
  }
  return '尚未得其法';
}

function craftRecipe(id, rerender) {
  var rec = RECIPES[id];
  if (!rec) return;
  if (!LB.hasRecipe(id)) { LB.toast('尚未得此方 · ' + unlockText(rec)); return; }
  var missing = null;
  (rec.mats || []).forEach(function (m) {
    if (missing) return;
    if (LB.matCount(m.id) < m.count) missing = MATERIALS[m.id] ? MATERIALS[m.id].name : m.id;
  });
  if (missing) { LB.toast('缺少' + missing); return; }
  if (LB.jade() < rec.jade) { LB.toast('灵玉不足 · 需 ' + rec.jade); return; }
  (rec.mats || []).forEach(function (m) { LB.consumeMaterial(m.id, m.count); });
  LB.spendJade(rec.jade);
  LB.giveItem(rec.out.item, rec.out.count);
  LB.persist();
  LB.toast('炼成 · ' + (ITEMS[rec.out.item] ? ITEMS[rec.out.item].name : rec.out.item) + ' ×' + rec.out.count);
  LB.updateHud();
  if (typeof rerender === 'function') rerender();
}

function renderBag(active) {
  var s = LB.saveState();
  if (!s) return;
  var tab = active === 'materials' || active === 'recipes' || active === 'gear' ? active : 'items';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'items' ? ' active' : '') + '" data-sheet-tab="items">道具</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'materials' ? ' active' : '') + '" data-sheet-tab="materials">材料</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'gear' ? ' active' : '') + '" data-sheet-tab="gear">灵器</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'recipes' ? ' active' : '') + '" data-sheet-tab="recipes">配方</button>' +
    '</div>';
  var bar = '<div class="sheet-bar">灵玉 <b>' + (s.jade || 0) + '</b> · 灵兽栏 <b>' + s.storage.length + '/' + LB.storageCap() + '</b></div>';
  var page = '';

  if (tab === 'items') {
    page = '<div class="sheet-list">';
    Object.keys(ITEMS).forEach(function (id) {
      var it = ITEMS[id];
      var btn = itemButton(id);
      page += '<div class="sheet-row">' +
        '<div class="sheet-main"><b>' + uiEsc(it.name) + '</b> <span class="seal-chip">×' + LB.itemCount(id) + '</span>' +
        '<p>' + uiEsc(it.desc) + '</p></div>' +
        '<button type="button" class="btn-sm ' + (btn.disabled ? 'plain' : 'solid') + '" data-use-item="' + uiEsc(id) + '"' +
        (btn.disabled ? ' disabled title="' + uiEsc(btn.title) + '"' : '') + '>' + uiEsc(btn.label) + '</button>' +
        '</div>';
    });
    page += '</div>';
  } else if (tab === 'materials') {
    page = materialsHtml() + '<p class="sheet-note">材料可在山门货铺与归墟行商出售，丹房也需用它们。</p>';
  } else if (tab === 'gear') {
    page = gearBagHtml() + '<p class="sheet-note">灵器在队伍或灵兽栏中装备；出售只影响未装备的灵器。</p>';
  } else {
    var ids = Object.keys(RECIPES).sort(function (a, b) {
      return (LB.hasRecipe(b) ? 1 : 0) - (LB.hasRecipe(a) ? 1 : 0);
    });
    page = '<div class="sheet-list">' + ids.map(function (id) { return recipeRowHtml(RECIPES[id]); }).join('') + '</div>';
  }

  LB.openModal('行囊 · 契者之囊', tabs + bar + '<section class="sheet-page">' + page + '</section>', uiCloseFoot());
  uiBind('[data-sheet-tab]', 'click', function (node) { renderBag(node.getAttribute('data-sheet-tab')); });
  uiBind('[data-use-item]', 'click', function (node) {
    useItem(node.getAttribute('data-use-item'), function () { renderBag('items'); });
  });
  uiBind('[data-craft]', 'click', function (node) {
    craftRecipe(node.getAttribute('data-craft'), function () { renderBag('recipes'); });
  });
  if (tab === 'gear' && typeof bindGearBagActions === 'function') {
    bindGearBagActions(function () { renderBag('gear'); });
  }
  uiBindClose();
}

function openBag() {
  if (!uiStateOrToast()) return;
  renderBag('items');
}
