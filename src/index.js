// 灵兽录 · Cloudflare Worker：静态资源 + 账号/云存档 API

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};
const SESSION_DAYS = 30;
const MAX_PAYLOAD = 100 * 1024;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function fail(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

const enc = new TextEncoder();

function bytesToHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: 100000, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function randomToken() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

// 单 isolate 内的轻量限流，防止脚本化暴力尝试
const attempts = new Map();
function throttled(ip, limit = 12, windowMs = 60 * 1000) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.start > windowMs) {
    attempts.set(ip, { start: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

async function requireUser(req, env) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT s.token, s.expires_at, u.id, u.username FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'
  )
    .bind(token)
    .first();
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return row;
}

async function createSession(env, userId) {
  const token = randomToken();
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, userId, expiresAt)
    .run();
  return token;
}

async function handleRegister(req, env) {
  const body = await req.json().catch(() => null);
  const username = (body?.username || '').trim();
  const password = body?.password || '';
  if (!/^[A-Za-z0-9_\u4e00-\u9fa5]{3,20}$/.test(username)) {
    return fail('道号需为 3-20 位中文、字母、数字或下划线');
  }
  if (password.length < 6 || password.length > 64) {
    return fail('密语需 6-64 位');
  }
  const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (exists) return fail('此道号已被占用', 409);

  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await hashPassword(password, salt);
  const res = await env.DB.prepare('INSERT INTO users (username, salt, hash, created_at) VALUES (?, ?, ?, ?)')
    .bind(username, salt, hash, Date.now())
    .run();
  const userId = res.meta.last_row_id;
  const token = await createSession(env, userId);
  return json({ ok: true, token, username });
}

async function handleLogin(req, env) {
  const body = await req.json().catch(() => null);
  const username = (body?.username || '').trim();
  const password = body?.password || '';
  if (!username || !password) return fail('请填写道号与密语');

  const user = await env.DB.prepare('SELECT id, username, salt, hash FROM users WHERE username = ?')
    .bind(username)
    .first();
  if (!user) return fail('道号或密语不符', 401);

  const hash = await hashPassword(password, user.salt);
  if (!safeEqual(hash, user.hash)) return fail('道号或密语不符', 401);

  const token = await createSession(env, user.id);
  return json({ ok: true, token, username: user.username });
}

async function handleLogout(req, env) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  return json({ ok: true });
}

async function handleGetSave(req, env) {
  const user = await requireUser(req, env);
  if (!user) return fail('未登录或登录已过期', 401);
  const row = await env.DB.prepare('SELECT payload, updated_at FROM saves WHERE user_id = ?')
    .bind(user.id)
    .first();
  if (!row) return json({ ok: true, save: null, username: user.username });
  return json({ ok: true, save: { payload: row.payload, updatedAt: row.updated_at }, username: user.username });
}

async function handlePutSave(req, env) {
  const user = await requireUser(req, env);
  if (!user) return fail('未登录或登录已过期', 401);
  const body = await req.json().catch(() => null);
  if (!body || typeof body.payload !== 'string') return fail('存档格式不正确');
  if (body.payload.length > MAX_PAYLOAD) return fail('存档过大', 413);
  let parsed = null;
  try { parsed = JSON.parse(body.payload); } catch (e) { parsed = null; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail('存档格式不正确');
  // 客户端时间只作为版本线索，不能把服务器时间锁到未来
  const now = Date.now();
  const clientAt = Number(body.updatedAt) || 0;
  const updatedAt = clientAt > 0 ? Math.min(clientAt, now) : now;

  const existing = await env.DB.prepare('SELECT updated_at FROM saves WHERE user_id = ?').bind(user.id).first();
  // 只把明显更新的存档视为冲突；2 秒内的时间抖动允许覆盖，避免时钟偏移导致死锁
  if (existing && existing.updated_at > updatedAt + 2000) {
    const row = await env.DB.prepare('SELECT payload, updated_at FROM saves WHERE user_id = ?')
      .bind(user.id)
      .first();
    return json({ ok: true, conflict: true, save: { payload: row.payload, updatedAt: row.updated_at } });
  }

  await env.DB.prepare(
    'INSERT INTO saves (user_id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at'
  )
    .bind(user.id, body.payload, updatedAt)
    .run();
  return json({ ok: true, updatedAt });
}

async function handleApi(req, env) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = req.method.toUpperCase();

  if (method === 'GET' && path === '/api/health') return json({ ok: true, service: 'lingbeast' });

  const ip = req.headers.get('cf-connecting-ip') || 'unknown';
  if (throttled(ip) && path !== '/api/health') return fail('请稍后再试', 429);

  if (method === 'POST' && path === '/api/register') return handleRegister(req, env);
  if (method === 'POST' && path === '/api/login') return handleLogin(req, env);
  if (method === 'POST' && path === '/api/logout') return handleLogout(req, env);
  if (method === 'GET' && path === '/api/save') return handleGetSave(req, env);
  if (method === 'PUT' && path === '/api/save') return handlePutSave(req, env);

  return fail('接口不存在', 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(req, env);
      } catch (err) {
        return fail('服务异常', 500);
      }
    }
    const res = await env.ASSETS.fetch(req);
    const headers = new Headers(res.headers);
    headers.set('x-content-type-options', 'nosniff');
    headers.set('referrer-policy', 'strict-origin-when-cross-origin');
    if (url.pathname === '/sw.js') headers.set('cache-control', 'no-cache');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
