import PropTypes from 'prop-types';

const shape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  root_id: PropTypes.string
})

export default shape
