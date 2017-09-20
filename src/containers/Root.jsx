import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from '~/store/configureStore'
import Auth from '~/apis/auth'
import App from './App'
import Flex from './Flex'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)

const auth = new Auth()

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={props => <App auth={auth} {...props} />}>
        <IndexRoute component={Flex} />
      </Route>
      <Route path="/callback" component={App}>
        <IndexRoute component={Flex} />
      </Route>
    </Router>
  </Provider>
)

export default Root
