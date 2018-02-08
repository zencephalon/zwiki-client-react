import React, { Component } from 'react'
import { API_BASE } from '~/apis/api'

class RegisterForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      name: '',
      password: '',
      passwordConfirmation: '',
      email: '',
    }
  }

  nameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  passwordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  passwordConfirmationChange = (event) => {
    this.setState({ passwordConfirmation: event.target.value })
  }

  emailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  handleSubmit = (event) => {
    const { name, password, passwordConfirmation, email } = this.state

    fetch(`${API_BASE}/register`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password, passwordConfirmation, email }),
    }).then(res => res.json()).then((user) => {
      this.props.onRegister(user)
    })

    event.preventDefault()
  }

  render() {
    const { name, password, email, passwordConfirmation } = this.state
    return (
      <div>
        <h5>Register</h5>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={name} onChange={this.nameChange} />
          <input type="email" value={email} onChange={this.emailChange} />
          <input type="password" value={password} onChange={this.passwordChange} />
          <input
            type="password"
            value={passwordConfirmation}
            onChange={this.passwordConfirmationChange}
          />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

export default RegisterForm
