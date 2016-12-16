import { http } from 'redux-rest-reducer'
import t from './actionTypes'

const httpReducer = http.reducerFactory(t)

function queryReducer(state = { q: '' }, action) {
  switch (action.type) {
    case t.SET_QUERY:
      return {
        ...state,
        q: action.q,
      }
    default:
      return state
  }
}

export default function reducer(state = {}, action) {
  return {
    http: httpReducer(state.http, action),
    query: queryReducer(state.query, action),
  }
}
