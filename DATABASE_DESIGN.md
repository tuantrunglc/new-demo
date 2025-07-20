# 🗄️ **DATABASE DESIGN - E-COMMERCE SYSTEM**

## 📋 **Tổng quan**
Thiết kế cơ sở dữ liệu cho hệ thống E-commerce với Laravel 10, MySQL 8.0, bao gồm quản lý người dùng, sub admin, sản phẩm, đơn hàng, ví điện tử và hệ thống nạp tiền.

---

## 🔗 **ER DIAGRAM OVERVIEW**

```
Users (1) -----> (M) Deposits
Users (1) -----> (M) Orders  
Users (1) -----> (1) Wallets
Users (M) -----> (1) SubAdmins
Products (M) ----> (M) Categories
Orders (1) -----> (M) OrderItems
Products (1) ----> (M) ProductImages
Users (M) -----> (M) Notifications
Banners (M) ----> (1) Categories
```

---

## 📊 **1. USERS TABLE**

### **Migration: create_users_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Họ tên đầy đủ
            $table->string('email')->unique();             // Email đăng nhập (unique)
            $table->timestamp('email_verified_at')->nullable(); // Thời gian verify email
            $table->string('password');                     // Mật khẩu (hash)
            $table->string('phone', 15)->nullable();       // Số điện thoại
            $table->string('avatar')->nullable();          // Đường dẫn ảnh đại diện
            $table->enum('role', ['admin', 'sub_admin', 'user'])->default('user'); // Vai trò
            $table->enum('status', ['active', 'inactive', 'banned'])->default('active'); // Trạng thái
            $table->unsignedBigInteger('sub_admin_id')->nullable(); // ID của sub admin quản lý
            $table->decimal('commission_rate', 5, 2)->nullable(); // Tỷ lệ hoa hồng (cho sub_admin)
            $table->string('sub_admin_code', 10)->unique()->nullable(); // Mã sub admin (SA001, SA002...)
            $table->json('settings')->nullable();          // Cài đặt cá nhân (JSON)
            $table->timestamp('last_login_at')->nullable(); // Lần đăng nhập cuối
            $table->string('last_login_ip')->nullable();   // IP đăng nhập cuối
            $table->rememberToken();                        // Remember token
            $table->timestamps();                           // created_at, updated_at
            
            // Indexes
            $table->index(['role', 'status']);
            $table->index(['sub_admin_id']);
            $table->index(['email', 'status']);
            
            // Foreign key
            $table->foreign('sub_admin_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### **Mô tả các trường:**
- `id`: Primary key tự tăng
- `name`: Họ tên người dùng (varchar 255)
- `email`: Email duy nhất, dùng để đăng nhập
- `password`: Mật khẩu đã hash
- `phone`: Số điện thoại (15 ký tự)
- `avatar`: Đường dẫn file ảnh đại diện
- `role`: Vai trò (admin/sub_admin/user)
- `status`: Trạng thái tài khoản
- `sub_admin_id`: ID của sub admin quản lý user này
- `commission_rate`: Tỷ lệ hoa hồng (chỉ dành cho sub_admin)
- `sub_admin_code`: Mã duy nhất của sub admin
- `settings`: Cài đặt JSON (ngôn ngữ, timezone...)
- `last_login_at`: Thời gian đăng nhập cuối
- `last_login_ip`: IP đăng nhập cuối

---

## 💳 **2. WALLETS TABLE**

### **Migration: create_wallets_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');         // ID người dùng
            $table->decimal('balance', 15, 2)->default(0); // Số dư hiện tại
            $table->decimal('pending_balance', 15, 2)->default(0); // Số dư đang chờ xử lý
            $table->decimal('frozen_balance', 15, 2)->default(0);  // Số dư bị đóng băng
            $table->decimal('total_deposited', 15, 2)->default(0); // Tổng tiền đã nạp
            $table->decimal('total_withdrawn', 15, 2)->default(0); // Tổng tiền đã rút
            $table->decimal('total_spent', 15, 2)->default(0);     // Tổng tiền đã chi tiêu
            $table->string('currency', 3)->default('VND');         // Loại tiền tệ
            $table->timestamp('last_transaction_at')->nullable();  // Giao dịch cuối
            $table->timestamps();
            
            // Indexes
            $table->unique('user_id');
            $table->index(['balance']);
            
            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('wallets');
    }
};
```

### **Mô tả các trường:**
- `user_id`: Liên kết với bảng users (1-1)
- `balance`: Số dư khả dụng hiện tại
- `pending_balance`: Số dư chờ xử lý (deposits pending)
- `frozen_balance`: Số dư bị đóng băng (khi đặt hàng)
- `total_deposited`: Tổng tiền đã nạp (thống kê)
- `total_withdrawn`: Tổng tiền đã rút (thống kê)
- `total_spent`: Tổng tiền đã chi tiêu (thống kê)
- `currency`: Loại tiền tệ (VND, USD...)
- `last_transaction_at`: Thời gian giao dịch cuối

---

## 📥 **3. DEPOSITS TABLE**

### **Migration: create_deposits_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('deposits', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();          // Mã deposit (DEP001, DEP002...)
            $table->unsignedBigInteger('user_id');         // ID người dùng
            $table->decimal('amount', 15, 2);              // Số tiền nạp
            $table->text('description')->nullable();        // Mô tả từ user
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Trạng thái
            $table->string('bank_account', 50)->nullable(); // Số tài khoản chuyển
            $table->string('proof_image')->nullable();      // Ảnh chứng từ
            $table->string('reference_code', 100);         // Mã tham chiếu (NAP_USER_ID_TIMESTAMP)
            $table->text('admin_note')->nullable();         // Ghi chú từ admin
            $table->unsignedBigInteger('processed_by')->nullable(); // Admin xử lý
            $table->timestamp('processed_at')->nullable();   // Thời gian xử lý
            $table->json('metadata')->nullable();           // Dữ liệu bổ sung (bank info, etc.)
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index(['code']);
            $table->index(['reference_code']);
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('deposits');
    }
};
```

