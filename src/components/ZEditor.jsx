import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  EditorState,
  ContentState,
  SelectionState,
  getDefaultKeyBinding,
  AtomicBlockUtils,
  Entity,
} from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import { SET_FOCUS } from '~/apis/focus/actions'

import { OMNI_SEARCH, EDITOR, LINK_REGEX } from '~/constants'
import { setStatePromise } from '~/helpers'

import Link from './Link'
import Portal from './Portal'

// const linkifyPlugin = createLinkifyPlugin()
const plugins = []

function keyBindings(e) {
  if (e.key === ' ' && e.ctrlKey) {
    return 'switch-focus'
  }
  return getDefaultKeyBinding(e)
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

function linkStrategy(contentBlock, callback) {
  findWithRegex(LINK_REGEX, contentBlock, callback)
}

function insertPortal(editorState, id) {
  const entityKey = Entity.create(
    'PORTAL',
    'MUTABLE',
    { id },
  )

  return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '\u200B')
}

class ZEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    previousPlainText: this.props.node.content,
    timer: null,
    editorId: this.props.editorId || uniqueId('editor_'),
  }

  componentDidMount() {
    if (this.editable()) {
      setTimeout(this.focus, 10)
    }
  }

  componentDidUpdate(lastProps) {
    if (this.editable() && lastProps.focus.kind !== EDITOR) {
      this.focus()
    }
  }

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    const { timer, previousPlainText } = this.state
    let newTimer

    clearTimeout(timer)

    const plainText = editorState.getCurrentContent().getPlainText()

    if (plainText !== previousPlainText) {
      newTimer = setTimeout(() => {
        dispatch(PUT(node.id, this.parseNode(plainText))).then(() => {
          this.setState({ timer: null })
        })
      }, 1500)
    }

    this.setState({
      editorState,
      timer: newTimer,
      previousPlainText: plainText,
    })
  }

  editable = () => {
    const { focus } = this.props
    const { editorId } = this.state
    return focus.kind === EDITOR && focus.id === editorId
  }

  moveToEnd = (text) => {
    const { editorState } = this.state
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

    return setStatePromise(this, {
      editorState: EditorState.forceSelection(editorState, newSelection),
    })
  }

  insertPortal = (id) => {
    const { editorState } = this.state
    this.setState({
      editorState: insertPortal(editorState, id),
    })
  }

  blockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Portal,
        editable: false,
        props: {
          parentSetReadOnly: this.setReadOnly,
        },
      }
    }
    return null
  }

  parseNode = plainText => (
    {
      content: plainText.replace(/\n\u200B\n/, ''),
      name: plainText.split('\n', 1)[0].match(/#+\s*(.*)$/)[1],
    }
  )

  focus = () => {
    this.editor.focus()
  }

  clickFocus = (e) => {
    const { dispatch } = this.props
    dispatch(SET_FOCUS(EDITOR, this.state.editorId))
    e.stopPropagation()
  }

  handleKeyCommand = (command) => {
    if (command === 'switch-focus') {
      this.props.dispatch(SET_FOCUS(OMNI_SEARCH))
      this.editor.blur()
      return 'handled'
    }
    return 'not-handled'
  }

  render() {
    const { timer } = this.state
    return (
      <div
        className={classNames('editor', { saved: !timer })}
        onClick={this.clickFocus}
      >
        <Editor
          readOnly={!this.editable()}
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
          defaultKeyBindings={false}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={keyBindings}
          decorators={[{
            strategy: linkStrategy,
            component: props => (
              <Link
                {...props}
                insertPortal={this.insertPortal}
                moveToEnd={this.moveToEnd}
              />
            ),
          }]}
          blockRendererFn={this.blockRenderer}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    focus: state.focus,
  }
}

ZEditor.propTypes = {
  node: nodeShape,
  dispatch: PropTypes.func.isRequired,
  editorId: PropTypes.string,
  // bindShortcut: PropTypes.func.isRequired,
  //unbindShortcut: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(ZEditor)
