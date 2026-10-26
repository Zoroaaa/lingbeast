// 灵兽录 · 八境 · 第五境 · 泽上有雾，雾里有心
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.yunmeng = makeRegion({
    id: 'yunmeng', name: '云梦泽', chapter: 5, subtitle: '雾照人心，泽无定岸',
    w: 86, h: 62, base: '.', spawn: { x: 4, y: 20 },
    fog: true, weather: 'fog', tint: '#e8e9e0', timeTint: '#e9eae1',
    encounterTiles: ['g', 'Z'],
    paint: function (m) {
      m.border('Z', 1);
      m.rect(0, 0, 86, 2, 'T');
      // 东泽大湖与湖心岛
      m.rect(64, 24, 18, 18, 'W');
      m.blob(72, 34, 7, 'W');
      m.blob(79, 45, 4, 'W');
      m.rect(71, 33, 3, 3, 'g');
      m.rect(64, 35, 8, 1, 'b');
      // 北境照心池
      m.rect(48, 4, 12, 6, 'W');
      m.rect(54, 10, 2, 2, 'b');
      // 南境芦荡
      m.rect(6, 46, 70, 12, 'Z');
      m.blob(20, 52, 4, 'T');
      m.blob(40, 55, 4, 'T');
      m.blob(62, 52, 4, 'T');
      // 西湾
      m.blob(12, 40, 4, 'W');
      m.line(2, 20, 30, 20, ',');
      m.line(34, 20, 83, 20, ',');
      m.put(2, 20, 'E');
      m.put(83, 20, 'E');
    },
    exits: [
      { to: 'guixu', x: 2, y: 20, need: null, label: '回归墟海市' },
      { to: 'gutan', x: 83, y: 20, need: { chapter: 6 }, label: '西行 · 断崖古坛' },
    ],
    pool: [
      { sp: 'yunmengbei', lv: [16, 19] },
      { sp: 'guixujiao', lv: [16, 19] },
      { sp: 'youmu', lv: [16, 18] },
      { sp: 'chaoxi', lv: [16, 18] },
      { sp: 'chier', lv: [16, 19] },
      { sp: 'xianyao', lv: [16, 19] },
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
        x: 30, y: 19, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('dreamsReturned')) return ['他们醒了。醒着的人不一定会谢你。', '泽上的雾薄了一层。'];
          if (LB.flag('dreamsSold')) return ['你把梦带走了。泽上今夜很静。', '静得能听见谁在翻身。'];
          if (LB.flag('mirageDone')) return ['你问过了。泽上三个人，三种活法。', '契不是绳子。是有人愿意在雾里叫你的名字。', '答案不在泽里。往前走。'];
          if (LB.flag('talked_fisher') && LB.flag('talked_yunmeng_mirror') && LB.flag('talked_yunmeng_warden')) return ['渔人、镜叟、巡泽人，你都问过了。', '那么换我问你一句：你愿意被谁记住？'];
          return ['你见过自己的哪一种结局？', '要问我一句，先替我去问泽上三个人：渔人、镜叟、巡泽人。', '契是不是更体面的奴役——这句话，是蜃母问你的，也是你自己问的。'];
        },
        onTalk: function () {
          if (LB.flag('talked_mirage') && LB.flag('talked_fisher') && LB.flag('talked_yunmeng_mirror') && LB.flag('talked_yunmeng_warden') && !LB.flag('mirageDone')) {
            LB.flagSet('mirageDone', true);
            LB.toast('蜃影答你 · 契是彼此记得');
          }
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
        x: 56, y: 22, dir: 'up', mark: 'side',
        lines: function () {
          if (LB.flag('yunmengStakesDone')) return ['三桩立回去了。雾线退到旧位置，夜里能听见桩上的铃。', '巡泽不是打仗，是替后来的人认路。', '你往东走，桩会替你数着步子。'];
          if (LB.flag('talked_yunmeng_warden') && LB.matCount('lingmu') >= 3) return ['灵木够了？好。', '跟我来，把三根桩一根根敲进雾线里。'];
          if (LB.flag('boss_shenmu')) return ['蜃母退了。泽上的雾薄了一层。雾薄了，路就露出来了。', '雾线退了半里，三根界桩得重新立。备三根灵木来。', '别以为雾散了就安全，泽还在看。'];
          return ['雾一起，连我都不敢走远。', '听见有人叫你名字，别应。', '蜃楼台在正北，路是旧山门铺的，踏着走。'];
        },
        onTalk: function () {
          LB.flagSet('wardenMet', true);
          if (LB.flag('talked_yunmeng_warden') && LB.matCount('lingmu') >= 3 && !LB.flag('yunmengStakesDone')) {
            LB.flagSet('yunmengStakesDone', true);
            LB.toast('泽界三桩立稳 · 雾线退回半里');
          }
        },
      },
      {
        id: 'yunmeng_dreamer', name: '梦游人·枕泽', sprite: 'ninja_blue', tint: 0xe0e0e8, scale: 2.0,
        x: 26, y: 30, dir: 'down',
        lines: ['我每晚梦见同一条船，船上没有我。', '泽里的雾不拦人，只把人心里的话翻出来。', '你若听见有人叫你的名字，先别应。'],
        onTalk: function () { LB.flagSet('yunmengDreamerMet', true); },
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
      { id: 'yunmeng_chest2', name: '沉船残匣', x: 43, y: 13, jade: 24, items: [{ id: 'great_pill', count: 1 }], gear: 'yunmeng_talisman', label: '拾得大还丹 1 枚 · 蜃景护符 · 灵玉 24' },
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
      // 泽畔渔家
      { type: 'jars', x: 15, y: 19 },
      { type: 'tea', x: 18, y: 19 },
      { type: 'barrels', x: 21, y: 19 },
      { type: 'stoneTable', x: 24, y: 19 },
      { type: 'sweep', x: 27, y: 19 },
    ],
    steles: [
      { id: 'yunmeng_stele1', x: 22, y: 22, title: '云梦泽记', text: '「泽上多雾，雾中见心。行舟者勿答雾中之问，答则迷。」', codex: 'yunmengze' },
      { id: 'yunmeng_stele2', x: 40, y: 20, title: '五灵相胜图', text: '木胜土，土胜水，水胜火，火胜金，金胜木。图下写着：相胜为用，相生为守。', codex: 'wuling' },
      { id: 'yunmeng_stele3', x: 48, y: 35, title: '云梦舟刻', text: '「舟不系岸，人不系舟。渡者自渡，泽不留人。」刻痕很浅，像被水磨过。', codex: 'yunmengzhou' },
      { id: 'yunmeng_stele4', x: 33, y: 10, title: '蜃楼台铭', text: '「楼台非楼，镜亦非镜。你所见者，皆你心中未答之问。」台基下压着一层旧贝壳。', codex: 'shenloutai' },
      { id: 'yunmeng_stele5', x: 57, y: 21, title: '泽镜', text: '「照人先照己，问泽先问心。答不出者，留在雾里。」镜面早已锈死，字却亮着。', codex: 'yunmengjing' },
    ],
  });
