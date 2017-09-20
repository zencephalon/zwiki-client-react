import React, { Component, PropTypes } from 'react'

import { mouseTrap } from 'react-mousetrap'
import { connect } from 'react-redux'

import OmniSearch from '~/components/OmniSearch'

import { FOCUS, SLIDE_RIGHT, SLIDE_LEFT } from '~/apis/flex/actions'
import { OMNI_SEARCH } from '~/constants'


class App extends Component {
  componentWillMount() {
    const { dispatch, bindShortcut } = this.props
    bindShortcut('ctrl+space', () => {
      dispatch(FOCUS({ type: OMNI_SEARCH }))
    })
    bindShortcut('ctrl+l', () => {
      dispatch(SLIDE_RIGHT())
    })
    bindShortcut('ctrl+h', () => {
      dispatch(SLIDE_LEFT())
    })
  }

  render() {
    return (
      <div className="main-app-container">
        <div>
          {this.props.auth.isAuthenticated() ?
            <button onClick={() => this.props.auth.logout()}>Logout</button> :
            <button onClick={() => this.props.auth.login()}>Login</button>
          }
        </div>
        <OmniSearch />
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
}

export default mouseTrap(connect()(App))
