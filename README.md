# 编码面试解题助手

![使用演示](https://github.com/user-attachments/assets/19781594-3108-4711-a54b-9d36496787bc)

## 项目简介

这是一个面向中文用户的编程解题助手，适配国内AI生态，简单易用。

### 软件适用场景

- 编程面试，分析屏幕上的题目，实时给出解题思路和代码，即便面试官要求分享屏幕，也不会被发现
- 笔试题目，不会导致笔试网页失焦，可规避“跳出网页”检测
- 其他场景（如：英语机试 等）可以通过在设置界面中配置“自定义提示词”来自行扩展

### 核心能力

- 通过快捷键抓取屏幕内容，并发送给大模型进行分析
- 窗口在屏幕分享时，不会被发现
- 窗口置顶半透明展示，不会导致原页面失焦，从而规避“跳出网页”检测

### 项目特点

- 简单易用，只需要配置 API_BASE_URL 和 API_KEY 即可开始使用。
- 重点支持编程相关算法题目，同时也支持其他编程题型（单选、多选，解答等题型）。
- 支持多种编程语言，包括 Python、JavaScript、Java、C++ 等。
- 本应用具有隐身能力，即使被要求分享屏幕，面试官也看不到解题助手的界面。

### 核心技术原理

- 通过快捷键抓取屏幕内容
- 将截屏内容发送给 AI 模型，生成解题思路和代码


## 如何使用

> 注意：项目有编译安装包，你也可以直接下载安装包使用（如何安装，以及安装完后如何配置，请参考 [Wiki 教程](https://github.com/ooboqoo/interview-coder-cn/wiki/%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85%E5%8C%85%E4%BD%BF%E7%94%A8)）。

> 注意：详细的使用教程请移步本项目的 [Wiki](https://github.com/ooboqoo/interview-coder-cn/wiki) 页面查看。

### 1. 安装依赖

注：项目运行依赖 Node.js 环境，如未安装请先安装 [下载地址](https://nodejs.org/zh-cn/download)。

```bash
$ npm install
```

### 2. 配置 API Key

在项目根目录创建一个 `.env` 文件，并配置 `API_BASE_URL` 和 `API_KEY`。

API_BASE_URL 和 API_KEY 需要从支持 OpenAI API 的代理服务商处获取。如 [CloseAI](https://www.closeai-asia.com/)、[AIHubMix](https://aihubmix.com/) 等服务商，支持支付宝付款，开账户很方便。

当然，如果你（人在海外）可以直接使用 OpenAI 官方的 API 更好，只需要配置 `API_KEY` 就够了。

```env
API_BASE_URL="https://api.openai-proxy.org/v1" # 代理服务商的 API 地址，这里以 CloseAI 为例
API_KEY="sk-1234567890" # 代理服务商的 API Key，这里只是示例，需要改成你自己的
```

### 3. 启动程序开始正常使用

```bash
$ npm run dev
```


## 关于隐身能力的说明

目前隐身功能适配市面上大部分会议软件(如 腾讯会议 等)，但很少部分软件和浏览器可能无法正常隐身。使用前自己做好测试，本项目不承担任何责任。相关问题欢迎大家提 Issue 讨论。


## 视频教程

具体可到 [Wiki](https://github.com/ooboqoo/interview-coder-cn/wiki) 页面查看。


## 许可协议（License）

> 虽然这套代码目前在 GitHub 上以「解题助手」的形式做推广，但实际应用场景非常广泛。后续期望在更多场景做商业落地，欢迎有兴趣朋友洽谈合作事项。

本项目采用 **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh)** 协议许可。

您可以自由使用、复制、修改本项目代码，但 **禁止任何形式的商业用途**，包括但不限于售卖、集成入商业产品、SaaS 服务等。

如需商业授权，请联系作者获得书面许可。
