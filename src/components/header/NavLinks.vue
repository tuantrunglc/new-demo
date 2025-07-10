<template>
  <ul class="nav">
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Danh mục
      </a>
      <ul class="dropdown-menu">
        <li v-for="category in categories" :key="category.id">
          <a class="dropdown-item" :href="category.link">{{ category.name }}</a>
        </li>
      </ul>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Khuyến mãi hôm nay</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Hàng mới về</a>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/admin/login">
        <i class="fas fa-user me-1"></i> Tài khoản
      </router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/admin">
        <i class="fas fa-cog me-1"></i> Admin
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