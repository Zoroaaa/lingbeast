# 灵兽录 · 山海新契

像素风回合制灵兽收集 RPG。前端基于 Phaser 3.90 与原生脚本（无构建工具），后端为 Cloudflare Worker + D1，静态资源与 `/api/*` 同源部署。

## 玩法

- 八境探索：青溪山门 → 青溪谷 → 雾隐林 → 落星原 → 归墟海市 → 云梦泽 → 断崖古坛 → 归墟深处
- 回合制战斗：术法、结契、丹药、遁走，五行克制与 Boss 战
- 收服、升级、进化、队伍编成与灵兽录图鉴
- 主线八章、支线、山门悬赏、NPC 对话、宝箱与采集
- 双轨存档：本地 `localStorage` 优先，登录后防抖同步至 D1，支持跨设备续玩
- 像素 UI：NES.css + 程序化像素立绘与瓦片，含天气与昼夜色调

## 操作

| 操作 | 按键 |
| --- | --- |
| 移动 | 方向键 / WASD / 屏幕方向键 |
| 交谈、推进对话 | 空格 / 回车 |
| 山河图 / 灵兽录 / 行囊 / 任务 / 队伍 / 存档 | M / B / I / J / T / Q |

## 技术栈

- Phaser 3.90（`public/vendor/phaser.min.js`，离线内置）
- 原生 JavaScript，经典 `<script>` 加载，无打包步骤
- Cloudflare Workers：静态资源（`ASSETS` 绑定）+ API
- Cloudflare D1：账号、会话与云存档
- Wrangler 4、NES.css

## 目录结构

```
public/
  index.html          页面与各视图骨架
  style.css           像素 UI 样式
  cloud.js            账号与云存档客户端
  js/data/            灵兽、技能、道具、Boss、地图、剧情、任务数据
  js/world/           地图渲染、实体、输入、天气
  js/battle/          战斗引擎与演出
  js/ui/              HUD、图鉴、商店、世界面板
  js/main/            主控流程与状态
  assets/ninja/       像素素材
  vendor/             Phaser 与 NES.css
src/index.js          Worker 路由与 API
schema.sql            D1 建表语句
wrangler.jsonc        Wrangler 配置（资源、D1 绑定）
```

## 本地开发

```bash
npm install
npm run db:init:local   # 初始化本地 D1
npm run dev             # http://localhost:8787
```

## 部署

首次部署前需要确认 `wrangler.jsonc` 中的 `database_id` 为真实 D1 ID：

```bash
npx wrangler d1 create lingbeast   # 若尚未创建，将返回的 ID 填入 wrangler.jsonc
npm run db:init:remote             # 初始化远程表结构
```

手动部署：

```bash
npm run deploy
```

### GitHub 推送自动部署（Workers Builds，零密钥）

1. Cloudflare Dashboard → Workers & Pages → 选择 `lingbeast-rpg` → Settings → Builds → Connect
2. 连接 GitHub 仓库，生产分支选 `main`
3. Build command 填 `npm ci`，Deploy command 保持 `npx wrangler deploy`
4. Worker 名称必须与 `wrangler.jsonc` 中的 `name`（`lingbeast-rpg`）一致

无需配置 API Token，Cloudflare 自动生成构建凭据。若部署报 D1 权限错误，可在构建设置中改用带 `D1:Edit` 权限的自建 Token。

## API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| POST | `/api/register` | 注册并登录（PBKDF2 加盐哈希） |
| POST | `/api/login` | 登录并签发会话令牌 |
| POST | `/api/logout` | 注销当前令牌 |
| GET | `/api/save` | 拉取云存档 |
| PUT | `/api/save` | 写入云存档（按更新时间去重） |
