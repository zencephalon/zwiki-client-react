import _ from 'lodash';
import { EDITOR } from '~/constants';
import { defVal } from '~/helpers';
import t from './actionTypes';

const makeColumn = (nodes = []) => ({
  focusedRowId: 0,
  nodes,
});

const startState = {
  columns: [
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
    makeColumn(),
  ],
  leftmostVisibleColumnId: 0,
  visibleColumns: 2,
  focusedColumnId: 0,
  focusType: EDITOR,
};

const findNode = (columns, nodeId) => {
  const columnNodeRowIndex = columns.map((col) => _.indexOf(col.nodes, nodeId));
  const columnIndex = _.findIndex(columnNodeRowIndex, (i) => i >= 0);
  if (columnIndex >= 0) {
    return { rowId: columnNodeRowIndex[columnIndex], columnId: columnIndex };
  }

  return null;
};

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
    visibleColumns,
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
    leftmostVisibleColumnId,
    visibleColumns,
  } = sharedValues(state);
  let newLeftmost = leftmostVisibleColumnId;

  if (leftmostVisibleColumnId + visibleColumns < columnId) {
    newLeftmost = columnId - visibleColumns + 1;
  }
  if (columnId < leftmostVisibleColumnId) {
    newLeftmost = columnId;
  }
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
    leftmostVisibleColumnId: newLeftmost,
  };
}

function openNode(state, nodeId) {
  const {
    focusedColumnId,
    columns,
    nextColumnId,
    focusedColumn,
  } = sharedValues(state);
  const nodePos = findNode(columns, nodeId);

  if (nodePos) {
    return focus(state, nodePos.rowId, nodePos.columnId, EDITOR);
  }

  return {
    ...state,
    columns: [
      ...columns.slice(0, focusedColumnId),
      makeColumn([nodeId, ...focusedColumn.nodes]),
      ...columns.slice(nextColumnId, columns.length),
    ],
  };
}

function toggleLink(state, nodeId) {
  const {
    nextColumn,
    leftmostVisibleColumnId,
    columns,
    nextColumnWithinBounds,
    nextColumnId,
  } = sharedValues(state);
  const nodePos = findNode(columns, nodeId);

  if (nodePos && !nextColumn.nodes.includes(nodeId)) {
    return focus(state, nodePos.rowId, nodePos.columnId, EDITOR);
  }

  if (!nextColumn) {
    return {
      ...state,
      columns: [...columns, makeColumn([nodeId])],
      leftmostVisibleColumnId:
        leftmostVisibleColumnId + (nextColumnWithinBounds ? 0 : 1),
    };
  }
  if (!nextColumn.nodes.includes(nodeId)) {
    return {
      ...state,
      columns: Object.assign([], columns, {
        [nextColumnId]: {
          ...nextColumn,
          nodes: [nodeId, ...nextColumn.nodes],
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
        nodes: nextColumn.nodes.filter((id) => id !== nodeId),
      },
    }),
  };
}

function refocus(state, nodeId) {
  return {
    ...state,
    columns: [
      makeColumn([nodeId]),
      ...Array(9)
        .fill(0)
        .map(() => makeColumn()),
    ],
    leftmostVisibleColumnId: 0,
    focusedColumnId: 0,
    focusType: EDITOR,
  };
}

function focusNode(state, nodeId) {
  const { columns } = sharedValues(state);

  const nodePos = findNode(columns, nodeId);

  if (nodePos) {
    return focus(state, nodePos.rowId, nodePos.columnId, EDITOR);
  }

  return state;
}

function setVisibleColumns(state, num) {
  return {
    ...state,
    visibleColumns: num,
  };
}

export default function flex(state = startState, action) {
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
      return action.nodeId
        ? focusNode(state, action.nodeId)
        : focus(state, action.rowId, action.columnId, action.focusType);
    case t.OPEN_NODE:
      return openNode(state, action.nodeId);
    case t.TOGGLE_LINK:
      return toggleLink(state, action.nodeId);
    case t.REFOCUS:
      return refocus(state, action.nodeId);
    case t.SET_VISIBLE_COLUMNS:
      return setVisibleColumns(state, action.num);
    default:
      return state;
  }
}
