/**
 * 首頁控制器
 */
const productController = require('./productController');

const indexController = {
    /**
     * 顯示首頁
     */
    showHomePage: (req, res) => {
        // 從 productController 獲取所有商品
        const allProducts = productController._products;
        
        // 只顯示前4個商品作為熱門商品
        const featuredProducts = allProducts.slice(0, 4);
        
        res.render('index', {
            title: 'YuChin購物網站',
            products: featuredProducts,
            categories: [...new Set(allProducts.map(p => p.category))]
        });
    }
};

module.exports = indexController; 