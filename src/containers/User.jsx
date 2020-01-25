import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '~/apis/users/actions'
import userShape from '~/apis/users/shape'

class UserContainer extends Component {
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
    const { confirmed, requested, failed, user, children, id } = this.props
    return (
      <div key={id}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            user,
            confirmed,
            requested,
            failed,
          }))}
      </div>
    )
  }
}

UserContainer.propTypes = {
  id: PropTypes.string.isRequired, // param
  confirmed: PropTypes.bool.isRequired,
  requested: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  user: userShape,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state, props) {
  const {
    data: user,
    GET: {
      confirmed,
      requested,
      failed,
    },
  } = state.users.http.things[props.id] || {
    data: {},
    GET: {
      confirmed: false,
      requested: true,
      failed: false,
    },
  }

  return {
    user,
    confirmed,
    requested,
    failed,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UserActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserContainer)
