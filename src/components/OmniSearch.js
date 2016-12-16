import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { INDEX } from '~/apis/nodes/actions'

class OmniSearch extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      q: '',
      timer: null,
    }
  }

  qChange = (e) => {
    const { dispatch } = this.props
    const { timer } = this.state
    const q = e.target.value

    clearTimeout(timer)

    this.setState({
      q,
      timer: setTimeout(() => {
        dispatch(INDEX(q)).then(() => {
          this.setState({ timer: null })
        })
      }),
    })
  }

  render() {
    const { q } = this.state

    return (
      <div className="omni-search">
        <input
          type="text"
          onChange={this.qChange}
          onKeyPress={this.handleKeyPress}
          value={q}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(OmniSearch)
