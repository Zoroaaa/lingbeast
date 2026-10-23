// 灵兽录 · 数据层 · 主线、支线与悬赏
// ---------- 主线八章 ----------
const MAIN_CHAPTERS = [
  {
    id: 'ch1', chapter: 1, title: '谷口问灵', region: 'qingxi',
    summary: '入青溪谷，问守谷老丈山中异动，过守谷灵一关，山门认主。',
    objectives: [
      { type: 'talk', key: 'valley_elder', text: '与守谷老丈交谈' },
      { type: 'boss', key: 'shougu', text: '击败守谷灵' },
    ],
    onComplete: function () { LB.flagSet('shanmenOpened', true); },
  },
  {
    id: 'ch2', chapter: 2, title: '雾隐采药', region: 'wuyin',
    summary: '入雾隐林，替阿蘅采齐露生草，击败雾隐魈，查见锁灵术的痕迹。',
    objectives: [
      { type: 'talk', key: 'aheng', text: '在雾隐林找到采药人阿蘅' },
      { type: 'item', key: 'lucao', count: 3, text: '采集露生草 3 株' },
      { type: 'boss', key: 'wuyinxiao', text: '击败雾隐魈' },
    ],
  },
  {
    id: 'ch3', chapter: 3, title: '星落铸灵', region: 'luoxing',
    summary: '上落星原，寻天工司残部，击败星陨傀，取得锁灵器碎片。',
    objectives: [
      { type: 'region', key: 'luoxing', text: '登上落星原' },
      { type: 'talk', key: 'zhuling', text: '寻访天工司铸灵师' },
      { type: 'flag', key: 'lockShard', text: '取得锁灵器碎片' },
      { type: 'boss', key: 'xingyun', text: '击败星陨傀' },
    ],
  },
  {
    id: 'ch4', chapter: 4, title: '归墟问价', region: 'guixu',
    summary: '入归墟海市，与海市主交易，拼出断契之乱的真相。',
    objectives: [
      { type: 'region', key: 'guixu', text: '抵达归墟海市' },
      { type: 'talk', key: 'haishi', text: '与海市主对价' },
      { type: 'flag', key: 'debtPaid', text: '偿清海市旧账' },
      { type: 'boss', key: 'suolingjiao', text: '击退锁灵鲛' },
    ],
  },
  {
    id: 'ch5', chapter: 5, title: '云梦照心', region: 'yunmeng',
    summary: '穿云梦泽，破蜃母幻境，面对「契是否只是奴役」的质问。',
    objectives: [
      { type: 'region', key: 'yunmeng', text: '穿过云梦泽' },
      { type: 'flag', key: 'mirageBroken', text: '破蜃母幻境' },
      { type: 'boss', key: 'shenmu', text: '击败蜃母' },
    ],
  },
  {
    id: 'ch6', chapter: 6, title: '赤渊解契', region: 'gutan',
    summary: '登断崖古坛，击败赤渊兽，唤醒旧山主无咎的残魂。',
    objectives: [
      { type: 'region', key: 'gutan', text: '登断崖古坛' },
      { type: 'boss', key: 'chiyuan', text: '击败赤渊兽' },
      { type: 'talk', key: 'yimin', text: '听赤渊遗民讲述旧事' },
    ],
    onComplete: function () { LB.flagSet('wujiuAwake', true); },
  },
  {
    id: 'ch7', chapter: 7, title: '归墟断锁', region: 'shenyuan',
    summary: '入归墟深处，击败无相，决定新契或断契。',
    objectives: [
      { type: 'region', key: 'shenyuan', text: '入归墟深处' },
      { type: 'boss', key: 'wuxiang', text: '击败无相' },
      { type: 'flag', key: 'ending', text: '择定新契或断契' },
    ],
  },
  {
    id: 'ch8', chapter: 8, title: '山门重开', region: 'shanmen',
    summary: '回山门，扫阶点灯，立新契；山海试炼与全图鉴补完此后开放。',
    objectives: [
      { type: 'talk', key: 'gate_elder', text: '回山门与老丈交谈' },
      { type: 'count', key: 'sideQuests', count: 8, text: '完成支线 8 条' },
      { type: 'count', key: 'steles', count: 6, text: '解开碑文 6 处' },
      { type: 'flag', key: 'ending', text: '择定新契或断契' },
    ],
    onComplete: function () { LB.flagSet('endingDone', true); },
  },
];

