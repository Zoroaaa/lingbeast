# Tasks

- [ ] Task 1: 搭建页面骨架与水墨视觉系统
  - [ ] SubTask 1.1: 创建 `lingbeast-rpg/index.html`，按「标题 / 探索 / 战斗 / 结局」四个视图分区
  - [ ] SubTask 1.2: 创建 `style.css`，定义色板（宣纸 #f3efe6、墨 #1b1a17、灵玉青 #2f7e6f）、宋体标题字族、字号刻度、间距刻度
  - [ ] SubTask 1.3: 实现标题海报（游戏名 + 副标题 + 「入山 / 续前缘」），完成墨迹晕开的入场动效
  - [ ] SubTask 1.4: 实现通用转场层，供场景切换与遇敌复用

- [ ] Task 2: 建立数据层
  - [ ] SubTask 2.1: 在 `game.js` 定义五行属性与克制循环表
  - [ ] SubTask 2.2: 定义 6 种灵兽 + 1 Boss 的基础属性、成长、技能、出现场景
  - [ ] SubTask 2.3: 定义 3 个场景的瓦片地图（地形类型、障碍、出口、遇敌区、NPC 与剧情点坐标）

- [ ] Task 3: 场景探索
  - [ ] SubTask 3.1: 渲染瓦片地图，叠加程序化水墨装饰（远山、雾气、水岸）
  - [ ] SubTask 3.2: 实现角色移动、障碍碰撞与步数累计
  - [ ] SubTask 3.3: 实现出口切换、场景入口定位与解锁条件
  - [ ] SubTask 3.4: 实现遇敌阈值触发与遭遇转场
  - [ ] SubTask 3.5: 实现 NPC 接近触发与逐字对话，支持按键推进

- [ ] Task 4: 回合制战斗核心
  - [ ] SubTask 4.1: 战斗界面布局：敌方灵兽、我方队列、指令栏、战斗日志
  - [ ] SubTask 4.2: 速度决定行动顺序的回合调度
  - [ ] SubTask 4.3: 伤害/治疗公式，含五行克制、暴击与浮动
  - [ ] SubTask 4.4: 敌方 AI（优先克制技能，低血时保守）
  - [ ] SubTask 4.5: 结算流程：胜利结算经验、战败界面、遁走判定、Boss 禁逃

- [ ] Task 5: 收服与成长
  - [ ] SubTask 5.1: 结契概率计算（含气血比例与灵符加成）与结果反馈
  - [ ] SubTask 5.2: 经验、升级、属性成长、按等级习得术法
  - [ ] SubTask 5.3: 队伍切换、队伍上限与替换/放归流程
  - [ ] SubTask 5.4: 丹药道具（回血、复活）的数量管理与战斗内使用

- [ ] Task 6: 剧情、存档与结局
  - [ ] SubTask 6.1: 三段主线剧情文本与触发顺序、Boss 前置条件
  - [ ] SubTask 6.2: `localStorage` 存档写入时机（切换场景、战斗结束、剧情节点）与读取恢复
  - [ ] SubTask 6.3: 存档解析失败的兜底提示
  - [ ] SubTask 6.4: 结局界面与统计（收服数、战斗数、用时），可返回标题

- [ ] Task 7: 账号与云存档
  - [ ] SubTask 7.1: D1 表结构（users / sessions / saves）与 `schema.sql`
  - [ ] SubTask 7.2: Worker API：注册、登录、登出、读取存档、写入存档，PBKDF2 加盐哈希 + Bearer 令牌
  - [ ] SubTask 7.3: 客户端 `cloud.js`：令牌存取、启动拉取、2 秒防抖推送、失败静默
  - [ ] SubTask 7.4: 冲突判定（以较新更新时间者为准）与提示
  - [ ] SubTask 7.5: 登录/注册界面，未登录与离线均可正常游玩

- [ ] Task 8: 部署到 Cloudflare
  - [ ] SubTask 8.1: `wrangler.jsonc` 配置静态资源目录与 D1 绑定
  - [ ] SubTask 8.2: 本地 `wrangler dev` 验证 API 与页面同源
  - [ ] SubTask 8.3: 记录建库、建表、部署三条命令

- [ ] Task 9: 打磨与可玩性验证
  - [ ] SubTask 9.1: 战斗飘字、血条缓动、克制提示的动效收束
  - [ ] SubTask 9.2: 键盘与触屏双操作适配，窄屏布局检查
  - [ ] SubTask 9.3: 完整通关一次，修正数值与节奏问题

# Task Dependencies
- [Task 3] 依赖 [Task 1]、[Task 2]
- [Task 4] 依赖 [Task 1]、[Task 2]
- [Task 5] 依赖 [Task 4]
- [Task 6] 依赖 [Task 3]、[Task 4]、[Task 5]
- [Task 7] 依赖 [Task 6]
- [Task 8] 依赖 [Task 7]
- [Task 9] 依赖 [Task 1] 至 [Task 8]
