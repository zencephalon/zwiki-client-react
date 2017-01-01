import {
  EditorState,
  SelectionState,
  AtomicBlockUtils,
  Entity,
} from 'draft-js'
import getRangesForDraftEntity from 'draft-js/lib/getRangesForDraftEntity'

export function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

export function insertPortal(editorState, id) {
  const entityKey = Entity.create(
    'PORTAL',
    'MUTABLE',
    { id },
  )

  return {
    editorState: AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '\u200B'),
    entityKey,
  }
}

export function moveToEnd(editorState, text) {
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const startOffset = selection.getStartOffset()
  const content = editorState.getCurrentContent()
  const block = content.getBlockForKey(key)
  const blockText = block.getText()

  let offset = startOffset
  const textLength = blockText.length

  while (
    offset <= textLength &&
    text.includes(blockText.slice(startOffset, offset))
  ) {
    offset += 1
  }

  offset -= 1

  const newSelection = SelectionState.createEmpty(key).merge({
    focusKey: key,
    anchorKey: key,
    focusOffset: offset,
    anchorOffset: offset,
  })

  return EditorState.forceSelection(editorState, newSelection)
}

export const getEntitySelectionState = (contentState, entityKey) => {
  contentState.getBlockMap().forEach(block => {
    console.log('got a block', block)
  })
  // const block = contentState.getBlockForKey(selectionKey)
  // const blockKey = block.getKey()

  // let entitySelection
  // getRangesForDraftEntity(block, entityKey).forEach((range) => {
  //   if (range.start <= selectionOffset && selectionOffset <= range.end) {
  //     entitySelection = new SelectionState({
  //       anchorOffset: range.start,
  //       anchorKey: blockKey,
  //       focusOffset: range.end,
  //       focusKey: blockKey,
  //       isBackward: false,
  //       hasFocus: selectionState.getHasFocus(),
  //     })
  //   }
  // })
  // return entitySelection
}
