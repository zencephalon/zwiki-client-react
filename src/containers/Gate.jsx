import React, { Component, PropTypes } from 'react'
import { API_BASE } from '~/apis/api'

class Gate extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      token: localStorage.getItem('token'),
      name: '',
      password: '',
    }
  }

  nameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  passwordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  handleSubmit = (event) => {
    const { name, password } = this.state

    fetch(API_BASE + 'login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    }).then(res => res.json()).then(({ token }) => {
      localStorage.setItem('token', token)
      this.setState({ token })
    })

    event.preventDefault()
  }

  render() {
    const { token, name, password } = this.state
    return (
      <div>
        {!token ? (
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={name} onChange={this.nameChange} />
            <input type="password" value={password} onChange={this.passwordChange} />
            <input type="submit" />
          </form>
          ) : this.props.children
        }
      </div>
    )
  }
}

export default Gate
