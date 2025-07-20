import HomeView from '../views/HomeView.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ProductList from '../views/ProductList.vue'
import Checkout from '../views/Checkout.vue'
import Withdrawal from '../views/Withdrawal.vue'
import DepositView from '../views/DepositView.vue'
import Profile from '../views/Profile.vue'
import Wallet from '../views/Wallet.vue'
import BankAccount from '../views/BankAccount.vue'
import UserLogin from '../views/UserLogin.vue'
import UserRegister from '../views/UserRegister.vue'
import OrderHistory from '../views/OrderHistory.vue'
import CustomerSupport from '../views/CustomerSupport.vue'
import AuthTest from '../views/AuthTest.vue'
import LandingPage from '../views/LandingPage.vue'
import LuckySpin from '../views/LuckySpin.vue'
import AccessDenied from '../../components/AccessDenied.vue'

const userRoutes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'user-login',
    component: UserLogin,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'user-register',
    component: UserRegister,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth-test',
    name: 'auth-test',
    component: AuthTest,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'product-list',
    component: ProductList,
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/withdrawal',
    name: 'withdrawal',
    component: Withdrawal,
    meta: { requiresAuth: true }
  },
  {
    path: '/deposit',
    name: 'deposit',
    component: DepositView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'order-history',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'customer-support',
    component: CustomerSupport,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/bank-account',
    name: 'bank-account',
    component: BankAccount,
    meta: { requiresAuth: true }
  },
  {
    path: '/lucky-spin',
    name: 'lucky-spin',
    component: LuckySpin,
    meta: { requiresAuth: true }
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDenied,
    props: { userType: 'user' }
  }
]

export default userRoutes