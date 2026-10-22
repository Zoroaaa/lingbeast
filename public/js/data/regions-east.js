// 灵兽录 · 数据层 · 八境 · 归墟至深渊
Object.assign(REGIONS, {
  // —— 第四境 ——
  // v2.1 垂直切片：48×34 → 62×46，北侧盐田、东侧沉船坞、南侧退潮滩与鲛人礁
  guixu: makeRegion({
    id: 'guixu', name: '归墟海市', chapter: 4, subtitle: '潮退市开，价由人定',
    w: 62, h: 46, base: '.', spawn: { x: 5, y: 16 },
    fog: true, weather: 'rain', tint: '#e9e6dc', timeTint: '#eae7dd',
    encounterTiles: ['D', 'g'],
    paint: function (m) {
      m.border('W', 2);

      // 潮滩沙地
      m.blob(10, 8, 5, 'D');
      m.blob(22, 32, 6, 'D');
      m.blob(35, 37, 5, 'D');
      m.blob(50, 34, 5, 'D');
      m.blob(40, 8, 4, 'D');
      m.blob(56, 26, 3, 'D');
      m.blob(12, 26, 4, 'D');
      m.blob(54, 10, 3, 'D');

      // 潮池与浅水
      m.blob(16, 22, 2, 'W');
      m.blob(38, 26, 3, 'W');
      m.blob(48, 20, 2, 'W');
      m.blob(56, 14, 2, 'W');
      m.blob(28, 6, 2, 'W');

      // 礁石
      m.blob(8, 32, 2, 'R');
      m.blob(44, 30, 2, 'R');
      m.blob(58, 38, 2, 'R');
      m.blob(30, 40, 2, 'R');
      m.blob(6, 12, 2, 'R');
      m.blob(46, 6, 2, 'R');

      // 滩草
      m.blob(18, 28, 2, 'g');
      m.blob(52, 30, 2, 'g');

      // 海市建筑
      m.rect(18, 11, 4, 3, 'H');
      m.rect(26, 11, 5, 3, 'H');
      m.rect(34, 11, 4, 3, 'H');
      m.rect(16, 20, 4, 3, 'H');
      m.rect(24, 20, 4, 3, 'H');
      m.rect(33, 20, 4, 3, 'H');
      m.rect(46, 12, 5, 3, 'H');
      m.rect(52, 20, 4, 3, 'H');
      m.rect(20, 30, 4, 3, 'H');
      m.rect(33, 9, 3, 2, 'A');

      // 主栈桥
      m.rect(16, 15, 25, 3, 'M');
      m.line(2, 16, 16, 16, ',');
      m.line(41, 16, 56, 16, 'M');
      m.line(56, 16, 59, 16, ',');

      // 北 · 盐田
      m.line(24, 15, 24, 8, 'M');
      m.line(14, 8, 24, 8, 'M');
      m.rect(13, 6, 4, 2, 'D');

      // 东 · 沉船坞
      m.line(46, 15, 46, 22, 'M');
      m.line(46, 22, 52, 22, 'M');
      m.line(52, 22, 52, 26, 'M');
      m.line(52, 26, 56, 26, 'M');

      // 南 · 退潮滩与鲛人礁
      m.line(28, 18, 28, 26, 'M');
      m.line(20, 26, 28, 26, 'M');
      m.line(28, 26, 34, 30, 'M');
      m.line(34, 30, 34, 36, 'M');
      m.line(34, 36, 44, 36, 'M');
      m.line(44, 36, 44, 30, 'M');
      m.line(44, 30, 50, 30, 'M');
      m.line(50, 30, 50, 34, 'M');
      m.line(50, 34, 54, 34, 'M');
      m.line(28, 26, 28, 32, 'M');

      m.put(2, 16, 'E');
      m.put(59, 16, 'E');
    },
    exits: [
      { to: 'luoxing', x: 2, y: 16, need: null, label: '回落星原' },
      { to: 'yunmeng', x: 59, y: 16, need: { chapter: 5 }, label: '渡口 · 云梦泽' },
    ],
    pool: [
      { sp: 'chaoxi', lv: [12, 15] },
      { sp: 'guixujiao', lv: [13, 16] },
      { sp: 'jinyu', lv: [12, 15] },
      { sp: 'yunmengbei', lv: [12, 14] },
    ],
    boss: 'suolingjiao',
    npcs: [
      {
        id: 'haishi', name: '海市主', sprite: 'ninja_blue', tint: 0xd0dce8, scale: 2.6,
        x: 20, y: 14, dir: 'down', mark: 'main',
        lines: function () {
          if (!LB.flag('boss_suolingjiao')) return ['潮退了，海市才开。你来得不早不晚。', '锁灵鲛守着旧渡口，它认器不认人。', '想听断契之乱的真相，先替我把它赶回深水。'];
          if (LB.flag('ledgerDone')) return ['账页补全了。三十年前十二山门在这里买过同一样东西。', '锁灵器不是从天上掉下来的，是人一笔一笔订的。', '你若要问价，先想清楚自己拿什么换。'];
          return ['账清了。三十年前十二山门在这里买过同一样东西。', '账房的账页被潮水卷走了几页，他嘴上不说，心里急。', '你若要问价，先想清楚自己拿什么换。'];
        },
        onTalk: function () { LB.flagSet('haishiMet', true); },
      },
      {
        id: 'trader', name: '行商', sprite: 'samurai_green', tint: 0xf0d8b8, scale: 2.2,
        x: 30, y: 18, dir: 'left',
        lines: function () {
          return ['灵材、残契、旧器，我这儿都有；价钱看你识不识货。', '海盐要趁退潮收，过了时辰就苦了。', '别问我站哪一边。潮水不站队，我也不站。'];
        },
      },
      {
        id: 'guixu_ledger', name: '账房先生·算盘', sprite: 'ninja_blue', tint: 0xe0dcd0, scale: 2.4,
        x: 31, y: 16, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('ledgerDone')) return ['三页账都补回来了。旧账一合，海市主就不好再装糊涂。', '归墟的账从来不止记钱，也记人情。', '你要查的那笔，落款在十二山门。'];
          if (LB.flag('ledger1') && LB.flag('ledger2') && LB.flag('ledger3')) return ['三页都齐了？', '（他把账页按潮痕对在一起，指尖停在一行小字上。）'];
          if (LB.flag('guixuLedgerMet')) return ['盐田、沉船、暗仓，各有一页。', '账页沾了潮气，字会自己走。快去。'];
          return ['海市的账，一页都不能少。', '昨夜涨潮，三页旧账被卷去了盐田、沉船坞和暗仓。', '你替我找回来，我告诉你这笔账记的是谁。'];
        },
        onTalk: function () {
          LB.flagSet('guixuLedgerMet', true);
          if (!LB.flag('ledgerDone') && LB.flag('ledger1') && LB.flag('ledger2') && LB.flag('ledger3')) {
            LB.flagSet('ledgerDone', true);
            LB.toast('潮汐三账已合 · 算盘翻到最后一页');
          }
        },
      },
      {
        id: 'guixu_salter', name: '盐工·阿咸', sprite: 'samurai_green', tint: 0xc8b8a0, scale: 2.3,
        x: 20, y: 8, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('saltDone')) return ['盐田三畦都收了。潮水一退，盐就白得晃眼。', '海盐能定灵息，也能定人心。', '你身上那股锁灵器的味儿，用盐洗一洗吧。'];
          if (LB.flag('guixuSalterMet')) {
            if (LB.matCount('haiyan') >= 3) return ['海盐带来了？摊开我看看。', '（他捏起一撮，在指间搓了搓。）够咸，能用。'];
            return ['三份海盐，缺一畦都收不齐。', '盐田在潮线边上，退潮才看得见畦。'];
          }
          return ['今年潮水懒，盐田只收了一畦。', '三畦盐要是都废了，海市就得喝淡水。', '你有海盐，匀我三份；我教你怎么用盐定灵息。'];
        },
        onTalk: function () {
          LB.flagSet('guixuSalterMet', true);
          if (!LB.flag('saltDone') && LB.matCount('haiyan') >= 3) {
            LB.consumeMaterial('haiyan', 3);
            LB.flagSet('saltDone', true);
            LB.toast('盐田三畦已收 · 阿咸教了定息法');
          }
        },
      },
      {
        id: 'guixu_shipwright', name: '船匠·老柯', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.4,
        x: 48, y: 16, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('wreckFixed')) return ['船骨接上了。旧渡的船能再过云梦泽。', '沉船里不止有货，还有三十年前的契绳。', '往东是雾，走船别走夜路。'];
          if (LB.flag('guixuShipMet')) {
            if (LB.flag('salvage1') && LB.flag('salvage2') && LB.matCount('xuantie') >= 2) return ['龙骨和舵叶都找着了？玄铁也够？', '（他敲了敲船骨，声音很沉。）还能救。'];
            return ['龙骨在船头，舵叶在船尾，玄铁得两块。', '这船不修，云梦泽的渡口就永远空着。'];
          }
          return ['这条船搁在浅滩上快三十年了。', '船骨是灵木的，舵叶是玄铁的，拆下来还能用。', '你替我找回两样，我把它修起来。'];
        },
        onTalk: function () {
          LB.flagSet('guixuShipMet', true);
          if (!LB.flag('wreckFixed') && LB.flag('salvage1') && LB.flag('salvage2') && LB.matCount('xuantie') >= 2) {
            LB.consumeMaterial('xuantie', 2);
            LB.flagSet('wreckFixed', true);
            LB.toast('沉船三舱已补 · 旧渡船重下水');
          }
        },
      },
      {
        id: 'guixu_merfolk', name: '鲛人遗属·珠娘', sprite: 'ninja_blue', tint: 0xd8e8f0, scale: 2.4,
        x: 52, y: 34, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('songDone')) return ['三阕都听全了。你听见的不是歌，是锁灵鲛在找它的名字。', '它守着渡口，不是凶，是走不了。', '你若再遇见它，替我把最后一句唱给它。'];
          var s = LB.saveState();
          if (s && s.steles && s.steles.guixu_stele3 && s.steles.guixu_stele4 && s.steles.guixu_stele5) return ['三块鲛歌石刻都读过了？', '（她低下头，指尖在湿沙上画了一道弯弯的潮线。）'];
          if (LB.flag('guixuMerMet')) return ['盐田、沉船坞、礁石上各有一块鲛歌石刻。', '字是刻给潮水看的，不是给人看的。'];
          return ['鲛人走了，歌还在。', '三阕歌刻在三块石头上，被潮水推散了。', '你替我把三处石刻都读一遍，我唱给你听。'];
        },
        onTalk: function () {
          LB.flagSet('guixuMerMet', true);
          const s = LB.saveState();
          if (!LB.flag('songDone') && s && s.steles && s.steles.guixu_stele3 && s.steles.guixu_stele4 && s.steles.guixu_stele5) {
            LB.flagSet('songDone', true);
            LB.toast('鲛歌三阕已听全 · 珠娘唱完最后一句');
          }
        },
      },
      {
        id: 'guixu_storyteller', name: '说书人·柳三弦', sprite: 'samurai_green', tint: 0xf0d8b8, scale: 2.3,
        x: 34, y: 16, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('questionsDone')) return ['三问都有答案了。海市里没有新鲜事，只有旧账。', '契是不是奴役，这话你该去云梦泽问。', '雾里的答案，比这儿的账本干净。'];
          if (LB.flag('talked_haishi') && LB.flag('talked_guixu_shipwright') && LB.flag('talked_guixu_merfolk')) return ['海市主、船匠、鲛人遗属，你都问过了？', '（他拨了一下弦，声音被雨吞掉一半。）那我可以收场了。'];
          if (LB.flag('guixuStoryMet')) return ['海市主问价，船匠问路，鲛人问名。', '三个人三句话，凑起来才是归墟。'];
          return ['归墟的故事，从来不是一个人讲的。', '你替我问问海市主、船匠和鲛人遗属。', '问完回来，我给你讲个不收钱的。'];
        },
        onTalk: function () {
          LB.flagSet('guixuStoryMet', true);
          if (!LB.flag('questionsDone') && LB.flag('talked_haishi') && LB.flag('talked_guixu_shipwright') && LB.flag('talked_guixu_merfolk')) {
            LB.flagSet('questionsDone', true);
            LB.toast('海市三问已答 · 柳三弦收弦');
          }
        },
      },
      {
        id: 'guixu_shellpicker', name: '拾贝人·小螺', sprite: 'ninja_blue', tint: 0xe8f0d8, scale: 1.9,
        x: 24, y: 35, dir: 'down',
        lines: function () {
          return ['退潮后的贝壳会自己响，你信不信？', '南边礁石缝里有蜃砂，潮水一退就亮。', '别捡太大的螺，里头住着东西。'];
        },
        onTalk: function () { LB.flagSet('guixuShellMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'guixu_g1', x: 13, y: 7, mat: 'haiyan', amount: 2, label: '刮得海盐 2 份', respawn: 'weather' },
      { id: 'guixu_g2', x: 48, y: 33, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'guixu_g3', x: 22, y: 7, mat: 'haiyan', amount: 1, label: '刮得海盐', respawn: 'weather' },
      { id: 'guixu_g4', x: 38, y: 30, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
      { id: 'guixu_g5', x: 56, y: 18, mat: 'haiyan', amount: 1, label: '刮得海盐', respawn: 'weather' },
    ],
    chests: [
      { id: 'guixu_chest1', name: '栈桥暗格', x: 18, y: 18, jade: 18, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 18' },
      { id: 'guixu_chest2', name: '码头货箱', x: 40, y: 18, jade: 20, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 20' },
      { id: 'guixu_ledger1', name: '盐田账页', x: 18, y: 6, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'ledger1', label: '拾得盐课旧账 · 灵玉 4' },
      { id: 'guixu_ledger2', name: '沉船账页', x: 49, y: 24, jade: 4, items: [{ id: 'charm', count: 1 }], flag: 'ledger2', label: '拾得沉船账页 · 灵玉 4' },
      { id: 'guixu_ledger3', name: '暗仓账页', x: 56, y: 24, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'ledger3', label: '拾得海市暗账 · 灵玉 4' },
      { id: 'guixu_salvage1', name: '船头龙骨', x: 46, y: 34, jade: 8, items: [{ id: 'xuantie', count: 1 }], flag: 'salvage1', label: '拆得船头龙骨 · 玄铁 1 块' },
      { id: 'guixu_salvage2', name: '船尾舵叶', x: 54, y: 36, jade: 8, items: [{ id: 'pill', count: 1 }], flag: 'salvage2', label: '拆得船尾舵叶 · 灵玉 8' },
    ],
    props: [
      { type: 'house', x: 19, y: 13, frame: 'house1' },
      { type: 'house', x: 27, y: 13, frame: 'house2' },
      { type: 'house', x: 35, y: 13, frame: 'house1' },
      { type: 'house', x: 17, y: 22, frame: 'house2' },
      { type: 'house', x: 25, y: 22, frame: 'house1' },
      { type: 'house', x: 34, y: 22, frame: 'house2' },
      { type: 'house', x: 48, y: 14, frame: 'house1' },
      { type: 'house', x: 54, y: 22, frame: 'house2' },
      { type: 'house', x: 21, y: 32, frame: 'house1' },
      { type: 'altar', x: 34, y: 10 },
      { type: 'lantern', x: 16, y: 17 },
      { type: 'lantern', x: 28, y: 17 },
      { type: 'lantern', x: 40, y: 17 },
      { type: 'lantern', x: 52, y: 17 },
      { type: 'lantern', x: 28, y: 27 },
      { type: 'lantern', x: 46, y: 27 },
      { type: 'sign', x: 3, y: 17 },
      { type: 'sign', x: 57, y: 17 },
      { type: 'stall', x: 34, y: 18 },
      { type: 'stall', x: 18, y: 17 },
      { type: 'dock', x: 32, y: 34 },
      { type: 'dock', x: 48, y: 32 },
      { type: 'ruin', x: 10, y: 34 },
      { type: 'ruin', x: 40, y: 10 },
    ],
    steles: [
      { id: 'guixu_stele1', x: 12, y: 16, title: '海市旧约', text: '「潮退则市开，潮满则市散。买卖不问来路，欠账必还。」落款是三十六年前的商盟。', codex: 'guixushangmeng' },
      { id: 'guixu_stele2', x: 38, y: 18, title: '锁灵器价目', text: '一件锁灵器的价钱，写着「一条灵脉的支流」。字很小，像不愿被人看见。', codex: 'suolingshu' },
      { id: 'guixu_stele3', x: 16, y: 7, title: '盐田旧契', text: '「盐能定息，亦能定心。私贩海盐者，市籍除名。」碑脚压着一枚盐引，印色早褪了。', codex: 'yantian' },
      { id: 'guixu_stele4', x: 45, y: 32, title: '沉船名录', text: '「沉者十七，归者三。船骨可拆，名字不可拆。」名录最后一行被人用刀划掉了。', codex: 'chenchuan' },
      { id: 'guixu_stele5', x: 55, y: 31, title: '鲛歌石刻', text: '「以息换息，以名换名。潮生潮落，歌不归人。」石面很滑，像被很多人的手摸过。', codex: 'jiaoge' },
    ],
  }),

  // —— 第五境 ——
  // v2.1 垂直切片：50×38 → 62×46，北侧蜃楼台、南岸芦荡旧渡、东汀泽镜
  yunmeng: makeRegion({
    id: 'yunmeng', name: '云梦泽', chapter: 5, subtitle: '雾照人心，泽无定岸',
    w: 62, h: 46, base: '.', spawn: { x: 4, y: 20 },
    fog: true, weather: 'fog', tint: '#e8e9e0', timeTint: '#e9eae1',
    encounterTiles: ['g', 'Z'],
    paint: function (m) {
      m.border('T', 2);

      // 深水泽心（不可涉）
      m.blob(14, 12, 5, 'W');
      m.blob(31, 25, 6, 'W');
      m.blob(44, 11, 4, 'W');
      m.blob(11, 32, 4, 'W');
      m.blob(53, 31, 4, 'W');

      // 浅泽与苇荡
      m.blob(17, 13, 7, 'Z');
      m.blob(31, 26, 8, 'Z');
      m.blob(45, 12, 6, 'Z');
      m.blob(12, 31, 6, 'Z');
      m.blob(53, 31, 6, 'Z');
      m.blob(39, 36, 5, 'Z');
      m.blob(25, 7, 4, 'Z');
      m.blob(56, 18, 4, 'Z');
      m.blob(8, 38, 4, 'Z');
      m.blob(48, 40, 5, 'Z');

      // 林带
      m.blob(6, 8, 4, 'T');
      m.blob(58, 7, 4, 'T');
      m.blob(59, 39, 4, 'T');
      m.blob(21, 41, 5, 'T');
      m.blob(37, 4, 4, 'T');
      m.blob(33, 39, 4, 'T');
      m.blob(5, 25, 3, 'T');

      // 滩草
      m.blob(10, 20, 3, 'g');
      m.blob(26, 16, 3, 'g');
      m.blob(38, 23, 3, 'g');
      m.blob(48, 19, 3, 'g');
      m.blob(20, 33, 4, 'g');
      m.blob(44, 33, 3, 'g');
      m.blob(55, 22, 3, 'g');
      m.blob(16, 36, 3, 'g');

      // 北 · 蜃楼台
      m.rect(33, 6, 5, 3, 'A');
      m.rect(32, 9, 7, 2, '.');

      // 主路 · 西渡口 → 东汀
      m.line(2, 20, 8, 20, ',');
      m.line(8, 20, 8, 17, ',');
      m.line(8, 17, 19, 17, ',');
      m.line(19, 17, 19, 21, ',');
      m.line(19, 21, 29, 21, ',');
      m.line(29, 21, 29, 17, ',');
      m.line(29, 17, 38, 17, ',');
      m.line(38, 17, 38, 12, ',');
      m.line(38, 12, 46, 12, ',');
      m.line(46, 12, 46, 18, ',');
      m.line(46, 18, 55, 18, ',');
      m.line(55, 18, 55, 20, ',');
      m.line(55, 20, 59, 20, ',');

      // 北支 · 登楼台
      m.line(35, 17, 35, 10, ',');

      // 南支 · 芦荡与旧渡
      m.line(19, 21, 19, 27, ',');
      m.line(19, 27, 26, 27, ',');
      m.line(26, 27, 26, 33, ',');
      m.line(26, 33, 34, 33, ',');
      m.line(34, 33, 34, 29, ',');
      m.line(34, 29, 44, 29, ',');
      m.line(44, 29, 44, 34, ',');
      m.line(44, 34, 52, 34, ',');
      m.line(52, 34, 52, 30, ',');
      m.line(52, 34, 57, 34, ',');
      m.line(57, 34, 57, 30, ',');

      m.put(2, 20, 'E');
      m.put(59, 20, 'E');
    },
    exits: [
      { to: 'guixu', x: 2, y: 20, need: null, label: '回归墟海市' },
      { to: 'gutan', x: 59, y: 20, need: { chapter: 6 }, label: '西行 · 断崖古坛' },
    ],
    pool: [
      { sp: 'yunmengbei', lv: [16, 19] },
      { sp: 'guixujiao', lv: [16, 19] },
      { sp: 'youmu', lv: [16, 18] },
      { sp: 'chaoxi', lv: [16, 18] },
    ],
    boss: 'shenmu',
    npcs: [
      {
        id: 'fisher', name: '泽边渔人', sprite: 'samurai_green', tint: 0xd8e0d0, scale: 2.2,
        x: 12, y: 18, dir: 'right',
        lines: function () {
          if (LB.flag('girlDone')) return ['阿沅她爹的名字，我记得。当年是我送他下的泽。', '雾里翻船的人不少，能被喊回来的不多。', '你替她把名字喊全了，这泽就欠你一个人情。'];
          return ['泽里的雾会照人心。你看见的鱼，未必是鱼。', '我在这儿守了四十年，只学会一件事：别追雾里的影子。', '蜃母在岛心，走浅滩过去，别踩深水。'];
        },
      },
      {
        id: 'mirage', name: '蜃影', sprite: 'ninja_blue', tint: 0xe8e8f0, scale: 2.4,
        x: 30, y: 19, dir: 'down',
        lines: function () {
          return ['你见过自己的哪一种结局？', '契是不是更体面的奴役——这句话，是蜃母问你的，也是你自己问的。', '答案不在泽里。往前走。'];
        },
      },
      {
        id: 'yunmeng_boatman', name: '渡舟人·老渡', sprite: 'samurai_green', tint: 0xd0d8c8, scale: 2.4,
        x: 51, y: 33, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('boatFixed')) return ['三支渡桨都归位了。旧渡还能撑一程。', '雾里的水路不认方向，只认桨声。', '往东走，别回头数岸。'];
          if (LB.flag('yunmengBoatMet')) {
            if (LB.flag('boatOar1') && LB.flag('boatOar2') && LB.flag('boatOar3')) return ['三支桨都找齐了？', '（他把桨一支支插回渡架，手很稳。）'];
            return ['南滩、旧渡、礁边，各藏着一支。', '少一支，船就在雾里打转。'];
          }
          return ['云梦泽的渡，三十年没开过了。', '三支渡桨被雾冲散在南滩、旧渡和礁边。', '你替我找回来，我渡你过泽。'];
        },
        onTalk: function () {
          LB.flagSet('yunmengBoatMet', true);
          if (!LB.flag('boatFixed') && LB.flag('boatOar1') && LB.flag('boatOar2') && LB.flag('boatOar3')) {
            LB.flagSet('boatFixed', true);
            LB.toast('渡舟三桨已齐 · 老渡解缆');
          }
        },
      },
      {
        id: 'yunmeng_reed', name: '芦姑', sprite: 'ninja_blue', tint: 0xd8e8d0, scale: 2.1,
        x: 28, y: 34, dir: 'up', mark: 'side',
        lines: function () {
          if (LB.flag('reedDone')) return ['三束露生草够了。芦荡的药田能再活一季。', '雾里的草药认人，不认钱。', '你身上有海盐味，是从归墟来的吧。'];
          if (LB.flag('yunmengReedMet')) {
            if (LB.matCount('lucao') >= 3) return ['露生草带来了？', '（她把草束贴近鼻尖，点了点头。）还带露，能用。'];
            return ['露生草要带露采，三束。', '南滩和北汀都有，雾散那头长得最好。'];
          }
          return ['芦荡的药田被雾泡烂了两畦。', '露生草能救回来，可我一个人采不及。', '你匀我三束，我教你辨泽里的草。'];
        },
        onTalk: function () {
          LB.flagSet('yunmengReedMet', true);
          if (!LB.flag('reedDone') && LB.matCount('lucao') >= 3) {
            LB.consumeMaterial('lucao', 3);
            LB.flagSet('reedDone', true);
            LB.toast('芦荡三束已收 · 芦姑续上药田');
          }
        },
      },
      {
        id: 'yunmeng_mirror', name: '守镜人·镜叟', sprite: 'ninja_blue', tint: 0xe0e0e8, scale: 2.5,
        x: 36, y: 11, dir: 'left', mark: 'side',
        lines: function () {
          if (LB.flag('mirrorDone')) return ['三面泽镜你都照过了。你看见的，未必是泽要给你看的。', '蜃母不造幻，它只是把人心里的东西放大。', '上蜃楼台吧。它在等你问那一句。'];
          var s = LB.saveState();
          if (s && s.steles && s.steles.yunmeng_stele3 && s.steles.yunmeng_stele4 && s.steles.yunmeng_stele5) return ['三面镜子都照过了？', '（他抬手把镜面转向你。）那你该看清自己了。'];
          if (LB.flag('yunmengMirrorMet')) return ['渡口、楼台、泽心，各有一面镜。', '镜里的字不写给眼睛，写给回头的人。'];
          return ['泽上有三面镜子，是旧山门立的。', '镜上刻着字，照得见字，照不见人。', '你替我把三面都看一遍，我再告诉你蜃母怕什么。'];
        },
        onTalk: function () {
          LB.flagSet('yunmengMirrorMet', true);
          const s = LB.saveState();
          if (!LB.flag('mirrorDone') && s && s.steles && s.steles.yunmeng_stele3 && s.steles.yunmeng_stele4 && s.steles.yunmeng_stele5) {
            LB.flagSet('mirrorDone', true);
            LB.toast('泽镜三问已照 · 镜叟让开楼台石阶');
          }
        },
      },
      {
        id: 'yunmeng_girl', name: '阿沅', sprite: 'ninja_blue', tint: 0xf0e0d0, scale: 1.9,
        x: 47, y: 17, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('girlDone')) return ['三个人都应了。原来他们没忘我爹的名字。', '雾里喊人，要喊全名，不然雾会替你答。', '你也有名字吧？别丢在泽里。'];
          if (LB.flag('talked_fisher') && LB.flag('talked_yunmeng_hermit') && LB.flag('talked_yunmeng_boatman')) return ['渔人、陶翁、渡舟人都应了？', '（她把三枚木牌收进袖里，声音轻了。）那他不是走丢的。'];
          if (LB.flag('yunmengGirlMet')) return ['渔人在西滩，陶翁在南坡，渡舟人在旧渡。', '你替我喊一声我爹的名字，看他们还记不记得。'];
          return ['我爹进泽那年，雾特别大。', '泽边的人都说没见过他，可我不信。', '你替我问三个人：渔人、陶翁、渡舟人。'];
        },
        onTalk: function () {
          LB.flagSet('yunmengGirlMet', true);
          if (!LB.flag('girlDone') && LB.flag('talked_fisher') && LB.flag('talked_yunmeng_hermit') && LB.flag('talked_yunmeng_boatman')) {
            LB.flagSet('girlDone', true);
            LB.toast('雾中三唤已应 · 阿沅收起木牌');
          }
        },
      },
      {
        id: 'yunmeng_hermit', name: '泽畔陶翁', sprite: 'samurai_green', tint: 0xe8d0b0, scale: 2.3,
        x: 19, y: 28, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('hermitDone')) return ['三夜的灯都亮了。泽心那块地方，雾退了一线。', '蜃砂烧起来不烫，只照人。', '去吧。镜子照得越久，越舍不得走。'];
          if (LB.flag('yunmengHermitMet')) {
            if (LB.matCount('shensha') >= 3) return ['三捧蜃砂够了。', '（他把砂撒进灯膛，火是白色的。）'];
            return ['蜃砂三捧，少一捧灯就暗一夜。', '浅滩上潮退才亮，你得赶早。'];
          }
          return ['泽心夜夜起雾，旧灯油早干了。', '蜃砂能当灯，三夜就够撑到雾散。', '你替我凑三捧，我告诉你蜃楼台上该怎么答话。'];
        },
        onTalk: function () {
          LB.flagSet('yunmengHermitMet', true);
          if (!LB.flag('hermitDone') && LB.matCount('shensha') >= 3) {
            LB.consumeMaterial('shensha', 3);
            LB.flagSet('hermitDone', true);
            LB.toast('泽火三夜已点 · 陶翁说了楼台旧话');
          }
        },
      },
      {
        id: 'yunmeng_warden', name: '巡泽人·阿戗', sprite: 'samurai_green', tint: 0xc8d8e0, scale: 2.3,
        x: 56, y: 22, dir: 'up',
        lines: function () {
          if (LB.flag('boss_shenmu')) return ['蜃母退了。泽上的雾薄了一层。雾薄了，路就露出来了。', '往西是旧渡，往东是断崖。', '别以为雾散了就安全，泽还在看。'];
          return ['雾一起，连我都不敢走远。', '听见有人叫你名字，别应。', '蜃楼台在正北，路是旧山门铺的，踏着走。'];
        },
        onTalk: function () { LB.flagSet('wardenMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'yunmeng_g1', x: 28, y: 28, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
      { id: 'yunmeng_g2', x: 16, y: 9, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'yunmeng_g3', x: 9, y: 22, mat: 'haiyan', amount: 1, label: '刮得海盐', respawn: 'weather' },
      { id: 'yunmeng_g4', x: 49, y: 35, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
      { id: 'yunmeng_g5', x: 55, y: 26, mat: 'lucao', amount: 1, label: '采得露生草', respawn: 'chapter' },
    ],
    chests: [
      { id: 'yunmeng_chest1', name: '泽边木箱', x: 6, y: 20, jade: 16, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 16' },
      { id: 'yunmeng_chest2', name: '沉船残匣', x: 43, y: 13, jade: 24, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 24' },
      { id: 'yunmeng_chest3', name: '芦荡暗箱', x: 14, y: 33, jade: 18, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 18' },
      { id: 'yunmeng_chest4', name: '楼台供匣', x: 37, y: 10, jade: 26, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 26' },
      { id: 'yunmeng_oar1', name: '南滩渡桨', x: 24, y: 28, jade: 6, items: [{ id: 'pill', count: 1 }], flag: 'boatOar1', label: '拾得南滩渡桨 · 灵玉 6' },
      { id: 'yunmeng_oar2', name: '旧渡渡桨', x: 35, y: 30, jade: 6, items: [{ id: 'charm', count: 1 }], flag: 'boatOar2', label: '拾得旧渡渡桨 · 灵玉 6' },
      { id: 'yunmeng_oar3', name: '礁边渡桨', x: 53, y: 32, jade: 6, items: [{ id: 'pill', count: 1 }], flag: 'boatOar3', label: '拾得礁边渡桨 · 灵玉 6' },
    ],
    props: [
      { type: 'altar', x: 34, y: 7 },
      { type: 'lantern', x: 20, y: 17 },
      { type: 'lantern', x: 32, y: 17 },
      { type: 'lantern', x: 46, y: 13 },
      { type: 'lantern', x: 55, y: 19 },
      { type: 'sign', x: 3, y: 21 },
      { type: 'sign', x: 56, y: 21 },
      { type: 'ruin', x: 39, y: 11 },
      { type: 'ruin', x: 50, y: 35 },
      { type: 'house', x: 13, y: 29, frame: 'house1' },
      { type: 'house', x: 31, y: 35, frame: 'house2' },
      { type: 'dock', x: 49, y: 33 },
      { type: 'dock', x: 53, y: 34 },
      { type: 'stall', x: 16, y: 27 },
    ],
    steles: [
      { id: 'yunmeng_stele1', x: 22, y: 22, title: '云梦泽记', text: '「泽上多雾，雾中见心。行舟者勿答雾中之问，答则迷。」', codex: 'yunmengze' },
      { id: 'yunmeng_stele2', x: 40, y: 20, title: '五灵相胜图', text: '木胜土，土胜水，水胜火，火胜金，金胜木。图下写着：相胜为用，相生为守。', codex: 'wuling' },
      { id: 'yunmeng_stele3', x: 48, y: 35, title: '云梦舟刻', text: '「舟不系岸，人不系舟。渡者自渡，泽不留人。」刻痕很浅，像被水磨过。', codex: 'yunmengzhou' },
      { id: 'yunmeng_stele4', x: 33, y: 10, title: '蜃楼台铭', text: '「楼台非楼，镜亦非镜。你所见者，皆你心中未答之问。」台基下压着一层旧贝壳。', codex: 'shenloutai' },
      { id: 'yunmeng_stele5', x: 57, y: 21, title: '泽镜', text: '「照人先照己，问泽先问心。答不出者，留在雾里。」镜面早已锈死，字却亮着。', codex: 'yunmengjing' },
    ],
  }),

  // —— 第六境 ——
  // v2.1 垂直切片：46×34 → 62×46，北侧古坛、南侧遗民聚落、东侧灰窑渊口
  gutan: makeRegion({
    id: 'gutan', name: '断崖古坛', chapter: 6, subtitle: '火在渊底，等一个名字',
    w: 62, h: 46, base: '.', spawn: { x: 4, y: 20 },
    weather: 'ash', tint: '#ecd8c2', timeTint: '#eedac4',
    paint: function (m) {
      m.border('C', 2);

      // 熔岩裂隙
      m.line(6, 6, 18, 10, 'L');
      m.line(18, 10, 18, 16, 'L');
      m.line(40, 6, 36, 12, 'L');
      m.line(36, 12, 36, 17, 'L');
      m.line(8, 30, 20, 34, 'L');
      m.line(20, 34, 30, 32, 'L');
      m.line(30, 32, 34, 38, 'L');
      m.line(46, 24, 56, 28, 'L');
      m.line(56, 28, 56, 36, 'L');
      m.line(24, 42, 34, 42, 'L');

      // 断岩
      m.blob(6, 12, 3, 'R');
      m.blob(50, 8, 3, 'R');
      m.blob(56, 38, 4, 'R');
      m.blob(10, 40, 3, 'R');
      m.blob(42, 18, 3, 'R');

      // 焦林
      m.blob(6, 24, 2, 'T');
      m.blob(48, 36, 3, 'T');
      m.blob(16, 4, 3, 'T');
      m.blob(58, 16, 3, 'T');

      // 灰草
      m.blob(8, 18, 3, 'g');
      m.blob(22, 24, 4, 'g');
      m.blob(34, 26, 3, 'g');
      m.blob(42, 34, 3, 'g');
      m.blob(50, 20, 3, 'g');
      m.blob(16, 36, 3, 'g');
      m.blob(28, 6, 3, 'g');

      // 古坛
      m.rect(27, 6, 7, 5, 'A');
      m.rect(26, 11, 9, 2, '.');

      // 主路 · 西口 → 东渊
      m.line(2, 20, 10, 20, ',');
      m.line(10, 20, 10, 18, ',');
      m.line(10, 18, 20, 18, ',');
      m.line(20, 18, 20, 22, ',');
      m.line(20, 22, 30, 22, ',');
      m.line(30, 22, 30, 18, ',');
      m.line(30, 18, 38, 18, ',');
      m.line(38, 18, 38, 22, ',');
      m.line(38, 22, 46, 22, ',');
      m.line(46, 22, 46, 18, ',');
      m.line(46, 18, 54, 18, ',');
      m.line(54, 18, 54, 20, ',');
      m.line(54, 20, 59, 20, ',');

      // 北支 · 登古坛
      m.line(30, 18, 30, 13, ',');

      // 南支 · 遗民聚落
      m.line(20, 22, 20, 28, ',');
      m.line(20, 28, 26, 28, ',');
      m.line(26, 28, 26, 34, ',');
      m.line(26, 34, 36, 34, ',');
      m.line(36, 34, 36, 30, ',');
      m.line(36, 30, 44, 30, ',');
      m.line(44, 30, 44, 36, ',');
      m.line(44, 36, 52, 36, ',');

      // 东支 · 灰窑与渊口
      m.line(46, 22, 46, 28, ',');
      m.line(46, 28, 54, 28, ',');
      m.line(54, 28, 54, 24, ',');

      m.put(2, 20, 'E');
      m.put(59, 20, 'E');
    },
    exits: [
      { to: 'yunmeng', x: 2, y: 20, need: null, label: '回云梦泽' },
      { to: 'shenyuan', x: 59, y: 20, need: { chapter: 7 }, label: '入 · 归墟深处' },
    ],
    pool: [
      { sp: 'jinta', lv: [20, 24] },
      { sp: 'yanwei', lv: [20, 23] },
      { sp: 'shijiatuo', lv: [20, 23] },
      { sp: 'jinyu', lv: [20, 22] },
    ],
    boss: 'chiyuan',
    npcs: [
      {
        id: 'yimin', name: '赤渊遗民', sprite: 'samurai_green', tint: 0xe0c0a8, scale: 2.4,
        x: 14, y: 20, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('boss_chiyuan')) return ['坛裂了，火却没灭。赤渊兽终于把名字还回去了。', '无咎的残魂若还肯说话，你该去坛下听。', '往东是归墟深处。那地方，我们守了一辈子也没敢进。'];
          return ['我们守这座坛，守的是一只被锁住的守脉灵。', '赤渊兽不是天生的渊兽。它曾经有名字。', '火种还在坛底。你若能唤醒它，山主无咎也许还肯说话。'];
        },
        onTalk: function () { LB.flagSet('yiminMet', true); },
      },
      {
        id: 'gutan_keeper', name: '守坛人·赤眉', sprite: 'samurai_green', tint: 0xd8b898, scale: 2.4,
        x: 26, y: 19, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('emberDone')) return ['三捧火种都齐了。坛底的火能撑到你把话问完。', '火不问来路，只问名字。', '上楼台时别低头，火在看。'];
          if (LB.flag('gutanKeeperMet')) {
            if (LB.flag('ember1') && LB.flag('ember2') && LB.flag('ember3')) return ['三捧火种都找回来了？', '（他把火种捧进坛口，火舌一下窜高。）'];
            return ['东渊、南窑、北坛，各有一捧。', '火种认路，不认人。'];
          }
          return ['坛火快灭了。灭了，无咎就真的不说话了。', '三捧火种散在东渊、南窑和北坛。', '你替我收回来，我教你怎么听火里的名字。'];
        },
        onTalk: function () {
          LB.flagSet('gutanKeeperMet', true);
          if (!LB.flag('emberDone') && LB.flag('ember1') && LB.flag('ember2') && LB.flag('ember3')) {
            LB.flagSet('emberDone', true);
            LB.toast('火种三捧已归 · 古坛复燃');
          }
        },
      },
      {
        id: 'gutan_scribe', name: '记名者·史灰', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.3,
        x: 48, y: 23, dir: 'left', mark: 'side',
        lines: function () {
          if (LB.flag('namesDone')) return ['三块残榜都录完了。十二个名字，只剩三个还认得出。', '名字一断，坛就不认人了。', '你要入归墟深处，把自己的名字记牢。'];
          var s = LB.saveState();
          if (s && s.steles && s.steles.gutan_stele3 && s.steles.gutan_stele4 && s.steles.gutan_stele5) return ['三块残榜都看过了？', '（他摊开灰纸，一笔一笔对。）那我可以落笔了。'];
          if (LB.flag('gutanScribeMet')) return ['火记、残榜、迁民录，各在一块石上。', '字被火烧过，得凑近了看。'];
          return ['古坛的碑，断的断，烧的烧。', '还有三块记得人事：火记、残榜、迁民录。', '你替我把三块看全，我把名字录下来。'];
        },
        onTalk: function () {
          LB.flagSet('gutanScribeMet', true);
          const s = LB.saveState();
          if (!LB.flag('namesDone') && s && s.steles && s.steles.gutan_stele3 && s.steles.gutan_stele4 && s.steles.gutan_stele5) {
            LB.flagSet('namesDone', true);
            LB.toast('残榜三名已录 · 史灰封卷');
          }
        },
      },
      {
        id: 'gutan_smith', name: '铸匠·炉生', sprite: 'samurai_green', tint: 0xc8a888, scale: 2.4,
        x: 44, y: 31, dir: 'up', mark: 'side',
        lines: function () {
          if (LB.flag('forgeDone')) return ['三炉都淬过了。火色正，能补锁灵器的裂。', '天工司的手艺，到我这辈只剩补，不会铸了。', '你要去归墟深处，带上补好的笼。'];
          if (LB.flag('gutanSmithMet')) {
            if (LB.matCount('tanzha') >= 3) return ['烬炭三块？', '（他掂了掂，扔进炉膛。）火候够了。'];
            return ['烬炭三块，一块都不能少。', '南窑和断岩下都有，烧不透的才是好炭。'];
          }
          return ['这炉火三十年没正经烧过了。', '要补锁灵器，得用烧不透的烬炭，三块。', '你替我凑齐，我替你补一次。'];
        },
        onTalk: function () {
          LB.flagSet('gutanSmithMet', true);
          if (!LB.flag('forgeDone') && LB.matCount('tanzha') >= 3) {
            LB.consumeMaterial('tanzha', 3);
            LB.flagSet('forgeDone', true);
            LB.toast('炉火三淬已成 · 锁灵器补好了');
          }
        },
      },
      {
        id: 'gutan_child', name: '拾炭童·小焰', sprite: 'ninja_blue', tint: 0xf0c8a0, scale: 1.9,
        x: 30, y: 33, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('charcoalDone')) return ['三个地方都问过了？原来我爹是去封坛的。', '他们不说，是怕我去找。', '你替我问了，我就不去了。'];
          if (LB.flag('talked_gutan_keeper') && LB.flag('talked_gutan_scribe') && LB.flag('talked_gutan_hermit')) return ['守坛人、记名者、崖居人都说了？', '（他把手里那块炭捏碎，没哭。）'];
          if (LB.flag('gutanChildMet')) return ['守坛人在坛下，记名者在东窑，崖居人在西崖。', '你替我问问，我爹的炭路走到哪儿了。'];
          return ['我爹每年都往坛上送炭。今年没回来。', '守坛人不说，记名者不写，崖居人只叹气。', '你替我问他们三个。'];
        },
        onTalk: function () {
          LB.flagSet('gutanChildMet', true);
          if (!LB.flag('charcoalDone') && LB.flag('talked_gutan_keeper') && LB.flag('talked_gutan_scribe') && LB.flag('talked_gutan_hermit')) {
            LB.flagSet('charcoalDone', true);
            LB.toast('炭路三问已明 · 小焰不再上坛');
          }
        },
      },
      {
        id: 'gutan_widow', name: '遗孀·阿烬', sprite: 'ninja_blue', tint: 0xe0c8c0, scale: 2.2,
        x: 22, y: 29, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('widowDone')) return ['牌位立好了。名字有了，人就不算白走。', '灵木做牌，火一烧，名字就进坛了。', '你别学我们，把名字拖到最后才刻。'];
          if (LB.flag('gutanWidowMet')) {
            if (LB.matCount('lingmu') >= 3) return ['灵木三块？', '（她抚了抚木纹，点头。）够刻三个名字了。'];
            return ['灵木三块，能做三块牌位。', '不急着烧，先刻名字。'];
          }
          return ['聚落里的人走了，连名字都没留下。', '我想给他们立牌位，可灵木不够。', '你替我找三块灵木，我刻名字。'];
        },
        onTalk: function () {
          LB.flagSet('gutanWidowMet', true);
          if (!LB.flag('widowDone') && LB.matCount('lingmu') >= 3) {
            LB.consumeMaterial('lingmu', 3);
            LB.flagSet('widowDone', true);
            LB.toast('灰名三牌已立 · 阿烬刻完最后一笔');
          }
        },
      },
      {
        id: 'gutan_hermit', name: '崖居人·老燧', sprite: 'samurai_green', tint: 0xc0b098, scale: 2.4,
        x: 10, y: 16, dir: 'right',
        lines: function () {
          return ['这崖上住不得人，我住惯了。', '断崖的水有毒，别喝。渴了含一口灰草。', '归墟深处在下面。下去的人，回来的少。'];
        },
        onTalk: function () { LB.flagSet('gutanHermitMet', true); },
      },
      {
        id: 'gutan_hunter', name: '灰猎·岑七', sprite: 'samurai_green', tint: 0xd8d8c0, scale: 2.3,
        x: 52, y: 37, dir: 'up',
        lines: function () {
          if (LB.flag('boss_chiyuan')) return ['赤渊兽倒了，灰里的兽少了。', '我猎兽不猎崽，这规矩在断崖也立得住。', '东边的渊口下不得，除非你带着名字。'];
          return ['灰里的兽不怕火，只怕被叫名字。', '坛上的火一起来，兽就退回渊里。', '你要是能唤醒那只守脉灵，这崖就清净了。'];
        },
        onTalk: function () { LB.flagSet('gutanHunterMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'gutan_g1', x: 12, y: 6, mat: 'tanzha', amount: 2, label: '拾得烬炭 2 块', respawn: 'weather' },
      { id: 'gutan_g2', x: 34, y: 28, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
      { id: 'gutan_g3', x: 8, y: 34, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
      { id: 'gutan_g4', x: 50, y: 14, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'gutan_g5', x: 44, y: 40, mat: 'tanzha', amount: 2, label: '拾得烬炭 2 块', respawn: 'weather' },
    ],
    chests: [
      { id: 'gutan_chest1', name: '坛下水缸', x: 7, y: 21, jade: 22, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 22' },
      { id: 'gutan_chest2', name: '焦木箱', x: 42, y: 24, jade: 20, items: [{ id: 'tanzha', count: 2 }], label: '拾得烬炭 2 块 · 灵玉 20' },
      { id: 'gutan_chest3', name: '崖边石匣', x: 13, y: 12, jade: 18, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 18' },
      { id: 'gutan_chest4', name: '灰窑暗箱', x: 52, y: 32, jade: 24, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 24' },
      { id: 'gutan_ember1', name: '东渊火种', x: 38, y: 20, jade: 6, items: [{ id: 'pill', count: 1 }], flag: 'ember1', label: '收得东渊火种 · 灵玉 6' },
      { id: 'gutan_ember2', name: '南窑火种', x: 28, y: 30, jade: 6, items: [{ id: 'pill', count: 1 }], flag: 'ember2', label: '收得南窑火种 · 灵玉 6' },
      { id: 'gutan_ember3', name: '北坛火种', x: 34, y: 19, jade: 6, items: [{ id: 'pill', count: 1 }], flag: 'ember3', label: '收得北坛火种 · 灵玉 6' },
    ],
    props: [
      { type: 'altar', x: 30, y: 8 },
      { type: 'ruin', x: 12, y: 12 },
      { type: 'ruin', x: 46, y: 10 },
      { type: 'ruin', x: 18, y: 32 },
      { type: 'ruin', x: 50, y: 34 },
      { type: 'lantern', x: 10, y: 19 },
      { type: 'lantern', x: 30, y: 19 },
      { type: 'lantern', x: 46, y: 20 },
      { type: 'sign', x: 3, y: 21 },
      { type: 'sign', x: 56, y: 21 },
      { type: 'house', x: 8, y: 26, frame: 'house1' },
      { type: 'house', x: 48, y: 30, frame: 'house2' },
      { type: 'stall', x: 18, y: 26 },
      { type: 'dock', x: 54, y: 35 },
    ],
    steles: [
      { id: 'gutan_stele1', x: 16, y: 26, title: '洪荒残言', text: '「五灵祖兽以身化石，以息成河。山是它们睡下时压出的褶皱。」', codex: 'honghuang' },
      { id: 'gutan_stele2', x: 36, y: 24, title: '无咎旧誓', text: '「我守此脉，不锁一灵。若我成渊，后来者斩之。」字被火燎过，仍看得清。', codex: 'yuanshou' },
      { id: 'gutan_stele3', x: 10, y: 28, title: '赤渊火记', text: '「火起于坛，坛裂于锁。锁一日不解，火一日不熄。」碑面烫手，字却是冷的。', codex: 'chiyuanhuo' },
      { id: 'gutan_stele4', x: 48, y: 16, title: '十二山门残榜', text: '榜上十二个山门名号，被火熏黑了九个。剩下的三个里，有青溪。', codex: 'wujiu' },
      { id: 'gutan_stele5', x: 30, y: 38, title: '断崖迁民录', text: '「坛不可弃，火不可绝。迁者留名，守者留骨。」名录末尾新刻着几个名字。', codex: 'duanyamin' },
    ],
  }),

  // —— 终局 ——
  // v2.1 垂直切片：40×32 → 62×46，北侧无相之殿、南侧空笼林、东侧断锁台
  shenyuan: makeRegion({
    id: 'shenyuan', name: '归墟深处', chapter: 7, subtitle: '锁灵之源，无相之殿',
    w: 62, h: 46, base: '.', spawn: { x: 4, y: 28 },
    weather: 'ash', tint: '#e2e0d6', timeTint: '#e3e1d7', trial: true,
    encounterTiles: ['Z', 'g'],
    paint: function (m) {
      m.border('C', 2);

      // 深潭
      m.blob(12, 12, 5, 'Z');
      m.blob(34, 30, 6, 'Z');
      m.blob(16, 30, 4, 'Z');
      m.blob(50, 14, 4, 'Z');
      m.blob(8, 38, 4, 'Z');
      m.blob(44, 40, 5, 'Z');

      // 断岩
      m.blob(20, 8, 3, 'R');
      m.blob(52, 26, 3, 'R');
      m.blob(6, 20, 3, 'R');
      m.blob(58, 36, 3, 'R');
      m.blob(26, 38, 3, 'R');
      m.blob(44, 34, 3, 'R');

      // 灰草
      m.blob(10, 24, 3, 'g');
      m.blob(24, 20, 3, 'g');
      m.blob(40, 22, 3, 'g');
      m.blob(48, 36, 3, 'g');
      m.blob(56, 10, 3, 'g');
      m.blob(30, 42, 3, 'g');

      // 无相之殿
      m.rect(27, 6, 9, 6, 'A');
      m.rect(26, 12, 11, 2, '.');

      // 主路 · 西口 → 断锁台
      m.line(2, 28, 8, 28, ',');
      m.line(8, 28, 8, 24, ',');
      m.line(8, 24, 18, 24, ',');
      m.line(18, 24, 18, 28, ',');
      m.line(18, 28, 28, 28, ',');
      m.line(28, 28, 28, 22, ',');
      m.line(28, 22, 38, 22, ',');
      m.line(38, 22, 38, 18, ',');
      m.line(38, 18, 38, 14, ',');
      m.line(38, 14, 46, 14, ',');
      m.line(46, 14, 46, 20, ',');
      m.line(46, 20, 54, 20, ',');
      m.line(54, 20, 54, 30, ',');
      m.line(54, 30, 58, 30, ',');
      m.line(58, 30, 58, 28, ',');

      // 北支 · 殿门
      m.line(32, 22, 32, 13, ',');

      // 南支 · 空笼林
      m.line(24, 28, 24, 34, ',');
      m.line(24, 34, 34, 34, ',');
      m.line(34, 34, 34, 30, ',');
      m.line(34, 30, 44, 30, ',');

      m.put(2, 28, 'E');
    },
    exits: [
      { to: 'gutan', x: 2, y: 28, need: null, label: '回断崖古坛' },
    ],
    pool: [
      { sp: 'youmu', lv: [24, 28] },
      { sp: 'guixujiao', lv: [24, 27] },
      { sp: 'xingxi', lv: [24, 27] },
      { sp: 'jinta', lv: [24, 26] },
    ],
    boss: 'wuxiang',
    npcs: [
      {
        id: 'trial_guard', name: '试炼守', sprite: 'ninja_blue', tint: 0xd8d8e0, scale: 2.6,
        x: 26, y: 24, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('boss_wuxiang')) return ['无相散了。殿里第一次有了回声。', '锁灵术的源头断了，剩下的笼得靠人一只只打开。', '山海试炼的门已经开了。去吧。'];
          return ['锁灵术的源头在下面。再往深处，就没有碑文替你说话了。', '无相没有面目，所以他不怕被认出来。', '打完这一场，山海试炼为你开门。'];
        },
        onTalk: function () { LB.flagSet('trialGuardMet', true); },
      },
      {
        id: 'shenyuan_warden', name: '守门人·哑石', sprite: 'samurai_green', tint: 0xc8c8d0, scale: 2.5,
        x: 10, y: 24, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('lockDone')) return ['三件旧料都齐了。断锁台能动了。', '锁是器，契是约。器可断，约要人来解。', '你上去的时候，别带笼。'];
          if (LB.flag('shenyuanWardenMet')) {
            if (LB.matCount('xuantie') >= 3) return ['玄铁三块？', '（他敲了敲，声音发闷。）够断一把锁了。'];
            return ['玄铁三块，断锁台才肯动。', '殿后残库里还有，你自己去翻。'];
          }
          return ['这道门我守了三十年，没让一个人带着笼进去。', '断锁台要三块玄铁才动得了。', '你替我凑齐，我把门让开。'];
        },
        onTalk: function () {
          LB.flagSet('shenyuanWardenMet', true);
          if (!LB.flag('lockDone') && LB.matCount('xuantie') >= 3) {
            LB.consumeMaterial('xuantie', 3);
            LB.flagSet('lockDone', true);
            LB.toast('断锁三料已齐 · 哑石让开殿门');
          }
        },
      },
      {
        id: 'shenyuan_cager', name: '笼匠·编号', sprite: 'ninja_blue', tint: 0xd0d0d8, scale: 2.4,
        x: 16, y: 35, dir: 'up', mark: 'side',
        lines: function () {
          if (LB.flag('cageDone')) return ['三把笼锁都开了。里面是空的，空得干净。', '笼不该有编号。有编号的，是货。', '你带走的那只笼，别再锁东西了。'];
          if (LB.flag('shenyuanCagerMet')) {
            if (LB.flag('cage1') && LB.flag('cage2') && LB.flag('cage3')) return ['三把锁都开了？', '（他把锁芯一枚枚排在膝上，像在数人名。）'];
            return ['南林、殿侧、潭边，各有一把。', '锁开了别急着走，听听里面有没有声。'];
          }
          return ['这林子里的笼，全是空的，锁却还锁着。', '空笼上锁，是怕人往里看。', '你替我开三把，看看里头到底有什么。'];
        },
        onTalk: function () {
          LB.flagSet('shenyuanCagerMet', true);
          if (!LB.flag('cageDone') && LB.flag('cage1') && LB.flag('cage2') && LB.flag('cage3')) {
            LB.flagSet('cageDone', true);
            LB.toast('空笼三锁已开 · 编号把锁芯收进布袋');
          }
        },
      },
      {
        id: 'shenyuan_shade', name: '无名者·回声', sprite: 'ninja_blue', tint: 0xe8e8f0, scale: 2.4,
        x: 46, y: 30, dir: 'left', mark: 'side',
        lines: function () {
          if (LB.flag('echoDone')) return ['三句回话都齐了。原来我还没被忘干净。', '名字是别人叫出来的，不是自己刻的。', '你走吧。我再坐一会儿。'];
          if (LB.flag('talked_shenyuan_warden') && LB.flag('talked_shenyuan_keeper') && LB.flag('talked_shenyuan_bones')) return ['守门人、殿侍、拾骨人都应了？', '（他抬起头，脸上还是没有五官。）'];
          if (LB.flag('shenyuanShadeMet')) return ['守门人在西门，殿侍在东廊，拾骨人在断锁台。', '你替我问问，他们还记不记得我。'];
          return ['我在这里坐了很久，忘了自己叫什么。', '殿里的人也许还记得。你替我问三个。', '问完回来，我告诉你锁的另一头是什么。'];
        },
        onTalk: function () {
          LB.flagSet('shenyuanShadeMet', true);
          if (!LB.flag('echoDone') && LB.flag('talked_shenyuan_warden') && LB.flag('talked_shenyuan_keeper') && LB.flag('talked_shenyuan_bones')) {
            LB.flagSet('echoDone', true);
            LB.toast('回声三答已齐 · 无名者想起了姓');
          }
        },
      },
      {
        id: 'shenyuan_keeper', name: '殿侍·空白', sprite: 'samurai_green', tint: 0xd8d8e0, scale: 2.4,
        x: 48, y: 15, dir: 'left', mark: 'side',
        lines: function () {
          if (LB.flag('blankDone')) return ['三捧蜃砂都点了。殿里的空白淡了一些。', '无相不留名，所以这殿里全是空白。', '你要问什么，趁现在问。'];
          if (LB.flag('shenyuanKeeperMet')) {
            if (LB.matCount('shensha') >= 3) return ['蜃砂三捧？', '（他把砂撒在殿砖缝里，白色浮起来。）'];
            return ['蜃砂三捧，能照出殿里藏的字。', '泽里带来的最好，归墟的也行。'];
          }
          return ['这殿里没有神像，也没有名字。', '我想把殿里的字照出来，得用蜃砂。', '你替我凑三捧，我让你看清无相的脸。'];
        },
        onTalk: function () {
          LB.flagSet('shenyuanKeeperMet', true);
          if (!LB.flag('blankDone') && LB.matCount('shensha') >= 3) {
            LB.consumeMaterial('shensha', 3);
            LB.flagSet('blankDone', true);
            LB.toast('殿中空白已照 · 无相的脸浮了一瞬');
          }
        },
      },
      {
        id: 'shenyuan_archivist', name: '录名者·残卷', sprite: 'ninja_blue', tint: 0xd8d0c8, scale: 2.3,
        x: 52, y: 18, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('shenyuanNamesDone')) return ['三块残碑都录完了。原来无相的本名，只有两个字。', '你读碑的时候，名字会响一下。', '记住那两个字。到了断锁台，用得上。'];
          var s = LB.saveState();
          if (s && s.steles && s.steles.shenyuan_stele3 && s.steles.shenyuan_stele4 && s.steles.shenyuan_stele5) return ['三块残碑都看过了？', '（他提笔，手却停在半空。）那我就照实写。'];
          return ['这里的每一块碑，都记着一个被抹掉的名字。', '你读碑的时候，名字会响一下。', '读全三块，你就知道无相怕什么。'];
        },
        onTalk: function () {
          LB.flagSet('shenyuanArchiveMet', true);
          const s = LB.saveState();
          if (!LB.flag('shenyuanNamesDone') && s && s.steles && s.steles.shenyuan_stele3 && s.steles.shenyuan_stele4 && s.steles.shenyuan_stele5) {
            LB.flagSet('shenyuanNamesDone', true);
            LB.toast('残名三录已毕 · 残卷写下两个字');
          }
        },
      },
      {
        id: 'shenyuan_child', name: '空名童子', sprite: 'ninja_blue', tint: 0xe8e0d8, scale: 1.8,
        x: 31, y: 38, dir: 'up',
        lines: function () {
          return ['我没有名字，他们叫我编号。', '编号会换，名字不会。', '你要是记得自己的名字，就说给我听。'];
        },
        onTalk: function () { LB.flagSet('shenyuanChildMet', true); },
      },
      {
        id: 'shenyuan_bones', name: '拾骨人·老秤', sprite: 'samurai_green', tint: 0xb8b8c0, scale: 2.3,
        x: 56, y: 31, dir: 'left',
        lines: function () {
          if (LB.flag('boss_wuxiang')) return ['无相散了，殿里的骨头能收了。', '收骨不收费，收名才收费。', '你要下山，我替你把名字刻在门口。'];
          return ['这地方骨头多，名字少。', '我拾骨，也拾没主的名字。', '断锁台在东北，别走错到殿后去。'];
        },
        onTalk: function () { LB.flagSet('shenyuanBonesMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'shenyuan_g1', x: 22, y: 24, mat: 'lingmu', amount: 2, label: '拾得灵木 2 块', respawn: 'chapter' },
      { id: 'shenyuan_g2', x: 37, y: 8, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
      { id: 'shenyuan_g3', x: 10, y: 30, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'shenyuan_g4', x: 40, y: 32, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'shenyuan_g5', x: 56, y: 24, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
    ],
    chests: [
      { id: 'shenyuan_chest1', name: '锁灵器残匣', x: 6, y: 12, jade: 30, items: [{ id: 'revive', count: 1 }], label: '拾得归元丹 1 枚 · 灵玉 30' },
      { id: 'shenyuan_chest2', name: '空笼底匣', x: 22, y: 14, jade: 28, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 28' },
      { id: 'shenyuan_chest3', name: '殿侧暗柜', x: 44, y: 24, jade: 32, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 32' },
      { id: 'shenyuan_chest4', name: '沉潭铁箱', x: 48, y: 28, jade: 34, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 34' },
      { id: 'shenyuan_cage1', name: '南林笼锁', x: 16, y: 30, jade: 8, items: [{ id: 'pill', count: 1 }], flag: 'cage1', label: '开得南林笼锁 · 灵玉 8' },
      { id: 'shenyuan_cage2', name: '潭边笼锁', x: 34, y: 28, jade: 8, items: [{ id: 'pill', count: 1 }], flag: 'cage2', label: '开得潭边笼锁 · 灵玉 8' },
      { id: 'shenyuan_cage3', name: '殿侧笼锁', x: 30, y: 36, jade: 8, items: [{ id: 'charm', count: 1 }], flag: 'cage3', label: '开得殿侧笼锁 · 灵玉 8' },
    ],
    props: [
      { type: 'altar', x: 31, y: 7 },
      { type: 'ruin', x: 10, y: 22 },
      { type: 'ruin', x: 28, y: 18 },
      { type: 'ruin', x: 40, y: 24 },
      { type: 'ruin', x: 20, y: 34 },
      { type: 'ruin', x: 46, y: 36 },
      { type: 'lantern', x: 14, y: 15 },
      { type: 'lantern', x: 26, y: 15 },
      { type: 'lantern', x: 40, y: 22 },
      { type: 'sign', x: 4, y: 27 },
      { type: 'sign', x: 55, y: 21 },
      { type: 'dock', x: 57, y: 29 },
      { type: 'house', x: 12, y: 36, frame: 'house1' },
    ],
    steles: [
      { id: 'shenyuan_stele1', x: 12, y: 22, title: '锁灵术源碑', text: '「抽其息，留其形，抹其名。无名者不为灵，故不能契。」碑下堆着空灵笼。', codex: 'wuxiang' },
      { id: 'shenyuan_stele2', x: 36, y: 14, title: '新契草拟', text: '「契成于互选，不成于器。一方欲去，契自解。」字迹很新，墨还没干透。', codex: 'xinqi' },
      { id: 'shenyuan_stele3', x: 48, y: 32, title: '无相残录', text: '「无相非人，是万人抹去的名字叠在一处。你叫得出一个，它就少一张脸。」', codex: 'wuxianglu' },
      { id: 'shenyuan_stele4', x: 58, y: 28, title: '断锁台铭', text: '「锁可断，约不可断。断锁者入，解约者出。二者不可同路。」台面有一道新裂。', codex: 'duansuo' },
      { id: 'shenyuan_stele5', x: 30, y: 14, title: '新契终稿', text: '「人呼其名，灵应其声。名在则契在，名亡则契亡。此约不刻于石，刻于口。」', codex: 'xinqizhong' },
    ],
  }),
});
