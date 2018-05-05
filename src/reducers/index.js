import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import nodes from '~/apis/nodes/reducers'
import flex from '~/apis/flex/reducers'
import users from '~/apis/users/reducers'
import suggest from '~/apis/suggest/reducers'

const rootReducer = combineReducers({
  nodes,
  flex,
  users,
  suggest,
  routing: routerReducer,
})

export default rootReducer
