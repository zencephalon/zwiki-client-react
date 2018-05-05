import React from 'react'

import { ROOT } from '~/constants'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

const NodeEdit = props => (
  <NodeContainer id={props.id}>
    <ShowConfirmed>
      <ZEditor
        editorId={props.editorId || ROOT}
        focused={props.focused}
      />
    </ShowConfirmed>
  </NodeContainer>
)

export default NodeEdit
