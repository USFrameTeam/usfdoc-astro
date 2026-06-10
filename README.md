# USF 文档站

基于 [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) 重新针对 USF（无名氏服务器管理框架）的文档需求，构建的文档站。

> 重要提示！此项目不直接作为官方文档站使用，项目内使用“官方”等字眼仅仅作为对齐官方文档站体验而使用，实际数据以官方文档站点为准

## 前置环境

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/)

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```
一般来说,本地预览环境建议build后,再preview,而不是直接用dev,因为我们的构建过程包含了对图片的优化,直接dev无法显示大部分图片。
## 项目结构

```
src/
├── components/     # 自定义组件
├── content/docs/   # 文档内容（MDX/MD）
│   ├── v2/         # V2 版本文档
│   ├── v1/         # V1 版本文档
│   ├── neo/        # NeoUSF 文档
│   └── more/       # 通用文档
├── scripts/        # 构建脚本
└── styles/         # 全局样式
```

## USFDoc-Astro 主要使用了下述外部技术:

- [Astro](https://astro.build/) - Web 框架
- [Starlight](https://starlight.astro.build/) 
- [pnpm](https://pnpm.io/) 

## 参与贡献

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献流程。

## 行为准则

请阅读 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) 了解社区行为准则。

## 许可证

本项目由 USFrameTeam 维护。
