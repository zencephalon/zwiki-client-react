import React from 'react'

import { ROOT } from '~/constants'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import SEditor from '~/components/SEditor'

const NodeEdit = props => (
  <NodeContainer id={props.id}>
    <ShowConfirmed>
      <SEditor
        editorId={props.editorId || ROOT}
        focused={props.focused}
      />
    </ShowConfirmed>
  </NodeContainer>
)

export default NodeEdit
