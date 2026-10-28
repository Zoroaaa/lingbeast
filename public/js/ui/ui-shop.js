// 灵兽录 · 界面层 · 商店、丹房、悬赏与传送
// ---------- 商店 ----------
function renderShop(shop, active) {
  var s = LB.saveState();
  if (!s || !shop) return;
  var tab = active === 'sell' ? 'sell' : 'buy';
  var tabs = '<div class="sheet-tabs">' +
    '<button type="button" class="sheet-tab' + (tab === 'buy' ? ' active' : '') + '" data-sheet-tab="buy">购买</button>' +
    '<button type="button" class="sheet-tab' + (tab === 'sell' ? ' active' : '') + '" data-sheet-tab="sell">出售</button>' +
    '</div>';
  var repKey = shop.region === 'shanmen' ? 'shanmen' : (shop.region === 'guixu' ? 'guixu' : null);
  var repVal = repKey && LB.repOf ? LB.repOf(repKey) : 0;
  var bar = '<div class="sheet-bar">灵玉 <b>' + (s.jade || 0) + '</b>' +
    (repKey ? ' · 声望 <b>' + repVal + '</b>' + (repVal >= 2 ? ' · 九折' : '') : '') + '</div>';
  var page = '';

  if (tab === 'buy') {
    page = '<div class="sheet-list">';
    (shop.stock || []).forEach(function (st) {
      var isItem = !!ITEMS[st.item];
      var def = isItem ? ITEMS[st.item] : MATERIALS[st.item];
      if (!def) return;
      var basePrice = Number(st.price) || def.price || 0;
      var price = LB.shopPrice ? LB.shopPrice(shop.id, basePrice) : basePrice;
      var discounted = price < basePrice;
      var need = st.needChapter || 1;
      var locked = s.chapter < need;
      var owned = isItem ? LB.itemCount(st.item) : LB.matCount(st.item);
      page += '<div class="sheet-row shop-row">' +
        '<div class="sheet-main"><b>' + uiEsc(def.name) + '</b> <span class="seal-chip">已有 ' + owned + '</span>' +
        (discounted ? ' <span class="seal-chip">声望折价</span>' : '') +
        '<p>' + uiEsc(def.desc || '') + '</p></div>' +
        '<span class="price">' + price + '</span>' +
        (locked
          ? '<span class="quest-badge">第 ' + need + ' 章后可购</span>'
          : '<button type="button" class="btn-sm ' + ((s.jade || 0) >= price ? 'solid' : 'plain') + '" data-buy-item="' + uiEsc(st.item) + '" data-buy-kind="' + (isItem ? 'item' : 'mat') + '" data-buy-price="' + price + '"' +
            ((s.jade || 0) >= price ? '' : ' disabled title="灵玉不足"') + '>购入</button>') +
        '</div>';
    });
    page += '</div>';
  } else {
    var rows = [];
    Object.keys(ITEMS).forEach(function (id) {
      if (LB.itemCount(id) > 0) rows.push({ id: id, kind: 'item', def: ITEMS[id], count: LB.itemCount(id) });
    });
    Object.keys(MATERIALS).forEach(function (id) {
      if (LB.matCount(id) > 0) rows.push({ id: id, kind: 'mat', def: MATERIALS[id], count: LB.matCount(id) });
    });
    if (!rows.length) page = '<p class="sheet-note">行囊里没有可出售的物件。</p>';
    else {
      page = '<div class="sheet-list">';
      rows.forEach(function (row) {
        var sell = Math.floor((row.def.price || 0) * 0.5);
        page += '<div class="sheet-row shop-row">' +
          '<div class="sheet-main"><b>' + uiEsc(row.def.name) + '</b> <span class="seal-chip">×' + row.count + '</span>' +
          '<p>' + uiEsc(row.def.desc || '') + '</p></div>' +
          '<span class="price">售 ' + sell + '</span>' +
          '<button type="button" class="btn-sm plain" data-sell-item="' + uiEsc(row.id) + '" data-sell-kind="' + row.kind + '" data-sell-price="' + sell + '">出售</button>' +
          '</div>';
      });
      page += '</div>';
    }
  }

  LB.openModal(shop.name || '山门货铺', tabs + bar + '<section class="sheet-page">' + page + '</section>', uiCloseFoot());
  uiBindTabs(function (tab) {
    renderShop(shop, tab);
    uiPanelTop();
  });
  uiBind('[data-buy-item]', 'click', function (node) {
    var id = node.getAttribute('data-buy-item');
    var kind = node.getAttribute('data-buy-kind');
    var price = Number(node.getAttribute('data-buy-price')) || 0;
    if ((LB.jade() || 0) < price) { LB.toast('灵玉不足'); return; }
    if (!LB.spendJade(price)) { LB.toast('灵玉不足'); return; }
    if (kind === 'item') LB.giveItem(id, 1); else LB.giveMaterial(id, 1);
    LB.persist();
    LB.toast('购得 · ' + ((kind === 'item' ? ITEMS[id] : MATERIALS[id]) || {}).name);
    LB.updateHud();
    renderShop(shop, 'buy');
  });
  uiBind('[data-sell-item]', 'click', function (node) {
    var id = node.getAttribute('data-sell-item');
    var kind = node.getAttribute('data-sell-kind');
    var price = Number(node.getAttribute('data-sell-price')) || 0;
    if (kind === 'item') {
      if (!LB.consumeItem(id, 1)) { LB.toast('已无此物'); return; }
    } else if (!LB.consumeMaterial(id, 1)) { LB.toast('已无此物'); return; }
    LB.giveJade(price);
    LB.persist();
    LB.toast('售出 · 得灵玉 ' + price);
    LB.updateHud();
    renderShop(shop, 'sell');
  });
  uiBindClose();
}

