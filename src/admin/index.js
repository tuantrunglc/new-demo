// Admin module exports
export { default as adminRoutes } from './router'

// Admin stores
export { useAdminStore } from './stores/adminStore'
export { useUserStore } from './stores/userStore'
export { useDashboardStore } from './stores/dashboardStore'
export { useOrderStore } from './stores/orderStore'
export { useProductStore } from './stores/productStore'
export { useCommissionStore } from './stores/commissionStore'
export { useSpinStore } from './stores/spinStore'

// Admin views
export { default as AdminDashboard } from './views/AdminDashboard.vue'
export { default as AdminLogin } from './views/AdminLogin.vue'
export { default as UserManagement } from './views/UserManagement.vue'
export { default as OrderManagement } from './views/OrderManagement.vue'
export { default as ProductManagement } from './views/ProductManagement.vue'
export { default as CommissionManagement } from './views/CommissionManagement.vue'
export { default as SpinManagement } from './views/SpinManagement.vue'
export { default as WalletManagement } from './views/WalletManagement.vue'
export { default as DashboardView } from './views/DashboardView.vue'
export { default as CreateOrder } from './views/CreateOrder.vue'
export { default as CreateProduct } from './views/CreateProduct.vue'
export { default as UnauthorizedView } from './views/UnauthorizedView.vue'