# 灵兽录 · 灵兽立绘（beast art）

> 版本 v1.0（2026-10-28）。本轮目标是「全面优化灵兽建模的精美程度」。最终采用**在既有部件拼贴引擎上定向精修 + 重做呈现层**，而不是推翻重写：
> 曾实现过一版「解剖 + 材质」新引擎（`anatomy.js` + `parts-bird.js`），在 64×64 网格上反复调翼/头/瞳后仍不如旧版可读，已整体移除，相关结论见第 8 节。
>
> 改动前基线：git `0613e0b`，62 只共 **13443 rect**；当前 **17173 rect**（art-check 同口径）。视觉基线 `.tmp/art-before/gallery.png`，当前总览 `.tmp/art-dev/final-gallery.html`。

## 1. 目标与约束

- 每只灵兽由一只 `PixelCanvas` 在 **64×64 逻辑网格**上程序化绘制，输出纯 `<rect>` 拼贴的 SVG，不引入外部图片、不新增依赖。
- 同一 `style.draw(style, evolved)` 同时服务小图（图鉴卡片）与大图（详情/战斗）；几何一致，`fitBeastViewBox()` 只调整视口。
- 预算：总 rect ≤ 60000、单兽 ≤ 900；`scripts/art-check.mjs` 在 CI 口径上强制。
- 同家族不能换色复制：同家族两两 `(rect 数, bbox)` 指纹必须不同。
- 中文名、属性、稀有度、进化链、图鉴文案都是数据，不写进绘制代码。

## 2. 加载顺序与分层

`public/index.html` 中 art 相关脚本顺序（`scripts/art-preview.mjs` / `art-check.mjs` 自动读取该顺序）：

| 顺序 | 文件 | 职责 |
|---|---|---|
| 1 | `public/js/data/species.js` | `SPECIES`：id、中文名、属性、稀有度、`art`、成长、进化链、图鉴文案 |
| 2 | `public/js/art.js` | `PixelCanvas`（`rect/blob/outlineBlob/outlineRect/shadow/socket/gem/line/diamond/svg`）、`beastSvg()`、`fitBeastViewBox()`、Blob URL 缓存、`validateBeastStyles()` |
| 3 | `public/js/art/beasts/kit.js` | `BEAST_SECTIONS`、`BEAST_IDLE_DEFAULT`、`FAMILY_DEFAULTS` 合并入口、`applyPattern()`、`drawSignature()` |
| 4 | `public/js/art/beasts/parts.js` | 11 个家族 builder：`drawBird/drawCrane/drawDeer/drawFox/drawBadger/drawRhino/drawCroc/drawDragon/drawSpirit/drawMermaid/drawClam` |
| 5 | `public/js/art/beasts/signatures.js` | 约 50 个「一兽一特征」签名（`SIGNATURES`） |
| 6 | `public/js/art/beasts/birds.js` | bird 9 + crane 6 |
| 7 | `public/js/art/beasts/land.js` | deer 5 / fox 6 / badger 4 / rhino 5 |
| 8 | `public/js/art/beasts/reptiles.js` | croc 5 + dragon 3 |
| 9 | `public/js/art/beasts/spirits.js` | spirit 10 |
| 10 | `public/js/art/beasts/aquatic.js` | mermaid 6 + clam 3 |

绘制顺序（以鸟为例）：投影 → 尾 → 远侧翼 → 颈 → 身体（轮廓 + 高光 + 腹羽 + 花纹）→ 近侧翼 → 腿 → 头（轮廓 + 高光）→ 喙/吻 → 眼 → 冠/角/耳 → 进化件 → 签名。其它家族同构，仅部件顺序不同。

## 3. 本轮精修（2026-10-28）

### 3.1 几何与可读性

- **接颈**：`parts.js` 新增通用 `beastNeck()`（在 `beastShadow()` 内、身体之前绘制），把默认悬浮的头部与身体用渐细颈管接起来；已有 `style.neck` 的物种（仙鹤/鹿/龙）保留自己的颈柱。旧版鸟头是悬浮的，这是本轮最明显的结构修复。
- **腿脚**：`drawLegs` 仍用 `outlineRect` 单段腿，但加了膝节高光、大腿根高光、脚掌加宽（`thick + 3`）与 1px 足底暗线；比旧版「两根 2px 竖条 + 2px 横条」更像脚。
- **眼**：`PixelCanvas.socket` 改为 6×5 外沿（6×5 深墨）+ 4×3 眼白 + 2×2 瞳 + 上眼睑/下眼白高光；比旧 4×3 更有神，又不会在 64px 下糊成黑块。
- **翼**：`drawFeatherWing` 的 `span` 收进体宽（`min(span, body.w*0.9~1.1)`），避免翅膀把 bbox 撑到 84–88（旧 moxun/zhuojin/xingkongniao 超出 80 被压小）；`feather`/`pointed` 增加羽排墨线、羽尖收窄与端点高光。
- **冠/角/尾**：签名在 `evolved` 档增加宝石与辉光；不稳定的小尺寸签名补齐 1px 描边，避免「贴纸感」。

