import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Context from './Context';
import { connect } from 'react-redux';

import { LINK_REGEX_NO_G } from '~/constants';
import { TOGGLE_LINK } from '~/apis/flex/actions';

class Link extends Component {
  componentWillUnmount() {
    if (this.portalEntityKey) {
      this.props.removeEntity(this.portalEntityKey);
    }
  }

  onClick = () => {
    const { dispatch, decoratedText } = this.props;
    const nodeId = LINK_REGEX_NO_G.exec(decoratedText)[2];
    dispatch(TOGGLE_LINK({ nodeId }));
  };

  render() {
    const { selection } = this.context;
    const {
      dispatch,
      decoratedText,
      contentState,
      blockKey,
      start,
      end,
    } = this.props;
    const match = LINK_REGEX_NO_G.exec(decoratedText);
    const nodeText = match?.[1];
    const selected = selection.hasEdgeWithin(blockKey, start, end);
    console.log(selected, nodeText);
    // console.log(selection.getStartKey());
    return (
      <span style={{ color: '#36AECC' }} onClick={this.onClick}>
        {selected ? this.props.children : nodeText}
      </span>
    );
  }
}

Link.contextType = Context;

Link.propTypes = {
  dispatch: PropTypes.func.isRequired,
  decoratedText: PropTypes.string.isRequired,
};

export default connect()(Link);
