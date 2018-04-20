import React, { Component } from 'react'

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
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
    this.props.onLogin({ name, password });
    event.preventDefault()
  }

  render() {
    const { name, password } = this.state
    return (
      <div>
        <h5>Login</h5>
        <form className="gate" onSubmit={this.handleSubmit}>
          <input placeholder="Username" type="text" value={name} onChange={this.nameChange} />
          <br />
          <input placeholder="Password" type="password" value={password} onChange={this.passwordChange} />
          <br />
          <input type="submit" className="button" />
        </form>
      </div>
    )
  }
}

export default LoginForm
