// 灵兽录 · 数据层 · 内容工具与校验
// ---------- 工具 ----------
// 读取当前主线章节（载入时不执行）
function chapterNow() {
  if (typeof LB === 'undefined' || !LB.saveState) return 1;
  var s = LB.saveState();
  return (s && s.chapter) || 1;
}

// ---------- 内容校验 ----------
// 返回错误数组；主控在启动时输出到控制台
function validateContent() {
  var errs = [];
  var id;

  function inRegion(region, x, y) {
    return region && x >= 0 && y >= 0 && x < region.w && y < region.h;
  }

  function reachSet(region) {
    var seen = {};
    var queue = [[region.spawn.x, region.spawn.y]];
    seen[region.spawn.x + ',' + region.spawn.y] = 1;
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
      var p = queue.shift();
      for (var i = 0; i < 4; i += 1) {
        var nx = p[0] + dirs[i][0], ny = p[1] + dirs[i][1];
        if (nx < 0 || ny < 0 || nx >= region.w || ny >= region.h) continue;
        if (!WALKABLE[region.tiles[ny][nx]]) continue;
        var k = nx + ',' + ny;
        if (seen[k]) continue;
        seen[k] = 1;
        queue.push([nx, ny]);
      }
    }
    return seen;
  }

  // 区域
  REGION_ORDER.forEach(function (rid) {
    var r = REGIONS[rid];
    if (!r) { errs.push('REGION_ORDER 指向不存在的区域：' + rid); return; }
    if (!inRegion(r, r.spawn.x, r.spawn.y) || r.tiles[r.spawn.y][r.spawn.x] !== 'S') {
      errs.push('区域 ' + rid + ' 的出生点不是 S 瓦片');
    }
    var seen = reachSet(r);
    (r.exits || []).forEach(function (ex) {
      if (!REGIONS[ex.to]) errs.push('区域 ' + rid + ' 的出口指向不存在的区域：' + ex.to);
      if (!inRegion(r, ex.x, ex.y) || r.tiles[ex.y][ex.x] !== 'E') {
        errs.push('区域 ' + rid + ' 的出口 ' + ex.to + ' 不在 E 瓦片上');
      } else if (!seen[ex.x + ',' + ex.y]) {
        errs.push('区域 ' + rid + ' 的出口 ' + ex.to + ' 不可达');
      }
    });
    if (r.boss && !BOSSES[r.boss]) errs.push('区域 ' + rid + ' 引用了不存在的 Boss：' + r.boss);
    (r.pool || []).forEach(function (p) {
      if (!SPECIES[p.sp]) errs.push('区域 ' + rid + ' 的遭遇池含有不存在的灵兽：' + p.sp);
    });
    (r.steles || []).forEach(function (st) {
      if (!CODEX[st.codex]) errs.push('区域 ' + rid + ' 的碑文 ' + st.id + ' 引用了不存在的山海志：' + st.codex);
      if (!inRegion(r, st.x, st.y)) errs.push('区域 ' + rid + ' 的碑文 ' + st.id + ' 越界');
    });
    ['npcs', 'herbs', 'chests', 'gathers'].forEach(function (kind) {
      (r[kind] || []).forEach(function (e) {
        if (!inRegion(r, e.x, e.y)) errs.push('区域 ' + rid + ' 的 ' + kind + ' ' + (e.id || '?') + ' 越界');
        else if (!seen[e.x + ',' + e.y]) errs.push('区域 ' + rid + ' 的 ' + kind + ' ' + (e.id || '?') + ' 不可达');
      });
    });
    if (r.boss && BOSSES[r.boss] && !seen[BOSSES[r.boss].x + ',' + BOSSES[r.boss].y]) {
      errs.push('区域 ' + rid + ' 的 Boss ' + r.boss + ' 不可达');
    }
  });
  REGION_ORDER.forEach(function (rid) { if (!REGIONS[rid]) errs.push('区域缺失：' + rid); });

  // 大陆图册一致性
  if (typeof WORLD_ATLAS !== 'undefined') {
    var ag = WORLD_ATLAS.grid;
    var occupied = {};
    function markPlot(pid, at, size) {
      for (var py = 0; py < size[1]; py += 1) {
        for (var px = 0; px < size[0]; px += 1) {
          var gx = at[0] + px, gy = at[1] + py;
          if (gx < 0 || gy < 0 || gx >= ag.w || gy >= ag.h) errs.push('大陆图地块越界：' + pid);
          var gk = gx + ',' + gy;
          if (occupied[gk]) errs.push('大陆图地块重叠：' + pid + ' 与 ' + occupied[gk] + ' @ ' + gk);
          occupied[gk] = pid;
        }
      }
    }
    Object.keys(WORLD_ATLAS.regions).forEach(function (rid2) {
      var a = WORLD_ATLAS.regions[rid2];
      var r2 = REGIONS[rid2];
      if (a.built && !r2) errs.push('大陆图标记已建但区域缺失：' + rid2);
      if (r2 && !a) errs.push('区域缺少大陆图条目：' + rid2);
      if (r2 && a && !a.built) errs.push('区域已存在但图册未标记 built：' + rid2);
      if (!a) return;
      markPlot(rid2, a.at, a.size);
      if (r2 && r2.kind !== a.kind) errs.push('区域 ' + rid2 + ' 的 kind 与图册不一致');
      if (r2 && r2.unlock && r2.unlock.quest) {
        var uq = SIDE_QUESTS.some(function (q) { return q.id === r2.unlock.quest; });
        if (!uq) errs.push('区域 ' + rid2 + ' 解锁支线不存在：' + r2.unlock.quest);
      }
    });
    (WORLD_ATLAS.reserved || []).forEach(function (b, bi) { markPlot('reserved-' + bi, b.at, b.size); });
    (WORLD_ATLAS.routes || []).forEach(function (pair) {
      if (!WORLD_ATLAS.regions[pair[0]] || !WORLD_ATLAS.regions[pair[1]]) {
        errs.push('大陆图路线端点不存在：' + pair[0] + ' - ' + pair[1]);
      }
    });
  }

  // Boss
  Object.keys(BOSSES).forEach(function (bid) {
    var b = BOSSES[bid];
    var r = REGIONS[b.region];
    if (!r) { errs.push('Boss ' + bid + ' 指向不存在的区域：' + b.region); return; }
    if (r.boss !== bid) errs.push('Boss ' + bid + ' 与区域 ' + b.region + ' 的 boss 字段不一致');
    if (!SPECIES[b.sp]) errs.push('Boss ' + bid + ' 引用不存在的灵兽：' + b.sp);
    if (b.el && !ELEMENTS[b.el]) errs.push('Boss ' + bid + ' 的五行不存在：' + b.el);
    if (!inRegion(r, b.x, b.y)) errs.push('Boss ' + bid + ' 坐标越界');
    if (!['aggressive', 'guardian', 'healer', 'trickster'].includes(b.ai)) {
      errs.push('Boss ' + bid + ' 的 AI 原型无效：' + b.ai);
    }
    if (b.cannotCatch !== true) errs.push('Boss ' + bid + ' 未标记不可结契');
    if (!b.phases || b.phases.length < 2) errs.push('Boss ' + bid + ' 缺少 60%/30% 阶段提示');
  });

  // 灵兽与技能
  Object.keys(SPECIES).forEach(function (sid) {
    var sp = SPECIES[sid];
    if (!ELEMENTS[sp.el]) errs.push('灵兽 ' + sid + ' 的五行不存在：' + sp.el);
    if (!ELEMENTS[sp.weakness]) errs.push('灵兽 ' + sid + ' 的弱点不存在：' + sp.weakness);
    if (!sp.sk || sp.sk.length !== 4) errs.push('灵兽 ' + sid + ' 应有 4 个技能');
    (sp.sk || []).forEach(function (entry) {
      if (!SKILLS[entry[1]]) errs.push('灵兽 ' + sid + ' 引用不存在的技能：' + entry[1]);
    });
    if (sp.evolve) {
      if (!SPECIES[sp.evolve.to]) errs.push('灵兽 ' + sid + ' 进化目标不存在：' + sp.evolve.to);
      (sp.evolve.mats || []).forEach(function (m) {
        if (!MATERIALS[m.id]) errs.push('灵兽 ' + sid + ' 的进化材料不存在：' + m.id);
      });
    }
    if (sp.evolved && sp.wild !== false) errs.push('进化形态 ' + sid + ' 不应参与野外结契');
  });
  Object.keys(SKILLS).forEach(function (kid) {
    var sk = SKILLS[kid];
    if (!ELEMENTS[sk.el]) errs.push('技能 ' + kid + ' 的五行不存在：' + sk.el);
    if (sk.status && !STATUSES[sk.status]) errs.push('技能 ' + kid + ' 引用了不存在的状态：' + sk.status);
  });

  // 道具、材料、配方、商店
  Object.keys(ITEMS).forEach(function (iid) { if (!ITEMS[iid].name) errs.push('道具 ' + iid + ' 缺少名称'); });
  Object.keys(MATERIALS).forEach(function (mid) {
    var m = MATERIALS[mid];
    (m.regions || []).forEach(function (rid) { if (!REGIONS[rid]) errs.push('材料 ' + mid + ' 指向不存在的区域：' + rid); });
  });
  Object.keys(RECIPES).forEach(function (rid) {
    var rec = RECIPES[rid];
    if (!ITEMS[rec.out.item]) errs.push('配方 ' + rid + ' 的产物不存在：' + rec.out.item);
    (rec.mats || []).forEach(function (m) {
      if (!MATERIALS[m.id]) errs.push('配方 ' + rid + ' 的材料不存在：' + m.id);
    });
    if (rec.unlock && rec.unlock.kind === 'quest') {
      var hasQuest = SIDE_QUESTS.some(function (q) { return q.id === rec.unlock.id; });
      if (!hasQuest) errs.push('配方 ' + rid + ' 解锁的支线不存在：' + rec.unlock.id);
    }
    if (rec.unlock && rec.unlock.kind === 'stele') {
      var hasStele = Object.keys(REGIONS).some(function (regionId) {
        return (REGIONS[regionId].steles || []).some(function (st) { return st.id === rec.unlock.id; });
      });
      if (!hasStele) errs.push('配方 ' + rid + ' 解锁的碑文不存在：' + rec.unlock.id);
    }
  });
  Object.keys(SHOPS).forEach(function (sid) {
    var shop = SHOPS[sid];
    if (!REGIONS[shop.region]) errs.push('商店 ' + sid + ' 指向不存在的区域：' + shop.region);
    (shop.stock || []).forEach(function (s) {
      if (!ITEMS[s.item] && !MATERIALS[s.item]) errs.push('商店 ' + sid + ' 售卖不存在的物品：' + s.item);
    });
  });
  SECRETS.forEach(function (sec) {
    var sr = REGIONS[sec.region];
    if (!sr) { errs.push('暗格 ' + sec.id + ' 指向不存在的区域：' + sec.region); return; }
    var st = sr.tiles[sec.y] && sr.tiles[sec.y][sec.x];
    if (!WALKABLE[st]) errs.push('暗格 ' + sec.id + ' 不在可通行格：' + sec.x + ',' + sec.y);
    if (sec.mat && !MATERIALS[sec.mat]) errs.push('暗格 ' + sec.id + ' 的材料不存在：' + sec.mat);
  });

  // 主线
  var usedBoss = {};
  MAIN_CHAPTERS.forEach(function (ch) {
    if (!REGIONS[ch.region]) errs.push('主线 ' + ch.id + ' 指向不存在的区域：' + ch.region);
    (ch.objectives || []).forEach(function (ob, i) {
      if (ob.type === 'boss') {
        if (!BOSSES[ob.key]) errs.push('主线 ' + ch.id + ' 目标 ' + i + ' 的 Boss 不存在：' + ob.key);
        usedBoss[ob.key] = 1;
      } else if (ob.type === 'region') {
        if (!REGIONS[ob.key]) errs.push('主线 ' + ch.id + ' 目标 ' + i + ' 的区域不存在：' + ob.key);
      } else if (ob.type === 'talk') {
        var hasNpc = Object.keys(REGIONS).some(function (rid) {
          return (REGIONS[rid].npcs || []).some(function (n) { return n.id === ob.key; });
        });
        if (!hasNpc) errs.push('主线 ' + ch.id + ' 目标 ' + i + ' 的 NPC 不存在：' + ob.key);
      } else if (ob.type === 'item') {
        if (!ITEMS[ob.key] && !MATERIALS[ob.key]) errs.push('主线 ' + ch.id + ' 目标 ' + i + ' 的物品不存在：' + ob.key);
      } else if (['flag', 'catch', 'count'].indexOf(ob.type) < 0) {
        errs.push('主线 ' + ch.id + ' 目标 ' + i + ' 的类型无效：' + ob.type);
      }
    });
  });
  Object.keys(BOSSES).forEach(function (bid) {
    if (!usedBoss[bid] && !BOSSES[bid].side) errs.push('Boss ' + bid + ' 未进入任何主线章节');
  });

  // 支线
  SIDE_QUESTS.forEach(function (q) {
    var r = REGIONS[q.giver.region];
    if (!r) { errs.push('支线 ' + q.id + ' 的发布区域不存在：' + q.giver.region); return; }
    if (!(r.npcs || []).some(function (n) { return n.id === q.giver.npc; })) {
      errs.push('支线 ' + q.id + ' 的发布 NPC 不在该区域：' + q.giver.npc);
    }
    if (typeof q.reward !== 'function') errs.push('支线 ' + q.id + ' 缺少 reward');
    if (q.stages && q.stages.length) {
      q.stages.forEach(function (st, i) {
        if (!st || (!st.flag && typeof st.check !== 'function')) {
          errs.push('支线 ' + q.id + ' 第 ' + (i + 1) + ' 阶段缺少完成条件');
        }
      });
    } else if (typeof q.check !== 'function') {
      errs.push('支线 ' + q.id + ' 缺少 check');
    }
  });
  if (SIDE_QUESTS.length < 12) errs.push('支线数量不足 12');

  // 悬赏
  BOUNTIES.forEach(function (b) {
    if (b.type === 'hunt' || b.type === 'patrol') {
      if (!REGIONS[b.target]) errs.push('悬赏 ' + b.id + ' 的目标区域不存在：' + b.target);
    } else if (b.type === 'gather') {
      if (!MATERIALS[b.target]) errs.push('悬赏 ' + b.id + ' 的目标材料不存在：' + b.target);
    } else {
      errs.push('悬赏 ' + b.id + ' 的类型无效：' + b.type);
    }
  });

  // 山海志
  var codexIds = Object.keys(CODEX);
  Object.keys(CODEX).forEach(function (cid) {
    var c = CODEX[cid];
    if (c.unlock && c.unlock.type === 'stele') {
      var okStele = Object.keys(REGIONS).some(function (rid) {
        return (REGIONS[rid].steles || []).some(function (st) { return st.id === c.unlock.id; });
      });
      if (!okStele) errs.push('山海志 ' + cid + ' 解锁的碑文不存在：' + c.unlock.id);
    }
    if (c.unlock && c.unlock.type === 'npc') {
      var okNpc = Object.keys(REGIONS).some(function (rid) {
        return (REGIONS[rid].npcs || []).some(function (n) { return n.id === c.unlock.id; });
      });
      if (!okNpc) errs.push('山海志 ' + cid + ' 解锁的 NPC 不存在：' + c.unlock.id);
    }
  });
  if (codexIds.length < 12) errs.push('山海志词条应不少于 12 条');

  // 试炼
  TRIALS.forEach(function (t) {
    if (!BOSSES[t.boss.ref]) errs.push('试炼 ' + t.floor + ' 引用的 Boss 不存在：' + t.boss.ref);
  });
  if (TRIALS.length !== 8) errs.push('试炼层数应为 8');

  // 灵器与套装
  Object.keys(GEAR).forEach(function (gid) {
    var g = GEAR[gid];
    if (!g.name) errs.push('灵器 ' + gid + ' 缺少名称');
    if (!GEAR_SLOTS[g.slot]) errs.push('灵器 ' + gid + ' 的槽位无效：' + g.slot);
    if (!GEAR_RARITY[g.rarity]) errs.push('灵器 ' + gid + ' 的稀有度无效：' + g.rarity);
    if (g.set && !GEAR_SETS[g.set]) errs.push('灵器 ' + gid + ' 引用了不存在的套装：' + g.set);
    Object.keys(g.mods || {}).forEach(function (key) {
      if (GEAR_MOD_KEYS.indexOf(key) < 0) errs.push('灵器 ' + gid + ' 的词条无效：' + key);
    });
  });
  Object.keys(GEAR_SETS).forEach(function (sid) {
    var set = GEAR_SETS[sid];
    if (!set.name) errs.push('套装 ' + sid + ' 缺少名称');
    Object.keys(set.bonus || {}).forEach(function (key) {
      if (GEAR_MOD_KEYS.indexOf(key) < 0) errs.push('套装 ' + sid + ' 的词条无效：' + key);
    });
    if (!set.members || set.members.length < 2) errs.push('套装 ' + sid + ' 至少需要 2 件');
    (set.members || []).forEach(function (gid) {
      if (!GEAR[gid]) errs.push('套装 ' + sid + ' 的成员不存在：' + gid);
      else if (GEAR[gid].set !== sid) errs.push('灵器 ' + gid + ' 的 set 字段与套装 ' + sid + ' 不一致');
    });
  });
  REGION_ORDER.forEach(function (rid) {
    var r = REGIONS[rid];
    if (!r) return;
    (r.chests || []).forEach(function (chest) {
      if (chest.gear && !GEAR[chest.gear]) errs.push('区域 ' + rid + ' 的宝箱 ' + chest.id + ' 引用了不存在的灵器：' + chest.gear);
    });
  });
  Object.keys(BOSSES).forEach(function (bid) {
    if (BOSSES[bid].gear && !GEAR[BOSSES[bid].gear]) {
      errs.push('Boss ' + bid + ' 的首杀灵器不存在：' + BOSSES[bid].gear);
    }
  });

  // 剧情抉择
  var choiceIds = {};
  var choiceRegions = {};
  var validRep = ['shanmen', 'yaolu', 'tiangongsi', 'guixu', 'chiyuan', 'shenyuan'];
  STORY_CHOICES.forEach(function (q) {
    if (choiceIds[q.id]) errs.push('抉择 id 重复：' + q.id);
    choiceIds[q.id] = 1;
    var r = REGIONS[q.region];
    if (!r) { errs.push('抉择 ' + q.id + ' 的区域不存在：' + q.region); return; }
    choiceRegions[q.region] = 1;
    var npc = null;
    (r.npcs || []).forEach(function (n) { if (n.id === q.npc) npc = n; });
    if (!npc) errs.push('抉择 ' + q.id + ' 的 NPC 不存在：' + q.npc);
    else if (npc.service && npc.service !== 'main') errs.push('抉择 ' + q.id + ' 挂在服务 NPC 上：' + q.npc);
    if (!(q.chapter >= 1 && q.chapter <= 12)) errs.push('抉择 ' + q.id + ' 的章节无效：' + q.chapter);
    if (!q.prompt) errs.push('抉择 ' + q.id + ' 缺少 prompt');
    if (!q.options || q.options.length < 2 || q.options.length > 3) {
      errs.push('抉择 ' + q.id + ' 的选项应为 2-3 个');
    }
    (q.options || []).forEach(function (opt, oi) {
      if (!opt.label) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 缺少 label');
      if (!opt.response) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 缺少 response');
      if (opt.stance !== undefined && (typeof opt.stance !== 'number' || opt.stance < -2 || opt.stance > 2)) {
        errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的倾向值无效');
      }
      if (opt.gear && !GEAR[opt.gear]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的灵器不存在：' + opt.gear);
      (opt.items || []).forEach(function (it) {
        if (!ITEMS[it.id]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的道具不存在：' + it.id);
      });
      (opt.mats || []).forEach(function (m) {
        if (!MATERIALS[m.id]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的材料不存在：' + m.id);
      });
      if (opt.passive && !PASSIVES[opt.passive]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的灵诀不存在：' + opt.passive);
      if (opt.recipe && !RECIPES[opt.recipe]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的配方不存在：' + opt.recipe);
      if (opt.codex && !CODEX[opt.codex]) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的山海志不存在：' + opt.codex);
      if (opt.rep) {
        Object.keys(opt.rep).forEach(function (key) {
          if (validRep.indexOf(key) < 0) errs.push('抉择 ' + q.id + ' 选项 ' + oi + ' 的声望键无效：' + key);
        });
      }
    });
  });
  if (STORY_CHOICES.length < 8) errs.push('抉择数量不足 8');
  REGION_ORDER.forEach(function (rid) {
    var rr = REGIONS[rid];
    if (rr && rr.kind === 'main' && rr.chapter >= 1 && rr.chapter <= 8 && !choiceRegions[rid]) {
      errs.push('区域 ' + rid + ' 缺少剧情抉择');
    }
  });

  return errs;
}
