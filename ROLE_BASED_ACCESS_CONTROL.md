# Hệ thống Phân quyền Truy cập (Role-Based Access Control)

## Tổng quan

Hệ thống phân quyền đã được cải thiện để đảm bảo:
- **Admin không thể truy cập giao diện User**
- **User không thể truy cập giao diện Admin**
- Hiển thị thông báo rõ ràng khi truy cập không được phép
- Quản lý authentication state tốt hơn

## Các thành phần chính

### 1. Router Guards (`src/router/index.js`)
- Kiểm tra quyền truy cập trước khi điều hướng
- Redirect đến trang phù hợp dựa trên role
- Hiển thị toast notification khi bị từ chối truy cập

### 2. Authentication Utilities (`src/utils/authUtils.js`)
Các hàm tiện ích để kiểm tra authentication:
```javascript
- isUserAuthenticated() // Kiểm tra user đã đăng nhập
- isAdminAuthenticated() // Kiểm tra admin đã đăng nhập
- getCurrentUserRole() // Lấy role hiện tại
- isCurrentUserAdmin() // Kiểm tra có phải admin
- isCurrentUserRegular() // Kiểm tra có phải user thường
```

### 3. Auth Composable (`src/composables/useAuth.js`)
Composable để quản lý authentication state:
```javascript
const { 
  isAuthenticated, 
  isAdmin, 
  isUser, 
  login, 
  logout, 
  checkAccess 
} = useAuth()
```

### 4. Components

#### AuthHeader (`src/components/AuthHeader.vue`)
- Hiển thị thông tin user hiện tại
- Nút đăng xuất
- Hiển thị role badge

#### AccessDenied (`src/components/AccessDenied.vue`)
- Trang hiển thị khi truy cập bị từ chối
- Nút quay lại và về trang chủ phù hợp

#### RouteGuard (`src/components/RouteGuard.vue`)
- Component wrapper để bảo vệ nội dung
- Sử dụng: `<RouteGuard requiredRole="admin"><YourComponent /></RouteGuard>`

#### RoleAlert (`src/components/RoleAlert.vue`)
- Alert popup khi có lỗi phân quyền
- Tự động ẩn hoặc hiển thị actions

### 5. Role Directive (`src/directives/roleDirective.js`)
Directive để ẩn/hiện elements dựa trên role:
```html
<!-- Chỉ hiển thị cho admin -->
<button v-role="'admin'">Admin Only Button</button>

<!-- Hiển thị cho admin hoặc sub_admin -->
<div v-role="['admin', 'sub_admin']">Admin Content</div>

<!-- Ẩn với user thường -->
<span v-role.hide="'user'">Hidden from users</span>

<!-- Disable cho non-admin -->
<input v-role.disable="'admin'" />
```

## Cách hoạt động

### 1. Khi User cố truy cập Admin area:
1. Router guard kiểm tra role
2. Phát hiện user không phải admin
3. Hiển thị toast error
4. Redirect đến `/access-denied`
5. Hiển thị trang AccessDenied với thông báo phù hợp

### 2. Khi Admin cố truy cập User area:
1. Router guard kiểm tra role
2. Phát hiện admin đang cố truy cập user interface
3. Hiển thị toast warning
4. Redirect đến `/admin/access-denied`
5. Hiển thị trang AccessDenied với option về admin dashboard

### 3. Authentication Flow:
```
User Login → UserStore → localStorage['userToken'] → Router Guard → User Routes
Admin Login → AdminStore → localStorage['adminToken'] → Router Guard → Admin Routes
```

## Các Routes được bảo vệ

### Admin Routes (prefix: `/admin`)
- Yêu cầu `adminToken` trong localStorage
- Chỉ cho phép role: `admin`, `sub_admin`
- Redirect user thường đến `/access-denied`

### User Routes (không có prefix `/admin`)
- Yêu cầu `userToken` trong localStorage (nếu có meta.requiresAuth)
- Chỉ cho phép role: `user`, `customer`
- Redirect admin đến `/admin/access-denied`

## Cấu hình

### Thêm route mới:
```javascript
// User route
{
  path: '/new-user-page',
  name: 'new-user-page',
  component: NewUserPage,
  meta: { requiresAuth: true } // Yêu cầu đăng nhập
}

// Admin route
{
  path: '/admin/new-admin-page',
  name: 'new-admin-page',
  component: NewAdminPage,
  meta: { requiresAuth: true, role: 'admin' },
  beforeEnter: requireRole('admin') // Chỉ admin
}
```

### Sử dụng trong component:
```vue
<template>
  <div>
    <!-- Chỉ admin mới thấy -->
    <button v-role="'admin'" @click="adminAction">Admin Action</button>
    
    <!-- Tất cả user đã đăng nhập -->
    <div v-if="isAuthenticated">Welcome!</div>
    
    <!-- Bảo vệ toàn bộ section -->
    <RouteGuard requiredRole="admin">
      <AdminOnlyContent />
    </RouteGuard>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  setup() {
    const { isAuthenticated, isAdmin, logout } = useAuth()
    
    return {
      isAuthenticated,
      isAdmin,
      logout
    }
  }
}
</script>
```

## Lưu ý bảo mật

1. **Frontend validation chỉ là UI/UX** - Backend vẫn cần validate quyền truy cập
2. **Token được lưu trong localStorage** - Cần implement refresh token cho production
3. **Role được lưu trong localStorage** - Backend cần verify role trong mỗi request
4. **Không dựa hoàn toàn vào frontend** - Luôn validate ở backend

## Testing

Để test hệ thống phân quyền:

1. **Đăng nhập với user thường**
   - Thử truy cập `/admin` → Sẽ bị redirect đến `/access-denied`
   - Kiểm tra toast notification hiển thị

2. **Đăng nhập với admin**
   - Thử truy cập `/home` → Sẽ bị redirect đến `/admin/access-denied`
   - Kiểm tra có thể truy cập tất cả admin routes

3. **Kiểm tra directive**
   - Elements với `v-role` hiển thị đúng theo role
   - Buttons bị disable khi không có quyền

4. **Kiểm tra cross-tab sync**
   - Đăng xuất ở tab này → Tab khác cũng cập nhật state