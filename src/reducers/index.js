import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'
import focus from '~/apis/focus/reducers'

const rootReducer = combineReducers({
  nodes,
  focus,
  routing: routerReducer,
})

export default rootReducer
