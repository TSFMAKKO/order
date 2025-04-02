# 绿界支付购物车示例

这是一个基于Node.js和Express的购物车系统，集成了台湾绿界（ECPay）支付功能。

## 功能特点

- 产品浏览和搜索
- 购物车管理
- 结账流程
- 绿界支付集成
- 响应式设计

## 技术栈

- Node.js
- Express.js
- EJS模板引擎
- Express Session
- Bootstrap 5
- 绿界支付API

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/ecpay-shopping-cart.git
cd ecpay-shopping-cart
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
然后编辑`.env`文件，填入你的绿界支付商家信息。

4. 启动应用
```bash
npm start
```

应用将运行在 http://localhost:3000

## 绿界支付配置

在`.env`文件中，你需要配置以下绿界支付相关的环境变量：

```
ECPAY_MERCHANT_ID=你的商店ID
ECPAY_HASH_KEY=你的HashKey
ECPAY_HASH_IV=你的HashIV
```

注意：示例中提供的是绿界测试环境的参数，正式上线时请替换为您自己的商家参数。

## 文件结构

```
├── app.js                  # 应用入口文件
├── src/                    # 源代码目录
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── public/             # 静态资源
│   ├── routes/             # 路由
│   └── views/              # 视图模板
├── .env                    # 环境变量
└── package.json            # 项目配置
```

## 开发模式

```bash
npm run dev
```

## 注意事项

- 本示例使用的是绿界支付的测试环境，实际上线时需替换为正式环境的参数
- 在正式环境中，确保使用HTTPS以保证支付安全
- 默认情况下，示例使用内存存储会话数据，生产环境应使用Redis等持久化存储

## 许可证

MIT 