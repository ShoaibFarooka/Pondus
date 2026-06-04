import axios from 'axios';
import Cookies from 'js-cookie';
import { getTenantId } from '../utils/tenantUtils';
import userService from './userService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.skipAuthRefresh) {
      const token = Cookies.get('pondus-jwt-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    const tenantId = await getTenantId();
    console.log('Current Tenant Id: ', tenantId);

    config.headers['X-Tenant-ID'] = tenantId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response: { status } } = error;
    const originalRequest = config;
    if (error?.response?.data?.access === 'blocked') {
      window.location.href = '/blocked';
      return Promise.reject(err);
    }
    else if (status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log('Refreshing token...');
          const response = await userService.refreshToken();
          const { token } = response;
          Cookies.set('pondus-jwt-token', token);
          console.log('Refresh token done!');
          onRefreshed(token);
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log('Error in refreshing token: ', err);
          Cookies.remove('pondus-jwt-token');
          const redirectTo = window.location.pathname.startsWith('/company') ? '/company/login' : '/login';
          window.location.href = redirectTo;
          return Promise.reject(err);
        }
        finally {
          isRefreshing = false;
        }
      }
      console.log('Refresh token already in progress, falling back to queue');
      const retryOriginalRequest = new Promise((resolve) => {
        const callback = (token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        }
        addRefreshSubscriber(callback);
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;