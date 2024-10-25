import axios from 'axios';
import { useMsal } from '@azure/msal-react';

const instance = axios.create({
  baseURL: 'https://etaprodapi.azurewebsites.net/api/v1/', // API Base URL Path
  headers: { 'Content-Type': 'application/json' }
});

export const useAxios = () => {
  const msal = useMsal();

  instance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem('token');
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
    { synchronous: true }
  );

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        const account = msal.instance.getActiveAccount();
        if (!account) {
          window.location.href = '/';
        } else {
          localStorage.setItem('token', '');
          originalRequest._retry = true;
          const accessTokenRequest = {
            scopes: ['api://5cf3e0ce-6bee-4ebe-b790-7bd7442f1751/ReadAccess']
          };
          try {
            msal.instance
              .acquireTokenSilent(accessTokenRequest)
              .then((tokenResponse) => {
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;

                localStorage.setItem('token', tokenResponse.accessToken);
              });
            return axios(originalRequest);
          } catch (error) {
            // Handle refresh token error or redirect to login
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return [instance];
};

export default useAxios;
