# 🚀 **API DOCUMENTATION FOR E-COMMERCE SYSTEM**

## 📋 **Tổng quan**
Tài liệu này mô tả các API endpoints cần thiết để tích hợp với hệ thống frontend Vue.js đã được phát triển.

**Base URL:** `http://localhost:3000/api`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`

---

## 🔐 **1. AUTHENTICATION APIs**

### **1.1 POST /api/auth/login**
**Mô tả:** Đăng nhập người dùng/admin

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "0123456789",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng",
  "errors": {
    "email": ["Email không tồn tại"],
    "password": ["Mật khẩu không đúng"]
  }
}
```

### **1.2 POST /api/auth/register**
**Mô tả:** Đăng ký tài khoản người dùng

**Request:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "0987654321",
  "sub_admin_code": "SA001"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 2,
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "phone": "0987654321",
      "status": "active",
      "wallet_balance": 0,
      "sub_admin": {
        "id": 5,
        "name": "Sub Admin User",
        "code": "SA001"
      },
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (422) - Invalid Sub Admin Code:**
```json
{
  "success": false,
  "message": "Mã sub admin không hợp lệ",
  "errors": {
    "sub_admin_code": ["Mã sub admin không tồn tại hoặc đã bị vô hiệu hóa"]
  }
}
```

