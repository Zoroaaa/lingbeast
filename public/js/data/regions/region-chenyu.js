// 灵兽录 · 第二卷 · 第十一境 · 潮下旧城，影比人先到
REGIONS.chenyu = makeRegion({
    id: 'chenyu', name: '沉蜃旧城', chapter: 11, subtitle: '城沉海底，街仍有名',
    kind: 'main',
    w: 72, h: 52, base: '.', spawn: { x: 5, y: 26 },
    fog: true, weather: 'fog', tint: '#e6e4da', timeTint: '#e8e6dc',
    encounterTiles: ['D', 'g'],
    paint: function (m) {
      m.border('R', 2);
      // 主街
      m.rect(4, 22, 64, 9, '.');
      m.rect(2, 26, 68, 1, ',');
      // 南北水巷与沉屋
      m.rect(8, 4, 56, 15, '.');
      m.rect(10, 34, 52, 14, '.');
      // 三道潮渠，木桥相连
      m.rect(16, 2, 2, 48, 'W');
      m.put(16, 26, 'b'); m.put(17, 26, 'b');
      m.put(16, 40, 'b'); m.put(17, 40, 'b');
      m.rect(36, 2, 2, 48, 'W');
      m.put(36, 26, 'b'); m.put(37, 26, 'b');
      m.put(36, 40, 'b'); m.put(37, 40, 'b');
      m.rect(56, 2, 2, 48, 'W');
      m.put(56, 26, 'b'); m.put(57, 26, 'b');
      // 城北断墙与沉塔
      m.rect(24, 4, 12, 3, 'R');
      m.rect(48, 4, 10, 3, 'R');
      m.rect(30, 8, 6, 6, 'R');
      // 城南水淹区
      m.blob(28, 46, 4, 'W');
      m.blob(48, 46, 3, 'W');
      m.rect(12, 36, 10, 8, '.');
      // 出口
      m.put(2, 26, 'E');
      m.put(69, 26, 'E');
    },
    exits: [
      { to: 'xuangu', x: 2, y: 26, need: null, label: '西行 · 回玄炉' },
      { to: 'jiuzhang', x: 69, y: 26, need: { chapter: 12 }, label: '东行 · 九嶂天根' },
    ],
    pool: [
      { sp: 'chaowen', lv: [32, 35] },
      { sp: 'shentan', lv: [32, 36] },
      { sp: 'cangming', lv: [33, 36] },
      { sp: 'hansui', lv: [32, 35] },
      { sp: 'shuangling', lv: [32, 35] },
      { sp: 'chenzhu', lv: [32, 35] },
      { sp: 'chaodeng', lv: [32, 34] },
      { sp: 'shanhu', lv: [33, 36] },
    ],
    boss: 'chenchengshan',
    npcs: [
      {
        id: 'chen_warden', name: '守潮人·汐', sprite: 'ninja_blue', tint: 0xd8e4e8, scale: 2.6,
        x: 10, y: 24, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('boss_chenchengshan')) return ['潮退了。城还沉在下面，但街名回来了。', '你要去天根，就从东门走。别回头，城会叫你。'];
          if (LB.flag('chenSteles')) return ['三块城碑都读完了？那你已经知道它叫什么了。', '去北塔吧。它在那里等你，用你的脸。'];
          if (chapterNow() <= 11) return ['这座城浮上来三次，每次都少一条街。', '先读城碑：东街、潮渠、沉塔。读完，它才会露真身。', '别信街上的影子，影子比人先到。'];
          return ['潮声大时，别下南街。', '旧城的灯还亮着，只是照不到活人。'];
        },
        onTalk: function () { LB.flagSet('chenWardenMet', true); },
      },
      {
        id: 'chenyu_diver', name: '潜水人·螺', sprite: 'ninja_blue', tint: 0xcfe0e8, scale: 2.2,
        x: 22, y: 32, dir: 'down',
        lines: ['水下还有半条街，我摸到过门牌。', '沉珠在潮渠底，要潜三次才摸得到一颗。'],
        onTalk: function () { LB.flagSet('chenDiverMet', true); },
      },
      {
        id: 'chenyu_lamplighter', name: '点灯人·夜渡', sprite: 'samurai_green', tint: 0xe8d8b8, scale: 2.3,
        x: 30, y: 18, dir: 'down',
        lines: ['城里灯不能全亮，全亮就照出不该照的东西。', '我每晚点七盏，多一盏都不点。'],
        onTalk: function () { LB.flagSet('chenLampMet', true); },
      },
      {
        id: 'chenyu_historian', name: '旧城录事·沉简', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.3,
        x: 46, y: 22, dir: 'down', service: 'codex',
        lines: ['城沉之前，最后一位录事把名册沉进了井里。', '你若能读碑，我便把名册抄给你。'],
      },
      {
        id: 'chenyu_smith', name: '修桥匠·浮木', sprite: 'samurai_green', tint: 0xc8b898, scale: 2.3,
        x: 42, y: 30, dir: 'down', service: 'craft',
        lines: ['潮水一天涨两次，桥一天修两次。', '沉珠磨成粉，能把木头里的水逼出来。'],
      },
      {
        id: 'chenyu_fisher', name: '潮下渔人', sprite: 'samurai_green', tint: 0xd0d8c8, scale: 2.2,
        x: 60, y: 36, dir: 'down',
        lines: ['潮下的鱼没有眼睛，靠听名字游。', '你叫它一声，它就可能跟你走。'],
      },
      {
        id: 'chenyu_child', name: '拾贝童·小汐', sprite: 'ninja_blue', tint: 0xf0e0d0, scale: 1.8,
        x: 18, y: 44, dir: 'down',
        lines: ['我捡到一枚会唱歌的贝，可它只唱半句。', '另外半句在南街的水里。'],
        onTalk: function () { LB.flagSet('chenChildMet', true); },
      },
      {
        id: 'chenyu_merchant', name: '沉市行商', sprite: 'samurai_green', tint: 0xffd8b0, scale: 2.3,
        x: 64, y: 28, dir: 'down', service: 'shop',
        lines: ['沉市只卖两样：旧物，和旧事的消息。', '天根那边的东西，我不进货。'],
      },
      {
        id: 'chenyu_guard', name: '守门人·不上岸', sprite: 'samurai_green', tint: 0xb8c0c8, scale: 2.4,
        x: 66, y: 22, dir: 'down',
        lines: ['东门只开一次。进去的人，城会记住。', '你要出来，得先叫得出自己的名字。'],
        onTalk: function () { LB.flagSet('chenGuardMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'chenyu_g1', x: 14, y: 12, mat: 'chenzhu', amount: 1, label: '拾得沉珠', respawn: 'chapter' },
      { id: 'chenyu_g2', x: 40, y: 10, mat: 'chenzhu', amount: 1, label: '拾得沉珠', respawn: 'chapter' },
      { id: 'chenyu_g3', x: 50, y: 38, mat: 'chaoyanjing', amount: 1, label: '刮得潮盐晶', respawn: 'weather' },
      { id: 'chenyu_g4', x: 12, y: 40, mat: 'haiyan', amount: 2, label: '刮得海盐 2 份', respawn: 'weather' },
    ],
    chests: [
      { id: 'chenyu_chest1', name: '沉屋木箱', x: 6, y: 24, jade: 30, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 30' },
      { id: 'chenyu_chest2', name: '北街石匣', x: 12, y: 10, jade: 36, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 36' },
      { id: 'chenyu_chest3', name: '沉塔底层', x: 38, y: 12, jade: 38, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 38' },
      { id: 'chenyu_chest4', name: '潮渠暗柜', x: 44, y: 10, jade: 34, items: [{ id: 'charm', count: 3 }], label: '拾得灵符 3 张 · 灵玉 34' },
      { id: 'chenyu_chest5', name: '南街水匣', x: 20, y: 42, jade: 32, items: [{ id: 'escape', count: 1 }], label: '拾得遁地符 · 灵玉 32' },
      { id: 'chenyu_chest6', name: '渔人旧箱', x: 62, y: 40, jade: 28, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 28' },
      { id: 'chenyu_chest7', name: '东门行囊', x: 68, y: 30, jade: 34, items: [{ id: 'revive', count: 1 }], label: '拾得归元丹 1 枚 · 灵玉 34' },
      { id: 'chenyu_chest8', name: '名册沉箱', x: 26, y: 8, jade: 40, items: [{ id: 'charm', count: 2 }], flag: 'chenSteles', label: '寻回半册名册 · 灵玉 40' },
    ],
    props: [
      { type: 'house', x: 8, y: 6, frame: 'house2' },
      { type: 'house', x: 40, y: 6, frame: 'house1' },
      { type: 'house', x: 58, y: 6, frame: 'house2' },
      { type: 'lantern', x: 12, y: 20 },
      { type: 'lantern', x: 34, y: 20 },
      { type: 'lantern', x: 52, y: 20 },
      { type: 'sign', x: 38, y: 24 },
      { type: 'well', x: 22, y: 10 },
      { type: 'altar', x: 32, y: 10 },
      { type: 'censer', x: 28, y: 20 },
      { type: 'censer', x: 48, y: 20 },
      { type: 'barrels', x: 14, y: 30 },
      { type: 'jars', x: 54, y: 30 },
      { type: 'stoneTable', x: 24, y: 30 },
      { type: 'notice', x: 58, y: 22 },
      { type: 'sweep', x: 10, y: 36 },
    ],
    steles: [
      { id: 'chenyu_stele1', x: 18, y: 8, title: '东街城碑', text: '「城名不改，街名不改。水淹到哪，名就跟到哪。」', codex: 'chenyu_cheng' },
      { id: 'chenyu_stele2', x: 50, y: 8, title: '潮渠刻记', text: '「潮来不惊，潮去不追。守潮者只记一件事：谁最后上岸。」', codex: 'chenyu_chao' },
      { id: 'chenyu_stele3', x: 28, y: 14, title: '沉塔题名', text: '塔身刻满名字，最上面一层只有一个字：蜃。', codex: 'chenyu_ying' },
      { id: 'chenyu_stele4', x: 20, y: 38, title: '南街水牌', text: '「水深三尺，街仍可行。心有旧事者，勿下南街。」', codex: 'chenyu_jie' },
      { id: 'chenyu_stele5', x: 58, y: 32, title: '东门旧约', text: '「入城者留名，出城者还名。名字不清者，门不开。」', codex: 'chenyu_ming' },
    ],
  });
