# YuChin購物網站

這是一個使用Node.js和Express框架開發的購物網站，整合綠界金流服務實現線上支付功能。

## 功能特點

- 響應式設計，支持桌面和移動設備
- 商品展示和搜索
- 購物車管理
- 訂單處理
- 綠界金流整合
- 支持多種支付方式

## 技術棧

- Node.js
- Express.js
- EJS 模板引擎
- Bootstrap 5
- MySQL 數據庫
- 綠界金流 API
- Docker

## 安裝說明

### 本地開發

1. 克隆項目
```bash
git clone https://github.com/TSFMAKKO/order.git
cd order
```

2. 安裝依賴
```bash
npm install
```

3. 配置環境變量
```bash
cp .env.example .env
```
編輯 .env 文件，填入必要的配置信息

4. 啟動服務器
```bash
npm start
```

### Docker 部署

1. 建構映像檔
```bash
docker build -t yuchin-shop .
```

2. 運行容器
```bash
docker run -p 3000:3000 yuchin-shop
```

### Replit 部署

1. 在 Replit 中導入專案
   - 點擊 "Create Repl"
   - 選擇 "Import from GitHub"
   - 輸入倉庫地址：https://github.com/TSFMAKKO/order.git

2. 配置環境變量
   - 在 Replit 的 "Secrets" 標籤中添加必要的環境變量

3. 運行專案
   - Replit 會自動檢測 Docker 配置並運行專案
   - 點擊 "Run" 按鈕啟動應用

## 目錄結構

```
├── app.js              # 應用程序入口
├── package.json        # 項目依賴
├── public/            # 靜態資源
├── src/
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── routes/       # 路由
│   └── views/        # 視圖模板
├── Dockerfile        # Docker 配置文件
├── .replit           # Replit 配置文件
└── README.md         # 項目說明
```

## 使用說明

1. 瀏覽商品：訪問首頁可以查看所有商品
2. 添加到購物車：點擊商品的"加入購物車"按鈕
3. 購物車管理：可以調整商品數量或移除商品
4. 結帳流程：選擇商品後點擊"結帳"按鈕
5. 填寫訂單信息：輸入收貨和聯繫信息
6. 選擇支付方式：支持信用卡、ATM等多種支付方式
7. 完成訂單：支付成功後會顯示訂單確認信息

## 開發者

- YuChin

## 版權聲明

© 2024 YuChin。保留所有權利。

本項目為私有軟件，未經授權不得使用、複製、修改或分發。
嚴禁任何未經許可的使用、複製、修改或分發本軟件的行為。
如需使用本軟件，請聯繫作者獲得授權。 