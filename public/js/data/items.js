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
};