function openShop(shopId) {
  if (!uiStateOrToast()) return;
  var shop = shopId && SHOPS[shopId] ? SHOPS[shopId] : null;
  if (!shop) {
    var here = LB.region();
    Object.keys(SHOPS).forEach(function (id) {
      if (!shop && SHOPS[id].region === here) shop = SHOPS[id];
    });
  }
  if (!shop) shop = SHOPS.shanmen_shop;
  if (!shop) { LB.toast('此地无货可售'); return; }
  renderShop(shop, 'buy');
}

// ---------- 丹房 ----------
function renderCraft() {
  var s = LB.saveState();
  if (!s) return;
  var ids = Object.keys(RECIPES).sort(function (a, b) {
    return (LB.hasRecipe(b) ? 1 : 0) - (LB.hasRecipe(a) ? 1 : 0);
  });
  var owned = ids.filter(function (id) { return LB.hasRecipe(id); }).length;
  var body = '<div class="sheet-bar">丹房 · 已得方 <b>' + owned + '</b>/' + ids.length + ' · 灵玉 <b>' + (s.jade || 0) + '</b></div>' +
    '<section class="sheet-page"><div class="sheet-list">' +
    ids.map(function (id) { return recipeRowHtml(RECIPES[id]); }).join('') +
    '</div></section>';
  LB.openModal('丹房 · 炉火未熄', body, uiCloseFoot());
  uiBind('[data-craft]', 'click', function (node) {
    craftRecipe(node.getAttribute('data-craft'), renderCraft);
  });
  uiBindClose();
}

function openCraft() {
  if (!uiStateOrToast()) return;
  renderCraft();
}

// ---------- 悬赏 ----------
var BOUNTY_TYPE = { hunt: '除妖', gather: '采集', patrol: '巡山' };

