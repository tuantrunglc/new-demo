<template>
  <div>
    <site-header />
    
    <main>
      <featured-carousel />
      
      <category-grid />
      
      <product-grid 
        title="Featured Products" 
        :products="featuredProducts" 
      />
      
      <product-grid 
        title="Today's Deals" 
        :products="dailyDeals" 
      />
      
      <lucky-spin-section />
    </main>
    
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>About Us</h5>
            <p>Modern e-commerce platform with the best deals and products.</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><router-link to="/" class="text-white">Home</router-link></li>
              <li><a href="#" class="text-white">Products</a></li>
              <li><a href="#" class="text-white">Categories</a></li>
              <li><a href="#" class="text-white">Contact</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Connect With Us</h5>
            <div class="d-flex gap-3 fs-4">
              <a href="#" class="text-white"><i class="fab fa-facebook"></i></a>
              <a href="#" class="text-white"><i class="fab fa-twitter"></i></a>
              <a href="#" class="text-white"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <p class="mb-0">&copy; 2023 ShopVN. All rights reserved.</p>
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