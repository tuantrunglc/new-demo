// Sample user data for admin panel
export const users = [
  {
    id: 1,
    username: 'nguyenvan',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    registeredDate: '2023-01-15',
    status: 'active',
    orders: 5
  },
  {
    id: 2,
    username: 'tranthib',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0912345678',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    registeredDate: '2023-02-20',
    status: 'active',
    orders: 3
  },
  {
    id: 3,
    username: 'lequangc',
    fullName: 'Lê Quang C',
    email: 'lequangc@example.com',
    phone: '0923456789',
    address: '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
    registeredDate: '2023-03-10',
    status: 'inactive',
    orders: 0
  },
  {
    id: 4,
    username: 'phamthid',
    fullName: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0934567890',
    address: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
    registeredDate: '2023-04-05',
    status: 'active',
    orders: 8
  },
  {
    id: 5,
    username: 'hoange',
    fullName: 'Hoàng E',
    email: 'hoange@example.com',
    phone: '0945678901',
    address: '202 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    registeredDate: '2023-05-12',
    status: 'active',
    orders: 2
  }
];

// Admin users
export const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

// Function to authenticate admin
export const authenticateAdmin = (username, password) => {
  const admin = adminUsers.find(
    user => user.username === username && user.password === password
  );
  
  if (admin) {
    // In a real app, you would generate a JWT token here
    return {
      token: 'admin-token-' + Date.now(),
      user: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role
      }
    };
  }
  
  return null;
};