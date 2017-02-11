import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'
import flex from '~/apis/flex/reducers'

const rootReducer = combineReducers({
  nodes,
  flex,
  routing: routerReducer,
})

export default rootReducer
