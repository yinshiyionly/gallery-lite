# 多端画廊项目 MVP

基于 Node.js + MongoDB + React 的多端画廊应用，支持 Vercel 部署。

## 项目结构

```
gallery-app/
├── client/          # React 前端
├── server/          # Node.js 后端
├── package.json     # 根目录依赖
└── vercel.json      # Vercel 部署配置
```

## 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装服务端依赖
cd server && npm install

# 安装客户端依赖
cd ../client && npm install
```

### 2. 配置环境变量

复制 `server/.env.example` 为 `server/.env`，并配置 MongoDB Atlas 连接：

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gallery?retryWrites=true&w=majority
PORT=5000
```

### 3. 初始化数据库（可选）

```bash
cd server
node seed.js
```

### 4. 启动开发服务器

```bash
# 在根目录运行，同时启动前后端
npm run dev
```

或分别启动：

```bash
# 启动后端 (端口 5000)
npm run server

# 启动前端 (端口 3000)
npm run client
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量 `MONGODB_URI`
4. 部署完成

## 功能特性

- ✅ 响应式画廊展示
- ✅ MongoDB Atlas 云数据库
- ✅ RESTful API
- ✅ 移动端适配
- ✅ Vercel 一键部署

## API 接口

- `GET /api/media` - 获取所有媒体资源
- `GET /api/media/:id` - 获取单个媒体资源
- `POST /api/media` - 创建新媒体资源

## 技术栈

- **前端**: React 18, Axios
- **后端**: Node.js, Express, Mongoose
- **数据库**: MongoDB Atlas
- **部署**: Vercel