### 3.2 正确性与自检

- `PixelCanvas.rect()` 现在**先四舍五入再校验**：`0 < w < 1` 的分数宽高不再生成 `width="0"` 的非法 rect（chaoxi/canglan/cangming/chaowen 共 36 个）。
- `blob()` 圆钝到 0 宽时补 1px，细尾/角/鳍不再断行。
- `art-check` 的 A5（bbox）/A6（非法 rect）从失败转为全绿；A9 同家族指纹无重复。

### 3.3 呈现层（UI）

- 图鉴卡片：立绘框 64 → **72px**；卡片底色按属性 `--el-soft` 渐变，边框仍用稀有度/属性色。
- 详情：立绘框 280 → **`min(340px, 76%)`**；加属性色径向底纹、1px 扫描线、背后**属性字水印**（`data-glyph`，10% 不透明度）与底部投影。
- 进化形态：详情立绘金色 `outline` + 右上 `✦` 闪烁；名称旁「进化」金标；总览格加金边与「进化」角标。
- `LB.beastGallery()` 的 62 格总览按属性/稀有度上色，可直接做人工验收。
- 尊重 `body.reduce-motion`：新动画（`evo-twinkle`）同样被关闭。

## 4. 数据流

```
SPECIES[id].art ──► BEAST_STYLES[artId]（registerBeast 注册）
                        │ style.family ──► BEAST_BUILDERS[family](style, evolved)
                        ▼
                  PixelCanvas ──► p.svg(id, scale) → <svg viewBox="0 0 64 64" data-bbox="...">
                        │
                        ▼
                  fitBeastViewBox() 收紧视口 → beastSvg(id, big)
                        │
        ┌───────────────┴────────────────┐
   浏览器 Blob URL <img>            Node/无 Blob：回退内联 SVG
```

- 顶层 `const BEAST_STYLES / SPECIES / SIGNATURES` **不是** `globalThis` 属性；Node `vm` 必须 `vm.runInContext('BEAST_STYLES', ctx)` 取值。
- `beastSvg(id, bigger)` 按 `id|big/small` 缓存，图鉴 62 张只产生 62 个 `<img>` 节点。
- `fitBeastViewBox()` 用 `data-bbox` 裁成正方形；`big` 档只在内容溢出 64 时才扩视口，保持物种相对体型。

## 5. 家族与规模

| family | 数量 | rect 范围（当前） | 主要识别手段 |
|---|---|---|---|
| bird | 9 | 245–463 | 翼型（folded/feather/pointed/round/skeletal/storm）+ 尾型 + 冠/眼纹 |
| crane | 6 | 205–402 | 长颈长腿、喙形、羽冠、仙鹤/凰的尾羽 |
| deer | 5 | 266–297 | 角（branch/coral/vine/ninePeaks）+ 斑纹 + 体色 |
| fox | 6 | 234–327 | 耳型、焰尾/多尾、尾尖高光 |
| badger | 4 | 198–240 | 矮壮轮廓、面罩、尾 |
| rhino | 5 | 232–269 | 角型、背甲、体型 |
| croc | 5 | 220–253 | 长吻、鳞甲、背棘、低伏姿态 |
| dragon | 3 | 361–403 | 分段脊柱、背鳍、龙须/尾鳍 |
| spirit | 10 | 157–599 | 形体 orb/cloak/root/ape、触须、灯笼头、面具 |
| mermaid | 6 | 188–302 | 鱼尾、长发、臂姿、冠饰 |
| clam | 3 | 210–244 | 上下壳、层数、珍珠脸 |

稀有度：C×4 / B×23 / A×25 / S×10；进化形态 25 个，均以独立 `SPECIES` 条目 + `evolved:true` 存在。逐只 rect/bbox 见 `.tmp/art-dev/final-stats.txt`。

## 6. 工具链

两个零依赖 Node ESM 脚本，只读 `public/**`，输出到 `--out/--stats/--json` 指定路径。

### 6.1 预览 `scripts/art-preview.mjs`

```powershell
node scripts/art-preview.mjs                         # → .tmp/art-preview.html
node scripts/art-preview.mjs --stats .tmp/stats.txt  # 追加统计
node scripts/art-preview.mjs --src .tmp/art-before/src --out .tmp/before.html
```

生成单文件画廊（内联全部 SVG），顶部是 62 只 KPI、家族分布与异常列表，可按 `--src` 对历史快照跑同一套标准。

### 6.2 自检 `scripts/art-check.mjs`

```powershell
node scripts/art-check.mjs                 # 失败 exit 1
node scripts/art-check.mjs --json .tmp/art-check.json
```

