import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import NodeEdit from './NodeEdit'

class NodeContainer extends Component {
  componentWillMount() {
    const { actions: { GET }, id } = this.props
    GET(id)
  }

  componentWillReceiveProps(nextProps) {
    const { actions: { GET }, id } = this.props
    if (nextProps.id !== id) {
      GET(nextProps.id)
    }
  }

  render() {
    const { columns } = this.props
    return (
      <div className="flex-writer">
        {columns.map((column, index) => (
          <div className="flex-column">
            <NodeEdit key={index} params={{ id: 1 }} />
          </div>
        ))}
      </div>
    )
  }
}

NodeContainer.propTypes = {
  id: PropTypes.string.isRequired, // param
  confirmed: PropTypes.bool.isRequired,
  requested: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  node: nodeShape,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state) {
  const {
    columns,
    visible_columns,
    focused_column,
  } = state.flex

  return {
    columns,
    visible_columns,
    focused_column,
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
)(NodeContainer)
