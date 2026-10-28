#!/usr/bin/env node
// 灵兽录 · 程序化灵兽立绘预览生成器（零依赖，Node ESM）
//
// 用 node:vm 在同一个 context 中按 public/index.html 的 <script> 顺序加载美术源码
// （data/species.js + art.js + art/beasts/*.js），再对全部物种调用 beastSvg(id,false/true)，
// 输出一份可直接用 file:// 打开、也可 headless Chrome 截图的静态 HTML。
//
// 用法：
//   node scripts/art-preview.mjs
//   node scripts/art-preview.mjs --src .tmp/art-before/src --out .tmp/art-before/gallery.html --stats .tmp/art-before/stats.txt
//
// 参数：
//   --src <dir>    源码目录。两种模式：
//                    1) 目录内有 index.html（如 public/）：按其中 art 相关 <script> 顺序加载；
//                    2) 扁平快照目录（如 .tmp/art-before/src）：按内置顺序 + 文件名兜底加载。
//                  缺省为 public/。
//   --out <file>   输出 HTML，缺省 .tmp/art-preview.html。
//   --stats <file> 额外把统计报告写成 UTF-8 文本（基线留档用）。
//
// 关键点：顶层 const/let（BEAST_STYLES、SPECIES 等）不会成为 context 的属性，
// 必须用 vm.runInContext('BEAST_STYLES', ctx) 取值；context 内不注入 Blob/URL，
// 以让 beastSvg() 走内联 SVG 分支（Node 里 Blob URL 不可用）。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const DEFAULT_OUT = path.join('.tmp', 'art-preview.html');
// 只加载立绘相关脚本：物种数据 + 共享画布 + art/beasts/*（未来 anatomy.js、parts-*.js 自动纳入）
const ART_SCRIPT_RE = /^js\/(?:data\/species\.js|art\.js|art\/beasts\/[^/]+\.js)$/;
// 扁平快照目录的缺省加载顺序（新引擎文件不在列表里时按文件名追加到最后）
const FLAT_ORDER = [
  'species.js', 'art.js', 'kit.js', 'anatomy.js', 'parts.js', 'signatures.js',
  'birds.js', 'land.js', 'reptiles.js', 'spirits.js', 'aquatic.js',
];

const USAGE = [
  '灵兽录 · 立绘预览生成器',
  '',
  '  node scripts/art-preview.mjs [--src <dir>] [--out <file>] [--stats <file>]',
  '',
  '  --src   源码目录（缺省 public/）。有 index.html 时按其 art 脚本顺序加载；',
  '          否则按扁平快照目录处理（如 .tmp/art-before/src）。',
  '  --out   输出 HTML（缺省 .tmp/art-preview.html）',
  '  --stats 额外输出统计文本（UTF-8）',
].join('\n');

function fail(message) {
  console.error('✗ ' + message);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { src: null, out: null, stats: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--help' || key === '-h') { opts.help = true; continue; }
    const field = { '--src': 'src', '--out': 'out', '--stats': 'stats' }[key];
    if (!field) fail('未知参数：' + key + '（可用：--src <dir> --out <file> --stats <file>）');
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) fail('参数 ' + key + ' 缺少值');
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
  try { stat = fs.statSync(baseDir); } catch (e) { /* 下面统一报错 */ }
  if (!stat || !stat.isDirectory()) throw new Error('源码目录不存在：' + baseDir);
  // 优先按 index.html；若目录只是带着 index.html 的扁平快照（脚本相对路径不存在），退回扁平顺序。
  let labels = [];
  let mode = '';
  if (fs.existsSync(path.join(baseDir, 'index.html'))) {
    const indexed = readIndexArtOrder(baseDir);
    if (indexed.length && indexed.every((label) => fs.existsSync(path.resolve(baseDir, label)))) {
      labels = indexed;
      mode = 'index.html 顺序';
    }
  }
  if (!labels.length) {
    labels = readFlatArtOrder(baseDir);
    mode = '扁平快照顺序';
  }
  if (!labels.length) {
    throw new Error('未在 ' + baseDir + ' 找到美术脚本（需要 index.html 或扁平 .js 快照目录）');
  }
  const files = labels.map((label) => path.resolve(baseDir, label));
  const missing = files.filter((file) => !fs.existsSync(file));
  if (missing.length) throw new Error('缺少脚本：' + missing.map((f) => path.relative(ROOT, f)).join(', '));
  return { baseDir, mode, labels, files };
}