### **Mô tả các trường:**
- `code`: Mã deposit duy nhất (DEP001, DEP002...)
- `user_id`: ID người dùng yêu cầu nạp tiền
- `amount`: Số tiền yêu cầu nạp
- `description`: Mô tả từ user
- `status`: Trạng thái (pending/approved/rejected)
- `bank_account`: Số TK mà user chuyển tiền đến
- `proof_image`: Đường dẫn ảnh biên lai
- `reference_code`: Mã tham chiếu duy nhất
- `admin_note`: Ghi chú từ admin khi xử lý
- `processed_by`: ID admin xử lý
- `processed_at`: Thời gian xử lý
- `metadata`: Thông tin JSON bổ sung

---

## 💰 **4. WALLET_TRANSACTIONS TABLE**

### **Migration: create_wallet_transactions_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();          // Mã giao dịch (TXN001, TXN002...)
            $table->unsignedBigInteger('wallet_id');       // ID ví
            $table->enum('type', ['deposit', 'withdrawal', 'payment', 'refund', 'commission']); // Loại giao dịch
            $table->decimal('amount', 15, 2);              // Số tiền (+/-)
            $table->decimal('balance_before', 15, 2);      // Số dư trước giao dịch
            $table->decimal('balance_after', 15, 2);       // Số dư sau giao dịch
            $table->text('description');                    // Mô tả giao dịch
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed'); // Trạng thái
            $table->string('reference_type')->nullable();   // Loại tham chiếu (deposit, order, etc.)
            $table->unsignedBigInteger('reference_id')->nullable(); // ID tham chiếu
            $table->json('metadata')->nullable();           // Dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['wallet_id', 'type']);
            $table->index(['status', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
            $table->index(['code']);
            
            // Foreign key
            $table->foreign('wallet_id')->references('id')->on('wallets')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
```

### **Mô tả các trường:**
- `code`: Mã giao dịch duy nhất
- `wallet_id`: ID ví liên quan
- `type`: Loại giao dịch (nạp/rút/thanh toán/hoàn tiền/hoa hồng)
- `amount`: Số tiền giao dịch (âm/dương)
- `balance_before/after`: Số dư trước và sau giao dịch
- `description`: Mô tả chi tiết giao dịch
- `status`: Trạng thái giao dịch
- `reference_type/id`: Tham chiếu đến đối tượng khác (deposit, order...)
- `metadata`: Dữ liệu JSON bổ sung

---

## 🗂️ **5. CATEGORIES TABLE**

### **Migration: create_categories_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Tên danh mục
            $table->string('slug')->unique();              // Slug URL-friendly
            $table->text('description')->nullable();        // Mô tả danh mục
            $table->string('image')->nullable();           // Ảnh danh mục
            $table->unsignedBigInteger('parent_id')->nullable(); // Danh mục cha
            $table->integer('sort_order')->default(0);     // Thứ tự sắp xếp
            $table->enum('status', ['active', 'inactive'])->default('active'); // Trạng thái
            $table->boolean('featured')->default(false);   // Danh mục nổi bật
            $table->json('metadata')->nullable();          // Dữ liệu bổ sung (SEO, etc.)
            $table->timestamps();
            
            // Indexes
            $table->index(['parent_id', 'status']);
            $table->index(['featured', 'status']);
            $table->index(['slug']);
            $table->index(['sort_order']);
            
            // Foreign key
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
```

### **Mô tả các trường:**
- `name`: Tên danh mục
- `slug`: Slug cho URL thân thiện
- `description`: Mô tả chi tiết danh mục
- `image`: Đường dẫn ảnh đại diện
- `parent_id`: ID danh mục cha (cấu trúc cây)
- `sort_order`: Thứ tự hiển thị
- `status`: Trạng thái hiển thị
- `featured`: Đánh dấu danh mục nổi bật
- `metadata`: Dữ liệu JSON (SEO title, description...)

---

## 🛍️ **6. PRODUCTS TABLE**

### **Migration: create_products_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Tên sản phẩm
            $table->string('slug')->unique();              // Slug URL-friendly
            $table->text('description')->nullable();        // Mô tả ngắn
            $table->longText('content')->nullable();        // Nội dung chi tiết
            $table->string('sku', 50)->unique();           // Mã sản phẩm
            $table->decimal('price', 15, 2);               // Giá gốc
            $table->decimal('sale_price', 15, 2)->nullable(); // Giá khuyến mãi
            $table->integer('stock')->default(0);          // Số lượng tồn kho
            $table->integer('min_stock')->default(0);      // Tồn kho tối thiểu
            $table->decimal('weight', 8, 2)->nullable();   // Cân nặng (kg)
            $table->json('dimensions')->nullable();         // Kích thước (JSON: length, width, height)
            $table->unsignedBigInteger('category_id');     // Danh mục chính
            $table->enum('status', ['active', 'inactive', 'out_of_stock'])->default('active'); // Trạng thái
            $table->boolean('featured')->default(false);   // Sản phẩm nổi bật
            $table->integer('views')->default(0);          // Lượt xem
            $table->integer('sales_count')->default(0);    // Số lượng đã bán
            $table->decimal('rating', 3, 2)->default(0);   // Đánh giá trung bình
            $table->integer('review_count')->default(0);   // Số lượng đánh giá
            $table->json('attributes')->nullable();         // Thuộc tính (màu sắc, kích thước...)
            $table->json('metadata')->nullable();          // SEO và dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['category_id', 'status']);
            $table->index(['featured', 'status']);
            $table->index(['sku']);
            $table->index(['slug']);
            $table->index(['price']);
            $table->index(['created_at']);
            
            // Foreign key
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
```

### **Mô tả các trường:**
- `name`: Tên sản phẩm
- `slug`: Slug cho URL
- `description`: Mô tả ngắn
- `content`: Nội dung chi tiết HTML
- `sku`: Mã sản phẩm duy nhất
- `price/sale_price`: Giá gốc và giá khuyến mãi
- `stock/min_stock`: Tồn kho và mức tối thiểu
- `weight`: Cân nặng sản phẩm
- `dimensions`: Kích thước JSON
- `category_id`: Danh mục chính
- `status`: Trạng thái hiển thị
- `featured`: Sản phẩm nổi bật
- `views/sales_count`: Thống kê lượt xem và bán
- `rating/review_count`: Đánh giá
- `attributes`: Thuộc tính JSON
- `metadata`: Dữ liệu SEO và bổ sung

---

## 🖼️ **7. PRODUCT_IMAGES TABLE**

### **Migration: create_product_images_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');      // ID sản phẩm
            $table->string('image_path');                   // Đường dẫn ảnh
            $table->string('alt_text')->nullable();        // Alt text cho SEO
            $table->integer('sort_order')->default(0);     // Thứ tự hiển thị
            $table->boolean('is_primary')->default(false); // Ảnh chính
            $table->enum('type', ['gallery', 'thumbnail', 'zoom'])->default('gallery'); // Loại ảnh
            $table->timestamps();
            
            // Indexes
            $table->index(['product_id', 'sort_order']);
            $table->index(['product_id', 'is_primary']);
            
            // Foreign key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};
```

### **Mô tả các trường:**
- `product_id`: ID sản phẩm liên quan
- `image_path`: Đường dẫn file ảnh
- `alt_text`: Text thay thế cho SEO
- `sort_order`: Thứ tự hiển thị ảnh
- `is_primary`: Ảnh chính của sản phẩm
- `type`: Loại ảnh (gallery/thumbnail/zoom)

---

## 📋 **8. ORDERS TABLE**

### **Migration: create_orders_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();          // Mã đơn hàng (ORD001, ORD002...)
            $table->unsignedBigInteger('user_id');         // ID khách hàng
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending'); // Trạng thái
            $table->decimal('total_amount', 15, 2);        // Tổng tiền
            $table->decimal('discount_amount', 15, 2)->default(0); // Số tiền giảm giá
            $table->decimal('shipping_fee', 15, 2)->default(0);    // Phí vận chuyển
            $table->decimal('tax_amount', 15, 2)->default(0);      // Thuế
            $table->decimal('final_amount', 15, 2);               // Tổng cuối cùng
            $table->enum('payment_method', ['wallet', 'cod', 'bank_transfer'])->default('wallet'); // Phương thức thanh toán
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending'); // Trạng thái thanh toán
            $table->json('shipping_info');                 // Thông tin giao hàng (JSON)
            $table->text('notes')->nullable();             // Ghi chú đơn hàng
            $table->string('coupon_code')->nullable();     // Mã giảm giá
            $table->timestamp('shipped_at')->nullable();   // Thời gian giao hàng
            $table->timestamp('delivered_at')->nullable(); // Thời gian nhận hàng
            $table->json('metadata')->nullable();          // Dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index(['code']);
            $table->index(['payment_status']);
            
            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
```

### **Mô tả các trường:**
- `code`: Mã đơn hàng duy nhất
- `user_id`: ID khách hàng
- `status`: Trạng thái đơn hàng
- `total_amount`: Tổng tiền hàng
- `discount_amount`: Số tiền được giảm
- `shipping_fee`: Phí vận chuyển
- `tax_amount`: Tiền thuế
- `final_amount`: Tổng tiền cuối cùng
- `payment_method`: Phương thức thanh toán
- `payment_status`: Trạng thái thanh toán
- `shipping_info`: Thông tin giao hàng JSON
- `notes`: Ghi chú từ khách hàng
- `coupon_code`: Mã giảm giá đã dùng
- `shipped_at/delivered_at`: Thời gian giao hàng

---

## 📦 **9. ORDER_ITEMS TABLE**

### **Migration: create_order_items_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');        // ID đơn hàng
            $table->unsignedBigInteger('product_id');      // ID sản phẩm
            $table->string('product_name');                // Tên sản phẩm (snapshot)
            $table->string('product_sku');                 // SKU sản phẩm (snapshot)
            $table->decimal('product_price', 15, 2);       // Giá sản phẩm tại thời điểm mua
            $table->integer('quantity');                   // Số lượng
            $table->decimal('total_price', 15, 2);         // Tổng tiền item (price * quantity)
            $table->json('product_attributes')->nullable(); // Thuộc tính sản phẩm (màu, size...)
            $table->timestamps();
            
            // Indexes
            $table->index(['order_id']);
            $table->index(['product_id']);
            
            // Foreign keys
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_items');
    }
};
```

### **Mô tả các trường:**
- `order_id`: ID đơn hàng chứa item này
- `product_id`: ID sản phẩm
- `product_name/sku`: Snapshot tên và SKU lúc mua
- `product_price`: Giá sản phẩm tại thời điểm mua
- `quantity`: Số lượng mua
- `total_price`: Tổng tiền (giá × số lượng)
- `product_attributes`: Thuộc tính đã chọn (màu, size...)

---

## 🎯 **10. BANNERS TABLE**

### **Migration: create_banners_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');                        // Tiêu đề banner
            $table->text('description')->nullable();        // Mô tả
            $table->string('image');                        // Đường dẫn ảnh
            $table->string('link')->nullable();            // Link đích
            $table->enum('position', ['slider', 'banner', 'popup', 'sidebar'])->default('banner'); // Vị trí hiển thị
            $table->integer('priority')->default(0);       // Độ ưu tiên (số càng cao càng ưu tiên)
            $table->enum('status', ['active', 'inactive'])->default('active'); // Trạng thái
            $table->enum('device_target', ['all', 'desktop', 'mobile'])->default('all'); // Thiết bị mục tiêu
            $table->timestamp('start_date')->nullable();   // Ngày bắt đầu hiển thị
            $table->timestamp('end_date')->nullable();     // Ngày kết thúc hiển thị
            $table->integer('clicks')->default(0);         // Số lượt click
            $table->integer('views')->default(0);          // Số lượt xem
            $table->json('metadata')->nullable();          // Dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['position', 'status']);
            $table->index(['priority', 'status']);
            $table->index(['start_date', 'end_date']);
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('banners');
    }
};
```

### **Mô tả các trường:**
- `title`: Tiêu đề banner
- `description`: Mô tả chi tiết
- `image`: Đường dẫn file ảnh
- `link`: URL đích khi click
- `position`: Vị trí hiển thị (slider/banner/popup/sidebar)
- `priority`: Độ ưu tiên hiển thị
- `status`: Trạng thái hoạt động
- `device_target`: Thiết bị mục tiêu
- `start_date/end_date`: Thời gian hiển thị
- `clicks/views`: Thống kê tương tác
- `metadata`: Dữ liệu JSON bổ sung

---

## 🔔 **11. NOTIFICATIONS TABLE**

### **Migration: create_notifications_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');         // ID người nhận
            $table->string('title');                        // Tiêu đề thông báo
            $table->text('message');                       // Nội dung thông báo
            $table->enum('type', ['deposit_approved', 'deposit_rejected', 'order_created', 'order_shipped', 'order_delivered', 'system', 'promotion']); // Loại thông báo
            $table->json('data')->nullable();              // Dữ liệu bổ sung (JSON)
            $table->boolean('read')->default(false);       // Đã đọc chưa
            $table->timestamp('read_at')->nullable();      // Thời gian đọc
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal'); // Độ ưu tiên
            $table->string('action_url')->nullable();      // URL hành động
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'read']);
            $table->index(['type', 'created_at']);
            $table->index(['priority', 'read']);
            
            // Foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
```

