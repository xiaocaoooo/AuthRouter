# 第一阶段：编译TypeScript代码
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY tsconfig.json ./
COPY src ./src

# 编译TypeScript代码
RUN npm run build

# 第二阶段：运行时环境
FROM node:20-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装生产依赖
RUN npm ci --omit=dev

# 复制编译后的代码
COPY --from=builder /app/dist ./dist

# 创建日志目录
RUN mkdir -p logs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8000

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["node", "dist/index.js"]
