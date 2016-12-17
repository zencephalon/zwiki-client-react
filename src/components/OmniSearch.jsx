import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { INDEX, SET_QUERY } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import classNames from 'classnames'

class OmniSearch extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      timer: null,
      selected: 0,
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
    const { selected } = this.state

    return (
      <div className="omni-search">
        <input
          type="text"
          onChange={this.qChange}
          onKeyPress={this.handleKeyPress}
          value={q}
          placeholder="Search"
        />
        <div className="suggestions">
          <div className="suggestion-popover">
            {confirmed &&
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={classNames({ selected: index === selected })}
                >
                  { suggestion.name }
                </div>
              ))
            }
          </div>
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
  confirmed: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(nodeShape),
}

export default connect(mapStateToProps)(OmniSearch)
