<template>
  <ul class="nav">
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Categories
      </a>
      <ul class="dropdown-menu">
        <li v-for="category in categories" :key="category.id">
          <a class="dropdown-item" :href="category.link">{{ category.name }}</a>
        </li>
      </ul>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Today's Deals</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">New Arrivals</a>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/admin/login">
        <i class="fas fa-user me-1"></i> Account
      </router-link>
    </li>
  </ul>
</template>

<script>
import { categories } from '../../data/categories';

export default {
  name: 'NavLinks',
  data() {
    return {
      categories: categories
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: var(--dark-color);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--primary-color);
}
</style>