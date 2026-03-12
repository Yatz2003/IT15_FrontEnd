import { api, withRetry } from './api';

export const loginAPI = {
  async login(email, password) {
    const response = await withRetry(() => api.post('/api/login', { email, password }), 1);
    return response.data;
  },

  async getProfile() {
    const response = await withRetry(() => api.get('/api/profile'), 1);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/logout');
    } catch (error) {
      // The UI should still clear local auth state even if this request fails.
      console.error('Logout request failed:', error);
    }
  },
};

export default loginAPI;
