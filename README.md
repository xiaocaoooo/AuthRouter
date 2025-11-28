# AuthRouter

一个基于Node.js和TypeScript开发的Docker化HTTP转发服务，支持通过URL路径参数指定目标主机，并能处理包含多个令牌的Authorization头。

## 功能特性

- ✅ **HTTP请求转发**：通过URL路径参数指定目标主机
- ✅ **多令牌处理**：从Authorization头中随机选择一个令牌
- ✅ **TypeScript开发**：确保类型安全
- ✅ **Docker化部署**：使用多阶段构建优化镜像大小
- ✅ **错误处理**：处理无效URL和无效Authorization头格式
- ✅ **日志记录**：记录转发请求信息和错误
- ✅ **单元测试**：验证核心功能

## 技术栈

- Node.js 20
- TypeScript 5
- Express.js 4
- http-proxy-middleware 2
- winston 3
- Jest 29
- Docker

## 安装和运行

### 本地运行

1. 安装依赖

```bash
npm install
```

2. 编译TypeScript代码

```bash
npm run build
```

3. 启动服务

```bash
npm start
```

或使用开发模式（实时重载）

```bash
npm run dev
```

### Docker运行

1. 构建Docker镜像

```bash
docker build -t auth-router .
```

2. 运行Docker容器

```bash
docker run -d -p 8000:8000 --name auth-router auth-router
```

3. 查看容器日志

```bash
docker logs -f auth-router
```

## 使用示例

### 基本用法

将请求转发到目标主机：

```
http://127.0.0.1:8000/example.com/api/resource
```

这将转发到：

```
https://example.com/api/resource
```

### 带Authorization头

```bash
curl -H "Authorization: Bearer token1,token2,token3" http://127.0.0.1:8000/example.com/api/resource
```

服务会从`token1,token2,token3`中随机选择一个令牌，并在转发请求时使用该令牌。

## API文档

### 健康检查

```
GET /health
```

返回服务状态信息。

### 代理路由

```
* /{host}/*
```

将请求转发到指定的目标主机。

## 测试

运行单元测试：

```bash
npm test
```

运行测试并生成覆盖率报告：

```bash
npm test -- --coverage
```

## 日志

日志文件位于`logs/`目录下：

- `logs/combined.log`：所有日志
- `logs/error.log`：仅错误日志

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | `8000` |
| `NODE_ENV` | 运行环境 | `production` |
| `LOG_LEVEL` | 日志级别 | `info` |

## 许可证

MIT
