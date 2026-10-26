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

  // ===== 扩充：五脉、旧炉与新城 =====
  zhumen: {
    id: 'zhumen', category: '年表', title: '铸门',
    body: '十二门铸锁灵器那年，落星原的炉火烧了七夜。第七夜炉顶塌下一角，铁水顺着山脊流成一条不会冷的沟。',
    unlock: { type: 'codexPct', value: 30 },
  },
  xuhuo: {
    id: 'xuhuo', category: '年表', title: '续火',
    body: '断契之后，各门只余一盏灯。青溪的灯由老丈添油，古坛的灯埋在火洲底下，归墟的灯挂在海市最高一根桩上。',
    unlock: { type: 'codexPct', value: 60 },
  },
  jinmai: {
    id: 'jinmai', category: '五灵', title: '金脉',
    body: '金脉生铁，铁能锁灵，也能铸铃。铃响一声，走失的灵兽会停一停；锁灵器响一声，它便再也想不起回头的路。',
    unlock: { type: 'codexPct', value: 40 },
  },
  mumai: {
    id: 'mumai', category: '五灵', title: '木脉',
    body: '木脉主生，也主忘。林子长得越深，被记住的事越少；所以药庐采药，总要在手腕上系一根不会褪色的线。',
    unlock: { type: 'codexPct', value: 38 },
  },
  shuimai: {
    id: 'shuimai', category: '五灵', title: '水脉',
    body: '水脉记路。归墟的潮每天退两次，退到哪块礁石、绕过哪根旧桩，一千年不改。鲛人唱歌，唱的是水记下的路。',
    unlock: { type: 'codexPct', value: 42 },
  },
  huomai: {
    id: 'huomai', category: '五灵', title: '火脉',
    body: '火脉不灭，只换地方烧。古坛的火沉下去以后，在云梦泽的苇岸又冒了头；守火的人换了一代，火还记得旧名。',
    unlock: { type: 'codexPct', value: 44 },
  },
  tumai: {
    id: 'tumai', category: '五灵', title: '土脉',
    body: '土脉载名。埋下去的名字会顺着土走，走到碑下便停。古坛的守碑人拖回倒下的碑座，不是怕碑倒，是怕名字走散。',
    unlock: { type: 'codexPct', value: 46 },
  },
  luding: {
    id: 'luding', category: '地理', title: '炉顶',
    body: '落星原旧炉的顶，如今只剩半圈铁梁。灼金雕落在梁上磨喙，铁屑落下去，隔年便生出一丛不生花的草。',
    unlock: { type: 'codexPct', value: 55 },
  },
  yaozhou: {
    id: 'yaozhou', category: '地理', title: '药洲',
    body: '云梦泽的浮洲一年换一次位置，只有衔药鹿找得到。洲上生着九种药，第九种从不入方子，只用来送人。',
    unlock: { type: 'codexPct', value: 65 },
  },
  shagu: {
    id: 'shagu', category: '地理', title: '砂谷',
    body: '断崖下的砂谷没有风，砂会自己合拢。走进去的人若不留石子记路，出来时会发现自己绕回了同一截断墙。',
    unlock: { type: 'codexPct', value: 70 },
  },
  zhulingshi: {
    id: 'zhulingshi', category: '人物', title: '铸灵师',
    body: '他姓祝，右手缺一根指。铸过锁灵器，也补过旧灵笼；两样活计他都做得好，只是再不提那年炉火。',
    unlock: { type: 'npc', id: 'zhuling' },
  },
  haishizhu: {
    id: 'haishizhu', category: '人物', title: '海市主',
    body: '没人知道她的名字，只知道海市每次开张，她都站在最高那根桩上。她收落水之物，也收没说完的话。',
    unlock: { type: 'npc', id: 'haishi' },
  },

  // ---------- 第二卷 · 云栈 ----------
  yunzhanmen: {
    id: 'yunzhanmen', category: '地理', title: '风门',
    body: '十二山门里，风门最高，也最先断。门不挡人，只记人：过门留名，回头留灯。如今门框还在，风却换了方向。',
    unlock: { type: 'stele', id: 'yunzhan_stele1' },
  },
  yunzhandeng: {
    id: 'yunzhandeng', category: '山门', title: '悬灯台',
    body: '东台三盏悬灯，灯芯以雷髓浸过，风再大也不灭。旧时说三灯不灭则风门不闭；后来灯还在，门已经没人守了。',
    unlock: { type: 'stele', id: 'yunzhan_stele2' },
  },
  yunzhanzhan: {
    id: 'yunzhanzhan', category: '地理', title: '云栈',
    body: '云海之上的木栈，下无底，上无路。修栈人只换坏板，不换整段——他们说路要一段段记住，人才不会走丢。',
    unlock: { type: 'stele', id: 'yunzhan_stele3' },
  },
  yunzhanji: {
    id: 'yunzhanji', category: '人物', title: '旧驿簿',
    body: '簿上记着过路人的名字，最后一页只有一句「风伯，等你回来」。字是风伯自己写的，写给三十年前那个没回来的人。',
    unlock: { type: 'stele', id: 'yunzhan_stele4' },
  },
  yunzhanfeng: {
    id: 'yunzhanfeng', category: '术语', title: '风字',
    body: '风蚀过的字只剩半边，补全它的人未必识字。九嶂人说，断墙上的字不是给人读的，是给风认路的。',
    unlock: { type: 'stele', id: 'yunzhan_stele5' },
  },

  // ---------- 第二卷 · 玄炉 ----------
  xuanguumen: {
    id: 'xuanguumen', category: '山门', title: '炉门',
    body: '炉门旧铭只有一句：火不是用来锁的。锁住火的人，最后都成了炉里的炭。玄炉烧了三百年，铭文没被烧掉。',
    unlock: { type: 'stele', id: 'xuangu_stele1' },
  },
  xuanguupu: {
    id: 'xuanguupu', category: '术语', title: '铸灵残谱',
    body: '谱上画着锁灵器的骨，旁边有人用炭写了「不铸」二字。后来这页被撕下，塞进炉门缝里，才留到今天。',
    unlock: { type: 'stele', id: 'xuangu_stele2' },
  },
  xuanggulu: {
    id: 'xuanggulu', category: '人物', title: '炉心傀',
    body: '第十七次开炉，傀仍未醒。老铸人说它记得的名字太多，不肯只认一个；也有人说，它是在等一个叫得全的人。',
    unlock: { type: 'stele', id: 'xuangu_stele3' },
  },
  xuangugong: {
    id: 'xuangugong', category: '人物', title: '无名匠',
    body: '南坊墙上挂着的工牌，名字都被火燎过，只剩姓。最后一个姓「烛」，牌背面刻着一行小字：炉在，人在。',
    unlock: { type: 'stele', id: 'xuangu_stele4' },
  },
  xuanguanchui: {
    id: 'xuanguanchui', category: '术语', title: '断锤',
    body: '锤断之日，炉门自开。断锤不是凶兆，是旧匠人留的后手：锁灵器不该有下一件，锤也不该有下一把。',
    unlock: { type: 'stele', id: 'xuangu_stele5' },
  },

  // ---------- 第二卷 · 沉城 ----------
  chenyu_cheng: {
    id: 'chenyu_cheng', category: '地理', title: '沉蜃旧城',
    body: '城浮上来三次，每次都少一条街。守潮人不记城名，只记街名：东街、潮渠、北塔、南街。名字在，城就还没全沉。',
    unlock: { type: 'stele', id: 'chenyu_stele1' },
  },
  chenyu_chao: {
    id: 'chenyu_chao', category: '术语', title: '守潮',
    body: '守潮不观潮，只数上岸的人。潮退时最后一个上来的人，要在名册上留名；不留名的人，会被城当成自己的影子。',
    unlock: { type: 'stele', id: 'chenyu_stele2' },
  },
  chenyu_ying: {
    id: 'chenyu_ying', category: '术语', title: '蜃影',
    body: '沉城的蜃不造幻境，只借脸。它借一张脸，就替那个人把没说完的话说完。听久了，你会忘了哪句是自己的。',
    unlock: { type: 'stele', id: 'chenyu_stele3' },
  },
  chenyu_jie: {
    id: 'chenyu_jie', category: '地理', title: '南街',
    body: '南街水最浅，也最容易走错。旧城人说，心中有旧事的人下南街，会看见自己最想回去的那一天。',
    unlock: { type: 'stele', id: 'chenyu_stele4' },
  },
  chenyu_ming: {
    id: 'chenyu_ming', category: '术语', title: '留名',
    body: '入城留名，出城还名。东门守门人从不问来处，只问一句：你叫什么。答不上来的人，门不开，城也不赶。',
    unlock: { type: 'stele', id: 'chenyu_stele5' },
  },

  // ---------- 第二卷 · 天根 ----------
  jiuzhang_gen: {
    id: 'jiuzhang_gen', category: '地理', title: '九嶂天根',
    body: '九嶂的山都从一根生。根断则山散，根在则灵归。天根不在最高处，在最静处；石林会让路，水会记得旧路。',
    unlock: { type: 'stele', id: 'jiuzhang_stele1' },
  },
  jiuzhang_wuse: {
    id: 'jiuzhang_wuse', category: '五灵', title: '五色石',
    body: '青赤黄白黑，五石各守一脉。缺一则灵脉不圆，补之者须以自己的名字为引。天根兽守的，就是那块缺石。',
    unlock: { type: 'stele', id: 'jiuzhang_stele2' },
  },
  jiuzhang_yue: {
    id: 'jiuzhang_yue', category: '年表', title: '祖兽旧约',
    body: '五灵祖兽以身为山，以息为河。旧约说，后人若立新契，须先听山愿不愿。新契不是人的独角戏，山也有份。',
    unlock: { type: 'stele', id: 'jiuzhang_stele3' },
  },
  jiuzhang_zhong: {
    id: 'jiuzhang_zhong', category: '山门', title: '天根钟',
    body: '钟身无字，只有一道深深的指痕。指尖朝向山门。守根人说，钟不是用来敲的，是用来记方向的。',
    unlock: { type: 'stele', id: 'jiuzhang_stele4' },
  },

  // ---------- 支线境与秘境 ----------
  yaopu_yao: {
    id: 'yaopu_yao', category: '地理', title: '青溪药圃',
    body: '药圃不大，一畦露草、一畦药花、一条引水渠。阿蘅说，药圃的门不锁，因为药不认门。',
    unlock: { type: 'stele', id: 'yaopu_stele1' },
  },
  yaopu_shi: {
    id: 'yaopu_shi', category: '术语', title: '一畦一誓',
    body: '种药人立誓：一畦药养一境人。药不够时，先给最不会开口的那个。这句誓没有刻在碑上，是刻在取药人的手上。',
    unlock: { type: 'stele', id: 'yaopu_stele2' },
  },
  anshi_shi: {
    id: 'anshi_shi', category: '势力', title: '归墟暗市',
    body: '暗市随潮水开合，只做三种生意：旧物、旧事、旧名字。规矩三条：不点灯，不喊名，不回头。',
    unlock: { type: 'stele', id: 'anshi_stele1' },
  },
  anshi_jia: {
    id: 'anshi_jia', category: '术语', title: '断契价目',
    body: '一页旧价目，最上面一行被刀刮掉，只剩「契」字和一枚指印。暗市的人说，断契不是买卖，是有人替你把话说完。',
    unlock: { type: 'stele', id: 'anshi_stele2' },
  },
  anshi_an: {
    id: 'anshi_an', category: '地理', title: '暗巷',
    body: '明处无路时，暗处未必有；但暗处至少没人替你选。暗巷尽头没有门，只有一面不反光的墙。',
    unlock: { type: 'stele', id: 'anshi_stele3' },
  },
  rongku_ku: {
    id: 'rongku_ku', category: '地理', title: '赤渊熔窟',
    body: '熔窟在古坛之下，火从岩缝里流。窟里的火不烧活人，只烧名字；被烧掉一半名字的人，会忘了自己为什么来。',
    unlock: { type: 'stele', id: 'rongku_stele1' },
  },
  rongku_yi: {
    id: 'rongku_yi', category: '术语', title: '遗蜕',
    body: '它不是渊兽，是被锁灵术抽走名字的守脉灵。火替它记着名字，所以它守着熔窟，不肯让火熄灭。',
    unlock: { type: 'stele', id: 'rongku_stele2' },
  },
  rongku_hui: {
    id: 'rongku_hui', category: '山门', title: '断炉',
    body: '炉断之后，火不必再为谁烧。后来人若来，添一把柴便走。这是旧匠人留给赤渊的最后一句规矩。',
    unlock: { type: 'stele', id: 'rongku_stele3' },
  },
  jingdi_jing: {
    id: 'jingdi_jing', category: '地理', title: '雾隐古井',
    body: '井不深，深的是人往下看的那一眼。井水不照脸，只照人忘掉的事。雾隐林的人用它藏话，不用它藏人。',
    unlock: { type: 'stele', id: 'jingdi_stele1' },
  },
  jingdi_ying: {
    id: 'jingdi_ying', category: '术语', title: '井影',
    body: '影不认人，只认旧事。你若怕它，它便一直跟着；你若叫得出它的名字，它就把你的那一部分还给你。',
    unlock: { type: 'stele', id: 'jingdi_stele2' },
  },
  xingkeng_keng: {
    id: 'xingkeng_keng', category: '地理', title: '星陨坑',
    body: '星落成坑，坑底有光。光不属于九嶂，也不肯走。坑守说，星屑夜里会亮，白天只是灰。',
    unlock: { type: 'stele', id: 'xingkeng_stele1' },
  },
  xingkeng_xing: {
    id: 'xingkeng_xing', category: '五灵', title: '陨铁',
    body: '陨铁不锈，因它记得自己从哪颗星来。天工司曾用它铸锁灵器的骨，后来发现它不肯认第二把火。',
    unlock: { type: 'stele', id: 'xingkeng_stele2' },
  },
  xingkeng_hai: {
    id: 'xingkeng_hai', category: '人物', title: '星骸鸟',
    body: '星骸鸟落一次，坑底的雾便淡一分。它不鸣，只在星屑最亮时低头啄石。猎户说，它的骨头里也有星屑。',
    unlock: { type: 'stele', id: 'xingkeng_stele3' },
  },
  shihai_shi: {
    id: 'shihai_shi', category: '山门', title: '试炼石海',
    body: '石海不设门，来者自设。过五层者，可问一句。问什么都可以，只是石海未必答。',
    unlock: { type: 'stele', id: 'shihai_stele1' },
  },
  shihai_tai: {
    id: 'shihai_tai', category: '术语', title: '试炼台',
    body: '胜者刻名，败者刻痕。名字会被风磨掉，痕不会。石海的守人说，痕比名更诚实。',
    unlock: { type: 'stele', id: 'shihai_stele2' },
  },
  shihai_ling: {
    id: 'shihai_ling', category: '人物', title: '残影',
    body: '旧试者的残影还留在石海，忘了为什么来，却记得不能停。你若还记得，他希望你替他走完下一层。',
    unlock: { type: 'stele', id: 'shihai_stele3' },
  },
  beilin_1: {
    id: 'beilin_1', category: '年表', title: '无名碑一',
    body: '碑上只有一道横痕，像有人写了一半的「一」字。守碑人说，第一笔最难，因为不知道从哪开始。',
    unlock: { type: 'stele', id: 'beilin_stele1' },
  },
  beilin_2: {
    id: 'beilin_2', category: '山门', title: '无名碑二',
    body: '十二个门名并排刻着，前十一处都已磨平，只剩青溪。碑末没有落款，只有一枚小小的契印。',
    unlock: { type: 'stele', id: 'beilin_stele2' },
  },
  beilin_3: {
    id: 'beilin_3', category: '术语', title: '无名碑三',
    body: '一张残缺的契纹，线条断在「愿」字上。拓碑人说，这不是断，是留白：愿字本来就要双方自己写。',
    unlock: { type: 'stele', id: 'beilin_stele3' },
  },
  beilin_4: {
    id: 'beilin_4', category: '人物', title: '无名碑四',
    body: '碑上刻着很多名字，每个名字后面都有一枚小小的兽爪印。名字有的深，有的浅，爪印却一样深。',
    unlock: { type: 'stele', id: 'beilin_stele4' },
  },
  beilin_5: {
    id: 'beilin_5', category: '年表', title: '无名碑五',
    body: '最北的碑没有字，只有一道被反复摩挲的浅窝。守碑人说，这块碑是留给后来人的，写什么由你。',
    unlock: { type: 'stele', id: 'beilin_stele5' },
  },
  shanmen_gui: {
    id: 'shanmen_gui', category: '地理', title: '归山刻',
    body: '山门南阶有一块矮碑，刻着「出山者不必回头，回山者不必解释」。老丈说，这不是规矩，是给回来的人留的一句话。',
    unlock: { type: 'stele', id: 'shanmen_stele3' },
  },
  qingxi_xin: {
    id: 'qingxi_xin', category: '地理', title: '旧祠新碑',
    body: '旧祠石坪新立了一块矮碑，碑上刻着后来人的名字。名字不多，每一个后面都留着一小段空白，像是等人回来补。',
    unlock: { type: 'stele', id: 'qingxi_stele5' },
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
  {
    id: 'secret_yunzhan', region: 'yunzhan', x: 52, y: 26, name: '悬灯暗格',
    text: '东台灯座下压着一只铁匣，里面是一枚旧风铃和三块没点过的灯芯。铃上没有字，只有一道被风磨亮的指痕。',
    jade: 44, mat: 'yunwen', count: 2,
  },
  {
    id: 'secret_xuangu', region: 'xuangu', x: 10, y: 38, name: '西矿暗龛',
    text: '西矿道尽头有一处没烧透的暗龛，龛里摆着一把断锤和半张工牌。工牌背面写着：「炉在，人在。」',
    jade: 46, mat: 'luxin', count: 2,
  },
  {
    id: 'secret_xuangu2', region: 'xuangu', x: 56, y: 10, name: '东井暗柜',
    text: '东井壁里嵌着一只窄柜，柜里整整齐齐码着十几枚没刻名的铁牌。最上面一枚是空的。',
    jade: 48, mat: 'xuantie', count: 3,
  },
  {
    id: 'secret_chenyu', region: 'chenyu', x: 34, y: 44, name: '南街暗匣',
    text: '南街水退后的石缝里卡着一只暗匣，匣中是一卷泡软的名册。名字都糊了，只有最后一页还能认出两个字：回来。',
    jade: 50, mat: 'chenzhu', count: 2,
  },
  {
    id: 'secret_jiuzhang', region: 'jiuzhang', x: 30, y: 44, name: '石林暗龛',
    text: '五色石林最矮的一块石头下，压着一小截天根须。它离开土还在轻轻抽动，像在找回去的路。',
    jade: 56, mat: 'tiangenxu', count: 2,
  },
  {
    id: 'secret_rongku', region: 'rongku', x: 46, y: 26, name: '熔窟暗龛',
    text: '熔窟最深处有一处不烫手的石龛，龛里堆着十几枚烧掉一半的名牌。最上面一枚还剩一个「赤」字。',
    jade: 42, mat: 'tanzha', count: 3,
  },
  {
    id: 'secret_jingdi', region: 'jingdi', x: 34, y: 18, name: '井壁暗匣',
    text: '井壁的裂缝里卡着一只小匣，匣中是一缕干掉的井水和半句刻在木片上的话：「别怕，是我。」',
    jade: 30, mat: 'shensha', count: 2,
  },
  {
    id: 'secret_xingkeng', region: 'xingkeng', x: 46, y: 20, name: '坑缘暗格',
    text: '坑缘的碎石下压着一块温热的陨铁，铁面上有一道像翅骨的裂痕。',
    jade: 44, mat: 'xingxie', count: 3,
  },
  {
    id: 'secret_shihai', region: 'shihai', x: 40, y: 20, name: '石阵暗龛',
    text: '石阵边角有一块被人反复坐过的石头，石下藏着一枚旧试者的木牌，牌上只刻着「再来」二字。',
    jade: 38, mat: 'xuantie', count: 2,
  },
  {
    id: 'secret_beilin', region: 'beilin', x: 38, y: 20, name: '碑林暗匣',
    text: '碑林最外侧的松土里埋着一只木匣，匣中是一叠空白的拓纸和半截没用完的墨。',
    jade: 26, mat: 'lingmu', count: 2,
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
  {
    floor: 6, name: '试炼 · 悬灯',
    desc: '云栈三灯俱灭，风门只认最后站着的人。',
    rule: '栈灵闪避上升，金、水属伤害增加；每回合有几率迟滞。',
    boss: { ref: 'zhanling', lv: 34, hpMul: 3.1, atkMul: 1.65 },
    reward: { jade: 140, mats: [{ id: 'yunwen', count: 3 }] },
  },
  {
    floor: 7, name: '试炼 · 炉心',
    desc: '炉火不熄，旧匠人的名字还在火里。',
    rule: '炉心傀每回合灼烧，火、土属伤害增加；护盾更厚。',
    boss: { ref: 'luxinkui', lv: 37, hpMul: 3.2, atkMul: 1.7 },
    reward: { jade: 180, mats: [{ id: 'luxin', count: 3 }] },
  },
  {
    floor: 8, name: '试炼 · 天根',
    desc: '山至此尽，根由此生。最后一问，问的是你自己。',
    rule: '天根兽每回合回气，五行克制减半；祖形阶段全属伤害上升。',
    boss: { ref: 'tiangen', lv: 40, hpMul: 3.4, atkMul: 1.8 },
    reward: { jade: 240, items: [{ id: 'jiuzhuan', count: 1 }] },
  },
];
