const crypto = require('crypto');
const querystring = require('querystring');
const ecpayConfig = require('../config/ecpay');
const { v4: uuidv4 } = require('uuid');

/**
 * 綠界支付控制器
 */
const ecpayController = {
  /**
   * 創建訂單並跳轉到綠界支付頁面
   */
  createOrder: (req, res) => {
    try {
      // 驗證購物車
      const { cart, customerInfo } = req.session;
      
      console.log('\x1b[33m%s\x1b[0m', '[路由: /ecpay/checkout] 開始建立綠界訂單，購物車資料:', JSON.stringify(cart));
      
      // 檢查購物車是否存在且有商品
      if (!cart || !cart.items || !cart.items.length || !cart.total) {
        req.flash('error', '購物車為空，無法結帳');
        return res.redirect('/cart');
      }
      
      // 檢查客戶資訊是否完整
      if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        req.flash('error', '客戶資訊不完整，請重新填寫');
        return res.redirect('/checkout');
      }
      
      // 生成訂單編號 (使用時間戳記 + 隨機數)
      const orderId = `ECO${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // 將商品名稱拼接為單一字串
      const itemNames = cart.items.map(item => `${item.name} x ${item.quantity}`).join('#');
      // 準備給綠界的參數
      const tradeDesc = `訂單 ${orderId} 的商品`;
      const totalAmount = Math.round(cart.total);
      
      // 設定交易資料
      const data = {
        MerchantID: ecpayConfig.MerchantID,
        MerchantTradeNo: orderId,
        MerchantTradeDate: (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        })(),
        PaymentType: 'aio',
        TotalAmount: totalAmount,
        TradeDesc: encodeURIComponent(tradeDesc),
        ItemName: itemNames,
        ReturnURL: process.env.RETURN_URL,
        OrderResultURL: process.env.ORDER_RESULT_URL,
        ClientBackURL: process.env.CLIENT_BACK_URL,
        ChoosePayment: 'ALL',
        EncryptType: 1,  // 使用SHA256加密
      };
      
      // 生成CheckMacValue
      const checkMacValue = generateCheckMacValue(data);
      data.CheckMacValue = checkMacValue;
      
      // 將訂單資訊存入session，以便在支付完成後使用
      req.session.pendingOrder = {
        id: orderId,
        items: cart.items,
        total: cart.total,
        customerInfo,
        createdAt: new Date(),
      };
      
      console.log('\x1b[33m%s\x1b[0m', '[路由: /ecpay/checkout] 訂單建立完成，準備跳轉到綠界支付頁面');
      console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/checkout] 完整訂單參數:', JSON.stringify(data));
      
      // 渲染自動提交表單頁面
      res.render('ecpay/redirect', {
        title: '跳轉至綠界支付',
        action: ecpayConfig.getEndpoint('createOrder'),
        data: data
      });
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '[路由: /ecpay/checkout] 建立訂單時發生錯誤：', error);
      req.flash('error', '建立訂單時發生錯誤，請稍後再試');
      return res.redirect('/cart');
    }
  },
  
  /**
   * 綠界支付結果回調處理
   */
  handleCallback: (req, res) => {
    try {
      // 獲取回調數據
      const callbackData = req.body;
      
      // 美化控制台輸出
      console.log('\x1b[33m%s\x1b[0m', '[路由: /ecpay/callback] 收到綠界支付回調，資料：', JSON.stringify(callbackData));
      
      // 處理支付結果
      const merchantTradeNo = callbackData.MerchantTradeNo;
      const rtnCode = callbackData.RtnCode;
      
      if (rtnCode === '1') {
        // 支付成功
        console.log('\x1b[32m%s\x1b[0m', '[路由: /ecpay/callback] ✓ 訂單支付成功');
        console.log('\x1b[32m%s\x1b[0m', '┌─────── 支付成功詳細資訊 ───────┐');
        console.log('\x1b[32m%s\x1b[0m', '│ 訂單編號：', merchantTradeNo.padEnd(30), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 綠界交易編號：', callbackData.TradeNo.padEnd(26), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 交易金額：', `NT$ ${callbackData.TradeAmt}`.padEnd(29), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 付款方式：', callbackData.PaymentType.padEnd(30), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 付款時間：', callbackData.PaymentDate.padEnd(30), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 交易時間：', callbackData.TradeDate.padEnd(30), '│');
        console.log('\x1b[32m%s\x1b[0m', '│ 手續費：', `NT$ ${callbackData.PaymentTypeChargeFee}`.padEnd(29), '│');
        console.log('\x1b[32m%s\x1b[0m', '└────────────────────────────────┘');
      } else {
        // 支付失敗
        console.log('\x1b[31m%s\x1b[0m', '[路由: /ecpay/callback] ✗ 訂單支付失敗');
        console.log('\x1b[31m%s\x1b[0m', '┌─────── 支付失敗詳細資訊 ───────┐');
        console.log('\x1b[31m%s\x1b[0m', '│ 訂單編號：', merchantTradeNo.padEnd(30), '│');
        console.log('\x1b[31m%s\x1b[0m', '│ 失敗代碼：', callbackData.RtnCode.padEnd(30), '│');
        console.log('\x1b[31m%s\x1b[0m', '│ 失敗原因：', callbackData.RtnMsg.padEnd(30), '│');
        console.log('\x1b[31m%s\x1b[0m', '│ 交易時間：', callbackData.TradeDate.padEnd(30), '│');
        console.log('\x1b[31m%s\x1b[0m', '│ 交易金額：', `NT$ ${callbackData.TradeAmt}`.padEnd(29), '│');
        console.log('\x1b[31m%s\x1b[0m', '└────────────────────────────────┘');
        
        // 記錄詳細錯誤信息
        console.log('\x1b[33m%s\x1b[0m', '[路由: /ecpay/callback] 錯誤詳情：');
        console.log('\x1b[33m%s\x1b[0m', '- 錯誤代碼：', callbackData.RtnCode);
        console.log('\x1b[33m%s\x1b[0m', '- 錯誤描述：', callbackData.RtnMsg);
        console.log('\x1b[33m%s\x1b[0m', '- 付款方式：', callbackData.PaymentType);
        console.log('\x1b[33m%s\x1b[0m', '- 嘗試時間：', callbackData.TradeDate);
      }
      
      // 回應綠界
      res.send('1|OK');
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '[路由: /ecpay/callback] ⚠ 處理綠界回調時出錯:', error);
      res.status(500).send('0|ERROR');
    }
  },
  
  /**
   * 客戶從綠界支付頁面返回商店
   */
  handleReturn: (req, res) => {
    try {
      console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/return] 用戶從綠界支付頁面返回：', JSON.stringify(req.body));
      
      // 清空購物車
      req.session.cart = { items: [], total: 0 };
      
      // 跳轉到完成頁面
      res.redirect('/ecpay/result');
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '[路由: /ecpay/return] 處理綠界返回頁面時發生錯誤：', error);
      req.flash('error', '處理訂單時發生錯誤，請聯繫客服');
      return res.redirect('/');
    }
  },
  
  /**
   * 顯示支付結果頁面
   */
  showResultPage: async (req, res) => {
    try {
      console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/result] 接收到結果頁面請求:', req.method);
      
      let order = null;
      let paymentInfo = null;
      let customerInfo = null;
      
      // 處理POST請求（ECPay回調）
      if (req.method === 'POST') {
        console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/result] POST請求數據:', req.body);
        
        // 從請求中提取訂單號和金額
        const merchantTradeNo = req.body.MerchantTradeNo;
        const totalAmount = parseInt(req.body.TradeAmt, 10);
        
        // 保存支付相關資訊
        paymentInfo = {
          paymentType: req.body.PaymentType === 'Credit_CreditCard' ? '信用卡' : req.body.PaymentType,
          paymentDate: req.body.PaymentDate,
          amount: req.body.TradeAmt,
          tradeNo: req.body.TradeNo
        };
        
        // 嘗試從會話中獲取訂單資訊
        if (req.session.orders && req.session.orders[merchantTradeNo]) {
          order = req.session.orders[merchantTradeNo];
          order.status = req.body.RtnCode === '1' ? '支付成功' : '支付失敗';
          order.message = req.body.RtnMsg;
          
          // 確保order物件有total屬性
          if (!order.total && req.body.TradeAmt) {
            order.total = parseInt(req.body.TradeAmt, 10);
          }
          
          if (req.session.customerInfo) {
            customerInfo = req.session.customerInfo;
          }
        } else {
          // 如果會話中沒有找到訂單資訊，創建一個基本的訂單物件
          order = {
            id: merchantTradeNo,
            total: totalAmount,
            status: req.body.RtnCode === '1' ? '支付成功' : '支付失敗',
            message: req.body.RtnMsg,
            createdAt: new Date()
          };
        }
        
        if (req.body.RtnCode === '1') {
          console.log('\x1b[32m%s\x1b[0m', '[路由: /ecpay/result] 訂單支付成功：', merchantTradeNo);
          
          // 美化輸出詳細交易記錄
          console.log('\x1b[36m%s\x1b[0m', '===== 訂單結果頁面交易詳情 =====');
          console.log('\x1b[36m%s\x1b[0m', '訂單編號：', merchantTradeNo);
          console.log('\x1b[36m%s\x1b[0m', '綠界交易編號：', req.body.TradeNo);
          console.log('\x1b[36m%s\x1b[0m', '交易金額：', req.body.TradeAmt);
          console.log('\x1b[36m%s\x1b[0m', '付款方式：', req.body.PaymentType);
          console.log('\x1b[36m%s\x1b[0m', '付款日期時間：', req.body.PaymentDate);
          console.log('\x1b[36m%s\x1b[0m', '交易日期時間：', req.body.TradeDate);
          console.log('\x1b[36m%s\x1b[0m', '交易狀態：', req.body.RtnMsg);
          console.log('\x1b[36m%s\x1b[0m', '====================================');
          
        } else {
          console.log('\x1b[31m%s\x1b[0m', '[路由: /ecpay/result] 訂單支付失敗：', merchantTradeNo, req.body.RtnMsg);
        }
        
      } else {
        // 處理GET請求（用戶直接訪問結果頁面）
        // 從會話中獲取最近的訂單
        const pendingOrderId = req.session.pendingOrderId;
        
        console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/result] 嘗試獲取待處理訂單:', pendingOrderId);
        
        if (pendingOrderId && req.session.orders && req.session.orders[pendingOrderId]) {
          order = req.session.orders[pendingOrderId];
          
          // 確保order物件有total屬性
          if (!order.total && order.items) {
            order.total = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
          }
          
          if (req.session.customerInfo) {
            customerInfo = req.session.customerInfo;
          }
          
          console.log('\x1b[32m%s\x1b[0m', '[路由: /ecpay/result] 找到待處理訂單:', order.id);
        } else {
          // 如果沒有找到待處理的訂單，創建一個空訂單物件
          order = {
            id: '未知',
            total: 0,
            status: '未知',
            createdAt: new Date()
          };
          console.log('\x1b[33m%s\x1b[0m', '[路由: /ecpay/result] 沒有找到待處理訂單，使用空訂單');
        }
      }
      
      // 確保order物件存在並具有必要的屬性
      if (!order) {
        order = {
          id: '未知',
          total: 0,
          status: '未知',
          createdAt: new Date()
        };
      }
      
      console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/result] 渲染結果頁面，訂單ID:', order.id, '總金額:', order.total);
      
      // 渲染結果頁面
      res.render('ecpay/result', {
        title: '訂單結果',
        order,
        paymentInfo,
        customerInfo,
        error: null
      });
      
      // 清理會話中的訂單信息，防止重複處理
      if (req.method === 'POST' && req.body.MerchantTradeNo) {
        delete req.session.pendingOrderId;
        console.log('\x1b[36m%s\x1b[0m', '[路由: /ecpay/result] 已清理待處理訂單ID');
      }
      
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '[路由: /ecpay/result] 顯示訂單結果頁面時出錯:', error);
      res.render('ecpay/result', {
        title: '訂單結果',
        order: null,
        paymentInfo: null,
        customerInfo: null,
        error: '處理訂單時發生錯誤'
      });
    }
  }
};

/**
 * 生成CheckMacValue
 * 根據綠界支付規範V5版本，使用SHA256加密
 */
function generateCheckMacValue(data) {
  try {
    // 1. 排除 CheckMacValue 參數
    const { CheckMacValue, ...dataToHash } = data;
    
    // 2. 按照參數名稱的英文字母排序
    const sortedKeys = Object.keys(dataToHash).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    // 3. 組合參數名稱與參數值
    let queryString = 'HashKey=' + ecpayConfig.HashKey;
    sortedKeys.forEach(key => {
      queryString += '&' + key + '=' + dataToHash[key];
    });
    queryString += '&HashIV=' + ecpayConfig.HashIV;
    
    // 4. URL編碼
    let encodedString = encodeURIComponent(queryString);
    
    // 5. 轉換為小寫
    encodedString = encodedString.toLowerCase();
    
    // 6. 取代特殊字元
    encodedString = encodedString.replace(/%20/g, '+')
                                  .replace(/%2d/g, '-')
                                  .replace(/%5f/g, '_')
                                  .replace(/%2e/g, '.')
                                  .replace(/%21/g, '!')
                                  .replace(/%2a/g, '*')
                                  .replace(/%28/g, '(')
                                  .replace(/%29/g, ')')
                                  .replace(/%27/g, "'");
    
    // 7. 使用SHA256進行雜湊
    const hash = crypto.createHash('sha256').update(encodedString).digest('hex');
    
    // 8. 轉換為大寫
    return hash.toUpperCase();
  } catch (error) {
    console.error('生成CheckMacValue時發生錯誤：', error);
    throw new Error('生成CheckMacValue失敗');
  }
}

module.exports = ecpayController; 