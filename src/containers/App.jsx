import React, { Component, PropTypes } from 'react'

import { mouseTrap } from 'react-mousetrap'
import { connect } from 'react-redux'

import OmniSearch from '~/components/OmniSearch'

import { FOCUS, SLIDE_RIGHT, SLIDE_LEFT } from '~/apis/flex/actions'
import { OMNI_SEARCH } from '~/constants'

import Auth from '~/apis/auth'


class App extends Component {
  constructor(props) {
    super(props)
    this.auth = new Auth()
  }

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
          <button onClick={() => this.auth.login()} />
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
