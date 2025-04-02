/**
 * 購物車控制器
 */
const cartController = {
  /**
   * 顯示購物車頁面
   */
  showCart: (req, res) => {
    // 確保購物車結構正確
    if (!req.session.cart || !req.session.cart.items) {
      req.session.cart = {
        items: [],
        total: 0
      };
    }
    
    const error = req.query.error || '';
    const success = req.query.success || '';
    
    res.render('cart/index', {
      error,
      success,
      title: '購物車'
    });
  },
  
  /**
   * 添加商品到購物車
   */
  addToCart: (req, res) => {
    try {
      const { productId, name, price, quantity = 1, image } = req.body;
      
      if (!productId || !name || !price) {
        return res.redirect('/cart?error=商品資訊不完整');
      }
      
      // 初始化購物車如果不存在
      if (!req.session.cart || !req.session.cart.items) {
        req.session.cart = {
          items: [],
          total: 0
        };
      }
      
      // 檢查商品是否已在購物車中
      const existingItemIndex = req.session.cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // 更新已有商品的數量
        req.session.cart.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // 添加新商品到購物車
        req.session.cart.items.push({
          productId,
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          image: image || '/img/no-image.jpg'
        });
      }
      
      // 重新計算購物車總金額
      req.session.cart.total = req.session.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      res.redirect('/cart?success=商品已添加到購物車');
    } catch (error) {
      console.error('添加商品到購物車時出錯:', error);
      res.redirect('/cart?error=添加商品失敗，請重試');
    }
  },
  
  /**
   * 更新購物車中的商品數量
   */
  updateCart: (req, res) => {
    try {
      const { productId, action } = req.body;
      
      if (!productId) {
        return res.redirect('/cart?error=更新資訊不完整');
      }
      
      if (!req.session.cart || !req.session.cart.items) {
        return res.redirect('/cart?error=購物車為空');
      }
      
      const itemIndex = req.session.cart.items.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
        return res.redirect('/cart?error=商品不在購物車中');
      }
      
      if (action === 'increase') {
        // 增加數量
        req.session.cart.items[itemIndex].quantity += 1;
      } else if (action === 'decrease') {
        // 減少數量
        if (req.session.cart.items[itemIndex].quantity > 1) {
          req.session.cart.items[itemIndex].quantity -= 1;
        } else {
          // 如果數量為1，則刪除商品
          req.session.cart.items.splice(itemIndex, 1);
        }
      }
      
      // 重新計算購物車總金額
      req.session.cart.total = req.session.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      res.redirect('/cart?success=購物車已更新');
    } catch (error) {
      console.error('更新購物車時出錯:', error);
      res.redirect('/cart?error=更新購物車失敗，請重試');
    }
  },
  
  /**
   * 從購物車中移除商品
   */
  removeFromCart: (req, res) => {
    try {
      const { productId } = req.body;
      
      if (!productId) {
        return res.redirect('/cart?error=商品ID不能為空');
      }
      
      if (!req.session.cart || !req.session.cart.items) {
        return res.redirect('/cart?error=購物車為空');
      }
      
      // 過濾購物車移除指定商品
      req.session.cart.items = req.session.cart.items.filter(item => item.productId !== productId);
      
      // 重新計算購物車總金額
      req.session.cart.total = req.session.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      res.redirect('/cart?success=商品已從購物車中移除');
    } catch (error) {
      console.error('從購物車移除商品時出錯:', error);
      res.redirect('/cart?error=移除商品失敗，請重試');
    }
  },
  
  /**
   * 清空購物車
   */
  clearCart: (req, res) => {
    req.session.cart = {
      items: [],
      total: 0
    };
    
    res.redirect('/cart?success=購物車已清空');
  }
};

module.exports = cartController; 