import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from '~/store/configureStore'
import Auth from '~/apis/auth'
import App from './App'
import Flex from './Flex'
import Loading from './Loading'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)

const auth = new Auth()

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication()
  }
}

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={props => <App auth={auth} {...props} />}>
        <IndexRoute component={Flex} />
      </Route>
      <Route
        path="/callback"
        component={(props) => {
          handleAuthentication(props)
          return <Loading />
        }}
      />
    </Router>
  </Provider>
)

export default Root
