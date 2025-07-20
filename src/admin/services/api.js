import axios from 'axios';
import { users, authenticateAdmin } from '../data/users';
import { orders } from '../data/orders';
import { products } from '../data/products';
import { luckySpinItems, userSpins } from '../data/lucky-spin';
import { commissions, wallets } from '../data/commissions';
import { dashboardData } from '../data/dashboard';

// Create axios instance
const api = axios.create({
  baseURL: '/',
  timeout: 10000,
});

// Add a request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const mockApi = {
  // Auth
  login: async (username, password) => {
    await delay(500);
    return authenticateAdmin(username, password);
  },

  // Users
  getUsers: async () => {
    await delay(300);
    return { data: users };
  },
  
  getUserById: async (userId) => {
    await delay(200);
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { data: user };
  },
  
  updateUser: async (userData) => {
    await delay(400);
    return { data: userData, message: 'User updated successfully' };
  },
  
  deleteUser: async (/* userId */) => {
    await delay(300);
    return { message: 'User deleted successfully' };
  },
  
  changeUserPassword: async (userId) => {
    await delay(500);
    // In a real application, this would send the new password to the server
    // Here we just simulate a successful response
    return { 
      success: true, 
      message: 'Password changed successfully',
      data: { userId, passwordChanged: true }
    };
  },

  // Products
  getProducts: async () => {
    await delay(300);
    return { data: products };
  },
  
  getProductById: async (productId) => {
    await delay(200);
    const product = products.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return { data: product };
  },
  
  updateProduct: async (productData) => {
    await delay(400);
    return { data: productData, message: 'Product updated successfully' };
  },
  
  approveProduct: async (/* productId */) => {
    await delay(300);
    return { message: 'Product approved successfully' };
  },
  
  deleteProduct: async (/* productId */) => {
    await delay(300);
    return { message: 'Product deleted successfully' };
  },
  
  createProduct: async (productData) => {
    await delay(500);
    return { data: productData, message: 'Product created successfully' };
  },

  // Orders
  getOrders: async () => {
    await delay(300);
    return { data: orders };
  },
  
  getOrderById: async (id) => {
    await delay(200);
    const order = orders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { data: order };
  },
  
  updateOrderStatus: async (id, status) => {
    await delay(400);
    return { message: `Order status updated to ${status}` };
  },
  
  createOrder: async (orderData) => {
    await delay(500);
    const newOrder = {
      id: `ORD-${Date.now().toString().substring(7)}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { data: newOrder, message: 'Order created successfully' };
  },

  // Lucky Spin
  getSpinItems: async () => {
    await delay(300);
    return { data: luckySpinItems };
  },
  
  updateSpinItem: async (itemData) => {
    await delay(400);
    return { data: itemData, message: 'Spin item updated successfully' };
  },
  
  getUserSpins: async (userId) => {
    await delay(200);
    const userSpin = userSpins.find(s => s.userId === userId);
    return { data: userSpin || { userId, spinsRemaining: 0, history: [] } };
  },
  
  addUserSpins: async (userId, count) => {
    await delay(300);
    return { message: `Added ${count} spins to user ${userId}` };
  },

  // Commissions
  getCommissions: async () => {
    await delay(300);
    return { data: commissions };
  },
  
  getWallets: async () => {
    await delay(300);
    return { data: wallets };
  },
  
  updateWalletBalance: async (sellerId, amount, type, description) => {
    await delay(400);
    
    // Find the wallet
    const wallet = wallets.find(w => w.sellerId === sellerId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Update the wallet balance
    if (type === 'add') {
      wallet.balance += amount;
    } else if (type === 'subtract') {
      if (wallet.balance < amount) {
        throw new Error('Insufficient balance');
      }
      wallet.balance -= amount;
    }
    
    wallet.lastUpdated = new Date().toISOString();
    
    // Create a transaction record (we would store this in a transactions array)
    const transaction = {
      id: `trans-${Date.now()}`,
      sellerId,
      amount,
      type,
      description,
      createdAt: new Date().toISOString()
    };
    
    return { 
      data: { wallet, transaction },
      message: `Wallet balance ${type === 'add' ? 'increased' : 'decreased'} successfully` 
    };
  },

  // Dashboard
  getDashboardData: async () => {
    await delay(500);
    return { data: dashboardData };
  },
};

export default mockApi;