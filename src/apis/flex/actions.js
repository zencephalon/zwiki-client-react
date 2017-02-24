import t from './actionTypes'

export const CYCLE_DOWN = () => ({
  type: t.CYCLE_DOWN,
})

export const CYCLE_UP = () => ({
  type: t.CYCLE_UP,
})

export const SHIFT_DOWN = () => ({
  type: t.SHIFT_DOWN,
})

export const SHIFT_UP = () => ({
  type: t.SHIFT_UP,
})

export const SLIDE_RIGHT = () => ({
  type: t.SLIDE_RIGHT,
})

export const SLIDE_LEFT = () => ({
  type: t.SLIDE_LEFT,
})

export const TOGGLE_LINK = ({ nodeId }) => ({
  type: t.TOGGLE_LINK,
  nodeId,
})

export const OPEN_NODE = ({ nodeId }) => ({
  type: t.OPEN_NODE,
  nodeId,
})

export const REFOCUS = ({ nodeId }) => ({
  type: t .REFOCUS,
  nodeId,
})

export const FOCUS = ({ columnId, rowId, type }) => ({
  type: t.FOCUS,
  columnId,
  rowId,
  focusType: type,
})
