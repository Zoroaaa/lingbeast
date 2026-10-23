// 灵兽录 · 八境 · 中枢 · 山门重开之地
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.shanmen = makeRegion({
    id: 'shanmen', name: '青溪山门', chapter: 0, subtitle: '中枢 · 山门重开之地',
    w: 44, h: 34, base: '.', spawn: { x: 18, y: 24 },
    weather: 'clear', tint: '#f4efe4', timeTint: '#f7f2e6',
    paint: function (m) {
      m.border('T', 2);
      // 北屏山脊与三门殿基
      m.rect(3, 0, 38, 3, 'C');
      m.rect(5, 4, 6, 5, 'H');
      m.rect(15, 3, 8, 6, 'H');
      m.rect(27, 4, 7, 5, 'H');
      // 前庭石板与横廊
      m.rect(4, 11, 30, 10, '.');
      m.rect(4, 12, 30, 1, ',');
      m.rect(4, 18, 30, 1, ',');
      m.rect(16, 11, 2, 10, ',');
      // 南阶九级，通往谷口
      m.rect(17, 22, 8, 10, '.');
      m.rect(18, 22, 6, 9, ',');
      m.put(22, 32, 'E');
      // 东池曲桥
      m.blob(39, 13, 2, 'W');
      m.put(37, 13, 'b');
      m.put(38, 13, 'b');
      // 西侧演武场
      m.rect(3, 25, 8, 5, ',');
      m.rect(1, 31, 12, 2, 'C');
      // 东崖与西山松
      m.rect(41, 2, 3, 24, 'C');
      m.blob(2, 5, 2, 'T');
      m.blob(2, 27, 2, 'T');
      m.blob(40, 28, 2, 'T');
    },
    exits: [{ to: 'qingxi', x: 22, y: 32, need: null, label: '出山 · 青溪谷' }],
    pool: [],
    boss: null,
    npcs: [
      {
        id: 'gate_elder', name: '老丈', sprite: 'samurai_green', tint: 0xf0e6d2, scale: 2.6,
        x: 18, y: 13, dir: 'down', mark: 'main', service: 'main',
        lines: function () {
          var c = chapterNow();
          if (LB.flag('pactNew')) return ['碑上第一笔落下了。往后的名字，靠后来人自己刻。', '山门还开着，灯还亮着。'];
          if (LB.flag('pactCut')) return ['绳断了也好。山门还开着，灯还亮着。', '夜里少了许多声音，我慢慢习惯。'];
          if (LB.flag('boss_wuxiang')) return ['回来了就好。山门重开，不必照着旧样子开。', '碑林的灯我留着，什么时候想读，就什么时候读。'];
          if (c <= 1) return ['三十年前，这门口站满了人；如今只剩我和一盏灯。', '谷口守谷灵还认旧契。去青溪谷，先让它认你。', '灵笼别背反了——那是装契的，不是装兽的。'];
          if (c === 2) return ['守谷灵认了你，山门就有了第一块砖。', '雾隐林里有个采药的阿蘅，替我去看看她。'];
          return ['一境一境走，别急着问结局。', '石阶我扫过了，你要走就走。'];
        },
        onTalk: function () { LB.flagSet('gateElderMet', true); },
      },
      {
        id: 'merchant', name: '商人', sprite: 'samurai_green', tint: 0xffd8b0, scale: 2.4,
        x: 10, y: 16, dir: 'down', service: 'shop',
        lines: function () {
          var c = chapterNow();
          if (c <= 1) return ['灵玉不多也能买。丹药、灵符，都是保命的东西。', '山里捡的材料别扔，拿来换钱，比埋在行囊里强。'];
          if (c <= 4) return ['货随章节走，新的东西要等山门再开一层。', '雨天的灵符卖得快，你来得正好。'];
          return ['归墟的行商也有好货，只是价高。', '买卖不问来路，这是山门的规矩。'];
        },
      },
      {
        id: 'alchemist', name: '丹房执事', sprite: 'ninja_blue', tint: 0xd8e8f0, scale: 2.4,
        x: 21, y: 19, dir: 'down', service: 'craft',
        lines: function () {
          return ['丹方不是背下来的，是试出来的。', '有配方、有材料、有灵玉，我就替你开炉。', '清心散能解灼烧、腐蚀、迟滞与破甲，进山前记得备。'];
        },
      },
      {
        id: 'stable', name: '灵兽栏执事', sprite: 'samurai_green', tint: 0xe8e0c8, scale: 2.4,
        x: 24, y: 17, dir: 'down', service: 'stable',
        lines: function () {
          return ['队伍只容三只，多的灵兽进栏里养着，不会放归。', '灵笼越稳，契越深；升级要玄铁与灵木。', '别把灵兽当牲口。它们记得你唤它时的口气。'];
        },
      },
      {
        id: 'board', name: '告示板执事', sprite: 'ninja_blue', tint: 0xf0d8c0, scale: 2.4,
        x: 14, y: 15, dir: 'down', service: 'bounty',
        lines: function () {
          return ['告示板上的活计，除妖、采办、巡山，做完来领灵玉。', '悬赏有冷却，别一口气全揭了。', '青溪的妖气还没散，云梦那边又起了雾。'];
        },
      },
      {
        id: 'travel', name: '传送阵执事', sprite: 'samurai_green', tint: 0xcfe0e8, scale: 2.4,
        x: 28, y: 14, dir: 'down', service: 'travel',
        lines: function () {
          return ['山门阵法只通往已点亮的区域。', '传送不耗灵玉，但要有契、有路。', '新区域要过前一境的主线，阵眼才肯亮。'];
        },
      },
      {
        id: 'keeper', name: '碑林执事', sprite: 'ninja_blue', tint: 0xe0dcd0, scale: 2.4,
        x: 3, y: 24, dir: 'down', service: 'codex',
        lines: function () {
          return ['碑林的石头比人记性好。', '每解开一处碑文，山海志里便多一页。', '拓印要轻，重了就把字带走。'];
        },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'shanmen_g1', x: 12, y: 14, mat: 'lucao', amount: 1, label: '采得露生草', respawn: 'chapter' },
      { id: 'shanmen_g2', x: 28, y: 18, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
    ],
    chests: [
      { id: 'shanmen_chest1', name: '旧库木箱', x: 30, y: 24, jade: 10, items: [{ id: 'pill', count: 3 }], gear: 'shanmen_bell', label: '拾得丹药 3 枚 · 山门旧铃 · 灵玉 10' },
      { id: 'shanmen_chest2', name: '廊下包袱', x: 8, y: 25, jade: 8, items: [{ id: 'charm', count: 1 }], label: '拾得灵符 1 张 · 灵玉 8' },
    ],
    props: [
      { type: 'house', x: 7, y: 8, frame: 'house1' },
      { type: 'house', x: 17, y: 8, frame: 'house2' },
      { type: 'house', x: 28, y: 8, frame: 'house1' },
      { type: 'altar', x: 18, y: 11 },
      { type: 'lantern', x: 14, y: 20 },
      { type: 'lantern', x: 22, y: 20 },
      { type: 'sign', x: 16, y: 21 },
      { type: 'well', x: 6, y: 13 },
      // 中庭叙事物件：让广场中段有生活痕迹，而不是一片空地
      { type: 'notice', x: 14, y: 14 },
      { type: 'jars', x: 7, y: 14 },
      { type: 'tea', x: 6, y: 17 },
      { type: 'wish', x: 20, y: 15 },
      { type: 'censer', x: 15, y: 12 },
      { type: 'censer', x: 21, y: 12 },
      { type: 'offering', x: 7, y: 23 },
      { type: 'sweep', x: 15, y: 28 },
      { type: 'stoneTable', x: 13, y: 25 },
      { type: 'barrels', x: 24, y: 22 },
    ],
    steles: [
      { id: 'shanmen_stele1', x: 5, y: 22, title: '山门残碑', text: '碑面被人反复摩挲，只剩两行：「守契者不入渊，入渊者不守契。」', codex: 'qingxishanmen' },
      { id: 'shanmen_stele2', x: 9, y: 22, title: '十二门名录', text: '十二个门名并排刻着，前十一处都已磨平。最末一处是青溪，刻痕尚新。', codex: 'shiershanmen' },
    ],
  });
