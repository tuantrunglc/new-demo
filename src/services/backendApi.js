import axios from 'axios';

// Backend API configuration
const BACKEND_BASE_URL = process.env.VUE_APP_BACKEND_URL || 'http://localhost:8000/api';

// Create axios instance for backend API
const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminUser');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Backend API methods
const backendApiService = {
  // Authentication
  async userLogin(email, password) {
    try {
      const response = await backendApi.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  async userRegister(userData) {
    try {
      const response = await backendApi.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  },

  async adminLogin(email, password) {
    try {
      const response = await backendApi.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập admin thất bại');
    }
  },

  async logout() {
    try {
      const response = await backendApi.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.error('Logout error:', error);
      return { success: true };
    }
  },

  async refreshToken() {
    try {
      const response = await backendApi.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Refresh token thất bại');
    }
  },

  // User Management
  async getProfile() {
    try {
      const response = await backendApi.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin profile');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await backendApi.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật profile thất bại');
    }
  },

  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await backendApi.post('/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  },

  // Products
  async getProducts(params = {}) {
    try {
      const response = await backendApi.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
    }
  },

  async getProduct(id) {
    try {
      const response = await backendApi.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
    }
  },

  async getFeaturedProducts() {
    try {
      const response = await backendApi.get('/products/featured');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm nổi bật');
    }
  },

  async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await backendApi.get(`/categories/${categoryId}/products`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm theo danh mục');
    }
  },

  async searchProducts(query, params = {}) {
    try {
      const response = await backendApi.get('/products/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tìm kiếm sản phẩm thất bại');
    }
  },

  // Categories
  async getCategories() {
    try {
      const response = await backendApi.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  },

  // Orders
  async getOrders(params = {}) {
    try {
      const response = await backendApi.get('/user/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  },

  async getOrder(id) {
    try {
      const response = await backendApi.get(`/user/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin đơn hàng');
    }
  },

  async createOrder(orderData) {
    try {
      const response = await backendApi.post('/user/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tạo đơn hàng thất bại');
    }
  },

  async cancelOrder(id) {
    try {
      const response = await backendApi.post(`/user/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hủy đơn hàng thất bại');
    }
  },

  // Wallet
  async getWallet() {
    try {
      const response = await backendApi.get('/user/wallet');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin ví');
    }
  },

  async getWalletTransactions(params = {}) {
    try {
      const response = await backendApi.get('/user/wallet/transactions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử giao dịch');
    }
  },

  async deposit(amount, paymentMethod, bankInfo = null) {
    try {
      const response = await backendApi.post('/user/wallet/deposit', {
        amount,
        payment_method: paymentMethod,
        bank_info: bankInfo
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Nạp tiền thất bại');
    }
  },

  async withdraw(amount, bankAccount) {
    try {
      const response = await backendApi.post('/user/wallet/withdraw', {
        amount,
        bank_account: bankAccount
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Rút tiền thất bại');
    }
  },

  // Bank Accounts
  async getBankAccounts() {
    try {
      const response = await backendApi.get('/user/bank-accounts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản ngân hàng');
    }
  },

  async addBankAccount(bankData) {
    try {
      const response = await backendApi.post('/user/bank-accounts', bankData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Thêm tài khoản ngân hàng thất bại');
    }
  },

  async updateBankAccount(id, bankData) {
    try {
      const response = await backendApi.put(`/user/bank-accounts/${id}`, bankData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật tài khoản ngân hàng thất bại');
    }
  },

  async deleteBankAccount(id) {
    try {
      const response = await backendApi.delete(`/user/bank-accounts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xóa tài khoản ngân hàng thất bại');
    }
  },

  // Lucky Spin
  async getSpinData() {
    try {
      const response = await backendApi.get('/user/lucky-spin');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin vòng quay');
    }
  },

  async spin() {
    try {
      const response = await backendApi.post('/user/lucky-spin/spin');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Quay thất bại');
    }
  },

  async getSpinHistory(params = {}) {
    try {
      const response = await backendApi.get('/user/lucky-spin/history', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử quay');
    }
  },

  // Admin APIs
  async adminGetUsers(params = {}) {
    try {
      const response = await backendApi.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người dùng');
    }
  },

  async adminGetUser(id) {
    try {
      const response = await backendApi.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  },

  async adminCreateUser(userData) {
    try {
      const response = await backendApi.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tạo người dùng thất bại');
    }
  },

  async adminUpdateUser(id, userData) {
    try {
      const response = await backendApi.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật người dùng thất bại');
    }
  },

  async adminDeleteUser(id) {
    try {
      const response = await backendApi.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
  },

  async adminUpdateUserStatus(id, status) {
    try {
      const response = await backendApi.put(`/admin/users/${id}/status`, { is_active: status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật trạng thái người dùng thất bại');
    }
  },

  // Products Admin APIs
  async adminGetProducts(params = {}) {
    try {
      const response = await backendApi.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
    }
  },

  async adminCreateProduct(productData) {
    try {
      const response = await backendApi.post('/admin/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
    }
  },

  async adminUpdateProduct(id, productData) {
    try {
      const response = await backendApi.put(`/admin/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    }
  },

  async adminDeleteProduct(id) {
    try {
      const response = await backendApi.delete(`/admin/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
  },

  // Categories Admin APIs
  async adminGetCategories(params = {}) {
    try {
      const response = await backendApi.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  },

  async adminCreateCategory(categoryData) {
    try {
      const response = await backendApi.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Tạo danh mục thất bại');
    }
  },

  async adminUpdateCategory(id, categoryData) {
    try {
      const response = await backendApi.put(`/admin/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật danh mục thất bại');
    }
  },

  async adminDeleteCategory(id) {
    try {
      const response = await backendApi.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Xóa danh mục thất bại');
    }
  },

  // Orders Admin APIs
  async adminGetOrders(params = {}) {
    try {
      const response = await backendApi.get('/admin/orders/all', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  },

  async adminUpdateOrderStatus(id, status) {
    try {
      const response = await backendApi.put(`/admin/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật trạng thái đơn hàng thất bại');
    }
  },

  async adminUpdateOrderPaymentStatus(id, paymentStatus) {
    try {
      const response = await backendApi.put(`/admin/orders/${id}/payment-status`, { payment_status: paymentStatus });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật trạng thái thanh toán thất bại');
    }
  },

  // Dashboard & Reports
  async adminGetDashboard() {
    try {
      const response = await backendApi.get('/admin/reports/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy dữ liệu dashboard');
    }
  },

  async adminGetSalesReport(params = {}) {
    try {
      const response = await backendApi.get('/admin/reports/sales', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy báo cáo bán hàng');
    }
  },

  async adminGetProductReport(params = {}) {
    try {
      const response = await backendApi.get('/admin/reports/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy báo cáo sản phẩm');
    }
  },

  // File Upload
  async uploadFile(file, type = 'image') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await backendApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload file thất bại');
    }
  },

  // Utility methods
  isConnected() {
    return backendApi.defaults.baseURL !== '/';
  },

  getBaseURL() {
    return BACKEND_BASE_URL;
  }
};

export default backendApiService;