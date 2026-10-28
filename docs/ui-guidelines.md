# 灵兽录 · UI 规范（v2.4）

这份规范约束标题页、探索 HUD、战斗、册页与结局的界面实现。目标是保持「像素羊皮纸 + 灵玉青」的方向，同时保证中文可读、手机可点、键盘可玩。

## 1. 颜色

| Token | 值 | 用途 |
|---|---|---|
| `--paper-0` | `#fff9ea` | 最亮卡片面 |
| `--paper-1` | `#f7eed8` | 主面板 |
| `--paper-2` | `#efe3c8` | 次级底、未选中 tab |
| `--paper-3` | `#e6d7b4` | 轨道、禁用底 |
| `--ink-900` | `#241d12` | 主文字、边框 |
| `--ink-700` | `#3f3322` | 次级标题 |
| `--ink-500` | `#5c4c35` | 正文辅助 |
| `--ink-400` | `#6b5b40` | 弱文字（纸底 ≥ 4.5:1） |
| `--ink-300` | `#8a7a5c` | 仅装饰/分隔，不用于正文 |
| `--jade-ink` | `#1c7448` | 玉青文字 |
| `--jade` | `#2f9e64` | 进度条、填充、边框 |
| `--gold-ink` | `#8a5a00` | 金色文字 |
| `--gold-700` | `#7a4f00` | 浅底小字 |
| `--gold` | `#d9a527` | 按钮填充、强调块 |
| `--coral-ink` | `#a5312a` | 警示文字 |
| `--coral` | `#cf4b3a` | 血条、警示填充 |
| `--water-ink` | `#1f6f8c` | 水系文字 |
| `--focus` | `#0b5f8a` | 键盘焦点环 |

规则：

- 饱和色只用于填充、进度、边框和色点；文字必须用 `*-ink`，或「soft 底 + ink 字 + 彩色边框」。
- 不为「好看」把奶白字放在亮金、亮绿或亮橙底上。
- 五行、稀有度、状态同时显示字形/字母，不只靠颜色区分。

## 2. 字体

- UI 使用系统中文栈：`Microsoft YaHei UI / Microsoft YaHei / PingFang SC / Noto Sans SC`。
- 不再声明未打包的像素字体；像素感来自硬边框、阶梯阴影、印章和灵兽 SVG。
- 操作文字 ≥ 12px；辅助信息 ≥ 11px；正文 14px。所有 UI 字号使用 `calc(Npx * var(--ui-scale, 1))`。
- 设置「界面字号 · 大」时把 `html[data-text-scale="large"]` 的 `--ui-scale` 调到 `1.2`；不放画布内文字。
- 输入框移动端 16px，避免 iOS 聚焦自动放大。

## 3. 组件

- **Button**：`.btn`（大）/ `.btn-sm`（面板）。变体：`btn-ink`、`plain`、`solid`、`danger`、`ghost`。
- **Badge/Chip**：soft 底 + ink 字 + 彩色边框；`badge lead` 用于「首发」。
- **Bar**：`role="progressbar"` 且带 `aria-valuemin/max/now/valuetext`；低于 25% 加 `.low`。
- **Tab**：`.sheet-tabs` 由 `uiEnhanceTabs()` 补 `role`/`aria-selected`；切换用 `uiBindTabs()` 支持左右方向键。
- **Modal**：`#modal` 固定 `role="dialog" aria-modal="true" aria-labelledby="modal-title"`；`openModal` 负责焦点陷阱、背景 inert、滚动/焦点恢复。
- **Toast**：`role="status" aria-live="polite"`，`pointer-events:none`，不得挡住 HUD 点击。
- **Screen reader**：非 Toast 的重要事件用 `LB.announce(text)`。

## 4. 焦点与键盘

- 所有可交互元素有 `:focus-visible` 焦点环；禁止裸 `outline: none`。
- `Tab` 在模态内循环；`Esc` 先关子菜单/菜单，再关模态；关闭后焦点回到触发元素。
- 探索：WASD/方向键移动，E/空格交互，M/B/I/J/T/Q 开面板。
- 战斗：数字 1–9 选择指令，Esc/Backspace 在子菜单返回；对话选项 1–4 优先。
- 模态重渲染默认保留滚动与焦点；tab 切换显式回顶；图鉴详情/灵器/灵诀返回时恢复父面板滚动与焦点。

## 5. 响应式

- 断点：`1100`、`820`、`520`、`375`，另加 `(max-height:560px) and (orientation:landscape)`。
- ≤820：HUD 收成「场景/灵玉 + 菜单」两行；nav 以 3 列浮层展开，每项 ≥48px；任务步骤最多两行。
- 所有固定贴边元素加 `env(safe-area-inset-*)`；模态用 `dvh` 回退 `vh`。
- 触屏目标 ≥44×44；`auto` 只在 `(hover:none) and (pointer:coarse)` 显示摇杆，混合设备可在设置里「常显」。

## 6. 动效

- 时长：90ms / 160ms / 320ms，优先 `steps()`。
- 系统 `prefers-reduced-motion` 与游戏内「减少动效」任一开启，即关闭装饰动画、转场、震屏与战果等待。
- 战斗速度「跳过演出」只跳过演出，不跳过结算；战果页仍出现。

## 7. 发版检查

1. `node scripts/check.mjs`：资源、版本、PWA。
2. `node scripts/ui-check.mjs`：token 对比度、ARIA、重复 id、74 个脚本语法。
3. 手工矩阵：1440 / 820 / 390 / 375 / 320 / 844×390；标题、探索、战斗、册页、结局。
4. 每次改 CSS/JS 运行 `npm run version:bump`，保证 `index.html` 的 `?v=` 与 `sw.js` 的 `VERSION` 同步；否则 Service Worker 会回旧资源。