### **1.3 GET /api/auth/me**
**Mô tả:** Lấy thông tin người dùng hiện tại

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "0123456789",
    "wallet_balance": 1500000,
    "status": "active",
    "sub_admin": {
      "id": 5,
      "name": "Sub Admin User",
      "code": "SA001"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💳 **2. DEPOSIT MANAGEMENT APIs**

### **2.1 POST /api/deposits**
**Mô tả:** Tạo yêu cầu nạp tiền mới

**Request:**
```json
{
  "amount": 500000,
  "description": "Nạp tiền mua sản phẩm",
  "bank_account": "1234567890",
  "proof_image": "base64_encoded_image_or_file_path"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Yêu cầu nạp tiền đã được tạo",
  "data": {
    "id": "DEP001",
    "user_id": 2,
    "amount": 500000,
    "description": "Nạp tiền mua sản phẩm",
    "status": "pending",
    "bank_account": "1234567890",
    "proof_image": "https://example.com/uploads/proof_001.jpg",
    "reference_code": "NAP_2_1704067200",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### **2.2 GET /api/deposits**
**Mô tả:** Lấy danh sách yêu cầu nạp tiền (Phân quyền admin)

**Query Parameters:**
- `page`: Trang hiện tại (default: 1)
- `limit`: Số lượng items per page (default: 10)
- `status`: Lọc theo trạng thái (all, pending, approved, rejected)
- `search`: Tìm kiếm theo mã, tên user, email
- `from_date`: Từ ngày (YYYY-MM-DD)
- `to_date`: Đến ngày (YYYY-MM-DD)

**Request:**
```
GET /api/deposits?page=1&limit=10&status=pending&search=DEP001
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "deposits": [
      {
        "id": "DEP001",
        "user": {
          "id": 2,
          "name": "Nguyen Van A",
          "email": "user@example.com",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "amount": 500000,
        "description": "Nạp tiền mua sản phẩm",
        "status": "pending",
        "bank_account": "1234567890",
        "proof_image": "https://example.com/uploads/proof_001.jpg",
        "reference_code": "NAP_2_1704067200",
        "admin_note": null,
        "processed_by": null,
        "processed_at": null,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    },
    "statistics": {
      "pending_count": 5,
      "approved_count": 15,
      "rejected_count": 5,
      "today_total": 2500000,
      "today_approved": 2000000
    }
  }
}
```

### **2.3 GET /api/deposits/user**
**Mô tả:** Lấy lịch sử nạp tiền của user hiện tại

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "deposits": [
      {
        "id": "DEP001",
        "amount": 500000,
        "description": "Nạp tiền mua sản phẩm",
        "status": "approved",
        "reference_code": "NAP_2_1704067200",
        "admin_note": "Đã xác nhận chuyển khoản",
        "created_at": "2024-01-01T00:00:00.000Z",
        "processed_at": "2024-01-01T01:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 3,
      "total_pages": 1
    }
  }
}
```

### **2.4 PUT /api/deposits/:id**
**Mô tả:** Cập nhật trạng thái yêu cầu nạp tiền (Admin only)

**Request:**
```json
{
  "status": "approved",
  "admin_note": "Đã xác nhận chuyển khoản thành công"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": {
    "id": "DEP001",
    "status": "approved",
    "admin_note": "Đã xác nhận chuyển khoản thành công",
    "processed_by": {
      "id": 1,
      "name": "Admin User"
    },
    "processed_at": "2024-01-01T01:00:00.000Z"
  }
}
```

---

## �‍💼 **3. SUB ADMIN MANAGEMENT APIs**

### **3.1 GET /api/sub-admins**
**Mô tả:** Lấy danh sách sub admin (Admin only)

**Query Parameters:**
- `page`, `limit`, `search`, `status`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "sub_admins": [
      {
        "id": 5,
        "name": "Sub Admin User",
        "email": "subadmin@example.com",
        "code": "SA001",
        "phone": "0123456789",
        "status": "active",
        "commission_rate": 2.5,
        "total_users": 15,
        "total_revenue": 5000000,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### **3.2 POST /api/sub-admins**
**Mô tả:** Tạo sub admin mới (Admin only)

**Request:**
```json
{
  "name": "New Sub Admin",
  "email": "newsubadmin@example.com",
  "password": "password123",
  "phone": "0987654321",
  "commission_rate": 3.0
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo sub admin thành công",
  "data": {
    "id": 6,
    "name": "New Sub Admin",
    "email": "newsubadmin@example.com",
    "code": "SA002",
    "role": "sub_admin",
    "commission_rate": 3.0,
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### **3.3 GET /api/sub-admins/:code/validate**
**Mô tả:** Kiểm tra tính hợp lệ của mã sub admin (Public)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "sub_admin": {
      "id": 5,
      "name": "Sub Admin User",
      "code": "SA001",
      "status": "active"
    }
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Mã sub admin không tồn tại",
  "data": {
    "valid": false
  }
}
```

### **3.4 GET /api/sub-admins/:id/users**
**Mô tả:** Lấy danh sách người dùng thuộc sub admin

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 2,
        "name": "Nguyen Van A",
        "email": "user@example.com",
        "phone": "0987654321",
        "wallet_balance": 1500000,
        "total_orders": 5,
        "total_spent": 2500000,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "statistics": {
      "total_users": 15,
      "active_users": 12,
      "total_revenue": 5000000,
      "commission_earned": 125000
    }
  }
}
```

---

## �👥 **4. USER MANAGEMENT APIs**

### **4.1 GET /api/users**
**Mô tả:** Lấy danh sách người dùng (Admin only)

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `role`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 2,
        "name": "Nguyen Van A",
        "email": "user@example.com",
        "phone": "0987654321",
        "role": "user",
        "status": "active",
        "wallet_balance": 1500000,
        "total_orders": 5,
        "total_spent": 2500000,
        "sub_admin": {
          "id": 5,
          "name": "Sub Admin User",
          "code": "SA001"
        },
        "created_at": "2024-01-01T00:00:00.000Z",
        "last_login": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 50,
      "total_pages": 5
    }
  }
}
```

### **4.2 PUT /api/users/:id**
**Mô tả:** Cập nhật thông tin người dùng

**Request:**
```json
{
  "name": "Nguyen Van A Updated",
  "phone": "0987654322",
  "status": "active"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "id": 2,
    "name": "Nguyen Van A Updated",
    "email": "user@example.com",
    "phone": "0987654322",
    "status": "active",
    "updated_at": "2024-01-01T02:00:00.000Z"
  }
}
```

---

## 🛍️ **5. PRODUCT MANAGEMENT APIs**

### **5.1 GET /api/products**
**Mô tả:** Lấy danh sách sản phẩm

**Query Parameters:**
- `page`, `limit`, `search`, `category_id`, `status`, `featured`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "slug": "iphone-15-pro-max",
        "description": "Điện thoại iPhone mới nhất",
        "price": 30000000,
        "sale_price": 28000000,
        "sku": "IP15PM001",
        "stock": 50,
        "status": "active",
        "featured": true,
        "category": {
          "id": 1,
          "name": "Điện thoại",
          "slug": "dien-thoai"
        },
        "images": [
          {
            "url": "https://example.com/products/iphone1.jpg",
            "alt": "iPhone 15 Pro Max"
          }
        ],
        "attributes": {
          "color": "Titan Tự Nhiên",
          "storage": "256GB",
          "warranty": "12 tháng"
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 12,
      "total": 100,
      "total_pages": 9
    },
    "filters": {
      "categories": [
        {"id": 1, "name": "Điện thoại", "count": 25},
        {"id": 2, "name": "Laptop", "count": 30}
      ],
      "price_ranges": [
        {"min": 0, "max": 5000000, "count": 20},
        {"min": 5000000, "max": 20000000, "count": 50}
      ]
    }
  }
}
```

### **5.2 POST /api/products**
**Mô tả:** Tạo sản phẩm mới (Admin only)

**Request:**
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Điện thoại Samsung flagship",
  "price": 25000000,
  "sale_price": 23000000,
  "sku": "SGS24001",
  "stock": 30,
  "category_id": 1,
  "status": "active",
  "featured": true,
  "images": [
    "base64_encoded_image_1",
    "base64_encoded_image_2"
  ],
  "attributes": {
    "color": "Đen",
    "storage": "128GB",
    "warranty": "12 tháng"
  }
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "id": 2,
    "name": "Samsung Galaxy S24",
    "slug": "samsung-galaxy-s24",
    "price": 25000000,
    "sale_price": 23000000,
    "sku": "SGS24001",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📋 **6. ORDER MANAGEMENT APIs**

### **6.1 GET /api/orders**
**Mô tả:** Lấy danh sách đơn hàng

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD001",
        "user": {
          "id": 2,
          "name": "Nguyen Van A",
          "email": "user@example.com"
        },
        "status": "processing",
        "total_amount": 28000000,
        "payment_method": "wallet",
        "payment_status": "paid",
        "items": [
          {
            "product_id": 1,
            "product_name": "iPhone 15 Pro Max",
            "quantity": 1,
            "price": 28000000,
            "total": 28000000
          }
        ],
        "shipping_info": {
          "name": "Nguyen Van A",
          "phone": "0987654321",
          "address": "123 Nguyen Trai, Q1, HCM",
          "note": "Giao giờ hành chính"
        },
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T01:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3
    },
    "statistics": {
      "pending": 5,
      "processing": 10,
      "completed": 8,
      "cancelled": 2
    }
  }
}
```

