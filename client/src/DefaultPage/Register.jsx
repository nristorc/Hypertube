import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'
import React from 'react'
import { userService } from '../service'
import { REDIRECT } from '../constants'
import {
  InputText, InputLogin, InputPassword,
  InputFile, InputMail, InputButton,
} from '../Components'

const FormData = require('form-data')

class Register extends React.Component {
  constructor(props) {
    super(props)
    const { auth, history } = props
    const { loggedIn } = auth
    if (loggedIn) {
      history.push(REDIRECT.ROOT)
    }
    this.notificationSystem = React.createRef()
    this.state = { status: 'pending' }
    this.profilePic = React.createRef()
  }

  register(event) {
    event.preventDefault()
    const obj = new FormData(event.target)
    obj.append('redirect_uri', 'http://localhost:3000/confirm-account')
    userService.register(obj)
      .then((ret) => {
        if (ret.INVALID_USERNAME || ret.FORMAT_PICTURE || ret.INVALID_EMAIL || ret.INVALID_LASTNAME
          || ret.INVALID_FIRSTNAME || ret.INVALID_PASSWORD || ret.MAIL_FAIL
          || ret.BDD_FAILED || ret.FILE_MISSING || ret.ALREADY_EXIST) {
          if (ret.INVALID_USERNAME) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid firstname given',
              level: 'warning',
            })
          }
          if (ret.INVALID_LASTNAME) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid email given',
              level: 'warning',
            })
          }
          if (ret.INVALID_EMAIL) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid email given',
              level: 'warning',
            })
          }
          if (ret.INVALID_USERNAME) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid username given',
              level: 'warning',
            })
          }
          if (ret.INVALID_EMAIL) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid email given',
              level: 'warning',
            })
          }
          if (ret.INVALID_PASSWORD) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid password given',
              level: 'warning',
            })
          }
          if (ret.USER_BAD_PASS) {
            this.notificationSystem.current.addNotification({
              title: 'Wrong password',
              message: 'Bad password given',
              level: 'warning',
            })
          }
          if (ret.FORMAT_PICTURE) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'Invalid picture given',
              level: 'warning',
            })
          }
          if (ret.FILE_MISSING) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'No picture updload',
              level: 'warning',
            })
          }
          if (ret.ALREADY_EXIST) {
            this.notificationSystem.current.addNotification({
              title: 'Bad information',
              message: 'User already exist',
              level: 'warning',
            })
          }
          this.setState({ status: 'errors' })
        } else {
          const { history } = this.props
          setTimeout(() => { history.push(REDIRECT.LOGIN) }, 1500)
          this.setState({ status: 'valid' })
        }
      })
      .catch((errors) => {
        this.notificationSystem.current.addNotification({
          title: 'Bad information',
          message: 'Failed to contact Auth server',
          level: 'error',
        })
        console.log('Errors', errors)
        this.setState({ status: 'errors' })
      })
  }

  render() {
    const { status } = this.state
    if (status === 'valid') {
      return (
        <div>
          <p className="white-text">You registered succesfully ! Please check your emails to activate your account.</p>
        </div>
      )
    }
    return (
      <div>
        <h1>Register</h1>
        <NotificationSystem ref={this.notificationSystem} />
        <form className="grid-form" onSubmit={this.register.bind(this)}>
          <InputText name="firstname" regexp="^[a-zA-Z-]+$" label="First Name" />
          <InputText name="lastname" regexp="^[a-zA-Z-]+$" label="Last Name" />
          <InputLogin name="username" max={16} regexp="^[a-z0-9A-Z_]+$" label="Login" />
          <InputMail name="email" max={255} label="Email" />
          <InputPassword name="password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" label="Password" />
          <InputPassword name="cpassword" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" label="Confirm password" />
          <InputFile name="profilePic" ref={this.profilePic} className="profPic" regexp="^.*.(jpg|png|jpeg|gif)$" />
          <InputButton name="submitRegister" text="Create" className="blue submitRegister" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Register)

// export default Register
