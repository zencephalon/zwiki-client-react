import api from '~/apis/api'
import { NAME } from './constants'

const indexParam = 'q'

const template = {}

export const {
  POST,
  GET,
  DELETE,
  PUT,
  INDEX,
} = api.genericApiFactory(NAME, indexParam, template)
