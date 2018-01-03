import React, { Component, PropTypes } from 'react'

import { mouseTrap } from 'react-mousetrap'
import { connect } from 'react-redux'

import OmniSearch from '~/components/OmniSearch'
import Gate from '~/containers/Gate'

import { FOCUS, SLIDE_RIGHT, SLIDE_LEFT } from '~/apis/flex/actions'
import { OMNI_SEARCH } from '~/constants'

import { throttle } from 'lodash'

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
    window.onscroll = throttle(() => {
      const searchHeight = $('.omni-search').height()
      $('.flex-column').css('top', window.scrollY > searchHeight ? window.scrollY - searchHeight : 0)
    }, 200)
  }

  render() {
    return (
      <div className="main-app-container">
        <Gate>
          <OmniSearch />
          {this.props.children}
        </Gate>
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired,
}

export default mouseTrap(connect()(App))
