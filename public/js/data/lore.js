// 灵兽录 · 数据层 · 山海志、暗格与试炼
// ---------- 山海志 ----------
// unlock: { type: 'chapter' | 'stele' | 'codexPct' | 'npc', id/value }
const CODEX = {
  honghuang: {
    id: 'honghuang', category: '年表', title: '洪荒',
    body: '五灵祖兽各据一脉，以身为山，以息为河。九嶂的山川是它们睡下时压出的褶皱。',
    unlock: { type: 'stele', id: 'gutan_stele1' },
  },
  limen: {
    id: 'limen', category: '年表', title: '立门',
    body: '初代契灵者沿五条灵脉立十二山门，各守一段支流。青溪为末门，门小，契却最全。',
    unlock: { type: 'stele', id: 'qingxi_stele1' },
  },
  shengshi: {
    id: 'shengshi', category: '年表', title: '盛世',
    body: '盛世时，山门与灵兽共守灵脉。契灵者不以灵兽为役，而以守契为荣；那时的灵笼只作渡河之用。',
    unlock: { type: 'stele', id: 'qingxi_stele2' },
  },
  duanqi: {
    id: 'duanqi', category: '年表', title: '断契之乱',
    body: '三十年前，十二山门为争灵脉，铸锁灵器，强抽灵兽灵息。灵脉逆流，渊兽自裂谷中爬出，山门一夜覆灭。',
    unlock: { type: 'stele', id: 'wuyin_stele1' },
  },
  wuling: {
    id: 'wuling', category: '五灵', title: '五灵',
    body: '木火土金水，五灵相克亦相生：木克土，土克水，水克火，火克金，金克木。契灵者先懂相克，才懂相护。',
    unlock: { type: 'stele', id: 'yunmeng_stele2' },
  },
  shiershanmen: {
    id: 'shiershanmen', category: '山门', title: '十二山门',
    body: '十二山门各守一脉，名号多已湮没。如今还能点灯的，只剩青溪一处，和几处不肯散的旧坛。',
    unlock: { type: 'codexPct', value: 25 },
  },
  yuanshou: {
    id: 'yuanshou', category: '术语', title: '渊兽',
    body: '渊兽非灵兽，是灵脉怨气与锁灵术拧成的死物。它不换灵息，也不认名，所以无法结契，只能击败或封镇。',
    unlock: { type: 'stele', id: 'luoxing_stele2' },
  },
  suolingshu: {
    id: 'suolingshu', category: '术语', title: '锁灵术',
    body: '锁灵术不换灵息，只抽取。被锁的灵兽会先失名，再失形，最后连痛也不记得。断契之乱由它而起，归墟因它而深。',
    unlock: { type: 'stele', id: 'guixu_stele2' },
  },
  qingxishanmen: {
    id: 'qingxishanmen', category: '势力', title: '青溪山门',
    body: '青溪是十二山门的末门，守在灵脉最细处。门中旧规只有一句：契成之后，先问灵兽愿不愿。',
    unlock: { type: 'npc', id: 'gate_elder' },
  },
  qingxi_qiao: {
    id: 'qingxi_qiao', category: '地理', title: '青溪木桥',
    body: '青溪木桥断过两次。第一次断于断契之乱，第二次断于无人修。桥桩上缠着的契绳不是装饰，是让过桥的人记得：桥也是契。',
    unlock: { type: 'stele', id: 'qingxi_stele3' },
  },
  qingxi_ci: {
    id: 'qingxi_ci', category: '地理', title: '溪东旧祠',
    body: '溪东旧祠里没有神像，只有一排刻满名字的碑。守碑人说，名字在，契就在；名字没了，山也就不在了。',
    unlock: { type: 'stele', id: 'qingxi_stele4' },
  },
  aheng: {
    id: 'aheng', category: '人物', title: '阿蘅',
    body: '雾隐药庐的采药人，在青溪谷东支起一间小药庐。她相信锁住的灵息能被草叶一寸寸化开，也相信药不该卖给出价最高的人。',
    unlock: { type: 'npc', id: 'qingxi_aheng' },
  },
  wuyinyaolu: {
    id: 'wuyinyaolu', category: '势力', title: '雾隐药庐',
    body: '雾隐药庐以灵草解锁灵之术，常年隐在雾里。阿蘅的师门相信，锁住的灵息也能被草叶一寸寸化开。',
    unlock: { type: 'stele', id: 'wuyin_stele2' },
  },
  wuyin_quan: {
    id: 'wuyin_quan', category: '地理', title: '雾泉',
    body: '雾泉自雾隐林东侧石心涌出，水寒而味淡。传说饮过泉水的人会忘记来路，所以旧山门在泉边立石栏，栏上刻着「饮者自渡」。',
    unlock: { type: 'stele', id: 'wuyin_stele3' },
  },
  wuyin_du: {
    id: 'wuyin_du', category: '地理', title: '雾潭旧渡',
    body: '雾潭旧渡是青溪通往落星原的近路。断契之乱后渡口封了三十年，船底压着半段契绳，等一个肯修渡桩的人。',
    unlock: { type: 'stele', id: 'wuyin_stele4' },
  },
  wuyin_lie: {
    id: 'wuyin_lie', category: '势力', title: '雾隐猎户',
    body: '雾隐猎户世代在林里辨迹，不猎幼兽，不猎带崽的母兽。他们把死者的名字刻在木牌上，说雾会记住名字，也会绕开有名字的路。',
    unlock: { type: 'stele', id: 'wuyin_stele5' },
  },
  tiangongsi: {
    id: 'tiangongsi', category: '势力', title: '天工司',
    body: '天工司曾为十二山门铸锁灵器，炉火三日不熄。断契之后，匠人分裂：一派赎罪，一派仍说器物无罪。',
    unlock: { type: 'stele', id: 'luoxing_stele1' },
  },
  guanxingtai: {
    id: 'guanxingtai', category: '地理', title: '观星台',
    body: '落星原的观星台不观星，只观星落下来的轨。天工司旧人相信，星屑是未冷的灵息，照得出一件器物的来路，也照得出它的价。',
    unlock: { type: 'stele', id: 'luoxing_stele3' },
  },
  kuangmai: {
    id: 'kuangmai', category: '地理', title: '星砂矿脉',
    body: '星砂生于陨处，玄铁沉在砂底。矿工立下旧规：取砂者留三分，留给后来的人，也留给这片原。',
    unlock: { type: 'stele', id: 'luoxing_stele4' },
  },
  fengshiyi: {
    id: 'fengshiyi', category: '地理', title: '风蚀驿路',
    body: '风蚀驿路东去归墟，西回雾林。旧时驿马夫把信压在碑脚，等风停再走。信不入风，人不入沙，是这条路上唯一的规矩。',
    unlock: { type: 'stele', id: 'luoxing_stele5' },
  },
  guixushangmeng: {
    id: 'guixushangmeng', category: '势力', title: '归墟商盟',
    body: '归墟商盟随潮水来去，买卖灵材、残契与旧器。他们不站队，只问价钱；但海市主的账本里，记着每一笔人情。',
    unlock: { type: 'stele', id: 'guixu_stele1' },
  },
  yantian: {
    id: 'yantian', category: '地理', title: '归墟盐田',
    body: '归墟盐田沿潮线开畦，退潮取盐，涨潮养卤。盐能定灵息，也能定人心；海市把持盐引，比把持刀剑更稳。',
    unlock: { type: 'stele', id: 'guixu_stele3' },
  },
  chenchuan: {
    id: 'chenchuan', category: '地理', title: '沉船坞',
    body: '归墟东侧的浅滩上搁着十七艘沉船，船骨可拆，名字不可拆。船匠把每一条沉船的名字刻在坞口，等它的主人回来认。',
    unlock: { type: 'stele', id: 'guixu_stele4' },
  },
  jiaoge: {
    id: 'jiaoge', category: '术语', title: '鲛歌',
    body: '鲛歌以息换息，以名换名。鲛人把名字唱进潮水里，潮水便把名字带到该去的地方；歌断了，名字就留在岸上。',
    unlock: { type: 'stele', id: 'guixu_stele5' },
  },
  yunmengze: {
    id: 'yunmengze', category: '地理', title: '云梦泽',
    body: '云梦泽的雾会照人心。你想见什么，泽上便起什么；走得越深，越难分清哪一句是自己说的。',
    unlock: { type: 'stele', id: 'yunmeng_stele1' },
  },
  wuxiang: {
    id: 'wuxiang', category: '人物', title: '无相',
    body: '无相没有面目，也不肯留名。他说契只是更体面的奴役，只有抽尽灵息，人与灵才算两不相欠。',
    unlock: { type: 'stele', id: 'shenyuan_stele1' },
  },
  xinqi: {
    id: 'xinqi', category: '术语', title: '新契',
    body: '新契不以灵笼为约束，而以互选为凭。契成时人得灵兽之力，灵兽得人的名与路；一方要走，契便自解。',
    unlock: { type: 'stele', id: 'shenyuan_stele2' },
  },
  yunmengzhou: {
    id: 'yunmengzhou', category: '地理', title: '云梦舟',
    body: '云梦舟不系岸。旧山门造它时只留一句：渡者自渡。舟子换了一代又一代，桨声没换；少一支桨，船就在雾里打转。',
    unlock: { type: 'stele', id: 'yunmeng_stele3' },
  },
  shenloutai: {
    id: 'shenloutai', category: '地理', title: '蜃楼台',
    body: '蜃楼台是旧山门在泽心立的一处问心台。台不高，却要走过三面镜才看得见阶。蜃母盘踞其上，把每个来者的问句放大成幻。',
    unlock: { type: 'stele', id: 'yunmeng_stele4' },
  },
  yunmengjing: {
    id: 'yunmengjing', category: '术语', title: '泽镜',
    body: '泽镜不以铜铸，以凝雾成面。照人时先照出他最怕的答案，再照出他最想留住的答案。守镜人说，能走出两面镜子的人，才走得进第三面。',
    unlock: { type: 'stele', id: 'yunmeng_stele5' },
  },
  chiyuanhuo: {
    id: 'chiyuanhuo', category: '地理', title: '赤渊火',
    body: '赤渊的火不是凡火，是被锁住的守脉灵吐出的最后一口气。坛裂一日，火就烧一日；锁不解，火不熄。',
    unlock: { type: 'stele', id: 'gutan_stele3' },
  },
  wujiu: {
    id: 'wujiu', category: '人物', title: '无咎',
    body: '断崖古坛的旧山主，守脉一生，不肯锁一灵。他自沉渊底时留下话：若我成渊，后来者斩之。',
    unlock: { type: 'stele', id: 'gutan_stele4' },
  },
  duanyamin: {
    id: 'duanyamin', category: '势力', title: '赤渊遗民',
    body: '古坛覆灭后不肯离开的一支人。他们迁者留名、守者留骨，把每一个名字刻进坛基，等火熄的那天再念一遍。',
    unlock: { type: 'stele', id: 'gutan_stele5' },
  },
  wuxianglu: {
    id: 'wuxianglu', category: '人物', title: '无相本录',
    body: '无相不是天生的怪物，是万人被抹去的名字叠在一处。叫得出其中一个名字，它就少一张脸。',
    unlock: { type: 'stele', id: 'shenyuan_stele3' },
  },
  duansuo: {
    id: 'duansuo', category: '术语', title: '断锁台',
    body: '锁可断，约不可断。断锁者入，解约者出，二者不可同路。归墟深处的台面上，那道新裂一直没合上。',
    unlock: { type: 'stele', id: 'shenyuan_stele4' },
  },
  xinqizhong: {
    id: 'xinqizhong', category: '术语', title: '新契终稿',
    body: '人呼其名，灵应其声。名在则契在，名亡则契亡。此约不刻于石，刻于口——所以它要两个人一起记着才算数。',
    unlock: { type: 'stele', id: 'shenyuan_stele5' },
  },
};

