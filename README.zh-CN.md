<p align="center">
  <h1 align="center">FunPlay Skill</h1>
  <p align="center">
    <strong>面向 Coding Agent 的游戏开发技能库</strong>
  </p>
  <p align="center">
    <a href="./README.md">English</a> · 简体中文
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Skills-14-blue" alt="14 个 skills" />
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js 18+" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  </p>
</p>

FunPlay Skill 是一个面向游戏开发 Coding Agent 的 skills 库，聚焦游戏策划、资源处理、网页游戏切片和引擎验证等可复用工作流。

## Skills 目录

当前仓库包含这些已验证 skills：

| 分类 | Skill | 适用场景 | 验证面 |
| --- | --- | --- | --- |
| Asset Processing | `skills/sprite-sheet` | 把 sprite sheet 切成编号帧图 | `scripts/slice.mjs` 加测试 |
| Asset Processing | `skills/normal-map` | 从 diffuse texture 生成切线空间 normal map | `scripts/generate.mjs` 加测试 |
| Asset Processing | `skills/audio-format-convert` | 在 `wav`、`ogg`、`mp3` 之间转换音频 | `scripts/convert.mjs` 加测试 |
| Game Design Workflow | `skills/game-concept-brief` | 把早期游戏灵感整理成 GDD-lite / MDA / MVP brief | `scripts/build-brief.mjs` 加测试 |
| Game Build Workflow | `skills/playable-game-build-flow` | 从意图收集推进到可玩的网页游戏 vertical slice | `scripts/validate-pillar.mjs` 加测试 |
| UI Asset Workflow | `skills/game-ui-asset-brief` | 生成游戏 UI 资产提示词、抠图要求和验证清单 | `scripts/build-brief.mjs` 加测试 |
| Engine Workflow | `skills/unity-mcp-workflow` | 使用 Funplay Unity MCP 做编辑、编译、Play Mode、截图、层级和 Console 验证 | 已验证上游来源 |
| Engine Workflow | `skills/commercial-unity-game` | 规划或审查超出原型范围的商业级 Unity 移动/F2P 游戏 | `scripts/validate-commercial-plan.mjs` 加测试 |
| Cocos Engine | `skills/minigame-subpackage-rules` | 校验微信/抖音小游戏分包规则 | `scripts/validate-minigame-subpackages.mjs` 加测试 |
| Cocos Engine | `skills/canvas-page-popup-bootstrap` | 创建或校验新的 Cocos page、popup、HUD canvas entry | `scripts/validate-canvas-entry.mjs` 加测试 |
| Cocos Engine | `skills/canvas-page-popup-removal` | 删除已有 page / popup canvas node 前检查 blocker | `scripts/check-removal-blockers.mjs` 加测试 |
| Cocos Engine | `skills/cocos-ui-node-retrofit` | 分类和规划安全的 Cocos UI node retrofit | `scripts/classify-retrofit.mjs` 加测试 |
| Cocos Engine | `skills/workbench-asset-replace` | 规划把 Workbench 素材安全替换进 Cocos 视觉目标 | `scripts/plan-asset-replace.mjs` 加测试 |
| Meta Routing | `skills/using-funplay-skills` | 不确定该用哪个 FunPlay skill 时做路由选择 | 仓库路由策略 |

如果不确定该用哪个工作流，先使用 `skills/using-funplay-skills`。

## 仓库支持文件

- `hooks/`：session-start 上下文注入
- `commands/`：把用户请求路由到对应 skill 的轻量 slash command wrapper
- `docs/skill-spec.md`：skill 编写规范
- `CONTRIBUTING.md`、`CHANGELOG.md`、`RELEASE_CHECKLIST.md`：贡献和发布文档

## 安装

### Claude Code

本地开发时，从仓库父目录启动 Claude Code，然后运行：

- `/plugin marketplace add ./<your-checkout-dir>`
- `/plugin install funplay-skill@funplay-skill`

也可以用一次性会话启动：

- `claude --plugin-dir /absolute/path/to/<your-checkout-dir>`

