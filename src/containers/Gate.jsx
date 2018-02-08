import React, { Component, PropTypes } from 'react'
import LoginForm from '~/components/LoginForm'
import RegisterForm from '~/components/RegisterForm'

class Gate extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      token: localStorage.getItem('token'),
    }

    window.addEventListener('storage', () => {
      this.setState({ token: localStorage.getItem('token') })
    })
  }

  onRegister = (user) => {
    console.log(user)
  }

  setToken = (token) => {
    localStorage.setItem('token', token)
    this.setState({ token })
  }

  render() {
    const { token } = this.state
    return (
      <div>
        {!token ? (
          <div>
            <LoginForm onLogin={this.setToken} />
            <RegisterForm onRegister={this.onRegister} />
          </div>
          ) : this.props.children
        }
      </div>
    )
  }
}

export default Gate