### **6.2 POST /api/orders**
**Mô tả:** Tạo đơn hàng mới

**Request:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 28000000
    }
  ],
  "shipping_info": {
    "name": "Nguyen Van A",
    "phone": "0987654321",
    "address": "123 Nguyen Trai, Q1, HCM",
    "note": "Giao giờ hành chính"
  },
  "payment_method": "wallet"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đặt hàng thành công",
  "data": {
    "id": "ORD002",
    "total_amount": 28000000,
    "status": "pending",
    "payment_status": "paid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💰 **7. WALLET APIs**

### **7.1 GET /api/wallet/balance**
**Mô tả:** Lấy số dư ví hiện tại

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "user_id": 2,
    "balance": 1500000,
    "formatted_balance": "1.500.000 ₫",
    "pending_deposits": 500000,
    "last_updated": "2024-01-01T01:00:00.000Z"
  }
}
```

### **7.2 GET /api/wallet/transactions**
**Mô tả:** Lấy lịch sử giao dịch ví

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN001",
        "type": "deposit",
        "amount": 500000,
        "description": "Nạp tiền từ yêu cầu DEP001",
        "status": "completed",
        "reference_id": "DEP001",
        "balance_before": 1000000,
        "balance_after": 1500000,
        "created_at": "2024-01-01T01:00:00.000Z"
      },
      {
        "id": "TXN002",
        "type": "payment",
        "amount": -28000000,
        "description": "Thanh toán đơn hàng ORD001",
        "status": "completed",
        "reference_id": "ORD001",
        "balance_before": 1500000,
        "balance_after": 1472000000,
        "created_at": "2024-01-01T02:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2
    }
  }
}
```

---

## 🗂️ **8. CATEGORY MANAGEMENT APIs**

