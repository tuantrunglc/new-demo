// Sample order data for admin panel

export const orders = [
  {
    id: 'ORD-001',
    userId: 1,
    userName: 'Nguyễn Văn A',
    sellerId: 2,
    sellerName: 'Trần Thị B',
    items: [
      {
        productId: 1,
        productName: 'Tai Nghe Không Dây Cao Cấp',
        price: 2990000,
        quantity: 1,
        subtotal: 2990000
      },
      {
        productId: 5,
        productName: 'Kính Mát Thời Trang',
        price: 1380000,
        quantity: 1,
        subtotal: 1380000
      }
    ],
    total: 4400000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    createdAt: '2023-07-05T09:30:00Z',
    updatedAt: '2023-07-07T14:20:00Z'
  },
  {
    id: 'ORD-002',
    userId: 4,
    userName: 'Phạm Thị D',
    sellerId: 5,
    sellerName: 'Hoàng E',
    items: [
      {
        productId: 2,
        productName: 'Đồng Hồ Thông Minh Series 5',
        price: 6890000,
        quantity: 1,
        subtotal: 6890000
      }
    ],
    total: 6890000,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    shippingAddress: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
    createdAt: '2023-07-08T11:45:00Z',
    updatedAt: '2023-07-08T11:45:00Z'
  },
  {
    id: 'ORD-003',
    userId: 1,
    userName: 'Nguyễn Văn A',
    sellerId: 2,
    sellerName: 'Trần Thị B',
    items: [
      {
        productId: 3,
        productName: 'Ghế Văn Phòng Công Thái Học',
        price: 4590000,
        quantity: 1,
        subtotal: 4590000
      }
    ],
    total: 4590000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    createdAt: '2023-07-10T15:20:00Z',
    updatedAt: '2023-07-11T09:10:00Z'
  },
  {
    id: 'ORD-004',
    userId: 4,
    userName: 'Phạm Thị D',
    sellerId: 5,
    sellerName: 'Hoàng E',
    items: [
      {
        productId: 4,
        productName: 'Máy Ảnh DSLR Chuyên Nghiệp',
        price: 20690000,
        quantity: 1,
        subtotal: 20690000
      }
    ],
    total: 20690000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    shippingAddress: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
    createdAt: '2023-07-12T10:30:00Z',
    updatedAt: '2023-07-14T16:45:00Z'
  },
  {
    id: 'ORD-005',
    userId: 1,
    userName: 'Nguyễn Văn A',
    sellerId: 2,
    sellerName: 'Trần Thị B',
    items: [
      {
        productId: 6,
        productName: 'Loa Bluetooth Di Động',
        price: 1840000,
        quantity: 1,
        subtotal: 1840000
      }
    ],
    total: 1840000,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    createdAt: '2023-07-15T14:15:00Z',
    updatedAt: '2023-07-15T14:15:00Z'
  }
];

// Order status options
export const orderStatuses = [
  { value: 'pending', label: 'Chờ xử lý', color: 'warning' },
  { value: 'processing', label: 'Đang xử lý', color: 'info' },
  { value: 'shipped', label: 'Đã giao hàng', color: 'primary' },
  { value: 'completed', label: 'Hoàn thành', color: 'success' },
  { value: 'cancelled', label: 'Đã hủy', color: 'danger' }
];

// Payment status options
export const paymentStatuses = [
  { value: 'pending', label: 'Chờ thanh toán', color: 'warning' },
  { value: 'paid', label: 'Đã thanh toán', color: 'success' },
  { value: 'refunded', label: 'Đã hoàn tiền', color: 'info' },
  { value: 'failed', label: 'Thanh toán thất bại', color: 'danger' }
];