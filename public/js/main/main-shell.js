// 灵兽录 · 主控层 · 视图、对话、模态与阻塞
let activeChoice = null;

// ---------- 视图 / 提示 / 阻塞 ----------
function showView(id) {
  ['view-title', 'view-world', 'view-battle', 'view-end'].forEach(function (v) {
    const el = byId(v);
    if (el) el.hidden = v !== id;
  });
  if (typeof renderTutorial === 'function') renderTutorial();
  if (typeof processPendingCloudConflict === 'function') processPendingCloudConflict();
  if (typeof setHudMenu === 'function') setHudMenu(false);
  if (modalOpen()) return;
  const active = byId(id);
  if (!active) return;
  active.setAttribute('tabindex', '-1');
  try { active.focus({ preventScroll: true }); } catch (e) { try { active.focus(); } catch (e2) { /* 忽略 */ } }
  const names = { 'view-title': '标题', 'view-world': '探索', 'view-battle': '战斗', 'view-end': '结局' };
  if (typeof announce === 'function') announce(names[id] || '');
}

function toast(msg) {
  const el = byId('toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(function () { el.hidden = true; }, 3000);
}

function prefersReduceMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { return false; }
}

function effectiveReduceMotion() {
  return !!(state && state.settings && state.settings.reduceMotion) || prefersReduceMotion();
}

async function fadeTo(fn) {
  const f = byId('fade');
  if (effectiveReduceMotion() || !f) { fn(); return; }
  f.classList.add('on');
  await new Promise(function (r) { setTimeout(r, 380); });
  fn();
  await new Promise(function (r) { setTimeout(r, 160); });
  f.classList.remove('on');
}

function applyUiPreferences() {
  if (!document || !document.body) return;
  const settings = (state && state.settings) || {};
  document.documentElement.setAttribute('data-text-scale', settings.textScale === 'large' ? 'large' : 'normal');
  document.body.dataset.touchControls = settings.touchControls || 'auto';
  document.body.classList.toggle('reduce-motion', effectiveReduceMotion());
}

function applyMotionPreference() { applyUiPreferences(); }

function announce(text) {
  const live = byId('sr-live');
  if (!live) return;
  live.textContent = '';
  const msg = String(text || '');
  if (!msg) return;
  setTimeout(function () { live.textContent = msg; }, 30);
}

function battleActive() {
  return typeof battle !== 'undefined' && battle && !!battle.on;
}

function modalOpen() {
  const m = byId('modal');
  return !!(m && !m.hidden);
}

function isBlocked() {
  if (activeDialog) return true;
  if (activeChoice) return true;
  if (modalOpen()) return true;
  if (battleActive()) return true;
  const wv = byId('view-world');
  if (!wv || wv.hidden) return true;
  return false;
}

// ---------- 对话 ----------
function dialogDelay() {
  const sp = state && state.settings ? state.settings.textSpeed : 'normal';
  const d = TEXT_DELAYS[sp];
  return d === undefined ? 26 : d;
}

function clearChoiceBox() {
  const box = byId('dialog-choices');
  if (box) { box.hidden = true; box.innerHTML = ''; }
  const dlg = byId('dialog');
  if (dlg) dlg.classList.remove('choice-mode');
}

function showDialog(name, lines, done) {
  clearChoiceBox();
  const list = Array.isArray(lines) ? lines.slice() : [String(lines || '')];
  activeDialog = {
    name: name || '旁白',
    lines: list.length ? list : [''],
    i: 0,
    done: done || null,
    typing: false,
    timer: null,
    full: '',
  };
  const box = byId('dialog');
  if (!box) {
    const cb = activeDialog.done;
    activeDialog = null;
    if (cb) cb();
    return;
  }
  box.hidden = false;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-labelledby', 'dialog-name');
  box.setAttribute('aria-describedby', 'dialog-text');
  box.setAttribute('tabindex', '-1');
  try { box.focus({ preventScroll: true }); } catch (e) { box.focus(); }
  const nm = byId('dialog-name');
  if (nm) nm.textContent = activeDialog.name;
  const seal = byId('dialog-seal');
  if (seal) seal.innerHTML = sealSvg(activeDialog.name);
  showLine();
}

