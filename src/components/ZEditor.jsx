import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { EditorState, ContentState } from 'draft-js'
import Editor from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved

import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

// const linkifyPlugin = createLinkifyPlugin()
const plugins = []

class ZEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    timer: null,
  };

  componentDidMount() {
    this.focus()
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

  render() {
    const { timer } = this.state
    return (
      <div className={classNames('editor', { saved: !timer })} onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
        />
      </div>
    )
  }
}

ZEditor.propTypes = {
  node: nodeShape,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(ZEditor)
