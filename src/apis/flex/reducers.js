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
    visibleColumnIds,
  } = state
  const nextColumnId = focusedColumnId + 1
  const leftColumnId = focusedColumnId - 1
  const nextColumn = columns[nextColumnId]
  const focusedColumn = columns[focusedColumnId]
  switch (action.type) {
    case t.SLIDE_RIGHT:
      if (visibleColumnIds.includes(nextColumnId)) {
        return {
          ...state,
          focusedColumnId: nextColumnId,
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
      }
    case t.SLIDE_LEFT:
      if (focusedColumnId === 0) {
        return state
      }
      if (visibleColumnIds.includes(leftColumnId)) {
        return {
          ...state,
          focusedColumnId: leftColumnId,
        }
      }
      return {
        ...state,
        focusedColumnId: leftColumnId,
        visibleColumnIds: [
          leftColumnId,
          ...visibleColumnIds.slice(0, visibleColumnIds.length - 1),
        ]
      }
    case t.CYCLE_DOWN:
      return {
        ...state,
        columns: [
          ...columns.slice(0, focusedColumnId),
          [
            focusedColumn[focusedColumn.length - 1],
            ...focusedColumn.slice(0, focusedColumn.length - 1),
          ],
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    case t.CYCLE_UP:
      return {
        ...state,
        columns: [
          ...columns.slice(0, focusedColumnId),
          [
            ...focusedColumn.slice(1, focusedColumn.length),
            focusedColumn[0],
          ],
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    case t.CYCLE_UP:
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
          visibleColumnIds: visibleColumnIds.includes(nextColumnId) ?
            visibleColumnIds :
            [...visibleColumnIds.slice(1), nextColumnId],
        }
      }
      if (!nextColumn.includes(action.nodeId)) {
        return {
          ...state,
          columns: [
            ...columns.slice(0, nextColumnId),
            [action.nodeId, ...nextColumn],
            ...columns.slice(nextColumnId, columns.length),
          ],
          visibleColumnIds: visibleColumnIds.includes(nextColumnId) ?
            visibleColumnIds :
            [...visibleColumnIds.slice(1), nextColumnId],
        }
      }
      return {
        ...state,
        columns: [
          ...columns.slice(0, nextColumnId),
          nextColumn.filter(id => id !== action.nodeId),
          ...columns.slice(nextColumnId, columns.length),
        ],
      }
    default:
      return state
  }
}
