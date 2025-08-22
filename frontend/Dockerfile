# Stage 1: Build Phase
# 使用官方 Node.js 18 的 Alpine 版本作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件，以利用 Docker 的缓存机制
COPY package*.json ./

# 安装项目依赖。
RUN npm install

# 复制所有前端源代码
COPY . .

# 运行 React 的构建脚本，生成静态文件
RUN npm run build

# Stage 2: Serve Phase。使用轻量级的 Nginx 镜像作为生产环境的 Web 服务器
FROM nginx:alpine

# 将上一阶段构建生成的静态文件（在 `/app/build` 目录中）复制到 Nginx 的默认静态文件目录
COPY --from=builder /app/build /usr/share/nginx/html

# 暴露 80 端口，这是 Nginx 默认监听的端口
EXPOSE 80

# 当容器启动时，启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]