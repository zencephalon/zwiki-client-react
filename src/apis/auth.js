import auth0 from 'auth0-js'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'iluvu.auth0.com',
    clientID: 'oUJGRGbBjT90at5NVNBTD_4RWHWjEUKg',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://iluvu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
  });

  login() {
    this.auth0.authorize()
  }
}
