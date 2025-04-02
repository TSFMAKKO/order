const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// 結帳頁面
router.get('/', checkoutController.showCheckout);

// 處理結帳表單提交
router.post('/process', checkoutController.processCheckout);

// 訂單完成頁面
router.get('/complete', checkoutController.showCompletePage);

module.exports = router; 