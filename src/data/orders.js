// Sample order data for admin panel
/* eslint-disable no-unused-vars */
import { featuredProducts, dailyDeals } from './products';
/* eslint-enable no-unused-vars */

// Note: We're importing products for potential future use
// but not using them directly in this file

export const orders = [
  {
    id: 'ORD-2023-001',
    userId: 1,
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    customerPhone: '0901234567',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    orderDate: '2023-06-15',
    status: 'delivered',
    paymentMethod: 'COD',
    paymentStatus: 'paid',
    items: [
      {
        productId: 1,
        productName: 'Tai Nghe Không Dây Cao Cấp',
        price: 2990000,
        quantity: 1,
        total: 2990000
      },
      {
        productId: 5,
        productName: 'Kính Mát Thời Trang',
        price: 1380000,
        quantity: 1,
        total: 1380000
      }
    ],
    subtotal: 4370000,
    shippingFee: 30000,
    discount: 0,
    total: 4400000
  },
  {
    id: 'ORD-2023-002',
    userId: 2,
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@example.com',
    customerPhone: '0912345678',
    shippingAddress: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    orderDate: '2023-06-18',
    status: 'shipped',
    paymentMethod: 'Banking',
    paymentStatus: 'paid',
    items: [
      {
        productId: 2,
        productName: 'Đồng Hồ Thông Minh Series 5',
        price: 6890000,
        quantity: 1,
        total: 6890000
      }
    ],
    subtotal: 6890000,
    shippingFee: 0,
    discount: 500000,
    total: 6390000
  },
  {
    id: 'ORD-2023-003',
    userId: 4,
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@example.com',
    customerPhone: '0934567890',
    shippingAddress: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
    orderDate: '2023-06-20',
    status: 'processing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    items: [
      {
        productId: 3,
        productName: 'Ghế Văn Phòng Công Thái Học',
        price: 4590000,
        quantity: 1,
        total: 4590000
      },
      {
        productId: 8,
        productName: 'Bình Nước Thép Không Gỉ',
        price: 575000,
        quantity: 2,
        total: 1150000
      }
    ],
    subtotal: 5740000,
    shippingFee: 50000,
    discount: 0,
    total: 5790000
  },
  {
    id: 'ORD-2023-004',
    userId: 5,
    customerName: 'Hoàng E',
    customerEmail: 'hoange@example.com',
    customerPhone: '0945678901',
    shippingAddress: '202 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    orderDate: '2023-06-22',
    status: 'pending',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    items: [
      {
        productId: 6,
        productName: 'Loa Bluetooth Di Động',
        price: 1840000,
        quantity: 1,
        total: 1840000
      }
    ],
    subtotal: 1840000,
    shippingFee: 30000,
    discount: 0,
    total: 1870000
  },
  {
    id: 'ORD-2023-005',
    userId: 1,
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@example.com',
    customerPhone: '0901234567',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    orderDate: '2023-06-25',
    status: 'cancelled',
    paymentMethod: 'Banking',
    paymentStatus: 'refunded',
    items: [
      {
        productId: 4,
        productName: 'Máy Ảnh DSLR Chuyên Nghiệp',
        price: 20690000,
        quantity: 1,
        total: 20690000
      }
    ],
    subtotal: 20690000,
    shippingFee: 0,
    discount: 1000000,
    total: 19690000
  }
];

// Order status options
export const orderStatuses = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'warning' },
  { value: 'processing', label: 'Đang xử lý', color: 'info' },
  { value: 'shipped', label: 'Đã giao cho vận chuyển', color: 'primary' },
  { value: 'delivered', label: 'Đã giao hàng', color: 'success' },
  { value: 'cancelled', label: 'Đã hủy', color: 'danger' }
];

// Payment status options
export const paymentStatuses = [
  { value: 'pending', label: 'Chờ thanh toán', color: 'warning' },
  { value: 'paid', label: 'Đã thanh toán', color: 'success' },
  { value: 'refunded', label: 'Đã hoàn tiền', color: 'info' },
  { value: 'failed', label: 'Thanh toán thất bại', color: 'danger' }
];