// 灵兽录 · 主控层 · 世界交互与 NPC
// ---------- 世界交互 ----------
function gatherNode(node) {
  if (!state || !node || activeDialog || battleActive()) return;
  if (!MATERIALS[node.mat]) return;
  if (!state.gathered) state.gathered = {};
  const rec = state.gathered[node.id];
  if (rec && rec.chapter === state.chapter) { toast('此地已采过'); return; }
  const amount = node.amount || 1;
  giveMaterial(node.mat, amount);
  state.gathered[node.id] = { chapter: state.chapter, at: Date.now(), region: state.region };
  const sc = window.World && typeof World.scene === 'function' ? World.scene() : null;
  if (sc && typeof sc.removeEntity === 'function') sc.removeEntity('gather', node.id);
  toast(node.label || ('拾得' + MATERIALS[node.mat].name + ' ×' + amount));
  bountyProgress('gather', { mat: node.mat, count: amount });
  persist();
  updateHud();
}

// 兼容旧 world.js 的草药实体
function collectHerb(herb) {
  if (!state || !herb || activeDialog || battleActive()) return;
  if (!MATERIALS[herb.mat]) return;
  if (!state.gathered) state.gathered = {};
  if (state.gathered[herb.id]) { toast('此地已采过'); return; }
  const amount = herb.amount || 1;
  giveMaterial(herb.mat, amount);
  state.gathered[herb.id] = { chapter: state.chapter, at: Date.now(), region: state.region };
  const sc = window.World && typeof World.scene === 'function' ? World.scene() : null;
  if (sc && typeof sc.removeEntity === 'function') sc.removeEntity('herb', herb.id);
  toast(herb.label || ('采得' + MATERIALS[herb.mat].name + ' ×' + amount));
  bountyProgress('gather', { mat: herb.mat, count: amount });
  persist();
  updateHud();
}

function openSecret(secret) {
  if (!state || !secret) return;
  if (flag('secret_' + secret.id)) { toast('此处已无暗格'); return; }
  flagSet('secret_' + secret.id, true);
  if (secret.jade) giveJade(secret.jade);
  if (secret.mat) giveMaterial(secret.mat, secret.count || 1);
  const sc = window.World && typeof World.scene === 'function' ? World.scene() : null;
  if (sc && typeof sc.removeEntity === 'function') sc.removeEntity('secret', secret.id);
  showDialog(secret.name, [secret.text], function () {
    toast('暗格已启 · 灵玉 +' + (secret.jade || 0) + (secret.mat ? ' · ' + (MATERIALS[secret.mat] ? MATERIALS[secret.mat].name : secret.mat) + ' +' + (secret.count || 1) : ''));
    persist();
    checkSideQuests();
  });
  persist();
  updateHud();
}

function readStele(stele) {
  if (!state || !stele || activeDialog || battleActive()) return;
  if (!state.steles) state.steles = {};
  state.steles[stele.id] = true;
  if (stele.id === 'wuyin_stele4') flagSet('jingdiOpen', true);
  revealCodex(stele.codex);
  Object.keys(RECIPES).forEach(function (rid) {
    const rec = RECIPES[rid];
    if (rec.unlock && rec.unlock.kind === 'stele' && rec.unlock.id === stele.id) giveRecipe(rid, true);
  });
  showDialog(stele.title, [stele.text]);
  persist();
  updateHud();
  checkSideQuests();
}

function openChest(chest) {
  if (!state || !chest || activeDialog || battleActive()) return;
  if (flag(chest.id)) return;
  if (chest.needFlag && !flag(chest.needFlag)) {
    toast(chest.lockedText || '此处尚不可开');
    return;
  }
  flagSet(chest.id, true);
  if (chest.jade) giveJade(chest.jade);
  (chest.items || []).forEach(function (it) {
    const n = it.count || 1;
    if (MATERIALS[it.id]) giveMaterial(it.id, n); else giveItem(it.id, n);
  });
  (chest.mats || []).forEach(function (m) { giveMaterial(m.id, m.count || 1); });
  if (chest.gear && typeof giveGear === 'function') giveGear(chest.gear);
  if (chest.flag) flagSet(chest.flag, true);
  if (chest.id === 'medicine_basket') flagSet('basket', true);
  if (chest.id === 'luoxing_chest1') flagSet('oldHammer', true);
  if (chest.id === 'gutan_chest1') flagSet('emberTaken', true);
  const sc = window.World && typeof World.scene === 'function' ? World.scene() : null;
  if (sc && typeof sc.removeEntity === 'function') sc.removeEntity('chest', chest.id);
  toast(chest.label || ('开启 · ' + (chest.name || '木箱')));
  persist();
  updateHud();
  checkSideQuests();
}

