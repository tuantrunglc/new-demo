<template>
  <div id="app" class="font-sans antialiased text-gray-900">
    <!-- Auth Header - only show when authenticated -->
    <AuthHeader v-if="isAuthenticated && showAuthHeader" />
    
    <!-- Main Content -->
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AuthHeader from './components/AuthHeader.vue'

export default {
  name: 'App',
  components: {
    AuthHeader
  },
  setup() {
    const route = useRoute()
    const { isAuthenticated } = useAuth()
    
    // Don't show auth header on login/register pages
    const showAuthHeader = computed(() => {
      const hideOnRoutes = [
        'user-login',
        'user-register', 
        'adminLogin',
        'landing',
        'access-denied',
        'admin-access-denied',
        'unauthorized'
      ]
      
      return !hideOnRoutes.includes(route.name)
    })
    
    return {
      isAuthenticated,
      showAuthHeader
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
}

#app {
  min-height: 100vh;
}

/* Ensure Tailwind classes work */
.flex {
  display: flex !important;
}

.items-center {
  align-items: center !important;
}

.justify-between {
  justify-content: space-between !important;
}

.hidden {
  display: none !important;
}

.bg-indigo-700 {
  background-color: #4338ca !important;
}

.text-white {
  color: #ffffff !important;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.bg-white {
  background-color: #ffffff !important;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.bg-indigo-100 {
  background-color: #e0e7ff !important;
}

.text-indigo-700 {
  color: #4338ca !important;
}

.bg-gray-100 {
  background-color: #f3f4f6 !important;
}

@media (min-width: 768px) {
  .md\:block {
    display: block !important;
  }
  
  .md\:flex {
    display: flex !important;
  }
  
  .md\:hidden {
    display: none !important;
  }
}

/* Font Awesome fix */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
</style>
