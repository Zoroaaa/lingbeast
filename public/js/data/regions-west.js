// 灵兽录 · 数据层 · 八境 · 中枢至落星原
Object.assign(REGIONS, {
  // —— 中枢 ——
  shanmen: makeRegion({
    id: 'shanmen', name: '青溪山门', chapter: 0, subtitle: '中枢 · 山门重开之地',
    w: 36, h: 28, base: '.', spawn: { x: 18, y: 24 },
    weather: 'clear', tint: '#f4efe4', timeTint: '#f7f2e6',
    paint: function (m) {
      m.border('T', 2);
      m.rect(4, 12, 29, 10, ',');
      m.rect(6, 9, 3, 3, ',');
      m.rect(16, 9, 3, 3, ',');
      m.rect(26, 9, 3, 3, ',');
      m.rect(4, 4, 8, 5, 'H');
      m.rect(14, 4, 8, 5, 'H');
      m.rect(25, 4, 8, 5, 'H');
      m.rect(14, 22, 9, 3, ',');
      m.line(18, 21, 18, 25, ',');
      m.put(18, 26, 'E');
      m.rect(3, 22, 10, 2, ',');
      m.rect(20, 23, 2, 2, ',');
      m.blob(31, 8, 2, 'W');
      m.rect(2, 3, 1, 8, 'T');
      m.rect(33, 4, 1, 6, 'T');
      m.blob(33, 24, 2, 'T');
    },
    exits: [{ to: 'qingxi', x: 18, y: 26, need: null, label: '出山 · 青溪谷' }],
    pool: [],
    boss: null,
    npcs: [
      {
        id: 'gate_elder', name: '老丈', sprite: 'samurai_green', tint: 0xf0e6d2, scale: 2.6,
        x: 18, y: 13, dir: 'down', mark: 'main', service: 'main',
        lines: function () {
          var c = chapterNow();
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
      { id: 'shanmen_chest1', name: '旧库木箱', x: 30, y: 24, jade: 10, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 10' },
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
    ],
    steles: [
      { id: 'shanmen_stele1', x: 5, y: 22, title: '山门残碑', text: '碑面被人反复摩挲，只剩两行：「守契者不入渊，入渊者不守契。」', codex: 'qingxishanmen' },
      { id: 'shanmen_stele2', x: 9, y: 22, title: '十二门名录', text: '十二个门名并排刻着，前十一处都已磨平。最末一处是青溪，刻痕尚新。', codex: 'shiershanmen' },
    ],
  }),

  // —— 第一境 ——
  // v2.1 垂直切片：46×34 → 60×44，东侧药庐与溪林、南侧旧祠与断崖
  qingxi: makeRegion({
    id: 'qingxi', name: '青溪谷', chapter: 1, subtitle: '山雨欲来，谷口先静',
    w: 60, h: 44, base: '.', spawn: { x: 4, y: 30 },
    weather: 'rain', tint: '#f2ede2', timeTint: '#f4efe3',
    paint: function (m) {
      m.border('T', 2);

      // 草地与林间空地
      m.blob(8, 27, 4, 'g');
      m.blob(20, 27, 4, 'g');
      m.blob(20, 12, 3, 'g');
      m.blob(41, 8, 3, 'g');
      m.blob(47, 10, 3, 'g');
      m.blob(51, 7, 2, 'g');
      m.blob(51, 23, 2, 'g');
      m.blob(55, 26, 2, 'g');
      m.blob(24, 36, 3, 'g');
      m.blob(38, 34, 3, 'g');
      m.blob(12, 36, 3, 'g');
      m.blob(44, 31, 2, 'g');

      // 老图东、南边界改为内林，并留出扩展通道
      m.rect(44, 2, 2, 30, 'T');
      m.rect(2, 32, 27, 2, 'T');
      m.rect(32, 32, 26, 2, 'T');

      // 林团
      [[8, 6, 3], [24, 24, 3], [41, 29, 3], [47, 6, 2], [46, 22, 3], [56, 4, 2], [20, 38, 3], [42, 36, 3], [34, 32, 2], [12, 40, 2]].forEach(function (b) {
        m.blob(b[0], b[1], b[2], 'T');
      });

      // 溪流、池塘与断崖
      m.rect(52, 2, 3, 13, 'W');
      m.rect(52, 19, 3, 14, 'W');
      m.blob(54, 28, 2, 'W');
      m.blob(44, 35, 2, 'C');
      m.blob(16, 38, 2, 'C');

      // 旧图主路
      m.line(4, 30, 4, 24, ',');
      m.line(4, 24, 14, 24, ',');
      m.line(14, 24, 14, 17, ',');
      m.line(14, 17, 26, 17, ',');
      m.line(26, 17, 26, 9, ',');
      m.line(26, 17, 32, 17, ',');
      m.rect(32, 16, 6, 2, 'b');
      m.line(38, 17, 43, 17, ',');

      // 东侧药庐与溪林
      m.line(43, 17, 51, 17, ',');
      m.rect(51, 15, 5, 4, 'b');
      m.line(55, 17, 57, 17, ',');
      m.line(50, 17, 50, 12, ',');
      m.line(50, 12, 47, 12, ',');
      m.line(47, 12, 47, 9, ',');
      m.line(50, 17, 50, 25, ',');
      m.line(50, 25, 54, 25, ',');

      // 南侧旧祠
      m.rect(29, 31, 3, 4, ',');
      m.line(30, 35, 30, 38, ',');
      m.line(24, 38, 30, 38, ',');
      m.line(30, 38, 39, 38, ',');
      m.rect(32, 36, 8, 4, ',');

      // 建筑地面
      m.rect(6, 10, 4, 3, 'H');
      m.rect(45, 6, 5, 3, 'H');
      m.rect(23, 5, 6, 3, 'A');

      m.put(4, 31, 'E');
      m.put(57, 17, 'E');
    },
    exits: [
      { to: 'shanmen', x: 4, y: 31, need: null, label: '回山门' },
      { to: 'wuyin', x: 57, y: 17, need: { chapter: 2 }, label: '过木桥 · 雾隐林' },
    ],
    pool: [
      { sp: 'qingheng', lv: [2, 4] },
      { sp: 'moyu', lv: [2, 3] },
      { sp: 'yanwei', lv: [2, 3] },
    ],
    boss: 'shougu',
    npcs: [
      {
        id: 'valley_elder', name: '守谷老丈', sprite: 'samurai_green', tint: 0xf0e6d2, scale: 2.6,
        x: 22, y: 16, dir: 'down', mark: 'main',
        lines: function () {
          if (!LB.flag('boss_shougu')) return ['你也是来寻渊兽的？三十年前它烧穿了半座山。', '谷口那尊守谷灵还认旧契，先过它这一关，山门才肯为你开。', '祭坛在北边。记住：灵兽不是牲口，是与你换命的东西。'];
          if (LB.flag('elderTruth')) return ['旧碑我读了一辈子，今天才敢把最后一句说全。', '山门不是砖，是有人肯替灵兽留一条路。你往东去，雾隐林的阿蘅会告诉你更多。'];
          return ['山门认了你。往东过木桥，雾隐林的路跟着溪水走。', '若见着阿蘅，替我问一声好。', '谷里的旧碑若还没读，去读一读；有些事，碑比人记得清楚。'];
        },
        onTalk: function () {
          LB.flagSet('elderMet', true);
          const s = LB.saveState();
          if (LB.flag('boss_shougu') && s && s.steles && s.steles.qingxi_stele1 && s.steles.qingxi_stele2) {
            LB.flagSet('elderTruth', true);
          }
        },
      },
      {
        id: 'valley_child', name: '溪边小童', sprite: 'samurai_green', tint: 0xffd8b0, scale: 1.9,
        x: 30, y: 18, dir: 'down',
        lines: function () {
          if (LB.flag('childBoats')) return ['三只纸船都回来了。阿翁说，船回来，人就还没走远。', '你下次进山，我替你看着溪。'];
          if (LB.flag('childSong')) return ['我在溪上放了纸船，写了阿翁的名字。', '水把它们带走了……你能替我找回来吗？', '船腹上画着小小的契印，不会认错的。'];
          return ['阿翁说，灵兽会记住第一个给它取名的人。', '我的名字是我自己取的，所以我不会离开这座谷。', '你要进山的话……回来讲给我听好不好？'];
        },
        onTalk: function () {
          LB.flagSet('childSong', true);
          if (LB.flag('boat1') && LB.flag('boat2') && LB.flag('boat3')) LB.flagSet('childBoats', true);
        },
      },
      {
        id: 'qingxi_aheng', name: '阿蘅', sprite: 'samurai_green', tint: 0xd8f0d0, scale: 2.4,
        x: 48, y: 10, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('ahengHerbs')) return ['药已够用。进雾隐林前，记得带清心散。', '溪东旧祠的灯该添油了。你若路过，替我看一眼守碑人。'];
          if (LB.matCount('lucao') >= 3) return ['露生草采齐了？给我吧，我替你配一炉。', '（她把草叶摊在石台上，露水沿着叶脉往下走。）'];
          if (LB.flag('ahengMet')) return ['露生草三株，长在溪边湿石缝里。', '别把药庐当铺子。我不卖命，只换灵息。'];
          return ['药庐在溪东，门没锁。', '山雨里走久了，骨头会记住潮气。', '要进雾林，先备清心散。'];
        },
        onTalk: function () {
          LB.flagSet('ahengMet', true);
          if (!LB.flag('ahengHerbs') && LB.matCount('lucao') >= 3) {
            LB.consumeMaterial('lucao', 3);
            LB.giveItem('cleanse', 1);
            LB.flagSet('ahengHerbs', true);
            LB.toast('阿蘅收下露生草 · 清心散 +1');
          }
        },
      },
      {
        id: 'bridge_keeper', name: '守桥人', sprite: 'ninja_blue', tint: 0xcfe0e8, scale: 2.4,
        x: 49, y: 19, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('bridgeFixed')) return ['桥修好了。旧祠的路，雨天也能走。', '守桥不是守着木头，是守着过桥的人。'];
          if (LB.flag('bridgeMet')) return ['灵木三根、露生草两株，够了就能修。', '桥那头是旧祠。雨大时别过去，石阶会滑。'];
          return ['这座桥断过一次。旧山门的人说，桥断时山里死了很多灵。', '要修桥，得灵木三根、露生草两株。', '修好了，溪东旧祠才有人去。'];
        },
        onTalk: function () {
          LB.flagSet('bridgeMet', true);
          if (!LB.flag('bridgeFixed') && LB.matCount('lingmu') >= 3 && LB.matCount('lucao') >= 2) {
            LB.consumeMaterial('lingmu', 3);
            LB.consumeMaterial('lucao', 2);
            LB.flagSet('bridgeFixed', true);
            LB.toast('断桥已修 · 旧祠的路通了');
          }
        },
      },
      {
        id: 'shrine_keeper', name: '守碑人', sprite: 'samurai_green', tint: 0xe0d8c0, scale: 2.3,
        x: 33, y: 37, dir: 'down',
        lines: function () {
          if (LB.flag('shrineLit')) return ['灯亮了。旧祠的名字，今夜不会被雨盖住。', '碑上的字我拓过三遍，每遍都不一样。'];
          if (LB.flag('shrineMet')) return ['把谷口、木桥、旧祠的碑都读一遍，再来点灯。', '灯不照路，只照名字。'];
          return ['旧祠没有神，只有名字。', '碑上的名字被雨磨平了，我替他们守着。', '若你把三处碑文都读全，我就点灯。'];
        },
        onTalk: function () {
          LB.flagSet('shrineMet', true);
          const s = LB.saveState();
          const n = s && s.steles ? Object.keys(s.steles).filter(function (id) { return id.indexOf('qingxi') === 0; }).length : 0;
          if (!LB.flag('shrineLit') && n >= 3) {
            LB.flagSet('shrineLit', true);
            LB.toast('旧祠长灯已点');
          }
        },
      },
      {
        id: 'qingxi_fisher', name: '钓客', sprite: 'ninja_blue', tint: 0xd8e8f0, scale: 2.2,
        x: 55, y: 25, dir: 'down',
        lines: function () {
          return ['雨落在水上，鱼反而不咬钩。', '溪东的水是从雾隐林流下来的，带着药味。', '你若见着水底有白影，别伸手——那是旧契的尾巴。'];
        },
        onTalk: function () { LB.flagSet('fisherMet', true); },
      },
      {
        id: 'peddler', name: '行脚商', sprite: 'samurai_green', tint: 0xffd8b0, scale: 2.2,
        x: 56, y: 19, dir: 'down',
        lines: function () {
          return ['我只走到桥头。再往东雾太重，货会潮。', '灵符、丹药、旧契拓片，换灵玉都行。', '山里人不太买东西，山里人只换命。'];
        },
        onTalk: function () { LB.flagSet('peddlerMet', true); },
      },
      {
        id: 'herb_child', name: '药庐药童', sprite: 'ninja_blue', tint: 0xe8f0d8, scale: 1.9,
        x: 46, y: 11, dir: 'down',
        lines: function () {
          return ['阿蘅姐说，露生草要趁雨采，太阳一出来就蔫了。', '药庐后面有块碑，字很小，我没读完。', '你进雾林的话，能替我看看那里的蘑菇吗？'];
        },
        onTalk: function () { LB.flagSet('herbChildMet', true); },
      },
    ],
    herbs: [
      { id: 'qingxi_herb1', x: 13, y: 14, mat: 'lucao', amount: 1, label: '采得露生草', respawn: 'chapter' },
      { id: 'qingxi_herb2', x: 43, y: 26, mat: 'lucao', amount: 1, label: '采得露生草', respawn: 'chapter' },
    ],
    gathers: [
      { id: 'qingxi_g1', x: 12, y: 13, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'qingxi_g2', x: 20, y: 22, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'qingxi_g3', x: 47, y: 9, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'qingxi_g4', x: 51, y: 13, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'qingxi_g5', x: 50, y: 24, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'qingxi_g6', x: 28, y: 37, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'qingxi_g7', x: 48, y: 34, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
    ],
    chests: [
      { id: 'medicine_basket', name: '老丈的药篓', x: 8, y: 29, jade: 6, items: [{ id: 'pill', count: 3 }], flag: 'basket', label: '拾得老丈的药篓 · 丹药 3 枚' },
      { id: 'qingxi_chest2', name: '溪畔石匣', x: 41, y: 24, jade: 12, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 12' },
      { id: 'boat1', name: '溪上纸船', x: 10, y: 28, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'boat1', label: '拾得纸船 · 船腹写着「阿翁」' },
      { id: 'boat2', name: '溪上纸船', x: 22, y: 30, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'boat2', label: '拾得纸船 · 船腹画着一枚小契印' },
      { id: 'boat3', name: '溪上纸船', x: 36, y: 25, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'boat3', label: '拾得纸船 · 船头被水泡软了' },
      { id: 'qingxi_cache', name: '旧祠暗匣', x: 56, y: 9, jade: 18, items: [{ id: 'charm', count: 2 }], needFlag: 'bridgeFixed', lockedText: '断桥未修 · 溪东旧事还过不去', label: '拾得旧契拓片 · 灵符 2 张 · 灵玉 18' },
    ],
    props: [
      { type: 'house', x: 7, y: 12, frame: 'house1' },
      { type: 'house', x: 47, y: 8, frame: 'house2' },
      { type: 'altar', x: 26, y: 7 },
      { type: 'lantern', x: 14, y: 16 },
      { type: 'lantern', x: 26, y: 15 },
      { type: 'sign', x: 4, y: 29 },
      { type: 'well', x: 6, y: 25 },
      { type: 'stall', x: 55, y: 18 },
      { type: 'dock', x: 55, y: 27 },
      { type: 'ruin', x: 34, y: 35 },
      { type: 'altar', x: 35, y: 38 },
      { type: 'lantern', x: 31, y: 36 },
      { type: 'lantern', x: 39, y: 36 },
      { type: 'sign', x: 30, y: 34 },
    ],
    steles: [
      { id: 'qingxi_stele1', x: 10, y: 20, title: '初立门碑', text: '「立门者不立碑，碑在山上。」落款是初代契灵者，字迹被水汽晕开。', codex: 'limen' },
      { id: 'qingxi_stele2', x: 40, y: 12, title: '盛世残记', text: '「是岁，五脉安流，山门与灵兽共守，无锁无争。」后半句被人凿去了。', codex: 'shengshi' },
      { id: 'qingxi_stele3', x: 47, y: 18, title: '木桥旧契', text: '「桥成于契，断于争。后人若修此桥，先问溪水愿不愿。」桥桩上还缠着半截契绳。', codex: 'qingxi_qiao' },
      { id: 'qingxi_stele4', x: 31, y: 38, title: '旧祠残碑', text: '「此处不供神，只供名字。名字在，契就在；名字没了，山也就不在了。」', codex: 'qingxi_ci' },
    ],
  }),

  // —— 第二境 ——
  // v2.1 垂直切片：48×36 → 62×46，东侧雾泉药圃、南侧雾潭旧渡
  wuyin: makeRegion({
    id: 'wuyin', name: '雾隐林', chapter: 2, subtitle: '林深藏药，雾重无名',
    w: 62, h: 46, base: '.', spawn: { x: 4, y: 18 },
    fog: true, weather: 'fog', tint: '#eee9dd', timeTint: '#efeade',
    paint: function (m) {
      m.border('T', 2);

      // 林团：西药庐、北祭坛、东雾松、南雾潭
      [[6, 8, 4], [17, 7, 3], [24, 4, 2], [38, 6, 3], [44, 10, 2], [48, 4, 3], [58, 5, 3],
        [6, 30, 3], [12, 33, 3], [22, 40, 3], [26, 31, 3], [40, 28, 4], [49, 29, 2],
        [58, 24, 3], [48, 35, 3], [58, 33, 3], [57, 42, 2], [44, 38, 2], [38, 43, 2], [20, 42, 2]].forEach(function (b) {
        m.blob(b[0], b[1], b[2], 'T');
      });

      // 雾泉与雾潭
      m.rect(53, 9, 3, 8, 'W');
      m.blob(54, 13, 2, 'W');
      m.rect(27, 41, 7, 3, 'W');
      m.blob(30, 42, 2, 'W');

      // 草地
      m.blob(12, 24, 3, 'g');
      m.blob(20, 28, 3, 'g');
      m.blob(36, 24, 4, 'g');
      m.blob(42, 6, 3, 'g');
      m.blob(26, 36, 2, 'g');
      m.blob(48, 36, 2, 'g');
      m.blob(56, 30, 2, 'g');
      m.blob(50, 8, 2, 'g');
      m.blob(14, 40, 2, 'g');

      // 旧路
      m.line(2, 18, 8, 18, ',');
      m.line(8, 18, 8, 12, ',');
      m.line(8, 12, 16, 12, ',');
      m.line(16, 12, 16, 20, ',');
      m.line(16, 20, 24, 20, ',');
      m.line(24, 20, 24, 12, ',');
      m.line(24, 12, 32, 12, ',');
      m.line(32, 12, 32, 7, ',');
      m.line(32, 7, 30, 7, ',');
      m.line(32, 12, 32, 18, ',');
      m.line(32, 18, 40, 18, ',');
      m.line(40, 18, 45, 18, ',');
      m.line(45, 18, 58, 18, ',');

      // 西侧药庐
      m.line(8, 18, 8, 26, ',');
      m.rect(8, 26, 3, 2, ',');

      // 东侧药圃与猎屋
      m.line(50, 18, 50, 11, ',');
      m.rect(47, 10, 4, 2, ',');
      m.line(50, 11, 52, 11, ',');
      m.line(50, 18, 50, 25, ',');
      m.rect(50, 25, 3, 2, ',');

      // 南侧雾潭与旧渡
      m.line(32, 18, 32, 32, ',');
      m.line(32, 32, 24, 32, ',');
      m.line(24, 32, 24, 36, ',');
      m.line(24, 36, 27, 36, ',');
      m.line(32, 32, 45, 32, ',');
      m.line(45, 32, 45, 28, ',');
      m.line(40, 18, 40, 26, ',');
      m.line(40, 26, 45, 30, ',');
      m.line(45, 32, 45, 40, ',');
      m.line(45, 40, 36, 40, ',');
      m.line(45, 40, 50, 40, ',');
      m.line(50, 40, 58, 40, ',');
      m.line(58, 18, 58, 40, ',');

      // 建筑地面
      m.rect(28, 3, 5, 2, 'A');
      m.rect(3, 26, 4, 3, 'H');
      m.rect(51, 21, 4, 3, 'H');
      m.rect(45, 7, 4, 3, 'H');

      m.put(59, 18, 'E');
      m.put(2, 18, 'E');
    },
    exits: [
      { to: 'qingxi', x: 2, y: 18, need: null, label: '回青溪谷' },
      { to: 'luoxing', x: 59, y: 18, need: { chapter: 3 }, label: '出林 · 落星原' },
    ],
    pool: [
      { sp: 'youmu', lv: [5, 8] },
      { sp: 'qingheng', lv: [5, 7] },
      { sp: 'chaoxi', lv: [5, 7] },
      { sp: 'moyu', lv: [5, 6] },
    ],
    boss: 'wuyinxiao',
    npcs: [
      {
        id: 'aheng', name: '采药人阿蘅', sprite: 'ninja_blue', tint: 0xd8f0d8, scale: 2.6,
        x: 17, y: 19, dir: 'down', mark: 'main',
        lines: function () {
          if (!LB.flag('boss_wuyinxiao')) return ['嘘——别踩那片苔。', '雾隐魈把林子的灵息锁住了，我的药圃里只剩三株露生草还能采。', '帮我采齐三株，我告诉你它在哪儿。'];
          return ['雾散了。你看，草叶上的露又回来了。', '锁灵术的痕迹留在树皮上，像被抽走名字的掌印。', '往东出林去落星原，天工司的炉子还亮着。'];
        },
        onTalk: function () { LB.flagSet('herbalistMet', true); },
      },
      {
        id: 'apprentice', name: '药庐学徒', sprite: 'samurai_green', tint: 0xd8f0d8, scale: 2.2,
        x: 10, y: 27, dir: 'right',
        lines: function () {
          if (LB.flag('wuyinGrannyDone')) return ['婆婆把三畦药草都救活了。', '她说雾里也能种药，只要有人肯等露水。'];
          return ['师门说，锁住的灵息也能用草叶一寸寸化开。', '我采了三年药，只学会分辨露水的新旧。', '东边药圃的婆婆脾气怪，但她的方子是真的。'];
        },
      },
      {
        id: 'wuyin_hunter', name: '猎户·石叔', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.3,
        x: 51, y: 25, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('wuyinHuntDone')) return ['三道猎迹都收齐了。雾里的东西，也有自己的路。', '往南是雾潭。渡夫欠我一坛酒，你替我讨。'];
          if (LB.flag('huntMark1') && LB.flag('huntMark2') && LB.flag('huntMark3')) return ['三道猎迹你全找到了？好眼力。', '把拓片给我，我认一认这林子里的脚印。'];
          if (LB.flag('wuyinHunterMet')) return ['猎迹不是兽印，是被雾抹掉的人走过的痕迹。', '东边石上、泉边树上、南坡石缝里，各有一处。'];
          return ['这林子我走了二十年，今年雾比往年重。', '雾里有人走过，脚印到一半就断了。', '替我找三处猎迹，我告诉你雾隐魈的习性。'];
        },
        onTalk: function () {
          LB.flagSet('wuyinHunterMet', true);
          if (LB.flag('huntMark1') && LB.flag('huntMark2') && LB.flag('huntMark3') && !LB.flag('wuyinHuntDone')) {
            LB.flagSet('wuyinHuntDone', true);
            LB.toast('猎迹已辨 · 石叔教你雾中辨位');
          }
        },
      },
      {
        id: 'wuyin_granny', name: '药农·婆婆', sprite: 'samurai_green', tint: 0xe8f0d8, scale: 2.1,
        x: 48, y: 11, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('wuyinGrannyDone')) return ['三畦药草都活了。雾再重，也有药香。', '阿蘅那孩子，把方子看得比命重。'];
          if (LB.flag('wuyinGrannyMet')) {
            if (LB.matCount('lucao') >= 3) return ['露生草带来了？摊在石台上，我看看露水。', '（她把草叶一一翻过，慢慢点头。）够了。'];
            return ['药圃里还缺三株露生草，长在雾薄的地方。', '别拔根。根在，下一场雨还会长。'];
          }
          return ['药圃三畦，今年只活了一畦。', '雾把灵气锁住，草就不肯抽叶。', '你若有露生草，匀我三株；我拿清心散换。'];
        },
        onTalk: function () {
          LB.flagSet('wuyinGrannyMet', true);
          if (!LB.flag('wuyinGrannyDone') && LB.matCount('lucao') >= 3) {
            LB.consumeMaterial('lucao', 3);
            LB.giveItem('cleanse', 1);
            LB.flagSet('wuyinGrannyDone', true);
            LB.toast('婆婆收下露生草 · 清心散 +1');
          }
        },
      },
      {
        id: 'wuyin_ferry', name: '渡夫·老渡', sprite: 'ninja_blue', tint: 0xcfe0e8, scale: 2.3,
        x: 36, y: 39, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('ferryFixed')) return ['渡口修好了，雾潭上也敢行船了。', '潭底沉着旧契，水浅时能看见。'];
          if (LB.flag('ferryOar')) return ['桨找回来了？灵木也够？', '有力气就帮我把渡桩重新扎一遍。'];
          if (LB.flag('ferryMet')) return ['船桨被水冲到潭西去了。', '灵木备两根，我就能把渡桩扎稳。'];
          return ['雾潭旧渡三十年没人走了。', '船还在，桨没了。', '你要过潭？先替我把桨找回来。'];
        },
        onTalk: function () {
          LB.flagSet('ferryMet', true);
          if (!LB.flag('ferryFixed') && LB.flag('ferryOar') && LB.matCount('lingmu') >= 2) {
            LB.consumeMaterial('lingmu', 2);
            LB.flagSet('ferryFixed', true);
            LB.toast('雾潭旧渡已修 · 渡桩重新扎稳');
          }
        },
      },
      {
        id: 'wuyin_child', name: '迷路小童', sprite: 'ninja_blue', tint: 0xffd8b0, scale: 1.9,
        x: 27, y: 35, dir: 'down',
        lines: function () {
          if (LB.flag('childHome')) return ['三块木牌都挂回去了。娘的名字，我记住了。', '雾再大，我也认得回家的路。'];
          if (LB.flag('nameTag1') && LB.flag('nameTag2') && LB.flag('nameTag3')) return ['木牌都找到了？', '（他把木牌一块块抱在怀里。）这是我家门上的。'];
          if (LB.flag('lostChildMet')) return ['我家的门牌被风吹散了，三块。', '一块在南坡草里，一块在潭边石下，一块在旧渡板缝里。'];
          return ['我和娘走散了。', '雾里什么都一样，只有门牌上的字不一样。', '三块木牌……你能帮我找回来吗？'];
        },
        onTalk: function () {
          LB.flagSet('lostChildMet', true);
          if (LB.flag('nameTag1') && LB.flag('nameTag2') && LB.flag('nameTag3') && !LB.flag('childHome')) {
            LB.flagSet('childHome', true);
            LB.toast('木牌归位 · 小童认得了回家的路');
          }
        },
      },
      {
        id: 'wuyin_wood', name: '樵夫·阿木', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.2,
        x: 55, y: 28, dir: 'down',
        lines: function () {
          if (LB.flag('woodCleared')) return ['倒木清开了，林子里的风也顺了。', '雾松的木头沉，烧起来却香。'];
          if (LB.flag('woodcutterMet')) return ['倒木压住了半条山道。', '灵木四块，我就能把支架打起来。'];
          return ['雾松倒了三棵，把东边的路压住了。', '我一个人搬不动。', '你带四块灵木来，我教你认雾松的年轮。'];
        },
        onTalk: function () {
          LB.flagSet('woodcutterMet', true);
          if (!LB.flag('woodCleared') && LB.matCount('lingmu') >= 4) {
            LB.consumeMaterial('lingmu', 4);
            LB.flagSet('woodCleared', true);
            LB.toast('倒木已清 · 东边山道通了');
          }
        },
      },
      {
        id: 'wuyin_rubbing', name: '拓碑人·柳先生', sprite: 'ninja_blue', tint: 0xe0dcd0, scale: 2.2,
        x: 43, y: 34, dir: 'down',
        lines: function () {
          if (LB.flag('wuyinRubbingMet')) return ['旧渡那碑字浅，拓的时候手要稳。', '雾泉边的刻痕是新的，像有人刚刻上去。'];
          return ['我替山门拓碑，拓到雾隐林就不敢再往里。', '这林子的碑会换位置，今天在东，明天在南。', '你若见着碑，替我读一读。'];
        },
        onTalk: function () { LB.flagSet('wuyinRubbingMet', true); },
      },
    ],
    herbs: [
      { id: 'herb1', x: 9, y: 28, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'herb2', x: 12, y: 26, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'herb3', x: 15, y: 29, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb4', x: 50, y: 9, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb5', x: 46, y: 11, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb6', x: 29, y: 37, mat: 'lucao', amount: 1, label: '采得露生草' },
    ],
    gathers: [
      { id: 'wuyin_g1', x: 26, y: 24, mat: 'lingmu', amount: 2, label: '拾得灵木 2 块', respawn: 'chapter' },
      { id: 'wuyin_g2', x: 36, y: 21, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g3', x: 48, y: 16, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g4', x: 57, y: 20, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'wuyin_g5', x: 34, y: 42, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g6', x: 31, y: 35, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'wuyin_g7', x: 54, y: 33, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
    ],
    chests: [
      { id: 'wuyin_chest1', name: '药庐旧箱', x: 6, y: 24, jade: 10, items: [{ id: 'pill', count: 2 }], label: '拾得丹药 2 枚 · 灵玉 10' },
      { id: 'wuyin_chest2', name: '雾中木匣', x: 45, y: 22, jade: 12, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 12' },
      { id: 'wuyin_hunt1', name: '石上的猎迹', x: 47, y: 20, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'huntMark1', label: '拓下猎迹（一）· 灵玉 4' },
      { id: 'wuyin_hunt2', name: '树上的猎迹', x: 57, y: 9, jade: 4, items: [{ id: 'charm', count: 1 }], flag: 'huntMark2', label: '拓下猎迹（二）· 灵玉 4' },
      { id: 'wuyin_hunt3', name: '石缝里的猎迹', x: 56, y: 29, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'huntMark3', label: '拓下猎迹（三）· 灵玉 4' },
      { id: 'wuyin_tag1', name: '草里的木牌', x: 18, y: 36, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag1', label: '拾得木牌 · 刻着半个「娘」字' },
      { id: 'wuyin_tag2', name: '潭边的木牌', x: 34, y: 40, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag2', label: '拾得木牌 · 边角被水泡软' },
      { id: 'wuyin_tag3', name: '渡板下的木牌', x: 41, y: 41, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag3', label: '拾得木牌 · 背面有小小的契印' },
      { id: 'wuyin_oar', name: '雾潭渡桨', x: 35, y: 42, jade: 6, items: [{ id: 'charm', count: 1 }], flag: 'ferryOar', label: '拾得旧渡桨 · 灵玉 6' },
    ],
    props: [
      { type: 'altar', x: 30, y: 5 },
      { type: 'house', x: 4, y: 28, frame: 'house2' },
      { type: 'house', x: 52, y: 23, frame: 'house1' },
      { type: 'house', x: 46, y: 9, frame: 'house2' },
      { type: 'lantern', x: 16, y: 13 },
      { type: 'lantern', x: 32, y: 17 },
      { type: 'lantern', x: 50, y: 12 },
      { type: 'lantern', x: 50, y: 26 },
      { type: 'lantern', x: 36, y: 38 },
      { type: 'lantern', x: 24, y: 37 },
      { type: 'sign', x: 3, y: 19 },
      { type: 'sign', x: 49, y: 18 },
      { type: 'sign', x: 33, y: 32 },
      { type: 'well', x: 14, y: 15 },
      { type: 'ruin', x: 42, y: 14 },
      { type: 'ruin', x: 44, y: 39 },
      { type: 'stall', x: 55, y: 19 },
      { type: 'dock', x: 33, y: 40 },
    ],
    steles: [
      { id: 'wuyin_stele1', x: 22, y: 16, title: '断契旧刻', text: '「三十年前，十二门同铸锁器。灵脉逆流，渊兽自裂谷出。」刻到这里，石面焦黑。', codex: 'duanqi' },
      { id: 'wuyin_stele2', x: 24, y: 8, title: '药庐植草录', text: '「露生草生于雾薄处，叶上有露者活，无露者已被锁。」旁有小字：勿拔根。', codex: 'wuyinyaolu' },
      { id: 'wuyin_stele3', x: 51, y: 9, title: '雾泉旧刻', text: '「泉自石心出，雾自泉心起。饮泉者忘归，故以石栏围之。」石栏早已塌了。', codex: 'wuyin_quan' },
      { id: 'wuyin_stele4', x: 41, y: 35, title: '旧渡残碑', text: '「渡口不渡生人，只渡旧契。契断则舟沉，故舟底压着半段契绳。」', codex: 'wuyin_du' },
      { id: 'wuyin_stele5', x: 53, y: 26, title: '猎户刻木', text: '木牌上刻着二十几个名字，每道刻痕旁都有一个小小的兽爪印。最末一处新刻：石叔。', codex: 'wuyin_lie' },
    ],
  }),

  // —— 第三境 ——
  // v2.1 垂直切片：50×38 → 62×46，北侧观星台与星陨坑、东侧天工司旧坊、南侧星砂矿坑与风蚀谷
  luoxing: makeRegion({
    id: 'luoxing', name: '落星原', chapter: 3, subtitle: '星落成原，炉火未熄',
    w: 62, h: 46, base: '.', spawn: { x: 5, y: 20 },
    weather: 'clear', tint: '#f1eadb', timeTint: '#f2ebdc',
    encounterTiles: ['g', 'D'],
    paint: function (m) {
      m.border('T', 2);

      // 星原沙地
      m.blob(12, 10, 5, 'D');
      m.blob(26, 7, 4, 'D');
      m.blob(41, 9, 5, 'D');
      m.blob(52, 8, 4, 'D');
      m.blob(18, 33, 5, 'D');
      m.blob(31, 36, 5, 'D');
      m.blob(49, 34, 5, 'D');
      m.blob(56, 22, 3, 'D');
      m.blob(8, 24, 3, 'D');

      // 星泉
      m.blob(52, 14, 2, 'W');

      // 风蚀岩与陨坑石阵
      m.rect(34, 4, 4, 3, 'R');
      m.blob(44, 12, 2, 'R');
      m.blob(7, 8, 2, 'R');
      m.blob(16, 14, 2, 'R');
      m.blob(29, 30, 2, 'R');
      m.blob(44, 39, 2, 'R');
      m.blob(57, 14, 2, 'R');
      m.blob(56, 40, 2, 'R');

      // 草地
      m.blob(14, 27, 3, 'g');
      m.blob(22, 14, 2, 'g');
      m.blob(38, 20, 3, 'g');
      m.blob(50, 27, 2, 'g');
      m.blob(22, 40, 3, 'g');
      m.blob(41, 40, 3, 'g');
      m.blob(58, 32, 2, 'g');

      // 林团
      [[6, 6, 2], [16, 4, 3], [24, 3, 2], [32, 3, 2], [46, 3, 3], [56, 4, 2],
        [6, 32, 3], [12, 40, 2], [18, 42, 3], [30, 42, 2], [42, 43, 2], [52, 43, 3],
        [58, 24, 2], [58, 38, 2], [36, 28, 2], [16, 20, 2]].forEach(function (b) {
        m.blob(b[0], b[1], b[2], 'T');
      });

      // 建筑地面
      m.rect(18, 12, 4, 3, 'H');
      m.rect(26, 12, 4, 3, 'H');
      m.rect(18, 22, 4, 3, 'H');
      m.rect(27, 22, 4, 3, 'H');
      m.rect(46, 18, 5, 3, 'H');
      m.rect(53, 24, 4, 3, 'H');
      m.rect(29, 6, 5, 2, 'A');

      // 主路：西入口 → 星落集 → 天工司旧坊 → 东出口
      m.line(2, 20, 16, 20, ',');
      m.line(16, 20, 20, 16, ',');
      m.line(20, 16, 44, 16, ',');
      m.line(44, 16, 52, 16, ',');
      m.line(52, 16, 56, 16, ',');
      m.line(56, 16, 56, 20, ',');
      m.line(56, 20, 59, 20, ',');

      // 星落集广场与南向支路
      m.rect(20, 18, 12, 2, ',');
      m.line(22, 16, 22, 18, ',');
      m.line(30, 16, 30, 18, ',');
      m.line(24, 20, 24, 28, ',');
      m.line(20, 24, 32, 24, ',');
      m.line(32, 24, 32, 20, ',');

      // 北 · 观星台
      m.line(30, 16, 30, 9, ',');
      m.rect(27, 8, 7, 2, ',');

      // 北东 · 星陨坑
      m.line(38, 16, 38, 13, ',');
      m.line(38, 13, 40, 13, ',');
      m.line(40, 13, 40, 9, ',');

      // 东 · 天工司旧坊
      m.line(44, 16, 44, 22, ',');
      m.rect(44, 22, 12, 2, ',');
      m.line(50, 24, 50, 28, ',');
      m.line(44, 28, 50, 28, ',');
      m.line(44, 24, 44, 29, ',');
      m.line(44, 29, 38, 29, ',');
      m.line(38, 29, 38, 34, ',');

      // 南 · 星砂矿坑
      m.line(24, 28, 28, 30, ',');
      m.line(28, 30, 28, 37, ',');
      m.rect(26, 37, 12, 2, ',');
      m.line(36, 34, 36, 39, ',');
      m.line(36, 34, 38, 34, ',');

      // 东南 · 风蚀谷
      m.line(38, 38, 50, 38, ',');
      m.line(50, 38, 50, 34, ',');
      m.line(50, 34, 52, 34, ',');
      m.line(50, 38, 50, 40, ',');
      m.line(50, 40, 58, 40, ',');

      m.put(2, 20, 'E');
      m.put(59, 20, 'E');
    },
    exits: [
      { to: 'wuyin', x: 2, y: 20, need: null, label: '回雾隐林' },
      { to: 'guixu', x: 59, y: 20, need: { chapter: 4 }, label: '东行 · 归墟海市' },
    ],
    pool: [
      { sp: 'shijiatuo', lv: [8, 11] },
      { sp: 'xingxi', lv: [9, 12] },
      { sp: 'jinyu', lv: [8, 11] },
      { sp: 'moyu', lv: [8, 9] },
    ],
    boss: 'xingyun',
    npcs: [
      {
        id: 'zhuling', name: '铸灵师', sprite: 'samurai_green', tint: 0xe8d8c0, scale: 2.6,
        x: 46, y: 22, dir: 'down', mark: 'main',
        lines: function () {
          if (!LB.flag('boss_xingyun')) return ['这炉子三十年没熄，也没再铸过一件好东西。', '星陨傀守在陨坑里，它身上嵌着锁灵器的碎片。', '替我取回来，我告诉你断契之乱真正缺的那一环。'];
          if (LB.flag('furnaceLit')) return ['碎片我收下了。匠人造器，本不该造锁。', '青芜把炉火重新点起来了。你听，风箱的声音比从前轻。', '把你的灵笼给我看看——它比我的旧作干净。'];
          return ['碎片我收下了。匠人造器，本不该造锁。', '你若愿意，把你的灵笼给我看看——它比我的旧作干净。'];
        },
        onTalk: function () { LB.flagSet('zhulingMet', true); },
      },
      {
        id: 'miner', name: '矿工·老石', sprite: 'samurai_green', tint: 0xc8b8a0, scale: 2.4,
        x: 29, y: 38, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('mineCleared')) return ['三处塌口都支稳了。矿道又通了，风也进得去。', '坑底有些星屑，天时对的时候才浮上来。', '别在夜里下坑，坑底会应人的脚步声。'];
          if (LB.flag('minerMet')) return ['灵木三块、玄铁两块，够打三副支架。', '塌的是三岔口，不是整条矿道。'];
          return ['矿坑深处有星屑，天时对的时候才浮上来。', '今年星落得勤，矿道塌了三处，我一个人支不住。', '你若有灵木和玄铁，替我把支架打起来。'];
        },
        onTalk: function () {
          LB.flagSet('minerMet', true);
          if (!LB.flag('mineCleared') && LB.matCount('lingmu') >= 3 && LB.matCount('xuantie') >= 2) {
            LB.consumeMaterial('lingmu', 3);
            LB.consumeMaterial('xuantie', 2);
            LB.flagSet('mineCleared', true);
            LB.toast('矿道三岔已支稳 · 星砂矿脉重开');
          }
        },
      },
      {
        id: 'luoxing_stargazer', name: '星象师·裴照', sprite: 'ninja_blue', tint: 0xd8e0e8, scale: 2.5,
        x: 31, y: 11, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('starChartDone')) return ['星图补全了。那颗星的轨，是从归墟方向来的。', '天工司当年按星轨选矿，也按星轨铸器。', '你往东走，海市的人认得这枚残印。'];
          if (LB.flag('starChart1') && LB.flag('starChart2') && LB.flag('starChart3')) return ['三片都找齐了？', '（他把残片在石台上拼拢，指尖沿着裂缝走。）'];
          if (LB.flag('stargazerMet')) return ['星图碎成三片，被风带去了陨坑、星泉与西南沙地。', '残片上有旧刻，拼起来才知道缺的是哪一漏。'];
          return ['观星台不是看星，是看星落下来的路。', '今年跌下来的一颗星，把旧星图震碎了。', '三片残图散在原上，替我找回来。'];
        },
        onTalk: function () {
          LB.flagSet('stargazerMet', true);
          if (!LB.flag('starChartDone') && LB.flag('starChart1') && LB.flag('starChart2') && LB.flag('starChart3')) {
            LB.flagSet('starChartDone', true);
            LB.toast('星图补全 · 裴照读出陨星旧轨');
          }
        },
      },
      {
        id: 'luoxing_apprentice', name: '天工司学徒·青芜', sprite: 'samurai_green', tint: 0xe8f0d8, scale: 2.2,
        x: 52, y: 22, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('furnaceLit')) return ['炉火稳了。师傅说，火听人的呼吸，不听人的脾气。', '旧坊的账本残页上，记着十二山门买过同一批锁器。'];
          if (LB.flag('apprenticeMet')) return ['烬炭三块、星屑两份，就能把火重新引起来。', '别再让它熄第三次了。'];
          return ['这炉子熄了三次，每次都差一点把旧坊烧了。', '炉膛里还剩一口气，得用烬炭引。', '你身上若有烬炭和星屑，借我一些。'];
        },
        onTalk: function () {
          LB.flagSet('apprenticeMet', true);
          if (!LB.flag('furnaceLit') && LB.matCount('tanzha') >= 3 && LB.matCount('xingxie') >= 2) {
            LB.consumeMaterial('tanzha', 3);
            LB.consumeMaterial('xingxie', 2);
            LB.flagSet('furnaceLit', true);
            LB.toast('旧坊炉火重燃 · 青芜记下第一笔账');
          }
        },
      },
      {
        id: 'luoxing_courier', name: '驿马夫·陆三', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.3,
        x: 12, y: 21, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('letterDelivered')) return ['信送到了。收信的人说，三十年前的账，他还记得。', '往东过旧坊，就是归墟的潮路。', '路上别接陌生人的信。这地方的信，比刀沉。'];
          if (LB.flag('starLetter')) return ['信找着了？风蚀谷的信匣里翻出来的？', '（他接过信，看了落款，沉默了很久。）'];
          if (LB.flag('courierMet')) return ['风蚀谷那边有只旧信匣，被沙埋了半截。', '信是写给归墟海市的，落款是天工司。', '你去取来，我替你送到东口。'];
          return ['我在星原跑了二十年驿路，路比人记得清楚。', '今年风大，把风蚀谷的信匣吹开了。', '有一封没送出去的信，压在沙里。'];
        },
        onTalk: function () {
          LB.flagSet('courierMet', true);
          if (!LB.flag('letterDelivered') && LB.flag('starLetter')) {
            LB.flagSet('letterDelivered', true);
            LB.toast('旧信已托付 · 陆三向东去');
          }
        },
      },
      {
        id: 'luoxing_scavenger', name: '拾荒人·白婆', sprite: 'samurai_green', tint: 0xe0d8c0, scale: 2.1,
        x: 52, y: 34, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('shardsGiven')) return ['星屑压手，风蚀谷的风就压不住人了。', '白婆不欠人，也不让人欠。', '往南是旧渡的方向，雾大，别走岔。'];
          if (LB.flag('scavengerMet')) {
            if (LB.matCount('xingxie') >= 3) return ['星屑带来了？摊在布上，我看看成色。', '（她用指腹一粒粒捻过，点点头。）'];
            return ['三份星屑，一份都不能少。', '风蚀谷的星屑最亮，也最难捡。'];
          }
          return ['我在这谷里捡了半辈子星屑。', '星落下来是死的，落到土里才活。', '你给我三份星屑，我替你压一压这身风尘。'];
        },
        onTalk: function () {
          LB.flagSet('scavengerMet', true);
          if (!LB.flag('shardsGiven') && LB.matCount('xingxie') >= 3) {
            LB.consumeMaterial('xingxie', 3);
            LB.flagSet('shardsGiven', true);
            LB.toast('白婆收下星屑 · 风蚀旧事换了一页');
          }
        },
      },
      {
        id: 'luoxing_keeper', name: '守炉人·祁', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 44, y: 20, dir: 'down',
        lines: function () {
          if (LB.flag('furnaceLit')) return ['火又亮了。我只管看火，不管火替谁烧。', '旧炉膛里埋着半截锁器的模子，师傅不肯挖。'];
          return ['这炉火三十年没熄，今年熄了三次。', '守炉人守的不是火，是不让它烧错东西。', '你去问青芜，她比我记得清。'];
        },
        onTalk: function () { LB.flagSet('furnaceKeeperMet', true); },
      },
      {
        id: 'luoxing_doctor', name: '游医·柳娘', sprite: 'ninja_blue', tint: 0xe8f0e8, scale: 2.1,
        x: 28, y: 19, dir: 'down',
        lines: function () {
          return ['星砂入肺会咳，喝一碗清心散就好。', '落星原的风干，伤口结痂快，也裂得快。', '别把星屑当宝物，它先伤的是拾它的人。'];
        },
        onTalk: function () { LB.flagSet('luoxingDoctorMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'luoxing_g1', x: 38, y: 21, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g2', x: 45, y: 35, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'luoxing_g3', x: 48, y: 8, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g4', x: 34, y: 8, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'luoxing_g5', x: 14, y: 36, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
      { id: 'luoxing_g6', x: 22, y: 40, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g7', x: 56, y: 32, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
    ],
    chests: [
      { id: 'luoxing_chest1', name: '矿坑边箱', x: 26, y: 39, jade: 14, items: [{ id: 'xingxie', count: 1 }], label: '拾得旧锤与星屑 · 灵玉 14' },
      { id: 'luoxing_chest2', name: '风蚀木匣', x: 54, y: 40, jade: 12, items: [{ id: 'pill', count: 2 }], label: '拾得丹药 2 枚 · 灵玉 12' },
      { id: 'luoxing_chart1', name: '陨坑星图残片', x: 38, y: 6, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'starChart1', label: '拾得星图残片（一）· 灵玉 4' },
      { id: 'luoxing_chart2', name: '星泉星图残片', x: 52, y: 10, jade: 4, items: [{ id: 'charm', count: 1 }], flag: 'starChart2', label: '拾得星图残片（二）· 灵玉 4' },
      { id: 'luoxing_chart3', name: '沙地星图残片', x: 18, y: 33, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'starChart3', label: '拾得星图残片（三）· 灵玉 4' },
      { id: 'luoxing_letter', name: '风蚀信匣', x: 47, y: 40, jade: 6, items: [{ id: 'xingxie', count: 1 }], flag: 'starLetter', label: '拾得天工司旧信 · 灵玉 6' },
      { id: 'luoxing_chest3', name: '旧坊料箱', x: 44, y: 25, jade: 16, items: [{ id: 'xuantie', count: 1 }], label: '拾得玄铁 1 块 · 灵玉 16' },
    ],
    props: [
      { type: 'altar', x: 31, y: 7 },
      { type: 'house', x: 19, y: 14, frame: 'house1' },
      { type: 'house', x: 27, y: 14, frame: 'house2' },
      { type: 'house', x: 19, y: 24, frame: 'house2' },
      { type: 'house', x: 28, y: 24, frame: 'house1' },
      { type: 'house', x: 48, y: 20, frame: 'house1' },
      { type: 'house', x: 54, y: 26, frame: 'house2' },
      { type: 'lantern', x: 20, y: 17 },
      { type: 'lantern', x: 32, y: 17 },
      { type: 'lantern', x: 44, y: 21 },
      { type: 'lantern', x: 52, y: 24 },
      { type: 'lantern', x: 24, y: 26 },
      { type: 'lantern', x: 50, y: 39 },
      { type: 'sign', x: 3, y: 21 },
      { type: 'sign', x: 30, y: 15 },
      { type: 'sign', x: 56, y: 21 },
      { type: 'well', x: 21, y: 20 },
      { type: 'stall', x: 33, y: 18 },
      { type: 'stall', x: 12, y: 19 },
      { type: 'ruin', x: 39, y: 6 },
      { type: 'ruin', x: 27, y: 31 },
      { type: 'ruin', x: 53, y: 37 },
    ],
    steles: [
      { id: 'luoxing_stele1', x: 45, y: 17, title: '天工司炉铭', text: '「器可载契，亦可夺契。匠人不问用途，用途自问匠人。」铭下有一道锤痕。', codex: 'tiangongsi' },
      { id: 'luoxing_stele2', x: 41, y: 12, title: '渊兽志残页', text: '「渊兽无契，非不愿，是不能。灵息被抽尽者，不复有名。」末字被凿平。', codex: 'yuanshou' },
      { id: 'luoxing_stele3', x: 25, y: 10, title: '观星台残碑', text: '「星落有轨，器成有价。轨可推，价不可推。」碑阴刻着一整幅星图，缺了三处。', codex: 'guanxingtai' },
      { id: 'luoxing_stele4', x: 25, y: 34, title: '星砂矿脉刻', text: '「星砂生于陨处，玄铁出于砂底。取砂者留三分，留与后来人。」', codex: 'kuangmai' },
      { id: 'luoxing_stele5', x: 55, y: 38, title: '风蚀驿路碑', text: '「驿路东去归墟，西回雾林。信不入风，人不入沙。」碑脚压着几封没寄出的旧信。', codex: 'fengshiyi' },
    ],
  }),

});
