import { EDITOR } from '~/constants'
import { defVal } from '~/helpers'
import t from './actionTypes'

const startState = {
  columns: [[], [], [], []],
  visibleColumnIds: [0, 1],
  focusedColumnId: 0,
  focusedRowId: 0,
  focusType: EDITOR,
}

export default function focus(state = startState, action) {
  const {
    focusedColumnId,
    columns,
    visibleColumnIds,
    focusedRowId,
  } = state
  const nextColumnId = focusedColumnId + 1
  const leftColumnId = focusedColumnId - 1
  const nextColumn = columns[nextColumnId]
  const focusedColumn = columns[focusedColumnId]
  const rowsInLeftColumn = state.columns[leftColumnId] ? state.columns[leftColumnId].length : 0
  const rowsInRightColumn = state.columns[nextColumnId] ? state.columns[nextColumnId].length : 0
  const leftNextRowId = focusedRowId >= rowsInLeftColumn ?
    rowsInLeftColumn - 1 :
    focusedRowId
  const rightNextRowId = focusedRowId >= rowsInRightColumn ?
    rowsInRightColumn - 1 :
    focusedRowId
  const upNextRowId = focusedRowId <= 0 ? focusedColumn.length - 1 :
          focusedRowId - 1
  const downNextRowId = focusedRowId >= focusedColumn.length - 1 ? 0 :
          focusedRowId + 1

  switch (action.type) {
    case t.SLIDE_RIGHT:
      if (visibleColumnIds.includes(nextColumnId)) {
        return {
          ...state,
          focusedColumnId: nextColumnId,
          focusedRowId: rightNextRowId,
        }
      }
      return {
        ...state,
        columns: nextColumn ? columns : [...columns, []],
        focusedColumnId: nextColumnId,
        visibleColumnIds: [
          ...visibleColumnIds.slice(1, visibleColumnIds.length),
          nextColumnId,
        ],
        focusedRowId: rightNextRowId,
      }
    case t.SLIDE_LEFT:
      if (focusedColumnId === 0) {
        return state
      }
      if (visibleColumnIds.includes(leftColumnId)) {
        return {
          ...state,
          focusedColumnId: leftColumnId,
          focusedRowId: leftNextRowId,
        }
      }
      return {
        ...state,
        focusedColumnId: leftColumnId,
        visibleColumnIds: [
          leftColumnId,
          ...visibleColumnIds.slice(0, visibleColumnIds.length - 1),
        ],
        focusedRowId: leftNextRowId,
      }
    case t.CYCLE_UP:
      return {
        ...state,
        focusedRowId: upNextRowId,
      }
    case t.CYCLE_DOWN:
      return {
        ...state,
        focusedRowId: downNextRowId,
      }
    case t.SHIFT_DOWN:
      return {
        ...state,
        focusedRowId: downNextRowId,
        columns: [
          ...columns.slice(0, focusedColumnId),
          ((col) => {
            const nc = [...col]
            const a = nc[focusedRowId]
            const b = nc[downNextRowId]
            nc[focusedRowId] = b
            nc[downNextRowId] = a
            return nc
          })(columns[focusedColumnId]),
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    case t.SHIFT_UP:
      return {
        ...state,
        focusedRowId: upNextRowId,
        columns: [
          ...columns.slice(0, focusedColumnId),
          ((col) => {
            const nc = [...col]
            const a = nc[focusedRowId]
            const b = nc[upNextRowId]
            nc[focusedRowId] = b
            nc[upNextRowId] = a
            return nc
          })(columns[focusedColumnId]),
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    case t.FOCUS:
      return {
        ...state,
        focusedColumnId: defVal(action.columnId, state.focusedColumnId),
        focusedRowId: defVal(action.rowId, state.focusedRowId),
        focusType: defVal(action.focusType, state.focusType),
      }
    case t.OPEN_NODE:
      return {
        ...state,
        columns: [
          ...columns.slice(0, focusedColumnId),
          [
            action.nodeId,
            ...focusedColumn.filter(id => id !== action.nodeId),
          ],
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    case t.TOGGLE_LINK:
      if (!nextColumn) {
        return {
          ...state,
          columns: [
            ...columns,
            [action.nodeId],
          ],
          // visibleColumnIds: visibleColumnIds.includes(nextColumnId) ?
          //   visibleColumnIds :
          //   [...visibleColumnIds.slice(1), nextColumnId],
        }
      }
      if (!nextColumn.includes(action.nodeId)) {
        return {
          ...state,
          columns: [
            ...columns.slice(0, nextColumnId),
            [action.nodeId, ...nextColumn],
            ...columns.slice(nextColumnId + 1, columns.length),
          ],
          // visibleColumnIds: visibleColumnIds.includes(nextColumnId) ?
          //   visibleColumnIds :
          //   [...visibleColumnIds.slice(1), nextColumnId],
        }
      }
      return {
        ...state,
        columns: [
          ...columns.slice(0, nextColumnId),
          nextColumn.filter(id => id !== action.nodeId),
          ...columns.slice(nextColumnId + 1, columns.length),
        ],
      }
    case t.REFOCUS:
      return {
        columns: [[action.nodeId], []],
        visibleColumnIds: [0, 1],
        focusedColumnId: 0,
        focusedRowId: 0,
        focusType: EDITOR,
      }
    case t.ONE_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId],
      }
    case t.TWO_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId, focusedColumnId + 1],
      }
    case t.THREE_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId, focusedColumnId + 1, focusedColumnId + 2],
      }
    case t.FOUR_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId, focusedColumnId + 1,
          focusedColumnId + 2, focusedColumnId + 3],
      }
    default:
      return state
  }
}
