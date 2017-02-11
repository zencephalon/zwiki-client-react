import t from './actionTypes'

const startState = {
  columns: [[1, 2], [3, 4]],
  visible_columns: [0, 1],
  focused_column: 0,
}

export default function focus(state = startState, action) {
  switch (action.type) {
    default:
      return state
  }
}
