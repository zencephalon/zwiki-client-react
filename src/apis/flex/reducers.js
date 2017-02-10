import t from './actionTypes'

const startState = {
  columns: [[], []],
  visible_columns: [0, 1],
  focused_column: 0,
}

export default function focus(state = startState, action) {
  switch (action.type) {
    default:
      return state
  }
}
