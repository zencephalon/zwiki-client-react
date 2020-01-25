import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginForm from '~/components/LoginForm'
import RegisterForm from '~/components/RegisterForm'

import { API_BASE } from '~/apis/api'

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

  onLogin = ({ name, password }) => {
    fetch(`${API_BASE}login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    }).then(res => res.json()).then(({ token }) => {
      this.setToken(token)
    })
  }

  onRegister = ({ user, name, password }) => {
    this.onLogin({ name, password })
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
            <LoginForm onLogin={this.onLogin} />
            <RegisterForm onRegister={this.onRegister} />
          </div>
          ) : this.props.children
        }
      </div>
    )
  }
}

export default Gate
