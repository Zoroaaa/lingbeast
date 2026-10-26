// 灵兽录 · 第二卷 · 第十境 · 地火不熄，炉门不闭
REGIONS.xuangu = makeRegion({
    id: 'xuangu', name: '玄炉地宫', chapter: 10, subtitle: '炉心未冷，旧匠无名',
    kind: 'main',
    w: 64, h: 48, base: '.', spawn: { x: 5, y: 24 },
    weather: 'ash', tint: '#ecd6c2', timeTint: '#eed8c4',
    paint: function (m) {
      m.border('R', 2);
      // 外环矿道
      m.rect(4, 20, 56, 11, '.');
      m.rect(2, 24, 60, 1, ',');
      // 北炉厅与南铸坊
      m.rect(22, 6, 21, 15, '.');
      m.rect(20, 34, 25, 9, '.');
      m.rect(31, 18, 3, 7, '.');
      m.rect(31, 24, 1, 10, ',');
      m.rect(34, 30, 2, 5, '.');
      // 东西熔岩渠
      m.rect(18, 4, 2, 40, 'L');
      m.rect(45, 4, 2, 40, 'L');
      m.put(18, 24, 'b'); m.put(19, 24, 'b');
      m.put(45, 24, 'b'); m.put(46, 24, 'b');
      // 北厅地火横渠
      m.rect(22, 12, 21, 2, 'L');
      m.put(32, 12, 'b'); m.put(33, 12, 'b');
      // 南坊熔池
      m.blob(39, 40, 3, 'L');
      m.put(38, 39, 'b');
      // 炉门残墙
      m.rect(8, 6, 8, 12, 'R');
      m.rect(50, 30, 9, 12, 'R');
      m.rect(26, 44, 14, 2, 'R');
      // 出口
      m.put(2, 24, 'E');
      m.put(61, 24, 'E');
    },
    exits: [
      { to: 'yunzhan', x: 2, y: 24, need: null, label: '西行 · 回云栈' },
      { to: 'chenyu', x: 61, y: 24, need: { chapter: 11 }, label: '东行 · 沉蜃旧城' },
    ],
    pool: [
      { sp: 'jinta', lv: [29, 32] },
      { sp: 'chisha', lv: [29, 32] },
      { sp: 'hansui', lv: [30, 33] },
      { sp: 'yueji', lv: [30, 33] },
      { sp: 'feiyan', lv: [31, 34] },
      { sp: 'panyan', lv: [30, 33] },
      { sp: 'rongjia', lv: [29, 32] },
      { sp: 'luxinyuan', lv: [30, 33] },
      { sp: 'tongxu', lv: [29, 31] },
    ],
    boss: 'luxinkui',
    npcs: [
      {
        id: 'lu_warden', name: '炉门老铸·烛九', sprite: 'samurai_green', tint: 0xe0c8a8, scale: 2.6,
        x: 10, y: 18, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('boss_luxinkui')) return ['炉心稳了。往后这炉不铸锁，只铸契。', '你带走的每一块炉心炭，都记得自己的火。'];
          if (LB.flag('luCore')) return ['炉心炭够了。去吧，把炉心傀从火里唤出来。', '它守的不是炉，是炉里那些没铸完的名字。'];
          if (chapterNow() <= 10) return ['玄炉烧了三百年，烧到连匠人的名字都成了灰。', '炉心傀还守在北厅。先取三块炉心炭，炉门才开。', '别用锁灵器碰炉心，那东西会记住你。'];
          return ['炉火不认人，只认手稳不稳。', '南坊的熔池又涨了，走路看清脚下。'];
        },
        onTalk: function () { LB.flagSet('luWardenMet', true); },
      },
      {
        id: 'xuangu_smith', name: '铸灵师·残锤', sprite: 'samurai_green', tint: 0xc8b090, scale: 2.4,
        x: 15, y: 22, dir: 'down', service: 'craft',
        lines: ['炉心炭、云纹石、沉珠，凑齐了我就替你开炉。', '天工司的手艺不该只用来造锁，你说是不是。'],
      },
      {
        id: 'xuangu_keeper', name: '守炉人·灰', sprite: 'ninja_blue', tint: 0xd0c8c0, scale: 2.3,
        x: 28, y: 8, dir: 'down',
        lines: ['炉厅里每一道裂纹，都是一个人名。', '你若听见炉里有敲击声，别应。'],
        onTalk: function () { LB.flagSet('luKeeperMet', true); },
      },
      {
        id: 'xuangu_child', name: '炉边小童', sprite: 'ninja_blue', tint: 0xe8d8c0, scale: 1.8,
        x: 24, y: 38, dir: 'down',
        lines: ['我把爹的锤子藏在南坊的箱子里了。', '你能帮我找回来吗？'],
        onTalk: function () { LB.flagSet('luChildMet', true); },
      },
      {
        id: 'xuangu_scholar', name: '录火者·焦页', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 8, y: 26, dir: 'down', service: 'codex',
        lines: ['火不会说谎，会说话的是写火的人。', '碑文我都拓过了，你要看便看。'],
      },
      {
        id: 'xuangu_hunter', name: '熔窟猎户', sprite: 'samurai_green', tint: 0xd8b898, scale: 2.2,
        x: 53, y: 22, dir: 'down',
        lines: ['熔甲兽的甲片能挡炉火，可它自己怕冷。', '东边沉城的雾，比这炉烟还重。'],
      },
      {
        id: 'xuangu_merchant', name: '地宫行商', sprite: 'samurai_green', tint: 0xffd8b0, scale: 2.3,
        x: 57, y: 26, dir: 'down', service: 'shop',
        lines: ['地宫货硬，价也硬。', '炉心炭不卖，只换。'],
      },
      {
        id: 'xuangu_guard', name: '断后匠·无锤', sprite: 'samurai_green', tint: 0xb8b0a8, scale: 2.4,
        x: 40, y: 34, dir: 'down',
        lines: ['北厅的傀不动，炉火就稳；一动，整座地宫都得震。', '我守南坊，不守北厅。'],
        onTalk: function () { LB.flagSet('luGuardMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'xuangu_g1', x: 10, y: 28, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'xuangu_g2', x: 28, y: 16, mat: 'luxin', amount: 1, label: '拾得炉心炭', respawn: 'chapter' },
      { id: 'xuangu_g3', x: 36, y: 8, mat: 'luxin', amount: 1, label: '拾得炉心炭', respawn: 'chapter' },
      { id: 'xuangu_g4', x: 48, y: 38, mat: 'luxin', amount: 1, label: '拾得炉心炭', respawn: 'chapter' },
      { id: 'xuangu_g5', x: 60, y: 40, mat: 'xuantie', amount: 2, label: '拾得玄铁 2 块', respawn: 'chapter' },
    ],
    chests: [
      { id: 'xuangu_chest1', name: '矿道木箱', x: 6, y: 22, jade: 26, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 26' },
      { id: 'xuangu_chest2', name: '炉厅铁匣', x: 24, y: 10, jade: 32, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 32' },
      { id: 'xuangu_chest3', name: '北厅暗柜', x: 40, y: 10, jade: 34, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 34' },
      { id: 'xuangu_chest4', name: '南坊旧箱', x: 22, y: 40, jade: 28, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 28' },
      { id: 'xuangu_chest5', name: '熔池边匣', x: 44, y: 36, jade: 30, items: [{ id: 'escape', count: 1 }], label: '拾得遁地符 · 灵玉 30' },
      { id: 'xuangu_chest6', name: '东矿暗箱', x: 60, y: 36, jade: 24, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 24' },
      { id: 'xuangu_chest7', name: '炉门残箱', x: 12, y: 34, jade: 22, items: [{ id: 'pill', count: 2 }], flag: 'luHammer', label: '寻回旧锤 · 拾得丹药 2 枚 · 灵玉 22' },
    ],
    props: [
      { type: 'altar', x: 32, y: 8 },
      { type: 'censer', x: 28, y: 10 },
      { type: 'censer', x: 37, y: 10 },
      { type: 'house', x: 8, y: 4, frame: 'house2' },
      { type: 'house', x: 52, y: 6, frame: 'house1' },
      { type: 'lantern', x: 20, y: 22 },
      { type: 'lantern', x: 44, y: 22 },
      { type: 'sign', x: 34, y: 23 },
      { type: 'well', x: 14, y: 28 },
      { type: 'barrels', x: 26, y: 36 },
      { type: 'jars', x: 41, y: 40 },
      { type: 'stoneTable', x: 30, y: 38 },
      { type: 'offering', x: 36, y: 18 },
      { type: 'notice', x: 50, y: 20 },
      { type: 'sweep', x: 10, y: 30 },
    ],
    steles: [
      { id: 'xuangu_stele1', x: 16, y: 8, title: '炉门旧铭', text: '「火不是用来锁的。锁住火的人，最后都成了炉里的炭。」', codex: 'xuanguumen' },
      { id: 'xuangu_stele2', x: 34, y: 6, title: '铸灵残谱', text: '谱上画着锁灵器的骨，旁边有人用炭写了两个字：不铸。', codex: 'xuanguupu' },
      { id: 'xuangu_stele3', x: 26, y: 14, title: '炉心记录', text: '「第十七次开炉，傀仍未醒。它记得的名字太多，不肯只认一个。」', codex: 'xuanggulu' },
      { id: 'xuangu_stele4', x: 24, y: 36, title: '南坊工牌', text: '一排工牌挂在墙上，名字都被火燎过，只剩姓。', codex: 'xuangugong' },
      { id: 'xuangu_stele5', x: 50, y: 28, title: '断锤刻字', text: '「锤断之日，炉门自开。后来人不必再铸锁。」', codex: 'xuanguanchui' },
    ],
  });
