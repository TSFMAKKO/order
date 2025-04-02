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

## 安裝說明

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

## 授權

本項目採用 MIT 授權條款 