// 用 vm 在同一个 context 里顺序执行脚本；不注入 Blob/URL/DOM，保持 Node 下的内联 SVG 回退。
function loadArtContext(files) {
  const logs = [];
  const record = (level) => (...args) => {
    logs.push({ level, text: args.map((a) => String(a)).join(' ') });
  };
  const sandbox = { console: { log: record('log'), warn: record('warn'), error: record('error') } };
  const ctx = vm.createContext(sandbox);
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    try {
      vm.runInContext(code, ctx, { filename: file });
    } catch (err) {
      throw new Error('加载失败：' + path.relative(ROOT, file) + '\n' + (err && err.stack ? err.stack.split('\n').slice(0, 4).join('\n') : err));
    }
  }
  return { ctx, logs };
}

// 顶层 const 不是 context 属性，只能求值取；取不到时给缺省值。
function readGlobal(ctx, expr, fallback) {
  try {
    const value = vm.runInContext(expr, ctx);
    return value === undefined ? fallback : value;
  } catch (err) {
    return fallback;
  }
}

function errMessage(err) {
  return err && err.message ? err.message : String(err);
}

function extractSvg(html) {
  if (typeof html !== 'string') return null;
  const start = html.indexOf('<svg');
  const end = html.lastIndexOf('</svg>');
  return start >= 0 && end > start ? html.slice(start, end + 6) : null;
}

function countRects(svg) {
  return (svg.match(/<rect\b/g) || []).length;
}

