// 灵兽录 · 八境 · 第七境 · 归墟最深处，无相无形
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.shenyuan = makeRegion({
    id: 'shenyuan', name: '归墟深处', chapter: 7, subtitle: '锁灵之源，无相之殿',
    w: 84, h: 60, base: '.', spawn: { x: 4, y: 28 },
    weather: 'ash', tint: '#e2e0d6', timeTint: '#e3e1d7', trial: true,
    encounterTiles: ['Z', 'g'],
    paint: function (m) {
      m.border('C', 1);
      m.rect(0, 0, 84, 3, 'C');
      // 东境沉没水渠与骨桥
      m.rect(66, 18, 4, 32, 'W');
      m.rect(72, 40, 4, 12, 'W');
      m.blob(78, 26, 4, 'W');
      m.rect(64, 25, 8, 2, 'b');
      m.rect(64, 44, 8, 2, 'b');
      // 南境囚笼柱林
      m.rect(18, 44, 46, 13, 'Z');
      for (var gy = 46; gy <= 54; gy += 3) {
        for (var gx = 20; gx <= 60; gx += 4) m.put(gx, gy, 'R');
      }
      // 殿前广场与侧殿
      m.rect(20, 8, 26, 12, '.');
      m.rect(8, 8, 4, 6, 'H');
      m.blob(14, 17, 3, 'C');
      m.blob(56, 20, 3, 'C');
      m.line(12, 22, 31, 22, ',');
      m.line(2, 28, 20, 28, ',');
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
          if (LB.flag('nameReturned')) return ['他们叫我回声。名字还回来后，回声也轻了。', '我该走了。你记住自己的名字。'];
          if (LB.flag('nameKept')) return ['名字还在你手里。无相又多了一张脸。', '你走吧。我不送。'];
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
      { id: 'shenyuan_chest3', name: '殿侧暗柜', x: 44, y: 24, jade: 32, items: [{ id: 'charm', count: 2 }], gear: 'shenyuan_seal', label: '拾得灵符 2 张 · 无相残印 · 灵玉 32' },
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
  });
