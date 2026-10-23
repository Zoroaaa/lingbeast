// 灵兽录 · 主控层 · 剧情抉择、倾向与声望

function stance() {
  return state ? (Number(state.stance) || 0) : 0;
}

function stanceLabel() {
  const v = stance();
  if (v > 0) return '契心';
  if (v < 0) return '断契';
  return '两难';
}

function stanceSummary() {
  const v = stance();
  const label = stanceLabel();
  if (v > 0) return label + ' +' + v;
  if (v < 0) return label + ' ' + v;
  return label + ' 0';
}

function repOf(id) {
  return state && state.rep ? (Number(state.rep[id]) || 0) : 0;
}

function giveRep(id, n) {
  if (!state || REP_KEYS.indexOf(id) < 0) return;
  if (!state.rep) state.rep = {};
  state.rep[id] = clampInt((Number(state.rep[id]) || 0) + (Number(n) || 0), -3, 3);
}

function findChoice(id) {
  if (typeof STORY_CHOICES === 'undefined') return null;
  for (let i = 0; i < STORY_CHOICES.length; i += 1) {
    if (STORY_CHOICES[i].id === id) return STORY_CHOICES[i];
  }
  return null;
}

function choiceDone(id) {
  return !!(state && state.choices && state.choices[id]);
}

function choiceUnlocked(q) {
  if (!state || !q) return false;
  if ((state.chapter || 1) < (q.chapter || 1)) return false;
  if (choiceDone(q.id)) return false;
  if (typeof q.when === 'function') {
    try { return !!q.when(); } catch (e) { return false; }
  }
  return true;
}

function choiceForNpc(npc) {
  if (!state || !npc || typeof STORY_CHOICES === 'undefined') return null;
  for (let i = 0; i < STORY_CHOICES.length; i += 1) {
    const q = STORY_CHOICES[i];
    if (q.npc !== npc.id) continue;
    if (choiceUnlocked(q)) return q;
  }
  return null;
}

function choiceList() {
  if (typeof STORY_CHOICES === 'undefined') return [];
  return STORY_CHOICES.map(function (q) {
    const rec = state && state.choices ? state.choices[q.id] : null;
    const done = !!rec;
    const option = done && q.options[rec.option] ? q.options[rec.option] : null;
    const region = REGIONS[q.region] || null;
    let npcName = q.npc;
    if (region) {
      (region.npcs || []).forEach(function (npc) { if (npc.id === q.npc) npcName = npc.name; });
    }
    return {
      id: q.id,
      title: q.title,
      prompt: q.prompt,
      hint: q.hint || '',
      region: q.region,
      regionName: region ? region.name : q.region,
      npc: q.npc,
      npcName: npcName,
      chapter: q.chapter || 1,
      available: choiceUnlocked(q),
      done: done,
      optionIndex: done ? rec.option : -1,
      optionLabel: option ? option.label : '',
      optionHint: option ? option.hint || '' : '',
      optionResponse: option ? option.response || '' : '',
      options: q.options.map(function (opt) { return { label: opt.label, hint: opt.hint || '' }; }),
    };
  });
}

function maybeOpenChoice(npc) {
  const q = choiceForNpc(npc);
  if (!q) return false;
  if (typeof showChoice !== 'function') return false;
  showChoice(npc.name, q.prompt, q.options.map(function (opt) {
    return { label: opt.label, hint: opt.hint || '' };
  }), null, function (optionIndex) {
    return applyChoice(q.id, optionIndex);
  });
  return true;
}

function applyChoice(id, optionIndex) {
  const q = findChoice(id);
  if (!state || !q) return '';
  if (choiceDone(id)) return '';
  const index = Number(optionIndex);
  const opt = q.options[index];
  if (!opt) return '';

  if (!state.choices) state.choices = {};
  state.choices[id] = { option: index, at: Date.now() };

  if (opt.stance) {
    state.stance = clampInt((Number(state.stance) || 0) + Number(opt.stance), -20, 20);
  }
  if (opt.rep) {
    Object.keys(opt.rep).forEach(function (faction) { giveRep(faction, opt.rep[faction]); });
  }
  if (opt.jade) giveJade(opt.jade);
  (opt.items || []).forEach(function (it) { giveItem(it.id, it.count || 1); });
  (opt.mats || []).forEach(function (m) { giveMaterial(m.id, m.count || 1); });
  if (opt.gear) giveGear(opt.gear);
  if (opt.passive) givePassive(opt.passive);
  if (opt.flags) {
    Object.keys(opt.flags).forEach(function (key) { flagSet(key, opt.flags[key]); });
  }

  persist();
  updateHud();
  checkSideQuests();
  return opt.response || '';
}

function endingEchoes(kind) {
  const table = kind === 'new'
    ? [
      ['streamAsked', '青溪的桥下，水让了一线。'],
      ['formulaKept', '雾隐的药庐还开着，学徒在背一张方子。'],
      ['songReturned', '归墟的潮里，又有人唱起没有词的歌。'],
      ['dreamsReturned', '云梦泽上的人醒了一半。'],
      ['emberKept', '赤渊的火种还在坛心，遗民过了冬。'],
      ['nameReturned', '归墟深处少了一张脸，多了一个人。'],
    ]
    : [
      ['bridgeForced', '青溪的桥桩落得很实，溪水绕开了。'],
      ['formulaSold', '雾隐的药庐关了半扇门。'],
      ['songSold', '归墟的潮里少了一阕歌。'],
      ['dreamsSold', '云梦泽的雾比往年更厚。'],
      ['emberForged', '赤渊的铃声很清，遗民没有再来坛前。'],
      ['nameKept', '无相的脸又多了一张。'],
    ];
  const out = [];
  table.forEach(function (row) {
    if (out.length >= 3) return;
    if (flag(row[0])) out.push(row[1]);
  });
  return out;
}

LB.choiceDone = choiceDone;
LB.choiceList = choiceList;
LB.applyChoice = applyChoice;
LB.maybeOpenChoice = maybeOpenChoice;
LB.stance = stance;
LB.stanceLabel = stanceLabel;
LB.stanceSummary = stanceSummary;
LB.repOf = repOf;
LB.giveRep = giveRep;
LB.endingEchoes = endingEchoes;
