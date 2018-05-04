import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as FlexActions from '~/apis/flex/actions'
import NodeEdit from './NodeEdit'
import classNames from 'classnames'

import UserShape from '~/apis/users/shape'

import { EDITOR } from '~/constants'

class Flex extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id != this.props.user.id) {
      this.props.actions.OPEN_NODE({ nodeId: nextProps.user.root_id });
    }
  }

  render() {
    const {
      columns,
      visibleColumnIds,
      focusedColumnId,
      focusedRowId,
      trieSearch,
      actions: {
        FOCUS,
      },
    } = this.props
    const firstVisibleColumnId = visibleColumnIds[0]
    const numVisible = visibleColumnIds.length
    return (
      <div className={`flex-writer columns-${numVisible}`}>
        {columns.map((column, columnId) => (
          <div
            className={classNames('flex-column', {
              hidden: !visibleColumnIds.includes(columnId),
              focused: focusedColumnId === columnId,
              'first-visible': firstVisibleColumnId === columnId,
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
                  trieSearch={trieSearch}
                />
              </div>
            ))
            }
            <div className="column-item column-filler">❧</div>
          </div>
        ))}
      </div>
    )
  }
}

Flex.propTypes = {
  columns: PropTypes.array,
  visibleColumnIds: PropTypes.array,
  trieSearch: PropTypes.object.isRequired,
  focusedColumnId: PropTypes.number,
  focusedRowId: PropTypes.number,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  user: UserShape,
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
