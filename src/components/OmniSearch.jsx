import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { INDEX, SET_QUERY, POST } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'
import { NodeEditPath } from '~/routes'

import { SET_FOCUS } from '~/apis/focus/actions'
import { OMNI_SEARCH, EDITOR, ROOT } from '~/constants'

import classNames from 'classnames'

class OmniSearch extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      timer: null,
      selected: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus.kind === OMNI_SEARCH) {
      this.input.focus()
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
          this.setState({ timer: null, selected: 0 })
        })
      }, 150),
    })
  }

  handleKeyPress = (e) => {
    const { suggestions, dispatch, q } = this.props
    const size = suggestions.length
    const { selected } = this.state

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.setState({
        selected: selected === 0 ? size - 1 : selected - 1,
      })
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.setState({
        selected: (selected === size - 1) ? 0 : selected + 1,
      })
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.ctrlKey) {
        dispatch(POST('new-omni', { content: `# ${q}\n\n`, name: q })).then((ret) => {
          const { data: new_node } = ret
          browserHistory.push(NodeEditPath(new_node.id))
        })
      } else {
        browserHistory.push(NodeEditPath(suggestions[selected].id))
      }
      this.input.blur()
      dispatch(SET_QUERY(''))
      dispatch(SET_FOCUS(EDITOR, ROOT))
      this.setState({
        selected: 0,
      })
    }
    if (e.key === ' ' && e.ctrlKey) {
      this.input.blur()
      dispatch(SET_FOCUS(EDITOR))
    }
  }

  render() {
    const { q, confirmed, suggestions } = this.props
    const { selected } = this.state

    return (
      <div className="omni-search">
        <input
          type="text"
          onChange={this.qChange}
          onKeyDown={this.handleKeyPress}
          value={q}
          placeholder="Search"
          ref={(element) => { this.input = element }}
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
    focus: state.focus,
  }
}

OmniSearch.propTypes = {
  q: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  confirmed: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(nodeShape),
  focus: PropTypes.object,
}

export default connect(mapStateToProps)(OmniSearch)