### **8.1 GET /api/categories**
**Mô tả:** Lấy danh sách danh mục (tree structure)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Điện thoại",
        "slug": "dien-thoai",
        "description": "Các loại điện thoại thông minh",
        "image": "https://example.com/categories/phone.jpg",
        "parent_id": null,
        "sort_order": 1,
        "status": "active",
        "featured": true,
        "products_count": 25,
        "children": [
          {
            "id": 2,
            "name": "iPhone",
            "slug": "iphone",
            "parent_id": 1,
            "sort_order": 1,
            "status": "active",
            "products_count": 10,
            "children": []
          },
          {
            "id": 3,
            "name": "Samsung",
            "slug": "samsung",
            "parent_id": 1,
            "sort_order": 2,
            "status": "active",
            "products_count": 15,
            "children": []
          }
        ]
      }
    ]
  }
}
```

### **8.2 POST /api/categories**
**Mô tả:** Tạo danh mục mới (Admin only)

**Request:**
```json
{
  "name": "Tablet",
  "description": "Máy tính bảng",
  "parent_id": null,
  "sort_order": 3,
  "status": "active",
  "featured": true,
  "image": "base64_encoded_image"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo danh mục thành công",
  "data": {
    "id": 4,
    "name": "Tablet",
    "slug": "tablet",
    "parent_id": null,
    "sort_order": 3,
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🎯 **9. BANNER MANAGEMENT APIs**

### **9.1 GET /api/banners**
**Mô tả:** Lấy danh sách banner

**Query Parameters:**
- `position`: Vị trí banner (slider, banner, popup, sidebar)
- `status`: Trạng thái (active, inactive)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "Flash Sale 50%",
        "description": "Giảm giá sốc trong hôm nay",
        "image": "https://example.com/banners/flash-sale.jpg",
        "link": "/products/sale",
        "position": "slider",
        "priority": 1,
        "status": "active",
        "device_target": "all",
        "start_date": "2024-01-01T00:00:00.000Z",
        "end_date": "2024-01-31T23:59:59.000Z",
        "clicks": 150,
        "views": 5000,
        "ctr": 3.0,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### **9.2 POST /api/banners**
**Mô tả:** Tạo banner mới (Admin only)

**Request:**
```json
{
  "title": "Khuyến mãi cuối năm",
  "description": "Giảm giá up to 70%",
  "image": "base64_encoded_image",
  "link": "/promotions",
  "position": "banner",
  "priority": 2,
  "status": "active",
  "device_target": "desktop",
  "start_date": "2024-12-01T00:00:00.000Z",
  "end_date": "2024-12-31T23:59:59.000Z"
}
```

---

## ⚙️ **10. SYSTEM SETTINGS APIs**

### **10.1 GET /api/settings**
**Mô tả:** Lấy cài đặt hệ thống

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "general": {
      "site_name": "E-Commerce Store",
      "site_description": "Cửa hàng thương mại điện tử",
      "contact_email": "support@example.com",
      "contact_phone": "0123456789",
      "address": "123 ABC Street, HCM City"
    },
    "business": {
      "commission_rate": 5.0,
      "min_deposit": 50000,
      "max_deposit": 50000000,
      "processing_fee": 0,
      "withdrawal_fee": 10000
    },
    "payment": {
      "bank_name": "ACB",
      "bank_account": "1234567890",
      "account_holder": "CÔNG TY TNHH ECOMMERCE",
      "qr_code": "https://example.com/qr-code.png"
    },
    "notification": {
      "email_enabled": true,
      "sms_enabled": false,
      "push_enabled": true
    }
  }
}
```

### **10.2 PUT /api/settings**
**Mô tả:** Cập nhật cài đặt hệ thống (Admin only)

**Request:**
```json
{
  "general": {
    "site_name": "New Store Name",
    "contact_phone": "0987654321"
  },
  "business": {
    "min_deposit": 100000
  }
}
```

---

## 🔔 **11. NOTIFICATION APIs**

### **11.1 GET /api/notifications**
**Mô tả:** Lấy danh sách thông báo của user

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "Yêu cầu nạp tiền được duyệt",
        "message": "Yêu cầu nạp tiền DEP001 đã được duyệt. Số tiền 500.000đ đã được cộng vào ví.",
        "type": "deposit_approved",
        "read": false,
        "data": {
          "deposit_id": "DEP001",
          "amount": 500000
        },
        "created_at": "2024-01-01T01:00:00.000Z"
      },
      {
        "id": 2,
        "title": "Đơn hàng mới",
        "message": "Đơn hàng ORD001 đã được tạo thành công.",
        "type": "order_created",
        "read": true,
        "data": {
          "order_id": "ORD001"
        },
        "created_at": "2024-01-01T02:00:00.000Z"
      }
    ],
    "unread_count": 1,
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2
    }
  }
}
```

