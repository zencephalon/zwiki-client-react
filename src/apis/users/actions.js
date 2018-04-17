import t from './actionTypes'
import { NAME } from './constants'
import * as api from './api'
import { actions } from 'redux-rest-reducer'

const acts = actions.actionFactory(NAME, t, api)

export const {
  action,
  DELETE,
  GET,
  POST,
  PUT,
  INDEX,
} = acts