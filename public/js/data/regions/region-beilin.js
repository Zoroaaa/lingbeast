// 灵兽录 · 秘境 · 碑林秘境 · 石比人记性好
REGIONS.beilin = makeRegion({
    id: 'beilin', name: '碑林秘境', chapter: 1, subtitle: '万碑无言，字在风里',
    kind: 'secret', unlock: { codexPct: 50 },
    w: 44, h: 34, base: '.', spawn: { x: 4, y: 17 },
    weather: 'clear', tint: '#efe8d6', timeTint: '#f1eada',
    paint: function (m) {
      m.border('T', 2);
      // 碑林石径
      m.rect(4, 12, 36, 12, '.');
      m.rect(4, 17, 36, 1, ',');
      m.rect(10, 6, 24, 8, '.');
      m.rect(10, 24, 24, 7, '.');
      m.rect(20, 8, 2, 20, ',');
      m.blob(6, 12, 2, 'R');
      m.blob(36, 12, 2, 'R');
      m.blob(14, 26, 2, 'R');
      m.blob(30, 26, 2, 'R');
      m.put(2, 17, 'E');
    },
    exits: [
      { to: 'shanmen', x: 2, y: 17, need: null, label: '回山门 · 碑林小径' },
    ],
    pool: [
      { sp: 'taishi', lv: [6, 10] },
      { sp: 'tongling', lv: [7, 11] },
      { sp: 'qingheng', lv: [7, 11] },
    ],
    boss: null,
    npcs: [
      {
        id: 'beilin_keeper', name: '碑林守·石眼', sprite: 'samurai_green', tint: 0xe0dcd0, scale: 2.3,
        x: 8, y: 17, dir: 'down',
        lines: ['碑林的石头比人记性好。', '每解开一处碑文，山海志里便多一页。', '拓印要轻，重了就把字带走。'],
        onTalk: function () { LB.flagSet('beilinKeeperMet', true); },
      },
      {
        id: 'beilin_rubbing', name: '拓碑人·柳先生', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 22, y: 10, dir: 'down', service: 'codex',
        lines: ['拓碑不是抄字，是把石头的呼吸留在纸上。', '五块无名碑，拓全了能看见一条旧路。'],
        onTalk: function () { LB.flagSet('beilinRubbingMet', true); },
      },
      {
        id: 'beilin_blind', name: '盲眼读碑人', sprite: 'ninja_blue', tint: 0xe8e0d0, scale: 2.1,
        x: 28, y: 21, dir: 'down',
        lines: ['我看不见字，但摸得出哪块碑在哭。', '最北那块，摸上去像被谁反复擦过。'],
        onTalk: function () { LB.flagSet('beilinBlindMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'beilin_g1', x: 34, y: 28, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
    ],
    chests: [
      { id: 'beilin_chest1', name: '碑林木箱', x: 6, y: 20, jade: 18, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 18' },
      { id: 'beilin_chest2', name: '无名碑匣', x: 36, y: 22, jade: 24, items: [{ id: 'charm', count: 2 }], label: '拾得灵符 2 张 · 灵玉 24' },
    ],
    props: [
      { type: 'lantern', x: 10, y: 14 },
      { type: 'lantern', x: 30, y: 14 },
      { type: 'altar', x: 22, y: 17 },
      { type: 'stoneTable', x: 14, y: 20 },
      { type: 'sign', x: 26, y: 22 },
      { type: 'sweep', x: 6, y: 22 },
    ],
    steles: [
      { id: 'beilin_stele1', x: 8, y: 8, title: '无名碑一', text: '碑上只有一道横痕，像有人写了一半的「一」字。', codex: 'beilin_1' },
      { id: 'beilin_stele2', x: 16, y: 6, title: '无名碑二', text: '碑面刻着十二个门名，最后一个被磨平，只剩青溪。', codex: 'beilin_2' },
      { id: 'beilin_stele3', x: 28, y: 6, title: '无名碑三', text: '碑上是一张残缺的契纹，线条断在「愿」字上。', codex: 'beilin_3' },
      { id: 'beilin_stele4', x: 10, y: 28, title: '无名碑四', text: '碑上刻着很多名字，每个名字后面都有一枚小小的兽爪印。', codex: 'beilin_4' },
      { id: 'beilin_stele5', x: 34, y: 26, title: '无名碑五', text: '最北的碑没有字，只有一道被反复摩挲的浅窝。', codex: 'beilin_5' },
    ],
  });
