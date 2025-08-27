import { AuthProvider } from 'react-admin';
import axios from 'axios';
import { AuthResponse } from '../types';

const API_URL = 'http://localhost:3001/api';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/admin/login`, {
        username,
        password,
      });

      if (response.data.success) {
        const { token, admin } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(admin));
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Invalid credentials'));
      }
    } catch (error) {
      return Promise.reject(new Error('Login failed'));
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    return token ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const user = localStorage.getItem('user');
    return user ? Promise.resolve(JSON.parse(user).role) : Promise.reject();
  },

  getIdentity: () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return Promise.resolve({
          id: userData.id,
          fullName: userData.fullName,
          avatar: undefined,
        });
      }
    } catch (error) {
      // ignore
    }
    return Promise.reject();
  },
};