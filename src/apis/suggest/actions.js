import t from './actionTypes'

export const RECEIVE_INDEX = index => ({
  type: t.RECEIVE_INDEX,
  index,
})

export const UPDATE_ENTRY = (oldName, newName, entry) => ({
  type: t.UPDATE_ENTRY,
  oldName,
  newName,
  entry,
})

export const NEW_ENTRY = (name, id) => ({
  type: t.NEW_ENTRY,
  name,
  entry: { name, id },
})
