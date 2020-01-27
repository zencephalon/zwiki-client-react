import { EDITOR } from "~/constants";
import { defVal } from "~/helpers";
import t from "./actionTypes";

const makeColumn = (nodes = []) => ({
  focusedRowId: 0,
  nodes
});

const startState = {
  columns: [makeColumn(), makeColumn(), makeColumn(), makeColumn()],
  visibleColumnIds: [0, 1],
  focusedColumnId: 0,
  focusType: EDITOR
};

export default function focus(state = startState, action) {
  const { focusedColumnId, columns, visibleColumnIds } = state;
  const nextColumnId = focusedColumnId + 1;
  const leftColumnId = focusedColumnId - 1;
  const nextColumn = columns[nextColumnId];
  const focusedColumn = columns[focusedColumnId];

  const focusedRowId = focusedColumn.focusedRowId;
  const upNextRowId =
    focusedRowId <= 0 ? focusedColumn.nodes.length - 1 : focusedRowId - 1;
  const downNextRowId =
    focusedRowId >= focusedColumn.nodes.length - 1 ? 0 : focusedRowId + 1;

  switch (action.type) {
    case t.SLIDE_RIGHT:
      if (visibleColumnIds.includes(nextColumnId)) {
        return {
          ...state,
          focusedColumnId: nextColumnId
        };
      }
      return {
        ...state,
        columns: nextColumn ? columns : [...columns, makeColumn()],
        focusedColumnId: nextColumnId,
        visibleColumnIds: [
          ...visibleColumnIds.slice(1, visibleColumnIds.length),
          nextColumnId
        ]
      };
    case t.SLIDE_LEFT:
      if (focusedColumnId === 0) {
        return state;
      }
      if (visibleColumnIds.includes(leftColumnId)) {
        return {
          ...state,
          focusedColumnId: leftColumnId
        };
      }
      return {
        ...state,
        focusedColumnId: leftColumnId,
        visibleColumnIds: [
          leftColumnId,
          ...visibleColumnIds.slice(0, visibleColumnIds.length - 1)
        ]
      };
    case t.CYCLE_UP:
      return {
        ...state,
        columns: Object.assign([], columns, {
          [focusedColumnId]: { ...focusedColumn, focusedRowId: upNextRowId }
        })
      };
    case t.CYCLE_DOWN:
      return {
        ...state,
        columns: Object.assign([], columns, {
          [focusedColumnId]: { ...focusedColumn, focusedRowId: downNextRowId }
        })
      };
    case t.SHIFT_DOWN:
      return {
        ...state,
        columns: Object.assign([], columns, {
          [focusedColumnId]: {
            ...focusedColumn,
            focusedRowId: downNextRowId,
            nodes: (nodes => {
              const newNodes = [...nodes];
              const a = newNodes[focusedRowId];
              const b = newNodes[downNextRowId];
              newNodes[focusedRowId] = b;
              newNodes[downNextRowId] = a;
              return newNodes;
            })(focusedColumn.nodes)
          }
        })
      };
    case t.SHIFT_UP:
      return {
        ...state,
        columns: Object.assign([], columns, {
          [focusedColumnId]: {
            ...focusedColumn,
            focusedRowId: downNextRowId,
            nodes: (nodes => {
              const newNodes = [...nodes];
              const a = newNodes[focusedRowId];
              const b = newNodes[upNextRowId];
              newNodes[focusedRowId] = b;
              newNodes[downNextRowId] = a;
              return newNodes;
            })(focusedColumn.nodes)
          }
        })
      };
    case t.FOCUS:
      return {
        ...state,
        focusedColumnId: defVal(action.columnId, state.focusedColumnId),
        columns: Object.assign([], columns, {
          [focusedColumnId]: {
            ...focusedColumn,
            focusedRowId: defVal(action.rowId, focusedRowId)
          }
        }),
        focusType: defVal(action.focusType, state.focusType)
      };
    case t.OPEN_NODE:
      return {
        ...state,
        columns: [
          ...columns.slice(0, focusedColumnId),
          makeColumn([action.nodeId, ...focusedColumn.nodes]),
          ...columns.slice(nextColumnId, columns.length)
        ]
      };
    case t.TOGGLE_LINK:
      if (!nextColumn) {
        return {
          ...state,
          columns: [...columns, makeColumn([action.nodeId])],
          visibleColumnIds: visibleColumnIds.includes(nextColumnId)
            ? visibleColumnIds
            : [...visibleColumnIds.slice(1), nextColumnId]
        };
      }
      if (!nextColumn.nodes.includes(action.nodeId)) {
        return {
          ...state,
          columns: Object.assign([], columns, {
            [nextColumnId]: {
              ...nextColumn,
              nodes: [action.nodeId, ...nextColumn.nodes]
            }
          }),
          visibleColumnIds: visibleColumnIds.includes(nextColumnId)
            ? visibleColumnIds
            : [...visibleColumnIds.slice(1), nextColumnId]
        };
      }
      return {
        ...state,
        columns: Object.assign([], columns, {
          [nextColumnId]: {
            ...nextColumn,
            nodes: nextColumn.nodes.filter(id => id !== action.nodeId)
          }
        })
      };
    case t.REFOCUS:
      return {
        columns: [makeColumn([action.nodeId]), makeColumn()],
        visibleColumnIds: [0, 1],
        focusedColumnId: 0,
        focusType: EDITOR
      };
    case t.ONE_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId]
      };
    case t.TWO_COLUMN:
      return {
        ...state,
        visibleColumnIds: [focusedColumnId, focusedColumnId + 1]
      };
    case t.THREE_COLUMN:
      return {
        ...state,
        visibleColumnIds: [
          focusedColumnId,
          focusedColumnId + 1,
          focusedColumnId + 2
        ]
      };
    case t.FOUR_COLUMN:
      return {
        ...state,
        visibleColumnIds: [
          focusedColumnId,
          focusedColumnId + 1,
          focusedColumnId + 2,
          focusedColumnId + 3
        ]
      };
    default:
      return state;
  }
}
