# 贡献指南

感谢你对 USF 文档项目的关注！以下是参与贡献的流程。

## 如何贡献

### 报告问题

如果你发现了文档中的错误或有改进建议：

1. 前往 [Issues](https://github.com/USFrameTeam/usfdoc-astro/issues) 页面
2. 搜索是否已有相关 issue
3. 如果没有，创建一个新的 issue，详细描述问题或建议

### 提交修改

1. **Fork 本仓库**

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/你的用户名/usfdoc-astro.git
   cd usfdoc-astro
   ```

3. **创建新分支**
   ```bash
   git checkout -b 你的分支名
   ```

4. **安装依赖**
   ```bash
   pnpm install
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

6. **进行修改**
   - 文档文件位于 `src/content/docs/` 目录
   - 使用 MDX 或 MD 格式编写
   - 遵循现有文档的风格和结构

7. **预览修改**
   - 访问 `http://localhost:4321` 查看效果

8. **提交并推送**
   ```bash
   git add .
   git commit -m "你的提交信息"
   git push origin 你的分支名
   ```

9. **创建 PR**

## 文档规范

### 文件结构

- 每个文档页面是一个 `.mdx` 或 `.md` 文件
- 文件路径对应 URL 路径
- 使用有意义的文件名

### 内容规范

- 使用简洁明了的语言
- 提供实际的代码示例
- 使用表格整理结构化信息
- 为复杂功能提供步骤说明

### 组件使用

文档支持 Starlight 内置组件：

```mdx
import { Aside, Tabs, TabItem, Steps, Card, CardGrid } from '@astrojs/starlight/components';

<Aside type="tip">
提示内容
</Aside>

<Tabs>
  <TabItem label="标签1">
    内容1
  </TabItem>
  <TabItem label="标签2">
    内容2
  </TabItem>
</Tabs>
```

另外,完全兼容MD语法,你可以直接使用MD格式编写文档。
## 开发环境

### 前置要求

- Node.js >= 20
- pnpm使用合适的版本就行了

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
一般来说,本地预览环境建议build后,再preview,而不是直接用dev,因为我们的构建过程包含了对图片的优化,直接dev无法显示大部分图片。

## 行为准则

参与本项目即表示你同意遵守我们的 [行为准则](./CODE_OF_CONDUCT.md)。

## 问题？

如有任何问题，请在 [Issues](https://github.com/USFrameTeam/usfdoc-astro/issues) 中提出。
