import React, { Component, PropTypes } from 'react'

import { LINK_REGEX } from '~/constants'

export default class Link extends Component {
  componentWillUnmount() {
    if (this.portalEntityKey) {
      this.props.removeEntity(this.portalEntityKey)
    }
  }

  onClick = () => {
    const { insertPortal, moveToEnd, decoratedText, removeEntity } = this.props
    if (this.portalEntityKey) {
      removeEntity(this.portalEntityKey)
      this.portalEntityKey = null
    } else {
      moveToEnd(decoratedText).then(() => {
        this.portalEntityKey = insertPortal(LINK_REGEX.exec(decoratedText)[2])
      })
    }
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
  insertPortal: PropTypes.func.isRequired,
  removeEntity: PropTypes.func.isRequired,
  moveToEnd: PropTypes.func.isRequired,
  decoratedText: PropTypes.string.isRequired,
}
