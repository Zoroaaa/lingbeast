// 云存档客户端：令牌管理 + 2 秒防抖推送。所有失败都静默降级为本地存档。
(function () {
  const TOKEN_KEY = 'lingbeast.token';
  const USER_KEY = 'lingbeast.user';
  const listeners = [];
  let token = null;
  let username = null;
  let timer = null;
  let queued = null;
  let lastError = '';

  function emit() {
    const status = { online: !!token, username, error: lastError };
    listeners.forEach(function (fn) { try { fn(status); } catch (e) {} });
  }

  function setToken(next, name) {
    token = next || null;
    username = name || null;
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, username || '');
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {}
    emit();
  }

  async function api(path, options) {
    const opts = options || {};
    const headers = { 'content-type': 'application/json' };
    if (token) headers.authorization = 'Bearer ' + token;
    const res = await fetch(path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (res.status === 401) setToken(null, null);
    return { ok: !!(res.ok && data && data.ok), status: res.status, data: data || {} };
  }

  function init() {
    try {
      token = localStorage.getItem(TOKEN_KEY);
      username = localStorage.getItem(USER_KEY);
    } catch (e) {}
    emit();
  }

  async function register(name, password) {
    lastError = '';
    const r = await api('/api/register', { method: 'POST', body: { username: name, password: password } });
    if (r.ok) { setToken(r.data.token, r.data.username); return { ok: true }; }
    lastError = r.data.error || '注册失败';
    emit();
    return { ok: false, error: lastError };
  }

  async function login(name, password) {
    lastError = '';
    const r = await api('/api/login', { method: 'POST', body: { username: name, password: password } });
    if (r.ok) { setToken(r.data.token, r.data.username); return { ok: true }; }
    lastError = r.data.error || '登录失败';
    emit();
    return { ok: false, error: lastError };
  }

  async function logout() {
    if (token) api('/api/logout', { method: 'POST' });
    setToken(null, null);
  }

  async function pull() {
    if (!token) return { ok: false, error: 'not-logged-in' };
    const r = await api('/api/save');
    if (!r.ok) { lastError = r.data.error || '云端未连接'; emit(); return { ok: false, error: lastError }; }
    lastError = '';
    emit();
    return { ok: true, save: r.data.save || null };
  }

  function push(payload, updatedAt) {
    queued = { payload: payload, updatedAt: updatedAt };
    if (!token) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 2000);
  }

  async function flush() {
    if (!queued || !token) return;
    const job = queued;
    queued = null;
    timer = null;
    const r = await api('/api/save', { method: 'PUT', body: job });
    if (r.ok) {
      lastError = '';
      emit();
      if (r.data.conflict && typeof onConflict === 'function') onConflict(r.data.save);
      return;
    }
    lastError = r.data.error || '同步失败';
    emit();
    // 失败保留任务，联网后补传
    if (!queued) queued = job;
    timer = setTimeout(flush, 6000);
  }

  let onConflict = null;

  window.Cloud = {
    init: init,
    register: register,
    login: login,
    logout: logout,
    pull: pull,
    push: push,
    flushNow: flush,
    onChange: function (fn) { listeners.push(fn); fn({ online: !!token, username: username, error: lastError }); },
    setConflictHandler: function (fn) { onConflict = fn; },
    get online() { return !!token; },
    get username() { return username; },
  };
})();
