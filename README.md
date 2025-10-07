# 🛰️ KProbe-Web

KProbe 是一款用于服务器（集群）状态探测与监控的探针系统，本项目 **KProbe-Web** 为其 **前端演示 Demo**。

---

### ✨ 项目简介

本项目基于 **Vue 3 + Vite + TypeScript + Pinia** 结合 **Tailwind CSS** 构建，主要用于展示 KProbe 系统的前端界面与交互逻辑。

- 通过 **TypeScript 接口定义** 明确数据结构，保证数据传输类型安全。
- 使用 **路由守卫（Navigation Guards）** 实现页面级数据预加载，提高用户体验与加载效率。
- 使用 **Mock.js** 模拟后端 API 数据，方便前后端联调与独立开发。

---

### 🧩 技术栈

| 分类     | 技术         |
| -------- | ------------ |
| 前端框架 | Vue 3        |
| 构建工具 | Vite         |
| 状态管理 | Pinia        |
| 语言     | TypeScript   |
| UI 框架  | Tailwind CSS |
| 数据模拟 | Mock.js      |

---

### 🚀 快速启动

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev
```

启动后访问本地开发服务器（一般为 `http://127.0.0.1:5173/`），即可查看演示页面。

---

### 🧠 说明

该项目仅用于演示与教学目的，当前版本为 **前端展示 Demo**，不包含实际后端通信逻辑。
如需与真实 KProbe 服务端集成，可在后续版本中替换或对接真实 API。（ps：大概考虑 `Golang` 作为后端）
