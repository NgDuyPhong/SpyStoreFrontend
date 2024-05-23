/* eslint-disable no-console */
import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  if (accessToken && accessToken !== 'undefined') {
    config.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response
      && error.response.status === 500
      && error.response.data.meta && error.response.data.meta.code === 1000) {
      console.error(error.response.data.meta.message);
    }

    return Promise.reject(error);
  },
);

Vue.prototype.$http = axios;
Vue.prototype.$to = function to(promise) {
  return promise
    .then(response => [response, null])
    .catch(error => [null, error]);
};
