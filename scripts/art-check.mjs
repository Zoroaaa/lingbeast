#!/usr/bin/env node
// 灵兽录 · 灵兽立绘自检（零依赖，Node ESM）
//
// 默认扫描 public/：按 index.html 的 art 脚本顺序用 node:vm 加载源码，
// 对 62 只灵兽逐只 draw、统计 rect/bbox、检查 SVG 结构、家族区分度与进化链。
// 任何失败都会打印可定位的物种 id，并以退出码 1 结束（可直接接 CI）。
//
// 用法：
//   node scripts/art-check.mjs
//   node scripts/art-check.mjs --src .tmp/art-before/src    # 对改动前基线跑同一套标准
//   node scripts/art-check.mjs --json .tmp/art-check.json   # 额外输出机器可读报告
//
// 验收预算（与 docs/beast-art.md 一致）：
//   总 rect ≤ 60000 · 单兽 rect ≤ 900 · data-bbox 宽高 8..80 · 宽高比 0.25..4
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const EXPECTED_SPECIES = 62;
const EXPECTED_FAMILIES = 11;
const TOTAL_RECT_BUDGET = 60000;
const PER_BEAST_RECT_BUDGET = 900;
const BBOX_MIN = 8;
const BBOX_MAX = 80;
const ASPECT_MIN = 0.25;
const ASPECT_MAX = 4;

// 只加载立绘相关脚本：物种数据 + 共享画布 + art/beasts/*（新引擎 anatomy.js / parts-*.js 自动纳入）
const ART_SCRIPT_RE = /^js\/(?:data\/species\.js|art\.js|art\/beasts\/[^/]+\.js)$/;
const FLAT_ORDER = [
  'species.js', 'art.js', 'kit.js', 'anatomy.js', 'parts.js', 'signatures.js',
  'birds.js', 'land.js', 'reptiles.js', 'spirits.js', 'aquatic.js',
];
const PALETTE_KEYS = ['ink', 'dark', 'base', 'light', 'pale', 'glow'];

const USAGE = [
  '灵兽录 · 立绘自检',
  '',
  '  node scripts/art-check.mjs [--src <dir>] [--json <file>]',
  '',
  '  --src   源码目录（缺省 public/）',
  '  --json  额外输出机器可读报告（UTF-8 JSON）',
].join('\n');

function parseArgs(argv) {
  const opts = { src: null, json: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--help' || key === '-h') { opts.help = true; continue; }
    const field = { '--src': 'src', '--json': 'json' }[key];
    if (!field) throw new Error('未知参数：' + key + '（可用：--src <dir> --json <file>）');
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error('参数 ' + key + ' 缺少值');
    opts[field] = value;
    i += 1;
  }
  return opts;
}

function readIndexArtOrder(dir) {
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  return [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
    .map((m) => m[1].split('?')[0])
    .filter((src) => ART_SCRIPT_RE.test(src));
}

function readFlatArtOrder(dir) {
  const rankOf = (name) => {
    const i = FLAT_ORDER.indexOf(name);
    return i < 0 ? FLAT_ORDER.length : i;
  };
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.js'))
    .sort((a, b) => rankOf(a) - rankOf(b) || a.localeCompare(b));
}

function resolveSources(srcArg) {
  const baseDir = srcArg ? path.resolve(ROOT, srcArg) : path.join(ROOT, 'public');
  let stat = null;
  try { stat = fs.statSync(baseDir); } catch (err) { /* 下面统一报错 */ }
  if (!stat || !stat.isDirectory()) throw new Error('源码目录不存在：' + baseDir);
  let labels = [];
  let mode = '';
  if (fs.existsSync(path.join(baseDir, 'index.html'))) {
    const indexed = readIndexArtOrder(baseDir);
    if (indexed.length && indexed.every((label) => fs.existsSync(path.resolve(baseDir, label)))) {
      labels = indexed;
      mode = 'index.html 顺序';
    }
  }
  if (!labels.length) { labels = readFlatArtOrder(baseDir); mode = '扁平快照顺序'; }
  if (!labels.length) throw new Error('未在 ' + baseDir + ' 找到美术脚本（需要 index.html 或扁平 .js 快照目录）');
  const files = labels.map((label) => path.resolve(baseDir, label));
  const missing = files.filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error('缺少脚本：' + missing.map((f) => path.relative(ROOT, f)).join(', '));
  return { baseDir, displayBase: path.relative(ROOT, baseDir) || '.', mode, labels, files };
}

function loadArtContext(files) {
  const logs = [];
  const record = (level) => (...args) => logs.push({ level, text: args.map((a) => String(a)).join(' ') });
  const ctx = vm.createContext({ console: { log: record('log'), warn: record('warn'), error: record('error') } });
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    try {
      vm.runInContext(code, ctx, { filename: file });
    } catch (err) {
      throw new Error('加载失败：' + path.relative(ROOT, file) + '\n' +
        (err && err.stack ? err.stack.split('\n').slice(0, 4).join('\n') : err));
    }
  }
  return { ctx, logs };
}