### Cursor

通过 Cursor 的插件支持从本仓库安装。Cursor manifest 位于 `.cursor-plugin/plugin.json`。

### Codex

参见 `.codex/INSTALL.md`。简要流程：

- clone 本仓库
- 把 `skills/` symlink 到你的 agent skills 目录
- 重启 Codex

### OpenCode

参见 `.opencode/INSTALL.md`。简要流程是在 `opencode.json` 里加入这个 Git plugin：

```json
{
  "plugin": ["funplay-skill@git+https://github.com/FunplayAI/funplay-skill.git"]
}
```

### Gemini CLI

从仓库 URL 安装 extension。Gemini 会读取 `gemini-extension.json` 和 `GEMINI.md`。

## 开发命令

- `npx pnpm install`：安装依赖
- `npx pnpm test`：运行测试
- `npx pnpm validate:workspace`：校验必要文件和目录

CI 会运行同样的测试和 workspace 校验命令。

## 使用 Skills

### Asset Processing

- `sprite-sheet`：`node skills/sprite-sheet/scripts/slice.mjs <image> <rows> <cols>`
- `normal-map`：`node skills/normal-map/scripts/generate.mjs <image>`
- `audio-format-convert`：`node skills/audio-format-convert/scripts/convert.mjs <input> <format>`

### Game Build Workflow

- `playable-game-build-flow`：把一句游戏想法推进到可玩的网页游戏 vertical slice，并使用 `node <path-to-this-skill>/scripts/validate-pillar.mjs <pillar.md>` 校验 pillar contract

### Game Design Workflow

- `game-concept-brief`：`node skills/game-concept-brief/scripts/build-brief.mjs --prompt "<game idea>"`

### UI Asset Workflow

- `game-ui-asset-brief`：`node skills/game-ui-asset-brief/scripts/build-brief.mjs --style "<art direction>" --asset background --asset button_skin`

### Engine Workflow

- `unity-mcp-workflow`：当 Unity 项目已连接 Funplay MCP，并需要编译、Play Mode、截图、层级、Console 或 prefab/scene readback 验证时使用
- `commercial-unity-game`：`node skills/commercial-unity-game/scripts/validate-commercial-plan.mjs <plan.md>`

### Cocos Engine

- `minigame-subpackage-rules`：`node skills/minigame-subpackage-rules/scripts/validate-minigame-subpackages.mjs profiles/v2/packages/project.json --platform wechatgame`
- `canvas-page-popup-bootstrap`：`node skills/canvas-page-popup-bootstrap/scripts/validate-canvas-entry.mjs canvas/canvas.json page:shop`
- `canvas-page-popup-removal`：`node skills/canvas-page-popup-removal/scripts/check-removal-blockers.mjs canvas/canvas.json popup:coupon`
- `cocos-ui-node-retrofit`：`node skills/cocos-ui-node-retrofit/scripts/classify-retrofit.mjs --intent "<change>" --component cc.Label`
- `workbench-asset-replace`：`node skills/workbench-asset-replace/scripts/plan-asset-replace.mjs --source "<asset>" --target-label GeneratedBackground`

### Meta Routing

- `using-funplay-skills`：询问当前目标应该使用哪个已验证 FunPlay skill

## Commands

- `/engine-workflow`：编辑项目前选择合适的引擎工作流
- `/engine-safe-edit`：修改资源或场景前选择更安全的引擎工作流

`audio-format-convert` 需要 `PATH` 中有 `ffmpeg`。图片相关 skills 需要安装本仓库的 `sharp` 依赖。

## 设计原则

- Skills 应该是确定性的，或者由已验证的上游工作流支撑
- Metadata 应该让 agent 明确知道何时、如何使用 skill
- 本仓库优先收录本地资源工作流，而不是远程服务强耦合流程
- 没有测试、脚本或上游验证面的纯 advisory skill 不应列为可用工作流

## Git remote

仓库初始化 remote：

- `origin https://github.com/FunplayAI/funplay-skill.git`
