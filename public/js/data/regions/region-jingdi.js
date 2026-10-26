// 灵兽录 · 秘境 · 雾隐古井 · 井底有影，影不认人
REGIONS.jingdi = makeRegion({
    id: 'jingdi', name: '雾隐古井', chapter: 2, subtitle: '井水无波，影自说话',
    kind: 'secret', unlock: { flag: 'jingdiOpen' },
    w: 38, h: 30, base: '.', spawn: { x: 4, y: 15 },
    fog: true, weather: 'fog', tint: '#e2e4de', timeTint: '#e4e6e0',
    paint: function (m) {
      m.border('R', 2);
      // 井底石厅
      m.rect(4, 10, 30, 12, '.');
      m.rect(6, 4, 26, 8, '.');
      m.rect(10, 20, 20, 6, '.');
      // 水潭
      m.blob(18, 14, 4, 'W');
      m.put(18, 10, 'b');
      m.put(14, 14, 'b');
      // 石柱
      m.blob(8, 8, 2, 'R');
      m.blob(30, 8, 2, 'R');
      m.blob(28, 22, 2, 'R');
      // 井壁裂口
      m.rect(34, 4, 2, 8, 'C');
      m.put(2, 15, 'E');
    },
    exits: [
      { to: 'wuyin', x: 2, y: 15, need: null, label: '回雾隐林 · 井口' },
    ],
    pool: [
      { sp: 'chaoxi', lv: [8, 12] },
      { sp: 'qianxi', lv: [9, 12] },
      { sp: 'taishi', lv: [8, 11] },
    ],
    boss: 'jingying',
    npcs: [
      {
        id: 'jingdi_guard', name: '井守·苔', sprite: 'ninja_blue', tint: 0xd8e0d8, scale: 2.3,
        x: 8, y: 16, dir: 'down',
        lines: ['井口封了三十年，你是第一个下来的。', '井里的人不照脸，只照你忘掉的事。', '要往北去，先问问水里的影子答不答应。'],
        onTalk: function () { LB.flagSet('jingdiGuardMet', true); },
      },
      {
        id: 'jingdi_shadow', name: '井中人·回声', sprite: 'ninja_blue', tint: 0xe0e0e8, scale: 2.2,
        x: 26, y: 18, dir: 'down',
        lines: ['你说话，我学；你不说，我也知道。', '我不是井里的东西，我是你丢在井里的那一部分。'],
        onTalk: function () { LB.flagSet('jingdiShadowMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'jingdi_g1', x: 12, y: 6, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'jingdi_g2', x: 30, y: 24, mat: 'shensha', amount: 1, label: '拾得蜃砂', respawn: 'weather' },
    ],
    chests: [
      { id: 'jingdi_chest1', name: '井壁暗匣', x: 6, y: 6, jade: 18, items: [{ id: 'cleanse', count: 1 }], label: '拾得清心散 1 包 · 灵玉 18' },
      { id: 'jingdi_chest2', name: '潭底石箱', x: 22, y: 22, jade: 24, items: [{ id: 'great_pill', count: 1 }], label: '拾得大还丹 1 枚 · 灵玉 24' },
      { id: 'jingdi_chest3', name: '回声暗格', x: 32, y: 14, jade: 26, items: [{ id: 'charm', count: 2 }], flag: 'jingdiEcho', label: '拾得回音铃 · 灵玉 26' },
    ],
    props: [
      { type: 'well', x: 18, y: 12 },
      { type: 'lantern', x: 10, y: 12 },
      { type: 'lantern', x: 26, y: 12 },
      { type: 'stoneTable', x: 14, y: 22 },
      { type: 'jars', x: 24, y: 24 },
      { type: 'sweep', x: 6, y: 20 },
    ],
    steles: [
      { id: 'jingdi_stele1', x: 14, y: 4, title: '古井铭', text: '「井不深，深的是人往下看的那一眼。」', codex: 'jingdi_jing' },
      { id: 'jingdi_stele2', x: 24, y: 6, title: '影刻', text: '「影不认人，只认旧事。你若怕它，它便一直跟着。」', codex: 'jingdi_ying' },
    ],
  });