function parseBbox(svg) {
  const m = /data-bbox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(svg);
  if (!m) return null;
  const x0 = Number(m[1]);
  const y0 = Number(m[2]);
  const x1 = Number(m[3]);
  const y1 = Number(m[4]);
  if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// SVG 结构检查：NaN/undefined/Infinity、0 或负的 rect 宽高。
function svgIssues(svg) {
  const issues = [];
  if (/NaN/.test(svg)) issues.push('含 NaN');
  if (/undefined/.test(svg)) issues.push('含 undefined');
  if (/Infinity/.test(svg)) issues.push('含 Infinity');
  if (/\b(?:width|height)="(?:0|-[\d.]+)"/.test(svg)) issues.push('含 0/负宽高属性');
  let bad = 0;
  for (const m of svg.matchAll(/<rect\b([^>]*?)\/?>/g)) {
    const attrs = m[1];
    const pick = (name) => {
      const mm = new RegExp('\\b' + name + '="([^"]*)"').exec(attrs);
      return mm ? Number(mm[1]) : null;
    };
    const w = pick('width');
    const h = pick('height');
    const x = pick('x');
    const y = pick('y');
    if (![w, h, x, y].every((v) => v === null || Number.isFinite(v)) || w <= 0 || h <= 0) {
      bad += 1;
      if (bad <= 3) issues.push('rect 坐标非法：' + m[0].slice(0, 90));
    }
  }
  if (bad > 3) issues.push('共 ' + bad + ' 个 rect 坐标非法');
  return issues;
}

function describeMaterial(material) {
  if (material == null) return '';
  if (typeof material === 'string') return material;
  if (typeof material === 'number' || typeof material === 'boolean') return String(material);
  try { return JSON.stringify(material); } catch (e) { return String(material); }
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function fmt(value, digits) {
  return Number.isFinite(value) ? value.toFixed(digits == null ? 1 : digits) : '—';
}

function median(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function analyzeBeast(id, env) {
  const { beastSvg, SPECIES, BEAST_STYLES } = env;
  const sp = SPECIES[id] || {};
  const style = BEAST_STYLES[id] || null;
  const rec = {
    id,
    name: sp.name || '',
    el: sp.el || '',
    rarity: sp.rarity || '',
    evolved: !!sp.evolved,
    dataArt: sp.art || '',
    family: style ? (style.family || '') : '',
    material: style && style.material != null ? style.material : (sp.material != null ? sp.material : null),
    signature: style ? (style.signature || 'none') : null,
    scale: style ? style.scale : null,
    idle: style ? (style.idle || '') : '',
    evolvesTo: sp.evolve && sp.evolve.to ? sp.evolve.to : '',
    rects: 0,
    smallRects: 0,
    bigRects: 0,
    bbox: null,
    issues: [],
    htmlSmall: '',
    htmlBig: '',
  };
  if (!style) {
    rec.issues.push('缺少 style');
    rec.htmlSmall = beastSvg(id, false);
    rec.htmlBig = beastSvg(id, true);
    return rec;
  }
  for (const size of ['small', 'big']) {
    let html = '';
    try {
      html = beastSvg(id, size === 'big');
    } catch (err) {
      rec.issues.push('draw 抛错(' + size + ')：' + errMessage(err));
      continue;
    }
    if (size === 'big') rec.htmlBig = html; else rec.htmlSmall = html;
    const svg = extractSvg(html);
    if (!svg) { rec.issues.push('未生成 SVG(' + size + ')'); continue; }
    const rects = countRects(svg);
    if (size === 'big') rec.bigRects = rects; else rec.smallRects = rects;
    if (!rec.bbox) {
      rec.bbox = parseBbox(svg);
      if (!rec.bbox) rec.issues.push('缺少 data-bbox(' + size + ')');
    }
    svgIssues(svg).forEach((issue) => rec.issues.push(issue));
  }
  rec.rects = rec.bigRects || rec.smallRects;
  if (rec.smallRects && rec.bigRects && rec.smallRects !== rec.bigRects) {
    rec.issues.push('大小图 rect 数不一致：' + rec.smallRects + ' vs ' + rec.bigRects);
  }
  if (rec.bbox) {
    if (!(rec.bbox.w >= 8 && rec.bbox.w <= 80)) rec.issues.push('bbox 宽越界：' + fmt(rec.bbox.w));
    if (!(rec.bbox.h >= 8 && rec.bbox.h <= 80)) rec.issues.push('bbox 高越界：' + fmt(rec.bbox.h));
    const aspect = rec.bbox.h > 0 ? rec.bbox.w / rec.bbox.h : 0;
    if (!(aspect >= 0.25 && aspect <= 4)) rec.issues.push('bbox 宽高比越界：' + fmt(aspect, 2));
  }
  if (rec.dataArt && rec.family && rec.dataArt !== rec.family) {
    rec.issues.push('物种 art 字段(' + rec.dataArt + ') 与 style.family(' + rec.family + ') 不一致');
  }
  rec.issues = [...new Set(rec.issues)];
  return rec;
}

function buildReport(source) {
  const loaded = loadArtContext(source.files);
  const { ctx, logs } = loaded;
  const SPECIES = readGlobal(ctx, 'SPECIES', null);
  const BEAST_STYLES = readGlobal(ctx, 'BEAST_STYLES', null);
  const beastSvg = readGlobal(ctx, 'beastSvg', null);
  if (!SPECIES || typeof SPECIES !== 'object') throw new Error('未找到 SPECIES（data/species.js 未加载？）');
  if (!BEAST_STYLES || typeof BEAST_STYLES !== 'object') throw new Error('未找到 BEAST_STYLES（art/beasts/kit.js 未加载？）');
  if (typeof beastSvg !== 'function') throw new Error('未找到 beastSvg()（art.js 未加载？）');

  const env = { ctx, beastSvg, SPECIES, BEAST_STYLES };
  const familyOrder = readGlobal(ctx, 'Object.keys(FAMILY_DEFAULTS)', []);
  const builderKeys = readGlobal(ctx, 'Object.keys(BEAST_BUILDERS)', []);
  const signatureKeys = readGlobal(ctx, 'Object.keys(SIGNATURES)', []);
  const speciesIds = Object.keys(SPECIES);
  const styleIds = Object.keys(BEAST_STYLES).filter((id) => id !== '__fallback');

  const beasts = speciesIds.map((id) => analyzeBeast(id, env));
  const byId = Object.fromEntries(beasts.map((rec) => [rec.id, rec]));

  const missingStyles = speciesIds.filter((id) => !BEAST_STYLES[id]);
  const orphanStyles = styleIds.filter((id) => !SPECIES[id]);
  const totalRects = beasts.reduce((sum, rec) => sum + rec.rects, 0);
  const rects = beasts.map((rec) => rec.rects).filter((n) => n > 0);

  const families = {};
  beasts.forEach((rec) => {
    const key = rec.family || '(无)';
    families[key] = families[key] || [];
    families[key].push(rec.id);
  });
  const dataFamilies = {};
  beasts.forEach((rec) => {
    const key = rec.dataArt || '(无)';
    dataFamilies[key] = dataFamilies[key] || 0;
    dataFamilies[key] += 1;
  });
  const rarities = {};
  beasts.forEach((rec) => { const key = rec.rarity || '(无)'; rarities[key] = (rarities[key] || 0) + 1; });

  // 同家族可区分性：rect 数 + bbox 完全相同的两只要标出来（新引擎要求同家族有区分度）。
  const sameFamilyDuplicates = [];
  Object.entries(families).forEach(([family, ids]) => {
    const groups = new Map();
    ids.forEach((id) => {
      const rec = byId[id];
      const bbox = rec.bbox ? [rec.bbox.x0, rec.bbox.y0, rec.bbox.x1, rec.bbox.y1].map((v) => fmt(v)).join(' ') : 'no-bbox';
      const fingerprint = rec.rects + '|' + bbox;
      if (!groups.has(fingerprint)) groups.set(fingerprint, []);
      groups.get(fingerprint).push(id);
    });
    groups.forEach((groupIds) => {
      if (groupIds.length > 1) sameFamilyDuplicates.push({ family, ids: groupIds, rects: byId[groupIds[0]].rects });
    });
  });

  const anomalies = beasts
    .filter((rec) => rec.issues.length)
    .map((rec) => ({ id: rec.id, issues: rec.issues, family: rec.family }));

  let gitHead = '';
  try {
    gitHead = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (err) { gitHead = ''; }

  return {
    generatedAt: new Date().toISOString(),
    nodeVersion: process.version,
    gitHead,
    baseDir: source.baseDir,
    displayBase: path.relative(ROOT, source.baseDir) || '.',
    mode: source.mode,
    scripts: source.labels,
    speciesCount: speciesIds.length,
    styleCount: styleIds.length,
    totalRects,
    rectMin: rects.length ? Math.min(...rects) : 0,
    rectMedian: median(rects),
    rectMax: rects.length ? Math.max(...rects) : 0,
    families,
    dataFamilies,
    rarities,
    familyOrder,
    builderKeys,
    signatureKeys,
    missingStyles,
    orphanStyles,
    sameFamilyDuplicates,
    anomalies,
    beasts,
    logs,
  };
}

function buildStatsText(report) {
  const lines = [];
  const push = (line) => lines.push(line);
  push('灵兽录 · 程序化立绘基线统计');
  push('生成时间：' + report.generatedAt);
  push('源码目录：' + report.displayBase + '（' + report.mode + '）');
  push('git HEAD：' + (report.gitHead || '未知'));
  push('Node：' + report.nodeVersion);
  push('加载脚本（' + report.scripts.length + '）：');
  report.scripts.forEach((name) => push('  - ' + name));
  push('');
  push('物种数：' + report.speciesCount);
  push('样式数：' + report.styleCount + '（另有 __fallback）');
  push('总 rect：' + report.totalRects + '（62 只各单次绘制口径）');
  push('单兽 rect：min ' + report.rectMin + ' / 中位 ' + report.rectMedian + ' / max ' + report.rectMax);
  push('rect 预算：总 ' + report.totalRects + ' / 60000，单兽最大 ' + report.rectMax + ' / 900');
  push('');
  push('家族分布（style.family）：');
  const familyKeys = report.familyOrder.filter((k) => report.families[k]).concat(
    Object.keys(report.families).filter((k) => report.familyOrder.indexOf(k) < 0),
  );
  familyKeys.forEach((key) => {
    push('  ' + key + ' × ' + report.families[key].length + '：' + report.families[key].join(', '));
  });
  push('');
  push('物种 art 字段分布：' + Object.entries(report.dataFamilies).map(([k, n]) => k + '×' + n).join('，'));
  push('稀有度分布：' + Object.entries(report.rarities).map(([k, n]) => k + '×' + n).join('，'));
  push('');
  push('同家族指纹重复（rect 数 + bbox 完全相同）：' + (report.sameFamilyDuplicates.length ? '' : '无'));
  report.sameFamilyDuplicates.forEach((dup) => {
    push('  - ' + dup.family + '（rect ' + dup.rects + '）：' + dup.ids.join(', '));
  });
  push('');
  push('异常列表：' + (report.anomalies.length ? report.anomalies.length + ' 只' : '无'));
  report.anomalies.forEach((item) => {
    push('  - [' + (item.family || '?') + '] ' + item.id + '：' + item.issues.join('；'));
  });
  if (report.logs.length) {
    push('');
    push('加载期 console 输出：');
    report.logs.forEach((log) => push('  [' + log.level + '] ' + log.text));
  }
  push('');
  push('每兽明细（id / 中文名 / family / 稀有度 / rect / data-bbox 宽×高 / material）：');
  report.beasts.forEach((rec) => {
    const bbox = rec.bbox ? fmt(rec.bbox.w) + '×' + fmt(rec.bbox.h) : '—';
    push('  ' + rec.id + ' / ' + (rec.name || '?') + ' / ' + (rec.family || '?') + ' / ' + (rec.rarity || '?') +
      ' / ' + rec.rects + ' / ' + bbox + ' / ' + (describeMaterial(rec.material) || '—') +
      (rec.issues.length ? ' / [' + rec.issues.join('；') + ']' : ''));
  });
  return lines.join('\n') + '\n';
}

const CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #0a0d13; color: #dfe6f2; font: 12px/1.45 "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; }
header { padding: 16px 18px 10px; border-bottom: 1px solid #1e2636; background: #0d1119; }
h1 { margin: 0 0 4px; font-size: 17px; color: #f2e6c4; letter-spacing: .5px; }
.sub { margin: 0 0 10px; color: #7d8aa3; font-size: 11px; }
.kpis { display: flex; gap: 20px; flex-wrap: wrap; margin: 0 0 10px; }
.kpi { min-width: 84px; }
.kpi b { display: block; font-size: 17px; color: #8fd0ff; line-height: 1.2; }
.kpi span { color: #7d8aa3; font-size: 10px; }
.tables { display: flex; gap: 24px; flex-wrap: wrap; }
table { border-collapse: collapse; font-size: 10.5px; }
table td { border: 1px solid #1e2636; padding: 2px 6px; white-space: nowrap; }
table td:first-child { color: #9fb6d8; }
.anomalies { margin-top: 10px; max-width: 1400px; font-size: 10.5px; color: #ff9a9a; }
.anomalies b { color: #ffc46a; }
.anomalies div { margin: 1px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 7px; padding: 12px 14px 26px; }
.card { display: flex; flex-direction: column; align-items: center; gap: 3px; background: linear-gradient(180deg, #121826, #0e1320); border: 1px solid #1e2636; border-radius: 6px; padding: 7px 6px 6px; }
.card[data-family="bird"], .card[data-family="crane"] { border-color: #24384a; }
.card[data-family="deer"], .card[data-family="fox"], .card[data-family="badger"], .card[data-family="rhino"] { border-color: #3a3020; }
.card[data-family="croc"], .card[data-family="dragon"] { border-color: #243a26; }
.card[data-family="spirit"] { border-color: #2a2438; }
.card[data-family="mermaid"], .card[data-family="clam"] { border-color: #1f3040; }
.arts { display: flex; align-items: flex-end; justify-content: center; gap: 4px; height: 118px; }
.art { display: flex; align-items: center; justify-content: center; }
.art.big { width: 112px; height: 112px; }
.art.small { width: 34px; height: 34px; background: #0a0f18; border: 1px solid #1a2230; border-radius: 3px; }
.art .beast-svg { width: 100%; height: 100%; }
.art .beast-svg svg { width: 100%; height: 100%; display: block; }
.beast-unknown { color: #ff9a9a; font-size: 20px; }
.meta { min-width: 0; width: 100%; text-align: center; }
.name { font-size: 12px; color: #f3ead0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.id { font: 9.5px/1.3 ui-monospace, Consolas, monospace; color: #9fb6d8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tags { font-size: 9.5px; color: #7d8aa3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.metric { font-size: 9px; color: #5f6c82; font-family: ui-monospace, Consolas, monospace; }
.badge { display: inline-block; border-radius: 2px; padding: 0 3px; margin-left: 3px; font-size: 8.5px; border: 1px solid; line-height: 1.35; }
.badge.rarity { border-color: #8b6b2f; color: #e8c86a; }
.badge.evo { border-color: #3f6b8f; color: #8fd0ff; }
.badge.material { border-color: #4a7a4a; color: #a8e88a; }
.badge.bad { border-color: #8f3f3f; color: #ff9a9a; }
.err { color: #ff9a9a; font-size: 9px; }
`;

function buildHtml(report) {
  const familyKeys = report.familyOrder.filter((k) => report.families[k]).concat(
    Object.keys(report.families).filter((k) => report.familyOrder.indexOf(k) < 0),
  );
  const familyRows = familyKeys.map((key) => '<tr><td>' + esc(key) + '</td><td>' + report.families[key].length + '</td></tr>').join('');
  const orderIndex = new Map();
  familyKeys.forEach((key, i) => orderIndex.set(key, i));
  const sorted = report.beasts.slice().sort((a, b) => {
    const fa = orderIndex.has(a.family) ? orderIndex.get(a.family) : 999;
    const fb = orderIndex.has(b.family) ? orderIndex.get(b.family) : 999;
    return fa - fb || report.beasts.indexOf(a) - report.beasts.indexOf(b);
  });

  const cards = sorted.map((rec) => {
    const badges = [
      rec.rarity ? '<span class="badge rarity">' + esc(rec.rarity) + '</span>' : '',
      rec.evolved ? '<span class="badge evo">进化</span>' : '',
      describeMaterial(rec.material) ? '<span class="badge material">' + esc(describeMaterial(rec.material)) + '</span>' : '',
      rec.issues.length ? '<span class="badge bad">异常</span>' : '',
    ].join('');
    const bbox = rec.bbox ? fmt(rec.bbox.w, 0) + '×' + fmt(rec.bbox.h, 0) : '—';
    const issues = rec.issues.slice(0, 2).map((issue) => {
      const short = issue.length > 68 ? issue.slice(0, 66) + '…' : issue;
      return '<div class="err" title="' + esc(issue) + '">' + esc(short) + '</div>';
    }).join('');
    return '<section class="card" data-beast="' + esc(rec.id) + '" data-family="' + esc(rec.family) + '">' +
      '<div class="arts"><div class="art big">' + rec.htmlBig + '</div><div class="art small">' + rec.htmlSmall + '</div></div>' +
      '<div class="meta"><div class="name">' + esc(rec.name) + badges + '</div>' +
      '<div class="id">' + esc(rec.id) + '</div>' +
      '<div class="tags">' + esc(rec.family || '?') + ' · ' + esc(rec.el || '?') + (rec.signature ? ' · ' + esc(rec.signature) : '') + '</div>' +
      '<div class="metric">rect ' + rec.rects + ' · bbox ' + bbox + '</div>' + issues + '</div></section>';
  }).join('\n');

  const anomalies = report.anomalies.length
    ? '<div class="anomalies"><b>异常 ' + report.anomalies.length + ' 只：</b>' +
      report.anomalies.slice(0, 16).map((item) => '<div>[' + esc(item.family || '?') + '] ' + esc(item.id) + '：' + esc(item.issues.join('；')) + '</div>').join('') +
      '</div>'
    : '';

  const dupText = report.sameFamilyDuplicates.length
    ? '<span style="color:#ffc46a">同家族指纹重复 ' + report.sameFamilyDuplicates.length + ' 组</span>'
    : '<span style="color:#a8e88a">同家族两两可区分</span>';

  return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>灵兽录 · 立绘预览（' + esc(report.displayBase) + '）</title><style>' + CSS + '</style></head><body>' +
    '<header><h1>灵兽录 · 程序化立绘预览</h1>' +
    '<p class="sub">源码：' + esc(report.displayBase) + '（' + esc(report.mode) + '） · git ' + esc(report.gitHead || '未知') +
    ' · Node ' + esc(report.nodeVersion) + ' · 生成于 ' + esc(report.generatedAt) + '</p>' +
    '<div class="kpis">' +
    '<div class="kpi"><b>' + report.speciesCount + '</b><span>物种</span></div>' +
    '<div class="kpi"><b>' + report.styleCount + '</b><span>样式</span></div>' +
    '<div class="kpi"><b>' + report.totalRects + '</b><span>总 rect（单次绘制）</span></div>' +
    '<div class="kpi"><b>' + report.rectMedian + '</b><span>单兽 rect 中位</span></div>' +
    '<div class="kpi"><b>' + report.rectMax + '</b><span>单兽 rect 最大</span></div>' +
    '<div class="kpi"><b>' + Object.keys(report.families).length + '</b><span>家族</span></div>' +
    '<div class="kpi"><b style="font-size:12px;line-height:1.6">' + dupText + '</b><span>区分度</span></div>' +
    '</div>' +
    '<div class="tables">' +
    '<table><tr><td>家族 style.family</td><td>只数</td></tr>' + familyRows + '</table>' +
    '<table><tr><td>稀有度</td><td>只数</td></tr>' +
    Object.entries(report.rarities).map(([k, n]) => '<tr><td>' + esc(k) + '</td><td>' + n + '</td></tr>').join('') +
    '</table>' +
    '<table><tr><td>加载脚本</td><td>顺序</td></tr>' +
    report.scripts.map((name, i) => '<tr><td>' + esc(name) + '</td><td>' + (i + 1) + '</td></tr>').join('') +
    '</table></div>' + anomalies + '</header>' +
    '<main class="grid">' + cards + '</main></body></html>\n';
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { console.log(USAGE); return; }
  const outFile = path.resolve(ROOT, opts.out || DEFAULT_OUT);
  const statsFile = opts.stats ? path.resolve(ROOT, opts.stats) : null;

  let source;
  try { source = resolveSources(opts.src); } catch (err) { fail(err.message); }
  let report;
  try { report = buildReport(source); } catch (err) { fail(err.message + (err.stack ? '\n' + err.stack.split('\n').slice(1, 4).join('\n') : '')); }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buildHtml(report), 'utf8');

  const statsText = buildStatsText(report);
  if (statsFile) {
    fs.mkdirSync(path.dirname(statsFile), { recursive: true });
    fs.writeFileSync(statsFile, statsText, 'utf8');
  }

  const familyKeys = Object.keys(report.families);
  console.log('灵兽录 · 立绘预览');
  console.log('  源码：' + report.displayBase + '（' + report.mode + '）');
  console.log('  脚本：' + report.scripts.length + ' 个（' + report.scripts.join(', ') + '）');
  console.log('  物种：' + report.speciesCount + ' · 样式：' + report.styleCount);
  console.log('  总 rect：' + report.totalRects + '（单兽 min ' + report.rectMin + ' / 中位 ' + report.rectMedian + ' / max ' + report.rectMax + '）');
  console.log('  家族：' + familyKeys.map((key) => key + '×' + report.families[key].length).join('，'));
  console.log('  同家族指纹重复：' + (report.sameFamilyDuplicates.length ? report.sameFamilyDuplicates.length + ' 组（' + report.sameFamilyDuplicates.map((d) => d.family + ': ' + d.ids.join('/')).join('；') + '）' : '无'));
  if (report.missingStyles.length) console.log('  缺样式：' + report.missingStyles.join(', '));
  if (report.orphanStyles.length) console.log('  多余样式：' + report.orphanStyles.join(', '));
  console.log('  异常：' + (report.anomalies.length ? report.anomalies.length + ' 只' : '无'));
  report.anomalies.slice(0, 8).forEach((item) => console.log('    - [' + (item.family || '?') + '] ' + item.id + '：' + item.issues.join('；')));
  if (report.logs.length) {
    report.logs.slice(0, 8).forEach((log) => console.log('  [' + log.level + '] ' + log.text));
  }
  console.log('  HTML：' + path.relative(ROOT, outFile));
  if (statsFile) console.log('  统计：' + path.relative(ROOT, statsFile));
}

main();
