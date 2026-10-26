// 灵兽录 · 秘境 · 星陨坑 · 星落成坑，坑底有光
REGIONS.xingkeng = makeRegion({
    id: 'xingkeng', name: '星陨坑', chapter: 10, subtitle: '星落之后，坑底仍亮',
    kind: 'secret', unlock: { chapter: 10 },
    w: 52, h: 40, base: '.', spawn: { x: 4, y: 20 },
    weather: 'clear', tint: '#e8e2d0', timeTint: '#eae4d4',
    paint: function (m) {
      m.border('C', 2);
      // 坑缘与坑底
      m.rect(6, 12, 40, 16, '.');
      m.blob(26, 20, 9, '.');
      m.blob(26, 20, 5, 'D');
      m.blob(26, 20, 2, 'A');
      // 陨铁碎块
      m.blob(18, 14, 2, 'R');
      m.blob(34, 16, 2, 'R');
      m.blob(30, 26, 2, 'R');
      m.blob(14, 24, 1, 'R');
      // 坑道
      m.rect(2, 20, 8, 1, ',');
      m.rect(44, 20, 6, 1, ',');
      m.rect(26, 4, 2, 8, ',');
      // 星尘水洼
      m.blob(20, 28, 2, 'W');
      m.blob(38, 10, 2, 'W');
      m.put(2, 20, 'E');
    },
    exits: [
      { to: 'luoxing', x: 2, y: 20, need: null, label: '回落星原 · 坑道' },
    ],
    pool: [
      { sp: 'yuntie', lv: [22, 27] },
      { sp: 'xingxi', lv: [23, 27] },
      { sp: 'jinyu', lv: [22, 26] },
      { sp: 'shuangling', lv: [23, 27] },
      { sp: 'xinghai', lv: [24, 28] },
    ],
    boss: null,
    npcs: [
      {
        id: 'xingkeng_warden', name: '坑守·星砂', sprite: 'ninja_blue', tint: 0xd8d0e0, scale: 2.3,
        x: 8, y: 18, dir: 'down',
        lines: ['坑底的东西不属于九嶂，捡之前先问一句。', '星屑夜里会亮，白天只是灰。', '你要找星骸鸟，得等到风停。'],
        onTalk: function () { LB.flagSet('xingkengWardenMet', true); },
      },
      {
        id: 'xingkeng_miner', name: '拾星人·矿', sprite: 'samurai_green', tint: 0xc8b8a8, scale: 2.2,
        x: 18, y: 24, dir: 'down',
        lines: ['陨铁硬，星屑轻，两样都不好卖。', '我在这里捡了十年，只捡到一块会发热的。'],
        onTalk: function () { LB.flagSet('xingkengMinerMet', true); },
      },
      {
        id: 'xingkeng_stargazer', name: '观星人·夜图', sprite: 'ninja_blue', tint: 0xd8d8e8, scale: 2.3,
        x: 36, y: 22, dir: 'down', service: 'codex',
        lines: ['星落下来的时候，九嶂的灵脉会歪一寸。', '坑底的星图不是刻的，是烧出来的。'],
        onTalk: function () { LB.flagSet('xingkengStarMet', true); },
      },
      {
        id: 'xingkeng_hunter', name: '星坑猎户', sprite: 'samurai_green', tint: 0xd8c8b8, scale: 2.2,
        x: 40, y: 14, dir: 'down',
        lines: ['星骸鸟只在坑底起雾时落下来。', '它的骨头里也有星屑，别全拿走。'],
        onTalk: function () { LB.flagSet('xingkengHunterMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'xingkeng_g1', x: 14, y: 16, mat: 'xingxie', amount: 2, label: '拾得星屑 2 份', respawn: 'chapter' },
      { id: 'xingkeng_g2', x: 32, y: 24, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'chapter' },
      { id: 'xingkeng_g3', x: 36, y: 14, mat: 'leisui', amount: 1, label: '拾得雷髓', respawn: 'weather' },
    ],
    chests: [
      { id: 'xingkeng_chest1', name: '坑缘木箱', x: 8, y: 14, jade: 28, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 28' },
      { id: 'xingkeng_chest2', name: '陨铁暗匣', x: 22, y: 12, jade: 34, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 34' },
      { id: 'xingkeng_chest3', name: '坑底石箱', x: 30, y: 20, jade: 38, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 38' },
      { id: 'xingkeng_chest4', name: '星图暗格', x: 44, y: 22, jade: 36, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 36' },
      { id: 'xingkeng_chest5', name: '发热的陨块', x: 24, y: 30, jade: 40, items: [{ id: 'charm', count: 2 }], flag: 'xingkengWarm', label: '拾得会发热的陨块 · 灵玉 40' },
    ],
    props: [
      { type: 'altar', x: 26, y: 20 },
      { type: 'lantern', x: 22, y: 18 },
      { type: 'lantern', x: 30, y: 18 },
      { type: 'sign', x: 10, y: 20 },
      { type: 'stoneTable', x: 14, y: 26 },
      { type: 'jars', x: 34, y: 28 },
      { type: 'sweep', x: 6, y: 24 },
    ],
    steles: [
      { id: 'xingkeng_stele1', x: 12, y: 10, title: '星陨坑记', text: '「星落成坑，坑底有光。光不属于九嶂，也不肯走。」', codex: 'xingkeng_keng' },
      { id: 'xingkeng_stele2', x: 30, y: 8, title: '陨铁铭', text: '「陨铁不锈，因它记得自己从哪颗星来。」', codex: 'xingkeng_xing' },
      { id: 'xingkeng_stele3', x: 42, y: 28, title: '星骸刻', text: '「星骸鸟落一次，坑底的雾便淡一分。别赶它。」', codex: 'xingkeng_hai' },
    ],
  });
