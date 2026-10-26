// 灵兽录 · 数据层 · 材料、道具、配方与商店
// ---------- 材料 ----------
const MATERIALS = {
  lucao: { name: '露生草', desc: '叶上有露者活，无露者已被锁。', price: 6, regions: ['qingxi', 'wuyin', 'yunmeng'] },
  xingxie: { name: '星屑', desc: '陨星落地后留下的细砂，夜里微亮。', price: 30, regions: ['luoxing', 'shenyuan'] },
  haiyan: { name: '海盐', desc: '退潮时刮下的盐霜，性温，能定灵息。', price: 18, regions: ['guixu', 'yunmeng'] },
  tanzha: { name: '烬炭', desc: '烧不透的黑炭，碰一下会亮。', price: 20, regions: ['gutan', 'luoxing'] },
  shensha: { name: '蜃砂', desc: '蜃气凝成的细砂，握久了会看见旧事。', price: 26, regions: ['guixu', 'yunmeng'] },
  lingmu: { name: '灵木', desc: '灵脉边生长的木心，纹理如水。', price: 12, regions: ['shanmen', 'wuyin', 'shenyuan'] },
  xuantie: { name: '玄铁', desc: '铸锁灵器的旧料，如今只用来补灵笼。', price: 28, regions: ['luoxing', 'gutan'] },
  yunwen: { name: '云纹石', desc: '风蚀出的薄石，纹路像一层层退去的云。', price: 34, regions: ['yunzhan', 'jiuzhang'] },
  luxin: { name: '炉心炭', desc: '玄炉心口取下的炭，隔着手套也烫。', price: 38, regions: ['xuangu'] },
  chenzhu: { name: '沉珠', desc: '沉城潮渠底的珠子，含在嘴里能听见旧街。', price: 40, regions: ['chenyu'] },
  chaoyanjing: { name: '潮盐晶', desc: '潮线退尽后结出的盐晶，能压住水腥。', price: 26, regions: ['chenyu'] },
  tiangenxu: { name: '天根须', desc: '天根最细的一缕，离土仍会微微抽动。', price: 60, regions: ['jiuzhang'] },
  leisui: { name: '雷髓', desc: '云栈雷雨里凝下的白髓，轻得像一口气。', price: 44, regions: ['yunzhan'] },
  yaopuhua: { name: '药圃花', desc: '药圃里最普通的一朵，却能安住乱掉的灵息。', price: 16, regions: ['yaopu'] },
};

// ---------- 道具 ----------
const ITEMS = {
  pill: { name: '丹药', desc: '寻常回气丹，回复四十点气血。', price: 30, battle: true, use: 'heal', value: 40 },
  great_pill: { name: '大还丹', desc: '丹房重器，回复一百二十点气血。', price: 120, battle: true, use: 'heal', value: 120 },
  charm: { name: '灵符', desc: '以灵息引契，结契成功率提升一成八。', price: 25, battle: true, use: 'catch' },
  cleanse: { name: '清心散', desc: '清去灼烧、腐蚀、迟滞与破甲。', price: 40, battle: true, use: 'cleanse' },
  revive: { name: '归元丹', desc: '唤回一只力竭的灵兽，回复半数气血。', price: 150, battle: true, use: 'revive', value: 0.5 },
  incense: { name: '引灵香', desc: '焚香引灵，下一场遭遇的稀有灵兽出现率上升。', price: 60, battle: false, use: 'incense' },
  escape: { name: '遁地符', desc: '立刻脱离遭遇，Boss 战不可用。', price: 45, battle: true, use: 'escape' },
  cage: { name: '灵笼', desc: '契的容器。可在灵兽栏升级容量与结契成功率。', price: 200, battle: false, use: 'upgrade' },
  yunwu: { name: '云雾丹', desc: '云栈药方，回复六十点气血，兼定迟滞。', price: 70, battle: true, use: 'heal', value: 60 },
  xuanyuan: { name: '玄元丹', desc: '玄炉重炼，回复一百六十点气血。', price: 180, battle: true, use: 'heal', value: 160 },
  pozhan: { name: '破障丹', desc: '破去灼烧、腐蚀、迟滞与破甲。', price: 60, battle: true, use: 'cleanse' },
  chenshui: { name: '沉水符', desc: '潮下脱身用的旧符，立刻脱离遭遇。', price: 55, battle: true, use: 'escape' },
  yinlei: { name: '引雷符', desc: '以雷髓引雷入体，蓄势两回合。', price: 80, battle: true, use: 'focus', value: 2 },
  guixu_san: { name: '归墟散', desc: '旧海市配的伤药，回复九十点气血。', price: 100, battle: true, use: 'heal', value: 90 },
  tiangen_lu: { name: '天根露', desc: '天根须上凝的露，回复二百四十点气血。', price: 260, battle: true, use: 'heal', value: 240 },
  jiuzhuan: { name: '九转丹', desc: '唤回一只力竭灵兽，并回满气血。', price: 320, battle: true, use: 'revive', value: 1 },
};

