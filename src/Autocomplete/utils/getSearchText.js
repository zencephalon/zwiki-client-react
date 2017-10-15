import getWordAt from './getWordAt'

const getSearchText = (editorState, selection, mentionTrigger) => {
  const anchorKey = selection.getAnchorKey()
  const anchorOffset = selection.getAnchorOffset()
  const currentContent = editorState.getCurrentContent()
  const currentBlock = currentContent.getBlockForKey(anchorKey)
  const blockText = currentBlock.getText()
  return getWordAt(blockText, anchorOffset, mentionTrigger)
}

export default getSearchText
