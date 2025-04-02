/**
 * 結賬控制器
 */
const checkoutController = {
  /**
   * 顯示結賬頁面
   */
  showCheckout: (req, res) => {
    const error = req.query.error || '';
    const selectedItems = req.query.items ? req.query.items.split(',') : [];
    const selectedTotal = req.query.total ? parseFloat(req.query.total) : 0;
    
    // 確保購物車結構正確
    if (!req.session.cart || !req.session.cart.items) {
      req.session.cart = {
        items: [],
        total: 0
      };
    }
    
    // 如果沒有選擇商品，重定向到購物車頁面
    if (!selectedItems.length) {
      return res.redirect('/cart?error=請先選擇要購買的商品');
    }
    
    // 從購物車中篩選出選中的商品
    const selectedCartItems = req.session.cart.items.filter(item => 
      selectedItems.includes(item.productId.toString())
    );
    
    // 創建一個新的購物車對象，只包含選中的商品
    const checkoutCart = {
      items: selectedCartItems,
      total: selectedTotal
    };
    
    // 獲取上一次填寫的客戶信息（如果有）
    const customerInfo = req.session.customerInfo || {};
    
    // 將選中的商品信息保存到會話中
    req.session.checkoutItems = checkoutCart;
    
    res.render('checkout/index', {
      cart: checkoutCart,
      customerInfo,
      error,
      title: '結賬'
    });
  },
  
  /**
   * 處理結賬表單提交
   */
  processCheckout: (req, res) => {
    try {
      const { 
        name, email, phone, address, paymentMethod
      } = req.body;
      
      // 驗證必填字段
      if (!name || !email || !phone || !address) {
        return res.redirect('/checkout?error=請填寫所有必填字段');
      }
      
      // 驗證是否有選中的商品
      if (!req.session.checkoutItems || !req.session.checkoutItems.items || !req.session.checkoutItems.items.length) {
        return res.redirect('/cart?error=請選擇要購買的商品');
      }
      
      // 保存客戶信息到會話
      req.session.customerInfo = {
        name,
        email,
        phone,
        address,
        paymentMethod: paymentMethod || 'ecpay'
      };
      
      // 保存訂單信息
      req.session.pendingOrder = {
        items: req.session.checkoutItems.items,
        total: req.session.checkoutItems.total,
        customerInfo: req.session.customerInfo
      };
      
      // 根據選擇的付款方式重定向
      if (paymentMethod === 'ecpay') {
        // 使用綠界支付，重定向到綠界支付處理
        res.redirect('/ecpay/create-order');
      } else {
        // 其他支付方式
        res.redirect('/checkout/complete');
      }
    } catch (error) {
      console.error('處理結賬信息時出錯:', error);
      res.redirect('/checkout?error=處理結賬信息失敗，請重試');
    }
  },
  
  /**
   * 顯示支付方式選擇頁面
   */
  showPaymentPage: (req, res) => {
    const cart = req.session.cart || [];
    const totalAmount = req.session.totalAmount || 0;
    const customerInfo = req.session.customerInfo || {};
    
    // 檢查是否已填寫客戶信息
    if (!customerInfo.name || !customerInfo.email) {
      return res.redirect('/checkout?error=請先完成結賬信息');
    }
    
    // 檢查購物車是否有商品
    if (!cart.length) {
      return res.redirect('/cart?error=購物車為空，無法結賬');
    }
    
    res.render('checkout/payment', {
      cart,
      totalAmount,
      customerInfo,
      title: '選擇支付方式'
    });
  },
  
  /**
   * 處理付款方式選擇
   */
  processPayment: (req, res) => {
    try {
      const { paymentMethod } = req.body;
      
      if (!paymentMethod) {
        return res.redirect('/checkout/payment?error=請選擇付款方式');
      }
      
      // 根據選擇的付款方式重定向到相應的支付處理頁面
      if (paymentMethod === 'ecpay') {
        // 使用綠界支付，重定向到綠界支付處理
        res.redirect('/ecpay/create-order');
      } else if (paymentMethod === 'cod') {
        // 貨到付款處理
        // TODO: 處理貨到付款訂單
        res.redirect('/checkout/complete?method=cod');
      } else {
        res.redirect('/checkout/payment?error=不支持的付款方式');
      }
    } catch (error) {
      console.error('處理付款方式選擇時出錯:', error);
      res.redirect('/checkout/payment?error=處理付款方式失敗，請重試');
    }
  },
  
  /**
   * 顯示訂單完成頁面（貨到付款等非在線支付方式）
   */
  showCompletePage: (req, res) => {
    const customerInfo = req.session.customerInfo || {};
    
    // 檢查是否有客戶信息和購物車
    if (!customerInfo.name || !req.session.cart || !req.session.cart.items || !req.session.cart.items.length) {
      return res.redirect('/');
    }
    
    // 生成訂單號
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // TODO: 在數據庫中保存訂單信息
    
    // 清空購物車
    req.session.cart = {
      items: [],
      total: 0
    };
    
    res.render('checkout/complete', {
      orderId,
      customerInfo,
      title: '訂單完成'
    });
  }
};

module.exports = checkoutController; 