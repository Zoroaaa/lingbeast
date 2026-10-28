// 灵兽录 · UI 静态检查
// 检查：设计 token 对比度、禁用 NES 残留、HTML 必要 ARIA、重复 id、全部前端脚本语法。
// 用法：node scripts/ui-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const pub = path.join(root, 'public');
const problems = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(hex) {
  return hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- 1. token 对比度 ----------
const css = read('public/style.css');
const tokens = {};
for (const m of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  tokens[m[1]] = m[2];
}

const pairs = [
  ['ink-400', 'paper-1', 4.5],
  ['ink-500', 'paper-1', 4.5],
  ['ink-900', 'paper-1', 4.5],
  ['gold-ink', 'paper-1', 4.5],
  ['gold-700', 'paper-2', 4.5],
  ['jade-ink', 'paper-1', 4.5],
  ['coral-ink', 'paper-1', 4.5],
  ['water-ink', 'paper-1', 4.5],
  ['ink-300', 'paper-1', 2.5],
];

for (const [fg, bg, min] of pairs) {
  if (!tokens[fg] || !tokens[bg]) {
    problems.push('缺少 token：' + fg + ' 或 ' + bg);
    continue;
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  if (ratio < min) {
    problems.push(`对比度不足：${fg} on ${bg} = ${ratio.toFixed(2)}:1（要求 ≥ ${min}）`);
  }
}

// ---------- 2. 禁用 NES 残留 ----------
const nesHits = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!/\.(html|css|js|mjs)$/.test(entry.name)) continue;
    const text = fs.readFileSync(full, 'utf8');
    if (/nes\.min\.css|\.nes-(btn|badge|progress|beast-hp)/.test(text)) {
      nesHits.push(path.relative(root, full));
    }
  }
})(pub);
if (nesHits.length) problems.push('仍有 NES 引用：' + nesHits.join('、'));

// ---------- 3. HTML 必要 ARIA ----------
const html = read('public/index.html');
const required = [
  ['modal', /id="modal"[^>]*role="dialog"/, '#modal 需要 role="dialog"'],
  ['modal-label', /id="modal"[^>]*aria-labelledby="modal-title"/, '#modal 需要 aria-labelledby="modal-title"'],
  ['toast', /id="toast"[^>]*role="status"/, '#toast 需要 role="status"'],
  ['sr-live', /id="sr-live"/, '缺少 #sr-live'],
  ['hud-nav', /id="hud-nav"/, '缺少 #hud-nav'],
  ['hud-menu', /id="btn-menu"/, '缺少 #btn-menu'],
  ['world-loading', /id="world-loading"/, '缺少 #world-loading'],
  ['hero-hint', /aria-label="场景地图/, '#game-canvas 需要 aria-label'],
];
for (const [, re, msg] of required) {
  if (!re.test(html)) problems.push(msg);
}

// ---------- 4. 重复 id ----------
const ids = new Map();
for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
  ids.set(m[1], (ids.get(m[1]) || 0) + 1);
}
for (const [id, count] of ids) {
  if (count > 1) problems.push('重复 id：' + id + ' ×' + count);
}

// ---------- 5. 脚本语法 ----------
function walkJs(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
}
const jsFiles = [];
walkJs(path.join(pub, 'js'), jsFiles);
jsFiles.push(path.join(pub, 'cloud.js'), path.join(pub, 'sw.js'));
for (const file of jsFiles) {
  try {
    new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file });
  } catch (e) {
    problems.push('语法错误：' + path.relative(root, file) + ' · ' + e.message);
  }
}

if (problems.length) {
  console.error('UI 检查失败 (' + problems.length + ')：\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('UI 检查通过 · token 对比度、ARIA、id、' + jsFiles.length + ' 个脚本语法均正常');
