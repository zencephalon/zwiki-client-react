import Trie from '~/lib/trie'
import t from './actionTypes'

const trie = new Trie()

function suggestReducer(state = { trie }, action) {
  switch (action.type) {
    case t.RECEIVE_INDEX:
      action.index.forEach(entry => {
        state.trie.add(entry.name, entry)
      })
      return state
    case t.UPDATE_ENTRY:
      state.trie.remove(action.oldName)
      state.trie.add(action.newName, action.entry)
      return state
    case t.NEW_ENTRY:
      state.trie.add(action.name, action.entry)
    default:
      return state
  }
}

export default suggestReducer