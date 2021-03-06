import { Modifier, EditorState, Entity } from 'draft-js'
import getSearchText from '../utils/getSearchText'

const addMention = (editorState, mention, replaceTemplate, mentionTrigger, entityMutability) => {
  const currentSelectionState = editorState.getSelection()
  const { begin, end } = getSearchText(editorState, currentSelectionState, mentionTrigger)

  // get selection of the @mention search text
  const mentionTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  })

  const mentionReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    mentionTextSelection,
    replaceTemplate({ name: mention.get('name'), id: mention.get('id') }),
  )

  // If the mention is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  // const blockKey = mentionTextSelection.getAnchorKey()
  // const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength()
  // if (blockSize === end) {
  //   mentionReplacedContent = Modifier.insertText(
  //     mentionReplacedContent,
  //     mentionReplacedContent.getSelectionAfter(),
  //     ' ',
  //   )
  // }

  const newEditorState = EditorState.push(
    editorState,
    mentionReplacedContent,
    'insert-mention',
  )
  return EditorState.forceSelection(newEditorState, mentionReplacedContent.getSelectionAfter())
}

export default addMention
