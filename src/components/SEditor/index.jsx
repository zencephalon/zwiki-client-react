import React, { Component } from 'react'
import { Editor } from 'slate-react'
import Serializer from './serializer'

function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.isSelected ? '```' : ''}{props.children}{props.isSelected ? '```' : ''}</code>
    </pre>
  )
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
