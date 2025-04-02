const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 产品列表页
router.get('/', productController.listProducts);

// 产品详情页
router.get('/:productId', productController.showProduct);

// 获取单个产品信息(API)
router.get('/api/:productId', productController.getProduct);

module.exports = router; 