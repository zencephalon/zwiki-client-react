import React from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

const NodeEdit = (props) => (
  <NodeContainer id={props.params.id}>
    <ShowConfirmed>
      <ZEditor editorId="root" />
    </ShowConfirmed>
  </NodeContainer>
)

export default NodeEdit
