import React from 'react'
import NotificationSystem from 'react-notification-system'
import { InputButton, InputPassword } from '..'
import { userService } from '../../service'

const FormData = require('form-data')

class ModifyAccountPassword extends React.Component {
  constructor(props) {
    super(props)
    this.notificationSystem = React.createRef()
    this.state = { errors: {}, status: 'pending' }
  }

  updatePassword(event) {
    event.preventDefault()
    const formObj = new FormData(event.target)
    userService.updatePassword(formObj)
      .then((ret) => {
        if (ret.ok) {
          this.setState({ errors: {}, status: 'success' })
        } else {
          this.setState({ errors: ret, status: 'error' })
        }
      })
      .catch((err) => {
        console.log('Error from fetch:', err)
        this.setState({ errors: err, status: 'error' })
      })
  }

  render() {
    const { status, errors } = this.state
    return (
      <div>
        <NotificationSystem ref={this.notificationSystem} />
        <form className="account-form" onSubmit={this.updatePassword.bind(this)}>
          {status === 'success' && <p className="success-msg">Success!</p>}
          {errors.MISSING_DATA && <p className="error-msg">Some informations are missing!</p>}
          {errors.INCORRECT_PASSWORD && <p className="error-msg">Bad current password!</p>}
          {errors.INCORRECT_NEW_PASSWORD && <p className="error">Bad new password!</p>}
          <InputPassword name="currentPassword" label="Current password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" />
          <InputPassword name="password" label="New password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" />
          <InputPassword name="confirmPassword" label="Confirm new password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" />
          <InputButton name="submitModifPassword" className="submitModifPassword" text="Modify" />
        </form>
      </div>
    )
  }
}

export default ModifyAccountPassword
