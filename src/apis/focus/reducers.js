import t from './actionTypes'
import { OMNI_SEARCH, EDITOR, ROOT } from '~/constants'

export default function focus(state = { kind: EDITOR, id: ROOT, source: null, lastId: null }, action) {
  switch (action.type) {
    case t.SET_FOCUS:
      return {
        kind: action.kind,
        id: action.id || state.lastId,
        source: action.source,
        lastId: state.id,
      }
    default:
      return state
  }
}
