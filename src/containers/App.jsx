import React from 'react'

import OmniSearch from '~/components/OmniSearch'

const App = (props) => (
  <div className="main-app-container">
    <OmniSearch />
    {props.children}
  </div>
)

export default App
