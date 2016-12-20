import React, { PropTypes } from 'react'

const ShowConfirmed = props => (
  <div>
    {props.confirmed ? React.Children.map(props.children, child =>
      React.cloneElement(child, {
        ...props,
      })) : null}
  </div>
)

ShowConfirmed.propTypes = {
  confirmed: PropTypes.bool,
}

export default ShowConfirmed
