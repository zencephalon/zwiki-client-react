import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from '~/store/configureStore'
import App from './App'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)


const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>
)

export default Root
