<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-3">Sản phẩm</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">Sản phẩm</li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="row">
      <!-- Sidebar Filters -->
      <div class="col-lg-3 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Bộ lọc</h5>
          </div>
          <div class="card-body">
            <!-- Search -->
            <div class="mb-3">
              <label class="form-label">Tìm kiếm</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="filters.search"
                @input="debouncedSearch"
                placeholder="Nhập tên sản phẩm..."
              >
            </div>

            <!-- Categories -->
            <div class="mb-3" v-if="categories.length > 0">
              <label class="form-label">Danh mục</label>
              <select class="form-select" v-model="filters.category_id" @change="fetchProducts">
                <option value="">Tất cả danh mục</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="mb-3">
              <label class="form-label">Khoảng giá</label>
              <div class="row">
                <div class="col-6">
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="filters.min_price"
                    placeholder="Từ"
                    @change="fetchProducts"
                  >
                </div>
                <div class="col-6">
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="filters.max_price"
                    placeholder="Đến"
                    @change="fetchProducts"
                  >
                </div>
              </div>
            </div>

            <!-- Sort -->
            <div class="mb-3">
              <label class="form-label">Sắp xếp</label>
              <select class="form-select" v-model="filters.sort" @change="fetchProducts">
                <option value="">Mặc định</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="created_desc">Mới nhất</option>
              </select>
            </div>

            <!-- Featured Only -->
            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="featuredOnly"
                  v-model="filters.featured"
                  @change="fetchProducts"
                >
                <label class="form-check-label" for="featuredOnly">
                  Chỉ sản phẩm nổi bật
                </label>
              </div>
            </div>

            <!-- In Stock Only -->
            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="inStockOnly"
                  v-model="filters.in_stock"
                  @change="fetchProducts"
                >
                <label class="form-check-label" for="inStockOnly">
                  Chỉ sản phẩm còn hàng
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="fas fa-times me-2"></i>Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="col-lg-9">
        <!-- Results Info -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span class="text-muted">
              Hiển thị {{ products.length }} sản phẩm
              <span v-if="filters.search"> cho "{{ filters.search }}"</span>
            </span>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-secondary btn-sm"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              class="btn btn-outline-secondary btn-sm"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Đang tải sản phẩm...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
          <button class="btn btn-outline-danger btn-sm ms-2" @click="fetchProducts">
            Thử lại
          </button>
        </div>

        <!-- No Products -->
        <div v-else-if="products.length === 0" class="text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5>Không tìm thấy sản phẩm</h5>
          <p class="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="viewMode === 'grid'" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          <div v-for="product in products" :key="product.id" class="col">
            <product-card :product="product" @add-to-cart="handleAddToCart" />
          </div>
        </div>

        <!-- Products List -->
        <div v-else class="row">
          <div v-for="product in products" :key="product.id" class="col-12 mb-3">
            <div class="card">
              <div class="row g-0">
                <div class="col-md-3">
                  <img :src="getProductImage(product)" class="img-fluid rounded-start h-100 object-cover" :alt="product.name">
                </div>
                <div class="col-md-9">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div class="flex-grow-1">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <p class="card-text text-muted">{{ product.short_description }}</p>
                        <div class="d-flex align-items-center mb-2">
                          <span class="h5 text-primary me-2">{{ formatCurrency(getCurrentPrice(product)) }}</span>
                          <span v-if="isOnSale(product)" class="text-decoration-line-through text-muted">
                            {{ formatCurrency(product.price) }}
                          </span>
                        </div>
                        <div class="d-flex gap-2 mb-2">
                          <span class="badge bg-secondary">{{ product.category?.name }}</span>
                          <span v-if="product.featured" class="badge bg-warning text-dark">Featured</span>
                          <span v-if="isOnSale(product)" class="badge bg-danger">Sale</span>
                        </div>
                      </div>
                      <div class="d-flex flex-column gap-2">
                        <button 
                          class="btn btn-primary"
                          :disabled="!product.in_stock"
                          @click="handleAddToCart(product)"
                        >
                          <i class="fas fa-shopping-cart me-1"></i>
                          {{ product.in_stock ? 'Thêm giỏ hàng' : 'Hết hàng' }}
                        </button>
                        <router-link :to="`/product/${product.id}`" class="btn btn-outline-primary">
                          <i class="fas fa-eye me-1"></i>Xem chi tiết
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '../../stores/productStore'
import { mapState, mapActions } from 'pinia'
import { useToast } from 'vue-toastification'
import ProductCard from '../components/products/ProductCard.vue'
import { debounce } from 'lodash'

export default {
  name: 'ProductList',
  components: {
    ProductCard
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      filters: {
        search: '',
        category_id: '',
        min_price: '',
        max_price: '',
        sort: '',
        featured: false,
        in_stock: false
      },
      viewMode: 'grid'
    }
  },
  computed: {
    ...mapState(useProductStore, ['products', 'categories', 'loading', 'error'])
  },
  methods: {
    ...mapActions(useProductStore, ['fetchProducts', 'fetchCategories', 'searchProducts']),
    
    async loadData() {
      await Promise.all([
        this.fetchProducts(this.getFilterParams()),
        this.fetchCategories()
      ])
    },
    
    getFilterParams() {
      const params = {}
      
      if (this.filters.search) params.search = this.filters.search
      if (this.filters.category_id) params.category_id = this.filters.category_id
      if (this.filters.min_price) params.min_price = this.filters.min_price
      if (this.filters.max_price) params.max_price = this.filters.max_price
      if (this.filters.sort) params.sort = this.filters.sort
      if (this.filters.featured) params.featured = 1
      if (this.filters.in_stock) params.in_stock = 1
      
      return params
    },
    
    debouncedSearch: debounce(function() {
      this.fetchProducts(this.getFilterParams())
    }, 500),
    
    clearFilters() {
      this.filters = {
        search: '',
        category_id: '',
        min_price: '',
        max_price: '',
        sort: '',
        featured: false,
        in_stock: false
      }
      this.fetchProducts()
    },
    
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        return product.images[0]
      }
      return 'https://via.placeholder.com/300x200?text=No+Image'
    },
    
    getCurrentPrice(product) {
      return product.sale_price || product.price
    },
    
    isOnSale(product) {
      return product.sale_price && product.sale_price < product.price
    },
    
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    },
    
    handleAddToCart(product) {
      if (!product.in_stock) {
        this.toast.error('Sản phẩm đã hết hàng!')
        return
      }
      
      // Add to cart logic here
      this.toast.success(`Đã thêm ${product.name} vào giỏ hàng!`)
    }
  },
  
  async mounted() {
    await this.loadData()
  }
}
</script>

<style scoped>
.object-cover {
  object-fit: cover;
}

.btn.active {
  background-color: var(--bs-primary);
  color: white;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>