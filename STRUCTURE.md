# Cấu trúc dự án sau khi tách Admin và User

## Cấu trúc thư mục mới

```
src/
├── admin/                    # Module Admin
│   ├── views/               # Các trang admin
│   │   ├── AdminDashboard.vue
│   │   ├── AdminLogin.vue
│   │   ├── UserManagement.vue
│   │   ├── OrderManagement.vue
│   │   ├── ProductManagement.vue
│   │   ├── CommissionManagement.vue
│   │   ├── SpinManagement.vue
│   │   ├── WalletManagement.vue
│   │   ├── DashboardView.vue
│   │   ├── CreateOrder.vue
│   │   ├── CreateProduct.vue
│   │   └── UnauthorizedView.vue
│   ├── stores/              # Stores cho admin
│   │   ├── adminStore.js
│   │   ├── userStore.js
│   │   ├── dashboardStore.js
│   │   ├── orderStore.js
│   │   ├── productStore.js
│   │   ├── commissionStore.js
│   │   └── spinStore.js
│   ├── router/              # Router cho admin
│   │   └── index.js
│   ├── data/                # Data cho admin
│   │   ├── dashboard.js
│   │   ├── users.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── commissions.js
│   ├── mock/                # Mock data cho admin
│   │   ├── dashboard.json
│   │   ├── users.json
│   │   ├── orders.json
│   │   ├── products.json
│   │   ├── commissions.json
│   │   └── spin_items.json
│   └── index.js             # Export tất cả admin modules
│
├── user/                     # Module User
│   ├── views/               # Các trang user
│   │   └── HomeView.vue
│   ├── components/          # Components cho user
│   │   ├── header/
│   │   │   ├── SiteHeader.vue
│   │   │   └── NavLinks.vue
│   │   ├── products/
│   │   │   ├── FeaturedCarousel.vue
│   │   │   ├── ProductCard.vue
│   │   │   └── ProductGrid.vue
│   │   ├── categories/
│   │   │   └── CategoryGrid.vue
│   │   └── lucky-spin/
│   │       ├── LuckySpinSection.vue
│   │       ├── LuckyWheel.vue
│   │       ├── RewardPopup.vue
│   │       └── SpinHistory.vue
│   ├── router/              # Router cho user
│   │   └── index.js
│   ├── data/                # Data cho user
│   │   ├── categories.js
│   │   ├── lucky-spin.js
│   │   └── products.js
│   └── index.js             # Export tất cả user modules
│
├── router/                   # Router chính
│   └── index.js             # Kết hợp admin và user routes
├── services/                # Shared services
├── utils/                   # Shared utilities
├── assets/                  # Shared assets
├── App.vue                  # Root component
└── main.js                  # Entry point
```

## Lợi ích của cấu trúc mới

### 1. **Tách biệt rõ ràng**
- Admin và User hoàn toàn độc lập
- Dễ dàng phát triển và bảo trì riêng biệt
- Giảm thiểu xung đột khi nhiều developer làm việc

### 2. **Quản lý dễ dàng**
- Mỗi module có cấu trúc riêng
- Import/export được tổ chức rõ ràng
- Dễ dàng tìm kiếm và sửa đổi

### 3. **Scalability**
- Dễ dàng thêm tính năng mới
- Có thể tách thành các ứng dụng riêng biệt trong tương lai
- Hỗ trợ lazy loading tốt hơn

### 4. **Security**
- Admin và User logic hoàn toàn tách biệt
- Giảm thiểu rủi ro bảo mật
- Dễ dàng áp dụng các policy khác nhau

## Cách sử dụng

### Import Admin components:
```javascript
import { AdminDashboard, useUserStore } from '@/admin'
```

### Import User components:
```javascript
import { HomeView, SiteHeader } from '@/user'
```

### Router:
- Admin routes: `/admin/*`
- User routes: `/*`

## Migration Notes

- Tất cả import paths đã được cập nhật
- Stores được tách riêng cho từng module
- Data và mock files được phân chia theo chức năng
- Router được modularize