// 灵兽录 · 八境 · 第二境 · 雾深林密，药香引路
// 本境独立地貌、独立内容；尺寸与地标以此为唯一来源。
REGIONS.wuyin = makeRegion({
    id: 'wuyin', name: '雾隐林', chapter: 2, subtitle: '林深藏药，雾重无名',
    w: 76, h: 56, base: '.', spawn: { x: 4, y: 18 },
    fog: true, weather: 'fog', tint: '#eee9dd', timeTint: '#efeade',
    paint: function (m) {
      m.border('T', 2);
      // 雾泉与东侧水潭
      m.blob(68, 9, 4, 'W');
      m.rect(46, 7, 3, 2, 'W');
      // 南境雾潭与木栈道
      m.rect(24, 45, 38, 9, 'Z');
      m.blob(58, 47, 5, 'Z');
      m.rect(24, 44, 40, 2, 'b');
      m.rect(34, 42, 2, 12, 'b');
      // 林间空地：药圃、猎屋、旧渡
      m.rect(13, 23, 10, 9, '.');
      m.rect(6, 15, 8, 8, '.');
      m.rect(16, 14, 9, 8, '.');
      m.rect(44, 22, 14, 10, '.');
      m.rect(29, 31, 12, 10, '.');
      // 树海
      m.blob(8, 7, 4, 'T');
      m.blob(19, 6, 2, 'T');
      m.blob(41, 12, 3, 'T');
      m.blob(30, 21, 3, 'T');
      m.blob(62, 30, 4, 'T');
      m.blob(66, 43, 3, 'T');
      m.blob(50, 4, 3, 'T');
      m.blob(24, 12, 2, 'R');
      m.line(2, 18, 13, 18, ',');
      m.line(60, 18, 73, 18, ',');
      m.put(2, 18, 'E');
      m.put(73, 18, 'E');
    },
    exits: [
      { to: 'qingxi', x: 2, y: 18, need: null, label: '回青溪谷' },
      { to: 'luoxing', x: 73, y: 18, need: { chapter: 3 }, label: '出林 · 落星原' },
    ],
    pool: [
      { sp: 'youmu', lv: [5, 8] },
      { sp: 'qingheng', lv: [5, 7] },
      { sp: 'chaoxi', lv: [5, 7] },
      { sp: 'moyu', lv: [5, 6] },
      { sp: 'taiyi', lv: [5, 8] },
      { sp: 'ludeng', lv: [5, 8] },
    ],
    boss: 'wuyinxiao',
    npcs: [
      {
        id: 'aheng', name: '采药人阿蘅', sprite: 'ninja_blue', tint: 0xd8f0d8, scale: 2.6,
        x: 17, y: 19, dir: 'down', mark: 'main',
        lines: function () {
          if (LB.flag('formulaKept')) return ['学徒把方子背下来了。你再来，我煎新茶。', '方子留在药庐，比留在账本上暖。'];
          if (LB.flag('formulaSold')) return ['方子卖了。药庐还在，只是冬天得关门。', '你若要药，趁天还没冷。'];
          if (LB.flag('wuyinAhengDone')) return ['三煎都收了。第一煎给雾，第二煎给泉，第三煎给你。', '药庐的门我不锁了，你随时来取。', '往东出林去落星原，天工司的炉子还亮着。'];
          if (!LB.flag('boss_wuyinxiao')) return ['嘘——别踩那片苔。', '雾隐魈把林子的灵息锁住了，我的药圃里只剩三株露生草还能采。', '帮我采齐三株，我告诉你它在哪儿。'];
          return ['雾散了。你看，草叶上的露又回来了。', '锁灵术的痕迹留在树皮上，像被抽走名字的掌印。', '回来坐下，我把雾泉三煎收完。'];
        },
        onTalk: function () {
          LB.flagSet('herbalistMet', true);
          if (LB.flag('talked_aheng') && LB.flag('boss_wuyinxiao') && !LB.flag('wuyinAhengDone')) {
            LB.flagSet('wuyinAhengDone', true);
            LB.toast('雾泉三煎已成 · 阿蘅把药庐钥匙交给你');
          }
        },
      },
      {
        id: 'apprentice', name: '药庐学徒', sprite: 'samurai_green', tint: 0xd8f0d8, scale: 2.2,
        x: 10, y: 27, dir: 'right',
        lines: function () {
          if (LB.flag('wuyinGrannyDone')) return ['婆婆把三畦药草都救活了。', '她说雾里也能种药，只要有人肯等露水。'];
          return ['师门说，锁住的灵息也能用草叶一寸寸化开。', '我采了三年药，只学会分辨露水的新旧。', '东边药圃的婆婆脾气怪，但她的方子是真的。'];
        },
      },
      {
        id: 'wuyin_hunter', name: '猎户·石叔', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.3,
        x: 51, y: 25, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('wuyinHuntDone')) return ['三道猎迹都收齐了。雾里的东西，也有自己的路。', '往南是雾潭。渡夫欠我一坛酒，你替我讨。'];
          if (LB.flag('huntMark1') && LB.flag('huntMark2') && LB.flag('huntMark3')) return ['三道猎迹你全找到了？好眼力。', '把拓片给我，我认一认这林子里的脚印。'];
          if (LB.flag('wuyinHunterMet')) return ['猎迹不是兽印，是被雾抹掉的人走过的痕迹。', '东边石上、泉边树上、南坡石缝里，各有一处。'];
          return ['这林子我走了二十年，今年雾比往年重。', '雾里有人走过，脚印到一半就断了。', '替我找三处猎迹，我告诉你雾隐魈的习性。'];
        },
        onTalk: function () {
          LB.flagSet('wuyinHunterMet', true);
          if (LB.flag('huntMark1') && LB.flag('huntMark2') && LB.flag('huntMark3') && !LB.flag('wuyinHuntDone')) {
            LB.flagSet('wuyinHuntDone', true);
            LB.toast('猎迹已辨 · 石叔教你雾中辨位');
          }
        },
      },
      {
        id: 'wuyin_granny', name: '药农·婆婆', sprite: 'samurai_green', tint: 0xe8f0d8, scale: 2.1,
        x: 48, y: 11, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('wuyinGrannyDone')) return ['三畦药草都活了。雾再重，也有药香。', '阿蘅那孩子，把方子看得比命重。'];
          if (LB.flag('wuyinGrannyMet')) {
            if (LB.matCount('lucao') >= 3) return ['露生草带来了？摊在石台上，我看看露水。', '（她把草叶一一翻过，慢慢点头。）够了。'];
            return ['药圃里还缺三株露生草，长在雾薄的地方。', '别拔根。根在，下一场雨还会长。'];
          }
          return ['药圃三畦，今年只活了一畦。', '雾把灵气锁住，草就不肯抽叶。', '你若有露生草，匀我三株；我拿清心散换。'];
        },
        onTalk: function () {
          LB.flagSet('wuyinGrannyMet', true);
          if (!LB.flag('wuyinGrannyDone') && LB.matCount('lucao') >= 3) {
            LB.consumeMaterial('lucao', 3);
            LB.giveItem('cleanse', 1);
            LB.flagSet('wuyinGrannyDone', true);
            LB.toast('婆婆收下露生草 · 清心散 +1');
          }
        },
      },
      {
        id: 'wuyin_ferry', name: '渡夫·老渡', sprite: 'ninja_blue', tint: 0xcfe0e8, scale: 2.3,
        x: 36, y: 39, dir: 'down', mark: 'side',
        lines: function () {
          if (LB.flag('ferryFixed')) return ['渡口修好了，雾潭上也敢行船了。', '潭底沉着旧契，水浅时能看见。'];
          if (LB.flag('ferryOar')) return ['桨找回来了？灵木也够？', '有力气就帮我把渡桩重新扎一遍。'];
          if (LB.flag('ferryMet')) return ['船桨被水冲到潭西去了。', '灵木备两根，我就能把渡桩扎稳。'];
          return ['雾潭旧渡三十年没人走了。', '船还在，桨没了。', '你要过潭？先替我把桨找回来。'];
        },
        onTalk: function () {
          LB.flagSet('ferryMet', true);
          if (!LB.flag('ferryFixed') && LB.flag('ferryOar') && LB.matCount('lingmu') >= 2) {
            LB.consumeMaterial('lingmu', 2);
            LB.flagSet('ferryFixed', true);
            LB.toast('雾潭旧渡已修 · 渡桩重新扎稳');
          }
        },
      },
      {
        id: 'wuyin_child', name: '迷路小童', sprite: 'ninja_blue', tint: 0xffd8b0, scale: 1.9,
        x: 27, y: 35, dir: 'down',
        lines: function () {
          if (LB.flag('childHome')) return ['三块木牌都挂回去了。娘的名字，我记住了。', '雾再大，我也认得回家的路。'];
          if (LB.flag('nameTag1') && LB.flag('nameTag2') && LB.flag('nameTag3')) return ['木牌都找到了？', '（他把木牌一块块抱在怀里。）这是我家门上的。'];
          if (LB.flag('lostChildMet')) return ['我家的门牌被风吹散了，三块。', '一块在南坡草里，一块在潭边石下，一块在旧渡板缝里。'];
          return ['我和娘走散了。', '雾里什么都一样，只有门牌上的字不一样。', '三块木牌……你能帮我找回来吗？'];
        },
        onTalk: function () {
          LB.flagSet('lostChildMet', true);
          if (LB.flag('nameTag1') && LB.flag('nameTag2') && LB.flag('nameTag3') && !LB.flag('childHome')) {
            LB.flagSet('childHome', true);
            LB.toast('木牌归位 · 小童认得了回家的路');
          }
        },
      },
      {
        id: 'wuyin_wood', name: '樵夫·阿木', sprite: 'samurai_green', tint: 0xd8c8a8, scale: 2.2,
        x: 55, y: 28, dir: 'down',
        lines: function () {
          if (LB.flag('woodCleared')) return ['倒木清开了，林子里的风也顺了。', '雾松的木头沉，烧起来却香。'];
          if (LB.flag('woodcutterMet')) return ['倒木压住了半条山道。', '灵木四块，我就能把支架打起来。'];
          return ['雾松倒了三棵，把东边的路压住了。', '我一个人搬不动。', '你带四块灵木来，我教你认雾松的年轮。'];
        },
        onTalk: function () {
          LB.flagSet('woodcutterMet', true);
          if (!LB.flag('woodCleared') && LB.matCount('lingmu') >= 4) {
            LB.consumeMaterial('lingmu', 4);
            LB.flagSet('woodCleared', true);
            LB.toast('倒木已清 · 东边山道通了');
          }
        },
      },
      {
        id: 'wuyin_rubbing', name: '拓碑人·柳先生', sprite: 'ninja_blue', tint: 0xe0dcd0, scale: 2.2,
        x: 43, y: 34, dir: 'down',
        lines: function () {
          if (LB.flag('wuyinRubbingMet')) return ['旧渡那碑字浅，拓的时候手要稳。', '雾泉边的刻痕是新的，像有人刚刻上去。'];
          return ['我替山门拓碑，拓到雾隐林就不敢再往里。', '这林子的碑会换位置，今天在东，明天在南。', '你若见着碑，替我读一读。'];
        },
        onTalk: function () { LB.flagSet('wuyinRubbingMet', true); },
      },
    ],
    herbs: [
      { id: 'herb1', x: 9, y: 28, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'herb2', x: 12, y: 26, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'herb3', x: 15, y: 29, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb4', x: 50, y: 9, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb5', x: 46, y: 11, mat: 'lucao', amount: 1, label: '采得露生草' },
      { id: 'wuyin_herb6', x: 29, y: 37, mat: 'lucao', amount: 1, label: '采得露生草' },
    ],
    gathers: [
      { id: 'wuyin_g1', x: 26, y: 24, mat: 'lingmu', amount: 2, label: '拾得灵木 2 块', respawn: 'chapter' },
      { id: 'wuyin_g2', x: 36, y: 21, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g3', x: 48, y: 16, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g4', x: 57, y: 20, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'wuyin_g5', x: 34, y: 42, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
      { id: 'wuyin_g6', x: 31, y: 35, mat: 'lingmu', amount: 1, label: '拾得灵木', respawn: 'chapter' },
      { id: 'wuyin_g7', x: 54, y: 33, mat: 'lucao', amount: 2, label: '采得露生草 2 株', respawn: 'chapter' },
    ],
    chests: [
      { id: 'wuyin_chest1', name: '药庐旧箱', x: 6, y: 24, jade: 10, items: [{ id: 'pill', count: 2 }], label: '拾得丹药 2 枚 · 灵玉 10' },
      { id: 'wuyin_chest2', name: '雾中木匣', x: 45, y: 22, jade: 12, items: [{ id: 'cleanse', count: 1 }], gear: 'wuyin_talisman', label: '拾得清心散 1 包 · 药庐护符 · 灵玉 12' },
      { id: 'wuyin_hunt1', name: '石上的猎迹', x: 47, y: 20, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'huntMark1', label: '拓下猎迹（一）· 灵玉 4' },
      { id: 'wuyin_hunt2', name: '树上的猎迹', x: 57, y: 9, jade: 4, items: [{ id: 'charm', count: 1 }], flag: 'huntMark2', label: '拓下猎迹（二）· 灵玉 4' },
      { id: 'wuyin_hunt3', name: '石缝里的猎迹', x: 56, y: 29, jade: 4, items: [{ id: 'pill', count: 1 }], flag: 'huntMark3', label: '拓下猎迹（三）· 灵玉 4' },
      { id: 'wuyin_tag1', name: '草里的木牌', x: 18, y: 36, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag1', label: '拾得木牌 · 刻着半个「娘」字' },
      { id: 'wuyin_tag2', name: '潭边的木牌', x: 34, y: 40, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag2', label: '拾得木牌 · 边角被水泡软' },
      { id: 'wuyin_tag3', name: '渡板下的木牌', x: 41, y: 41, jade: 2, items: [{ id: 'pill', count: 1 }], flag: 'nameTag3', label: '拾得木牌 · 背面有小小的契印' },
      { id: 'wuyin_oar', name: '雾潭渡桨', x: 35, y: 42, jade: 6, items: [{ id: 'charm', count: 1 }], flag: 'ferryOar', label: '拾得旧渡桨 · 灵玉 6' },
    ],
    props: [
      { type: 'altar', x: 30, y: 5 },
      { type: 'house', x: 4, y: 28, frame: 'house2' },
      { type: 'house', x: 52, y: 23, frame: 'house1' },
      { type: 'house', x: 46, y: 9, frame: 'house2' },
      { type: 'lantern', x: 16, y: 13 },
      { type: 'lantern', x: 32, y: 17 },
      { type: 'lantern', x: 50, y: 12 },
      { type: 'lantern', x: 50, y: 26 },
      { type: 'lantern', x: 36, y: 38 },
      { type: 'lantern', x: 24, y: 37 },
      { type: 'sign', x: 3, y: 19 },
      { type: 'sign', x: 49, y: 18 },
      { type: 'sign', x: 33, y: 32 },
      { type: 'well', x: 14, y: 15 },
      { type: 'ruin', x: 42, y: 14 },
      { type: 'ruin', x: 44, y: 39 },
      { type: 'stall', x: 55, y: 19 },
      { type: 'dock', x: 33, y: 40 },
      // 药庐前场
      { type: 'jars', x: 14, y: 18 },
      { type: 'censer', x: 20, y: 17 },
      { type: 'offering', x: 22, y: 18 },
      { type: 'sweep', x: 13, y: 20 },
      { type: 'wish', x: 24, y: 17 },
    ],
    steles: [
      { id: 'wuyin_stele1', x: 22, y: 16, title: '断契旧刻', text: '「三十年前，十二门同铸锁器。灵脉逆流，渊兽自裂谷出。」刻到这里，石面焦黑。', codex: 'duanqi' },
      { id: 'wuyin_stele2', x: 24, y: 8, title: '药庐植草录', text: '「露生草生于雾薄处，叶上有露者活，无露者已被锁。」旁有小字：勿拔根。', codex: 'wuyinyaolu' },
      { id: 'wuyin_stele3', x: 51, y: 9, title: '雾泉旧刻', text: '「泉自石心出，雾自泉心起。饮泉者忘归，故以石栏围之。」石栏早已塌了。', codex: 'wuyin_quan' },
      { id: 'wuyin_stele4', x: 41, y: 35, title: '旧渡残碑', text: '「渡口不渡生人，只渡旧契。契断则舟沉，故舟底压着半段契绳。」', codex: 'wuyin_du' },
      { id: 'wuyin_stele5', x: 53, y: 26, title: '猎户刻木', text: '木牌上刻着二十几个名字，每道刻痕旁都有一个小小的兽爪印。最末一处新刻：石叔。', codex: 'wuyin_lie' },
    ],
  });
