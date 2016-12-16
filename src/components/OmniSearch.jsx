import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { INDEX, SET_QUERY } from '~/apis/nodes/actions'

class OmniSearch extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      timer: null,
    }
  }

  qChange = (e) => {
    const { dispatch } = this.props
    const { timer } = this.state

    const q = e.target.value

    dispatch(SET_QUERY(q))
    clearTimeout(timer)

    this.setState({
      timer: setTimeout(() => {
        dispatch(INDEX(q)).then(() => {
          this.setState({ timer: null })
        })
      }, 150),
    })
  }

  render() {
    const { q, confirmed, suggestions } = this.props

    return (
      <div className="omni-search">
        <input
          type="text"
          onChange={this.qChange}
          onKeyPress={this.handleKeyPress}
          value={q}
        />
        <div className="suggestions">
          {confirmed &&
            suggestions.map(suggestion => <div>{ suggestion.content }</div>)
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { q } = state.nodes.query

  const {
    data: suggestions,
    confirmed,
  } = state.nodes.http.collections[q] || {
    data: [],
    confirmed: false,
  }

  return {
    q,
    confirmed,
    suggestions,
  }
}

OmniSearch.propTypes = {
  q: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(OmniSearch)
