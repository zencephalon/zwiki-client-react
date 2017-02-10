import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'
import focus from '~/apis/focus/reducers'
import flex from '~/apis/flex/reducers'

const rootReducer = combineReducers({
  nodes,
  focus,
  flex,
  routing: routerReducer,
})

export default rootReducer
