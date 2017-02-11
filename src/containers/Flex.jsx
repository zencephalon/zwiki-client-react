import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as FlexActions from '~/apis/flex/actions'
import NodeEdit from './NodeEdit'
import classNames from 'classnames'

import { EDITOR } from '~/constants'

class Flex extends Component {
  render() {
    const {
      columns,
      visibleColumns,
      focusedColumn,
      focusedRow,
      actions: {
        FOCUS,
      },
    } = this.props
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
            {column.map((nodeId, rowId) => (
              <div
                className="column-item"
                key={`${columnId}-${nodeId}`}
                onClick={() => FOCUS({ rowId, columnId, type: EDITOR })}
              >
                <NodeEdit
                  id={nodeId}
                  editorId={`${columnId}-${nodeId}`}
                  focused={focusedColumn === columnId && rowId === focusedRow}
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

Flex.propTypes = {
  id: PropTypes.string.isRequired, // param
  columns: PropTypes.array,
  visibleColumns: PropTypes.array,
  focusedColumn: PropTypes.number,
  focusedRow: PropTypes.number,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state) {
  const {
    columns,
    visibleColumns,
    focusedColumn,
    focusedRow,
  } = state.flex

  return {
    columns,
    visibleColumns,
    focusedColumn,
    focusedRow,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FlexActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Flex)
