const express = require('express');
const router = express.Router();
const ecpayController = require('../controllers/ecpayController');

// 创建订单并跳转到绿界支付页面
router.get('/create-order', ecpayController.createOrder);

// 绿界支付结果回调URL
router.post('/callback', express.raw({ type: 'application/x-www-form-urlencoded' }), ecpayController.handleCallback);

// 客户从绿界支付页面返回商店
router.get('/return', ecpayController.handleReturn);
router.post('/return', express.urlencoded({ extended: false }), ecpayController.handleReturn);

// 显示支付结果页面 - 支援GET和POST
router.get('/result', ecpayController.showResultPage);
router.post('/result', express.urlencoded({ extended: false }), ecpayController.showResultPage);

module.exports = router; 