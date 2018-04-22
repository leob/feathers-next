import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import { initStore, register } from '../store'
import AuthForm from '../components/authForm'

class Register extends Component {

  state = {
    username: '',
    password: '',
    errorMessage: ''
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleRegisterSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const payload = {
      username: this.state.username,
      password: this.state.password
    }
    dispatch(register(payload))
      .catch(err => {
        console.log('Register failed: ', err)        
        this.setState({errorMessage: err.message})
      })
  }

  render () {
    const {username, password, errorMessage} = this.state;

    return (
      <div>
        Register please:
        <AuthForm {...{username, password, errorMessage, onChange: this.handleOnChange, onSubmit: this.handleRegisterSubmit}} />
      </div>
    )
  }
}

export default withRedux(initStore)(Register)
