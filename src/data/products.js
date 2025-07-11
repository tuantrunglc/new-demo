// Dữ liệu mẫu cho trang thương mại điện tử

export const products = [
  {
    id: 1,
    name: "Điện thoại Samsung Galaxy S23",
    description: "Điện thoại Samsung Galaxy S23 mới nhất với camera 108MP",
    price: 18990000,
    discountPrice: 17500000,
    sellerId: 2,
    sellerName: "Trần Thị B",
    category: "Điện thoại",
    status: "approved",
    commission_rate: 5,
    images: [
      "https://via.placeholder.com/300x300.png?text=Samsung+S23"
    ],
    createdAt: "2023-06-10T08:30:00Z",
    updatedAt: "2023-06-15T10:15:00Z",
    stock: 25
  },
  {
    id: 2,
    name: "Laptop Dell XPS 15",
    description: "Laptop Dell XPS 15 với màn hình 4K, chip Intel i9",
    price: 42000000,
    discountPrice: null,
    sellerId: 5,
    sellerName: "Hoàng E",
    category: "Laptop",
    status: "approved",
    commission_rate: 3,
    images: [
      "https://via.placeholder.com/300x300.png?text=Dell+XPS+15"
    ],
    createdAt: "2023-06-12T09:45:00Z",
    updatedAt: "2023-06-12T09:45:00Z",
    stock: 10
  },
  {
    id: 3,
    name: "Tai nghe Apple AirPods Pro",
    description: "Tai nghe Apple AirPods Pro với khả năng chống ồn chủ động",
    price: 5990000,
    discountPrice: 5500000,
    sellerId: 2,
    sellerName: "Trần Thị B",
    category: "Phụ kiện",
    status: "pending",
    commission_rate: 8,
    images: [
      "https://via.placeholder.com/300x300.png?text=AirPods+Pro"
    ],
    createdAt: "2023-06-14T14:20:00Z",
    updatedAt: "2023-06-14T14:20:00Z",
    stock: 30
  },
  {
    id: 4,
    name: "iPad Pro 12.9 inch",
    description: "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR",
    price: 28990000,
    discountPrice: 27500000,
    sellerId: 5,
    sellerName: "Hoàng E",
    category: "Máy tính bảng",
    status: "approved",
    commission_rate: 4,
    images: [
      "https://via.placeholder.com/300x300.png?text=iPad+Pro"
    ],
    createdAt: "2023-06-15T11:10:00Z",
    updatedAt: "2023-06-16T09:30:00Z",
    stock: 15
  },
  {
    id: 5,
    name: "Đồng hồ thông minh Apple Watch Series 8",
    description: "Apple Watch Series 8 với tính năng đo ECG, SpO2",
    price: 10990000,
    discountPrice: null,
    sellerId: 2,
    sellerName: "Trần Thị B",
    category: "Đồng hồ thông minh",
    status: "pending",
    commission_rate: 6,
    images: [
      "https://via.placeholder.com/300x300.png?text=Apple+Watch"
    ],
    createdAt: "2023-06-18T15:45:00Z",
    updatedAt: "2023-06-18T15:45:00Z",
    stock: 20
  }
];

// For backward compatibility
export const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 2990000,
    originalPrice: 4590000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviews: 245,
    discount: 35,
    category: "Electronics",
    commission_rate: 7
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 6890000,
    originalPrice: 8050000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    reviews: 189,
    discount: 14,
    category: "Electronics",
    commission_rate: 5
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 4590000,
    originalPrice: 5750000,
    image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    reviews: 120,
    discount: 20,
    category: "Furniture",
    commission_rate: 8
  },
  {
    id: 4,
    name: "Professional DSLR Camera",
    price: 20690000,
    originalPrice: 25290000,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviews: 310,
    discount: 18,
    category: "Electronics",
    commission_rate: 6
  }
];

export const dailyDeals = [
  {
    id: 101,
    name: "Wireless Bluetooth Earbuds",
    price: 1150000,
    originalPrice: 2070000,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    reviews: 132,
    discount: 44,
    category: "Electronics",
    timeLeft: "8h 45m",
    commission_rate: 10
  },
  {
    id: 102,
    name: "Smart Security Camera",
    price: 1840000,
    originalPrice: 3450000,
    image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    reviews: 98,
    discount: 47,
    category: "Electronics",
    timeLeft: "3h 20m",
    commission_rate: 9
  }
];