### **Mô tả các trường:**
- `user_id`: ID người nhận thông báo
- `title`: Tiêu đề ngắn gọn
- `message`: Nội dung chi tiết
- `type`: Loại thông báo (deposit/order/system...)
- `data`: Dữ liệu JSON bổ sung
- `read`: Trạng thái đã đọc
- `read_at`: Thời gian đọc
- `priority`: Độ ưu tiên (low/normal/high)
- `action_url`: URL để chuyển hướng khi click

---

## 🎲 **12. SPIN_ITEMS TABLE**

### **Migration: create_spin_items_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('spin_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Tên phần thưởng
            $table->enum('type', ['product', 'points', 'discount', 'cash']); // Loại phần thưởng
            $table->decimal('value', 15, 2);               // Giá trị phần thưởng
            $table->decimal('probability', 5, 2);          // Tỷ lệ trúng (%)
            $table->string('image')->nullable();           // Ảnh phần thưởng
            $table->text('description')->nullable();        // Mô tả
            $table->integer('stock')->nullable();          // Số lượng (null = unlimited)
            $table->integer('max_per_user')->nullable();   // Giới hạn mỗi user
            $table->enum('status', ['active', 'inactive'])->default('active'); // Trạng thái
            $table->integer('sort_order')->default(0);     // Thứ tự hiển thị
            $table->json('metadata')->nullable();          // Dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'sort_order']);
            $table->index(['type', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('spin_items');
    }
};
```

### **Mô tả các trường:**
- `name`: Tên giải thưởng
- `type`: Loại (sản phẩm/điểm/giảm giá/tiền mặt)
- `value`: Giá trị phần thưởng
- `probability`: Tỷ lệ trúng (%)
- `image`: Ảnh phần thưởng
- `stock`: Số lượng còn lại
- `max_per_user`: Giới hạn mỗi user
- `status`: Trạng thái hoạt động
- `sort_order`: Thứ tự trong vòng quay

---

## 🎯 **13. SPIN_RESULTS TABLE**

### **Migration: create_spin_results_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('spin_results', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');         // ID người quay
            $table->unsignedBigInteger('spin_item_id');    // ID phần thưởng trúng
            $table->decimal('cost', 15, 2);               // Chi phí quay
            $table->decimal('value_won', 15, 2);          // Giá trị trúng
            $table->enum('status', ['pending', 'claimed', 'expired'])->default('pending'); // Trạng thái
            $table->timestamp('claimed_at')->nullable();   // Thời gian nhận thưởng
            $table->timestamp('expires_at')->nullable();   // Thời gian hết hạn
            $table->json('metadata')->nullable();          // Dữ liệu bổ sung
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index(['spin_item_id']);
            $table->index(['created_at']);
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('spin_item_id')->references('id')->on('spin_items')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('spin_results');
    }
};
```

