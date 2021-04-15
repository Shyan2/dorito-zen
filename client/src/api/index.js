import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:9001' });
const API = axios.create({ baseURL: process.env.REACT_APP_API_ROUTE });
// const SERVER_URL = process.env.REACT_APP_API_ROUTE;

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const getForgeToken2 = () => API.get('/api/forge/getToken');
