// 生成 PWA 图标：16×16 像素狐首，按整数倍放大为 192 / 512 PNG。
// 用法：node scripts/make-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const OUT = path.join(process.cwd(), 'public', 'icons');

const COLORS = {
  bg: [242, 237, 226],
  ink: [58, 50, 38],
  orange: [224, 120, 60],
  deep: [169, 76, 36],
  pale: [248, 228, 192],
  gold: [242, 208, 106],
  white: [255, 255, 255],
  green: [79, 138, 90],
};

function blank() {
  return Array.from({ length: 16 }, () => Array(16).fill('bg'));
}

function rect(art, x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (yy >= 0 && yy < 16 && xx >= 0 && xx < 16) art[yy][xx] = color;
    }
  }
}

function foxArt(withFrame) {
  const art = blank();
  if (withFrame) {
    rect(art, 0, 0, 16, 1, 'ink');
    rect(art, 0, 15, 16, 1, 'ink');
    rect(art, 0, 0, 1, 16, 'ink');
    rect(art, 15, 0, 1, 16, 'ink');
  }
  // 耳朵
  rect(art, 3, 4, 3, 3, 'ink');
  rect(art, 4, 5, 1, 1, 'orange');
  rect(art, 10, 4, 3, 3, 'ink');
  rect(art, 11, 5, 1, 1, 'orange');
  // 头
  rect(art, 3, 6, 10, 7, 'ink');
  rect(art, 4, 7, 8, 5, 'orange');
  rect(art, 5, 6, 6, 1, 'orange');
  // 额心
  rect(art, 7, 6, 2, 1, 'gold');
  // 眼
  rect(art, 5, 8, 2, 2, 'ink');
  rect(art, 5, 8, 1, 1, 'white');
  rect(art, 9, 8, 2, 2, 'ink');
  rect(art, 9, 8, 1, 1, 'white');
  // 吻与鼻
  rect(art, 6, 10, 4, 2, 'pale');
  rect(art, 7, 10, 2, 1, 'ink');
  // 下颌阴影
  rect(art, 4, 12, 8, 1, 'deep');
  // 底部一点草色，暗示山野
  rect(art, 3, 13, 2, 1, 'green');
  rect(art, 11, 13, 2, 1, 'green');
  return art;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typ = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typ, data])), 0);
  return Buffer.concat([len, typ, data, crc]);
}

function png(size, art) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const scale = size / 16;
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const c = COLORS[art[Math.floor(y / scale)][Math.floor(x / scale)]] || COLORS.bg;
      const at = row + 1 + x * 4;
      raw[at] = c[0];
      raw[at + 1] = c[1];
      raw[at + 2] = c[2];
      raw[at + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync(OUT, { recursive: true });
const frame = foxArt(true);
const plain = foxArt(false);
fs.writeFileSync(path.join(OUT, 'icon-192.png'), png(192, frame));
fs.writeFileSync(path.join(OUT, 'icon-512.png'), png(512, frame));
fs.writeFileSync(path.join(OUT, 'icon-maskable-512.png'), png(512, plain));
console.log('icons written:', fs.readdirSync(OUT).join(', '));