### **Mô tả các trường:**
- `user_id`: ID người chơi
- `spin_item_id`: ID phần thưởng đã trúng
- `cost`: Chi phí để quay (trừ từ ví)
- `value_won`: Giá trị phần thưởng trúng
- `status`: Trạng thái (chờ/đã nhận/hết hạn)
- `claimed_at`: Thời gian nhận thưởng
- `expires_at`: Thời gian hết hạn nhận
- `metadata`: Dữ liệu JSON bổ sung

---

## ⚙️ **14. SYSTEM_SETTINGS TABLE**

### **Migration: create_system_settings_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();               // Khóa setting (site_name, min_deposit...)
            $table->text('value')->nullable();             // Giá trị setting
            $table->string('type')->default('string');     // Kiểu dữ liệu (string, int, float, boolean, json)
            $table->string('group')->default('general');   // Nhóm setting (general, business, payment...)
            $table->text('description')->nullable();        // Mô tả setting
            $table->boolean('is_public')->default(false);  // Có public cho frontend không
            $table->timestamps();
            
            // Indexes
            $table->index(['group']);
            $table->index(['is_public']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_settings');
    }
};
```

### **Mô tả các trường:**
- `key`: Khóa setting duy nhất
- `value`: Giá trị setting (text để lưu mọi kiểu)
- `type`: Kiểu dữ liệu gốc
- `group`: Nhóm setting (general/business/payment...)
- `description`: Mô tả ý nghĩa setting
- `is_public`: Có được phép truy cập từ frontend không

---

## 🏦 **15. BANK_ACCOUNTS TABLE**

### **Migration: create_bank_accounts_table.php**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('bank_name');                   // Tên ngân hàng
            $table->string('bank_code', 10);              // Mã ngân hàng (ACB, VCB...)
            $table->string('account_number', 50);         // Số tài khoản
            $table->string('account_holder');             // Chủ tài khoản
            $table->string('branch')->nullable();         // Chi nhánh
            $table->boolean('is_default')->default(false); // TK mặc định
            $table->enum('status', ['active', 'inactive'])->default('active'); // Trạng thái
            $table->string('qr_code')->nullable();        // Đường dẫn QR code
            $table->decimal('daily_limit', 15, 2)->nullable(); // Hạn mức giao dịch/ngày
            $table->json('working_hours')->nullable();     // Giờ làm việc (JSON)
            $table->text('notes')->nullable();            // Ghi chú
            $table->timestamps();
            
            // Indexes
            $table->index(['bank_code', 'status']);
            $table->index(['is_default', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('bank_accounts');
    }
};
```

