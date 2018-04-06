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
      isRegistered: false,
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
      this.props.onRegister({ user, name, password })
      this.setState({ isRegistered: true })
    })

    event.preventDefault()
  }

  render() {
    const { name, password, email, passwordConfirmation, isRegistered } = this.state
    return (
      <div>
        <h5>Register</h5>
        {isRegistered ?
          <p>Congrats!</p> :
          <form onSubmit={this.handleSubmit}>
            <p>Name:</p>
            <input type="text" value={name} onChange={this.nameChange} />
            <p>Email:</p>
            <input type="email" value={email} onChange={this.emailChange} />
            <p>Password:</p>
            <input type="password" value={password} onChange={this.passwordChange} />
            <p>Password Confirmation:</p>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={this.passwordConfirmationChange}
            />
            <input type="submit" />
          </form>
        }
      </div>
    )
  }
}

export default RegisterForm
