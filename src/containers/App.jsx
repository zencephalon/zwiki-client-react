import React, { Component, PropTypes } from 'react'

import { mouseTrap } from 'react-mousetrap'
import { connect } from 'react-redux'

import OmniSearch from '~/components/OmniSearch'

import { FOCUS } from '~/apis/flex/actions'
import { OMNI_SEARCH } from '~/constants'

class App extends Component {
  componentWillMount() {
    const { dispatch, bindShortcut } = this.props
    bindShortcut('ctrl+space', () => {
      dispatch(FOCUS({ type: OMNI_SEARCH }))
    })
  }

  render() {
    return (
      <div className="main-app-container">
        <OmniSearch />
        {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired,
}

export default mouseTrap(connect()(App))
