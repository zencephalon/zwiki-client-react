import React, { Component } from 'react'
import { Editor } from 'slate-react'
import Serializer from './serializer'

import { LINK_REGEX_NO_G } from '~/constants'


class CodeNode extends Component {
  onClick = event => {
    console.log({ event, selection: window.getSelection() })
    const offset = window.getSelection().anchorOffset;
    this.props.editor.change(change => {
      change.moveToRangeOf(this.props.node).moveStart(offset + 1).collapseToStart()
    })
  }
  getLinkLabel = () => {
    return this.props.node.text.match(LINK_REGEX_NO_G)[1]
  }
  render() {
    const props = this.props;
    return (
      <pre {...props.attributes}>
        <code onClick={this.onClick}>{props.isSelected ? '' : this.getLinkLabel()}<span style={{display: props.isSelected ? 'inline' : 'none'}}>{props.children}</span></code>
      </pre>
    )
  }
}

class SEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: Serializer.deserialize(props.node.content),
    }
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (event.key !== '`' || !event.ctrlKey) return

    event.preventDefault()

    change.setBlocks('code')
    return true
  }

  renderNode = (props) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
    }
  }

  render() {
    return (
      <div className="editor">
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

export default SEditor
