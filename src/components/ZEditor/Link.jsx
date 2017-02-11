import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { LINK_REGEX } from '~/constants'
import { TOGGLE_LINK } from '~/apis/flex/actions'

class Link extends Component {
  componentWillUnmount() {
    if (this.portalEntityKey) {
      this.props.removeEntity(this.portalEntityKey)
    }
  }

  onClick = () => {
    const { dispatch, decoratedText } = this.props
    const nodeId = LINK_REGEX.exec(decoratedText)[2]
    dispatch(TOGGLE_LINK({ nodeId }))
  }

  render() {
    return (
      <span
        style={{ color: '#36AECC' }}
        onClick={this.onClick}
      >
        {this.props.children}
      </span>
    )
  }
}

Link.propTypes = {
  dispatch: PropTypes.func.isRequired,
  removeEntity: PropTypes.func.isRequired,
  decoratedText: PropTypes.string.isRequired,
}

export default connect()(Link)
