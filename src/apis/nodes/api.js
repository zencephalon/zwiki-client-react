import api from '~/lib/api'

const endpoint = 'nodes'
const indexParam = null

const template = {}

export const {
  POST,
  GET,
  DELETE,
  PUT,
  INDEX,
} = api.genericApiFactory(endpoint, indexParam, template)
