import t from './actionTypes'

import { http } from 'redux-rest-reducer'

const httpReducer = http.reducerFactory(t)

export default function reducer(state = {}, action) {
  return {
    http: httpReducer(state.http, action),
  }
}
