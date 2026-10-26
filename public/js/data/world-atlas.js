// 灵兽录 · 数据层 · 九嶂大陆图册
// ---------- 说明 ----------
// 本文件只负责「世界地图怎么画、区域在地图上的哪一块」，不改区域内部内容。
// 新增一张地图的固定流程：
//   1) 在 js/data/regions/ 建 region-xxx.js，REGIONS.xxx = makeRegion({...})
//   2) 在 index.html 引入该文件（放在 world-atlas.js 之后、weather.js 之前）
//   3) 在下方 regions 里补一条：{ at, size, kind, color, built: true }
//   4) 在 routes 里补至少一条通路
//   5) 跑一次 validateContent()，大陆图会自动出现新地块

const WORLD_ATLAS = {
  id: 'jiuzhang',
  name: '九嶂大荒',
  grid: { w: 56, h: 38 },

  // 大陆轮廓：椭圆块叠加，渲染时用 hash2 噪声抖出像素海岸
  land: [
    { x: 10, y: 14, rx: 9, ry: 9 },
    { x: 14, y: 8, rx: 7, ry: 6 },
    { x: 11, y: 21, rx: 6, ry: 5 },
    { x: 22, y: 14, rx: 10, ry: 9 },
    { x: 34, y: 12, rx: 8, ry: 9 },
    { x: 46, y: 14, rx: 8, ry: 8 },
    { x: 32, y: 22, rx: 11, ry: 8 },
    { x: 30, y: 31, rx: 13, ry: 8 },
    { x: 44, y: 30, rx: 7, ry: 7 },
    { x: 50, y: 28, rx: 8, ry: 7 },
    { x: 8, y: 31, rx: 6, ry: 6 },
    { x: 50, y: 8, rx: 6, ry: 6 },
    { x: 38, y: 34, rx: 6, ry: 5 },
  ],

  // 山脉：折线，渲染为像素三角
  ridges: [
    { path: [[23, 5], [29, 8], [35, 7], [41, 10]], size: 1.15, snow: true },
    { path: [[8, 26], [12, 29], [18, 30], [23, 29]], size: 0.95 },
    { path: [[38, 21], [42, 26], [46, 28]], size: 1.0 },
    { path: [[27, 36], [33, 35], [38, 36]], size: 0.9 },
  ],

  // 地貌分带：只影响陆地底色与纹理，不改变区域内容
  biomes: [
    { type: 'meadow', x: 14, y: 25, rx: 6, ry: 5, color: '#c6c795', color2: '#bdc08c' },
    { type: 'forest', x: 22, y: 14, rx: 7, ry: 6, color: '#aeb98a', color2: '#a5b081' },
    { type: 'highland', x: 29, y: 9, rx: 7, ry: 5, color: '#cbb68d', color2: '#c3ae85' },
    { type: 'rock', x: 34, y: 16, rx: 5, ry: 4, color: '#c4b291', color2: '#bba886' },
    { type: 'marsh', x: 40, y: 24, rx: 7, ry: 5, color: '#a9b7a0', color2: '#a0ae97' },
    { type: 'ash', x: 32, y: 31, rx: 6, ry: 4, color: '#c8a48b', color2: '#bf9b82' },
    { type: 'void', x: 25, y: 33, rx: 5, ry: 4, color: '#b7a9c1', color2: '#ae9fb8' },
  ],

  // 深水区：让海面有深浅层次
  deepSea: [
    { x: 2, y: 3, rx: 7, ry: 4 },
    { x: 53, y: 2, rx: 6, ry: 4 },
    { x: 4, y: 36, rx: 8, ry: 3 },
    { x: 54, y: 36, rx: 5, ry: 3 },
  ],

  // 云影：缓慢漂移的像素云
  clouds: [
    { x: 9, y: 7, w: 8, speed: 46, delay: 0 },
    { x: 30, y: 18, w: 11, speed: 38, delay: -14 },
    { x: 45, y: 29, w: 8, speed: 52, delay: -26 },
    { x: 21, y: 28, w: 9, speed: 34, delay: -7 },
  ],

  // 林带：每处 3-5 株像素树
  forests: [
    { x: 12, y: 17, n: 4 }, { x: 16, y: 21, n: 3 }, { x: 28, y: 22, n: 5 },
    { x: 45, y: 18, n: 4 }, { x: 22, y: 29, n: 3 }, { x: 41, y: 33, n: 3 },
  ],

  // 水系：河流折线 + 湖
  rivers: [
    { path: [[42, 9], [42, 14], [44, 19], [42, 25], [40, 29], [37, 34], [34, 37]] },
    { path: [[18, 9], [18, 13], [20, 17], [19, 23], [17, 28], [16, 32]] },
  ],
  lakes: [ { x: 15, y: 34, r: 2 }, { x: 49, y: 12, r: 1 } ],

  // 区域地块：at 为左上角，size 为格数
  // built: false 表示「已规划但尚未做内容」，原型阶段淡显为「未辟」
  regions: {
    shanmen: { at: [9, 20], size: [5, 4], kind: 'hub', color: '#d9a527', built: true },
    qingxi: { at: [14, 24], size: [5, 4], kind: 'main', color: '#4a7a5c', built: true },
    wuyin: { at: [21, 13], size: [5, 4], kind: 'main', color: '#2f5e46', built: true },
    luoxing: { at: [27, 8], size: [5, 4], kind: 'main', color: '#8a6b3f', built: true },
    guixu: { at: [33, 16], size: [5, 4], kind: 'main', color: '#3c6f8c', built: true },
    yunmeng: { at: [39, 23], size: [5, 4], kind: 'main', color: '#4f8c8c', built: true },
    gutan: { at: [31, 30], size: [5, 4], kind: 'main', color: '#b04a30', built: true },
    shenyuan: { at: [24, 32], size: [5, 4], kind: 'main', color: '#8a5fc9', built: true },

    // 第二卷主线
    yunzhan: { at: [43, 8], size: [5, 4], kind: 'main', color: '#6d8a9a', built: true },
    xuangu: { at: [47, 15], size: [5, 4], kind: 'main', color: '#c06a30', built: true },
    chenyu: { at: [50, 22], size: [5, 4], kind: 'main', color: '#2f6f8c', built: true },
    jiuzhang: { at: [45, 30], size: [5, 5], kind: 'main', color: '#b9a883', built: true },

    // 支线境
    yaopu: { at: [18, 18], size: [3, 3], kind: 'side', color: '#6aa86a', built: true, short: '药圃' },
    anshi: { at: [38, 12], size: [3, 3], kind: 'side', color: '#2f9e64', built: true, short: '暗市' },
    rongku: { at: [37, 35], size: [3, 3], kind: 'side', color: '#cf4b3a', built: true, short: '熔窟' },
    jingdi: { at: [25, 24], size: [3, 3], kind: 'secret', color: '#4a7a8c', built: true, short: '古井' },

    // 秘境
    xingkeng: { at: [33, 6], size: [4, 3], kind: 'secret', color: '#8a5fc9', built: true, short: '星坑' },
    shihai: { at: [19, 31], size: [4, 3], kind: 'secret', color: '#7d6c4e', built: true, short: '石海' },
    beilin: { at: [4, 14], size: [4, 3], kind: 'secret', color: '#a87c4a', built: true, short: '碑林' },
  },

  // 预留空白：只画地块与「未名」，不进 REGIONS
  reserved: [
    { at: [4, 6], size: [4, 4], label: '未名·其一' },
    { at: [12, 5], size: [4, 4], label: '未名·其二' },
    { at: [50, 4], size: [4, 4], label: '未名·其三' },
    { at: [52, 29], size: [4, 4], label: '未名·其四' },
    { at: [6, 30], size: [4, 4], label: '未名·其五' },
  ],

  // 通路：第三项为 1 时画虚线旧路
  routes: [
    ['shanmen', 'qingxi'], ['qingxi', 'wuyin'], ['wuyin', 'luoxing'], ['luoxing', 'guixu'],
    ['guixu', 'yunmeng'], ['yunmeng', 'gutan'], ['gutan', 'shenyuan'],
    ['luoxing', 'yunzhan'], ['yunzhan', 'xuangu'], ['xuangu', 'chenyu'], ['chenyu', 'jiuzhang'],
    ['shanmen', 'yaopu'], ['guixu', 'anshi'], ['gutan', 'rongku'], ['wuyin', 'jingdi'],
    ['luoxing', 'xingkeng'], ['gutan', 'shihai'], ['shanmen', 'beilin'],
    ['shanmen', 'gutan', 1],
  ],
};
