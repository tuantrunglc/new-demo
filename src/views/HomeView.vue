<template>
  <div>
    <site-header />
    
    <main>
      <featured-carousel />
      
      <category-grid />
      
      <product-grid 
        title="Sản Phẩm Nổi Bật" 
        :products="featuredProducts" 
      />
      
      <product-grid 
        title="Khuyến Mãi Hôm Nay" 
        :products="dailyDeals" 
      />
      
      <lucky-spin-section />
    </main>
    
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Về Chúng Tôi</h5>
            <p>Nền tảng thương mại điện tử hiện đại với những ưu đãi và sản phẩm tốt nhất.</p>
          </div>
          <div class="col-md-4">
            <h5>Liên Kết Nhanh</h5>
            <ul class="list-unstyled">
              <li><router-link to="/" class="text-white">Trang chủ</router-link></li>
              <li><a href="#" class="text-white">Sản phẩm</a></li>
              <li><a href="#" class="text-white">Danh mục</a></li>
              <li><a href="#" class="text-white">Liên hệ</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Kết Nối Với Chúng Tôi</h5>
            <div class="d-flex gap-3 fs-4">
              <a href="#" class="text-white"><i class="fab fa-facebook"></i></a>
              <a href="#" class="text-white"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-white"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <p class="mb-0">&copy; 2023 ShopVN. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import SiteHeader from '../components/header/SiteHeader.vue';
import FeaturedCarousel from '../components/products/FeaturedCarousel.vue';
import CategoryGrid from '../components/categories/CategoryGrid.vue';
import ProductGrid from '../components/products/ProductGrid.vue';
import LuckySpinSection from '../components/lucky-spin/LuckySpinSection.vue';

import { featuredProducts, dailyDeals } from '../data/products';

export default {
  name: 'HomeView',
  components: {
    SiteHeader,
    FeaturedCarousel,
    CategoryGrid,
    ProductGrid,
    LuckySpinSection
  },
  data() {
    return {
      featuredProducts,
      dailyDeals
    }
  }
}
</script>