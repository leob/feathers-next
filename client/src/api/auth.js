import client from './client'

const auth = {

  fetchUser (accessToken) {

    return client.passport.verifyJWT(accessToken)
      .then(payload => {
        return client.service('users').get(payload.userId)
      })
      .then(user => {
        return Promise.resolve(user)
      })
  },

  authenticate (jwtFromCookie) {
    console.log('authenticate, cookie: ' + (jwtFromCookie ? 'yes' : 'no'))

    let jwt = null

    return client.authenticate({
      strategy: 'jwt', 
      accessToken: jwtFromCookie
    })
      .then((response) => {
        console.log('authenticate successful')

        jwt = response.accessToken

        return this.fetchUser(jwt)
      })
      .then(user => {
        console.log('authenticate, got user')

        return Promise.resolve({user, jwt})
      })
      .catch((err) => {
        console.log('authenticate failed', err)

        return Promise.resolve({user: null, jwt: null})
      })
  },

  signout () {
    console.log('signout')

    return client.logout()
      .then(() => {
        console.log('signout successful')
      })
      .catch((err) => {
        console.log('signout failed', err)

        return Promise.reject(err)
      })
  },

  register (email, password) {
    return client.service('users').create({
      email: email,
      password: password
    })
  },

  login (email, password) {
    return client.authenticate({
      strategy: 'local',
      email: email,
      password: password
    })
  }

}

export default auth
