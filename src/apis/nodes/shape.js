import { PropTypes } from 'react'

const shape = PropTypes.shape({
  content: PropTypes.type.string.isRequired,
  node: PropTypes.type.number.isRequired,
})

export default shape
