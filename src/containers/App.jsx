import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import ZEditor from '~/components/ZEditor'
import OmniSearch from '~/components/OmniSearch'

class App extends Component {
  componentWillMount() {
    this.props.actions.GET(1)
  }


  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    const { confirmed, node } = this.props
    return (
      <div className="main-app-container">
        <OmniSearch />
        {confirmed ?
          <ZEditor node={node} /> : null
        }
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
