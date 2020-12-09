import Trie from '~/lib/trie';
import t from './actionTypes';

const trie = new Trie();

function suggestReducer(state = { trie }, action) {
  switch (action.type) {
    case t.RECEIVE_INDEX:
      action.index.forEach((entry) => {
        state.trie.add(entry.name, entry);
      });
      return state;
    case t.UPDATE_ENTRY:
      const { oldName, newName } = action;
      // why? toLowerCase?
      state.trie.remove(oldName);
      console.log({
        oldName,
        newName,
        contains: !state.trie.contains(newName),
      });
      if (!state.trie.contains(newName)) {
        state.trie.add(newName, action.entry);
      }
      return state;
    case t.NEW_ENTRY:
      state.trie.add(action.name, action.entry);
      return state;
    default:
      return state;
  }
}

export default suggestReducer;
