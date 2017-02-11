import t from './actionTypes'
import { OMNI_SEARCH, EDITOR, ROOT } from '~/constants'
import { defVal } from '~/helpers'

const startState = {
  columns: [[1], []],
  visibleColumns: [0, 1],
  focusedColumn: 0,
  focusedRow: 0,
  focusType: EDITOR,
}

export default function focus(state = startState, action) {
  const {
    focusedColumn,
    columns,
  } = state
  const nextColumn = focusedColumn + 1
  switch (action.type) {
    case t.FOCUS:
      return {
        ...state,
        focusedRow: defVal(action.rowId, state.focusedRow),
        focusedColumn: defVal(action.columnId, state.focusedColumn),
        focusType: defVal(action.focusType, state.focusType),
      }
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