function readGlobal(ctx, expr, fallback) {
  try {
    const value = vm.runInContext(expr, ctx);
    return value === undefined ? fallback : value;
  } catch (err) {
    return fallback;
  }
}

function errMessage(err) { return err && err.message ? err.message : String(err); }

function extractSvg(html) {
  if (typeof html !== 'string') return null;
  const start = html.indexOf('<svg');
  const end = html.lastIndexOf('</svg>');
  return start >= 0 && end > start ? html.slice(start, end + 6) : null;
}

function countRects(svg) { return (svg.match(/<rect\b/g) || []).length; }

function parseBbox(svg) {
  const m = /data-bbox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(svg);
  if (!m) return null;
  const x0 = Number(m[1]); const y0 = Number(m[2]); const x1 = Number(m[3]); const y1 = Number(m[4]);
  if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

function parseViewBox(svg) {
  const m = /viewBox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(svg);
  if (!m) return null;
  const x = Number(m[1]); const y = Number(m[2]); const w = Number(m[3]); const h = Number(m[4]);
  if (![x, y, w, h].every(Number.isFinite)) return null;
  return { x, y, w, h };
}

// SVG 结构检查：非法数值 token、0/负宽高、rect 尺寸。返回可汇总的结构化结果，
// 便于把小图/大图的同一问题合并成一条（两只图由同一次 draw 产生，重复报两次没有信息量）。
function inspectSvgStructure(svg) {
  const out = { tokens: new Set(), zeroSizeAttr: false, badRects: 0, samples: [] };
  if (/NaN/.test(svg)) out.tokens.add('NaN');
  if (/undefined/.test(svg)) out.tokens.add('undefined');
  if (/Infinity/.test(svg)) out.tokens.add('Infinity');
  if (/\b(?:width|height)="(?:0|-[\d.]+)"/.test(svg)) out.zeroSizeAttr = true;
  for (const m of svg.matchAll(/<rect\b([^>]*?)\/?>/g)) {
    const attrs = m[1];
    const pick = (name) => {
      const mm = new RegExp('\\b' + name + '="([^"]*)"').exec(attrs);
      return mm ? Number(mm[1]) : null;
    };
    const x = pick('x'); const y = pick('y'); const w = pick('width'); const h = pick('height');
    const invalid = ![x, y, w, h].every((v) => v === null || Number.isFinite(v)) || !(w > 0) || !(h > 0);
    if (invalid) {
      out.badRects += 1;
      if (out.samples.length < 2) out.samples.push(m[0].slice(0, 90));
    }
  }
  return out;
}

function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value);
}

function fingerprint(metrics) {
  if (!metrics || !metrics.bbox) return 'no-bbox';
  return metrics.rects + '|' + [metrics.bbox.x0, metrics.bbox.y0, metrics.bbox.x1, metrics.bbox.y1].map((v) => v.toFixed(1)).join(' ');
}

