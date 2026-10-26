// 灵兽录 · 支线境 · 归墟暗市 · 潮下无灯，价在暗处
REGIONS.anshi = makeRegion({
    id: 'anshi', name: '归墟暗市', chapter: 4, subtitle: '不问来路，只问出价',
    kind: 'side', unlock: { flag: 'anshiOpen' },
    w: 46, h: 36, base: '.', spawn: { x: 4, y: 18 },
    fog: true, weather: 'rain', tint: '#e4e2d8', timeTint: '#e6e4da',
    encounterTiles: ['D', 'g'],
    paint: function (m) {
      m.border('D', 2);
      // 暗市木板街
      m.rect(4, 14, 38, 9, 'M');
      m.rect(2, 18, 42, 1, 'M');
      // 两侧栈桥与货棚
      m.rect(8, 4, 30, 10, 'M');
      m.rect(8, 24, 30, 8, 'M');
      // 潮渠
      m.rect(22, 4, 2, 10, 'W');
      m.rect(22, 23, 2, 9, 'W');
      m.put(22, 18, 'b'); m.put(23, 18, 'b');
      m.put(22, 9, 'b'); m.put(23, 9, 'b');
      // 暗巷与货箱区
      m.rect(32, 6, 6, 7, 'H');
      m.rect(32, 25, 7, 5, '.');
      m.rect(12, 26, 7, 5, '.');
      // 出口
      m.put(2, 18, 'E');
    },
    exits: [
      { to: 'guixu', x: 2, y: 18, need: null, label: '回海市 · 暗巷口' },
    ],
    pool: [
      { sp: 'chaowen', lv: [12, 17] },
      { sp: 'chaoxi', lv: [12, 16] },
      { sp: 'qianxi', lv: [13, 17] },
      { sp: 'yuntie', lv: [14, 18] },
    ],
    boss: null,
    npcs: [
      {
        id: 'anshi_broker', name: '暗市掌柜·秤', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.4,
        x: 12, y: 16, dir: 'down',
        lines: ['明市卖货，暗市卖消息。你要哪样？', '价不用灵玉，用你身上最舍不得的东西。', '海市主知道我在这儿，她不问，就是默许。'],
        onTalk: function () { LB.flagSet('anshiBrokerMet', true); },
      },
      {
        id: 'anshi_mask', name: '面具客', sprite: 'ninja_blue', tint: 0xe8e0d0, scale: 2.3,
        x: 18, y: 12, dir: 'down',
        lines: ['面具不是遮脸，是让人认不出你怕什么。', '我买过一张脸，后来忘了自己原来长什么样。'],
        onTalk: function () { LB.flagSet('anshiMaskMet', true); },
      },
      {
        id: 'anshi_smuggler', name: '走私客·鳅', sprite: 'samurai_green', tint: 0xc8d8d8, scale: 2.2,
        x: 30, y: 22, dir: 'down',
        lines: ['锁灵器的边角料，明市不敢摆，我敢。', '你要买，我不问用途；你要卖，我也不问来路。'],
        onTalk: function () { LB.flagSet('anshiSmugglerMet', true); },
      },
      {
        id: 'anshi_scribe', name: '抄契人·墨尾', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 34, y: 14, dir: 'down', service: 'codex',
        lines: ['契能抄，名字不能。', '暗市的账我抄了三十年，只有一页不敢抄。'],
      },
      {
        id: 'anshi_guard', name: '守巷人·无声', sprite: 'samurai_green', tint: 0xb8b8b8, scale: 2.4,
        x: 38, y: 18, dir: 'down',
        lines: ['暗市有三条规矩：不点灯、不喊名、不回头。', '你犯了哪条，我都当没看见。'],
        onTalk: function () { LB.flagSet('anshiGuardMet', true); },
      },
      {
        id: 'anshi_child', name: '小乞·铜板', sprite: 'ninja_blue', tint: 0xf0d8b8, scale: 1.8,
        x: 14, y: 26, dir: 'down',
        lines: ['我替人跑腿，一天换半个饼。', '有个客人让我找一枚断掉的契印，我找到了，不敢给他。'],
        onTalk: function () { LB.flagSet('anshiChildMet', true); },
      },
      {
        id: 'anshi_vendor', name: '暗市摊主·哑秤', sprite: 'samurai_green', tint: 0xd8c0a8, scale: 2.2,
        x: 28, y: 26, dir: 'down', service: 'shop',
        lines: ['暗市不问来路，货也不问去处。', '雷符、破障丹、遁符，摆出来的都能买。'],
      },
    ],
    herbs: [],
    gathers: [
      { id: 'anshi_g1', x: 10, y: 26, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
      { id: 'anshi_g2', x: 30, y: 10, mat: 'haiyan', amount: 2, label: '刮得海盐 2 份', respawn: 'weather' },
    ],
    chests: [
      { id: 'anshi_chest1', name: '货棚暗箱', x: 8, y: 6, jade: 20, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 20' },
      { id: 'anshi_chest2', name: '栈桥木匣', x: 26, y: 8, jade: 24, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 24' },
      { id: 'anshi_chest3', name: '暗巷铁箱', x: 34, y: 26, jade: 28, items: [{ id: 'escape', count: 1 }], label: '拾得遁地符 · 灵玉 28' },
      { id: 'anshi_chest4', name: '货箱夹层', x: 16, y: 28, jade: 26, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 26' },
      { id: 'anshi_chest5', name: '潮渠沉匣', x: 21, y: 32, jade: 30, items: [{ id: 'incense', count: 1 }], label: '拾得引灵香 1 支 · 灵玉 30' },
      { id: 'anshi_chest6', name: '断印暗格', x: 40, y: 26, jade: 34, items: [{ id: 'charm', count: 1 }], flag: 'anshiSeal', label: '寻得断契印 · 灵玉 34' },
    ],
    props: [
      { type: 'house', x: 32, y: 6, frame: 'house1' },
      { type: 'barrels', x: 10, y: 8 },
      { type: 'jars', x: 14, y: 8 },
      { type: 'notice', x: 20, y: 16 },
      { type: 'lantern', x: 26, y: 14 },
      { type: 'lantern', x: 30, y: 26 },
      { type: 'tea', x: 12, y: 22 },
      { type: 'stoneTable', x: 36, y: 22 },
      { type: 'sweep', x: 6, y: 22 },
    ],
    steles: [
      { id: 'anshi_stele1', x: 6, y: 12, title: '暗市规矩', text: '「不点灯，不喊名，不回头。犯了也不赶，暗市记得住每一个人。」', codex: 'anshi_shi' },
      { id: 'anshi_stele2', x: 28, y: 12, title: '断契价目', text: '一页旧价目，最上面一行被刀刮掉，只剩「契」字和一枚指印。', codex: 'anshi_jia' },
      { id: 'anshi_stele3', x: 44, y: 20, title: '暗巷刻字', text: '「明处无路时，暗处未必有；但暗处至少没人替你选。」', codex: 'anshi_an' },
    ],
  });
