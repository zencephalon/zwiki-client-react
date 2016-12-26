import React, { Component, PropTypes } from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

import { Entity } from 'draft-js'

export default class Portal extends Component {
  render() {
    const entityId = this.props.block.getEntityAt(0)
    const entity = Entity.get(entityId)
    const id = entity.data.id
    return (
      <div
        onClick={() => {
          this.props.blockProps.parentSetReadOnly().then(() => {
            this.editor.focus()
          })
        }}
      >
        <NodeContainer id={id}>
          <ShowConfirmed>
            <ZEditor editorRef={(el) => { this.editor = el }} />
          </ShowConfirmed>
        </NodeContainer>
      </div>
    )
  }
}
