# Repository Guidelines

简明贡献者与智能代理指南，覆盖本仓库全部目录。遵循本文可加速评审与发布。

## 项目结构与模块组织
- `src/main/`：Electron 主进程（窗口、快捷键、AI 流、设置）。
- `src/preload/`：预加载桥接，暴露安全 API。
- `src/renderer/`：React + Vite 渲染层（Tailwind、Zustand、Radix UI）。
- `build/`、`resources/`：打包资源与应用图标。
- 主要配置：`electron.vite.config.ts`、`electron-builder.yml`、`tsconfig.*.json`、`eslint.config.mjs`。
- 测试建议位置：`src/**/__tests__` 或 `*.test.ts(x)`。

## 构建、测试与开发命令
- `npm run dev`：开发模式；主/渲染进程热重载。
- `npm start`：预览构建产物。
- `npm run build`：类型检查并构建应用。
- `npm run build:win|mac|linux`：按平台打包。
- `npm run lint` / `npm run format`：ESLint/Prettier 校验与格式化。
- `npm run typecheck`：全量 TypeScript 检查。

## 代码风格与命名约定
- 使用 TypeScript；避免默认导出，优先具名导出。
- React 组件：文件/组件名用 PascalCase（如 `AppHeader.tsx`）。
- 基础 UI 组件可用 kebab-case（如 `components/ui/button.tsx`）。
- 工具与状态：camelCase（`lib/utils/*`、`lib/store/*`）。
- 单一职责：公共逻辑提取到 `lib/`；提交前运行 `npm run lint && npm run format`。

## 测试指南
- 当前未集成自动化测试；欢迎引入 Vitest/Playwright。
- 覆盖关键路径：设置、快捷键、AI 流等。
- 命名：同文件旁 `*.test.ts(x)` 或 `__tests__` 目录。
- 就绪后提供 `npm test` 脚本并更新本文档。

## Commit 与 Pull Request
- 提交遵循 Conventional Commits：`feat|fix|docs|chore|refactor|perf`: 简述。
- PR 要求：清晰描述动机与影响；关联 issue；UI 变更附截图/动图；附本地验证步骤。
- 必须通过构建与类型检查；无 `lint`/`format` 错误；变更最小化且聚焦。

## 安全与配置提示
- 使用 `dotenv`；在根目录创建 `.env`，切勿提交密钥。
- 示例：
  ```env
  API_BASE_URL=https://api.openai.com/v1
  API_KEY=sk-...
  MODEL=gpt-4o-mini
  CODE_LANGUAGE=typescript
  ```

## 面向智能代理的说明
- 本文件作用域为仓库根；若子目录存在更具体 AGENTS.md，则就近优先。
- 变更 `src/main`/`src/renderer` 时严格遵循本文与现有命名模式。
- 采用小步、可回滚变更；新增命令与配置在 PR 中给出用途与示例。

