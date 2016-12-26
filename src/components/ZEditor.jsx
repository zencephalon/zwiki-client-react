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

import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import { SET_FOCUS } from '~/apis/focus/actions'
import { OMNI_SEARCH, EDITOR } from '~/constants'

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

const LINK_REGEX = /\@[\w]+/g

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
  console.log('inserting portal')
  const entityKey = Entity.create(
    'PORTAL',
    'MUTABLE',
    { id },
  )

  const ed = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
  console.log(ed.getBlockTree())
  return ed
}

class ZEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    previousPlainText: this.props.node.content,
    timer: null,
    readOnly: false,
  }

  componentDidMount() {
    if (this.props.focus.kind === EDITOR) {
      // this.focus()
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.focus.kind === EDITOR && lastProps.focus.kind !== EDITOR) {
      // this.focus()
    }
  }

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    const { timer, previousPlainText } = this.state
    let newTimer

    console.log('change occurred')

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

  setReadOnly = (callback) => {
    this.setState({
      readOnly: true,
    }, callback)
  }

  moveToEnd = (text, callback) => {
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

    this.setState({
      editorState: EditorState.forceSelection(editorState, newSelection),
    }, callback)

    console.log(startOffset, offset)
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
          onClick: this.setReadOnly,
        },
      }
    }
    return null
  }

  parseNode = plainText => (
    {
      content: plainText,
      name: plainText.split('\n', 1)[0].match(/#+\s*(.*)$/)[1],
    }
  )

  focus = () => {
    this.editor.focus()
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
    const { timer, readOnly } = this.state
    return (
      <div
        className={classNames('editor', { saved: !timer })}
        onClick={this.focus}
        ref={this.props.editorRef}
      >
        <Editor
          readOnly={readOnly}
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
  // bindShortcut: PropTypes.func.isRequired,
  //unbindShortcut: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(ZEditor)
