// 灵兽录 · 支线境 · 青溪药圃 · 露重时分，药香先醒
REGIONS.yaopu = makeRegion({
    id: 'yaopu', name: '青溪药圃', chapter: 2, subtitle: '一畦露草，半庐药香',
    kind: 'side', unlock: { flag: 'yaopuOpen' },
    w: 42, h: 32, base: '.', spawn: { x: 5, y: 16 },
    weather: 'rain', tint: '#eef0e2', timeTint: '#f0f2e4',
    paint: function (m) {
      m.border('T', 2);
      // 药畦与水渠
      m.rect(4, 6, 34, 20, '.');
      m.rect(8, 8, 5, 4, ',');
      m.rect(16, 8, 5, 4, ',');
      m.rect(24, 8, 5, 4, ',');
      m.rect(8, 15, 5, 4, ',');
      m.rect(16, 15, 5, 4, ',');
      m.rect(24, 15, 5, 4, ',');
      m.rect(8, 22, 21, 3, ',');
      // 引水渠
      m.rect(4, 11, 34, 1, 'W');
      m.put(11, 11, 'b'); m.put(19, 11, 'b'); m.put(27, 11, 'b');
      // 药庐
      m.rect(34, 4, 6, 5, 'H');
      m.rect(32, 14, 7, 8, '.');
      // 出口
      m.put(2, 16, 'E');
    },
    exits: [
      { to: 'shanmen', x: 2, y: 16, need: null, label: '回山门 · 药圃小径' },
    ],
    pool: [
      { sp: 'qingheng', lv: [4, 8] },
      { sp: 'taishi', lv: [4, 8] },
      { sp: 'xianyao', lv: [5, 9] },
      { sp: 'tongling', lv: [5, 9] },
    ],
    boss: null,
    npcs: [
      {
        id: 'yaopu_keeper', name: '药圃婆婆', sprite: 'samurai_green', tint: 0xe8f0d8, scale: 2.3,
        x: 9, y: 24, dir: 'down',
        lines: ['药圃不问来客，只问手稳不稳。', '露生草要趁露未干采，干了就只剩草。', '阿蘅把你引来的？那这畦药你随便看。'],
        onTalk: function () { LB.flagSet('yaopuKeeperMet', true); },
      },
      {
        id: 'yaopu_girl', name: '采药女·芩', sprite: 'ninja_blue', tint: 0xd8f0d8, scale: 2.1,
        x: 18, y: 10, dir: 'down',
        lines: ['我认得每一株草，却认不出哪株愿意跟我走。', '婆婆说，采药先问三声，不答就换一株。'],
        onTalk: function () { LB.flagSet('yaopuGirlMet', true); },
      },
      {
        id: 'yaopu_beekeeper', name: '养蜂人·糖', sprite: 'samurai_green', tint: 0xf0d8a8, scale: 2.2,
        x: 27, y: 24, dir: 'down',
        lines: ['蜂不蜇采药人，只蜇抢蜜的。', '药圃花蜜能安灵息，你带一瓶走。'],
        onTalk: function () { LB.flagSet('yaopuBeeMet', true); },
      },
      {
        id: 'yaopu_boy', name: '药童·七', sprite: 'ninja_blue', tint: 0xe8e0c8, scale: 1.8,
        x: 34, y: 18, dir: 'down',
        lines: ['我把药方背面画成了地图，先生没看出来。', '水渠尽头有一块旧碑，石头会自己冒露。'],
        onTalk: function () { LB.flagSet('yaopuBoyMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'yaopu_g1', x: 9, y: 9, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'yaopu_g2', x: 17, y: 9, mat: 'yaopuhua', amount: 2, label: '采得药圃花 2 朵', respawn: 'chapter' },
      { id: 'yaopu_g3', x: 25, y: 16, mat: 'lucao', amount: 1, label: '采得露生草', respawn: 'chapter' },
      { id: 'yaopu_g4', x: 30, y: 23, mat: 'yaopuhua', amount: 1, label: '采得药圃花', respawn: 'chapter' },
    ],
    chests: [
      { id: 'yaopu_chest1', name: '药庐木箱', x: 32, y: 10, jade: 10, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 10' },
      { id: 'yaopu_chest2', name: '渠边药匣', x: 13, y: 13, jade: 12, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 12' },
      { id: 'yaopu_chest3', name: '蜂房暗箱', x: 29, y: 26, jade: 14, items: [{ id: 'charm', count: 1 }], label: '拾得灵符 1 张 · 灵玉 14' },
      { id: 'yaopu_chest4', name: '旧圃残匣', x: 5, y: 28, jade: 16, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 16' },
    ],
    props: [
      { type: 'house', x: 35, y: 5, frame: 'house2' },
      { type: 'well', x: 6, y: 14 },
      { type: 'jars', x: 31, y: 18 },
      { type: 'barrels', x: 12, y: 27 },
      { type: 'tea', x: 8, y: 27 },
      { type: 'sweep', x: 22, y: 27 },
      { type: 'notice', x: 33, y: 12 },
    ],
    steles: [
      { id: 'yaopu_stele1', x: 38, y: 12, title: '药圃旧记', text: '「露生草生于雾薄处，叶上有露者活，无露者已被锁。勿拔根，勿断渠，勿问药为何苦。」', codex: 'yaopu_yao' },
      { id: 'yaopu_stele2', x: 6, y: 6, title: '一畦一誓', text: '「一畦药养一境人。药不够，先给最不会开口的那个。」', codex: 'yaopu_shi' },
    ],
  });
