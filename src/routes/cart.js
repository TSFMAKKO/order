const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// 購物車頁面
router.get('/', cartController.showCart);

// 添加商品到購物車
router.post('/add', cartController.addToCart);

// 更新購物車中的商品數量
router.post('/update', cartController.updateCart);

// 從購物車中移除商品
router.post('/remove', cartController.removeFromCart);

// 清空購物車
router.get('/clear', cartController.clearCart);

module.exports = router; 