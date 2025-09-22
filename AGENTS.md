# Repository Guidelines

## 项目结构与模块组织
- 主进程：`src/main/`（窗口、快捷键、设置、AI 调用）
- 预加载：`src/preload/`（安全桥接，类型在 `index.d.ts`）
- 渲染层：`src/renderer/src/`（React + TSX，样式在 `assets/`）
- 构建与资源：`build/`、`resources/`、`electron-builder.yml`
- 别名：渲染层支持 `@/*` 与 `@renderer/*`（见 `tsconfig.web.json`）

## 构建、测试与开发命令
- 安装依赖：`npm ci` 或 `npm install`
- 本地开发：`npm run dev`（Electron + Vite 热更新）
- 预览：`npm start`（构建后预览）
- 类型检查：`npm run typecheck`（包含 node/web 两套）
- 代码检查：`npm run lint`；格式化：`npm run format`
- 产物构建：`npm run build`
- 平台打包：`npm run build:win | build:mac | build:linux`

## 代码风格与命名约定
- 使用 TypeScript、Prettier、ESLint（见 `eslint.config.mjs`）；2 空格缩进。
- React 组件文件与导出：`PascalCase`（如 `SelectModel.tsx`）。
- 工具与 store：`camelCase` 文件（如 `keyboard.ts`、`settings.ts`）。
- 避免显式函数返回类型强制（规则已关闭）；遵循 React Hooks 与 Refresh 规则。

## 测试规范
- 目前无单测框架；提交前必须通过：`typecheck` 与 `lint`。
- 手动验证：关键流程（截图、模型选择、快捷键）需在 Win/Mac 至少一端走通。
- 如新增测试，建议命名 `*.test.ts(x)` 并与源码同目录或 `__tests__/`。

## Commit 与 Pull Request
- 推荐 Conventional Commits：`feat:`、`fix:`、`docs:`、`chore:` 等；允许中英文，但保持一致性。
- PR 需包含：变更说明、测试步骤/截图、关联 Issue、风险与回滚方案。
- CI：打 `v*` 标签会触发 GitHub Actions 构建与草稿发布。

## 安全与配置
- 本地创建 `.env`，包含 `API_BASE_URL`、`API_KEY`；禁止提交敏感信息。
- 构建产物位于 `dist/`；打包模板与图标在 `build/`。

## Agent 专属说明
- 仅改动相关模块，保持目录与命名一致；遵循本文件与 ESLint/Prettier 配置。
- 变更应最小化且可回滚；避免引入未使用依赖；提交前运行：`lint`、`typecheck`、`build`（如涉及构建）。
