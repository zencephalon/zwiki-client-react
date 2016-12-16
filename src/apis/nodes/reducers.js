import t from './actionTypes'

import { http } from 'redux-rest-reducer'

const httpReducer = http.reducerFactory(t)

function queryReducer(state = { q: '' }, action) {
  switch (action.type) {
    case t.SET_QUERY:
      return {
        ...state,
        q: action.q,
      }
  }
}

export default function reducer(state = {}, action) {
  return {
    http: httpReducer(state.http, action),
    query: queryReducer(state.query, action),
  }
}
