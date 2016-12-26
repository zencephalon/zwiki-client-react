import React, { Component, PropTypes } from 'react'

export default class Link extends Component {
  onClick = () => {
    const { insertPortal, children } = this.props
    // insertPortal(children[0].props.text)
    insertPortal(2)
  }

  render() {
    console.log('inside portal render', this.props.children[0].props.text)
    return (
      <span style={{ color: '#36AECC' }} onClick={this.onClick}>
        {this.props.children}
      </span>
    )
  }
}
