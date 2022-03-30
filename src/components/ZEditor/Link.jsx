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

  getText = (selection) => {
    const { decoratedText, blockKey, start, end } = this.props;
    const selected = selection.hasEdgeWithin(blockKey, start, end);

    if (selected) {
      return this.props.children;
    }

    const match = LINK_REGEX_NO_G.exec(decoratedText);
    const nodeText = match?.[1];
    return nodeText;
  };

  render() {
    const { selection } = this.context;

    return (
      <span style={{ color: '#36AECC' }} onClick={this.onClick}>
        {this.getText(selection)}
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
