// User module exports
export { default as userRoutes } from './router'

// User views
export { default as HomeView } from './views/HomeView.vue'

// User components
export { default as SiteHeader } from './components/header/SiteHeader.vue'
export { default as NavLinks } from './components/header/NavLinks.vue'
export { default as FeaturedCarousel } from './components/products/FeaturedCarousel.vue'
export { default as ProductCard } from './components/products/ProductCard.vue'
export { default as ProductGrid } from './components/products/ProductGrid.vue'
export { default as CategoryGrid } from './components/categories/CategoryGrid.vue'
export { default as LuckySpinSection } from './components/lucky-spin/LuckySpinSection.vue'
export { default as LuckyWheel } from './components/lucky-spin/LuckyWheel.vue'
export { default as RewardPopup } from './components/lucky-spin/RewardPopup.vue'
export { default as SpinHistory } from './components/lucky-spin/SpinHistory.vue'

// User data
export { categories } from './data/categories'
export { luckySpinItems, userSpins } from './data/lucky-spin'