// 灵兽录 · 八境 · 第三境 · 星落成原，炉火未冷
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.luoxing = makeRegion({
    id: 'luoxing', name: '落星原', chapter: 3, subtitle: '星落成原，炉火未熄',
    w: 68, h: 50, base: '.', spawn: { x: 5, y: 20 },
    weather: 'clear', tint: '#f1eadb', timeTint: '#f2ebdc',
    encounterTiles: ['g', 'D'],
    paint: function (m) {
      m.border('R', 1);
      m.rect(0, 0, 68, 2, 'T');
      // 陨坑群
      m.blob(12, 12, 3, 'C');
      m.blob(57, 12, 4, 'C');
      m.blob(30, 44, 3, 'C');
      m.blob(64, 35, 3, 'C');
      m.blob(10, 32, 3, 'C');
      // 矿道与星屑浅滩
      m.rect(14, 30, 52, 2, 'M');
      m.rect(12, 20, 54, 2, 'D');
      m.blob(31, 8, 4, 'D');
      // 旧坊与风蚀柱
      m.rect(24, 24, 6, 4, 'H');
      m.rect(48, 18, 6, 4, 'H');
      m.blob(16, 42, 2, 'R');
      m.blob(46, 42, 2, 'R');
      m.line(2, 20, 14, 20, ',');
      m.line(54, 20, 66, 20, ',');
      m.put(2, 20, 'E');
      m.put(66, 20, 'E');
    },
    exits: [
      { to: 'wuyin', x: 2, y: 20, need: null, label: '回雾隐林' },
      { to: 'guixu', x: 66, y: 20, need: { chapter: 4 }, label: '东行 · 归墟海市' },
    ],
    pool: [
      { sp: 'shijiatuo', lv: [8, 11] },
      { sp: 'xingxi', lv: [9, 12] },
      { sp: 'jinyu', lv: [8, 11] },
      { sp: 'moyu', lv: [8, 9] },
    ],
    boss: 'xingyun',
    npcs: [
      {
        id: 'zhuling', name: '铸灵师', sprite: 'samurai_green', tint: 0xe8d8c0, scale: 2.6,
        x: 46, y: 22, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('forgeUsed')) return ['新印还顺手吗？记住，器不认主，只认用过它的人。', '炉火还亮着。你要铸什么，先说清楚。'];
          if (LB.flag('forgeSealed')) return ['炉底封了。这样也好，省得有人再拿它去锁灵。', '我这一脉，到你这里就算断了个干净。'];
          if (!LB.flag('boss_xingyun')) return ['这炉子三十年没熄，也没再铸过一件好东西。', '星陨傀守在陨坑里，它身上嵌着锁灵器的碎片。', '替我取回来，我告诉你断契之乱真正缺的那一环。'];
          if (LB.flag('furnaceLit')) return ['碎片我收下了。匠人造器，本不该造锁。', '青芜把炉火重新点起来了。你听，风箱的声音比从前轻。', '把你的灵笼给我看看——它比我的旧作干净。'];
          return ['碎片我收下了。匠人造器，本不该造锁。', '你若愿意，把你的灵笼给我看看——它比我的旧作干净。'];
        },
        onTalk: function () { LB.flagSet('zhulingMet', true); },
      },
      {
        id: 'miner', name: '矿工·老石', sprite: 'samurai_green', tint: 0xc8b8a0, scale: 2.4,
        x: 29, y: 38, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('mineCleared')) return ['三处塌口都支稳了。矿道又通了，风也进得去。', '坑底有些星屑，天时对的时候才浮上来。', '别在夜里下坑，坑底会应人的脚步声。'];
          if (LB.flag('minerMet')) return ['灵木三块、玄铁两块，够打三副支架。', '塌的是三岔口，不是整条矿道。'];
          return ['矿坑深处有星屑，天时对的时候才浮上来。', '今年星落得勤，矿道塌了三处，我一个人支不住。', '你若有灵木和玄铁，替我把支架打起来。'];
        },
        onTalk: function () {
          LB.flagSet('minerMet', true);
          if (!LB.flag('mineCleared') && LB.matCount('lingmu') >= 3 && LB.matCount('xuantie') >= 2) {
            LB.consumeMaterial('lingmu', 3);
            LB.consumeMaterial('xuantie', 2);
            LB.flagSet('mineCleared', true);
            LB.toast('矿道三岔已支稳 · 星砂矿脉重开');
          }
        },
      },
      {
        id: 'luoxing_stargazer', name: '星象师·裴照', sprite: 'ninja_blue', tint: 0xd8e0e8, scale: 2.5,
        x: 31, y: 11, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('starChartDone')) return ['星图补全了。那颗星的轨，是从归墟方向来的。', '天工司当年按星轨选矿，也按星轨铸器。', '你往东走，海市的人认得这枚残印。'];
          if (LB.flag('starChart1') && LB.flag('starChart2') && LB.flag('starChart3')) return ['三片都找齐了？', '（他把残片在石台上拼拢，指尖沿着裂缝走。）'];
          if (LB.flag('stargazerMet')) return ['星图碎成三片，被风带去了陨坑、星泉与西南沙地。', '残片上有旧刻，拼起来才知道缺的是哪一漏。'];
          return ['观星台不是看星，是看星落下来的路。', '今年跌下来的一颗星，把旧星图震碎了。', '三片残图散在原上，替我找回来。'];
        },
        onTalk: function () {
          LB.flagSet('stargazerMet', true);
          if (!LB.flag('starChartDone') && LB.flag('starChart1') && LB.flag('starChart2') && LB.flag('starChart3')) {
            LB.flagSet('starChartDone', true);
            LB.toast('星图补全 · 裴照读出陨星旧轨');
          }
        },
      },
      {
        id: 'luoxing_apprentice', name: '天工司学徒·青芜', sprite: 'samurai_green', tint: 0xe8f0d8, scale: 2.2,
        x: 52, y: 22, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('furnaceLit')) return ['炉火稳了。师傅说，火听人的呼吸，不听人的脾气。', '旧坊的账本残页上，记着十二山门买过同一批锁器。'];
          if (LB.flag('apprenticeMet')) return ['烬炭三块、星屑两份，就能把火重新引起来。', '别再让它熄第三次了。'];
          return ['这炉子熄了三次，每次都差一点把旧坊烧了。', '炉膛里还剩一口气，得用烬炭引。', '你身上若有烬炭和星屑，借我一些。'];
        },
        onTalk: function () {
          LB.flagSet('apprenticeMet', true);
          if (!LB.flag('furnaceLit') && LB.matCount('tanzha') >= 3 && LB.matCount('xingxie') >= 2) {
            LB.consumeMaterial('tanzha', 3);
            LB.consumeMaterial('xingxie', 2);
            LB.flagSet('furnaceLit', true);
            LB.toast('旧坊炉火重燃 · 青芜记下第一笔账');
          }
        },
      },
      {
        id: 'luoxing_courier', name: '驿马夫·陆三', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.3,
        x: 12, y: 21, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('letterDelivered')) return ['信送到了。收信的人说，三十年前的账，他还记得。', '往东过旧坊，就是归墟的潮路。', '路上别接陌生人的信。这地方的信，比刀沉。'];
          if (LB.flag('starLetter')) return ['信找着了？风蚀谷的信匣里翻出来的？', '（他接过信，看了落款，沉默了很久。）'];
          if (LB.flag('courierMet')) return ['风蚀谷那边有只旧信匣，被沙埋了半截。', '信是写给归墟海市的，落款是天工司。', '你去取来，我替你送到东口。'];
          return ['我在星原跑了二十年驿路，路比人记得清楚。', '今年风大，把风蚀谷的信匣吹开了。', '有一封没送出去的信，压在沙里。'];
        },
        onTalk: function () {
          LB.flagSet('courierMet', true);
          if (!LB.flag('letterDelivered') && LB.flag('starLetter')) {
            LB.flagSet('letterDelivered', true);
            LB.toast('旧信已托付 · 陆三向东去');
          }
        },
      },
      {
        id: 'luoxing_scavenger', name: '拾荒人·白婆', sprite: 'samurai_green', tint: 0xe0d8c0, scale: 2.1,
        x: 52, y: 34, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('shardsGiven')) return ['星屑压手，风蚀谷的风就压不住人了。', '白婆不欠人，也不让人欠。', '往南是旧渡的方向，雾大，别走岔。'];
          if (LB.flag('scavengerMet')) {
            if (LB.matCount('xingxie') >= 3) return ['星屑带来了？摊在布上，我看看成色。', '（她用指腹一粒粒捻过，点点头。）'];
            return ['三份星屑，一份都不能少。', '风蚀谷的星屑最亮，也最难捡。'];
          }
          return ['我在这谷里捡了半辈子星屑。', '星落下来是死的，落到土里才活。', '你给我三份星屑，我替你压一压这身风尘。'];
        },
        onTalk: function () {
          LB.flagSet('scavengerMet', true);
          if (!LB.flag('shardsGiven') && LB.matCount('xingxie') >= 3) {
            LB.consumeMaterial('xingxie', 3);
            LB.flagSet('shardsGiven', true);
            LB.toast('白婆收下星屑 · 风蚀旧事换了一页');
          }
        },
      },
      {
        id: 'luoxing_keeper', name: '守炉人·祁', sprite: 'ninja_blue', tint: 0xd8d0c0, scale: 2.2,
        x: 44, y: 20, dir: 'down',
        lines: function () {
          if (LB.flag('furnaceLit')) return ['火又亮了。我只管看火，不管火替谁烧。', '旧炉膛里埋着半截锁器的模子，师傅不肯挖。'];
          return ['这炉火三十年没熄，今年熄了三次。', '守炉人守的不是火，是不让它烧错东西。', '你去问青芜，她比我记得清。'];
        },
        onTalk: function () { LB.flagSet('furnaceKeeperMet', true); },
      },
      {
        id: 'luoxing_doctor', name: '游医·柳娘', sprite: 'ninja_blue', tint: 0xe8f0e8, scale: 2.1,
        x: 28, y: 19, dir: 'down',
        lines: function () {
          return ['星砂入肺会咳，喝一碗清心散就好。', '落星原的风干，伤口结痂快，也裂得快。', '别把星屑当宝物，它先伤的是拾它的人。'];
        },
        onTalk: function () { LB.flagSet('luoxingDoctorMet', true); },
      },
    ],
    herbs: [],
    gathers: [
      { id: 'luoxing_g1', x: 38, y: 21, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g2', x: 45, y: 35, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'luoxing_g3', x: 48, y: 8, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g4', x: 34, y: 8, mat: 'xuantie', amount: 1, label: '拾得玄铁', respawn: 'chapter' },
      { id: 'luoxing_g5', x: 14, y: 36, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
      { id: 'luoxing_g6', x: 22, y: 40, mat: 'xingxie', amount: 1, label: '拾得星屑', respawn: 'weather' },
      { id: 'luoxing_g7', x: 56, y: 32, mat: 'tanzha', amount: 1, label: '拾得烬炭', respawn: 'weather' },
    ],
    chests: [
      { id: 'luoxing_chest1', name: '矿坑边箱', x: 26, y: 39, jade: 14, items: [{ id: 'xingxie', count: 1 }], label: '拾得旧锤与星屑 · 灵玉 14' },
      { id: 'luoxing_chest2', name: '风蚀木匣', x: 54, y: 40, jade: 12, items: [{ id: 'pill', count: 2 }], label: '拾得丹药 2 枚 · 灵玉 12' },
      { id: 'luoxing_chart1', name: '陨坑星图残片', x: 38, y: 6, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'starChart1', label: '拾得星图残片（一）· 灵玉 4' },
      { id: 'luoxing_chart2', name: '星泉星图残片', x: 52, y: 10, jade: 4, items: [{ id: 'charm', count: 1 }], flag: 'starChart2', label: '拾得星图残片（二）· 灵玉 4' },
      { id: 'luoxing_chart3', name: '沙地星图残片', x: 18, y: 33, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'starChart3', label: '拾得星图残片（三）· 灵玉 4' },
      { id: 'luoxing_letter', name: '风蚀信匣', x: 47, y: 40, jade: 6, items: [{ id: 'xingxie', count: 1 }], flag: 'starLetter', label: '拾得天工司旧信 · 灵玉 6' },
      { id: 'luoxing_chest3', name: '旧坊料箱', x: 44, y: 25, jade: 16, items: [{ id: 'xuantie', count: 1 }], gear: 'luoxing_seal', label: '拾得玄铁 1 块 · 星屑契印 · 灵玉 16' },
    ],
    props: [
      { type: 'altar', x: 31, y: 7 },
      { type: 'house', x: 19, y: 14, frame: 'house1' },
      { type: 'house', x: 27, y: 14, frame: 'house2' },
      { type: 'house', x: 19, y: 24, frame: 'house2' },
      { type: 'house', x: 28, y: 24, frame: 'house1' },
      { type: 'house', x: 48, y: 20, frame: 'house1' },
      { type: 'house', x: 54, y: 26, frame: 'house2' },
      { type: 'lantern', x: 20, y: 17 },
      { type: 'lantern', x: 32, y: 17 },
      { type: 'lantern', x: 44, y: 21 },
      { type: 'lantern', x: 52, y: 24 },
      { type: 'lantern', x: 24, y: 26 },
      { type: 'lantern', x: 50, y: 39 },
      { type: 'sign', x: 3, y: 21 },
      { type: 'sign', x: 30, y: 15 },
      { type: 'sign', x: 56, y: 21 },
      { type: 'well', x: 21, y: 20 },
      { type: 'stall', x: 33, y: 18 },
      { type: 'stall', x: 12, y: 19 },
      { type: 'ruin', x: 39, y: 6 },
      { type: 'ruin', x: 27, y: 31 },
      { type: 'ruin', x: 53, y: 37 },
    ],
    steles: [
      { id: 'luoxing_stele1', x: 45, y: 17, title: '天工司炉铭', text: '「器可载契，亦可夺契。匠人不问用途，用途自问匠人。」铭下有一道锤痕。', codex: 'tiangongsi' },
      { id: 'luoxing_stele2', x: 41, y: 12, title: '渊兽志残页', text: '「渊兽无契，非不愿，是不能。灵息被抽尽者，不复有名。」末字被凿平。', codex: 'yuanshou' },
      { id: 'luoxing_stele3', x: 25, y: 10, title: '观星台残碑', text: '「星落有轨，器成有价。轨可推，价不可推。」碑阴刻着一整幅星图，缺了三处。', codex: 'guanxingtai' },
      { id: 'luoxing_stele4', x: 25, y: 34, title: '星砂矿脉刻', text: '「星砂生于陨处，玄铁出于砂底。取砂者留三分，留与后来人。」', codex: 'kuangmai' },
      { id: 'luoxing_stele5', x: 55, y: 38, title: '风蚀驿路碑', text: '「驿路东去归墟，西回雾林。信不入风，人不入沙。」碑脚压着几封没寄出的旧信。', codex: 'fengshiyi' },
    ],
  });
