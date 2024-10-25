import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://etadevapi.azurewebsites.net/api/v1/', // API Base URL Path
  headers: { 'Content-Type': 'application/json' }
});

export const useAxios = () => {
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
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const postData = {
            AccessToken: localStorage.getItem('token'),
            RefreshToken: refreshToken
          };
          axios.post('Auth/refresh?api-version=1', postData).then((res) => {
            const { token } = res.data.AccessToken;
            localStorage.setItem('token', token);
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
          });

          return axios(originalRequest);
        } catch (error) {
          // Handle refresh token error or redirect to login
        }
      }
      return Promise.reject(error);
    }
  );

  return [instance];
};

export default useAxios;
