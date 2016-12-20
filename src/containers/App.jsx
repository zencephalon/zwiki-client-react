import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import NodeContainer from '~/containers/Node'

import ShowConfirmed from '~/components/ShowConfirmed'
import ZEditor from '~/components/ZEditor'
import OmniSearch from '~/components/OmniSearch'


class App extends Component {
  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    return (
      <div className="main-app-container">
        <OmniSearch />
        <NodeContainer id="1">
          <ShowConfirmed>
            <ZEditor />
          </ShowConfirmed>
        </NodeContainer>
      </div>
    )
  }
}

App.propTypes = {
  confirmed: PropTypes.bool.isRequired,
  node: nodeShape,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state) {
  const {
    data: node,
    GET: {
      confirmed,
    },
  } = state.nodes.http.things[1] || {
    data: {},
    GET: {
      confirmed: false,
    },
  }

  return {
    counter: state.counter,
    node,
    confirmed,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(NodeActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
