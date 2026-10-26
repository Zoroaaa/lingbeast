// 灵兽录 · 秘境 · 试炼石海 · 石上有痕，痕是旧战
REGIONS.shihai = makeRegion({
    id: 'shihai', name: '试炼石海', chapter: 7, subtitle: '石阵无声，只记胜负',
    kind: 'secret', unlock: { flag: 'boss_wuxiang' },
    w: 48, h: 36, base: '.', spawn: { x: 4, y: 18 },
    weather: 'clear', tint: '#e8e2d0', timeTint: '#eae4d4',
    paint: function (m) {
      m.border('R', 2);
      // 石海主道
      m.rect(4, 14, 40, 9, '.');
      m.rect(2, 18, 44, 1, ',');
      // 试炼石阵
      m.rect(10, 4, 28, 10, '.');
      m.rect(12, 24, 24, 8, '.');
      m.blob(24, 18, 5, '.');
      m.blob(24, 18, 2, 'A');
      // 石柱群
      m.blob(14, 8, 2, 'R');
      m.blob(22, 6, 2, 'R');
      m.blob(32, 8, 2, 'R');
      m.blob(16, 28, 2, 'R');
      m.blob(30, 30, 2, 'R');
      // 石阶
      m.rect(23, 14, 3, 5, '.');
      m.rect(23, 22, 3, 5, '.');
      m.put(2, 18, 'E');
    },
    exits: [
      { to: 'gutan', x: 2, y: 18, need: null, label: '回断崖古坛 · 石海口' },
    ],
    pool: [
      { sp: 'shijiatuo', lv: [16, 21] },
      { sp: 'hansui', lv: [18, 22] },
      { sp: 'yueji', lv: [19, 23] },
      { sp: 'shuangling', lv: [18, 22] },
    ],
    boss: null,
    npcs: [
      {
        id: 'shihai_keeper', name: '石海守·磨', sprite: 'samurai_green', tint: 0xd8d0c0, scale: 2.4,
        x: 8, y: 16, dir: 'down',
        lines: ['石海不考力气，只考你肯不肯再来一次。', '每一道石痕都是一场旧战，输的人刻得最深。', '试炼门在后头，进去了就没人替你喊停。'],
        onTalk: function () { LB.flagSet('shihaiKeeperMet', true); },
      },
      {
        id: 'shihai_monk', name: '石海僧·无胜', sprite: 'ninja_blue', tint: 0xd8e0d8, scale: 2.3,
        x: 18, y: 14, dir: 'down', service: 'codex',
        lines: ['胜负都刻在石上，只有风不记。', '你若赢了，别急着刻；先看看上一道痕。'],
      },
      {
        id: 'shihai_ghost', name: '旧试者·残影', sprite: 'ninja_blue', tint: 0xe0e0e8, scale: 2.2,
        x: 30, y: 26, dir: 'down',
        lines: ['我过了五层，却忘了自己为什么来。', '你若还记得，替我走完第六层。'],
        onTalk: function () { LB.flagSet('shihaiGhostMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'shihai_g1', x: 12, y: 6, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'chapter' },
      { id: 'shihai_g2', x: 34, y: 28, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
    ],
    chests: [
      { id: 'shihai_chest1', name: '石阵木箱', x: 12, y: 26, jade: 26, items: [{ id: 'pill', count: 3 }], label: '拾得丹药 3 枚 · 灵玉 26' },
      { id: 'shihai_chest2', name: '试炼石匣', x: 26, y: 8, jade: 32, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 32' },
      { id: 'shihai_chest3', name: '旧战暗格', x: 38, y: 14, jade: 34, items: [{ id: 'revive', count: 1 }], flag: 'shihaiEcho', label: '拾得旧战残念 · 灵玉 34' },
    ],
    props: [
      { type: 'altar', x: 24, y: 18 },
      { type: 'lantern', x: 20, y: 18 },
      { type: 'lantern', x: 28, y: 18 },
      { type: 'sign', x: 8, y: 22 },
      { type: 'stoneTable', x: 14, y: 30 },
      { type: 'sweep', x: 6, y: 24 },
    ],
    steles: [
      { id: 'shihai_stele1', x: 10, y: 8, title: '石海旧记', text: '「石海不设门，来者自设。过五层者，可问一句。」', codex: 'shihai_shi' },
      { id: 'shihai_stele2', x: 36, y: 8, title: '试炼台铭', text: '「胜者刻名，败者刻痕。名字会被风磨掉，痕不会。」', codex: 'shihai_tai' },
      { id: 'shihai_stele3', x: 20, y: 30, title: '残影刻', text: '「我忘了为什么来，但记得不能停。」', codex: 'shihai_ling' },
    ],
  });
