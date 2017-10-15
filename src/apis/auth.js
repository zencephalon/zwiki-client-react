import auth0 from 'auth0-js'
import { browserHistory } from 'react-router'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'iluvu.auth0.com',
    clientID: 'oUJGRGbBjT90at5NVNBTD_4RWHWjEUKg',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://iluvu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile',
  })

  userProfile = null

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        console.log(err)
      }
      browserHistory.replace('/')
    })
  }

  setSession = (authResult) => {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getProfile = (callback) => {
    const accessToken = this.getAccessToken()
    this.auth0.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile
      }
      callback(err, profile)
    })
  }

  logout = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    browserHistory.replace('/')
  }

  login = () => {
    this.auth0.authorize()
  }

  isAuthenticated = () => {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
