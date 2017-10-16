import React, { Component, PropTypes } from 'react'

export default class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} })
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile })
      })
    } else {
      this.setState({ profile: userProfile })
    }
  }

  render() {
    const { profile } = this.state

    return (
      <div>
        <span>{profile.name}</span>
      </div>
    )
  }
}
