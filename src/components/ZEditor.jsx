import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { EditorState, ContentState, getDefaultKeyBinding } from 'draft-js'
import Editor from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved

import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import { SET_FOCUS } from '~/apis/focus/actions'
import { OMNI_SEARCH, EDITOR } from '~/constants'

// const linkifyPlugin = createLinkifyPlugin()
const plugins = []

function keyBindings(e) {
  if (e.key === ' ' && e.ctrlKey) {
    return 'switch-focus'
  }
  return getDefaultKeyBinding(e)
}

class ZEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    timer: null,
  }

  componentDidMount() {
    if (this.props.focus.kind === EDITOR) {
      this.focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus.kind === EDITOR) {
      this.focus()
    }
  }

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    const { timer } = this.state

    clearTimeout(timer)

    this.setState({
      editorState,
      timer: setTimeout(() => {
        dispatch(PUT(node.id, this.parseNode(editorState.getCurrentContent()))).then(() => {
          this.setState({ timer: null })
        })
      }, 1500),
    })
  }

  parseNode = (currentContent) => {
    const plainText = currentContent.getPlainText()
    return {
      content: plainText,
      name: plainText.split('\n', 1)[0].match(/#+\s*(.*)$/)[1],
    }
  }

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
    const { timer } = this.state
    return (
      <div className={classNames('editor', { saved: !timer })} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
          defaultKeyBindings={false}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={keyBindings}
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
