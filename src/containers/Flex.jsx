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
    const { columns, visibleColumns, focusedColumn } = this.props
    return (
      <div className="flex-writer">
        {columns.map((column, columnId) => (
          <div
            className={classNames('flex-column', {
              hidden: !visibleColumns.includes(columnId),
              focused: focusedColumn === columnId,
            })}
            key={columnId}
          >
            {column.map(nodeId => (
              <div className="column-item">
                <NodeEdit
                  key={`${columnId}-${nodeId}`}
                  id={nodeId}
                  editorId={`${columnId}-${nodeId}`}
                />
              </div>
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
  visibleColumns: PropTypes.array,
  focusedColumn: PropTypes.number,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state) {
  const {
    columns,
    visibleColumns,
    focusedColumn,
  } = state.flex

  return {
    columns,
    visibleColumns,
    focusedColumn,
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
