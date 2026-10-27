// 工程自检：资源引用存在、版本号一致、PWA 清单与图标齐全。
// 用法：node scripts/check.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const html = fs.readFileSync(path.join(pub, 'index.html'), 'utf8');
const problems = [];

const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
  .filter((ref) => !/^(http|data:|#)/.test(ref));
refs.forEach((ref) => {
  const clean = ref.split('?')[0];
  if (!fs.existsSync(path.join(pub, clean))) problems.push('缺少资源：' + ref);
});

const versions = [...html.matchAll(/\?v=(\d+)/g)].map((m) => m[1]);
const uniq = [...new Set(versions)];
if (uniq.length > 1) problems.push('资源版本不一致：' + uniq.join(', '));
const version = uniq[0] || '';

const swPath = path.join(pub, 'sw.js');
if (!fs.existsSync(swPath)) problems.push('缺少 sw.js');
else {
  const sw = fs.readFileSync(swPath, 'utf8');
  const m = sw.match(/const VERSION = '(\d+)';/);
  if (!m) problems.push('sw.js 缺少 VERSION');
  else if (m[1] !== version) problems.push('sw.js 版本 ' + m[1] + ' 与 index.html 的 v' + version + ' 不一致');
}

const manifestPath = path.join(pub, 'manifest.webmanifest');
if (!fs.existsSync(manifestPath)) problems.push('缺少 manifest.webmanifest');
else {
  let manifest = null;
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) { problems.push('manifest 不是合法 JSON'); }
  if (manifest) {
    (manifest.icons || []).forEach((icon) => {
      if (!fs.existsSync(path.join(pub, icon.src))) problems.push('缺少图标：' + icon.src);
    });
  }
}

if (problems.length) {
  console.error('检查失败 (' + problems.length + ')：\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('检查通过 · v' + version + ' · ' + refs.length + ' 个本地资源引用 · PWA 图标齐全');
