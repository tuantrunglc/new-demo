<template>
  <div class="container mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="section-title">{{ title }}</h2>
      <a href="#" class="btn btn-outline-primary">Xem tất cả</a>
    </div>
    
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div v-for="product in products" :key="product.id" class="col">
        <product-card :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
  name: 'ProductGrid',
  components: {
    ProductCard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.section-title {
  position: relative;
  font-weight: 700;
  color: var(--dark-color);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  color: white;
}
</style>