// ---------- 配方 ----------
// unlock: { kind: 'start' | 'quest' | 'codex' | 'stele', id? }
const RECIPES = {
  recipe_pill: {
    id: 'recipe_pill', name: '小还丹方', out: { item: 'pill', count: 2 },
    mats: [{ id: 'lucao', count: 2 }, { id: 'lingmu', count: 1 }], jade: 10,
    unlock: { kind: 'start' },
  },
  recipe_great_pill: {
    id: 'recipe_great_pill', name: '大还丹方', out: { item: 'great_pill', count: 1 },
    mats: [{ id: 'lucao', count: 4 }, { id: 'shensha', count: 1 }], jade: 30,
    unlock: { kind: 'codex', id: 'wuyinyaolu' },
  },
  recipe_charm: {
    id: 'recipe_charm', name: '灵符方', out: { item: 'charm', count: 2 },
    mats: [{ id: 'lingmu', count: 2 }], jade: 12,
    unlock: { kind: 'start' },
  },
  recipe_cleanse: {
    id: 'recipe_cleanse', name: '清心散方', out: { item: 'cleanse', count: 2 },
    mats: [{ id: 'lucao', count: 2 }, { id: 'shensha', count: 1 }], jade: 18,
    unlock: { kind: 'stele', id: 'wuyin_stele2' },
  },
  recipe_revive: {
    id: 'recipe_revive', name: '归元丹方', out: { item: 'revive', count: 1 },
    mats: [{ id: 'xingxie', count: 1 }, { id: 'shensha', count: 2 }, { id: 'xuantie', count: 1 }], jade: 60,
    unlock: { kind: 'quest', id: 'ember' },
  },
  recipe_incense: {
    id: 'recipe_incense', name: '引灵香方', out: { item: 'incense', count: 1 },
    mats: [{ id: 'shensha', count: 1 }, { id: 'lingmu', count: 2 }], jade: 25,
    unlock: { kind: 'stele', id: 'yunmeng_stele1' },
  },
  recipe_escape: {
    id: 'recipe_escape', name: '遁地符方', out: { item: 'escape', count: 2 },
    mats: [{ id: 'shensha', count: 1 }, { id: 'xingxie', count: 1 }], jade: 30,
    unlock: { kind: 'quest', id: 'dream' },
  },
  recipe_cage: {
    id: 'recipe_cage', name: '灵笼升级法', out: { item: 'cage', count: 1 },
    mats: [{ id: 'xuantie', count: 2 }, { id: 'lingmu', count: 3 }], jade: 40,
    unlock: { kind: 'quest', id: 'hammer' },
  },
  recipe_yunwu: {
    id: 'recipe_yunwu', name: '云雾丹方', out: { item: 'yunwu', count: 2 },
    mats: [{ id: 'yunwen', count: 1 }, { id: 'lucao', count: 3 }], jade: 35,
    unlock: { kind: 'stele', id: 'yunzhan_stele2' },
  },
  recipe_xuanyuan: {
    id: 'recipe_xuanyuan', name: '玄元丹方', out: { item: 'xuanyuan', count: 1 },
    mats: [{ id: 'luxin', count: 1 }, { id: 'shensha', count: 2 }], jade: 70,
    unlock: { kind: 'stele', id: 'xuangu_stele1' },
  },
  recipe_pozhan: {
    id: 'recipe_pozhan', name: '破障丹方', out: { item: 'pozhan', count: 2 },
    mats: [{ id: 'luxin', count: 1 }, { id: 'lucao', count: 2 }], jade: 45,
    unlock: { kind: 'stele', id: 'xuangu_stele4' },
  },
  recipe_chenshui: {
    id: 'recipe_chenshui', name: '沉水符方', out: { item: 'chenshui', count: 2 },
    mats: [{ id: 'chenzhu', count: 1 }, { id: 'chaoyanjing', count: 1 }], jade: 48,
    unlock: { kind: 'stele', id: 'chenyu_stele4' },
  },
  recipe_yinlei: {
    id: 'recipe_yinlei', name: '引雷符方', out: { item: 'yinlei', count: 1 },
    mats: [{ id: 'leisui', count: 1 }, { id: 'yunwen', count: 1 }], jade: 55,
    unlock: { kind: 'stele', id: 'yunzhan_stele3' },
  },
  recipe_guixu_san: {
    id: 'recipe_guixu_san', name: '归墟散方', out: { item: 'guixu_san', count: 1 },
    mats: [{ id: 'chenzhu', count: 1 }, { id: 'haiyan', count: 2 }], jade: 60,
    unlock: { kind: 'quest', id: 'anshi_debt' },
  },
  recipe_tiangen_lu: {
    id: 'recipe_tiangen_lu', name: '天根露方', out: { item: 'tiangen_lu', count: 1 },
    mats: [{ id: 'tiangenxu', count: 1 }, { id: 'yunwen', count: 2 }], jade: 90,
    unlock: { kind: 'stele', id: 'jiuzhang_stele2' },
  },
  recipe_jiuzhuan: {
    id: 'recipe_jiuzhuan', name: '九转丹方', out: { item: 'jiuzhuan', count: 1 },
    mats: [{ id: 'tiangenxu', count: 2 }, { id: 'chenzhu', count: 2 }, { id: 'luxin', count: 2 }], jade: 120,
    unlock: { kind: 'quest', id: 'tian_steles' },
  },
};

