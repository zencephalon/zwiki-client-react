import t from './actionTypes'

export const RECEIVE_INDEX = index => ({
  type: t.RECEIVE_INDEX,
  index,
})

export const UPDATE_ENTRY = (oldName, newName) => ({
  type: t.UPDATE_ENTRY,
  oldName,
  newName
})