function payDebtModal() {
  confirmModal('旧账 · 归墟海市',
    '海市主把账本推过来：「三十年前，旧山门在这里欠了一笔。灵玉三十，清不清？」',
    '偿清 · 灵玉 30', function () {
      if (!spendJade(30)) { toast('灵玉不足 · 旧账未清'); return; }
      flagSet('debtPaid', true);
      toast('旧账已清 · 海市主合上账本');
      persist();
      updateHud();
      checkSideQuests();
    });
}

function afterTalk(npc) {
  if (!state || !npc) return;
  if (typeof npc.onTalk === 'function') {
    try { npc.onTalk(); } catch (e) { console.error('[灵兽录] NPC 回调失败', e); }
  }
  flagSet('talked_' + npc.id, true);

  Object.keys(CODEX).forEach(function (cid) {
    const c = CODEX[cid];
    if (c.unlock && c.unlock.type === 'npc' && c.unlock.id === npc.id) revealCodex(cid);
  });

  SIDE_QUESTS.forEach(function (q) {
    if (!q.giver || q.giver.npc !== npc.id) return;
    if (state.chapter < (q.unlockChapter || 1)) return;
    if (state.quests.side[q.id]) return;
    acceptSideQuest(q.id, true);
  });

  if (npc.id === 'haishi' && state.chapter >= 4 && !flag('debtPaid')) {
    payDebtModal();
  }
  if (npc.id === 'trial_guard' && flag('boss_wuxiang')) {
    flagSet('trialUnlocked', true);
    invokeUi('openTrials');
  }
  if (npc.id === 'gate_elder' && state.chapter >= 8) {
    flagSet('endingDone', true);
    toast('山门已重开 · 可继续游历、补完图鉴与试炼');
  }

  if (npc.service && npc.service !== 'main') handleService(npc.service);

  updateHud();
  persist();
  checkSideQuests();
  if (typeof LB.maybeOpenChoice === 'function') LB.maybeOpenChoice(npc);
}

function talkTo(npcId) {
  if (!state || activeDialog || battleActive()) return;
  const id = npcId && typeof npcId === 'object' ? npcId.id : npcId;
  if (!id) return;
  const r = REGIONS[state.region];
  if (!r) return;
  let npc = null;
  (r.npcs || []).forEach(function (n) { if (n.id === id) npc = n; });
  if (!npc) return;
  const lines = typeof npc.lines === 'function' ? npc.lines() : npc.lines;
  showDialog(npc.name, lines, function () { afterTalk(npc); });
}

function bossTalk(bossId) {
  if (!state || activeDialog || battleActive()) return;
  const id = bossId && typeof bossId === 'object' ? bossId.id : bossId;
  if (!id) return;
  if (flag('boss_' + id)) { toast('坛上灵息已散'); return; }
  const b = BOSSES[id];
  if (!b) return;
  showDialog(b.name, [b.line], function () { startBossBattle(id); });
}

function handleService(service) {
  if (!state || !service || service === 'main') return;
  if (service === 'shop') {
    let shop = null;
    Object.keys(SHOPS).forEach(function (id) { if (SHOPS[id].region === state.region) shop = SHOPS[id]; });
    if (!shop) shop = SHOPS.shanmen_shop;
    if (shop) invokeUi('openShop', shop.id); else toast('此地无货可售');
    return;
  }
  if (service === 'craft') { invokeUi('openCraft'); return; }
  if (service === 'stable') { invokeUi('openStable'); return; }
  if (service === 'bounty') { invokeUi('openBounty'); return; }
  if (service === 'travel') { invokeUi('openTravel'); return; }
  if (service === 'codex') { invokeUi('openCodex', 'codex'); return; }
}
