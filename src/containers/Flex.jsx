import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as FlexActions from '~/apis/flex/actions'
import NodeEdit from './NodeEdit'
import classNames from 'classnames'

import { EDITOR } from '~/constants'

const Flex = (props) => {
  const {
    columns,
    visibleColumnIds,
    focusedColumnId,
    focusedRowId,
    actions: {
      FOCUS,
    },
  } = props
  return (
    <div className="flex-writer">
      {columns.map((column, columnId) => (
        <div
          className={classNames('flex-column', {
            hidden: !visibleColumnIds.includes(columnId),
            focused: focusedColumnId === columnId,
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
                focused={focusedColumnId === columnId && rowId === focusedRowId}
              />
            </div>
          ))
          }
        </div>
      ))}
    </div>
  )
}

Flex.propTypes = {
  columns: PropTypes.array,
  visibleColumnIds: PropTypes.array,
  focusedColumnId: PropTypes.number,
  focusedRowId: PropTypes.number,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state) {
  const {
    columns,
    visibleColumnIds,
    focusedColumnId,
    focusedRowId,
  } = state.flex

  return {
    columns,
    visibleColumnIds,
    focusedColumnId,
    focusedRowId,
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
