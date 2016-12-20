import t from './actionTypes'

export default function focus(state = { kind: null, id: null }, action) {
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
