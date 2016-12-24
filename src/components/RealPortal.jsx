import React, { Component, PropTypes } from 'react'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'

export default class Portal extends Component {
  state = {
    clicked: 0,
  }

  incClick = () => {
    const { clicked } = this.state
    this.setState({ clicked: clicked + 1 })
  }

  render() {
    const { clicked } = this.state
    return (
      <div onClick={this.incClick}>
        <NodeContainer id="2">
          <ShowConfirmed>
            <ZEditor />
          </ShowConfirmed>
        </NodeContainer>
      </div>
    )
  }
}
