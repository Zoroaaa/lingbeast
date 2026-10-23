// 灵兽录 · 八境 · 第一境 · 山雨欲来，谷口先静
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.qingxi = makeRegion({
    id: 'qingxi', name: '青溪谷', chapter: 1, subtitle: '山雨欲来，谷口先静',
    w: 64, h: 48, base: '.', spawn: { x: 4, y: 30 },
    weather: 'rain', tint: '#f2ede2', timeTint: '#f4efe3',
    paint: function (m) {
      m.border('T', 2);
      // 南崖、西坡
      m.rect(0, 44, 64, 4, 'C');
      m.blob(17, 41, 4, 'C');
      m.rect(2, 3, 2, 18, 'C');
      // 溪流自北而来，穿谷成潭
      m.rect(36, 2, 4, 16, 'W');
      m.blob(36, 19, 3, 'W');
      m.rect(36, 12, 4, 2, 'b');
      // 溪东湖塘与木栈
      m.blob(55, 30, 4, 'W');
      m.rect(50, 26, 10, 3, 'W');
      // 西坡三层梯田
      m.rect(6, 4, 17, 2, ',');
      m.rect(6, 7, 17, 2, ',');
      m.rect(6, 10, 17, 2, ',');
      m.rect(22, 4, 1, 8, 'R');
      // 旧祠石坪
      m.rect(29, 33, 12, 9, ',');
      // 东林与谷口
      m.blob(60, 8, 3, 'T');
      m.blob(60, 34, 3, 'T');
      m.line(4, 30, 30, 30, ',');
      m.line(30, 30, 49, 19, ',');
      m.line(49, 19, 61, 17, ',');
      m.put(4, 31, 'E');
      m.put(61, 17, 'E');
    },
    exits: [
      { to: 'shanmen', x: 4, y: 31, need: null, label: '回山门' },
      { to: 'wuyin', x: 61, y: 17, need: { chapter: 2 }, label: '过木桥 · 雾隐林' },
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
          if (LB.flag('streamAsked')) return ['桥板落下去时，水自己让了一线。', '守桥人守的不是木头，是过桥的人。'];
          if (LB.flag('bridgeForced')) return ['桥是通了。可溪水记得你落桩的那一夜。', '以后过桥，脚步轻些。'];
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
      { id: 'qingxi_chest2', name: '溪畔石匣', x: 41, y: 24, jade: 12, items: [{ id: 'charm', count: 2 }], gear: 'qingxi_seal', label: '拾得灵符 2 张 · 溪畔契印 · 灵玉 12' },
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
  });
