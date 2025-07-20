import axios from 'axios';

// Create axios instance for deposit API
const depositApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token
depositApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
depositApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    return Promise.reject({
      message: errorMessage,
      errors: error.response?.data?.errors || {},
      status: error.response?.status || 500
    });
  }
);

export const depositService = {
  /**
   * Create a new deposit request
   * @param {Object} depositData - Deposit data
   * @param {number} depositData.amount - Amount to deposit
   * @param {string} depositData.description - Description (optional)
   * @param {string} depositData.bank_account - Bank account number
   * @param {string} depositData.proof_image - Proof image (base64 or URL)
   * @returns {Promise<Object>} Created deposit data
   */
  async createDeposit(depositData) {
    const response = await depositApi.post('/deposits', depositData);
    return response;
  },

  /**
   * Get user's deposit history
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} User's deposits with pagination
   */
  async getUserDeposits(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    });
    
    const response = await depositApi.get(`/deposits/user?${queryParams}`);
    return response;
  },

  /**
   * Get all deposits (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status (all, pending, approved, rejected)
   * @param {string} params.search - Search term
   * @param {string} params.from_date - From date (YYYY-MM-DD)
   * @param {string} params.to_date - To date (YYYY-MM-DD)
   * @returns {Promise<Object>} All deposits with pagination and statistics
   */
  async getAllDeposits(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const response = await depositApi.get(`/deposits?${queryParams}`);
    return response;
  },

  /**
   * Update deposit status (Admin only)
   * @param {string} depositId - Deposit reference code
   * @param {Object} updateData - Update data
   * @param {string} updateData.status - New status (approved/rejected)
   * @param {string} updateData.admin_note - Admin note (optional)
   * @returns {Promise<Object>} Updated deposit data
   */
  async updateDepositStatus(depositId, updateData) {
    const response = await depositApi.put(`/deposits/${depositId}`, updateData);
    return response;
  },

  /**
   * Upload image file and convert to base64
   * @param {File} file - Image file
   * @returns {Promise<string>} Base64 encoded image
   */
  async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)'));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        reject(new Error('Kích thước file không được vượt quá 5MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Không thể đọc file'));
      };
      
      reader.readAsDataURL(file);
    });
  },

  /**
   * Format amount to Vietnamese currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  /**
   * Format date to Vietnamese format
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  /**
   * Get status badge class for UI
   * @param {string} status - Deposit status
   * @returns {string} CSS class for status badge
   */
  getStatusBadgeClass(status) {
    const statusClasses = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  },

  /**
   * Get status text in Vietnamese
   * @param {string} status - Deposit status
   * @returns {string} Vietnamese status text
   */
  getStatusText(status) {
    const statusTexts = {
      pending: 'Đang chờ',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };
    return statusTexts[status] || status;
  }
};

export default depositService;