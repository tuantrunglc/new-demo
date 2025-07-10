<template>
  <div class="card product-card h-100">
    <img :src="product.image" class="card-img-top" :alt="product.name">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-truncate">{{ product.name }}</h5>
      <div class="d-flex align-items-center mb-2">
        <div class="product-price me-2">{{ formatCurrency(product.price) }}</div>
        <div class="product-discount text-decoration-line-through" v-if="product.originalPrice">
          {{ formatCurrency(product.originalPrice) }}
        </div>
      </div>
      <div class="d-flex align-items-center mb-2">
        <div class="me-2">
          <i class="fas fa-star text-warning"></i>
          {{ product.rating }}
        </div>
        <div class="text-muted small">({{ product.reviews }} đánh giá)</div>
      </div>
      <div v-if="product.discount" class="badge bg-danger mb-2">Giảm {{ product.discount }}%</div>
      <div v-if="product.timeLeft" class="badge bg-warning text-dark mb-2">
        <i class="fas fa-clock me-1"></i> Còn {{ product.timeLeft }}
      </div>
      <div class="mt-auto">
        <button class="btn btn-primary w-100">
          <i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
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