// 灵兽录 · 八境 · 第六境 · 赤渊裂土，旧名未熄
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.gutan = makeRegion({
    id: 'gutan', name: '断崖古坛', chapter: 6, subtitle: '火在渊底，等一个名字',
    w: 72, h: 52, base: '.', spawn: { x: 4, y: 20 },
    weather: 'ash', tint: '#ecd8c2', timeTint: '#eedac4',
    paint: function (m) {
      m.border('C', 1);
      m.rect(0, 0, 72, 2, 'C');
      // 东境火口裂隙
      m.blob(60, 36, 4, 'L');
      m.blob(66, 44, 3, 'L');
      m.rect(64, 10, 5, 9, 'L');
      // 南缘熔岩带
      m.blob(12, 47, 4, 'L');
      m.blob(30, 48, 3, 'L');
      m.blob(44, 47, 4, 'L');
      // 古坛焦土与断崖
      m.blob(30, 7, 5, '.');
      m.rect(21, 14, 18, 10, '.');
      m.blob(8, 12, 3, 'C');
      m.blob(58, 22, 3, 'C');
      m.blob(18, 6, 2, 'T');
      m.blob(40, 6, 2, 'T');
      // 烧毁村落残墙
      m.rect(6, 24, 3, 3, 'H');
      m.rect(48, 30, 3, 3, 'H');
      m.line(2, 20, 21, 20, ',');
      m.line(50, 20, 69, 20, ',');
      m.put(2, 20, 'E');
      m.put(69, 20, 'E');
    },
    exits: [
      { to: 'yunmeng', x: 2, y: 20, need: null, label: '回云梦泽' },
      { to: 'shenyuan', x: 69, y: 20, need: { chapter: 7 }, label: '入 · 归墟深处' },
    ],
    pool: [
      { sp: 'jinta', lv: [20, 24] },
      { sp: 'yanwei', lv: [20, 23] },
      { sp: 'shijiatuo', lv: [20, 23] },
      { sp: 'jinyu', lv: [20, 22] },
      { sp: 'chisha', lv: [20, 24] },
      { sp: 'shaxing', lv: [20, 24] },
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
        onTalk: function () {
          LB.flagSet('yiminMet', true);
          if (chapterNow() >= 6) LB.flagSet('rongkuOpen', true);
        },
      },
      {
        id: 'gutan_keeper', name: '守坛人·赤眉', sprite: 'samurai_green', tint: 0xd8b898, scale: 2.4,
        x: 26, y: 19, dir: 'right', mark: 'side',
        lines: function () {
          if (LB.flag('emberKept')) return ['火还在坛里。遗民今年能过冬。', '你听，火里有名字。'];
          if (LB.flag('emberForged')) return ['铃声响的时候，别让遗民听见。', '火种进了器，坛就冷了。'];
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
      {
        id: 'gutan_ash', name: '拾灰人·半筐', sprite: 'ninja_blue', tint: 0xc8b8a8, scale: 2.0,
        x: 20, y: 26, dir: 'down',
        lines: ['灰里能捡到没烧完的名字。', '我捡了半筐，一个也不敢念。', '你要去熔窟？那儿的火比这儿还凶。'],
        onTalk: function () { LB.flagSet('gutanAshMet', true); },
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
      { id: 'gutan_chest4', name: '灰窑暗箱', x: 52, y: 32, jade: 24, items: [{ id: 'charm', count: 2 }], gear: 'gutan_bell', label: '拾得灵符 2 张 · 烬尾铃 · 灵玉 24' },
      { id: 'gutan_chest8', name: '灰里旧匣', x: 20, y: 30, jade: 22, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 22' },
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
      // 古坛祭场
      { type: 'censer', x: 22, y: 19 },
      { type: 'offering', x: 23, y: 18 },
      { type: 'barrels', x: 18, y: 19 },
      { type: 'wish', x: 20, y: 17 },
      { type: 'sweep', x: 28, y: 20 },
    ],
    steles: [
      { id: 'gutan_stele1', x: 16, y: 26, title: '洪荒残言', text: '「五灵祖兽以身化石，以息成河。山是它们睡下时压出的褶皱。」', codex: 'honghuang' },
      { id: 'gutan_stele2', x: 36, y: 24, title: '无咎旧誓', text: '「我守此脉，不锁一灵。若我成渊，后来者斩之。」字被火燎过，仍看得清。', codex: 'yuanshou' },
      { id: 'gutan_stele3', x: 10, y: 28, title: '赤渊火记', text: '「火起于坛，坛裂于锁。锁一日不解，火一日不熄。」碑面烫手，字却是冷的。', codex: 'chiyuanhuo' },
      { id: 'gutan_stele4', x: 48, y: 16, title: '十二山门残榜', text: '榜上十二个山门名号，被火熏黑了九个。剩下的三个里，有青溪。', codex: 'wujiu' },
      { id: 'gutan_stele5', x: 30, y: 38, title: '断崖迁民录', text: '「坛不可弃，火不可绝。迁者留名，守者留骨。」名录末尾新刻着几个名字。', codex: 'duanyamin' },
    ],
  });