### **Mô tả các trường:**
- `bank_name`: Tên đầy đủ ngân hàng
- `bank_code`: Mã ngắn gọn ngân hàng
- `account_number`: Số tài khoản
- `account_holder`: Tên chủ tài khoản
- `branch`: Chi nhánh ngân hàng
- `is_default`: Tài khoản mặc định
- `status`: Trạng thái hoạt động
- `qr_code`: Đường dẫn QR code
- `daily_limit`: Hạn mức giao dịch
- `working_hours`: Giờ làm việc JSON
- `notes`: Ghi chú bổ sung

---

## 📊 **16. DATA RELATIONSHIPS**

### **16.1 One-to-One Relationships:**
```php
// User -> Wallet (1:1)
User::class hasOne Wallet::class
Wallet::class belongsTo User::class

// User -> SubAdmin (Many:1)
User::class belongsTo User::class (sub_admin_id)
```

### **16.2 One-to-Many Relationships:**
```php
// User -> Deposits (1:M)
User::class hasMany Deposit::class
Deposit::class belongsTo User::class

// User -> Orders (1:M)  
User::class hasMany Order::class
Order::class belongsTo User::class

// Category -> Products (1:M)
Category::class hasMany Product::class
Product::class belongsTo Category::class

// Product -> ProductImages (1:M)
Product::class hasMany ProductImage::class
ProductImage::class belongsTo Product::class

// Order -> OrderItems (1:M)
Order::class hasMany OrderItem::class
OrderItem::class belongsTo Order::class

// Wallet -> WalletTransactions (1:M)
Wallet::class hasMany WalletTransaction::class
WalletTransaction::class belongsTo Wallet::class
```