// ---------- 隐藏暗格 ----------
// 每境一处，靠近才显形；开启后记入 flags.secret_<id>
const SECRETS = [
  {
    id: 'secret_shanmen', region: 'shanmen', x: 31, y: 25, name: '山门暗窖',
    text: '石阶下有一块松动的地砖。掀开，是半只旧灵笼和一封没写完的信：「若后来者见字，契可重立，不必照旧。」',
    jade: 18, mat: 'lingmu', count: 2,
  },
  {
    id: 'secret_qingxi', region: 'qingxi', x: 38, y: 28, name: '溪尾暗洞',
    text: '溪水退处的石缝里塞着一只油布包，里面是几枚旧灵玉和一段烧焦的契绳。',
    jade: 20, mat: 'lucao', count: 3,
  },
  {
    id: 'secret_qingxi2', region: 'qingxi', x: 56, y: 36, name: '旧祠后山暗缝',
    text: '旧祠后的石缝里塞着一只褪色的纸船，船腹写着同一个名字。纸船下面压着一小捆旧灵木，像是有人在这里等过谁。',
    jade: 24, mat: 'lingmu', count: 3,
  },
  {
    id: 'secret_wuyin', region: 'wuyin', x: 45, y: 30, name: '药庐地窖',
    text: '药圃边的石板下是一间极小的地窖，墙上刻着「锁可解，名可还」六字。',
    jade: 22, mat: 'lucao', count: 4,
  },
  {
    id: 'secret_wuyin2', region: 'wuyin', x: 59, y: 37, name: '雾潭沉箱',
    text: '旧渡尽头的树根下压着一只沉箱。箱里没有灵玉，只有一叠写满名字的木牌，和一根断掉的渡绳。',
    jade: 26, mat: 'lingmu', count: 3,
  },
  {
    id: 'secret_luoxing', region: 'luoxing', x: 35, y: 40, name: '陨坑暗匣',
    text: '陨坑底部有一只被星屑半埋的铁匣，匣面刻着天工司的旧印。里面是一块温热的玄铁。',
    jade: 26, mat: 'xingxie', count: 2,
  },
  {
    id: 'secret_luoxing2', region: 'luoxing', x: 44, y: 26, name: '旧坊地炉',
    text: '旧坊墙根下有一处封死的地炉，炉膛里没有火，只有一排刻着山门名号的空模子。天工司当年铸的，从来不止一件。',
    jade: 28, mat: 'xuantie', count: 2,
  },
  {
    id: 'secret_guixu', region: 'guixu', x: 45, y: 33, name: '退潮石龛',
    text: '退潮后露出的石龛里供着一枚断成两半的契印。海市主大概知道它的来历，却从没提起。',
    jade: 28, mat: 'haiyan', count: 3,
  },
  {
    id: 'secret_guixu2', region: 'guixu', x: 11, y: 7, name: '盐田暗柜',
    text: '盐畦尽头的旧木柜被盐渍封死，撬开后只有一叠盐引和半枚商盟旧印。盐引上的年份，比海市还早。',
    jade: 30, mat: 'shensha', count: 2,
  },
  {
    id: 'secret_yunmeng', region: 'yunmeng', x: 46, y: 33, name: '泽底沉匣',
    text: '浅泽下压着一只沉匣，打开时水面映出另一条路——那条路上你没有进山。',
    jade: 30, mat: 'shensha', count: 2,
  },
  {
    id: 'secret_yunmeng2', region: 'yunmeng', x: 57, y: 35, name: '旧渡沉箱',
    text: '旧渡尽头的泥里埋着一只沉箱，箱盖缠着断掉的渡绳。里面是几束还带露的草，和一枚刻着船名的木牌。',
    jade: 32, mat: 'lucao', count: 3,
  },
  {
    id: 'secret_gutan', region: 'gutan', x: 43, y: 25, name: '坛底火龛',
    text: '古坛裂缝里有一处不烫手的火龛，火心里卧着一粒黑色的种子。',
    jade: 32, mat: 'tanzha', count: 3,
  },
  {
    id: 'secret_gutan2', region: 'gutan', x: 12, y: 26, name: '崖壁暗龛',
    text: '西崖的石缝里塞着一只陶罐，罐口封着灰。里面是一叠写满名字的薄木牌，最上面那块还没有刻字。',
    jade: 34, mat: 'lingmu', count: 2,
  },
  {
    id: 'secret_shenyuan', region: 'shenyuan', x: 36, y: 27, name: '锁灵残室',
    text: '殿侧的暗室里排着一列空灵笼，笼门都朝着同一个方向——归墟的更深处。',
    jade: 38, mat: 'xuantie', count: 2,
  },
  {
    id: 'secret_shenyuan2', region: 'shenyuan', x: 58, y: 14, name: '殿后残库',
    text: '殿后的残库里只剩半架锁灵器的骨架，和一张没写完的清单。清单最末一行写着：「器成之日，勿忘问名。」',
    jade: 40, mat: 'shensha', count: 3,
  },
];

