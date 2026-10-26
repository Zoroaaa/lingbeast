// 灵兽录 · 第二卷 · 第十二境 · 五色石林，灵脉天根
REGIONS.jiuzhang = makeRegion({
    id: 'jiuzhang', name: '九嶂天根', chapter: 12, subtitle: '山至此尽，根由此生',
    kind: 'main',
    w: 66, h: 54, base: '.', spawn: { x: 4, y: 28 },
    weather: 'clear', tint: '#eee8d8', timeTint: '#f0eadc',
    paint: function (m) {
      m.border('C', 2);
      // 进山石道
      m.rect(2, 24, 24, 9, '.');
      m.rect(2, 28, 26, 1, ',');
      // 五色石林
      m.rect(24, 8, 34, 36, '.');
      m.rect(24, 26, 30, 5, ',');
      // 两侧水脉
      m.rect(20, 2, 2, 50, 'W');
      m.put(20, 28, 'b'); m.put(21, 28, 'b');
      m.rect(58, 2, 2, 50, 'W');
      m.put(58, 28, 'b'); m.put(59, 28, 'b');
      // 石柱群
      m.blob(28, 12, 3, 'R');
      m.blob(36, 16, 2, 'R');
      m.blob(46, 10, 3, 'R');
      m.blob(52, 20, 2, 'R');
      m.blob(30, 38, 3, 'R');
      m.blob(42, 42, 3, 'R');
      m.blob(50, 36, 2, 'R');
      // 天根祭坛
      m.blob(50, 27, 5, '.');
      m.put(50, 27, 'A');
      // 北坡雪线与南崖
      m.rect(24, 2, 34, 3, 'C');
      m.rect(24, 48, 34, 4, 'C');
      // 出口
      m.put(2, 28, 'E');
    },
    exits: [
      { to: 'chenyu', x: 2, y: 28, need: null, label: '西行 · 回沉城' },
    ],
    pool: [
      { sp: 'yueji', lv: [36, 40] },
      { sp: 'cangming', lv: [36, 40] },
      { sp: 'senluo', lv: [36, 40] },
      { sp: 'feiyan', lv: [36, 40] },
      { sp: 'shuangling', lv: [36, 39] },
      { sp: 'xingxi', lv: [37, 40] },
    ],
    boss: 'tiangen',
    npcs: [
      {
        id: 'tian_warden', name: '守根人·无年', sprite: 'samurai_green', tint: 0xe8e0cc, scale: 2.7,
        x: 10, y: 26, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('boss_tiangen')) return ['天根认得你了。往后的山门，不必再问旧契。', '山外还有山，但那是另一个故事了。'];
          if (LB.flag('tiangenSteles')) return ['四块根碑都读过了？那就去吧。它不会问你来意，只看你带没带名字。', '祭坛在东边石林心口。'];
          if (chapterNow() <= 12) return ['九嶂的山，到这儿才露根。', '先把四块根碑读完。读不全，天根不认。', '它曾是五灵祖兽的影，如今只守着一条不肯断的脉。'];
          return ['根在，山就在。', '你听，石林里有水声，那是灵脉在走。'];
        },
        onTalk: function () { LB.flagSet('tianWardenMet', true); },
      },
      {
        id: 'jiuzhang_hermit', name: '石林隐者', sprite: 'ninja_blue', tint: 0xd8e0d8, scale: 2.3,
        x: 18, y: 20, dir: 'down',
        lines: ['石林会挪步，今日的路明日未必还在。', '跟着水声走，水记得旧路。'],
        onTalk: function () { LB.flagSet('tianHermitMet', true); },
      },
      {
        id: 'jiuzhang_scribe', name: '刻根者·石笔', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.3,
        x: 26, y: 30, dir: 'down', service: 'codex',
        lines: ['根碑不是刻给山看的，是刻给后来人看的。', '你读一块，山就少一分遗忘。'],
      },
      {
        id: 'jiuzhang_guard', name: '五色石卫·甲', sprite: 'samurai_green', tint: 0xc8c0b0, scale: 2.5,
        x: 44, y: 22, dir: 'down',
        lines: ['祭坛前不许带锁灵器。', '你若带了，我不会拦你；它会拦。'],
        onTalk: function () { LB.flagSet('tianGuardMet', true); },
      },
      {
        id: 'jiuzhang_child', name: '拾石童', sprite: 'ninja_blue', tint: 0xf0e0d0, scale: 1.8,
        x: 34, y: 34, dir: 'down',
        lines: ['五色石各少一块，我找了一整年。', '阿爹说，缺的那块在自己身上。'],
        onTalk: function () { LB.flagSet('tianChildMet', true); },
      },
      {
        id: 'jiuzhang_smith', name: '守脉匠·石臼', sprite: 'samurai_green', tint: 0xc8b898, scale: 2.3,
        x: 16, y: 30, dir: 'down', service: 'craft',
        lines: ['天根露要五色石粉引，才收得住。', '最后一炉了，别浪费。'],
      },
    ],
    herbs: [],
    gathers: [
      { id: 'jiuzhang_g1', x: 14, y: 24, mat: 'tiangenxu', amount: 1, label: '采得天根须', respawn: 'chapter' },
      { id: 'jiuzhang_g2', x: 38, y: 28, mat: 'yunwen', amount: 2, label: '采得云纹石 2 块', respawn: 'chapter' },
      { id: 'jiuzhang_g3', x: 46, y: 40, mat: 'tiangenxu', amount: 1, label: '采得天根须', respawn: 'chapter' },
    ],
    chests: [
      { id: 'jiuzhang_chest1', name: '山口旧箱', x: 8, y: 32, jade: 36, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 36' },
      { id: 'jiuzhang_chest2', name: '石林暗匣', x: 28, y: 16, jade: 42, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 42' },
      { id: 'jiuzhang_chest3', name: '水脉石箱', x: 36, y: 44, jade: 44, items: [{ id: 'charm', count: 3 }], label: '拾得灵符 3 张 · 灵玉 44' },
      { id: 'jiuzhang_chest4', name: '祭坛供匣', x: 50, y: 32, jade: 48, items: [{ id: 'revive', count: 1 }], label: '拾得归元丹 1 枚 · 灵玉 48' },
      { id: 'jiuzhang_chest5', name: '北坡行囊', x: 44, y: 6, jade: 40, items: [{ id: 'incense', count: 1 }], flag: 'tiangenSteles', label: '读全根碑 · 拾得引灵香 · 灵玉 40' },
    ],
    props: [
      { type: 'altar', x: 50, y: 27 },
      { type: 'lantern', x: 46, y: 27 },
      { type: 'lantern', x: 54, y: 27 },
      { type: 'censer', x: 48, y: 25 },
      { type: 'censer', x: 52, y: 25 },
      { type: 'sign', x: 14, y: 27 },
      { type: 'well', x: 20, y: 18 },
      { type: 'stoneTable', x: 18, y: 34 },
      { type: 'offering', x: 40, y: 30 },
      { type: 'wish', x: 32, y: 24 },
      { type: 'jars', x: 24, y: 42 },
      { type: 'sweep', x: 8, y: 38 },
    ],
    steles: [
      { id: 'jiuzhang_stele1', x: 12, y: 20, title: '天根总碑', text: '「九嶂之山，皆自一根生。根断则山散，根在则灵归。」', codex: 'jiuzhang_gen' },
      { id: 'jiuzhang_stele2', x: 32, y: 10, title: '五色石记', text: '青赤黄白黑，五石各守一脉。缺一则灵脉不圆，补之者须以自己的名字为引。', codex: 'jiuzhang_wuse' },
      { id: 'jiuzhang_stele3', x: 24, y: 40, title: '祖兽旧约', text: '「五灵祖兽以身为山，以息为河。后人若立新契，须先听山愿不愿。」', codex: 'jiuzhang_yue' },
      { id: 'jiuzhang_stele4', x: 44, y: 16, title: '天根钟铭', text: '钟身无字，只有一道深深的指痕。指尖朝向山门。', codex: 'jiuzhang_zhong' },
    ],
  });
