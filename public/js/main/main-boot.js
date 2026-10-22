// 灵兽录 · 主控层 · 开局、云端、输入与对外 API
// ---------- 标题与开局 ----------
function startGame(fresh) {
  if (fresh) {
    state = freshState();
    migratedNote = false;
    persist();
    enterRegion('shanmen', REGIONS.shanmen.spawn, { title: true });
    showDialog('旁白', [
      '你背着一只旧灵笼，走进青溪山门。',
      '三十年前这里站满人，如今只剩一盏灯、一位老丈和满阶落叶。',
      '老丈说，想重开山门，先去青溪谷，让守谷灵认你。',
    ]);
    return;
  }
  if (!state) state = loadLocal();
  if (!state) { toast('没有存档 · 只可入山'); return; }
  persist();
  if (migratedNote) {
    toast('旧契已续 · 存档已迁至山海新契');
    migratedNote = false;
  }
  enterRegion(state.region, state.pos, { title: true });
  updateHud();
}

function backToTitle() {
  persist();
  closeModal();
  showView('view-title');
  pauseWorld();
  updateHud();
  refreshTitle();
}

// ---------- 云端账号（沿用旧协议） ----------
function adoptCloud(entry, quiet) {
  if (!entry || !entry.payload) {
    if (!quiet) toast('云端暂无存档');
    return;
  }
  let obj = null;
  let legacy = false;
  try {
    const raw = JSON.parse(entry.payload);
    legacy = !!(raw && raw.v !== 3);
    obj = migrate(raw);
  } catch (e) { obj = null; }
  if (!obj) {
    if (!quiet) toast('云端存档无法读取');
    return;
  }
  migratedNote = legacy;
  const localAt = state ? (state.updatedAt || 0) : 0;
  if (state && (obj.updatedAt || 0) <= localAt) {
    if (!quiet) toast('云端进度不新 · 继续本地');
    return;
  }
  state = obj;
  const world = byId('view-world');
  if (world && !world.hidden) enterRegion(state.region, state.pos, { title: false });
  updateHud();
  refreshTitle();
  toast('已采用云端较新进度');
}

function openAccountModal(tab) {
  if (!window.Cloud) { toast('云端未接 · 可单机游玩'); return; }
  if (Cloud.online) {
    openModal('道号',
      '<div class="account-panel"><p class="eyebrow">已登录</p><h4>' + Cloud.username + '</h4>' +
      '<p class="note">灵兽与进度会在落笔后自动同步云端，换设备登录同一道号即可续玩。</p>' +
      '<div class="account-state"><span class="dot online"></span>云端已连接</div></div>',
      '<button class="btn-sm plain" id="acc-sync">立即同步</button>' +
      '<button class="btn-sm danger" id="acc-logout">登出</button>' +
      '<button class="btn-sm solid" id="acc-close">合上</button>');
    const close = byId('acc-close');
    if (close) close.addEventListener('click', closeModal);
    const logout = byId('acc-logout');
    if (logout) logout.addEventListener('click', async function () {
      await Cloud.logout();
      closeModal();
      toast('已登出 · 仍可单机续玩');
      updateHud();
    });
    const sync = byId('acc-sync');
    if (sync) sync.addEventListener('click', async function () {
      const r = await Cloud.pull();
      if (r.ok && r.save) adoptCloud(r.save);
      else toast('云端同步失败 · 暂用本地');
    });
    return;
  }

  const isReg = tab === 'register';
  openModal('道号 · 云端存档',
    '<div class="auth-tabs">' +
    '<button class="auth-tab' + (isReg ? '' : ' active') + '" data-tab="login">登录</button>' +
    '<button class="auth-tab' + (isReg ? ' active' : '') + '" data-tab="register">注册</button></div>' +
    '<form id="auth-form" class="auth-form">' +
    '<label><span>道号</span><input id="auth-name" autocomplete="username" maxlength="20" placeholder="3-20 位中文、字母或数字"></label>' +
    '<label><span>密语</span><input id="auth-pass" type="password" autocomplete="current-password" maxlength="64" placeholder="至少 6 位"></label>' +
    '<p class="auth-msg" id="auth-msg"></p>' +
    '<button class="btn-sm solid" type="submit" id="auth-submit">' + (isReg ? '立契' : '入山') + '</button>' +
    '</form><p class="note">未登录也可完整游玩。登录后进度自动同步云端。</p>',
    '<button class="btn-sm plain" id="acc-close">合上</button>');
  const closeBtn = byId('acc-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  let mode = isReg ? 'register' : 'login';
  const body = byId('modal-body');
  if (body) {
    Array.prototype.forEach.call(body.querySelectorAll('[data-tab]'), function (b) {
      b.addEventListener('click', function () { openAccountModal(b.getAttribute('data-tab')); });
    });
  }
  const form = byId('auth-form');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = byId('auth-name').value.trim();
    const pass = byId('auth-pass').value;
    const msg = byId('auth-msg');
    msg.textContent = '灵息交缠……';
    msg.className = 'auth-msg';
    const fn = mode === 'register' ? Cloud.register : Cloud.login;
    const r = await fn(name, pass);
    if (!r.ok) {
      msg.textContent = r.error || '失败，请再试';
      msg.className = 'auth-msg error';
      return;
    }
    msg.textContent = '已连上云端';
    msg.className = 'auth-msg ok';
    updateHud();
    const pulled = await Cloud.pull();
    if (pulled.ok && pulled.save) adoptCloud(pulled.save);
    else persist();
    setTimeout(function () {
      closeModal();
      toast('云端已连接 · ' + (Cloud.username || ''));
    }, 480);
  });
}

