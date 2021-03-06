import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NodeActions from '~/apis/nodes/actions';
import nodeShape from '~/apis/nodes/shape';

class NodeContainer extends Component {
  componentWillMount() {
    this.refetch();
    // const { actions: { GET }, id } = this.props
    // GET(id)
  }

  componentWillReceiveProps(nextProps) {
    const {
      actions: { GET },
      id,
    } = this.props;
    if (nextProps.id !== id) {
      GET(nextProps.id);
    }
  }

  refetch = () => {
    console.log('Synchronizing node: ', this.props.id);
    const {
      actions: { GET },
      id,
    } = this.props;
    GET(id);
  };

  render() {
    const { confirmed, requested, failed, node, children, id } = this.props;

    return (
      <div key={id}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            node,
            confirmed,
            requested,
            failed,
            refetch: this.refetch,
          })
        )}
      </div>
    );
  }
}

NodeContainer.propTypes = {
  id: PropTypes.string.isRequired, // param
  confirmed: PropTypes.bool.isRequired,
  requested: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  node: nodeShape,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

function mapStateToProps(state, props) {
  const {
    data: node,
    GET: { confirmed, requested, failed },
  } = state.nodes.http.things[props.id] || {
    data: {},
    GET: {
      confirmed: false,
      requested: true,
      failed: false,
    },
  };

  return {
    node,
    confirmed: !!(confirmed && node.content),
    requested,
    failed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(NodeActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeContainer);
