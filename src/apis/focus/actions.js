import t from './actionTypes'

export const SET_FOCUS = (kind, id, source) => ({
  type: t.SET_FOCUS,
  kind,
  id,
  source,
})
