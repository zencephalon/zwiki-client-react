import React, { Component, PropTypes } from 'react'

import { LINK_REGEX } from '~/constants'

export default class Link extends Component {
  onClick = () => {
    const { insertPortal, moveToEnd, decoratedText } = this.props
    moveToEnd(decoratedText).then(() => {
      insertPortal(LINK_REGEX.exec(decoratedText)[2])
    })
  }

  render() {
    return (
      <span style={{ color: '#36AECC' }} onClick={this.onClick}>
        {this.props.children}
      </span>
    )
  }
}