function median(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function runChecks(source, env) {
  const { ctx, logs } = env;
  const checks = [];
  const warnings = [];
  function addCheck(id, title) {
    const check = { id, title, ok: true, details: '', failures: [] };
    checks.push(check);
    return check;
  }
  function fail(check, beastId, message) {
    check.ok = false;
    check.failures.push((beastId ? '[' + beastId + '] ' : '') + message);
  }
  function warn(message) { warnings.push(message); }

  const SPECIES = readGlobal(ctx, 'SPECIES', null);
  const BEAST_STYLES = readGlobal(ctx, 'BEAST_STYLES', null);
  const beastSvg = readGlobal(ctx, 'beastSvg', null);
  const FAMILY_KEYS = readGlobal(ctx, 'Object.keys(FAMILY_DEFAULTS)', []);
  const BUILDER_KEYS = readGlobal(ctx, 'Object.keys(BEAST_BUILDERS)', []);
  const SIGNATURE_KEYS = readGlobal(ctx, 'Object.keys(SIGNATURES)', []);
  const MATERIAL_KEYS = readGlobal(ctx, "typeof BEAST_MATERIALS !== 'undefined' ? Object.keys(BEAST_MATERIALS) : []", []);
  const hasMaterialGlobal = MATERIAL_KEYS.length > 0;
  const expectedGlobals = [
    ['SPECIES', SPECIES, 'object'],
    ['BEAST_STYLES', BEAST_STYLES, 'object'],
    ['beastSvg', beastSvg, 'function'],
    ['FAMILY_DEFAULTS', readGlobal(ctx, 'typeof FAMILY_DEFAULTS !== "undefined" ? FAMILY_DEFAULTS : null', null), 'object'],
    ['BEAST_BUILDERS', readGlobal(ctx, 'typeof BEAST_BUILDERS !== "undefined" ? BEAST_BUILDERS : null', null), 'object'],
  ];

  const loadCheck = addCheck('load', '源码加载');
  loadCheck.details = source.labels.length + ' 个脚本（' + source.mode + '）';
  expectedGlobals.forEach(([name, value, type]) => {
    if (value == null || typeof value !== type) fail(loadCheck, null, '未找到全局 ' + name + '（' + type + '）');
  });
  const loadErrors = logs.filter((log) => log.level === 'error');
  const loadWarnings = logs.filter((log) => log.level === 'warn');
  loadErrors.forEach((log) => fail(loadCheck, null, '加载期 console.error：' + log.text));
  loadWarnings.forEach((log) => warn('加载期 console.warn：' + log.text));
  if (!SPECIES || !BEAST_STYLES || typeof beastSvg !== 'function') return { checks, warnings, fatal: true };

  const speciesIds = Object.keys(SPECIES);
  const styleIds = Object.keys(BEAST_STYLES).filter((id) => id !== '__fallback');
  const hasBeast = (id) => Object.prototype.hasOwnProperty.call(SPECIES, id);

  // 1) 物种数量
  const countCheck = addCheck('species', '物种数量');
  countCheck.details = speciesIds.length + ' 只';
  if (speciesIds.length !== EXPECTED_SPECIES) {
    fail(countCheck, null, '期望 ' + EXPECTED_SPECIES + ' 只，实际 ' + speciesIds.length + ' 只');
  }

  // 2) 样式注册 / 字段合法性
  const styleCheck = addCheck('styles', '样式注册与字段');
  const missingStyles = speciesIds.filter((id) => !BEAST_STYLES[id]);
  missingStyles.forEach((id) => fail(styleCheck, id, '缺少 style（BEAST_STYLES 无此 id）'));
  styleIds.filter((id) => !hasBeast(id)).forEach((id) => fail(styleCheck, id, '样式存在但 SPECIES 无此物种'));
  styleIds.forEach((id) => {
    const style = BEAST_STYLES[id];
    if (!style || typeof style.draw !== 'function') { fail(styleCheck, id, 'style.draw 不是函数'); return; }
    if (!style.family) fail(styleCheck, id, 'style.family 缺失');
    if (style.id !== id) fail(styleCheck, id, 'style.id 与注册 id 不一致（' + style.id + '）');
    if (style.family && FAMILY_KEYS.length && FAMILY_KEYS.indexOf(style.family) < 0) {
      fail(styleCheck, id, 'style.family=' + style.family + ' 不在家族表（' + FAMILY_KEYS.join('/') + '）');
    }
    if (style.family && BUILDER_KEYS.length && BUILDER_KEYS.indexOf(style.family) < 0) {
      fail(styleCheck, id, 'style.family=' + style.family + ' 没有对应构建器');
    }
    if (!Number.isFinite(style.scale) || style.scale <= 0) fail(styleCheck, id, 'style.scale 非法：' + style.scale);
    const sig = style.signature;
    if (sig != null && sig !== 'none' && typeof sig !== 'function' && SIGNATURE_KEYS.indexOf(sig) < 0) {
      fail(styleCheck, id, '签名 "' + sig + '" 未在 SIGNATURES 中定义');
    }
    PALETTE_KEYS.forEach((key) => {
      const color = style.palette ? style.palette[key] : undefined;
      if (!color) { fail(styleCheck, id, 'palette.' + key + ' 缺失'); return; }
      if (!isHexColor(color)) warn('[' + id + '] palette.' + key + ' 不是标准 hex：' + color);
    });
  });
  if (styleIds.length) styleCheck.details = speciesIds.length + ' 只 / ' + styleIds.length + ' 样式';

  // 3) 逐只绘制 + rect/bbox 指标
  const drawCheck = addCheck('draw', '逐只绘制');
  const bboxCheck = addCheck('bbox', 'data-bbox 尺寸');
  const svgCheck = addCheck('svg', 'SVG 结构合法');
  const metrics = {};
  speciesIds.forEach((id) => {
    const rec = { id, rects: 0, smallRects: 0, bigRects: 0, bbox: null, viewBox: null, length: 0, htmlSmall: '', htmlBig: '' };
    metrics[id] = rec;
    const structure = { tokens: new Map(), zeroSizeAttr: new Set(), badRects: 0, samples: [] };
    ['small', 'big'].forEach((size) => {
      let html = '';
      try {
        html = beastSvg(id, size === 'big');
      } catch (err) {
        fail(drawCheck, id, 'draw 抛错(' + size + ')：' + errMessage(err));
        return;
      }
      if (size === 'big') rec.htmlBig = html; else rec.htmlSmall = html;
      const svg = extractSvg(html);
      if (!svg) { fail(drawCheck, id, '未生成 SVG(' + size + ')'); return; }
      if (size === 'big') rec.length = svg.length;
      const rects = countRects(svg);
      if (size === 'big') rec.bigRects = rects; else rec.smallRects = rects;
      const found = inspectSvgStructure(svg);
      found.tokens.forEach((token) => {
        if (!structure.tokens.has(token)) structure.tokens.set(token, new Set());
        structure.tokens.get(token).add(size);
      });
      if (found.zeroSizeAttr) structure.zeroSizeAttr.add(size);
      structure.badRects = Math.max(structure.badRects, found.badRects);
      found.samples.forEach((sample) => { if (structure.samples.length < 2) structure.samples.push(sample); });
      const bbox = parseBbox(svg);
      const viewBox = parseViewBox(svg);
      if (size === 'big') { rec.bbox = bbox; rec.viewBox = viewBox; }
      if (!bbox) fail(bboxCheck, id, '缺少 data-bbox(' + size + ')');
      if (!viewBox) fail(bboxCheck, id, 'viewBox 缺失或非法(' + size + ')');
    });
    const sizeLabel = (sizes) => [...sizes].map((s) => (s === 'small' ? '小图' : '大图')).join('/');
    structure.tokens.forEach((sizes, token) => fail(svgCheck, id, 'SVG 含 ' + token + '（' + sizeLabel(sizes) + '）'));
    if (structure.zeroSizeAttr.size) fail(svgCheck, id, '含 width/height 为 0 或负值（' + sizeLabel(structure.zeroSizeAttr) + '）');
    if (structure.badRects) fail(svgCheck, id, structure.badRects + ' 个 rect 尺寸/坐标非法，例如 ' + structure.samples[0]);
    rec.rects = rec.bigRects || rec.smallRects;
    if (rec.smallRects && rec.bigRects && rec.smallRects !== rec.bigRects) {
      fail(drawCheck, id, '大小图 rect 数不一致：' + rec.smallRects + ' vs ' + rec.bigRects);
    }
    if (!rec.rects) fail(drawCheck, id, '未绘制出任何 rect');
    if (rec.bbox) {
      if (!(rec.bbox.w >= BBOX_MIN && rec.bbox.w <= BBOX_MAX)) {
        fail(bboxCheck, id, 'bbox 宽 ' + rec.bbox.w.toFixed(1) + ' 超出 ' + BBOX_MIN + '..' + BBOX_MAX);
      }
      if (!(rec.bbox.h >= BBOX_MIN && rec.bbox.h <= BBOX_MAX)) {
        fail(bboxCheck, id, 'bbox 高 ' + rec.bbox.h.toFixed(1) + ' 超出 ' + BBOX_MIN + '..' + BBOX_MAX);
      }
      const aspect = rec.bbox.h > 0 ? rec.bbox.w / rec.bbox.h : 0;
      if (!(aspect >= ASPECT_MIN && aspect <= ASPECT_MAX)) {
        fail(bboxCheck, id, 'bbox 宽高比 ' + aspect.toFixed(2) + ' 超出 ' + ASPECT_MIN + '..' + ASPECT_MAX);
      }
    }
    if (rec.viewBox && (!(rec.viewBox.w > 0) || Math.abs(rec.viewBox.w - rec.viewBox.h) > 0.11)) {
      fail(bboxCheck, id, 'viewBox 不是有效正方形：' + JSON.stringify(rec.viewBox));
    }
  });
  const rectList = speciesIds.map((id) => metrics[id].rects).filter((n) => n > 0);
  const totalRects = rectList.reduce((sum, n) => sum + n, 0);
  const maxRects = rectList.length ? Math.max(...rectList) : 0;
  drawCheck.details = '可绘制 ' + speciesIds.length + ' 只 · rect 中位 ' + median(rectList) + ' / 最大 ' + maxRects;

  // 4) rect 预算
  const budgetCheck = addCheck('budget', 'rect 预算');
  budgetCheck.details = '总 ' + totalRects + ' ≤ ' + TOTAL_RECT_BUDGET + ' · 单兽最大 ' + maxRects + ' ≤ ' + PER_BEAST_RECT_BUDGET;
  if (totalRects > TOTAL_RECT_BUDGET) {
    fail(budgetCheck, null, '总 rect ' + totalRects + ' 超出预算 ' + TOTAL_RECT_BUDGET);
  }
  speciesIds.forEach((id) => {
    if (metrics[id].rects > PER_BEAST_RECT_BUDGET) {
      fail(budgetCheck, id, '单兽 rect ' + metrics[id].rects + ' 超出预算 ' + PER_BEAST_RECT_BUDGET);
    }
  });

  // 5) 家族覆盖
  const familyCheck = addCheck('families', '家族覆盖');
  const families = {};
  speciesIds.forEach((id) => {
    const style = BEAST_STYLES[id];
    const family = style && style.family ? style.family : '(无)';
    families[family] = families[family] || [];
    families[family].push(id);
  });
  familyCheck.details = Object.keys(families).map((key) => key + '×' + families[key].length).join('，');
  if (FAMILY_KEYS.length !== EXPECTED_FAMILIES) {
    fail(familyCheck, null, '家族表期望 ' + EXPECTED_FAMILIES + ' 个，实际 ' + FAMILY_KEYS.length + ' 个（' + FAMILY_KEYS.join('/') + '）');
  }
  if (BUILDER_KEYS.length !== EXPECTED_FAMILIES) {
    fail(familyCheck, null, '构建器期望 ' + EXPECTED_FAMILIES + ' 个，实际 ' + BUILDER_KEYS.length + ' 个（' + BUILDER_KEYS.join('/') + '）');
  }
  FAMILY_KEYS.forEach((key) => {
    if (!families[key] || !families[key].length) fail(familyCheck, null, '家族 ' + key + ' 没有任何物种');
  });

  // 6) 同家族区分度：rect 数 + bbox 必须两两不同
  const dupCheck = addCheck('distinguish', '同家族区分度');
  let dupGroups = 0;
  Object.entries(families).forEach(([family, ids]) => {
    const groups = new Map();
    ids.forEach((id) => {
      const fp = fingerprint(metrics[id]);
      if (!groups.has(fp)) groups.set(fp, []);
      groups.get(fp).push(id);
    });
    groups.forEach((groupIds) => {
      if (groupIds.length > 1) {
        dupGroups += 1;
        fail(dupCheck, groupIds[0], '同家族（' + family + '）' + groupIds.join(' / ') + ' 的 rect+bbox 完全相同');
      }
    });
  });
  dupCheck.details = dupGroups ? dupGroups + ' 组重复' : '同家族两两可区分';

  // 7) 进化链：目标存在、标记为 evolved、形态确有差异
  const evolveCheck = addCheck('evolve', '进化链');
  let evolvePairs = 0;
  speciesIds.forEach((id) => {
    const sp = SPECIES[id];
    const targetId = sp && sp.evolve && sp.evolve.to;
    if (!targetId) return;
    evolvePairs += 1;
    if (!hasBeast(targetId)) { fail(evolveCheck, id, '进化目标 ' + targetId + ' 不在 SPECIES'); return; }
    if (!SPECIES[targetId].evolved) fail(evolveCheck, id, '进化目标 ' + targetId + ' 未标记 evolved');
    if (!BEAST_STYLES[targetId]) { fail(evolveCheck, id, '进化目标 ' + targetId + ' 缺少 style'); return; }
    if (fingerprint(metrics[id]) === fingerprint(metrics[targetId])) {
      fail(evolveCheck, id, '进化形态 ' + targetId + ' 与基础形态的 rect+bbox 完全相同');
    }
  });
  evolveCheck.details = evolvePairs + ' 组进化';

  // 8) material（新引擎落地后才启用；缺失时明确跳过）
  const materialCheck = addCheck('material', '材质（material）');
  const materialValues = speciesIds.map((id) => {
    const style = BEAST_STYLES[id];
    const value = style && style.material != null ? style.material : (SPECIES[id].material != null ? SPECIES[id].material : null);
    return { id, value };
  });
  const presentMaterials = materialValues.filter((item) => item.value != null);
  if (!hasMaterialGlobal && !presentMaterials.length) {
    materialCheck.details = '待引擎落地：无 BEAST_MATERIALS / material 字段，已跳过';
  } else {
    if (!hasMaterialGlobal) fail(materialCheck, null, '已有 material 字段但未定义 BEAST_MATERIALS');
    if (MATERIAL_KEYS.length !== EXPECTED_FAMILIES) {
      fail(materialCheck, null, ' BEAST_MATERIALS 期望 11 种，实际 ' + MATERIAL_KEYS.length + ' 种（' + MATERIAL_KEYS.join('/') + '）');
    }
    const usage = {};
    presentMaterials.forEach((item) => {
      const name = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
      usage[name] = (usage[name] || 0) + 1;
      if (name === 'unknown') fail(materialCheck, item.id, 'material 仍为 unknown');
      if (hasMaterialGlobal && typeof item.value === 'string' && MATERIAL_KEYS.indexOf(item.value) < 0) {
        fail(materialCheck, item.id, 'material "' + item.value + '" 未在 BEAST_MATERIALS 中定义');
      }
    });
    speciesIds.forEach((id) => {
      if (!presentMaterials.some((item) => item.id === id)) fail(materialCheck, id, '缺少 material 字段');
    });
    MATERIAL_KEYS.forEach((key) => {
      if (!usage[key] || usage[key] < 3) fail(materialCheck, null, 'material "' + key + '" 只被 ' + (usage[key] || 0) + ' 只使用（要求 ≥3）');
    });
    materialCheck.details = MATERIAL_KEYS.length + ' 种材料：' + Object.keys(usage).map((key) => key + '×' + usage[key]).join('，');
  }

  return { checks, warnings, fatal: false, speciesIds, styleIds, metrics, families, totalRects, medianRects: median(rectList), maxRects };
}

function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (err) { console.error('✗ ' + err.message); process.exitCode = 1; return; }
  if (opts.help) { console.log(USAGE); return; }

  let source;
  let env;
  try { source = resolveSources(opts.src); } catch (err) { console.error('✗ ' + err.message); process.exitCode = 1; return; }
  try { env = loadArtContext(source.files); } catch (err) {
    console.error('✗ ' + err.message);
    process.exitCode = 1;
    return;
  }

  const outcome = runChecks(source, env);
  const { checks, warnings } = outcome;
  const failedChecks = checks.filter((check) => !check.ok);

  console.log('灵兽录 · 立绘自检（art-check）');
  console.log('  源码：' + source.displayBase + '（' + source.mode + '）');
  console.log('  脚本：' + source.labels.length + ' 个（' + source.labels.join(', ') + '）');
  if (!outcome.fatal) {
    console.log('  物种／样式：' + outcome.speciesIds.length + ' / ' + outcome.styleIds.length);
    console.log('  总 rect：' + outcome.totalRects + '（中位 ' + outcome.medianRects + ' / 最大 ' + outcome.maxRects + '）');
    console.log('  家族分布：' + Object.keys(outcome.families).map((key) => key + '×' + outcome.families[key].length).join('，'));
  }
  console.log('');
  checks.forEach((check) => {
    const prefix = check.ok ? '✓' : '✗';
    console.log(prefix + ' ' + check.title + (check.details ? '：' + check.details : ''));
    check.failures.forEach((message) => console.log('    - ' + message));
  });
  if (warnings.length) {
    console.log('');
    console.log('警告 ' + warnings.length + ' 条：');
    warnings.forEach((message) => console.log('  ! ' + message));
  }
  console.log('');
  if (failedChecks.length) {
    console.log('结果：失败 ' + failedChecks.length + ' 项检查（' + failedChecks.reduce((n, c) => n + c.failures.length, 0) +
      ' 条问题）· 警告 ' + warnings.length + ' 条');
    process.exitCode = 1;
  } else {
    console.log('结果：全部通过（' + checks.length + ' 项检查）· 警告 ' + warnings.length + ' 条');
  }

  if (opts.json) {
    const jsonFile = path.resolve(ROOT, opts.json);
    fs.mkdirSync(path.dirname(jsonFile), { recursive: true });
    const report = {
      ok: failedChecks.length === 0,
      generatedAt: new Date().toISOString(),
      source: { baseDir: source.displayBase, mode: source.mode, scripts: source.labels },
      speciesCount: outcome.fatal ? 0 : outcome.speciesIds.length,
      styleCount: outcome.fatal ? 0 : outcome.styleIds.length,
      totalRects: outcome.fatal ? 0 : outcome.totalRects,
      families: outcome.fatal ? {} : Object.fromEntries(Object.entries(outcome.families).map(([key, ids]) => [key, ids.length])),
      perBeast: outcome.fatal ? [] : outcome.speciesIds.map((id) => ({
        id,
        rects: outcome.metrics[id].rects,
        bbox: outcome.metrics[id].bbox,
        viewBox: outcome.metrics[id].viewBox,
        svgLength: outcome.metrics[id].length,
      })),
      checks: checks.map((check) => ({ id: check.id, title: check.title, ok: check.ok, details: check.details, failures: check.failures })),
      warnings,
    };
    fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log('  JSON 报告：' + path.relative(ROOT, jsonFile));
  }
}

main();