// ---------- 支线 ----------
// check 载入时不执行；reward 由主控在完成时调用
const SIDE_QUESTS = [
  {
    id: 'catch2', title: '结契之始', giver: { region: 'shanmen', npc: 'gate_elder' },
    desc: '收服任意 2 只灵兽', unlockChapter: 1,
    steps: ['在野外击败并结契灵兽', '队伍或灵兽栏中有 2 只灵契'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.stats && s.stats.catches >= 2);
    },
    reward: function () { LB.giveJade(8); LB.giveItem('charm', 2); return '灵玉 +8 · 灵符 +2'; },
  },
  {
    id: 'basket', title: '老丈的药篓', giver: { region: 'qingxi', npc: 'valley_elder' },
    desc: '在青溪谷找回老丈遗落的药篓', unlockChapter: 1,
    steps: ['在青溪谷南边找到药篓', '把药篓带回山门'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.basket);
    },
    reward: function () { LB.giveJade(6); LB.giveItem('pill', 2); return '灵玉 +6 · 丹药 +2'; },
  },
  {
    id: 'child', title: '溪上纸船', giver: { region: 'qingxi', npc: 'valley_child' },
    desc: '替溪边小童找回三只写着名字的纸船', unlockChapter: 1,
    stages: [
      { text: '听小童说纸船的来历', flag: 'childSong' },
      { text: '沿溪找回 3 只纸船', check: function () { return !!(LB.flag('boat1') && LB.flag('boat2') && LB.flag('boat3')); } },
      { text: '把纸船还给小童', flag: 'childBoats' },
    ],
    reward: function () { LB.giveJade(10); LB.giveMaterial('lingmu', 2); return '灵玉 +10 · 灵木 +2'; },
  },
  {
    id: 'qingxi_elder', title: '守谷旧事', giver: { region: 'qingxi', npc: 'valley_elder' },
    desc: '击败守谷灵，读完谷口旧碑，再听老丈把话说完', unlockChapter: 1,
    stages: [
      { text: '击败谷口守谷灵', check: function () { return !!LB.flag('boss_shougu'); } },
      { text: '读罢谷口两处旧碑', check: function () {
        var s = LB.saveState();
        return !!(s && s.steles && s.steles.qingxi_stele1 && s.steles.qingxi_stele2);
      } },
      { text: '与守谷老丈谈旧事', flag: 'elderTruth' },
    ],
    reward: function () { LB.giveJade(12); LB.giveItem('pill', 2); return '灵玉 +12 · 丹药 +2'; },
  },

  {
    id: 'qingxi_bridge', title: '断桥旧契', giver: { region: 'qingxi', npc: 'bridge_keeper' },
    desc: '替守桥人备料，修好通往溪东旧祠的木桥', unlockChapter: 1,
    stages: [
      { text: '与守桥人交谈', flag: 'bridgeMet' },
      { text: '备齐灵木 3、露生草 2', check: function () { return !!LB.flag('bridgeFixed') || (LB.matCount('lingmu') >= 3 && LB.matCount('lucao') >= 2); } },
      { text: '修好断桥', flag: 'bridgeFixed' },
    ],
    reward: function () { LB.giveJade(10); LB.giveMaterial('lingmu', 2); return '灵玉 +10 · 灵木 +2'; },
  },

  {
    id: 'wuyin_hunter', title: '雾猎三迹', giver: { region: 'wuyin', npc: 'wuyin_hunter' },
    desc: '替猎户石叔找回三道被雾抹掉的猎迹', unlockChapter: 2,
    stages: [
      { text: '在东侧猎屋与石叔交谈', flag: 'wuyinHunterMet' },
      { text: '拓下东石、泉树、南坡三处猎迹', check: function () {
        return !!(LB.flag('huntMark1') && LB.flag('huntMark2') && LB.flag('huntMark3'));
      } },
      { text: '把猎迹交给石叔辨认', flag: 'wuyinHuntDone' },
    ],
    reward: function () { LB.giveJade(12); LB.giveItem('charm', 2); return '灵玉 +12 · 灵符 +2'; },
  },
  {
    id: 'wuyin_granny', title: '药圃三畦', giver: { region: 'wuyin', npc: 'wuyin_granny' },
    desc: '替东侧药圃的婆婆采齐露生草，救活余下两畦', unlockChapter: 2,
    stages: [
      { text: '在雾泉药圃找到婆婆', flag: 'wuyinGrannyMet' },
      { text: '采得露生草 3 株', check: function () { return !!LB.flag('wuyinGrannyDone') || LB.matCount('lucao') >= 3; } },
      { text: '把露生草交给婆婆', flag: 'wuyinGrannyDone' },
    ],
    reward: function () { LB.giveJade(10); LB.giveItem('cleanse', 2); return '灵玉 +10 · 清心散 +2'; },
  },
  {
    id: 'wuyin_ferry', title: '雾潭旧渡', giver: { region: 'wuyin', npc: 'wuyin_ferry' },
    desc: '替渡夫找回渡桨，扎稳三十年的旧渡桩', unlockChapter: 2,
    stages: [
      { text: '在南侧雾潭找到渡夫', flag: 'ferryMet' },
      { text: '找回被水冲走的渡桨', flag: 'ferryOar' },
      { text: '备灵木 2 块，修好渡口', flag: 'ferryFixed' },
    ],
    reward: function () { LB.giveJade(12); LB.giveMaterial('lingmu', 2); return '灵玉 +12 · 灵木 +2'; },
  },
  {
    id: 'wuyin_child', title: '雾中寻童', giver: { region: 'wuyin', npc: 'wuyin_child' },
    desc: '替迷路小童找回三块写着家名的木牌', unlockChapter: 2,
    stages: [
      { text: '听小童说木牌的来历', flag: 'lostChildMet' },
      { text: '找回南坡、潭边、渡板下三块木牌', check: function () {
        return !!(LB.flag('nameTag1') && LB.flag('nameTag2') && LB.flag('nameTag3'));
      } },
      { text: '把木牌还给小童', flag: 'childHome' },
    ],
    reward: function () { LB.giveJade(10); LB.giveItem('pill', 2); return '灵玉 +10 · 丹药 +2'; },
  },
  {
    id: 'wuyin_wood', title: '雾松倒木', giver: { region: 'wuyin', npc: 'wuyin_wood' },
    desc: '替樵夫清开压住东侧山道的雾松倒木', unlockChapter: 2,
    stages: [
      { text: '与东林的樵夫阿木交谈', flag: 'woodcutterMet' },
      { text: '备齐灵木 4 块', check: function () { return !!LB.flag('woodCleared') || LB.matCount('lingmu') >= 4; } },
      { text: '搭起支架，清开倒木', flag: 'woodCleared' },
    ],
    reward: function () { LB.giveJade(12); LB.giveMaterial('lingmu', 3); return '灵玉 +12 · 灵木 +3'; },
  },
  {
    id: 'wuyin_aheng', title: '雾泉三煎', giver: { region: 'wuyin', npc: 'aheng' },
    desc: '替阿蘅守着雾泉煎完三味药，等雾散透', unlockChapter: 2,
    stages: [
      { text: '在雾泉药庐与阿蘅交谈', flag: 'herbalistMet' },
      { text: '击败雾隐魈，让雾泉重新见光', check: function () { return !!LB.flag('boss_wuyinxiao'); } },
      { text: '回药庐，看阿蘅收下第三煎', flag: 'wuyinAhengDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveItem('great_pill', 1); return '灵玉 +14 · 大还丹 +1'; },
  },
  {
    id: 'luoxing_chart', title: '星图三漏', giver: { region: 'luoxing', npc: 'luoxing_stargazer' },
    desc: '替观星台的裴照找回三片被星陨震碎的旧星图', unlockChapter: 3,
    stages: [
      { text: '在观星台与裴照交谈', flag: 'stargazerMet' },
      { text: '找回陨坑、星泉、沙地三片星图残片', check: function () {
        return !!(LB.flag('starChart1') && LB.flag('starChart2') && LB.flag('starChart3'));
      } },
      { text: '把残片交给裴照拼合', flag: 'starChartDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveMaterial('xingxie', 2); return '灵玉 +14 · 星屑 +2'; },
  },
  {
    id: 'luoxing_mine', title: '矿道三岔', giver: { region: 'luoxing', npc: 'miner' },
    desc: '替矿工老石备料，支稳星砂矿坑的三处塌口', unlockChapter: 3,
    stages: [
      { text: '在矿坑口与老石交谈', flag: 'minerMet' },
      { text: '备齐灵木 3、玄铁 2', check: function () {
        return !!LB.flag('mineCleared') || (LB.matCount('lingmu') >= 3 && LB.matCount('xuantie') >= 2);
      } },
      { text: '支起三副支架，重开矿道', flag: 'mineCleared' },
    ],
    reward: function () { LB.giveJade(12); LB.giveMaterial('xuantie', 2); return '灵玉 +12 · 玄铁 +2'; },
  },



  {
    id: 'guixu_ledger', title: '潮汐三账', giver: { region: 'guixu', npc: 'guixu_ledger' },
    desc: '替海市账房找回被潮水卷走的三页旧账', unlockChapter: 4,
    stages: [
      { text: '在栈桥账房与算盘交谈', flag: 'guixuLedgerMet' },
      { text: '找回盐田、沉船、暗仓三页旧账', check: function () {
        return !!(LB.flag('ledger1') && LB.flag('ledger2') && LB.flag('ledger3'));
      } },
      { text: '把三页账交还账房先生', flag: 'ledgerDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveItem('incense', 1); return '灵玉 +14 · 引灵香 +1'; },
  },
  {
    id: 'guixu_salt', title: '盐田三畦', giver: { region: 'guixu', npc: 'guixu_salter' },
    desc: '替盐工阿咸收齐三份海盐，救回荒了的盐田', unlockChapter: 4,
    stages: [
      { text: '在北侧盐田与阿咸交谈', flag: 'guixuSalterMet' },
      { text: '备齐海盐 3 份', check: function () { return !!LB.flag('saltDone') || LB.matCount('haiyan') >= 3; } },
      { text: '把海盐交给阿咸', flag: 'saltDone' },
    ],
    reward: function () { LB.giveJade(10); LB.giveItem('pill', 2); return '灵玉 +10 · 丹药 +2'; },
  },
  {
    id: 'guixu_wreck', title: '沉船三舱', giver: { region: 'guixu', npc: 'guixu_shipwright' },
    desc: '替船匠老柯拆回龙骨舵叶，修起搁浅三十年的旧渡船', unlockChapter: 4,
    stages: [
      { text: '在东侧沉船坞与老柯交谈', flag: 'guixuShipMet' },
      { text: '找回龙骨、舵叶，备玄铁 2 块', check: function () {
        return !!LB.flag('wreckFixed') || (!!LB.flag('salvage1') && !!LB.flag('salvage2') && LB.matCount('xuantie') >= 2);
      } },
      { text: '把船材交给老柯，看船重下水', flag: 'wreckFixed' },
    ],
    reward: function () { LB.giveJade(14); LB.giveMaterial('xuantie', 2); return '灵玉 +14 · 玄铁 +2'; },
  },
  {
    id: 'guixu_song', title: '鲛歌三阕', giver: { region: 'guixu', npc: 'guixu_merfolk' },
    desc: '替鲛人遗属珠娘读全散落在海市的三块鲛歌石刻', unlockChapter: 4,
    stages: [
      { text: '在南岸鲛人礁与珠娘交谈', flag: 'guixuMerMet' },
      { text: '读全盐田、沉船坞、礁石三块石刻', check: function () {
        var s = LB.saveState();
        return !!(s && s.steles && s.steles.guixu_stele3 && s.steles.guixu_stele4 && s.steles.guixu_stele5);
      } },
      { text: '回礁石边听珠娘唱完最后一句', flag: 'songDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveMaterial('shensha', 2); return '灵玉 +14 · 蜃砂 +2'; },
  },
  {
    id: 'guixu_questions', title: '海市三问', giver: { region: 'guixu', npc: 'guixu_storyteller' },
    desc: '替说书人柳三弦问遍海市主、船匠与鲛人遗属', unlockChapter: 4,
    stages: [
      { text: '在栈桥听说书人开场', flag: 'guixuStoryMet' },
      { text: '问过海市主、船匠、鲛人遗属', check: function () {
        return !!(LB.flag('talked_haishi') && LB.flag('talked_guixu_shipwright') && LB.flag('talked_guixu_merfolk'));
      } },
      { text: '回栈桥听柳三弦收弦', flag: 'questionsDone' },
    ],
    reward: function () { LB.giveJade(12); LB.giveItem('charm', 2); return '灵玉 +12 · 灵符 +2'; },
  },
  {
    id: 'yunmeng_boat', title: '渡舟三桨', giver: { region: 'yunmeng', npc: 'yunmeng_boatman' },
    desc: '替旧渡的渡舟人找回被雾冲散的三支渡桨', unlockChapter: 5,
    stages: [
      { text: '在南岸旧渡与老渡交谈', flag: 'yunmengBoatMet' },
      { text: '找回南滩、旧渡、礁边三支渡桨', check: function () {
        return !!(LB.flag('boatOar1') && LB.flag('boatOar2') && LB.flag('boatOar3'));
      } },
      { text: '把三支渡桨插回渡架', flag: 'boatFixed' },
    ],
    reward: function () { LB.giveJade(16); LB.giveMaterial('lingmu', 2); return '灵玉 +16 · 灵木 +2'; },
  },
  {
    id: 'yunmeng_reed', title: '芦荡三束', giver: { region: 'yunmeng', npc: 'yunmeng_reed' },
    desc: '替芦姑采齐三束带露的露生草，救回被雾泡烂的药田', unlockChapter: 5,
    stages: [
      { text: '在南岸芦荡与芦姑交谈', flag: 'yunmengReedMet' },
      { text: '采得露生草 3 株', check: function () { return !!LB.flag('reedDone') || LB.matCount('lucao') >= 3; } },
      { text: '把露生草交给芦姑', flag: 'reedDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveItem('cleanse', 3); return '灵玉 +14 · 清心散 +3'; },
  },
  {
    id: 'yunmeng_mirror', title: '泽镜三问', giver: { region: 'yunmeng', npc: 'yunmeng_mirror' },
    desc: '替守镜人镜叟读全散在泽上的三面旧镜', unlockChapter: 5,
    stages: [
      { text: '在蜃楼台下与镜叟交谈', flag: 'yunmengMirrorMet' },
      { text: '读全渡口、楼台、泽心三面镜文', check: function () {
        var s = LB.saveState();
        return !!(s && s.steles && s.steles.yunmeng_stele3 && s.steles.yunmeng_stele4 && s.steles.yunmeng_stele5);
      } },
      { text: '回楼台下听镜叟说完', flag: 'mirrorDone' },
    ],
    reward: function () { LB.giveJade(16); LB.giveMaterial('shensha', 2); return '灵玉 +16 · 蜃砂 +2'; },
  },
  {
    id: 'yunmeng_girl', title: '雾中三唤', giver: { region: 'yunmeng', npc: 'yunmeng_girl' },
    desc: '替阿沅向渔人、陶翁、渡舟人问遍她爹的下落', unlockChapter: 5,
    stages: [
      { text: '在东汀与阿沅交谈', flag: 'yunmengGirlMet' },
      { text: '问过渔人、陶翁、渡舟人', check: function () {
        return !!(LB.flag('talked_fisher') && LB.flag('talked_yunmeng_hermit') && LB.flag('talked_yunmeng_boatman'));
      } },
      { text: '回东汀把回话告诉阿沅', flag: 'girlDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveItem('pill', 3); return '灵玉 +14 · 丹药 +3'; },
  },
  {
    id: 'yunmeng_ember', title: '泽火三夜', giver: { region: 'yunmeng', npc: 'yunmeng_hermit' },
    desc: '替泽畔陶翁凑齐三捧蜃砂，点亮泽心的旧灯', unlockChapter: 5,
    stages: [
      { text: '在南坡与陶翁交谈', flag: 'yunmengHermitMet' },
      { text: '备齐蜃砂 3 捧', check: function () { return !!LB.flag('hermitDone') || LB.matCount('shensha') >= 3; } },
      { text: '把蜃砂撒进灯膛', flag: 'hermitDone' },
    ],
    reward: function () { LB.giveJade(16); LB.giveItem('incense', 1); return '灵玉 +16 · 引灵香 +1'; },
  },
  {
    id: 'yunmeng_warden', title: '泽界三桩', giver: { region: 'yunmeng', npc: 'yunmeng_warden' },
    desc: '替巡泽人阿戗备料，在雾线重立三根界桩', unlockChapter: 5,
    stages: [
      { text: '在东岸与巡泽人阿戗交谈', flag: 'wardenMet' },
      { text: '备齐灵木 3 根', check: function () { return !!LB.flag('yunmengStakesDone') || LB.matCount('lingmu') >= 3; } },
      { text: '与阿戗一同把三桩立回雾线', flag: 'yunmengStakesDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveMaterial('lingmu', 2); return '灵玉 +14 · 灵木 +2'; },
  },
  {
    id: 'yunmeng_mirage', title: '蜃影三问', giver: { region: 'yunmeng', npc: 'mirage' },
    desc: '蜃影要你问过泽上渔人、镜叟、巡泽人，才肯答你一问', unlockChapter: 5,
    stages: [
      { text: '在蜃楼台下与蜃影照面', flag: 'talked_mirage' },
      { text: '问过渔人、镜叟、巡泽人', check: function () {
        return !!(LB.flag('talked_fisher') && LB.flag('talked_yunmeng_mirror') && LB.flag('talked_yunmeng_warden'));
      } },
      { text: '回蜃楼台下，听蜃影答你一问', flag: 'mirageDone' },
    ],
    reward: function () { LB.giveJade(18); LB.giveMaterial('shensha', 3); return '灵玉 +18 · 蜃砂 +3'; },
  },
  {
    id: 'gutan_ember', title: '火种三捧', giver: { region: 'gutan', npc: 'gutan_keeper' },
    desc: '替守坛人赤眉收齐散在东渊、南窑、北坛的三捧火种', unlockChapter: 6,
    stages: [
      { text: '在古坛下与赤眉交谈', flag: 'gutanKeeperMet' },
      { text: '收齐东渊、南窑、北坛三捧火种', check: function () {
        return !!(LB.flag('ember1') && LB.flag('ember2') && LB.flag('ember3'));
      } },
      { text: '把火种捧回坛口', flag: 'emberDone' },
    ],
    reward: function () { LB.giveJade(18); LB.giveMaterial('tanzha', 3); return '灵玉 +18 · 烬炭 +3'; },
  },
  {
    id: 'gutan_names', title: '残榜三录', giver: { region: 'gutan', npc: 'gutan_scribe' },
    desc: '替记名者史灰读全火记、残榜、迁民录三块碑', unlockChapter: 6,
    stages: [
      { text: '在东窑与史灰交谈', flag: 'gutanScribeMet' },
      { text: '读全赤渊火记、山门残榜、迁民录', check: function () {
        var s = LB.saveState();
        return !!(s && s.steles && s.steles.gutan_stele3 && s.steles.gutan_stele4 && s.steles.gutan_stele5);
      } },
      { text: '回东窑让史灰落笔', flag: 'namesDone' },
    ],
    reward: function () { LB.giveJade(18); LB.giveItem('charm', 2); return '灵玉 +18 · 灵符 +2'; },
  },
  {
    id: 'gutan_forge', title: '炉火三淬', giver: { region: 'gutan', npc: 'gutan_smith' },
    desc: '替铸匠炉生凑齐三块烧不透的烬炭，补一次锁灵器', unlockChapter: 6,
    stages: [
      { text: '在南聚落与炉生交谈', flag: 'gutanSmithMet' },
      { text: '备齐烬炭 3 块', check: function () { return !!LB.flag('forgeDone') || LB.matCount('tanzha') >= 3; } },
      { text: '把烬炭交给炉生开炉', flag: 'forgeDone' },
    ],
    reward: function () { LB.giveJade(16); LB.giveMaterial('xuantie', 2); return '灵玉 +16 · 玄铁 +2'; },
  },
  {
    id: 'gutan_charcoal', title: '炭路三问', giver: { region: 'gutan', npc: 'gutan_child' },
    desc: '替拾炭童小焰问遍守坛人、记名者与崖居人', unlockChapter: 6,
    stages: [
      { text: '在南聚落与小焰交谈', flag: 'gutanChildMet' },
      { text: '问过守坛人、记名者、崖居人', check: function () {
        return !!(LB.flag('talked_gutan_keeper') && LB.flag('talked_gutan_scribe') && LB.flag('talked_gutan_hermit'));
      } },
      { text: '回聚落把回话告诉小焰', flag: 'charcoalDone' },
    ],
    reward: function () { LB.giveJade(14); LB.giveItem('pill', 3); return '灵玉 +14 · 丹药 +3'; },
  },

  {
    id: 'shenyuan_cage', title: '空笼三锁', giver: { region: 'shenyuan', npc: 'shenyuan_cager' },
    desc: '替笼匠编号打开南林、潭边、殿侧三把空笼锁', unlockChapter: 7,
    stages: [
      { text: '在空笼林与编号交谈', flag: 'shenyuanCagerMet' },
      { text: '打开南林、潭边、殿侧三把笼锁', check: function () {
        return !!(LB.flag('cage1') && LB.flag('cage2') && LB.flag('cage3'));
      } },
      { text: '回空笼林把锁芯交给编号', flag: 'cageDone' },
    ],
    reward: function () { LB.giveJade(20); LB.giveItem('revive', 1); return '灵玉 +20 · 归元丹 +1'; },
  },

  {
    id: 'shenyuan_echo', title: '回声三答', giver: { region: 'shenyuan', npc: 'shenyuan_shade' },
    desc: '替无名者向守门人、殿侍与拾骨人问他的旧名', unlockChapter: 7,
    stages: [
      { text: '在殿侧与无名者交谈', flag: 'shenyuanShadeMet' },
      { text: '问过守门人、殿侍、拾骨人', check: function () {
        return !!(LB.flag('talked_shenyuan_warden') && LB.flag('talked_shenyuan_keeper') && LB.flag('talked_shenyuan_bones'));
      } },
      { text: '回殿侧把回话带给无名者', flag: 'echoDone' },
    ],
    reward: function () { LB.giveJade(18); LB.giveItem('great_pill', 1); return '灵玉 +18 · 大还丹 +1'; },
  },

  {
    id: 'shenyuan_lock', title: '断锁三料', giver: { region: 'shenyuan', npc: 'shenyuan_warden' },
    desc: '替守门人哑石备三块玄铁，让断锁台重新能动', unlockChapter: 7,
    stages: [
      { text: '在西门口与哑石交谈', flag: 'shenyuanWardenMet' },
      { text: '备齐玄铁 3 块', check: function () { return !!LB.flag('lockDone') || LB.matCount('xuantie') >= 3; } },
      { text: '把玄铁交给哑石', flag: 'lockDone' },
    ],
    reward: function () { LB.giveJade(20); LB.giveMaterial('xingxie', 2); return '灵玉 +20 · 星屑 +2'; },
  },
  {
    id: 'rubbing', title: '碑文拓印', giver: { region: 'shanmen', npc: 'keeper' },
    desc: '拓下 4 处碑文，替碑林补全残页', unlockChapter: 2,
    steps: ['在各境寻找碑文', '拓下 4 处碑文'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.steles && Object.keys(s.steles).length >= 4);
    },
    reward: function () { LB.giveJade(10); LB.giveRecipe('recipe_cleanse'); return '灵玉 +10 · 清心散方'; },
  },
  {
    id: 'hammer', title: '铸灵师旧锤', giver: { region: 'luoxing', npc: 'zhuling' },
    desc: '在落星原找回铸灵师遗失的旧锤', unlockChapter: 3,
    steps: ['在矿坑附近寻找旧锤', '把旧锤交还铸灵师'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.oldHammer);
    },
    reward: function () { LB.giveJade(12); LB.giveMaterial('xuantie', 2); return '灵玉 +12 · 玄铁 +2'; },
  },
  {
    id: 'debt', title: '海市欠账', giver: { region: 'guixu', npc: 'haishi' },
    desc: '替旧山门偿清归墟海市的一笔欠账', unlockChapter: 4,
    steps: ['与海市主对账', '凑齐账上的灵玉与灵材'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.debtPaid);
    },
    reward: function () { LB.giveJade(20); LB.giveItem('incense', 1); return '灵玉 +20 · 引灵香 +1'; },
  },
  {
    id: 'dream', title: '泽中旧梦', giver: { region: 'yunmeng', npc: 'fisher' },
    desc: '听渔人讲完那个反复出现的旧梦', unlockChapter: 5,
    steps: ['在云梦泽听渔人讲旧梦', '破开蜃母幻境，带回梦的结尾'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.mirageBroken);
    },
    reward: function () { LB.giveJade(15); LB.giveMaterial('shensha', 2); return '灵玉 +15 · 蜃砂 +2'; },
  },
  {
    id: 'ember', title: '赤渊火种', giver: { region: 'gutan', npc: 'yimin' },
    desc: '从古坛底取回一粒不灭的火种', unlockChapter: 6,
    steps: ['在断崖古坛寻到坛底火种', '把火种交给赤渊遗民'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.emberTaken);
    },
    reward: function () { LB.giveJade(15); LB.giveMaterial('tanzha', 3); return '灵玉 +15 · 烬炭 +3'; },
  },
  {
    id: 'evolve1', title: '第一次进化', giver: { region: 'wuyin', npc: 'apprentice' },
    desc: '让一只灵兽完成第一次进化', unlockChapter: 3,
    steps: ['让灵兽达到进化等级', '备齐进化灵材并完成进化'],
    check: function () {
      var s = LB.saveState();
      if (!s || !s.team) return false;
      return s.team.some(function (m) { return SPECIES[m.sp] && SPECIES[m.sp].evolved; });
    },
    reward: function () { LB.giveJade(12); LB.giveItem('great_pill', 2); return '灵玉 +12 · 大还丹 +2'; },
  },

  {
    id: 'trial', title: '试炼前夜', giver: { region: 'shenyuan', npc: 'trial_guard' },
    desc: '击败无相后，与试炼守交谈，问清山海试炼的规矩', unlockChapter: 7,
    steps: ['击败无相', '回到归墟深处与试炼守交谈'],
    check: function () {
      var s = LB.saveState();
      return !!(s && s.flags && s.flags.trialUnlocked);
    },
    reward: function () { LB.giveJade(20); LB.giveItem('revive', 1); return '灵玉 +20 · 归元丹 +1'; },
  },

];

// ---------- 山门悬赏 ----------
// cooldown 以场次计：完成 count 场后可再接
const BOUNTIES = [
  {
    id: 'bounty_qingxi', title: '除妖 · 青溪', desc: '青溪谷妖气未散，清一清谷口。',
    type: 'hunt', target: 'qingxi', count: 3, cooldown: 3,
    reward: { jade: 12, mats: [{ id: 'lucao', count: 1 }] },
  },
  {
    id: 'bounty_herb', title: '采办 · 药庐', desc: '药庐缺露生草，采五株送去。',
    type: 'gather', target: 'lucao', count: 5, cooldown: 3,
    reward: { jade: 10, items: [{ id: 'pill', count: 2 }] },
  },
  {
    id: 'bounty_yunmeng', title: '巡山 · 云梦', desc: '云梦泽雾重，巡两趟看看有没有走失的灵兽。',
    type: 'patrol', target: 'yunmeng', count: 2, cooldown: 5,
    reward: { jade: 18, mats: [{ id: 'shensha', count: 1 }] },
  },
];
