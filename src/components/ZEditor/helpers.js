import {
  EditorState,
  SelectionState,
  Modifier,
  CharacterMetadata,
  ContentBlock,
  BlockMapBuilder,
} from 'draft-js'
import getRangesForDraftEntity from 'draft-js/lib/getRangesForDraftEntity'
import DraftModifier from 'draft-js/lib/DraftModifier'
import generateRandomKey from 'draft-js/lib/generateRandomKey'

import { List, Repeat } from 'immutable'

export function insertAtomicBlock(editorState, entityKey, character) {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()

  const afterRemoval = contentState
  // const afterRemoval = DraftModifier.removeRange(
  //   contentState,
  //   selectionState,
  //   'backward',
  // )

  const targetSelection = afterRemoval.getSelectionAfter()
  const afterSplit = DraftModifier.splitBlock(afterRemoval, targetSelection)
  const insertionTarget = afterSplit.getSelectionAfter()

  console.log({ afterRemoval, afterSplit, insertionTarget })

  const asAtomicBlock = DraftModifier.setBlockType(
    afterSplit,
    insertionTarget,
    'atomic',
  )

  const charData = CharacterMetadata.create({ entity: entityKey })

  const fragmentArray = [
    new ContentBlock({
      key: generateRandomKey(),
      type: 'atomic',
      text: character,
      characterList: List(Repeat(charData, character.length)),
    }),
  ]

  const fragment = BlockMapBuilder.createFromArray(fragmentArray)

  const withAtomicBlock = DraftModifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment,
  )

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true),
  })

  return EditorState.push(editorState, newContent, 'insert-fragment')
}

export function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

export function findNextMatch(editorState, regex) {
  let currentBlockFound = false
  const selection = editorState.getSelection()
  const endKey = selection.getEndKey()
  const endOffset = selection.getEndOffset()
  const content = editorState.getCurrentContent()

  let nextMatch = null
  let firstMatchFromTop = null

  for (const entry of content.getBlockMap().entries()) {
    const [k, block] = entry
    const text = block.getText()
    let searchText = text

    if (k === endKey) {
      currentBlockFound = true
      searchText = text.slice(endOffset)
    }
    const match = regex.exec(searchText)
    if (match) {
      console.log('got match')
      const matchObj = { k, start: match.index, length: match[0].length }
      if (!firstMatchFromTop) {
        console.log('setting first from top')
        firstMatchFromTop = matchObj
      }
      if (currentBlockFound) {
        nextMatch = matchObj
        break
      }
    }

    console.log({ k, text })
  }
  return nextMatch || firstMatchFromTop || { k: null, start: null, length: null }
}

export function selectNextMatch(editorState, regex) {
  const { k, start, length } = findNextMatch(editorState, regex)
  if (k) {
    const selectionState = SelectionState.createEmpty(k).merge({
      focusKey: k,
      anchorKey: k,
      anchorOffset: start,
      focusOffset: start + length,
    })
    return EditorState.forceSelection(editorState, selectionState)
  }
  return editorState
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
  let entitySelection
  contentState.getBlockMap().forEach((block) => {
    if (entitySelection) {
      return
    }
    try {
      getRangesForDraftEntity(block, entityKey).forEach((range) => {
        entitySelection = new SelectionState({
          anchorOffset: range.start,
          anchorKey: block.getKey(),
          focusOffset: range.end,
          focusKey: block.getKey(),
          isBackward: false,
          hasFocus: false,
        })
      })
    } catch (e) {
    }
  })
  return entitySelection
}

export const removeEntity = (editorState, entityKey) => {
  const content = editorState.getCurrentContent()
  const entitySelection = getEntitySelectionState(content, entityKey)
  return EditorState.push(
      editorState,
      Modifier.removeRange(content, entitySelection, 'forward'),
      'remove-range')
}
