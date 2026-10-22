// 灵兽录 · 数据层 · 主线 Boss
// ---------- 主线 Boss ----------
const BOSSES = {
  shougu: {
    id: 'shougu', name: '守谷灵', region: 'qingxi', sp: 'qingheng', lv: 6,
    hpMul: 1.9, atkMul: 1.2, ai: 'guardian', cannotCatch: true,
    x: 26, y: 8,
    line: '谷口的风忽然停了。石阶上一只鹿抬起头，角上蘅草无风自摇。',
    field: '守谷之阵：守谷灵立于旧契纹上，受击时有几率回气。',
    phases: [
      { at: 0.6, text: '它退到祭坛前，四蹄踏出旧契的纹路。', field: '旧契纹路：守谷灵防御上升，木属伤害增加。' },
      { at: 0.3, text: '蘅草尽折。它不再守，开始问。', field: '断角之怒：攻击上升，防御下降。', summon: '林间传来细碎的蹄声，两只青蘅鹿的影子围了上来。' },
    ],
  },
  wuyinxiao: {
    id: 'wuyinxiao', name: '雾隐魈', region: 'wuyin', sp: 'youmu', lv: 10,
    hpMul: 2.0, atkMul: 1.25, ai: 'trickster', cannotCatch: true,
    x: 30, y: 7,
    line: '雾里有一双不眨的眼。',
    field: '林雾锁息：每回合有几率使一方迟滞。',
    phases: [
      { at: 0.6, text: '雾忽然合拢，只余两点幽光。', field: '雾障：命中下降，木属伤害上升。' },
      { at: 0.3, text: '它开始笑，笑声从四个方向来。', field: '魈影分身：闪避与会心上升。', summon: '雾中走出与它一般高的影子。' },
    ],
  },
  xingyun: {
    id: 'xingyun', name: '星陨傀', region: 'luoxing', sp: 'xingxi', lv: 14,
    hpMul: 2.1, atkMul: 1.2, ai: 'aggressive', cannotCatch: true,
    x: 40, y: 9,
    line: '陨坑里的石头站了起来。',
    field: '星陨之地：土属伤害上升，落石更沉。',
    phases: [
      { at: 0.6, text: '它每一步都让地面下陷一寸。', field: '星核外露：攻击上升。' },
      { at: 0.3, text: '碎片从背甲里浮起，绕成一轮星环。', field: '星环：每回合反弹部分伤害。', summon: '矿坑深处传来铁链拖地之声。' },
    ],
  },
  suolingjiao: {
    id: 'suolingjiao', name: '锁灵鲛', region: 'guixu', sp: 'guixujiao', lv: 18,
    hpMul: 2.0, atkMul: 1.3, ai: 'aggressive', cannotCatch: true,
    x: 36, y: 34,
    line: '退潮的水里，有一条影子不肯走。',
    field: '锁灵渡口：水属伤害上升，结契成功率下降。',
    phases: [
      { at: 0.6, text: '它把尾鳍拍在栈桥上，木屑如雪。', field: '旧渡之怒：速度上升。' },
      { at: 0.3, text: '它唱起一段没有词的调子，海面静了。', field: '鲛歌：每回合流失气血。', summon: '潮水推来几只空灵笼。' },
    ],
  },
  shenmu: {
    id: 'shenmu', name: '蜃母', region: 'yunmeng', sp: 'yunmengbei', lv: 21,
    hpMul: 2.1, atkMul: 1.25, ai: 'healer', cannotCatch: true,
    x: 35, y: 10,
    line: '泽上的雾忽然有了轮廓。',
    field: '蜃气：每回合开始时随机一方获得护盾。',
    phases: [
      { at: 0.6, text: '雾里映出你走过的每一处山门。', field: '照心之雾：我方命中下降。' },
      { at: 0.3, text: '蜃母合上贝壳，泽面像镜子一样平。', field: '镜泽：蜃母每回合回复气血。', summon: '雾中走出几个与你一模一样的影子。' },
    ],
  },
  chiyuan: {
    id: 'chiyuan', name: '赤渊兽', region: 'gutan', sp: 'jiuyan', lv: 24,
    hpMul: 2.0, atkMul: 1.3, ai: 'aggressive', cannotCatch: true,
    x: 24, y: 10,
    line: '古坛裂开，火光自渊底升起。',
    field: '渊火：火属伤害上升，每回合灼烧。',
    phases: [
      { at: 0.6, text: '火从它脊背一路烧到尾尖。', field: '赤焰：攻击上升，附带灼烧。' },
      { at: 0.3, text: '它伏在坛前，像终于想起了自己的名字。', field: '旧名：防御上升，火属伤害暴涨。', summon: '坛底的锁链一根根断开。' },
    ],
  },
  wuxiang: {
    id: 'wuxiang', name: '无相', region: 'shenyuan', sp: 'youmu', lv: 28, el: 'metal',
    hpMul: 2.2, atkMul: 1.3, ai: 'trickster', cannotCatch: true,
    x: 31, y: 13,
    line: '殿里没有风，也没有人。只有一句话悬在半空。',
    field: '无相之殿：五行克制效果减半，锁灵器嗡鸣不止。',
    phases: [
      { at: 0.6, text: '你的影子先动了。', field: '借形：无相复制我方上一式。' },
      { at: 0.3, text: '它终于显出面目——那是你自己的脸。', field: '无面：无相属性随回合变化。', summon: '四壁的锁灵器同时亮起。' },
    ],
  },
};
