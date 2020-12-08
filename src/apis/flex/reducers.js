import _ from 'lodash';
import { EDITOR } from '~/constants';
import { defVal } from '~/helpers';
import t from './actionTypes';

const makeColumn = (nodes = []) => ({
  focusedRowId: 0,
  nodes,
});

const startState = {
  columns: [makeColumn(), makeColumn(), makeColumn(), makeColumn()],
  leftmostVisibleColumnId: 0,
  visibleColumns: 2,
  focusedColumnId: 0,
  focusType: EDITOR,
};

// const findNode = (columns) => {
//   const columnNodeRowIndex = columns.map((col) =>
//     _.indexOf(col.nodes, action.nodeId)
//   );
//   const columnIndex = _.indexOf(columnNodeIndex, (i) => i >= 0);
//   if (columnIndex) {
//     return { rowId: columnNodeRowIndex[columnIndex], columnId: columnIndex };
//   }

//   return null;
// };

// TODO: refactor this by pulling out subfunctions so that I can re-use logic between actions
// I need this in order to properly handle focusing an already open node instead of re-opening.

function sharedValues(state) {
  const {
    focusedColumnId,
    columns,
    leftmostVisibleColumnId,
    visibleColumns,
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

  return {
    nextColumnId,
    leftColumnId,
    nextColumn,
    focusedColumn,
    focusedColumnId,
    focusedRowId,
    upNextRowId,
    downNextRowId,
    nextColumnWithinBounds,
    leftmostVisibleColumnId,
    columns,
  };
}

function slideRight(state) {
  const {
    nextColumnWithinBounds,
    nextColumnId,
    nextColumn,
    leftmostVisibleColumnId,
    columns,
  } = sharedValues(state);

  if (nextColumnWithinBounds) {
    return {
      ...state,
      focusedColumnId: nextColumnId,
    };
  }
  return {
    ...state,
    columns: nextColumn ? columns : [...columns, makeColumn()],
    focusedColumnId: nextColumnId,
    leftmostVisibleColumnId: leftmostVisibleColumnId + 1,
  };
}

function slideLeft(state) {
  const {
    focusedColumnId,
    leftmostVisibleColumnId,
    leftColumnId,
  } = sharedValues(state);
  if (focusedColumnId === 0) {
    return state;
  }
  if (leftmostVisibleColumnId <= leftColumnId) {
    return {
      ...state,
      focusedColumnId: leftColumnId,
    };
  }
  return {
    ...state,
    focusedColumnId: leftColumnId,
    leftmostVisibleColumnId: leftColumnId,
  };
}

function cycleUp(state) {
  const { columns, focusedColumnId, focusedColumn, upNextRowId } = sharedValues(
    state
  );
  return {
    ...state,
    columns: Object.assign([], columns, {
      [focusedColumnId]: { ...focusedColumn, focusedRowId: upNextRowId },
    }),
  };
}

function cycleDown(state) {
  const {
    columns,
    focusedColumnId,
    focusedColumn,
    downNextRowId,
  } = sharedValues(state);
  return {
    ...state,
    columns: Object.assign([], columns, {
      [focusedColumnId]: { ...focusedColumn, focusedRowId: downNextRowId },
    }),
  };
}

function shiftDown(state) {
  const {
    columns,
    downNextRowId,
    focusedRowId,
    focusedColumnId,
    focusedColumn,
  } = sharedValues(state);
  return {
    ...state,
    columns: Object.assign([], columns, {
      [focusedColumnId]: {
        ...focusedColumn,
        focusedRowId: downNextRowId,
        nodes: ((nodes) => {
          const newNodes = [...nodes];
          const a = newNodes[focusedRowId];
          const b = newNodes[downNextRowId];
          newNodes[focusedRowId] = b;
          newNodes[downNextRowId] = a;
          return newNodes;
        })(focusedColumn.nodes),
      },
    }),
  };
}

function shiftUp(state) {
  const {
    columns,
    downNextRowId,
    focusedRowId,
    focusedColumnId,
    focusedColumn,
    upNextRowId,
  } = sharedValues(state);
  return {
    ...state,
    columns: Object.assign([], columns, {
      [focusedColumnId]: {
        ...focusedColumn,
        focusedRowId: downNextRowId,
        nodes: ((nodes) => {
          const newNodes = [...nodes];
          const a = newNodes[focusedRowId];
          const b = newNodes[upNextRowId];
          newNodes[focusedRowId] = b;
          newNodes[downNextRowId] = a;
          return newNodes;
        })(focusedColumn.nodes),
      },
    }),
  };
}

function focus(state, rowId, columnId, focusType) {
  const {
    columns,
    focusedColumnId,
    focusedColumn,
    focusedRowId,
  } = sharedValues(state);
  return {
    ...state,
    focusedColumnId: defVal(columnId, state.focusedColumnId),
    columns: Object.assign([], columns, {
      [focusedColumnId]: {
        ...focusedColumn,
        focusedRowId: defVal(rowId, focusedRowId),
      },
    }),
    focusType: defVal(focusType, state.focusType),
  };
}

export default function focusReducer(state = startState, action) {
  const {
    focusedColumnId,
    columns,
    leftmostVisibleColumnId,
    visibleColumns,
  } = state;
  const nextColumnId = focusedColumnId + 1;
  const nextColumn = columns[nextColumnId];
  const focusedColumn = columns[focusedColumnId];

  const focusedRowId = focusedColumn.focusedRowId;

  const nextColumnWithinBounds =
    leftmostVisibleColumnId + visibleColumns > nextColumnId;

  switch (action.type) {
    case t.SLIDE_RIGHT:
      return slideRight(state);
    case t.SLIDE_LEFT:
      return slideLeft(state);
    case t.CYCLE_UP:
      return cycleUp(state);
    case t.CYCLE_DOWN:
      return cycleDown(state);
    case t.SHIFT_DOWN:
      return shiftDown(state);
    case t.SHIFT_UP:
      return shiftUp(state);
    case t.FOCUS:
      return focus(state, action.rowId, action.columnId, action.focusType);
    case t.OPEN_NODE:
      return {
        ...state,
        columns: [
          ...columns.slice(0, focusedColumnId),
          makeColumn([action.nodeId, ...focusedColumn.nodes]),
          ...columns.slice(nextColumnId, columns.length),
        ],
      };
    case t.TOGGLE_LINK:
      if (!nextColumn) {
        return {
          ...state,
          columns: [...columns, makeColumn([action.nodeId])],
          leftmostVisibleColumnId:
            leftmostVisibleColumnId + (nextColumnWithinBounds ? 0 : 1),
        };
      }
      if (!nextColumn.nodes.includes(action.nodeId)) {
        return {
          ...state,
          columns: Object.assign([], columns, {
            [nextColumnId]: {
              ...nextColumn,
              nodes: [action.nodeId, ...nextColumn.nodes],
            },
          }),
          leftmostVisibleColumnId:
            leftmostVisibleColumnId + (nextColumnWithinBounds ? 0 : 1),
        };
      }
      return {
        ...state,
        columns: Object.assign([], columns, {
          [nextColumnId]: {
            ...nextColumn,
            nodes: nextColumn.nodes.filter((id) => id !== action.nodeId),
          },
        }),
      };
    case t.REFOCUS:
      return {
        ...state,
        columns: [
          makeColumn([action.nodeId]),
          ...Array(visibleColumns - 1)
            .fill(0)
            .map((_a) => makeColumn()),
        ],
        leftmostVisibleColumnId: 0,
        focusedColumnId: 0,
        focusType: EDITOR,
      };
    case t.ONE_COLUMN:
      return {
        ...state,
        visibleColumns: 1,
      };
    case t.TWO_COLUMN:
      return {
        ...state,
        visibleColumns: 2,
      };
    case t.THREE_COLUMN:
      return {
        ...state,
        visibleColumns: 3,
      };
    case t.FOUR_COLUMN:
      return {
        ...state,
        visibleColumns: 4,
      };
    default:
      return state;
  }
}