### **16.3 Self-Referencing Relationships:**
```php
// Category -> Category (Parent-Child)
Category::class hasMany Category::class (children)
Category::class belongsTo Category::class (parent)

// User -> User (SubAdmin-User)
User::class hasMany User::class (managed_users)
User::class belongsTo User::class (sub_admin)
```

---

## 🔍 **17. DATABASE INDEXES SUMMARY**

### **17.1 Primary Indexes:**
- Tất cả bảng có `id` làm primary key
- Unique indexes: `email`, `sub_admin_code`, `slug`, `sku`, `code`

### **17.2 Performance Indexes:**
```sql
-- Users table
INDEX idx_users_role_status (role, status)
INDEX idx_users_sub_admin (sub_admin_id)
INDEX idx_users_email_status (email, status)

-- Products table  
INDEX idx_products_category_status (category_id, status)
INDEX idx_products_featured_status (featured, status)
INDEX idx_products_price (price)

-- Orders table
INDEX idx_orders_user_status (user_id, status)
INDEX idx_orders_status_date (status, created_at)

-- Deposits table
INDEX idx_deposits_user_status (user_id, status)
INDEX idx_deposits_status_date (status, created_at)

-- Wallet Transactions
INDEX idx_wallet_transactions_wallet_type (wallet_id, type)
INDEX idx_wallet_transactions_reference (reference_type, reference_id)
```

### **17.3 Foreign Key Constraints:**
- Tất cả foreign keys có `ON DELETE CASCADE` hoặc `SET NULL`
- Đảm bảo tính toàn vẹn dữ liệu
- Tối ưu performance cho JOIN queries

---

## 📈 **18. ESTIMATED TABLE SIZES**

### **18.1 Dung lượng ước tính:**
```
users: ~500 bytes/record
wallets: ~200 bytes/record  
deposits: ~800 bytes/record
wallet_transactions: ~400 bytes/record
products: ~2KB/record
product_images: ~300 bytes/record
orders: ~1KB/record
order_items: ~200 bytes/record
notifications: ~500 bytes/record
```

### **18.2 Scaling Considerations:**
- **Partitioning**: Bảng `wallet_transactions`, `notifications` theo tháng
- **Archiving**: Dữ liệu cũ sau 2 năm chuyển sang bảng archive
- **Caching**: Redis cache cho settings, categories, featured products
- **Read Replicas**: Tách read/write operations

---

**📅 Last Updated:** 2024-01-01  
**👨‍💻 Database Designer:** Development Team  
**🎯 Status:** Production Ready  
**📊 Total Tables:** 15 tables + pivot tables