function attachAccount() {
  if (!window.Cloud) return;
  Cloud.init();
  Cloud.onChange(function () { updateHud(); });
  Cloud.setConflictHandler(function () { toast('云端有较新进度 · 下次进入将采用'); });
  if (Cloud.online) {
    Cloud.pull().then(function (r) {
      if (bootSyncDone) return;
      bootSyncDone = true;
      if (r.ok && r.save) adoptCloud(r.save, true);
    }).catch(function () {});
  }
}

// ---------- 输入 ----------
function on(id, evt, fn) {
  const el = byId(id);
  if (el) el.addEventListener(evt, fn);
}

function interactNearby() {
  if (isBlocked()) return;
  const sc = window.World && typeof World.scene === 'function' ? World.scene() : null;
  if (!sc) return;
  if (typeof sc.interactNearby === 'function') sc.interactNearby();
  else if (typeof sc.talkNearby === 'function') sc.talkNearby();
}

function bindUi() {
  on('btn-start', 'click', function () {
    if (state || hasStoredSave()) {
      confirmModal('另有旧途', '本地已有进度。入山会重新起笔，旧存档将被覆盖。', '重新起笔', function () {
        startGame(true);
      }, true);
      return;
    }
    startGame(true);
  });
  on('btn-continue', 'click', function () { startGame(false); });
  on('btn-map', 'click', function () { invokeUi('openMap'); });
  on('btn-codex', 'click', function () { invokeUi('openCodex', 'bestiary'); });
  on('btn-bag', 'click', function () { invokeUi('openBag'); });
  on('btn-quests', 'click', function () { invokeUi('openQuests'); });
  on('btn-team', 'click', function () { invokeUi('openTeam'); });
  on('btn-save', 'click', function () { invokeUi('openSave'); });
  on('btn-settings', 'click', function () { invokeUi('openSettings'); });
  on('btn-exit', 'click', function () {
    persist();
    confirmModal('出山', '进度已落笔。要回到标题吗？', '回标题', function () { backToTitle(); });
  });
  on('btn-talk', 'click', interactNearby);
  on('btn-interact', 'click', interactNearby);
  on('btn-back-title', 'click', function () { backToTitle(); });
  on('btn-postgame', 'click', function () { postgameEnter(); });
  on('account-chip', 'click', function () { openAccountModal('login'); });
  on('dialog-next', 'click', function () { advanceDialog(); });
  on('modal-close', 'click', function () { closeModal(); });

  const dialogBox = byId('dialog');
  if (dialogBox) {
    dialogBox.addEventListener('click', function (e) {
      if (e.target === dialogBox) advanceDialog();
    });
  }
  const modal = byId('modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (activeDialog) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advanceDialog(); }
      return;
    }
    if (e.key === 'Escape') {
      if (modalOpen()) { e.preventDefault(); closeModal(); }
      return;
    }
    if (isBlocked()) return;
    const k = e.key;
    if (k === 'm' || k === 'M') { e.preventDefault(); invokeUi('openMap'); return; }
    if (k === 'b' || k === 'B') { e.preventDefault(); invokeUi('openCodex', 'bestiary'); return; }
    if (k === 'i' || k === 'I') { e.preventDefault(); invokeUi('openBag'); return; }
    if (k === 'j' || k === 'J') { e.preventDefault(); invokeUi('openQuests'); return; }
    if (k === 't' || k === 'T') { e.preventDefault(); invokeUi('openTeam'); return; }
    if (k === 'q' || k === 'Q') { e.preventDefault(); invokeUi('openSave'); return; }
    if (k === 'e' || k === 'E' || k === ' ') { e.preventDefault(); interactNearby(); }
  });

  window.addEventListener('beforeunload', function () { persist(); });
}

