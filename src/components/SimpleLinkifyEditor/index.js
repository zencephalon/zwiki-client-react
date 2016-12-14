import React, { Component } from 'react';
import { connect } from 'react-redux'

import { EditorState, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createLinkifyPlugin from 'draft-js-linkify-plugin'; // eslint-disable-line import/no-unresolved
import editorStyles from './editorStyles.css';

import { PUT } from '~/apis/nodes/actions'

const linkifyPlugin = createLinkifyPlugin();
const plugins = [linkifyPlugin];

class SimpleMentionEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(ContentState.createFromText(this.props.node.content)),
  };

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    this.setState({
      editorState,
    });
    dispatch(PUT(node.id, { content: editorState.getCurrentContent().getPlainText() }))
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div className="editor" onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
        />
      </div>
    );
  }
}

export default connect()(SimpleMentionEditor)