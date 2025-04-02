# 使用 Node.js 18 作為基礎鏡像
FROM node:18-slim

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有源代碼
COPY . .

# 設置環境變量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["npm", "start"] 