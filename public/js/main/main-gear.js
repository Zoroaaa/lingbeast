// 灵兽录 · 主控层 · 灵器背包、装备与出售

function gearPrice(id) {
  const def = GEAR[id];
  if (!def) return 0;
  const rarity = GEAR_RARITY[def.rarity];
  return rarity ? rarity.sell : 40;
}

function gearOwned(id) {
  if (!state || !GEAR[id]) return false;
  if ((state.gearBag || []).some(function (entry) { return entry && entry.id === id; })) return true;
  const lists = [state.team || [], state.storage || []];
  for (let i = 0; i < lists.length; i += 1) {
    for (let j = 0; j < lists[i].length; j += 1) {
      const gear = lists[i][j] && lists[i][j].gear;
      if (!gear) continue;
      const slots = Object.keys(GEAR_SLOTS);
      for (let k = 0; k < slots.length; k += 1) {
        const ref = gear[slots[k]];
        if (ref && ref.id === id) return true;
      }
    }
  }
  return false;
}

function nextGearUid() {
  state.gearSeq = (Number(state.gearSeq) || 0) + 1;
  return 'g' + state.gearSeq.toString(36) + Date.now().toString(36);
}

function giveGear(id, silent) {
  if (!state || !GEAR[id]) return false;
  const def = GEAR[id];
  if (def.unique && gearOwned(id)) {
    const jade = gearPrice(id);
    giveJade(jade);
    if (!silent) toast('已有「' + def.name + '」· 化作灵玉 +' + jade);
    return false;
  }
  if (!Array.isArray(state.gearBag)) state.gearBag = [];
  state.gearBag.push({ uid: nextGearUid(), id: id });
  if (!silent) toast('得灵器 · ' + def.name);
  updateHud();
  return true;
}

function gearBagList() {
  if (!state || !Array.isArray(state.gearBag)) return [];
  return state.gearBag.map(function (entry) {
    return { uid: entry.uid, id: entry.id, def: GEAR[entry.id] };
  }).filter(function (entry) { return !!entry.def; });
}

function gearBagIndexOf(uid) {
  if (!state || !Array.isArray(state.gearBag)) return -1;
  for (let i = 0; i < state.gearBag.length; i += 1) {
    if (state.gearBag[i].uid === uid) return i;
  }
  return -1;
}

function clampMonHp(mon) {
  if (!mon) return;
  const max = statsOf(mon.sp, mon.lv, mon).hp;
  mon.hp = Math.max(0, Math.min(max, Number(mon.hp) || 0));
}

function equipGear(mon, uid) {
  if (!state || !mon || !mon.gear) return { ok: false, msg: '灵兽不可辨' };
  const idx = gearBagIndexOf(uid);
  if (idx < 0) return { ok: false, msg: '行囊中无此器' };
  const entry = state.gearBag[idx];
  const def = GEAR[entry.id];
  if (!def) return { ok: false, msg: '此器不可辨' };
  const slot = def.slot;
  const old = mon.gear[slot];
  state.gearBag.splice(idx, 1);
  if (old && old.uid) state.gearBag.push(old);
  mon.gear[slot] = { uid: entry.uid, id: entry.id };
  clampMonHp(mon);
  persist();
  updateHud();
  return { ok: true, msg: '已佩「' + def.name + '」' };
}

function unequipGear(mon, slot) {
  if (!state || !mon || !mon.gear || !mon.gear[slot]) return { ok: false, msg: '此槽未佩' };
  const ref = mon.gear[slot];
  const def = GEAR[ref.id];
  if (!Array.isArray(state.gearBag)) state.gearBag = [];
  state.gearBag.push({ uid: ref.uid, id: ref.id });
  mon.gear[slot] = null;
  clampMonHp(mon);
  persist();
  updateHud();
  return { ok: true, msg: '已卸下「' + (def ? def.name : '灵器') + '」' };
}

function sellGear(uid) {
  if (!state) return { ok: false, msg: '无存档' };
  const idx = gearBagIndexOf(uid);
  if (idx < 0) return { ok: false, msg: '行囊中无此器' };
  const entry = state.gearBag[idx];
  const def = GEAR[entry.id];
  if (!def) return { ok: false, msg: '此器不可辨' };
  const price = gearPrice(entry.id);
  state.gearBag.splice(idx, 1);
  giveJade(price);
  persist();
  updateHud();
  return { ok: true, msg: '售出「' + def.name + '」· 灵玉 +' + price };
}
