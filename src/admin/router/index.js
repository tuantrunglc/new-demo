// Admin routes configuration
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserManagement from '../views/UserManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import CreateOrder from '../views/CreateOrder.vue'
import ProductManagement from '../views/ProductManagement.vue'
import CreateProduct from '../views/CreateProduct.vue'
import SpinManagement from '../views/SpinManagement.vue'
import CommissionManagement from '../views/CommissionManagement.vue'
import WalletManagement from '../views/WalletManagement.vue'
import DepositManagementView from '../views/DepositManagementView.vue'
import SystemSettings from '../views/SystemSettings.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import BannerManagement from '../views/BannerManagement.vue'
import BankSettings from '../views/BankSettings.vue'
import TransactionHistory from '../views/TransactionHistory.vue'
import FinancialReports from '../views/FinancialReports.vue'
import DepositStatistics from '../views/DepositStatistics.vue'
import Dashboard from '../views/Dashboard.vue'
import Reports from '../views/Reports.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import AccessDenied from '../../components/AccessDenied.vue'

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
      requiredRole === 'admin_or_subadmin' && (user.role === 'admin' || user.role === 'subadmin')
    ) {
      next()
    } else {
      next('/admin/unauthorized')
    }
  }
}

const adminRoutes = [
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
    path: '/admin/access-denied',
    name: 'admin-access-denied',
    component: AccessDenied,
    props: { userType: 'admin' }
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
        component: Dashboard,
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
      },
      {
        path: 'deposits',
        name: 'depositManagement',
        component: DepositManagementView,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'settings',
        name: 'systemSettings',
        component: SystemSettings,
        meta: { requiresAuth: true, role: 'admin' },
        beforeEnter: requireRole('admin')
      },
      {
        path: 'categories',
        name: 'categoryManagement',
        component: CategoryManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'banners',
        name: 'bannerManagement',
        component: BannerManagement,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'banks',
        name: 'bankSettings',
        component: BankSettings,
        meta: { requiresAuth: true, role: 'admin' },
        beforeEnter: requireRole('admin')
      },
      {
        path: 'transactions',
        name: 'transactionHistory',
        component: TransactionHistory,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'reports/financial',
        name: 'financialReports',
        component: FinancialReports,
        meta: { requiresAuth: true, role: 'admin' },
        beforeEnter: requireRole('admin')
      },
      {
        path: 'reports/deposits',
        name: 'depositStatistics',
        component: DepositStatistics,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports,
        meta: { requiresAuth: true, role: 'admin_or_subadmin' },
        beforeEnter: requireRole('admin_or_subadmin')
      }
    ]
  }
]

export default adminRoutes