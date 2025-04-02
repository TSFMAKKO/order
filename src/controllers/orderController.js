// 建立訂單並設置session
req.session.pendingOrder = {
  id: orderId,
  items: cartItems,
  total: cartTotal,
  createdAt: new Date(),
  customerInfo: {
    name: name,
    email: email,
    phone: phone,
    address: address
  }
};

// 存儲訂單項目，以便在綠界回調時可以訪問
if (!req.session.orderItems) {
  req.session.orderItems = {};
}
req.session.orderItems[orderId] = {
  items: cartItems,
  total: cartTotal,
  customerInfo: {
    name: name,
    email: email,
    phone: phone,
    address: address
  }
};

/**
 * 創建訂單並跳轉到支付頁面
 */
exports.createOrder = async (req, res) => {
  try {
    const { cart, customerInfo } = req.body;

    // 驗證購物車數據
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: '購物車是空的' });
    }

    // 美化的日誌輸出
    console.log('\x1b[32m%s\x1b[0m', '[路由: /api/orders] 開始建立綠界訂單，購物車資料:', JSON.stringify(cart));

    // 生成訂單ID
    const orderId = generateOrderId();
    
    // 計算總金額
    const totalAmount = cart.total;
    
    // 創建訂單描述和商品名稱
    const tradeDesc = `訂單 ${orderId} 的商品`;
    const itemNames = cart.items.map(item => `${item.name} x ${item.quantity}`).join('#');
    
    // 保存訂單到會話
    if (!req.session.orders) {
      req.session.orders = {};
    }
    
    req.session.orders[orderId] = {
      id: orderId,
      items: cart.items,
      total: totalAmount,
      status: '處理中',
      createdAt: new Date()
    };
    
    // 保存客戶資訊
    req.session.customerInfo = customerInfo;
    
    // 保存當前處理的訂單ID
    req.session.pendingOrderId = orderId;
    
    // 創建訂單並生成支付表單
    const result = await ecpayService.createOrder(orderId, totalAmount, tradeDesc, itemNames);
    
    // 美化的日誌輸出
    console.log('\x1b[32m%s\x1b[0m', '[路由: /api/orders] 訂單建立完成，準備跳轉到綠界支付頁面');
    console.log('\x1b[36m%s\x1b[0m', '[路由: /api/orders] 完整訂單參數:', JSON.stringify(result.order));
    
    res.status(200).json({
      success: true,
      message: '訂單創建成功',
      data: {
        formHtml: result.formHtml
      }
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '[路由: /api/orders] 創建訂單時發生錯誤:', error);
    res.status(500).json({
      success: false,
      message: '創建訂單時發生錯誤'
    });
  }
}; 