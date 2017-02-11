import { NAME } from './constants'
import { actionTypes } from 'redux-rest-reducer'

const types = actionTypes(NAME)
types.OMNI_QUERY = `${NAME}/OMNI_QUERY`
types.LINK_QUERY = `${NAME}/OMNI_LINK`

export default types
