import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'

const rootReducer = combineReducers({
  nodes,
  routing: routerReducer,
})

export default rootReducer
