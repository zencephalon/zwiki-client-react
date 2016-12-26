import React, { Component, PropTypes } from 'react'

export default class Link extends Component {
  onClick = () => {
    const { insertPortal, children, moveToEnd, decoratedText } = this.props
    moveToEnd(decoratedText, () => { insertPortal(2) })
  }

  render() {
    return (
      <span style={{ color: '#36AECC' }} onClick={this.onClick}>
        {this.props.children}
      </span>
    )
  }
}
