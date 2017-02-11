import t from './actionTypes'

export const TOGGLE_LINK = ({ nodeId }) => ({
  type: t.TOGGLE_LINK,
  nodeId,
})

export const FOCUS = ({ columnId, rowId, type }) => ({
  type: t.FOCUS,
  columnId,
  rowId,
  focusType: type,
})
