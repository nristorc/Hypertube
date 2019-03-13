import React from 'react'
import queryString from 'querystring'
import NotificationSystem from 'react-notification-system'
import { userService } from '../service'
import { InputPassword, InputButton } from '../Components'
import { REDIRECT } from '../constants'

const FormData = require('form-data')

class RecoverPassword extends React.Component {
  constructor(props) {
    super(props)
    const { history } = props
    if (props.auth && props.auth.loggedIn && props.auth.loggedIn === true) {
      history.push(REDIRECT.ROOT)
    }
    this.notificationSystem = React.createRef()
  }

  sendNewPassword(event) {
    event.preventDefault()
    const { location, history } = this.props
    const { search } = location
    const params = queryString.parse(search.substring(1))
    const formData = new FormData(event.target)
    formData.append('token', params.token)
    userService.recoverPassword(formData)
      .then((ret) => {
        // console.log('Authorization server answear', ret)
        if (ret.DATA_VALIDATION) {
          this.notificationSystem.current.addNotification({
            title: 'Wrong password',
            message: "The given password dosn't meet the requirements",
            level: 'error',
          })
        } else if (ret.DATA_MISSING) {
          this.notificationSystem.current.addNotification({
            title: 'Wrong password',
            message: 'One or more arguments are missing.',
            level: 'error',
          })
        } else if (ret.UNEXIST || ret.INVALID_TOKEN || ret.MISSING_TOKEN) {
          this.notificationSystem.current.addNotification({
            title: 'Wrong link',
            message: "The recovery link isn't valid. Please try again.",
            level: 'error',
          })
        } else {
          this.notificationSystem.current.addNotification({
            title: 'Success',
            message: 'You\'re loggued. You will be redirected',
            level: 'success',
          })
          setTimeout(() => { history.push('/login') }, 1500)
        }
      })
      .catch((err) => {
        console.log('Error from fetch:', err)
      })
  }

  render() {
    return (
      <div>
        <NotificationSystem ref={this.notificationSystem} />
        <h3>Please choose a new password</h3>
        <form className="grid-form" onSubmit={this.sendNewPassword.bind(this)}>
          <InputPassword name="password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" label="Password" />
          <InputPassword name="cpassword" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" label="Confirm password" />
          <InputButton name="submitRegister" className="blue submitRegister" id="submitRegister" />
        </form>
      </div>
    )
  }
}

export default RecoverPassword
