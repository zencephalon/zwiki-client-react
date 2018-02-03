import { configureAPI } from 'redux-rest-reducer'

const apiMap = {
  stage: 'http://api.iluvu.ninja/',
  dev: 'http://localhost:8000/',
  prod: 'http://zw-api.zencephalon.com/',
}

export const API_BASE = apiMap[ZWIKI_ENV]

const api = configureAPI(API_BASE)

export default api
