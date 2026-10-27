// 灵兽录 · 主控层 · 新手引导
// 六步路线：入谷 → 遭遇 → 削弱 → 结契 → 看队伍 → 过第一章
// 引导只用事件推进，不接管任何操作；随时可跳过，也可在设置里重看。

const TUTORIAL_STEPS = [
  { key: 'region:qingxi', eyebrow: '一 · 入谷', title: '走到青溪谷', hint: '沿山道向东北，雾色发青的谷口就是青溪。' },
  { key: 'battle:start', eyebrow: '二 · 遇灵', title: '遇一只野生灵兽', hint: '踩进草丛，灵息会自己找上来。' },
  { key: 'battle:weaken', eyebrow: '三 · 削弱', title: '把它的气血削到一半', hint: '灵兽越弱，结契越容易成。' },
  { key: 'catch:success', eyebrow: '四 · 结契', title: '结契收服它', hint: '点「结契」；有灵符就用，成功率再提一成八。' },
  { key: 'team:open', eyebrow: '五 · 队伍', title: '打开队伍看看它', hint: '按 T，或点顶部「队伍」，可换灵、佩灵诀。' },
  { key: 'chapter:2', eyebrow: '六 · 出师', title: '过守谷灵，走出第一章', hint: '回青溪谷深处，会一会守谷灵。' },
];

let tutorialBound = false;

function tutorialNow() {
  const s = typeof LB.saveState === 'function' ? LB.saveState() : null;
  return s && s.tutorial ? s.tutorial : null;
}

function bindTutorialCard() {
  if (tutorialBound) return;
  tutorialBound = true;
  const skip = document.getElementById('tc-skip');
  if (skip) skip.addEventListener('click', function () { skipTutorial(); });
}

function renderTutorial() {
  bindTutorialCard();
  const card = document.getElementById('tutorial-card');
  if (!card) return;
  const t = tutorialNow();
  const world = document.getElementById('view-world');
  if (!t || t.done || !world || world.hidden) {
    card.hidden = true;
    return;
  }
  const step = TUTORIAL_STEPS[t.step] || null;
  if (!step) { card.hidden = true; return; }
  const title = document.getElementById('tc-title');
  const eyebrow = document.getElementById('tc-eyebrow');
  const hint = document.getElementById('tc-hint');
  const count = document.getElementById('tc-count');
  const fill = document.getElementById('tc-fill');
  if (title) title.textContent = step.title;
  if (eyebrow) eyebrow.textContent = step.eyebrow;
  if (hint) hint.textContent = step.hint;
  if (count) count.textContent = (t.step + 1) + ' / ' + TUTORIAL_STEPS.length;
  if (fill) fill.style.width = Math.round(((t.step + 1) / TUTORIAL_STEPS.length) * 100) + '%';
  card.hidden = false;
}

function tutorialEvent(name) {
  const s = typeof LB.saveState === 'function' ? LB.saveState() : null;
  const t = s && s.tutorial;
  if (!t || t.done || !name) return;

  const idx = TUTORIAL_STEPS.findIndex(function (step) { return step.key === name; });
  if (idx < 0) return;

  let next = null;
  if (idx === t.step) {
    next = t.step + 1;
  } else if (name === 'catch:success' && t.step <= 3) {
    // 满血直接收服也认，跳过“削到一半”这一步
    next = 4;
  } else if (name === 'chapter:2' && t.step <= 5) {
    next = TUTORIAL_STEPS.length;
  }
  if (next == null || next <= t.step) return;

  t.step = Math.min(next, TUTORIAL_STEPS.length);
  if (t.step >= TUTORIAL_STEPS.length) {
    t.done = true;
    t.step = TUTORIAL_STEPS.length;
    if (typeof LB.toast === 'function') LB.toast('新手引导完成 · 此后自由游历');
  } else {
    const step = TUTORIAL_STEPS[t.step];
    if (typeof LB.toast === 'function') LB.toast('引导 · ' + step.title);
    if (window.LB && LB.audio && LB.audio.sfx) LB.audio.sfx('guide');
  }
  if (typeof LB.persist === 'function') LB.persist();
  renderTutorial();
}

function startTutorial() {
  const s = typeof LB.saveState === 'function' ? LB.saveState() : null;
  if (!s) { if (typeof LB.toast === 'function') LB.toast('尚未入山'); return; }
  s.tutorial = { step: 0, done: false, skipped: false };
  if (typeof LB.persist === 'function') LB.persist();
  renderTutorial();
  if (typeof LB.toast === 'function') LB.toast('引导已重开 · ' + TUTORIAL_STEPS[0].title);
}

function skipTutorial() {
  const s = typeof LB.saveState === 'function' ? LB.saveState() : null;
  if (!s) return;
  s.tutorial = Object.assign({ step: 0, done: true }, s.tutorial || {}, { done: true, skipped: true });
  if (typeof LB.persist === 'function') LB.persist();
  renderTutorial();
  if (typeof LB.toast === 'function') LB.toast('已跳过引导 · 设置里可重看');
}

if (window.LB) {
  LB.tutorialEvent = tutorialEvent;
  LB.startTutorial = startTutorial;
  LB.skipTutorial = skipTutorial;
  LB.renderTutorial = renderTutorial;
}
