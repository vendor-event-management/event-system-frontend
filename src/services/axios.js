import axios from 'axios';
import { URL_BACKEND, TOKEN_NAME } from '../utils/enums';

export const fetch = () => {
  axios.defaults.baseURL = URL_BACKEND;
  const token = JSON.parse(localStorage.getItem(TOKEN_NAME));
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return axios;
};
