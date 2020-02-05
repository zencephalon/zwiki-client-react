import { EDITOR } from "~/constants";
import { defVal } from "~/helpers";
import t from "./actionTypes";

const makeColumn = (nodes = []) => ({
  focusedRowId: 0,
  nodes
});

const startState = {
  columns: [makeColumn(), makeColumn(), makeColumn(), makeColumn()],
  leftmostVisibleColumnId: 0,
  visibleColumns: 2,
  focusedColumnId: 0,
  focusType: EDITOR
};

export default function focus(state = startState, action) {
  const {
    focusedColumnId,
    columns,
    leftmostVisibleColumnId,
    visibleColumns
  } = state;
  const nextColumnId = focusedColumnId + 1;
  const leftColumnId = focusedColumnId - 1;
  const nextColumn = columns[nextColumnId];
  const focusedColumn = columns[focusedColumnId];

  const focusedRowId = focusedColumn.focusedRowId;
  const upNextRowId =
    focusedRowId <= 0 ? focusedColumn.nodes.length - 1 : focusedRowId - 1;
  const downNextRowId =
    focusedRowId >= focusedColumn.nodes.length - 1 ? 0 : focusedRowId + 1;

  const nextColumnWithinBounds =
    leftmostVisibleColumnId + visibleColumns > nextColumnId;

  switch (action.type) {
    case t.SLIDE_RIGHT:
      if (nextColumnWithinBounds) {
        return {
          ...state,
          focusedColumnId: nextColumnId
        };
      }
      return {
        ...state,
        columns: nextColumn ? columns : [...columns, makeColumn()],
        focusedColumnId: nextColumnId,
        leftmostVisibleColumnId: leftmostVisibleColumnId + 1
      };
    case t.SLIDE_LEFT:
      if (focusedColumnId === 0) {
        return state;
      }
      if (leftmostVisibleColumnId <= leftColumnId) {
        return {
          ...state,
          focusedColumnId: leftColumnId
        };
      }
      return {
        ...state,
        focusedColumnId: leftColumnId,
        leftmostVisibleColumnId: leftColumnId
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
          leftmostVisibleColumnId:
            leftmostVisibleColumnId + (nextColumnWithinBounds ? 0 : 1)
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
          leftmostVisibleColumnId:
            leftmostVisibleColumnId + (nextColumnWithinBounds ? 0 : 1)
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
        ...state,
        columns: [
          makeColumn([action.nodeId]),
          ...Array(visibleColumns - 1)
            .fill(0)
            .map(_a => makeColumn())
        ],
        leftmostVisibleColumnId: 0,
        focusedColumnId: 0,
        focusType: EDITOR
      };
    case t.ONE_COLUMN:
      return {
        ...state,
        visibleColumns: 1
      };
    case t.TWO_COLUMN:
      return {
        ...state,
        visibleColumns: 2
      };
    case t.THREE_COLUMN:
      return {
        ...state,
        visibleColumns: 3
      };
    case t.FOUR_COLUMN:
      return {
        ...state,
        visibleColumns: 4
      };
    default:
      return state;
  }
}
