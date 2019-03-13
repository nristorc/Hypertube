import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { authActions } from '../actions'
import { userService } from '../service'

const localStorage = require('localStorage')

class Logout extends React.Component {
  componentWillMount() {
    const { dispatch, history } = this.props
    try {
      const bearer = JSON.parse(localStorage.getItem('bearerToken'))
      const bearerToken = bearer.accessToken || bearer.access_token || ''
      if (bearerToken !== '') {
        userService.logout({ token: bearerToken })
        setTimeout(() => { history.push('/login') }, 1500)
        dispatch(authActions.logout())
      } else {
        setTimeout(() => { history.push('/login') }, 1500)
      }
    } catch (err) {
      setTimeout(() => { history.push('/login') }, 1500)
    }
  }

  render() {
    return <Redirect to="/login" />
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Logout)
