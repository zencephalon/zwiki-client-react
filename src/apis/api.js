import { configureAPI } from 'redux-rest-reducer';

const apiMap = {
  stage: 'http://api.iluvu.ninja/',
  dev: 'http://localhost:8000/',
  prod: 'https://zwiki-api-rails-2jaxy.ondigitalocean.app/',
};

export const API_BASE = apiMap[ZWIKI_ENV];

const setAuthHeader = (headers) => {
  const token = localStorage.getItem('token');
  return { ...headers, Authorization: `${token}` };
};

const api = configureAPI(API_BASE, { headerFunc: setAuthHeader });

export default api;
