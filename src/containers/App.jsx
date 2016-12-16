import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import SimpleLinkifyEditor from '~/components/SimpleLinkifyEditor'
import OmniSearch from '~/components/OmniSearch'

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
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
          <SimpleLinkifyEditor node={node} /> : null
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

/**
 * Keep in mind that 'state' isn't the state of local object, but your single
 * state in this Redux application. 'counter' is a property within our store/state
 * object. By mapping it to props, we can pass it to the child component Counter.
 */
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

/**
 * Turns an object whose values are 'action creators' into an object with the same
 * keys but with every action creator wrapped into a 'dispatch' call that we can invoke
 * directly later on. Here we imported the actions specified in 'CounterActions.js' and
 * used the bindActionCreators function Redux provides us.
 *
 * More info: http://redux.js.org/docs/api/bindActionCreators.html
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(NodeActions, dispatch),
  }
}

/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 */

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
