# Trang Thương Mại Điện Tử ShopVN

Đây là một trang thương mại điện tử mẫu được xây dựng bằng Vue.js, với giao diện tiếng Việt và các tính năng phổ biến của một trang thương mại điện tử hiện đại.

## Tính năng

- **Giao diện người dùng hiện đại**: Thiết kế đáp ứng cho cả máy tính và thiết bị di động
- **Hiển thị sản phẩm**: Hiển thị sản phẩm nổi bật và khuyến mãi hàng ngày
- **Danh mục sản phẩm**: Phân loại sản phẩm theo danh mục
- **Vòng quay may mắn**: Tính năng tương tác cho người dùng với cơ hội nhận phần thưởng
- **Giỏ hàng**: Thêm sản phẩm vào giỏ hàng
- **Tìm kiếm**: Tìm kiếm sản phẩm

## Công nghệ sử dụng

- Vue.js
- Bootstrap 5
- Font Awesome
- HTML5 Canvas (cho vòng quay may mắn)

## Cài đặt và chạy

```bash
# Cài đặt các gói phụ thuộc
npm install

# Chạy môi trường phát triển với hot-reload
npm run serve

# Biên dịch và tối ưu hóa cho môi trường sản xuất
npm run build

# Kiểm tra và sửa lỗi
npm run lint
```

## Cấu trúc dự án

```
src/
├── assets/          # Hình ảnh và tài nguyên tĩnh
├── components/      # Các thành phần Vue
│   ├── header/      # Thành phần header
│   ├── products/    # Thành phần sản phẩm
│   ├── categories/  # Thành phần danh mục
│   └── lucky-spin/  # Thành phần vòng quay may mắn
├── data/            # Dữ liệu mẫu
├── App.vue          # Thành phần gốc
└── main.js          # Điểm vào của ứng dụng
```

## Tác giả

ShopVN Team

## Giấy phép

MIT

## Tùy chỉnh cấu hình
Xem [Tài liệu tham khảo cấu hình](https://cli.vuejs.org/config/).
