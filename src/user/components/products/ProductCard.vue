<template>
  <div class="card product-card h-100">
    <router-link :to="`/product/${product.id}`" class="text-decoration-none">
      <img :src="productImage" class="card-img-top" :alt="product.name">
    </router-link>
    <div class="card-body d-flex flex-column">
      <router-link :to="`/product/${product.id}`" class="text-decoration-none text-dark">
        <h5 class="card-title text-truncate">{{ product.name }}</h5>
      </router-link>
      <p class="card-text text-muted small" v-if="product.short_description">
        {{ product.short_description }}
      </p>
      <div class="d-flex align-items-center mb-2">
        <div class="product-price me-2">{{ formatCurrency(currentPrice) }}</div>
        <div class="product-discount text-decoration-line-through text-muted" v-if="isOnSale">
          {{ formatCurrency(product.price) }}
        </div>
      </div>
      <div class="d-flex align-items-center mb-2" v-if="product.category">
        <span class="badge bg-secondary">{{ product.category.name }}</span>
      </div>
      <div v-if="isOnSale" class="badge bg-danger mb-2">
        Sale {{ discountPercent }}%
      </div>
      <div v-if="product.featured" class="badge bg-warning text-dark mb-2">
        <i class="fas fa-star me-1"></i> Featured
      </div>
      <div class="badge bg-success mb-2" v-if="product.in_stock">
        <i class="fas fa-check me-1"></i> In Stock ({{ product.stock_quantity }})
      </div>
      <div class="badge bg-danger mb-2" v-else>
        <i class="fas fa-times me-1"></i> Out of Stock
      </div>
      <div class="mt-auto d-flex gap-2">
        <button 
          @click="addToCart" 
          class="btn btn-primary flex-fill"
          :disabled="!product.in_stock"
        >
          <i class="fas fa-shopping-cart me-1"></i> 
          {{ product.in_stock ? 'Thêm giỏ hàng' : 'Hết hàng' }}
        </button>
        <router-link :to="`/product/${product.id}`" class="btn btn-outline-primary">
          <i class="fas fa-eye"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'ProductCard',
  setup() {
    const toast = useToast()
    return { toast }
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    productImage() {
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images[0]
      }
      return 'https://via.placeholder.com/300x200?text=No+Image'
    },
    currentPrice() {
      return this.product.sale_price || this.product.price
    },
    isOnSale() {
      return this.product.sale_price && this.product.sale_price < this.product.price
    },
    discountPercent() {
      if (!this.isOnSale) return 0
      return Math.round(((this.product.price - this.product.sale_price) / this.product.price) * 100)
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },
    addToCart() {
      if (!this.product.in_stock) {
        this.toast.error('Sản phẩm đã hết hàng!')
        return
      }
      
      // Add to cart logic
      this.$emit('add-to-cart', this.product);
      // Show toast notification
      this.toast.success(`Đã thêm ${this.product.name} vào giỏ hàng!`);
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #e05e00;
  border-color: #e05e00;
}
</style>