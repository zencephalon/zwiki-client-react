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
          <form className="gate" onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={this.nameChange}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={this.emailChange}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.passwordChange}
            />
            <br />
            <input
              type="password"
              placeholder="Password (again... 😓)"
              value={passwordConfirmation}
              onChange={this.passwordConfirmationChange}
            />
            <br />
            <input type="submit" className="button" />
          </form>
        }
      </div>
    )
  }
}

export default RegisterForm
