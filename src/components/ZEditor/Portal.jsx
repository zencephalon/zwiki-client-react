import React, { Component, PropTypes } from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

import { Entity } from 'draft-js'

export default class Portal extends Component {
  render() {
    const entityId = this.props.block.getEntityAt(0)
    if (!entityId) {
      return null
    }
    console.log('in portal', entityId)
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
