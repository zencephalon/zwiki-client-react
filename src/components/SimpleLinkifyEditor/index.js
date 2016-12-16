import React, { Component } from 'react'
import { connect } from 'react-redux'

import { EditorState, ContentState } from 'draft-js'
import Editor from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved
import createLinkifyPlugin from 'draft-js-linkify-plugin' // eslint-disable-line import/no-unresolved

import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'

const linkifyPlugin = createLinkifyPlugin()
const plugins = [linkifyPlugin]

class SimpleMentionEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.node.content)),
    timer: null,
  };

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    const { timer } = this.state

    clearTimeout(timer)

    this.setState({
      editorState,
      timer: setTimeout(() => {
        dispatch(PUT(node.id, {
          content: editorState.getCurrentContent().getPlainText(),
        })).then(() => {
          this.setState({ timer: null })
        })
      }, 1500),
    })
  };

  focus = () => {
    this.editor.focus()
  };

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

export default connect()(SimpleMentionEditor)
