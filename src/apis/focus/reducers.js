import t from './actionTypes'
import { OMNI_SEARCH } from '~/constants'

export default function focus(state = { kind: OMNI_SEARCH, id: null }, action) {
  switch (action.type) {
    case t.SET_FOCUS:
      return {
        kind: action.kind,
        id: action.id,
      }
    default:
      return state
  }
}
