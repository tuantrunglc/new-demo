import mockApi from './api.js';
import backendApi from './backendApi.js';

// Determine which API to use based on environment
const USE_MOCK_API = process.env.VUE_APP_ENABLE_MOCK_API === 'true';

// API Adapter - switches between mock and real API
const apiAdapter = {
  // Authentication
  async userLogin(email, password) {
    if (USE_MOCK_API) {
      return await mockApi.userLogin(email, password);
    } else {
      return await backendApi.userLogin(email, password);
    }
  },

  async userRegister(userData) {
    if (USE_MOCK_API) {
      return await mockApi.userRegister(userData);
    } else {
      return await backendApi.userRegister(userData);
    }
  },

  async adminLogin(username, password) {
    if (USE_MOCK_API) {
      return await mockApi.login(username, password);
    } else {
      return await backendApi.adminLogin(username, password);
    }
  },

  async logout() {
    if (USE_MOCK_API) {
      return { success: true };
    } else {
      return await backendApi.logout();
    }
  },

  // User Management
  async getProfile() {
    if (USE_MOCK_API) {
      // Mock implementation - get from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser) throw new Error('User not found');
      return { data: currentUser };
    } else {
      return await backendApi.getProfile();
    }
  },

  async updateProfile(profileData) {
    if (USE_MOCK_API) {
      // Mock implementation - update localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { data: updatedUser, message: 'Profile updated successfully' };
    } else {
      return await backendApi.updateProfile(profileData);
    }
  },

  async changePassword(currentPassword, newPassword, confirmPassword) {
    if (USE_MOCK_API) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Password changed successfully' };
    } else {
      return await backendApi.changePassword(currentPassword, newPassword, confirmPassword);
    }
  },

  // Products
  async getProducts(params = {}) {
    if (USE_MOCK_API) {
      return await mockApi.getProducts();
    } else {
      return await backendApi.getProducts(params);
    }
  },

  async getProduct(id) {
    if (USE_MOCK_API) {
      return await mockApi.getProductById(id);
    } else {
      return await backendApi.getProduct(id);
    }
  },

  async getFeaturedProducts() {
    if (USE_MOCK_API) {
      const products = await mockApi.getProducts();
      // Return first 8 products as featured
      return { data: products.data.slice(0, 8) };
    } else {
      return await backendApi.getFeaturedProducts();
    }
  },

  async searchProducts(query, params = {}) {
    if (USE_MOCK_API) {
      const products = await mockApi.getProducts();
      // Simple search implementation
      const filtered = products.data.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
      return { data: filtered };
    } else {
      return await backendApi.searchProducts(query, params);
    }
  },

  // Categories
  async getCategories() {
    if (USE_MOCK_API) {
      // Mock categories
      return {
        data: [
          { id: 1, name: 'Điện thoại', slug: 'dien-thoai', image: 'phone.jpg' },
          { id: 2, name: 'Laptop', slug: 'laptop', image: 'laptop.jpg' },
          { id: 3, name: 'Thời trang', slug: 'thoi-trang', image: 'fashion.jpg' },
          { id: 4, name: 'Gia dụng', slug: 'gia-dung', image: 'home.jpg' },
          { id: 5, name: 'Sách', slug: 'sach', image: 'books.jpg' },
          { id: 6, name: 'Thể thao', slug: 'the-thao', image: 'sports.jpg' }
        ]
      };
    } else {
      return await backendApi.getCategories();
    }
  },

  // Orders
  async getOrders(params = {}) {
    if (USE_MOCK_API) {
      return await mockApi.getOrders();
    } else {
      return await backendApi.getOrders(params);
    }
  },

  async getOrder(id) {
    if (USE_MOCK_API) {
      return await mockApi.getOrderById(id);
    } else {
      return await backendApi.getOrder(id);
    }
  },

  async createOrder(orderData) {
    if (USE_MOCK_API) {
      return await mockApi.createOrder(orderData);
    } else {
      return await backendApi.createOrder(orderData);
    }
  },

  async cancelOrder(id) {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Order cancelled successfully' };
    } else {
      return await backendApi.cancelOrder(id);
    }
  },

  // Wallet
  async getWallet() {
    if (USE_MOCK_API) {
      // Mock wallet data
      return {
        data: {
          balance: 2500000,
          currency: 'VND',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        }
      };
    } else {
      return await backendApi.getWallet();
    }
  },

  async getWalletTransactions(params = {}) {
    if (USE_MOCK_API) {
      // Mock transaction data
      return {
        data: [
          {
            id: 1,
            type: 'deposit',
            amount: 500000,
            description: 'Nạp tiền vào ví',
            status: 'completed',
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            type: 'payment',
            amount: -299000,
            description: 'Thanh toán đơn hàng #12345',
            status: 'completed',
            created_at: '2024-01-14T15:45:00Z'
          },
          {
            id: 3,
            type: 'withdrawal',
            amount: -1000000,
            description: 'Rút tiền về tài khoản ngân hàng',
            status: 'completed',
            created_at: '2024-01-13T09:15:00Z'
          }
        ]
      };
    } else {
      return await backendApi.getWalletTransactions(params);
    }
  },

  async deposit(amount, paymentMethod, bankInfo = null) {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        data: {
          transaction_id: `dep_${Date.now()}`,
          amount,
          status: 'pending',
          payment_method: paymentMethod
        },
        message: 'Deposit request created successfully'
      };
    } else {
      return await backendApi.deposit(amount, paymentMethod, bankInfo);
    }
  },

  async withdraw(amount, bankAccount) {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        data: {
          transaction_id: `wd_${Date.now()}`,
          amount,
          status: 'pending',
          bank_account: bankAccount
        },
        message: 'Withdrawal request created successfully'
      };
    } else {
      return await backendApi.withdraw(amount, bankAccount);
    }
  },

  // Bank Accounts
  async getBankAccounts() {
    if (USE_MOCK_API) {
      // Mock bank accounts
      return {
        data: [
          {
            id: 1,
            bank_name: 'Vietcombank',
            account_number: '1234567890',
            account_holder: 'NGUYEN VAN A',
            branch: 'Chi nhánh TP.HCM',
            is_default: true,
            created_at: '2024-01-01T00:00:00Z'
          }
        ]
      };
    } else {
      return await backendApi.getBankAccounts();
    }
  },

  async addBankAccount(bankData) {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: { id: Date.now(), ...bankData },
        message: 'Bank account added successfully'
      };
    } else {
      return await backendApi.addBankAccount(bankData);
    }
  },

  // Lucky Spin
  async getSpinData() {
    if (USE_MOCK_API) {
      return await mockApi.getUserSpins('current-user');
    } else {
      return await backendApi.getSpinData();
    }
  },

  async spin() {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const rewards = [
        { id: 1, name: 'Tiền mặt', value: '50,000 VND', icon: '💰' },
        { id: 2, name: 'Voucher giảm giá', value: '10%', icon: '🎫' },
        { id: 3, name: 'Sản phẩm miễn phí', value: 'Tai nghe', icon: '🎁' },
        { id: 4, name: 'Điểm thưởng', value: '100 điểm', icon: '⭐' }
      ];
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      return {
        success: true,
        data: {
          reward: randomReward,
          spins_remaining: 2
        }
      };
    } else {
      return await backendApi.spin();
    }
  },

  // Admin APIs
  async adminGetUsers(params = {}) {
    if (USE_MOCK_API) {
      return await mockApi.getUsers();
    } else {
      return await backendApi.adminGetUsers(params);
    }
  },

  async adminGetDashboard() {
    if (USE_MOCK_API) {
      return await mockApi.getDashboardData();
    } else {
      return await backendApi.adminGetDashboard();
    }
  },

  // Utility methods
  isUsingMockApi() {
    return USE_MOCK_API;
  },

  isBackendConnected() {
    return !USE_MOCK_API && backendApi.isConnected();
  },

  getApiInfo() {
    return {
      useMockApi: USE_MOCK_API,
      backendUrl: USE_MOCK_API ? 'Mock API' : backendApi.getBaseURL(),
      environment: process.env.NODE_ENV
    };
  }
};

export default apiAdapter;