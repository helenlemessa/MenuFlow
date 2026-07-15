import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') || path.startsWith('/kitchen') || path.startsWith('/waiter')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const getUsers = () => api.get('/auth/users');
export const createUser = (data) => api.post('/auth/register', data);
export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const reorderCategories = (categories) => api.put('/categories/reorder', { categories });

// Ingredients
export const getIngredients = () => api.get('/ingredients');
export const createIngredient = (data) => api.post('/ingredients', data);
export const updateIngredient = (id, data) => api.put(`/ingredients/${id}`, data);
export const deleteIngredient = (id) => api.delete(`/ingredients/${id}`);

// Extra Ingredients
export const getExtraIngredients = () => api.get('/extra-ingredients');
export const createExtraIngredient = (data) => api.post('/extra-ingredients', data);
export const updateExtraIngredient = (id, data) => api.put(`/extra-ingredients/${id}`, data);
export const deleteExtraIngredient = (id) => api.delete(`/extra-ingredients/${id}`);

// Foods
export const getFoods = (params) => api.get('/foods', { params });
export const getFood = (id) => api.get(`/foods/${id}`);
export const getPopularFoods = () => api.get('/foods/popular');
export const getFeaturedFoods = () => api.get('/foods/featured');
export const createFood = (data) => api.post('/foods', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateFood = (id, data) => api.put(`/foods/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteFood = (id) => api.delete(`/foods/${id}`);

// Tables
export const getTables = () => api.get('/tables');
export const getTable = (number) => api.get(`/tables/number/${number}`);
export const createTable = (data) => api.post('/tables', data);
export const deleteTable = (id) => api.delete(`/tables/${id}`);
export const regenerateQR = (id) => api.put(`/tables/${id}/qr`);

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getActiveOrders = () => api.get('/orders/active');
export const getRecentOrders = (limit) => api.get('/orders/recent', { params: { limit } });
export const getTodayOrders = () => api.get('/orders/today');
export const getOrdersByTable = (tableNumber) => api.get(`/orders/table/${tableNumber}`);
export const completeOrder = (id) => api.put(`/orders/${id}/complete`);
export const markOrderPaid = (id, paymentMethod) => api.put(`/orders/${id}/paid`, { paymentMethod });

// Requests
export const createRequest = (data) => api.post('/requests', data);
export const getPendingRequests = () => api.get('/requests/pending');
export const completeRequest = (id) => api.put(`/requests/${id}/complete`);

// Bills
export const getTableBill = (tableNumber) => api.get(`/bills/table/${tableNumber}`);
export const getPendingBills = () => api.get('/bills/pending');
export const markBillPaid = (data) => api.put('/bills/paid', data);

// Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard');
export const getRevenueChart = (days) => api.get('/analytics/revenue', { params: { days } });
export const getOrdersPerDay = (days) => api.get('/analytics/orders-per-day', { params: { days } });
