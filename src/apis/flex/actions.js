import t from './actionTypes'

export const CYCLE_DOWN = () => ({
  type: t.CYCLE_DOWN,
})

export const CYCLE_UP = () => ({
  type: t.CYCLE_UP,
})

export const TOGGLE_LINK = ({ nodeId }) => ({
  type: t.TOGGLE_LINK,
  nodeId,
})

export const OPEN_NODE = ({ nodeId }) => ({
  type: t.OPEN_NODE,
  nodeId,
})

export const FOCUS = ({ columnId, rowId, type }) => ({
  type: t.FOCUS,
  columnId,
  rowId,
  focusType: type,
})
