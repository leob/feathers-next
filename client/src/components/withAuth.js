import React, { Component } from 'react'
import Router from 'next/router'
import { authenticate, FEATHERS_COOKIE, getServerCookie, setServerCookie, clearServerCookie } from '../store'
import Error from 'next/error'
import apiClient from '../api/client'

export const PUBLIC = 'PUBLIC'

/**
 * Higher order component for Next.js `pages` components.
 *
 * NOTE: depends of redux store. So you must use the `withRedux` HOC before this one.
 *
 * Example:
 *
 * ```
 * export default withRedux(initStore, mapStateToProps)(
 *   withAuth(PUBLIC)(MyPage)
 * )
 * ```
 *
 * Or using redux compose function:
 *
 * ```
 * export default compose(
 *   withRedux(initStore, mapStateToProps),
 *   withAuth()
 * )(Private)
 * ```
 *
 * It reads the user from the redux store or calls whoami API to verify current logged in user.
 *
 * To make a page public you have to pass PUBLIC as the `permission` parameter.
 * This is required to be able to show current logged in user from the first server render.
 *
 * @param permission: permission required to render this page. Use PUBLIC to make the page public.
 * @returns function(ChildComponent) React component to be wrapped. Must be a `page` component.
 */
export default (permission = null) => ChildComponent => class withAuth extends Component {

  static redirectToLogin (context) {
    const { isServer, req, res } = context

    if (isServer) {
      res.writeHead(302, { Location: `/login?next=${req.originalUrl}` })
      res.end()
    } else {
      Router.push(`/login?next=${context.asPath}`)
    }
  }

  static userHasPermission (user) {
    const userGroups = user.groups || []
    let userHasPerm = true

    // go here only if we have specific permission requirements
    if (permission) {
      // for instance if the permission is "admin" and the user name starts with admin
      userHasPerm = user.email.toLowerCase().startsWith(permission.toLowerCase())
    }
    return userHasPerm
  }

  static async getInitialProps (context) {
    // public page passes the permission `PUBLIC` to this function
    const isPublicPage = permission == PUBLIC
    const { isServer, store, req, res } = context

    if (isServer) {
      // Authenticate, happens on page first load

      const jwtFromCookie = getServerCookie(req, FEATHERS_COOKIE)      
      const result = await store.dispatch(authenticate(jwtFromCookie))

      const newJwt = result.auth.jwt

      if (newJwt) {
        setServerCookie(res, FEATHERS_COOKIE, newJwt)
      } else {
        clearServerCookie(res, FEATHERS_COOKIE)
      }

    // client side - check if the Feathers API client is already authenticated  
    } else {

      if (!apiClient.authenticated) {
        console.log('Need to authenticate client-side')

        // get the JWT (from cookie - set by previous login or server-side authentication) and use it to auth the API client
        const jwt = store.getState().auth.jwt
        await store.dispatch(authenticate(jwt, true))

        apiClient.authenticated = true
      }
    }

    return this.getInitProps(context, store.getState().auth.user, isPublicPage)
  }

  static async getInitProps (context, user, isPublicPage) {

    let proceedToPage = true
    let initProps = {}

    if (user) {
      // means the user is logged in so we verify permission
      if (!isPublicPage) {

        if (!this.userHasPermission(user)) {
          proceedToPage = false

          // Show a 404 page (see using next.js' built-in Error page) - TODO does this also work server-side?
          const statusCode = 404
          initProps = { statusCode }
        }
      }
    } else {

      // anonymous user
      if (!isPublicPage) {
        proceedToPage = false

        this.redirectToLogin(context)
      }
    }

    if (proceedToPage && typeof ChildComponent.getInitialProps === 'function') {
      initProps = await ChildComponent.getInitialProps(context)
    }

    return initProps
  }

  render () {
    // Use next's built-in error page
    if (this.props.statusCode) {
      return <Error statusCode={this.props.statusCode} />
    }

    return <ChildComponent {...this.props} />
  }
}
