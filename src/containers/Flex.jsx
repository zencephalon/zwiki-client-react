import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import NodeEdit from './NodeEdit'
import classNames from 'classnames'

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
    const { columns, visible_columns } = this.props
    return (
      <div className="flex-writer">
        {columns.map((column, index) => (
          <div
            className={classNames('flex-column', {
              hidden: !visible_columns.includes(index),
            })}
            key={index}
          >
            {column.map(nodeId => (
              <NodeEdit key={nodeId} params={{ id: nodeId }} />
            ))
            }
          </div>
        ))}
      </div>
    )
  }
}

NodeContainer.propTypes = {
  id: PropTypes.string.isRequired, // param
  columns: PropTypes.array,
  visible_columns: PropTypes.array,
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
