import React, { Component, PropTypes } from 'react'

class Gate extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      token: localStorage.getItem('token'),
    }
  }

  render() {
    const { token } = this.state
    return (
      <div>
        {!token ? (
          <form>
            <input type="text" />
            <input type="password" />
            <input type="submit" />
          </form>
          ) : this.props.children
        }
      </div>
    )
  }
}

export default Gate