// ---------- 商店 ----------
const SHOPS = {
  shanmen_shop: {
    id: 'shanmen_shop', name: '山门货铺', region: 'shanmen',
    stock: [
      { item: 'pill', price: 30, needChapter: 1 },
      { item: 'charm', price: 25, needChapter: 1 },
      { item: 'cleanse', price: 40, needChapter: 2 },
      { item: 'incense', price: 60, needChapter: 3 },
      { item: 'escape', price: 45, needChapter: 4 },
      { item: 'great_pill', price: 120, needChapter: 5 },
      { item: 'cage', price: 200, needChapter: 6 },
      { item: 'xingxie', price: 30, needChapter: 3 },
    ],
  },
  guixu_shop: {
    id: 'guixu_shop', name: '归墟行商', region: 'guixu',
    stock: [
      { item: 'haiyan', price: 18, needChapter: 4 },
      { item: 'shensha', price: 26, needChapter: 4 },
      { item: 'great_pill', price: 110, needChapter: 4 },
      { item: 'xuantie', price: 28, needChapter: 5 },
      { item: 'revive', price: 150, needChapter: 5 },
      { item: 'incense', price: 55, needChapter: 4 },
    ],
  },
  yunzhan_shop: {
    id: 'yunzhan_shop', name: '云市货摊', region: 'yunzhan',
    stock: [
      { item: 'yunwu', price: 70, needChapter: 9 },
      { item: 'cleanse', price: 40, needChapter: 9 },
      { item: 'yunwen', price: 34, needChapter: 9 },
      { item: 'leisui', price: 44, needChapter: 10 },
      { item: 'charm', price: 30, needChapter: 9 },
    ],
  },
  chenyu_shop: {
    id: 'chenyu_shop', name: '沉市货铺', region: 'chenyu',
    stock: [
      { item: 'guixu_san', price: 100, needChapter: 11 },
      { item: 'chenshui', price: 55, needChapter: 11 },
      { item: 'chenzhu', price: 40, needChapter: 11 },
      { item: 'chaoyanjing', price: 26, needChapter: 11 },
      { item: 'revive', price: 160, needChapter: 11 },
    ],
  },
  anshi_shop: {
    id: 'anshi_shop', name: '暗市摊位', region: 'anshi',
    stock: [
      { item: 'yinlei', price: 80, needChapter: 4 },
      { item: 'pozhan', price: 60, needChapter: 4 },
      { item: 'escape', price: 45, needChapter: 4 },
      { item: 'shensha', price: 30, needChapter: 4 },
      { item: 'great_pill', price: 120, needChapter: 4 },
    ],
  },
};
