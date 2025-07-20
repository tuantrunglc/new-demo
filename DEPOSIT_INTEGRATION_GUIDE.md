# 🏦 Hướng dẫn tích hợp hệ thống Deposit

## 📋 Tổng quan

Hệ thống deposit đã được tích hợp hoàn chỉnh vào frontend Vue.js với các tính năng:

- ✅ Tạo yêu cầu nạp tiền (User)
- ✅ Xem lịch sử nạp tiền (User)
- ✅ Quản lý yêu cầu nạp tiền (Admin)
- ✅ Duyệt/từ chối yêu cầu (Admin)
- ✅ Upload hình ảnh chứng minh
- ✅ Thống kê và báo cáo

## 🗂️ Cấu trúc Files

### Services
```
src/services/
├── depositService.js          # API service cho deposit
└── apiAdapter.js             # Adapter để kết nối API
```

### Stores (Pinia)
```
src/stores/
└── depositStore.js           # State management cho deposit
```

### Components
```
src/components/deposits/
├── DepositForm.vue           # Form tạo yêu cầu nạp tiền
├── DepositHistory.vue        # Lịch sử nạp tiền user
├── DepositDetailsModal.vue   # Modal chi tiết deposit
├── AdminDepositManagement.vue # Quản lý deposit admin
├── DepositActionModal.vue    # Modal duyệt/từ chối
└── index.js                  # Export components
```

### Views
```
src/user/views/
└── DepositView.vue           # Trang deposit cho user

src/admin/views/
└── DepositManagementView.vue # Trang quản lý deposit admin
```

### Routes
```
User Routes:
- /deposit                    # Trang nạp tiền user

Admin Routes:
- /admin/deposits            # Trang quản lý deposit admin
```

## 🚀 Cách sử dụng

### 1. Cho User

#### Truy cập trang nạp tiền:
```
http://localhost:8080/deposit
```

#### Tính năng:
- **Tab "Tạo yêu cầu"**: Tạo yêu cầu nạp tiền mới
- **Tab "Lịch sử"**: Xem lịch sử các yêu cầu đã tạo

#### Quy trình nạp tiền:
1. Nhập số tiền (10,000 - 100,000,000 VNĐ)
2. Nhập số tài khoản đã chuyển
3. Upload hình ảnh chứng minh
4. Thêm ghi chú (tùy chọn)
5. Gửi yêu cầu

### 2. Cho Admin

#### Truy cập trang quản lý:
```
http://localhost:8080/admin/deposits
```

#### Tính năng:
- **Dashboard thống kê**: Số lượng pending/approved/rejected
- **Bộ lọc**: Theo trạng thái, tìm kiếm, thời gian
- **Quản lý yêu cầu**: Xem chi tiết, duyệt, từ chối
- **Xuất báo cáo**: Excel, CSV, PDF

#### Quy trình xử lý:
1. Xem danh sách yêu cầu pending
2. Click "Chi tiết" để xem thông tin đầy đủ
3. Kiểm tra hình ảnh chứng minh
4. Click "Duyệt" hoặc "Từ chối"
5. Thêm ghi chú admin
6. Xác nhận

## 🔧 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication
```
Headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### Endpoints chính:

#### User APIs:
- `POST /deposits` - Tạo yêu cầu nạp tiền
- `GET /deposits/user` - Lấy lịch sử nạp tiền

#### Admin APIs:
- `GET /deposits` - Lấy tất cả yêu cầu (có filter)
- `PUT /deposits/:id` - Cập nhật trạng thái yêu cầu

## 🧪 Testing

### Sử dụng test utility:
```javascript
// Trong browser console
import testDepositAPIs from '@/utils/depositApiTest.js';

// Test tất cả APIs
await testDepositAPIs.runAllTests();

// Test riêng lẻ
await testDepositAPIs.testCreateDeposit();
await testDepositAPIs.testGetUserDeposits();
```

### Test manual:
1. Đăng nhập với tài khoản user
2. Truy cập `/deposit`
3. Tạo yêu cầu nạp tiền
4. Đăng nhập với tài khoản admin
5. Truy cập `/admin/deposits`
6. Xử lý yêu cầu vừa tạo

## 📱 Responsive Design

Tất cả components đều được thiết kế responsive:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 🎨 UI/UX Features

### User Interface:
- **Bootstrap 5** styling
- **Font Awesome** icons
- **Vue Toastification** notifications
- **SweetAlert2** confirmations

### User Experience:
- **Real-time validation** form inputs
- **Image preview** trước khi upload
- **Loading states** cho tất cả actions
- **Error handling** với thông báo rõ ràng
- **Pagination** cho danh sách dài

## 🔒 Security Features

- **JWT Authentication** cho tất cả APIs
- **Role-based access** (User/Admin)
- **Input validation** client & server side
- **File upload validation** (type, size)
- **XSS protection** cho user inputs

## 🚨 Error Handling

### Client-side:
- Form validation errors
- Network connection errors
- Authentication errors
- File upload errors

### Server-side:
- API response errors
- Business logic errors
- Database errors

## 📊 State Management

### Deposit Store (Pinia):
```javascript
// State
- userDeposits[]          // Deposits của user hiện tại
- allDeposits[]           // Tất cả deposits (admin)
- statistics{}            // Thống kê (admin)
- loading                 // Loading state
- error                   // Error state
- filters{}               // Bộ lọc

// Actions
- createDeposit()         // Tạo deposit mới
- fetchUserDeposits()     // Lấy deposits của user
- fetchAllDeposits()      // Lấy tất cả deposits (admin)
- updateDepositStatus()   // Cập nhật trạng thái (admin)
- approveDeposit()        // Duyệt deposit
- rejectDeposit()         // Từ chối deposit
```

## 🔄 Data Flow

### User Flow:
```
User Input → DepositForm → depositService → API → depositStore → UI Update
```

### Admin Flow:
```
Admin Action → AdminDepositManagement → depositService → API → depositStore → UI Update
```

## 📝 Customization

### Thay đổi styling:
```scss
// Trong component <style> section
.deposit-form {
  // Custom styles
}
```

### Thay đổi validation:
```javascript
// Trong depositService.js
const validateDepositData = (data) => {
  // Custom validation logic
}
```

### Thay đổi API endpoints:
```javascript
// Trong depositService.js
const API_ENDPOINTS = {
  CREATE_DEPOSIT: '/api/deposits',
  // Thay đổi endpoints
}
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Network Error"**
   - Kiểm tra backend server đang chạy
   - Kiểm tra CORS settings

2. **"Unauthorized"**
   - Kiểm tra token authentication
   - Đăng nhập lại

3. **"File too large"**
   - Kiểm tra kích thước file < 5MB
   - Kiểm tra định dạng file (JPG, PNG, GIF)

4. **"Validation Error"**
   - Kiểm tra required fields
   - Kiểm tra format dữ liệu

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Browser console errors
2. Network tab trong DevTools
3. Vue DevTools cho state management
4. Server logs

---

**Hệ thống deposit đã sẵn sàng sử dụng! 🎉**