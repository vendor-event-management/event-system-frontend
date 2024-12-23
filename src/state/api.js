import axios from 'axios';
import { fetch } from '../services';
import { URL_BACKEND } from '../utils';

export const login = async (params) => {
  const response = await axios.post(`${URL_BACKEND}/api/auth/login`, params);
  return response.data;
};

export const fetchEvents = async (userId, params) => {
  const response = await fetch().get(`/api/event/by-user/${userId}`, {
    params,
  });
  return response.data;
};

export const fetchEventDetail = async (id) => {
  const response = await fetch().get(`/api/event/${id}`);
  return response.data;
};
