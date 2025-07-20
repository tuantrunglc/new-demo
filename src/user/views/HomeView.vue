<template>
  <div>
    <site-header />
    
    <main>
      <!-- Hero Banner -->
      <section class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
              Khám phá sản phẩm
              <span class="text-yellow-400">tuyệt vời</span>
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-200">
              Hàng ngàn sản phẩm chất lượng với giá tốt nhất
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Mua sắm ngay
              </button>
              <router-link 
                to="/lucky-spin" 
                class="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                🎰 Vòng quay may mắn
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Search Bar -->
      <section class="py-8 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                class="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
              >
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <featured-carousel />
      
      <category-grid />
      
      <!-- Best Sellers -->
      <product-grid 
        title="🔥 Sản phẩm bán chạy" 
        :products="bestSellers" 
      />
      
      <!-- Special Offers Banner -->
      <section class="py-12 bg-gradient-to-r from-red-500 to-pink-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 class="text-3xl font-bold mb-4">🎉 Ưu đãi đặc biệt</h2>
          <p class="text-xl mb-6">Giảm giá lên đến 50% cho các sản phẩm được chọn</p>
          <button class="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Xem ngay
          </button>
        </div>
      </section>
      
      <!-- Featured Products -->
      <product-grid 
        title="⭐ Sản phẩm nổi bật" 
        :products="featuredProducts" 
      />
      
      <!-- Today's Deals -->
      <product-grid 
        title="💰 Sản phẩm khuyến mãi" 
        :products="saleProducts" 
      />

      <!-- New Arrivals -->
      <product-grid 
        title="🆕 Sản phẩm mới nhất" 
        :products="latestProducts" 
      />

      <!-- Newsletter Signup -->
      <section class="py-16 bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Đăng ký nhận tin</h2>
          <p class="text-xl text-gray-600 mb-8">Nhận thông báo về sản phẩm mới và ưu đãi đặc biệt</p>
          <div class="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">ShopVN</h3>
            <p class="text-gray-400 mb-4">Nền tảng thương mại điện tử hiện đại với những sản phẩm chất lượng và giá tốt nhất.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Danh mục</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Điện thoại</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Laptop</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Thời trang</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Gia dụng</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/support" class="hover:text-white transition-colors">Trung tâm hỗ trợ</router-link></li>
              <li><a href="#" class="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Thông tin</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><router-link to="/lucky-spin" class="hover:text-white transition-colors">🎰 Vòng quay may mắn</router-link></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ShopVN. Tất cả quyền được bảo lưu.</p>
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
import { useProductStore } from '../../stores/productStore';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'HomeView',
  components: {
    SiteHeader,
    FeaturedCarousel,
    CategoryGrid,
    ProductGrid
  },
  data() {
    return {
      saleProducts: [],
      latestProducts: [],
      bestSellers: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 29990000,
          originalPrice: 32990000,
          image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
          rating: 4.8,
          reviews: 1250,
          badge: 'Bán chạy #1'
        },
        {
          id: 2,
          name: 'Samsung Galaxy S24 Ultra',
          price: 26990000,
          originalPrice: 29990000,
          image: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
          rating: 4.7,
          reviews: 890,
          badge: 'Bán chạy #2'
        },
        {
          id: 3,
          name: 'MacBook Air M3',
          price: 27990000,
          originalPrice: 30990000,
          image: 'https://via.placeholder.com/300x300?text=MacBook+Air',
          rating: 4.9,
          reviews: 650,
          badge: 'Bán chạy #3'
        },
        {
          id: 4,
          name: 'iPad Pro 12.9"',
          price: 24990000,
          originalPrice: 27990000,
          image: 'https://via.placeholder.com/300x300?text=iPad+Pro',
          rating: 4.6,
          reviews: 420,
          badge: 'Bán chạy #4'
        }
      ],
      newArrivals: [
        {
          id: 5,
          name: 'AirPods Pro 3',
          price: 5990000,
          originalPrice: 6990000,
          image: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
          rating: 4.8,
          reviews: 320,
          badge: 'Mới'
        },
        {
          id: 6,
          name: 'Apple Watch Series 10',
          price: 9990000,
          originalPrice: 11990000,
          image: 'https://via.placeholder.com/300x300?text=Apple+Watch',
          rating: 4.7,
          reviews: 180,
          badge: 'Mới'
        },
        {
          id: 7,
          name: 'Sony WH-1000XM5',
          price: 7990000,
          originalPrice: 8990000,
          image: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
          rating: 4.9,
          reviews: 540,
          badge: 'Mới'
        },
        {
          id: 8,
          name: 'Nintendo Switch OLED',
          price: 8990000,
          originalPrice: 9990000,
          image: 'https://via.placeholder.com/300x300?text=Nintendo+Switch',
          rating: 4.6,
          reviews: 290,
          badge: 'Mới'
        }
      ]
    }
  },
  computed: {
    ...mapState(useProductStore, ['featuredProducts', 'loading'])
  },
  methods: {
    ...mapActions(useProductStore, ['fetchFeaturedProducts', 'fetchProducts']),
    
    async loadHomeData() {
      try {
        // Load featured products
        await this.fetchFeaturedProducts()
        
        // Load sale products (products with sale_price)
        const saleResponse = await this.fetchProducts({ has_sale: true, limit: 8 })
        this.saleProducts = saleResponse || []
        
        // Load latest products
        const latestResponse = await this.fetchProducts({ sort: 'created_desc', limit: 8 })
        this.latestProducts = latestResponse || []
        
      } catch (error) {
        console.error('Error loading home data:', error)
      }
    }
  },
  
  async mounted() {
    await this.loadHomeData()
  }
}
</script>