// ---------- 山海试炼 ----------
const TRIALS = [
  {
    floor: 1, name: '试炼 · 初契',
    desc: '谷口一夜，旧契重演。',
    rule: '守谷灵不再守，只攻；敌方气血与攻击大幅提升。',
    boss: { ref: 'shougu', lv: 26, hpMul: 2.6, atkMul: 1.4 },
    reward: { jade: 40, mats: [{ id: 'xingxie', count: 2 }] },
  },
  {
    floor: 2, name: '试炼 · 雾障',
    desc: '雾里两步，一步是旧路，一步是深渊。',
    rule: '每回合随机迟滞一方，雾隐魈的魈影分身更密。',
    boss: { ref: 'wuyinxiao', lv: 27, hpMul: 2.7, atkMul: 1.45 },
    reward: { jade: 50, mats: [{ id: 'lingmu', count: 3 }] },
  },
  {
    floor: 3, name: '试炼 · 星陨',
    desc: '星屑覆地，炉火照天。',
    rule: '星陨傀每三回合落石一次，破甲可叠加。',
    boss: { ref: 'xingyun', lv: 28, hpMul: 2.8, atkMul: 1.5 },
    reward: { jade: 60, mats: [{ id: 'xuantie', count: 3 }] },
  },
  {
    floor: 4, name: '试炼 · 赤渊',
    desc: '坛底火不灭，旧名未凉。',
    rule: '场地燃烧，双方每回合受伤；火属伤害减半，灼烧持续三回合。',
    boss: { ref: 'chiyuan', lv: 29, hpMul: 2.9, atkMul: 1.55 },
    reward: { jade: 80, mats: [{ id: 'tanzha', count: 4 }] },
  },
  {
    floor: 5, name: '试炼 · 无相',
    desc: '最后一层，没有面目，也没有退路。',
    rule: '无相复制我方上一式，且不可结契；五行克制效果减半。',
    boss: { ref: 'wuxiang', lv: 30, hpMul: 3.0, atkMul: 1.6 },
    reward: { jade: 120, items: [{ id: 'revive', count: 2 }] },
  },
];
