import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRedirect } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from '~/store/configureStore'
import App from './App'
import NodeEdit from './NodeEdit'
import Flex from './Flex'
import { NodeEditPath } from '~/routes'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)


const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to={NodeEditPath(1)} />
        <Route path={NodeEditPath()} component={Flex} />
      </Route>
    </Router>
  </Provider>
)

export default Root
