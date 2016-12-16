import { PropTypes } from 'react'

const shape = PropTypes.shape({
  content: PropTypes.string.isRequired,
  node: PropTypes.number.isRequired,
})

export default shape
