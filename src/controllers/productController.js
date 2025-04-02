/**
 * 產品控制器
 */
const productController = {
  /**
   * 模擬產品數據，真實項目中應該從數據庫獲取
   */
  _products: [
    {
      id: 'p1',
      name: '智能手機',
      description: '最新款智能手機，高性能處理器，超長電池續航。',
      price: 12000,
      image: '/img/no-image.jpg',
      category: 'electronics'
    },
    {
      id: 'p2',
      name: '筆記本電腦',
      description: '輕薄筆記本電腦，適合工作和娛樂。',
      price: 28000,
      image: '/img/no-image.jpg',
      category: 'electronics'
    },
    {
      id: 'p3',
      name: '無線耳機',
      description: '高品質藍牙無線耳機，降噪功能。',
      price: 3500,
      image: '/img/no-image.jpg',
      category: 'electronics'
    },
    {
      id: 'p4',
      name: '運動鞋',
      description: '舒適透氣的運動鞋，適合日常運動。',
      price: 2200,
      image: '/img/no-image.jpg',
      category: 'fashion'
    },
    {
      id: 'p5',
      name: '桌面顯示器',
      description: '27英寸4K高清顯示器，護眼不閃屏。',
      price: 7500,
      image: '/img/no-image.jpg',
      category: 'electronics'
    },
    {
      id: 'p6',
      name: '智能手錶',
      description: '多功能智能手錶，健康監測，通知提醒。',
      price: 4800,
      image: '/img/no-image.jpg',
      category: 'electronics'
    },
    {
      id: 'p7',
      name: '平板電腦',
      description: '高效能平板電腦，大螢幕顯示，續航力強。',
      price: 15000,
      image: '/img/no-image.jpg',
      category: 'electronics'
    }
  ],
  
  /**
   * 顯示產品列表頁面
   */
  listProducts: (req, res) => {
    const category = req.query.category || '';
    const search = req.query.search || '';
    
    let products = [...productController._products];
    
    // 按類別篩選
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    // 按關鍵詞搜索
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // 獲取所有類別（去重）
    const categories = [...new Set(productController._products.map(p => p.category))];
    
    res.render('products/index', {
      products,
      categories,
      currentCategory: category,
      search,
      title: '商品列表'
    });
  },
  
  /**
   * 顯示產品詳情頁面
   */
  showProduct: (req, res) => {
    const { productId } = req.params;
    
    const product = productController._products.find(p => p.id === productId);
    
    if (!product) {
      return res.redirect('/products?error=產品不存在');
    }
    
    // 獲取相關產品
    const relatedProducts = productController._products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    
    res.render('products/detail', {
      product,
      relatedProducts,
      title: product.name
    });
  },
  
  /**
   * 獲取單個產品（供API使用）
   */
  getProduct: (req, res) => {
    const { productId } = req.params;
    const product = productController._products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: '產品不存在' });
    }
    
    res.json(product);
  },

  /**
   * 上傳產品圖片（管理員功能）
   */
  uploadProductImage: (req, res) => {
    // 此處應該有檔案上傳處理邏輯
    // 實際項目中會使用multer等中間件處理
    res.status(501).json({ error: '功能尚未實現' });
  },

  /**
   * 獲取所有商品
   */
  getProducts: () => {
    return productController._products;
  },

  /**
   * 獲取單個商品
   */
  getProduct: (productId) => {
    return productController._products.find(p => p.id === productId);
  },

  /**
   * 顯示商品列表頁面
   */
  showProductList: (req, res) => {
    res.render('products/index', {
      products: productController._products,
      title: '商品列表'
    });
  },

  /**
   * 顯示商品詳情頁面
   */
  showProductDetail: (req, res) => {
    const product = productController._products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).render('error', {
        message: '商品不存在'
      });
    }

    res.render('products/detail', {
      product: product,
      title: product.name
    });
  }
};

module.exports = productController; 