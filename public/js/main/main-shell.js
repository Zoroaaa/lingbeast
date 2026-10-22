// 灵兽录 · 主控层 · 视图、对话、模态与阻塞
// ---------- 视图 / 提示 / 阻塞 ----------
function showView(id) {
  ['view-title', 'view-world', 'view-battle', 'view-end'].forEach(function (v) {
    const el = byId(v);
    if (el) el.hidden = v !== id;
  });
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
  toastTimerId = setTimeout(function () { el.hidden = true; }, 2600);
}

async function fadeTo(fn) {
  const reduce = state && state.settings ? state.settings.reduceMotion : false;
  const f = byId('fade');
  if (reduce || !f) { fn(); return; }
  f.classList.add('on');
  await new Promise(function (r) { setTimeout(r, 380); });
  fn();
  await new Promise(function (r) { setTimeout(r, 160); });
  f.classList.remove('on');
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

function showDialog(name, lines, done) {
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
  const delay = dialogDelay();
  if (!delay || !line.length) {
    el.textContent = line;
    activeDialog.typing = false;
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
      activeDialog.typing = false;
    }
  }, delay);
}

function advanceDialog() {
  if (!activeDialog) return;
  if (activeDialog.typing) {
    clearInterval(activeDialog.timer);
    const el = byId('dialog-text');
    if (el) el.textContent = activeDialog.full;
    activeDialog.typing = false;
    return;
  }
  activeDialog.i += 1;
  if (activeDialog.i >= activeDialog.lines.length) {
    const box = byId('dialog');
    if (box) box.hidden = true;
    const cb = activeDialog.done;
    activeDialog = null;
    if (cb) {
      try { cb(); } catch (e) { console.error('[灵兽录] 对话回调失败', e); }
    }
    return;
  }
  showLine();
}

// ---------- 模态框 ----------
function openModal(title, bodyHtml, footHtml) {
  const m = byId('modal');
  if (!m) return;
  const t = byId('modal-title');
  if (t) t.textContent = title || '';
  const b = byId('modal-body');
  if (b) b.innerHTML = bodyHtml || '';
  const f = byId('modal-foot');
  if (f) f.innerHTML = footHtml || '';
  if (typeof uiPixelize === 'function') uiPixelize(m);
  m.hidden = false;
}

function closeModal() {
  const m = byId('modal');
  if (m) m.hidden = true;
}

function confirmModal(title, text, okLabel, onOk, danger) {
  openModal(title, '<p class="note">' + text + '</p>',
    '<button class="btn-sm plain" data-modal-cancel="1">再想想</button>' +
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
