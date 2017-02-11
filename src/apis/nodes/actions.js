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

export const OMNI_QUERY = q => ({
  type: t.OMNI_QUERY,
  q,
})

export const LINK_QUERY = q => ({
  type: t.LINK_QUERY,
  q,
})
