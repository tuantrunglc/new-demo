// Sample user data for admin panel
export const users = [
  {
    id: 1,
    username: 'nguyenvan',
    firstName: 'Nguyễn Văn',
    lastName: 'A',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    password: '123456', // In real app, this would be hashed
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    registeredDate: '2023-01-15',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    status: 'active',
    role: 'user',
    orders: 5,
    managed_by: null,
    avatar: null,
    birthDate: '1990-05-15',
    gender: 'male'
  },
  {
    id: 2,
    username: 'tranthib',
    firstName: 'Trần Thị',
    lastName: 'B',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    password: '123456',
    phone: '0912345678',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    registeredDate: '2023-02-20',
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2023-02-20T10:00:00Z',
    status: 'active',
    role: 'seller',
    orders: 3,
    managed_by: 3,
    avatar: null,
    birthDate: '1985-08-22',
    gender: 'female'
  },
  {
    id: 3,
    username: 'subadmin',
    firstName: 'Lê Quang',
    lastName: 'C',
    fullName: 'Lê Quang C',
    email: 'lequangc@example.com',
    password: 'subadmin123',
    phone: '0923456789',
    address: '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
    registeredDate: '2023-03-10',
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2023-03-10T10:00:00Z',
    status: 'active',
    role: 'sub_admin',
    orders: 0,
    managed_by: 6,
    avatar: null,
    birthDate: '1988-12-03',
    gender: 'male'
  },
  {
    id: 4,
    username: 'phamthid',
    firstName: 'Phạm Thị',
    lastName: 'D',
    fullName: 'Phạm Thị D',
    email: 'phamthid@example.com',
    password: '123456',
    phone: '0934567890',
    address: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
    registeredDate: '2023-04-05',
    createdAt: '2023-04-05T10:00:00Z',
    updatedAt: '2023-04-05T10:00:00Z',
    status: 'active',
    role: 'user',
    orders: 8,
    managed_by: null,
    avatar: null,
    birthDate: '1992-03-18',
    gender: 'female'
  },
  {
    id: 5,
    username: 'hoange',
    firstName: 'Hoàng',
    lastName: 'E',
    fullName: 'Hoàng E',
    email: 'hoange@example.com',
    password: '123456',
    phone: '0945678901',
    address: '202 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    registeredDate: '2023-05-12',
    createdAt: '2023-05-12T10:00:00Z',
    updatedAt: '2023-05-12T10:00:00Z',
    status: 'active',
    role: 'seller',
    orders: 2,
    managed_by: 3,
    avatar: null,
    birthDate: '1987-11-25',
    gender: 'male'
  },
  {
    id: 6,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '0909123456',
    address: '123 Admin Street',
    registeredDate: '2022-01-01',
    createdAt: '2022-01-01T10:00:00Z',
    updatedAt: '2022-01-01T10:00:00Z',
    status: 'active',
    role: 'admin',
    orders: 0,
    managed_by: null,
    avatar: null,
    birthDate: '1980-01-01',
    gender: 'male'
  },
  // Add some test users for login
  {
    id: 7,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    email: 'test@example.com',
    password: '123456',
    phone: '0987654321',
    address: '123 Test Street',
    registeredDate: '2024-01-01',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    status: 'active',
    role: 'user',
    orders: 0,
    managed_by: null,
    avatar: null,
    birthDate: '1995-06-15',
    gender: 'other'
  }
];

// Admin users
export const adminUsers = [
  {
    id: 6,
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 3,
    username: 'subadmin',
    password: 'subadmin123', // In a real app, this would be hashed
    fullName: 'Lê Quang C',
    email: 'lequangc@example.com',
    role: 'sub_admin'
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
        email: admin.email,
        role: admin.role
      }
    };
  }
  
  return null;
};