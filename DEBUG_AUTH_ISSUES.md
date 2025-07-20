# 🔧 Debug Authentication Issues

## 🚨 **Vấn đề hiện tại:**
Đăng nhập bằng tài khoản admin nhưng vào đường dẫn admin lại báo không đúng.

## 🔍 **Các bước debug:**

### 1. **Thêm AuthTest Component**
Thêm component này vào trang admin để kiểm tra:

```vue
<template>
  <div>
    <!-- Your existing content -->
    
    <!-- Add this for debugging -->
    <AuthTest />
  </div>
</template>

<script>
import AuthTest from '@/components/AuthTest.vue'

export default {
  components: {
    AuthTest
  }
}
</script>
```

### 2. **Kiểm tra Console Logs**
Sau khi đăng nhập admin, mở Developer Tools (F12) và kiểm tra:

1. **Console tab** - Tìm các log:
   - `✅ Admin login successful:` - Xác nhận login thành công
   - `🛣️ Router Guard:` - Kiểm tra router guard logic
   - `🔒 Checking admin route access...` - Xác nhận route checking

2. **Application tab > Local Storage** - Kiểm tra:
   - `adminToken` - Phải có giá trị
   - `adminUser` - Phải có object với `role: "admin"` hoặc `role: "subadmin"`

### 3. **Chạy Debug Functions**
Trong console, chạy:

```javascript
// Kiểm tra auth state hiện tại
console.log('Current role:', getCurrentUserRole())
console.log('Is admin:', isCurrentUserAdmin())
console.log('Admin token:', !!localStorage.getItem('adminToken'))
console.log('Admin user:', JSON.parse(localStorage.getItem('adminUser') || 'null'))

// Hoặc chạy debug function
window.debugAuth()
```

### 4. **Các vấn đề thường gặp:**

#### A. **Admin User Data bị thiếu role**
```javascript
// Kiểm tra
const adminUser = JSON.parse(localStorage.getItem('adminUser'))
console.log('Admin user role:', adminUser?.role)

// Nếu role bị thiếu, có thể backend không trả về đúng
```

#### B. **Role name không đúng**
```javascript
// Backend trả về role gì?
// Phải là 'admin' hoặc 'subadmin', không phải 'sub_admin'
```

#### C. **Token bị lỗi**
```javascript
// Kiểm tra token
const token = localStorage.getItem('adminToken')
console.log('Token exists:', !!token)
console.log('Token length:', token?.length)
```

### 5. **Test Cases:**

#### Test 1: **Kiểm tra sau khi login**
```javascript
// Ngay sau khi login thành công
console.log({
  adminToken: localStorage.getItem('adminToken'),
  adminUser: localStorage.getItem('adminUser'),
  currentRole: getCurrentUserRole(),
  isAdmin: isCurrentUserAdmin()
})
```

#### Test 2: **Kiểm tra khi navigate**
```javascript
// Khi navigate đến admin route
console.log({
  currentPath: window.location.pathname,
  isAdminRoute: isAdminRoute(window.location.pathname),
  hasAccess: isCurrentUserAdmin() && isAdminAuthenticated()
})
```

### 6. **Temporary Fix (nếu cần):**
Nếu cần fix tạm thời, có thể bypass router guard:

```javascript
// Trong router/index.js, thêm vào đầu beforeEach:
if (to.path.startsWith('/admin') && to.name !== 'adminLogin') {
  console.log('🚨 BYPASS: Admin route access forced')
  next()
  return
}
```

### 7. **Kiểm tra Backend Response:**
Khi login, kiểm tra response từ backend:

```javascript
// Trong adminStore.js, thêm log:
console.log('Backend login response:', result)
console.log('User data:', result.data.user)
console.log('User role:', result.data.user.role)
```

### 8. **Common Solutions:**

#### Solution 1: **Clear và login lại**
```javascript
// Clear all auth data
localStorage.removeItem('adminToken')
localStorage.removeItem('adminUser')
localStorage.removeItem('userToken')
localStorage.removeItem('currentUser')

// Reload page và login lại
window.location.reload()
```

#### Solution 2: **Fix role manually (temporary)**
```javascript
// Nếu role bị sai, fix tạm thời:
const adminUser = JSON.parse(localStorage.getItem('adminUser'))
adminUser.role = 'admin' // hoặc 'subadmin'
localStorage.setItem('adminUser', JSON.stringify(adminUser))
```

### 9. **Debugging Checklist:**

- [ ] AdminToken tồn tại trong localStorage
- [ ] AdminUser tồn tại và có role hợp lệ
- [ ] getCurrentUserRole() trả về 'admin' hoặc 'subadmin'
- [ ] isCurrentUserAdmin() trả về true
- [ ] isAdminAuthenticated() trả về true
- [ ] Router guard không block admin routes
- [ ] Backend trả về đúng role trong login response

### 10. **Contact Points:**

Nếu vẫn không giải quyết được, cung cấp:

1. **Console logs** từ các debug functions
2. **localStorage data** (adminToken, adminUser)
3. **Backend login response** 
4. **Router guard logs**
5. **Specific error messages**

---

**⚠️ Lưu ý:** Các debug logs chỉ hiển thị trong development mode. Trong production, cần remove hoặc disable chúng.