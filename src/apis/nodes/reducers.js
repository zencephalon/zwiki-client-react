import { http } from 'redux-rest-reducer'
import t from './actionTypes'
import Trie from '~/lib/trie'

const httpReducer = http.reducerFactory(t)

function queryReducer(state = { omniQ: '', linkQ: '' }, action) {
  switch (action.type) {
    case t.OMNI_QUERY:
      return {
        ...state,
        omniQ: action.q,
      }
    case t.LINK_QUERY:
      return {
        ...state,
        linkQ: action.q,
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
