import Router from 'next/router'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import auth from './api/auth'

// Cookie parser used for extracting the JWT in an SSR scenario
import cookieParser from 'cookie'

// -- CONSTANTS
export const FEATHERS_COOKIE = 'feathers-jwt'

// -- INITIAL STORE
const exampleInitialState = {
  auth: {
    user: null,
    jwt: null
  }
}

export const initStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}

// -- ACTION TYPES
export const actionTypes = {
  SET_AUTH: 'SET_AUTH'
}

// -- REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH: {
      return {...state, auth: action.auth}
    }

    default: return state
  }
}

// -- ACTIONS
export function login (payload) {
  return (dispatch) => {
    return auth.login(payload.username, payload.password)
    .then(_ => {
      return auth.authenticate()
    })
    .then(({user, jwt}) => {
      const result = dispatch({
        type: actionTypes.SET_AUTH,
        auth: {
          user,
          jwt
        }
      })

      setClientCookie(FEATHERS_COOKIE, jwt)
      Router.push('/')

      return result
    })
  }
}

export function logout () {
  return (dispatch) => {
    return auth.signout()
    .then(() => {
      const result = dispatch({
        type: actionTypes.SET_AUTH,
        auth: {
          user: null,
          jwt: null
        }
      })

      clearClientCookie(FEATHERS_COOKIE)

      return result
    })
  }
}

export function register (payload) {
  return (dispatch) => {
    return auth.register(payload.username, payload.password)
    .then(_ => {
      return auth.login(payload.username, payload.password)
    })
    .then(_ => {
      return auth.authenticate()
    })
    .then(({user, jwt}) => {
      const result = dispatch({
        type: actionTypes.SET_AUTH,
        auth: {
          user,
          jwt
        }
      })

      setClientCookie(FEATHERS_COOKIE, jwt)
      Router.push('/')

      return result
    })
  }
}

export function authenticate (jwtFromCookie = null) {
  return (dispatch) => {
    return auth.authenticate(jwtFromCookie)
    .then(({user,jwt}) => {
      const result = dispatch({
        type: actionTypes.SET_AUTH,
        auth: {
          user,
          jwt
        }
      })

      return result
    })
  }
}

// UTILS
export function setClientCookie(name, value) {
  document.cookie = name + '=' + value
}

export function clearClientCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function setServerCookie(res, name, value) {
  res.cookie(name, value, {})  // maxAge: 900000, httpOnly: true })
}

export function clearServerCookie(res, name) {
  res.clearCookie(name);
}

export function getServerCookie(req, name) {
  const cookies = extractCookies(req)
  const cookie = cookies ? cookies[name] : null

  return cookie
}

function extractCookies(req) {
  const cookies = req.headers.cookie
  if (!cookies) return null

  return cookieParser.parse(cookies)
}
