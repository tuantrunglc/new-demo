// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import OrderManagement from '../views/admin/OrderManagement.vue'

// Admin route guard
const requireAdminAuth = (to, from, next) => {
  const isAuthenticated = localStorage.getItem('adminToken')
  if (isAuthenticated) {
    next()
  } else {
    next('/admin/login')
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'adminDashboard',
    component: AdminDashboard,
    beforeEnter: requireAdminAuth,
    children: [
      {
        path: '',
        redirect: { name: 'userManagement' }
      },
      {
        path: 'users',
        name: 'userManagement',
        component: UserManagement
      },
      {
        path: 'orders',
        name: 'orderManagement',
        component: OrderManagement
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // routes
  history: createWebHistory('/'), // ✅ Với Netlify luôn là '/'
  routes
})

export default router