function bountyRowsHtml() {
  var rows = LB.bountyList();
  var html = '<div class="sheet-list">';
  rows.forEach(function (b) {
    var def = null;
    BOUNTIES.forEach(function (item) { if (item.id === b.id) def = item; });
    var type = BOUNTY_TYPE[b.type] || b.type;
    var target = b.type === 'gather'
      ? (MATERIALS[b.target] ? MATERIALS[b.target].name : b.target)
      : uiRegionName(b.target);
    var progress = b.progress || 0;
    var pct = uiPctOf(progress, b.count || 1);
    var status = '';
    var action = '';
    if (b.ready) {
      status = '<span class="quest-badge">可领取</span>';
      action = '<button type="button" class="btn-sm solid" data-claim-bounty="' + uiEsc(b.id) + '">领取</button>';
    } else if (b.active) {
      status = '<span class="quest-badge">进行中</span>';
      action = '<button type="button" class="btn-sm plain" disabled>待达成</button>';
    } else if (b.cooldown > 0) {
      status = '<span class="quest-badge">冷却 ' + b.cooldown + ' 场</span>';
      action = '<button type="button" class="btn-sm plain" disabled>冷却中</button>';
    } else {
      status = '<span class="quest-badge">可接取</span>';
      action = '<button type="button" class="btn-sm solid" data-accept-bounty="' + uiEsc(b.id) + '">接取</button>';
    }
    html += '<div class="sheet-row">' +
      '<div class="sheet-main"><b>' + uiEsc(b.title) + '</b> ' + status +
      '<p>' + uiEsc(b.desc) + '</p>' +
      '<div class="beast-stats"><span>' + uiEsc(type) + ' · ' + uiEsc(target) + ' · ' + progress + '/' + b.count + '</span></div>' +
      uiBarHtml(progress, b.count || 1, 'sheet-progress') +
      '<p class="sheet-note">赏：' + uiEsc(uiRewardText(def ? def.reward : b.reward)) + '</p></div>' +
      action +
      '</div>';
  });
  html += '</div>';
  return html;
}

function bindBountyActions(refresh) {
  var go = typeof refresh === 'function' ? refresh : renderBounty;
  uiBind('[data-accept-bounty]', 'click', function (node) {
    LB.acceptBounty(node.getAttribute('data-accept-bounty'));
    LB.persist();
    go();
  });
  uiBind('[data-claim-bounty]', 'click', function (node) {
    var r = LB.claimBounty(node.getAttribute('data-claim-bounty'));
    if (r && r.msg) LB.toast(r.msg);
    go();
  });
}

function renderBounty() {
  var s = LB.saveState();
  if (!s) return;
  var body = '<section class="sheet-page">' + bountyRowsHtml() +
    '<p class="sheet-note">战斗与采集会推进悬赏进度。悬赏按场次冷却，完成后再来可接。</p></section>';
  LB.openModal('山门悬赏 · 告示板', body, uiCloseFoot());
  bindBountyActions(renderBounty);
  uiBindClose();
}

function openBounty() {
  if (!uiStateOrToast()) return;
  renderBounty();
}

// ---------- 传送 ----------
function renderTravel() {
  var s = LB.saveState();
  if (!s) return;
  var here = LB.region();
  var html = '<p class="sheet-note">传送不耗灵玉，只往已点亮的区域。当前：' + uiEsc(uiRegionName(here)) + '</p>';
  html += '<div class="sheet-list">';
  REGION_ORDER.forEach(function (id) {
    var r = REGIONS[id];
    if (!r) return;
    var unlocked = LB.regionUnlocked(id);
    var current = id === here;
    html += '<div class="sheet-row">' +
      '<div class="sheet-main"><b>' + uiEsc(r.name) + '</b> ' +
      '<span class="seal-chip">' + uiEsc(uiRegionChapterText(id)) + '</span>' +
      (current ? '<span class="seal-chip current">当前</span>' : '') +
      '<p>' + uiEsc(r.subtitle || '') + '</p>' +
      (unlocked ? '' : '<p class="sheet-note">' + uiEsc(uiRegionLockText(id)) + '</p>') +
      '</div>' +
      (unlocked && !current
        ? '<button type="button" class="btn-sm solid" data-travel="' + uiEsc(id) + '">前往</button>'
        : (current
          ? '<button type="button" class="btn-sm plain" disabled>所在</button>'
          : '<button type="button" class="btn-sm plain" disabled>未点亮</button>')) +
      '</div>';
  });
  html += '</div>';
  LB.openModal('传送阵 · 一息千里', html, uiCloseFoot());
  uiBind('[data-travel]', 'click', function (node) {
    var id = node.getAttribute('data-travel');
    LB.closeModal();
    LB.travelTo(id);
  });
  uiBindClose();
}

function openTravel() {
  if (!uiStateOrToast()) return;
  if (!uiTravelAllowed()) { LB.toast('需回山门或归墟渡口'); return; }
  renderTravel();
}
