<template>
  <div class="container mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="section-title">Shop by Category</h2>
    </div>
    
    <div class="row row-cols-2 row-cols-md-4 g-3">
      <div v-for="category in categories" :key="category.id" class="col">
        <a :href="category.link" class="text-decoration-none">
          <div class="category-item">
            <img :src="category.image" :alt="category.name">
            <div class="category-name">{{ category.name }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { categories } from '../../data/categories';

export default {
  name: 'CategoryGrid',
  data() {
    return {
      categories: categories
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
</style>