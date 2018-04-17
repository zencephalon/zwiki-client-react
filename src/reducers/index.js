import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'
import flex from '~/apis/flex/reducers'
import users from '~/apis/users/reducers'

const rootReducer = combineReducers({
  nodes,
  flex,
  users,
  routing: routerReducer,
})

export default rootReducer
