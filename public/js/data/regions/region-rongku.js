// 灵兽录 · 支线境 · 赤渊熔窟 · 火在岩下，名字在火里
REGIONS.rongku = makeRegion({
    id: 'rongku', name: '赤渊熔窟', chapter: 6, subtitle: '岩缝流火，旧名未冷',
    kind: 'side', unlock: { flag: 'rongkuOpen' },
    w: 50, h: 38, base: '.', spawn: { x: 4, y: 20 },
    weather: 'ash', tint: '#e8d2bc', timeTint: '#ead4be',
    paint: function (m) {
      m.border('R', 2);
      // 熔窟主道
      m.rect(4, 16, 42, 9, '.');
      m.rect(2, 20, 46, 1, ',');
      // 北窟与南窟
      m.rect(10, 4, 24, 12, '.');
      m.rect(14, 28, 26, 8, '.');
      m.rect(20, 12, 3, 5, '.');
      m.rect(28, 24, 3, 5, '.');
      // 熔岩池
      m.blob(36, 10, 4, 'L');
      m.blob(12, 32, 3, 'L');
      m.blob(41, 30, 3, 'L');
      m.put(36, 16, 'b'); m.put(37, 16, 'b');
      m.put(20, 24, 'b');
      // 岩柱
      m.rect(34, 4, 4, 4, 'R');
      m.rect(42, 14, 4, 5, 'R');
      m.rect(8, 28, 5, 3, 'R');
      m.put(2, 20, 'E');
    },
    exits: [
      { to: 'gutan', x: 2, y: 20, need: null, label: '回断崖古坛 · 熔窟口' },
    ],
    pool: [
      { sp: 'chisha', lv: [18, 23] },
      { sp: 'jinta', lv: [19, 23] },
      { sp: 'feiyan', lv: [20, 24] },
      { sp: 'hansui', lv: [19, 23] },
    ],
    boss: 'rongyi',
    npcs: [
      {
        id: 'rongku_keeper', name: '熔窟守·岩婆', sprite: 'samurai_green', tint: 0xd8b898, scale: 2.4,
        x: 8, y: 18, dir: 'down',
        lines: ['窟里的火不烧活人，只烧名字。', '赤渊遗蜕在深处，它守着一炉没铸完的契。', '你要进去，先想清楚自己叫什么。'],
        onTalk: function () { LB.flagSet('rongkuKeeperMet', true); },
      },
      {
        id: 'rongku_smith', name: '熔窟匠·赤钳', sprite: 'samurai_green', tint: 0xc8a888, scale: 2.3,
        x: 16, y: 20, dir: 'down', service: 'craft',
        lines: ['火里取铁，铁里取火，都是一门手艺。', '炉心炭在这儿不算稀罕，玄铁才难。'],
      },
      {
        id: 'rongku_child', name: '窟边小童', sprite: 'ninja_blue', tint: 0xe8d0b0, scale: 1.8,
        x: 24, y: 30, dir: 'down',
        lines: ['我阿爹的名字被火烧掉一半，只剩一个「赤」字。', '你能帮我把另一半找回来吗？'],
        onTalk: function () { LB.flagSet('rongkuChildMet', true); },
      },
      {
        id: 'rongku_hunter', name: '熔窟猎户', sprite: 'samurai_green', tint: 0xd8b898, scale: 2.2,
        x: 34, y: 22, dir: 'down',
        lines: ['遗蜕怕冷，越靠近熔池越弱。', '别在它面前提旧山主的名。'],
        onTalk: function () { LB.flagSet('rongkuHunterMet', true); },
      },
      {
        id: 'rongku_scribe', name: '记火人·残页', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 40, y: 20, dir: 'down', service: 'codex',
        lines: ['火里烧不掉的是刻在石头上的字。', '三块火碑都拓好了，你要看便看。'],
      },
    ],
    herbs: [],
    gathers: [
      { id: 'rongku_g1', x: 14, y: 8, mat: 'tanzha', amount: 2, label: '拾得烬炭 2 块', respawn: 'chapter' },
      { id: 'rongku_g2', x: 26, y: 14, mat: 'luxin', amount: 1, label: '拾得炉心炭', respawn: 'chapter' },
      { id: 'rongku_g3', x: 30, y: 30, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'chapter' },
      { id: 'rongku_g4', x: 44, y: 26, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
    ],
    chests: [
      { id: 'rongku_chest1', name: '北窟木箱', x: 12, y: 6, jade: 24, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 24' },
      { id: 'rongku_chest2', name: '岩柱暗匣', x: 32, y: 8, jade: 28, items: [{ id: 'cleanse', count: 2 }], label: '拾得清心散 2 包 · 灵玉 28' },
      { id: 'rongku_chest3', name: '南窟旧箱', x: 18, y: 32, jade: 26, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 26' },
      { id: 'rongku_chest4', name: '熔池边匣', x: 38, y: 26, jade: 30, items: [{ id: 'escape', count: 1 }], label: '拾得遁地符 · 灵玉 30' },
      { id: 'rongku_chest5', name: '半名暗格', x: 46, y: 22, jade: 34, items: [{ id: 'charm', count: 2 }], flag: 'rongkuName', label: '寻得半枚旧名牌 · 灵玉 34' },
    ],
    props: [
      { type: 'altar', x: 36, y: 12 },
      { type: 'censer', x: 32, y: 18 },
      { type: 'censer', x: 40, y: 18 },
      { type: 'lantern', x: 12, y: 16 },
      { type: 'lantern', x: 30, y: 24 },
      { type: 'barrels', x: 12, y: 28 },
      { type: 'jars', x: 24, y: 34 },
      { type: 'stoneTable', x: 34, y: 32 },
      { type: 'sweep', x: 6, y: 24 },
    ],
    steles: [
      { id: 'rongku_stele1', x: 10, y: 4, title: '熔窟旧刻', text: '「火在岩下，名在火里。取火者留名，取名者留火。」', codex: 'rongku_ku' },
      { id: 'rongku_stele2', x: 28, y: 6, title: '遗蜕记', text: '「它曾是有名字的守脉灵。锁灵器抽走名字后，火替它记着。」', codex: 'rongku_yi' },
      { id: 'rongku_stele3', x: 46, y: 30, title: '断炉铭', text: '「炉断之后，火不必再为谁烧。后来人若来，添一把柴便走。」', codex: 'rongku_hui' },
    ],
  });
