// 灵兽录 · 界面层 · 灵器面板与行囊灵器页

function gearSlotDef(slot) {
  return (typeof GEAR_SLOTS !== 'undefined' && GEAR_SLOTS[slot]) || { name: slot, ch: '器' };
}

function gearRowHtml(entry, mon, slot, equipped) {
  const def = entry.def || GEAR[entry.id];
  if (!def) return '';
  const r = uiRarityOf(def.rarity);
  const mods = uiGearModsText(def.mods);
  const setText = uiGearSetText(def);
  return '<div class="sheet-row">' +
    '<div class="sheet-main">' +
    '<b>' + uiEsc(def.name) + '</b> ' +
    '<span class="gear-chip" style="--rarity:' + r.color + '">' + uiEsc(r.label) + '</span> ' +
    '<span class="seal-chip">' + uiEsc(gearSlotDef(def.slot).name) + '</span>' +
    '<p class="gear-mods">' + uiEsc(mods) + '</p>' +
    (setText ? '<p class="gear-set">' + uiEsc(setText) + '</p>' : '') +
    '<p class="sheet-note">' + uiEsc(def.desc || '') + '</p>' +
    '</div>' +
    (equipped
      ? '<button type="button" class="btn-sm plain" data-gear-unequip="' + uiEsc(slot) + '">卸下</button>'
      : '<button type="button" class="btn-sm solid" data-gear-equip="' + uiEsc(entry.uid) + '">装备</button>') +
    '</div>';
}

function renderGearPicker(mon, back) {
  if (!mon) return;
  const slots = Object.keys(GEAR_SLOTS);
  const total = typeof gearEffect === 'function' ? gearEffect(mon) : {};
  const totalText = uiGearModsText(total);
  const sets = typeof gearSetCount === 'function' ? gearSetCount(mon) : {};
  let setText = '';
  Object.keys(sets).forEach(function (sid) {
    const set = GEAR_SETS[sid];
    if (!set) return;
    if (sets[sid] >= (set.need || 2)) setText += '<span class="gear-set">' + uiEsc(set.name) + ' 已生效</span>';
  });

  let body = '<div class="gear-panel-head">' +
    '<span class="seal-chip">' + uiEsc(SPECIES[mon.sp] ? SPECIES[mon.sp].name : '灵兽') + '</span>' +
    '<span class="seal-chip">' + uiEsc(uiElOf(SPECIES[mon.sp] ? SPECIES[mon.sp].el : 'wood').ch) + '</span>' +
    (totalText ? '<span class="gear-mods">合计：' + uiEsc(totalText) + '</span>' : '<span class="sheet-note">尚未佩灵器</span>') +
    (setText ? '<span class="seal-chip-row">' + setText + '</span>' : '') +
    '</div><section class="sheet-page">';

  slots.forEach(function (slot) {
    const cur = mon.gear ? mon.gear[slot] : null;
    const curDef = cur ? GEAR[cur.id] : null;
    const list = gearBagList().filter(function (entry) {
      return entry.def && entry.def.slot === slot && (!cur || entry.uid !== cur.uid);
    });
    body += '<div class="gear-slot-block"><h4>' + uiEsc(gearSlotDef(slot).name) + ' · ' + uiEsc(gearSlotDef(slot).ch) + '</h4>';
    if (curDef) {
      body += gearRowHtml({ uid: cur.uid, id: cur.id, def: curDef }, mon, slot, true);
    } else {
      body += '<p class="sheet-note">此槽未佩。</p>';
    }
    if (list.length) {
      body += '<div class="gear-list">' + list.map(function (entry) {
        return gearRowHtml(entry, mon, slot, false);
      }).join('') + '</div>';
    } else {
      body += '<p class="sheet-note">行囊中没有可换的' + uiEsc(gearSlotDef(slot).name) + '。</p>';
    }
    body += '</div>';
  });
  body += '</section>';

  LB.openModal('灵器 · ' + (SPECIES[mon.sp] ? SPECIES[mon.sp].name : '灵兽') + '的契物',
    body,
    '<button type="button" class="btn-sm plain" data-gear-back="1">返回</button>');

  uiBind('[data-gear-equip]', 'click', function (node) {
    const res = LB.equipGear(mon, node.getAttribute('data-gear-equip'));
    LB.toast(res && res.msg ? res.msg : '未能佩上');
    renderGearPicker(mon, back);
  });
  uiBind('[data-gear-unequip]', 'click', function (node) {
    const res = LB.unequipGear(mon, node.getAttribute('data-gear-unequip'));
    LB.toast(res && res.msg ? res.msg : '未能卸下');
    renderGearPicker(mon, back);
  });
  uiBind('[data-gear-back]', 'click', function () {
    if (typeof back === 'function') back();
    else LB.closeModal();
  });
}

function openGearPicker(mon, back) {
  if (!uiStateOrToast()) return;
  renderGearPicker(mon, back);
}

function gearBagHtml() {
  const list = gearBagList();
  if (!list.length) {
    return '<p class="sheet-note">行囊中没有闲置灵器。灵器来自宝箱、Boss 首杀与剧情抉择；已佩的灵器在队伍或灵兽栏中查看。</p>';
  }
  let html = '<div class="sheet-list">';
  list.forEach(function (entry) {
    const def = entry.def;
    const r = uiRarityOf(def.rarity);
    const mods = uiGearModsText(def.mods);
    const setText = uiGearSetText(def);
    html += '<div class="sheet-row">' +
      '<div class="sheet-main">' +
      '<b>' + uiEsc(def.name) + '</b> ' +
      '<span class="gear-chip" style="--rarity:' + r.color + '">' + uiEsc(r.label) + '</span> ' +
      '<span class="seal-chip">' + uiEsc(gearSlotDef(def.slot).name) + '</span>' +
      '<p class="gear-mods">' + uiEsc(mods) + '</p>' +
      (setText ? '<p class="gear-set">' + uiEsc(setText) + '</p>' : '') +
      '<p class="sheet-note">' + uiEsc(def.desc || '') + '</p>' +
      '</div>' +
      '<span class="price">售 ' + LB.gearPrice(entry.id) + '</span>' +
      '<button type="button" class="btn-sm plain" data-sell-gear="' + uiEsc(entry.uid) + '">出售</button>' +
      '</div>';
  });
  html += '</div>';
  return html;
}

function bindGearBagActions(rerender) {
  uiBind('[data-sell-gear]', 'click', function (node) {
    const uid = node.getAttribute('data-sell-gear');
    const entry = gearBagList().filter(function (item) { return item.uid === uid; })[0];
    if (!entry) { LB.toast('行囊中无此器'); return; }
    const s = LB.saveState();
    function doSell() {
      const res = LB.sellGear(uid);
      LB.toast(res && res.msg ? res.msg : '未能售出');
      if (typeof rerender === 'function') rerender();
    }
    if (s && s.settings && s.settings.confirm) {
      uiConfirmAction('出售 · ' + entry.def.name,
        '此器将离开行囊，换回 ' + LB.gearPrice(entry.id) + ' 灵玉。',
        '出售', doSell, function () { if (typeof rerender === 'function') rerender(); });
    } else {
      doSell();
    }
  });
}
