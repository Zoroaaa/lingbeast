// 统一资源版本号：重写 index.html 的 ?v= 与 sw.js 的 VERSION。
// 用法：node scripts/version.mjs --bump   或   node scripts/version.mjs 74
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'public', 'index.html');
const swPath = path.join(root, 'public', 'sw.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const found = [...html.matchAll(/\?v=(\d+)/g)].map((m) => Number(m[1]));
if (!found.length) {
  console.error('index.html 中没有找到 ?v= 版本号');
  process.exit(1);
}
const max = Math.max(...found);
const arg = process.argv[2];
let target = max;
if (arg === '--bump') target = max + 1;
else if (arg && /^\d+$/.test(arg)) target = Number(arg);
if (!target || target < 1) {
  console.error('版本号必须是正整数');
  process.exit(1);
}

let count = 0;
const nextHtml = html.replace(/\?v=\d+/g, function () {
  count += 1;
  return '?v=' + target;
});
fs.writeFileSync(htmlPath, nextHtml, 'utf8');

if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, 'utf8');
  const nextSw = sw.replace(/const VERSION = '\d+';/, "const VERSION = '" + target + "';");
  if (nextSw !== sw) fs.writeFileSync(swPath, nextSw, 'utf8');
}
console.log('v' + max + ' → v' + target + ' · ' + count + ' 处资源引用');
