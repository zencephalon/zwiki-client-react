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
      <NodeContainer id={id}>
        <ShowConfirmed>
          <ZEditor />
        </ShowConfirmed>
      </NodeContainer>
    )
  }
}
