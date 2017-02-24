import { configureAPI } from 'redux-rest-reducer'

const apiMap = {
  stage: 'http://api.iluvu.ninja/',
  dev: 'http://localhost:8000/',
  prod: 'http://zw-api.zencephalon.com/',
}

const api = configureAPI(apiMap[ZWIKI_ENV])

export default api
