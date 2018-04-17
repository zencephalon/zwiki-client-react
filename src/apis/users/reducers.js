import { http } from 'redux-rest-reducer'
import t from './actionTypes'

const httpReducer = http.reducerFactory(t)

export default function reducer(state = {}, action) {
  return {
    http: httpReducer(state.http, action),
  }
}
