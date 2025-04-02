/**
 * 綠界支付(ECPay)配置
 */
module.exports = {
  // 商店ID，測試環境固定使用此值
  MerchantID: process.env.ECPAY_MERCHANT_ID || '2000132',
  
  // 哈希金鑰，測試環境固定使用此值
  HashKey: process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9',
  
  // 哈希IV，測試環境固定使用此值
  HashIV: process.env.ECPAY_HASH_IV || 'v77hoKGq4kWxNNIS',
  
  // 是否使用測試環境，開發時設定為true
  isTest: true,
  
  // API 端點
  endpoints: {
    // 測試環境
    test: {
      createOrder: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
      queryOrder: 'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5',
    },
    // 正式環境
    production: {
      createOrder: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
      queryOrder: 'https://payment.ecpay.com.tw/Cashier/QueryTradeInfo/V5',
    }
  },
  
  // 付款方式
  paymentMethods: {
    Credit: '信用卡付款',
    WebATM: '網路ATM',
    ATM: 'ATM付款',
    CVS: '超商代碼',
    BARCODE: '超商條碼',
    ALL: '全部'
  },
  
  // 獲取當前環境的API端點
  getEndpoint: function(type) {
    const env = this.isTest ? 'test' : 'production';
    return this.endpoints[env][type];
  }
}; 