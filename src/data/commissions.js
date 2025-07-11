// Dữ liệu mẫu cho tính năng Quản lý hoa hồng

export const commissions = [
  {
    id: "comm-ORD-001",
    orderId: "ORD-001",
    sellerId: 2,
    sellerName: "Trần Thị B",
    amount: 875000,
    status: "paid",
    createdAt: "2023-07-07T14:20:00Z",
    paidAt: "2023-07-08T10:00:00Z"
  },
  {
    id: "comm-ORD-002",
    orderId: "ORD-002",
    sellerId: 5,
    sellerName: "Hoàng E",
    amount: 1260000,
    status: "pending",
    createdAt: "2023-07-08T11:45:00Z",
    paidAt: null
  },
  {
    id: "comm-ORD-003",
    orderId: "ORD-003",
    sellerId: 2,
    sellerName: "Trần Thị B",
    amount: 440000,
    status: "pending",
    createdAt: "2023-07-11T09:10:00Z",
    paidAt: null
  },
  {
    id: "comm-ORD-004",
    orderId: "ORD-004",
    sellerId: 5,
    sellerName: "Hoàng E",
    amount: 1100000,
    status: "paid",
    createdAt: "2023-07-14T16:45:00Z",
    paidAt: "2023-07-15T09:30:00Z"
  }
];

export const wallets = [
  {
    sellerId: 2,
    sellerName: "Trần Thị B",
    balance: 1315000,
    pendingBalance: 440000,
    currency: "VND",
    lastUpdated: "2023-07-15T09:30:00Z"
  },
  {
    sellerId: 5,
    sellerName: "Hoàng E",
    balance: 1100000,
    pendingBalance: 1260000,
    currency: "VND",
    lastUpdated: "2023-07-15T09:30:00Z"
  }
];