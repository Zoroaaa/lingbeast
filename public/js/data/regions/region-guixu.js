// 灵兽录 · 八境 · 第四境 · 潮起潮落，万物有价
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.guixu = makeRegion({
    id: 'guixu', name: '归墟海市', chapter: 4, subtitle: '潮退市开，价由人定',
    w: 76, h: 56, base: '.', spawn: { x: 5, y: 16 },
    fog: true, weather: 'rain', tint: '#e9e6dc', timeTint: '#eae7dd',
    encounterTiles: ['D', 'g'],
    paint: function (m) {
      m.border('D', 1);
      // 南境内海与潮汐湾
      m.rect(24, 42, 50, 12, 'W');
      m.blob(70, 38, 4, 'W');
      // 栈桥与横廊
      m.rect(34, 36, 3, 18, 'M');
      m.rect(51, 34, 3, 20, 'M');
      m.rect(24, 47, 50, 2, 'M');
      // 盐田白滩
      m.rect(6, 3, 20, 3, '.');
      m.rect(6, 7, 20, 1, 'D');
      m.rect(6, 10, 20, 1, 'D');
      m.rect(6, 13, 20, 1, 'D');
      // 灯塔崖与沉船湾
      m.rect(73, 4, 2, 10, 'C');
      m.blob(64, 35, 4, 'W');
      m.rect(62, 20, 3, 8, 'C');
      m.line(2, 16, 18, 16, ',');
      m.line(56, 16, 71, 16, ',');
      m.put(2, 16, 'E');
      m.put(71, 16, 'E');
    },
    exits: [
      { to: 'luoxing', x: 2, y: 16, need: null, label: '回落星原' },
      { to: 'yunmeng', x: 71, y: 16, need: { chapter: 5 }, label: '渡口 · 云梦泽' },
    ],
    pool: [
      { sp: 'chaoxi', lv: [12, 15] },
      { sp: 'guixujiao', lv: [13, 16] },
      { sp: 'jinyu', lv: [12, 15] },
      { sp: 'yunmengbei', lv: [12, 14] },
      { sp: 'qianxi', lv: [12, 16] },
      { sp: 'chaowen', lv: [13, 16] },
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
          if (LB.flag('songReturned')) return ['你听，潮里又有名字了。', '歌还回去了，海市少了一笔账。'];
          if (LB.flag('songSold')) return ['歌没了。海市给了价，潮水没给。', '以后退潮，你别来礁边。'];
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
      { id: 'guixu_chest2', name: '码头货箱', x: 40, y: 18, jade: 20, items: [{ id: 'incense', count: 1 }], gear: 'guixu_talisman', label: '拾得引灵香 1 支 · 潮生护符 · 灵玉 20' },
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
      // 海市街口
      { type: 'tea', x: 22, y: 15 },
      { type: 'jars', x: 24, y: 16 },
      { type: 'barrels', x: 26, y: 16 },
      { type: 'wish', x: 29, y: 15 },
      { type: 'notice', x: 26, y: 18 },
    ],
    steles: [
      { id: 'guixu_stele1', x: 12, y: 16, title: '海市旧约', text: '「潮退则市开，潮满则市散。买卖不问来路，欠账必还。」落款是三十六年前的商盟。', codex: 'guixushangmeng' },
      { id: 'guixu_stele2', x: 38, y: 18, title: '锁灵器价目', text: '一件锁灵器的价钱，写着「一条灵脉的支流」。字很小，像不愿被人看见。', codex: 'suolingshu' },
      { id: 'guixu_stele3', x: 16, y: 7, title: '盐田旧契', text: '「盐能定息，亦能定心。私贩海盐者，市籍除名。」碑脚压着一枚盐引，印色早褪了。', codex: 'yantian' },
      { id: 'guixu_stele4', x: 45, y: 32, title: '沉船名录', text: '「沉者十七，归者三。船骨可拆，名字不可拆。」名录最后一行被人用刀划掉了。', codex: 'chenchuan' },
      { id: 'guixu_stele5', x: 55, y: 31, title: '鲛歌石刻', text: '「以息换息，以名换名。潮生潮落，歌不归人。」石面很滑，像被很多人的手摸过。', codex: 'jiaoge' },
    ],
  });
