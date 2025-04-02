/**
 * 购物商城主要JavaScript文件
 */
document.addEventListener('DOMContentLoaded', function() {
  // 自动关闭提醒消息
  setTimeout(function() {
    const alerts = document.querySelectorAll('.alert.alert-dismissible');
    alerts.forEach(function(alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 5000);

  // 添加到购物车按钮动画
  const addToCartButtons = document.querySelectorAll('button[type="submit"]');
  addToCartButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      button.classList.add('btn-success');
      button.innerHTML = '<i class="fas fa-check"></i> 已添加';
      
      setTimeout(function() {
        button.classList.remove('btn-success');
        button.innerHTML = '<i class="fas fa-cart-plus"></i> 加入购物车';
      }, 1000);
    });
  });

  // 数量输入框控制
  const quantityInputs = document.querySelectorAll('input[type="number"]');
  quantityInputs.forEach(function(input) {
    input.addEventListener('change', function() {
      // 确保数量不小于1
      if (parseInt(input.value) < 1) {
        input.value = 1;
      }
      
      // 确保数量不大于99
      if (parseInt(input.value) > 99) {
        input.value = 99;
      }
    });
  });

  // 图片错误处理
  const productImages = document.querySelectorAll('.product-image, .product-detail-image');
  productImages.forEach(function(img) {
    img.addEventListener('error', function() {
      // 如果图片加载失败，使用默认图片
      img.src = '/img/no-image.jpg';
    });
  });
}); 