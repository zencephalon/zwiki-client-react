import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'


class TrieContainer extends Component {
  componentWillMount() {
    this.props.actions.INDEX('')
  }

  render() {
    return (
      <div>
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            ...this.props,
          }))}
      </div>
    )
  }
}

TrieContainer.propTypes = {
  confirmed: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(nodeShape).isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state, props) {
  const {
    data: nodes,
    confirmed,
  } = state.nodes.http.collections[''] || {
    data: [],
    confirmed: false,
  }

  return {
    nodes,
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
)(TrieContainer)
