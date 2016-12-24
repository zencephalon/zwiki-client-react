import React, { Component, PropTypes } from 'react'

export default class Link extends Component {
  render() {
    console.log('inside portal render', this.props.children[0].props.text)
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