### **11.2 PUT /api/notifications/:id/read**
**Mô tả:** Đánh dấu thông báo đã đọc

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã đánh dấu đọc thông báo"
}
```

---

## 📁 **12. FILE UPLOAD APIs**

### **12.1 POST /api/uploads**
**Mô tả:** Upload file (hình ảnh, chứng từ)

**Request (multipart/form-data):**
```
file: [binary file data]
type: "proof" | "product" | "banner" | "avatar"
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Upload thành công",
  "data": {
    "url": "https://example.com/uploads/2024/01/01/proof_12345.jpg",
    "filename": "proof_12345.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

---

## 📊 **13. DASHBOARD ANALYTICS APIs**

### **13.1 GET /api/analytics/dashboard**
**Mô tả:** Lấy dữ liệu thống kê cho dashboard admin

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 1250,
      "total_orders": 856,
      "total_revenue": 125000000,
      "pending_deposits": 15
    },
    "today": {
      "new_users": 12,
      "new_orders": 25,
      "revenue": 5500000,
      "deposits": 8
    },
    "charts": {
      "revenue_chart": [
        {"date": "2024-01-01", "amount": 2500000},
        {"date": "2024-01-02", "amount": 3200000}
      ],
      "orders_chart": [
        {"date": "2024-01-01", "count": 45},
        {"date": "2024-01-02", "count": 52}
      ]
    },
    "top_products": [
      {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "sales": 25,
        "revenue": 70000000
      }
    ]
  }
}
```

---

## 🎲 **14. LUCKY SPIN APIs**

### **14.1 GET /api/spins/items**
**Mô tả:** Lấy danh sách items trong vòng quay

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "iPhone 15",
        "type": "product",
        "probability": 0.1,
        "image": "https://example.com/prizes/iphone.jpg",
        "value": 30000000,
        "stock": 5
      },
      {
        "id": 2,
        "name": "Điểm thưởng 1000",
        "type": "points",
        "probability": 20.0,
        "image": "https://example.com/prizes/points.jpg",
        "value": 1000,
        "stock": null
      }
    ],
    "spin_cost": 100000,
    "user_spins_today": 2,
    "max_spins_per_day": 5
  }
}
```

### **14.2 POST /api/spins/play**
**Mô tả:** Quay vòng quay may mắn

**Response Success (200):**
```json
{
  "success": true,
  "message": "Chúc mừng! Bạn đã trúng iPhone 15",
  "data": {
    "result": {
      "item_id": 1,
      "name": "iPhone 15",
      "type": "product",
      "image": "https://example.com/prizes/iphone.jpg",
      "value": 30000000
    },
    "wallet_balance": 1400000,
    "spins_remaining": 2
  }
}
```

---

## 🔧 **Error Responses**

### **Validation Error (422):**
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "email": ["Email đã tồn tại"],
    "amount": ["Số tiền phải lớn hơn 50.000đ"]
  }
}
```

### **Unauthorized (401):**
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

### **Forbidden (403):**
```json
{
  "success": false,
  "message": "Không có quyền truy cập"
}
```

### **Not Found (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy tài nguyên"
}
```

### **Server Error (500):**
```json
{
  "success": false,
  "message": "Lỗi máy chủ, vui lòng thử lại sau"
}
```

---

## 🌐 **WebSocket Events**

### **Connection:**
```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'Bearer_JWT_Token'
  }
});
```

### **Events:**
```javascript
// Thông báo mới
socket.on('notification', (data) => {
  console.log('New notification:', data);
});

// Cập nhật trạng thái deposit
socket.on('deposit_updated', (data) => {
  console.log('Deposit status updated:', data);
});

// Cập nhật số dư ví
socket.on('wallet_updated', (data) => {
  console.log('Wallet balance updated:', data);
});
```

---

## 📝 **Notes**

### **Authentication:**
- Tất cả API đều cần JWT token trong header `Authorization: Bearer <token>`
- Token có thời gian hết hạn 24h
- Admin APIs cần role `admin` hoặc `sub_admin`

### **Rate Limiting:**
- 100 requests/phút cho user thường
- 500 requests/phút cho admin
- Upload file: 10 files/phút

### **File Upload:**
- Max file size: 10MB
- Supported formats: JPG, PNG, GIF, PDF
- Images được tự động resize và optimize

### **Pagination:**
- Default: 10 items per page
- Max: 100 items per page
- Response includes pagination metadata

---

**📅 Version:** 1.0  
**📋 Last Updated:** 2024-01-01  
**👨‍💻 Author:** Development Team  
**🎯 Status:** Ready for Integration