// ---------- 对外 API ----------
LB.saveState = function () { return state; };
LB.persist = function () { persist(); };
LB.loadLocal = function () { return loadLocal(); };
LB.newGame = function () { startGame(true); };
LB.isBlocked = isBlocked;
LB.showView = showView;
LB.statsOf = statsOf;
LB.skillsOf = skillsOf;
LB.expNeed = expNeed;
LB.newMon = newMon;

LB.story = story;
LB.setStory = setStory;
LB.chapterNow = story;
LB.flag = flag;
LB.flagSet = flagSet;

LB.region = region;
LB.regionDef = regionDef;
LB.regionUnlocked = regionUnlocked;
LB.travelTo = travelTo;
LB.tryExit = tryExit;
LB.setPosition = setPosition;
LB.enterRegion = enterRegion;
LB.updateHud = updateHud;

LB.toast = toast;
LB.showDialog = showDialog;
LB.advanceDialog = advanceDialog;
LB.openModal = openModal;
LB.closeModal = closeModal;
LB.refreshTitle = refreshTitle;
LB.backToTitle = backToTitle;

LB.jade = jade;
LB.giveJade = giveJade;
LB.spendJade = spendJade;
LB.itemCount = itemCount;
LB.giveItem = giveItem;
LB.consumeItem = consumeItem;
LB.matCount = matCount;
LB.giveMaterial = giveMaterial;
LB.consumeMaterial = consumeMaterial;
LB.hasRecipe = hasRecipe;
LB.giveRecipe = giveRecipe;
LB.hasPassive = hasPassive;
LB.givePassive = givePassive;

LB.giveMon = giveMon;
LB.canEvolve = canEvolve;
LB.evolveMon = evolveMon;
LB.bestiaryProgress = bestiaryProgress;
LB.bestiaryMark = bestiaryMark;
LB.codexEntries = codexEntries;
LB.codexUnlocked = codexUnlocked;
LB.revealCodex = revealCodex;
LB.stelesCount = stelesCount;
LB.trials = trials;
LB.trialCleared = trialCleared;

LB.mainQuestState = mainQuestState;
LB.sideQuestList = sideQuestList;
LB.acceptSideQuest = acceptSideQuest;
LB.checkSideQuests = checkSideQuests;
LB.sideQuestDoneCount = sideQuestDoneCount;
LB.bountyList = bountyList;
LB.acceptBounty = acceptBounty;
LB.bountyProgress = bountyProgress;
LB.bountyAdvanceBattle = bountyAdvanceBattle;
LB.claimBounty = claimBounty;

LB.gatherNode = gatherNode;
LB.collectHerb = collectHerb;
LB.openSecret = openSecret;
LB.readStele = readStele;
LB.openChest = openChest;
LB.talkTo = talkTo;
LB.bossTalk = bossTalk;
LB.handleService = handleService;

LB.startWildBattle = startWildBattle;
LB.startBossBattle = startBossBattle;
LB.startTrial = startTrial;
LB.returnToWorld = returnToWorld;
LB.defeatRetreat = defeatRetreat;
LB.defeatReload = defeatReload;
LB.openEndingChoice = openEndingChoice;
LB.showEnding = showEnding;

LB.storageCap = storageCap;
LB.upgradeCage = upgradeCage;
LB.cageCost = cageCost;
LB.maxLevel = MAX_LV;

LB.pauseWorld = pauseWorld;
LB.resumeWorld = function () { if (window.World && typeof World.resume === 'function') World.resume(); };
LB.onWorldReady = function () { updateHud(); };

// ---------- 启动 ----------
(function boot() {
  bindUi();
  attachAccount();
  const titleBeast = byId('title-beast');
  if (titleBeast && typeof beastSvg === 'function') titleBeast.innerHTML = beastSvg('fox', 'fire', true);
  state = loadLocal();
  showView('view-title');
  updateHud();
  refreshTitle();
  try {
    if (typeof validateContent === 'function') {
      const errs = validateContent();
      if (errs && errs.length) {
        console.error('[灵兽录] 内容校验发现 ' + errs.length + ' 处问题：\n' + errs.join('\n'));
      }
    }
  } catch (e) {
    console.error('[灵兽录] 内容校验异常', e);
  }
})();