function showLine() {
  if (!activeDialog) return;
  const line = activeDialog.lines[activeDialog.i] || '';
  activeDialog.full = line;
  const el = byId('dialog-text');
  if (!el) return;
  clearInterval(activeDialog.timer);
  const finish = function () {
    activeDialog.typing = false;
    if (typeof announce === 'function') announce(activeDialog.name + '：' + line);
  };
  const delay = dialogDelay();
  if (!delay || !line.length) {
    el.textContent = line;
    finish();
    return;
  }
  el.textContent = '';
  activeDialog.typing = true;
  let n = 0;
  activeDialog.timer = setInterval(function () {
    n += 1;
    el.textContent = line.slice(0, n);
    if (n >= line.length) {
      clearInterval(activeDialog.timer);
      finish();
    }
  }, delay);
}

function showChoice(name, prompt, options, done, onPick) {
  const box = byId('dialog-choices');
  const dlg = byId('dialog');
  if (!box || !dlg) return;
  activeChoice = { options: options || [], done: done || null, onPick: onPick || null, picked: false };
  activeDialog = null;
  dlg.classList.add('choice-mode');
  dlg.hidden = false;
  dlg.setAttribute('role', 'dialog');
  dlg.setAttribute('aria-labelledby', 'dialog-name');
  dlg.setAttribute('aria-describedby', 'dialog-text');
  dlg.setAttribute('tabindex', '-1');
  const nm = byId('dialog-name');
  if (nm) nm.textContent = name || '旁白';
  const seal = byId('dialog-seal');
  if (seal) seal.innerHTML = sealSvg(name || '旁白');
  const text = byId('dialog-text');
  if (text) text.textContent = prompt || '';
  box.hidden = false;
  box.innerHTML = (options || []).map(function (opt, i) {
    return '<button type="button" class="dialog-choice" data-choice-index="' + i + '">' +
      '<b>' + (i + 1) + ' · ' + uiEsc(opt.label) + '</b>' +
      (opt.hint ? '<span>' + uiEsc(opt.hint) + '</span>' : '') +
      '</button>';
  }).join('');
  Array.prototype.forEach.call(box.querySelectorAll('[data-choice-index]'), function (btn) {
    btn.addEventListener('click', function () {
      pickChoice(Number(btn.getAttribute('data-choice-index')));
    });
  });
  const first = box.querySelector('[data-choice-index]');
  if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
  if (typeof announce === 'function') {
    announce((name || '旁白') + '：' + (prompt || '') + '。选项：' +
      (options || []).map(function (opt, i) { return (i + 1) + '，' + opt.label; }).join('；'));
  }
}

function returnFocusToWorld() {
  const v = byId('view-world');
  if (!v || v.hidden) return;
  v.setAttribute('tabindex', '-1');
  try { v.focus({ preventScroll: true }); } catch (e) { try { v.focus(); } catch (e2) { /* 忽略 */ } }
}

function pickChoice(index) {
  if (!activeChoice || activeChoice.picked) return;
  const choice = activeChoice;
  const opt = choice.options[index];
  if (!opt) return;
  choice.picked = true;
  activeChoice = null;
  let response = '';
  if (typeof choice.onPick === 'function') {
    try { response = choice.onPick(index) || ''; } catch (e) { console.error('[灵兽录] 抉择结算失败', e); }
  }
  clearChoiceBox();
  if (!response) {
    const dlg = byId('dialog');
    if (dlg) dlg.hidden = true;
    window.__uiTapGuardUntil = Date.now() + 400;
    returnFocusToWorld();
    if (typeof choice.done === 'function') {
      try { choice.done(index); } catch (e) { console.error('[灵兽录] 抉择回调失败', e); }
    }
    return;
  }
  showDialog('旁白', [response], function () {
    if (typeof choice.done === 'function') {
      try { choice.done(index); } catch (e) { console.error('[灵兽录] 抉择回调失败', e); }
    }
  });
}

function advanceDialog() {
  if (!activeDialog) return;
  if (activeDialog.typing) {
    clearInterval(activeDialog.timer);
    const el = byId('dialog-text');
    if (el) el.textContent = activeDialog.full;
    activeDialog.typing = false;
    if (typeof announce === 'function') announce(activeDialog.name + '：' + activeDialog.full);
    return;
  }
  activeDialog.i += 1;
  if (activeDialog.i >= activeDialog.lines.length) {
    const box = byId('dialog');
    if (box) box.hidden = true;
    // 关闭对话的同一次触摸可能继续落到画布上，短暂屏蔽地图点击
    window.__uiTapGuardUntil = Date.now() + 400;
    const cb = activeDialog.done;
    activeDialog = null;
    returnFocusToWorld();
    if (cb) {
      try { cb(); } catch (e) { console.error('[灵兽录] 对话回调失败', e); }
    }
    if (typeof processPendingCloudConflict === 'function') {
      setTimeout(processPendingCloudConflict, 400);
    }
    return;
  }
  showLine();
}

