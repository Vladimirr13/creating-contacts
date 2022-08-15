import axios from 'axios';

export const apiInstance = () => {
  const defaultOptions = {
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use((config) => {
    return config;
  });

  return instance;
};
