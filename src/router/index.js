import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import OrderManagement from '../views/admin/OrderManagement.vue'
import CreateOrder from '../views/admin/CreateOrder.vue'
import ProductManagement from '../views/admin/ProductManagement.vue'
import CreateProduct from '../views/admin/CreateProduct.vue'
import SpinManagement from '../views/admin/SpinManagement.vue'
import CommissionManagement from '../views/admin/CommissionManagement.vue'
import WalletManagement from '../views/admin/WalletManagement.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import UnauthorizedView from '../views/admin/UnauthorizedView.vue'

// Auth guard
const requireAuth = (to, from, next) => {
  const isAuthenticated = localStorage.getItem('adminToken')
  if (isAuthenticated) {
    next()
  } else {
    next('/admin/login')
  }
}

// Role-based guard
const requireRole = (requiredRole) => {
  return (to, from, next) => {
    const userStr = localStorage.getItem('adminUser')
    if (!userStr) {
      next('/admin/login')
      return
    }
    
    const user = JSON.parse(userStr)
    if (
      requiredRole === 'admin' && user.role === 'admin' ||
      requiredRole === 'admin_or_subadmin' && (user.role === 'admin' || user.role === 'sub_admin')
    ) {
      next()
    } else {
      next('/admin/unauthorized')
    }
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
    path: '/admin/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView
  },
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'adminHome',
        redirect: { name: 'dashboard' }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'users',
        name: 'userManagement',
        component: UserManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'products',
        name: 'productManagement',
        component: ProductManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'products/create',
        name: 'createProduct',
        component: CreateProduct,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'orders',
        name: 'orderManagement',
        component: OrderManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'orders/create',
        name: 'createOrder',
        component: CreateOrder,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'spins',
        name: 'spinManagement',
        component: SpinManagement,
        meta: { requiresAuth: true, role: 'admin' },
        beforeEnter: requireRole('admin')
      },
      {
        path: 'commissions',
        name: 'commissionManagement',
        component: CommissionManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'wallets',
        name: 'walletManagement',
        component: WalletManagement,
        meta: { requiresAuth: true, role: 'admin' },
        beforeEnter: requireRole('admin')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router