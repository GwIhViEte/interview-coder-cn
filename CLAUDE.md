# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Electron + React + TypeScript 的跨平台桌面应用，使用现代化的前端技术栈构建。项目采用 electron-vite 作为构建工具，支持热重载开发。

**重要声明**: 这是一个面试助手应用，仅用于代码架构分析和技术学习目的。严禁用于任何违反职业道德的行为。

## 技术架构

### 核心技术栈
- **Electron**: 跨平台桌面应用框架
- **React 19**: 前端UI框架
- **TypeScript**: 类型安全的JavaScript
- **Vite + electron-vite**: 现代化构建工具
- **Tailwind CSS**: 原子化CSS框架
- **Zustand**: 轻量级状态管理
- **Radix UI**: 无头UI组件库
- **AI SDK**: OpenAI API集成

### 项目结构
```
src/
├── main/           # Electron主进程代码
│   ├── index.ts    # 应用入口
│   ├── main-window.ts    # 窗口管理
│   ├── shortcuts.ts      # 全局快捷键
│   ├── ai.ts            # AI服务集成
│   ├── take-screenshot.ts # 截屏功能
│   └── settings.ts      # 设置管理
├── preload/        # 预加载脚本 (Main-Renderer通信)
└── renderer/       # 渲染进程 (React应用)
    └── src/
        ├── coder/      # 主功能页面
        ├── settings/   # 设置页面
        ├── help/       # 帮助页面
        ├── components/ # UI组件
        └── lib/        # 工具库和状态管理
```

## 常用开发命令

### 开发环境
```bash
npm run dev          # 启动开发服务器 (热重载)
npm run start        # 预览生产版本
```

### 代码质量
```bash
npm run lint         # ESLint代码检查
npm run format       # Prettier格式化代码
npm run typecheck    # TypeScript类型检查
npm run typecheck:node   # 主进程类型检查
npm run typecheck:web    # 渲染进程类型检查
```

### 构建打包
```bash
npm run build        # 构建项目 (包含类型检查)
npm run build:unpack # 构建并解压到dist目录
npm run build:win    # Windows平台打包
npm run build:mac    # macOS平台打包
npm run build:linux  # Linux平台打包
```

## 环境配置

### 必需的环境变量
在项目根目录创建 `.env` 文件:
```env
API_BASE_URL="https://api.openai-proxy.org/v1"  # OpenAI API代理地址
API_KEY="sk-xxxxxxxx"                          # OpenAI API密钥
```

### 开发依赖
- Node.js (推荐 18+ 版本)
- npm 或其他包管理器

## 架构要点

### Electron三进程架构
1. **主进程 (Main)**: 应用生命周期、窗口管理、系统API调用
2. **预加载脚本 (Preload)**: 安全的主进程-渲染进程通信桥梁
3. **渲染进程 (Renderer)**: React应用UI渲染

### 状态管理模式
- 使用 Zustand 进行客户端状态管理
- 通过 IPC (Inter-Process Communication) 在进程间同步状态
- 设置数据持久化到主进程

### UI组件规范
- 基于 Radix UI 的无头组件
- Tailwind CSS 原子化样式
- 响应式设计支持
- 暗色模式适配 (如果实现)

### 构建配置
- **electron-vite**: 统一的构建配置
- **alias**: `@renderer` 和 `@` 指向 `src/renderer/src`
- **TypeScript**: 严格类型检查配置
- **ESLint + Prettier**: 代码规范和格式化

## 开发注意事项

### 安全考虑
- 预加载脚本严格限制API暴露
- 渲染进程禁止直接访问Node.js API
- 环境变量敏感信息不可提交到代码仓库

### 调试技巧
- F12开发者工具 (开发环境自动启用)
- 主进程调试使用 `console.log` 查看终端输出
- 渲染进程调试使用浏览器开发者工具

### 性能优化
- 避免在渲染进程执行计算密集型任务
- 合理使用IPC通信，避免频繁数据传输
- React组件适当使用memo优化重渲染

### 打包分发
- electron-builder 配置在 `electron-builder.yml`
- 支持自动更新 (electron-updater)
- 多平台构建支持