| # | 检查 | 当前结果 |
|---|---|---|
| A1 | 源码按 index.html 顺序加载，无异常 | ✓ 10 个脚本 |
| A2 | `SPECIES` ≥ 62 | ✓ 62 |
| A3 | 每只 `art` 命中 style，含 id/family/draw | ✓ 62/62 |
| A4 | 小/大图均可绘制，rect 中位 256.5 / 最大 599 | ✓ |
| A5 | `data-bbox` 宽高 8..80、宽高比 0.25..4、viewBox 正方形 | ✓ |
| A6 | 无 NaN/undefined/`width="0"`/负宽高 | ✓（已修 0 宽 rect） |
| A7 | 总 rect ≤ 60000、单兽 ≤ 900 | ✓ 17173 / 599 |
| A8 | 11 家族齐全 | ✓ |
| A9 | 同家族指纹（rect 数 + bbox）不重复 | ✓ |
| A10 | 进化链 id 存在且成组 | ✓ 25 组 |
| A11 | `BEAST_MATERIALS` 存在时的材质校验 | 跳过（本版无材质层） |

### 6.3 工程与浏览器检查

```powershell
node scripts/check.mjs      # 资源存在、?v= 唯一、sw VERSION、PWA 图标
node scripts/ui-check.mjs   # token 对比度、ARIA、重复 id、全部脚本语法
node .tmp/browser-test.mjs  # 桌面 1280×900 + 移动 390×844 全流程截图/断言
```

改完立绘后建议顺序：`art-check` → `art-preview` 目检 → `ui-check` → 浏览器实测 → `version:bump`。

## 7. 新增灵兽 / 签名 / 家族

1. `species.js` 增加条目；`art` 字段指向 `registerBeast` 的 id。
2. 对应家族文件 `registerBeast(id, style)`：`family`、`palette`、体型、翼/尾/角/花纹/签名、`scale`、`idle`。
3. 签名放 `signatures.js` 的 `SIGNATURES`，函数签名 `(p, style, c)`；只在 `evolved` 档加强，不改基础轮廓。
4. 新家族：`parts.js` 加 `FAMILY_DEFAULTS` + builder，`BEAST_BUILDERS` 注册；需要新分区时在 `kit.js` 的 `BEAST_SECTIONS` 补键。
5. 跑 `art-preview` 目检、`art-check`、`check`。

## 8. 决策记录：为什么没有保留「解剖+材质」新引擎

- 曾实现 `anatomy.js`（骨相/关节/材质/掩膜/花纹裁剪）+ `parts-bird.js`，鸟体可连接、有体积光与飞行姿态。
- 但在 64×64 像素网格上，翅膀只有 10–20px 宽：扇形展翼像雨伞、叶形翼板像背包、横向羽板像尾巴；9 轮重画后仍不如旧版「两个圆团 + 简笔翼」可读。
- 旧引擎的真实短板不是「没有骨骼」，而是**头身断开、腿脚太简、眼睛太小、翼展撑爆 bbox、0 宽 rect**；这些用定向补丁更划算，风险也低。
- 结论：保留部件拼贴引擎；不在本轮引入材质/解剖层，A11 继续跳过。后续若要做「新引擎」，应在 96×96 或更高逻辑网格上重做，而不是 64。

## 9. 已知限制 / 后续

1. **同家族相似度**：A9 只保证不完全相同，bird/crane 仍主要靠配色与翼型区分；真正的「一兽一剪影」需要拆 family builder 或提高逻辑网格。
2. **窄高精怪/鲛人**：spirit/mermaid bbox 宽 18–38，在方形图标里天然偏窄；已通过 72/340px 框缓解，未做非等比放大（会破坏像素比例）。
3. **花纹未裁剪**：`applyPattern` 仍直接画在身体 zone 上，极端 zone 可能溢出轮廓；当前数据未出现明显溢出。
4. **进化差异**：仍是「同 draw + evolved 分支（宝石/辉光/加冠）」，未做独立剪影；数据层已具备独立条目，后续可逐只加 `evolved` 专属部件。
5. **材质层**：未实现，`art-check` A11 自动跳过；若未来加 `BEAST_MATERIALS`，需同步本文第 6.2 节。

## 10. 验收记录（2026-10-28）

- `node scripts/art-check.mjs`：**全部通过（11 项检查）**，0 警告。
- `node scripts/ui-check.mjs`：**通过**（token 对比度、ARIA、id、74 个脚本语法）。
- `node scripts/check.mjs`：**通过 · v78 · 78 个本地资源引用 · PWA 图标齐全**。
- 浏览器实测：见 `.tmp/shots2/` 与 `.tmp/ui-shots/`；图鉴 62/62 可见、详情桌/移动无裁切、进化金框与「进化」标签正常。
- 对照基线：`.tmp/art-before/gallery.png`（改前）↔ `.tmp/art-dev/final-gallery.png`（改后）。

## 11. 变更记录

| 日期 | 版本 | 内容 |
|---|---|---|
| 2026-10-28 | v0.1 | 骨架：分层、家族表、工具用法、基线、已知问题 |
| 2026-10-28 | v1.0 | 定向精修落地：接颈/腿脚/眼/翼收幅/0 宽 rect 修复；UI 呈现层（72px 卡片、340px 详情、属性水印、进化金框）；art-check/art-preview 交付；移除未采用的新引擎 |
