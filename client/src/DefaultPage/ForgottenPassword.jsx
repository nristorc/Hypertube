import React from 'react'
import NotificationSystem from 'react-notification-system'
import { connect } from 'react-redux'
import { InputMail, InputButton } from '../Components'
import { REDIRECT } from '../constants'

const FormData = require('form-data')
const { userService } = require('../service')

class ForgottenPassword extends React.Component {
  constructor(props) {
    super(props)
    const { auth, history } = props
    const { loggedIn } = auth
    if (loggedIn === true) {
      history.push(REDIRECT.ROOT)
    }
    this.notificationSystem = React.createRef()
  }

  forgot(event) {
    const { history } = this.props
    event.preventDefault()
    const obj = new FormData(event.target)
    obj.append('redirect_uri', 'http://127.0.0.1:3000/recover-password')
    userService.forgotPassword(obj)
      .then((ret) => {
        if (ret.UNEXIST || ret.MAIL_FAIL) {
          if (ret.UNEXIST) {
            this.notificationSystem.current.addNotification({
              title: 'Error!',
              message: 'No account associated with this email was found',
              level: 'warning',
            })
          }
          if (ret.MAIL_FAIL) {
            this.notificationSystem.current.addNotification({
              title: 'Mail',
              message: 'An email can\'t be sent. Contact admin@hypertube.fr',
              level: 'warning',
            })
          }
        } else {
          this.notificationSystem.current.addNotification({
            title: 'Success',
            message: 'An email has been sent to your account',
            level: 'success',
          })
          setTimeout(() => { history.push('/login') }, 1500)
        }
      })
      .catch((err) => {
        this.notificationSystem.current.addNotification({
          title: 'Error',
          message: 'Bad response from authorization server.',
          level: 'error',
        })
        console.log('Error:', err)
      })
  }

  render() {
    return (
      <div>
        <h1>Your email</h1>
        <NotificationSystem ref={this.notificationSystem} />
        <form className="grid-form" onSubmit={this.forgot.bind(this)}>
          <InputMail name="email" max={255} label="Email" />
          <InputButton name="submitRegister" className="blue submitRegister" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(ForgottenPassword)
