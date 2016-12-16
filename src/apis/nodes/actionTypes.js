import { NAME } from './constants'
import { actionTypes } from 'redux-rest-reducer'

const types = actionTypes(NAME)
types.SET_QUERY = `${NAME}/SET_QUERY`

export default types