// ---------- 模态框 ----------
let modalReturnFocus = null;
let modalFocusRelease = null;

function setModalInert(on) {
  const views = document.querySelectorAll('#app > .view');
  Array.prototype.forEach.call(views, function (el) {
    try { el.inert = !!on; } catch (e) { /* 旧浏览器忽略 */ }
    if (on) el.setAttribute('aria-hidden', 'true');
    else el.removeAttribute('aria-hidden');
  });
}

function focusInitialInModal(m, opts) {
  if (!m) return;
  const preferred = opts && opts.autofocus ? m.querySelector(opts.autofocus) : m.querySelector('[data-autofocus]');
  const target = preferred || (typeof uiFocusables === 'function' ? uiFocusables(m)[0] : null);
  if (target && target.focus) {
    try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
    return;
  }
  const title = byId('modal-title');
  if (title) {
    title.setAttribute('tabindex', '-1');
    try { title.focus({ preventScroll: true }); } catch (e) { title.focus(); }
  }
}

function openModal(title, bodyHtml, footHtml, opts) {
  const m = byId('modal');
  if (!m) return;
  const wasOpen = !m.hidden;
  const b = byId('modal-body');
  const prevScroll = wasOpen && b ? b.scrollTop : 0;
  const prevFocus = wasOpen ? uiFocusToken(document.activeElement) : null;

  const t = byId('modal-title');
  if (t) t.textContent = title || '';
  if (b) b.innerHTML = bodyHtml || '';
  const f = byId('modal-foot');
  if (f) f.innerHTML = footHtml || '';
  m.hidden = false;
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  m.setAttribute('aria-labelledby', 'modal-title');
  if (typeof setHudMenu === 'function') setHudMenu(false);
  if (typeof uiEnhanceTabs === 'function') uiEnhanceTabs(m);

  if (!wasOpen) {
    modalReturnFocus = uiFocusToken(document.activeElement);
    setModalInert(true);
    document.body.classList.add('modal-open');
    modalFocusRelease = typeof uiTrapFocus === 'function' ? uiTrapFocus(m) : null;
    focusInitialInModal(m, opts);
  } else {
    if (b) b.scrollTop = prevScroll;
    if (!prevFocus || !uiRestoreFocus(prevFocus)) focusInitialInModal(m, opts);
  }
}

function closeModal() {
  const m = byId('modal');
  if (!m || m.hidden) return;
  m.hidden = true;
  if (modalFocusRelease) { modalFocusRelease(); modalFocusRelease = null; }
  setModalInert(false);
  document.body.classList.remove('modal-open');
  if (modalReturnFocus) uiRestoreFocus(modalReturnFocus);
  modalReturnFocus = null;
  window.__uiTapGuardUntil = Date.now() + 400;
}

function confirmModal(title, text, okLabel, onOk, danger) {
  openModal(title, '<p class="note">' + text + '</p>',
    '<button class="btn-sm plain" data-modal-cancel="1" data-autofocus="1">再想想</button>' +
    '<button class="btn-sm ' + (danger ? 'danger' : 'solid') + '" data-modal-ok="1">' + okLabel + '</button>');
  const foot = byId('modal-foot');
  if (!foot) return;
  const cancel = foot.querySelector('[data-modal-cancel]');
  if (cancel) cancel.addEventListener('click', function () { closeModal(); });
  const ok = foot.querySelector('[data-modal-ok]');
  if (ok) ok.addEventListener('click', function () {
    closeModal();
    try { onOk(); } catch (e) { console.error('[灵兽录] 确认操作失败', e); }
  });
}

// 调用 ui.js 面板，缺失时只提示不报错
function invokeUi(name, arg, arg2) {
  const fn = LB[name];
  if (typeof fn === 'function') {
    try { fn.call(LB, arg, arg2); return true; } catch (e) { console.error('[灵兽录] ' + name + ' 调用失败', e); return false; }
  }
  toast('此处尚未开放');
  return false;
}
