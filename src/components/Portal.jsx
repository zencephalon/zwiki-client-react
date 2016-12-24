import React, { Component, PropTypes } from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

export default class Portal extends Component {
  render() {
    return (
      <div>
        <NodeContainer id="2">
          <ShowConfirmed>
            <ZEditor />
          </ShowConfirmed>
        </NodeContainer>
      </div>
    )
  }
}
