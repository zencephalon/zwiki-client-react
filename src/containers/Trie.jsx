import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as NodeActions from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import TrieSearch from 'trie-search'

import { RECEIVE_INDEX } from '~/apis/suggest/actions'

const trieSearch = new TrieSearch('name', { ix: 'id' })

class TrieContainer extends Component {
  componentWillMount() {
    this.props.actions.INDEX('').then(res => {
      console.log({ res, 'ILUVU': 'yolo' })
      this.props.actions.RECEIVE_INDEX(res.data)
    })
  }

  render() {
    return (
      <div>
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            ...this.props,
          }))}
      </div>
    )
  }
}

TrieContainer.propTypes = {
  confirmed: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(nodeShape).isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

function mapStateToProps(state, props) {
  const {
    data: nodes,
    confirmed,
  } = state.nodes.http.collections[''] || {
    data: [],
    confirmed: false,
  }

  if (confirmed) {
    trieSearch.addAll(nodes)
  }

  return {
    nodes,
    confirmed,
    trieSearch,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...NodeActions, RECEIVE_INDEX }, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrieContainer)
