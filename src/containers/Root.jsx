import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from '~/store/configureStore'
import App from './App'
import Flex from './Flex'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)


const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Flex} />
      </Route>
    </Router>
  </Provider>
)

export default Root
