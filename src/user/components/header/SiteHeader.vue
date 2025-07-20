<template>
  <header class="site-header py-3">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-2 mb-2 mb-md-0">
          <router-link :to="isAuthenticated ? '/home' : '/'" class="d-flex align-items-center text-decoration-none">
            <img src="https://placeholder.pics/svg/150x50/FF6A00-FFFFFF/EcoMan" alt="EcoMan" class="logo">
          </router-link>
        </div>
        
        <div class="col-md-6 mb-2 mb-md-0">
          <div class="input-group">
            <input type="text" class="form-control search-bar" placeholder="Tìm kiếm sản phẩm..." aria-label="Tìm kiếm">
            <button class="btn search-button" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="d-flex justify-content-end align-items-center">
            <nav-links />
            <div class="ms-3 position-relative">
              <a href="#" class="text-dark fs-5">
                <i class="fas fa-shopping-cart"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import NavLinks from './NavLinks.vue';
import { useUserStore } from '../../../stores/userStore';
import { mapState } from 'pinia';

export default {
  name: 'SiteHeader',
  components: {
    NavLinks
  },
  computed: {
    ...mapState(useUserStore, ['isAuthenticated'])
  }
}
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>