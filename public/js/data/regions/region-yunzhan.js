// 灵兽录 · 第二卷 · 第九境 · 云上旧驿，风门遗灯
REGIONS.yunzhan = makeRegion({
    id: 'yunzhan', name: '云栈遗门', chapter: 9, subtitle: '云上有门，门后无阶',
    kind: 'main', travelHub: true,
    w: 68, h: 50, base: '.', spawn: { x: 6, y: 24 },
    weather: 'clear', tint: '#eef0ea', timeTint: '#eff1eb',
    paint: function (m) {
      m.border('C', 2);
      // 东西主道与云海断崖
      m.rect(2, 22, 64, 7, '.');
      m.rect(2, 24, 64, 1, ',');
      // 北台：旧驿与风门
      m.rect(6, 4, 26, 15, '.');
      m.rect(13, 18, 3, 5, '.');
      m.rect(14, 14, 1, 5, ',');
      // 东台：悬灯台与风门石阶
      m.rect(50, 4, 14, 14, '.');
      m.rect(57, 14, 2, 9, ',');
      // 南台：栈道村与旧井
      m.rect(37, 31, 27, 14, '.');
      m.rect(50, 27, 3, 5, ',');
      // 两道云海裂谷，靠木栈相连
      m.rect(18, 2, 3, 45, 'C');
      m.put(18, 24, 'b'); m.put(19, 24, 'b'); m.put(20, 24, 'b');
      m.put(18, 10, 'b'); m.put(19, 10, 'b'); m.put(20, 10, 'b');
      m.rect(40, 2, 3, 45, 'C');
      m.put(40, 24, 'b'); m.put(41, 24, 'b'); m.put(42, 24, 'b');
      m.put(40, 36, 'b'); m.put(41, 36, 'b'); m.put(42, 36, 'b');
      // 风蚀石柱与断墙
      m.rect(8, 2, 6, 2, 'C');
      m.rect(30, 2, 8, 2, 'C');
      m.rect(44, 2, 4, 2, 'C');
      m.rect(8, 44, 10, 4, 'C');
      m.rect(60, 44, 6, 4, 'C');
      // 出口
      m.put(2, 24, 'E');
      m.put(65, 24, 'E');
    },
    exits: [
      { to: 'luoxing', x: 2, y: 24, need: null, label: '西行 · 回落星原' },
      { to: 'xuangu', x: 65, y: 24, need: { chapter: 10 }, label: '东行 · 玄炉地宫' },
    ],
    pool: [
      { sp: 'yuntie', lv: [26, 29] },
      { sp: 'shuangling', lv: [26, 30] },
      { sp: 'jinyu', lv: [26, 28] },
      { sp: 'hansui', lv: [27, 30] },
      { sp: 'yueji', lv: [28, 30] },
      { sp: 'yunhe', lv: [26, 29] },
      { sp: 'fengli', lv: [26, 28] },
      { sp: 'leiyu', lv: [27, 30] },
    ],
    boss: 'zhanling',
    npcs: [
      {
        id: 'zhan_warden', name: '旧驿守·风伯', sprite: 'samurai_green', tint: 0xe8e0cc, scale: 2.6,
        x: 10, y: 10, dir: 'down', mark: 'main',
        lines: function () {
          var c = chapterNow();
          if (LB.flag('boss_zhanling')) return ['风门认了新契，栈上的灯就能一直亮着。', '往东是玄炉，地火不认人，只认炉心。'];
          if (LB.flag('zhanLanterns')) return ['三盏灯都亮了。风伯我不问你从哪来，只问你往哪去。', '门后的路没有阶，踩稳自己的影子。'];
          if (c <= 9) return ['云栈断了三十年，旧驿只剩我和一盏不肯灭的灯。', '东台有三盏悬灯，先替我把它们点上。', '灯亮之后，风门才肯认第二个契者。'];
          return ['云上来往的人少，肯停下的更少。', '东边玄炉的烟，最近又高了。'];
        },
        onTalk: function () { LB.flagSet('zhanWardenMet', true); },
      },
      {
        id: 'yunzhan_ferry', name: '云渡人·阿鹞', sprite: 'ninja_blue', tint: 0xd8e4e8, scale: 2.3,
        x: 14, y: 26, dir: 'down',
        lines: ['渡云不渡人，渡的是那口不肯咽下的气。', '你要往东，先看脚下：栈板会响，别停。'],
        onTalk: function () { LB.flagSet('zhanFerryMet', true); },
      },
      {
        id: 'yunzhan_smith', name: '修栈匠·老钉', sprite: 'samurai_green', tint: 0xc8b898, scale: 2.3,
        x: 24, y: 12, dir: 'down', service: 'craft',
        lines: ['栈板要灵木，钉要玄铁。云海吃木头，比火还快。', '你带料来，我替你修一段路。'],
      },
      {
        id: 'yunzhan_kid', name: '放鸢童·小满', sprite: 'ninja_blue', tint: 0xf0d8b8, scale: 1.9,
        x: 48, y: 35, dir: 'down',
        lines: ['风门上面有字，阿爹说读完就能看见回家的路。', '我的纸鸢挂在南台的断墙上了。'],
        onTalk: function () { LB.flagSet('zhanKidMet', true); },
      },
      {
        id: 'yunzhan_herbal', name: '采云人·青姑', sprite: 'ninja_blue', tint: 0xd8f0d8, scale: 2.2,
        x: 55, y: 38, dir: 'down',
        lines: ['云纹石长在风最大的地方，采的时候要闭气。', '山门要的云纹石，我这一筐还差两块。'],
        onTalk: function () { LB.flagSet('zhanHerbalMet', true); },
      },
      {
        id: 'yunzhan_monk', name: '守灯僧·无寄', sprite: 'ninja_blue', tint: 0xe0dcd0, scale: 2.4,
        x: 8, y: 25, dir: 'down', service: 'codex',
        lines: ['灯不是照路的，是照人心里那点没说完的话。', '碑上刻着风门的旧约，拓一份，山海志便多一页。'],
      },
      {
        id: 'yunzhan_merchant', name: '云市行商', sprite: 'samurai_green', tint: 0xffd8b0, scale: 2.3,
        x: 60, y: 26, dir: 'down', service: 'shop',
        lines: ['云上的货贵，贵在运上来的人命。', '玄炉那边火气重，清心散多备两包。'],
      },
    ],
    herbs: [],
    gathers: [
      { id: 'yunzhan_g1', x: 12, y: 8, mat: 'yunwen', amount: 2, label: '采得云纹石 2 块', respawn: 'chapter' },
      { id: 'yunzhan_g2', x: 23, y: 16, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'yunzhan_g3', x: 46, y: 32, mat: 'yunwen', amount: 1, label: '采得云纹石', respawn: 'chapter' },
      { id: 'yunzhan_g4', x: 60, y: 40, mat: 'leisui', amount: 1, label: '拾得雷髓', respawn: 'weather' },
    ],
    chests: [
      { id: 'yunzhan_chest1', name: '旧驿木箱', x: 5, y: 26, jade: 22, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 22' },
      { id: 'yunzhan_chest2', name: '北台风匣', x: 26, y: 8, jade: 26, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 26' },
      { id: 'yunzhan_chest3', name: '风门悬箱', x: 30, y: 16, jade: 30, items: [{ id: 'great_pill', count: 1 }], flag: 'zhanLamp1', label: '点亮悬灯（一）· 拾得大还丹 1 枚 · 灵玉 30' },
      { id: 'yunzhan_chest4', name: '栈道村箱', x: 45, y: 34, jade: 24, items: [{ id: 'charm', count: 2 }], flag: 'zhanLamp2', label: '点亮悬灯（二）· 拾得灵符 2 张 · 灵玉 24' },
      { id: 'yunzhan_chest5', name: '断墙暗匣', x: 58, y: 42, jade: 28, items: [{ id: 'escape', count: 1 }], flag: 'zhanLamp3', label: '点亮悬灯（三）· 拾得遁地符 · 灵玉 28' },
      { id: 'yunzhan_chest6', name: '东台行囊', x: 63, y: 25, jade: 20, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 20' },
    ],
    props: [
      { type: 'house', x: 8, y: 7, frame: 'house1' },
      { type: 'house', x: 14, y: 6, frame: 'house2' },
      { type: 'lantern', x: 12, y: 13 },
      { type: 'lantern', x: 21, y: 13 },
      { type: 'lantern', x: 26, y: 6 },
      { type: 'sign', x: 16, y: 22 },
      { type: 'well', x: 24, y: 16 },
      { type: 'altar', x: 56, y: 7 },
      { type: 'lantern', x: 52, y: 10 },
      { type: 'censer', x: 58, y: 10 },
      { type: 'barrels', x: 42, y: 34 },
      { type: 'jars', x: 53, y: 40 },
      { type: 'stoneTable', x: 48, y: 39 },
      { type: 'sweep', x: 9, y: 20 },
      { type: 'notice', x: 34, y: 23 },
      { type: 'tea', x: 37, y: 36 },
    ],
    steles: [
      { id: 'yunzhan_stele1', x: 16, y: 6, title: '风门旧约', text: '「门不为挡人，为记人。过门者留名，回头者留灯。」', codex: 'yunzhanmen' },
      { id: 'yunzhan_stele2', x: 28, y: 15, title: '悬灯台铭', text: '「三灯不灭，风门不闭。灯在人手，人不在灯。」', codex: 'yunzhandeng' },
      { id: 'yunzhan_stele3', x: 44, y: 40, title: '栈道残刻', text: '「云海之下无底，云海之上无路。走栈者只听脚下，不看远处。」', codex: 'yunzhanzhan' },
      { id: 'yunzhan_stele4', x: 57, y: 32, title: '旧驿账簿', text: '一页页记着过路人名，最后一页只写：「风伯，等你回来。」', codex: 'yunzhanji' },
      { id: 'yunzhan_stele5', x: 35, y: 26, title: '断墙风字', text: '墙上刻着一个被风磨去一半的「归」字，旁边有人补了一笔。', codex: 'yunzhanfeng' },
    ],
  });
