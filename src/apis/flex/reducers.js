import { EDITOR } from '~/constants'
import { defVal } from '~/helpers'
import t from './actionTypes'

const startState = {
  columns: [[1], []],
  visibleColumnIds: [0, 1],
  focusedColumnId: 0,
  focusedRowId: 0,
  focusType: EDITOR,
}

export default function focus(state = startState, action) {
  const {
    focusedColumnId,
    columns,
  } = state
  const nextColumn = focusedColumnId + 1
  switch (action.type) {
    case t.FOCUS:
      return {
        ...state,
        focusedColumnId: defVal(action.columnId, state.focusedColumnId),
        focusedRowId: defVal(action.rowId, state.focusedRowId),
        focusType: defVal(action.focusType, state.focusType),
      }
    case t.OPEN_NODE:

    case t.TOGGLE_LINK:
      if (!columns[nextColumn]) {
        return {
          ...state,
          columns: [
            ...columns,
            [action.nodeId],
          ],
        }
      }
      if (!columns[nextColumn].includes(action.nodeId)) {
        return {
          ...state,
          columns: [
            ...columns.slice(0, nextColumn),
            [...columns[nextColumn], action.nodeId],
            ...columns.slice(nextColumn, columns.length),
          ],
        }
      }
      return {
        ...state,
        columns: [
          ...columns.slice(0, nextColumn),
          columns[nextColumn].filter(id => id !== action.nodeId),
          ...columns.slice(nextColumn, columns.length),
        ],
      }
    default:
      return state
  }
}
