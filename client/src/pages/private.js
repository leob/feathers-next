import React from 'react'
import Link from 'next/link'
import withRedux from 'next-redux-wrapper'
import { compose } from 'redux'
import { initStore } from '../store'
import withAuth from '../components/withAuth'
import client from '../api/client'

class Private extends React.Component {

  static async getInitialProps (context) {
    const counters = await client.service('counters').find()
    return { counterCount: counters.length }
  }

  render () {
    const { user } = this.props
    const name = user ? `${user.email}` : 'Anonymous'

    return (
      <div>
        <div>
          <h1>Hello {name}!</h1>
          <h2>You have {this.props.counterCount} counters.</h2>
          <p>This content is available for logged in users only.</p>
        </div>
        <div>
          <Link href='/'>
            <a>Link to the home page</a>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default compose(
  withRedux(initStore, mapStateToProps),
  withAuth()
)(Private)
