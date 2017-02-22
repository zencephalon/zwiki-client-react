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

import { LINK_REGEX, LINK_REGEX_NO_G } from '~/constants'

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

export function findPrevMatch(editorState, regex) {
  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const startOffset = selection.getStartOffset()
  const content = editorState.getCurrentContent()

  let prevMatch = null
  let firstMatchFromBottom = null

  for (const entry of content.getBlockMap().entries()) {
    const [k, block] = entry
    const text = block.getText()
    let searchText = text

    if (k === startKey) {
      // restrict to the text that comes before the selection
      searchText = text.slice(0, startOffset)
    }

    let lastMatch
    let match

    while ((match = regex.exec(searchText)) !== null) {
      lastMatch = match
    }

    if (lastMatch) {
      const matchObj = {
        k,
        start: lastMatch.index,
        length: lastMatch[0].length,
      }

      prevMatch = matchObj
      firstMatchFromBottom = matchObj
    }
    if (k === startKey && prevMatch) {
      break
    }
  }

  return prevMatch || firstMatchFromBottom || { k: null, start: null, length: null }
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
      // restrict to the text that comes after the selection
      searchText = text.slice(endOffset)
    }

    const match = regex.exec(searchText)
    if (match) {
      const matchObj = {
        k,
        start: match.index + (k === endKey ? endOffset : 0),
        length: match[0].length,
      }

      if (!firstMatchFromTop) {
        firstMatchFromTop = matchObj
      }
      if (currentBlockFound) {
        nextMatch = matchObj
        break
      }
    }
  }

  return nextMatch || firstMatchFromTop || { k: null, start: null, length: null }
}

export function selectMatch(editorState, regex, forward = true) {
  const { k, start, length } = forward ? findNextMatch(editorState, regex) : findPrevMatch(editorState, regex)
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

export const getCurrentBlockTextToCursor = (editorState) => {
  const selection = editorState.getSelection()
  const key = selection.getEndKey()
  const offset = selection.getEndOffset()
  const content = editorState.getCurrentContent()
  const block = content.getBlockForKey(key)
  return block.getText().slice(0, offset)
}

export const getNodeTitle = (editorState) => {
  const blockText = getCurrentBlockTextToCursor(editorState)
  // Probably impinging on some other link, break early
  const breakChars = [']', ')', '(']
  let startFound
  let i

  for (i = blockText.length - 1; i >= 0; i -= 1) {
    const char = blockText[i]
    if (breakChars.includes(char)) {
      break
    }
    if (char === '[') {
      startFound = true
      break
    }
  }

  // Slice off the leading [
  return startFound ? blockText.slice(i + 1) : null
}

export const getSelectedText = (editorState) => {
  const selectionState = editorState.getSelection()
  const anchorKey = selectionState.getAnchorKey()
  const currentContent = editorState.getCurrentContent()
  const currentContentBlock = currentContent.getBlockForKey(anchorKey)
  const start = selectionState.getStartOffset()
  const end = selectionState.getEndOffset()
  return currentContentBlock.getText().slice(start, end)
}

export const getSelectionNodeId = (editorState) => {
  const selectedText = getSelectedText(editorState)
  const match = LINK_REGEX_NO_G.exec(selectedText)
  console.log({ match, selectedText })
  return match ? match[2] : null
}

export const insertLinkCompletion = (editorState, nodeId) => {
  return EditorState.push(
    editorState,
    Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      `](${nodeId})`,
    ),
    'insert-characters',
  )
}
