const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const flash = require('connect-flash');

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 设置静态文件夹
app.use(express.static(path.join(__dirname, 'src/public')));

// 配置中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecpay-shopping-cart-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24小时
}));
app.use(flash());

// 全局设置购物车数据，让所有视图都能访问
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], total: 0 };
  }
  res.locals.cart = req.session.cart;
  res.locals.messages = req.flash();
  next();
});

// 导入控制器
const indexController = require('./src/controllers/indexController');

// 导入路由
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');
const checkoutRoutes = require('./src/routes/checkout');
const ecpayRoutes = require('./src/routes/ecpay');

// 使用路由
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/ecpay', ecpayRoutes);

// 首页路由
app.get('/', indexController.showHomePage);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 