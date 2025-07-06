// src/api/authService.js (or wherever it's located)

import api from './config'; // Assuming you use your configured Axios instance

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const authService = {
  // Method to store the token and user data
  setAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Set default Authorization header for Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Method to get the token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Method to get user data
  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Method to check if the user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    // You might want to add token validation here (e.g., check expiry)
    return !!token;
  },

  // Method to log out
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  // Initialize Axios header on app start (useful if refreshing page)
  initializeAuthHeader() {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// You might also export it as a default if that's your pattern
// export default authService;