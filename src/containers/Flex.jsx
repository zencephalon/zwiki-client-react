import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FlexActions from '~/apis/flex/actions';
import NodeEdit from './NodeEdit';
import classNames from 'classnames';

import UserShape from '~/apis/users/shape';

import { EDITOR } from '~/constants';

class Flex extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id != this.props.user.id) {
      this.props.actions.OPEN_NODE({ nodeId: nextProps.user.root_id });
    }
  }

  render() {
    const {
      columns,
      visibleColumns,
      leftmostVisibleColumnId,
      focusedColumnId,
      actions: { FOCUS },
    } = this.props;
    return (
      <div className={`flex-writer columns-${visibleColumns}`}>
        {columns.map((column, columnId) => {
          const hidden =
            columnId < leftmostVisibleColumnId ||
            columnId >= leftmostVisibleColumnId + visibleColumns;
          // console.log({
          //   columnId,
          //   leftmostVisibleColumnId,
          //   visibleColumns,
          //   hidden
          // });
          return (
            <div
              className={classNames('flex-column', {
                hidden,
                focused: focusedColumnId === columnId,
                'first-visible': leftmostVisibleColumnId === columnId,
              })}
              key={columnId}
            >
              {column.nodes.map((nodeId, rowId) => (
                <div
                  className="column-item"
                  key={`${columnId}-${nodeId}`}
                  onClick={() => FOCUS({ rowId, columnId, type: EDITOR })}
                >
                  <NodeEdit
                    id={nodeId}
                    editorId={`${columnId}-${nodeId}`}
                    focused={
                      focusedColumnId === columnId &&
                      rowId === column.focusedRowId
                    }
                  />
                </div>
              ))}
              <div className="column-item column-filler">❧</div>
            </div>
          );
        })}
      </div>
    );
  }
}

Flex.propTypes = {
  columns: PropTypes.array,
  visibleColumns: PropTypes.number,
  leftmostVisibleColumnId: PropTypes.number,
  focusedColumnId: PropTypes.number,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  user: UserShape,
};

function mapStateToProps(state) {
  const {
    columns,
    visibleColumns,
    focusedColumnId,
    leftmostVisibleColumnId,
  } = state.flex;

  return {
    columns,
    visibleColumns,
    focusedColumnId,
    leftmostVisibleColumnId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FlexActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Flex);
