import React, { Component, PropTypes } from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

export default class Portal extends Component {
  render() {
    return (
      <div onClick={() => {
        this.props.blockProps.onClick()
        this.editor.focus()
      }}>
        <NodeContainer id="2">
          <ShowConfirmed>
            <ZEditor editorRef={(el) => { this.editor = el }} />
          </ShowConfirmed>
        </NodeContainer>
      </div>
    )
  }
}
