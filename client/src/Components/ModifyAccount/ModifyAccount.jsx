import React from 'react'
import {
  InputMail, UserPic, InputButton,
  InputFile, InputText, InputLogin,
} from '..'
import NotificationSystem from 'react-notification-system'
import { userService } from '../../service'

const FormData = require('form-data')

class ModifyAccount extends React.Component {
  constructor(props) {
    super(props)
    this.notificationSystem = React.createRef()
    const { language } = this.props.userDoc
    this.state = {
      language,
    }
  }

  update(event) {
    event.preventDefault()
    const formObj = new FormData(event.target)
    userService.update(formObj)
      .then((ret) => {
        if (ret.ok) {
          this.notificationSystem.current.addNotification({
            title: 'Success',
            message: 'Your profile has been updated',
            level: 'success',
          })
        }
        if (ret.INVALID_FIRSTNAME) {
          this.notificationSystem.current.addNotification({
            title: 'Error',
            message: 'Invalid firstname',
            level: 'error',
          })
        }
        if (ret.INVALID_LASTNAME) {
          this.notificationSystem.current.addNotification({
            title: 'Error',
            message: 'Invalid lastname',
            level: 'error',
          })
        }
        if (ret.INVALID_USERNAME) {
          this.notificationSystem.current.addNotification({
            title: 'Error',
            message: 'Invalid username',
            level: 'error',
          })
        }
        if (ret.message && ret.message.NO_MODIFICATION) {
          this.notificationSystem.current.addNotification({
            title: 'Warning',
            message: 'No modifications done',
            level: 'warning',
          })
        }
        if (ret.FORMAT_PICTURE) {
          this.notificationSystem.current.addNotification({
            title: 'Error',
            message: 'Your picture has a wrong format',
            level: 'error',
          })
        }
      })
      .catch((err) => {
        console.log('Error from fetch:', err)
      })
  }

  updateLanguage(e) {
    this.setState({ language: e.currentTarget.value })
  }

  render() {
    const { userDoc } = this.props
    let language
    if (this.state.language === undefined) {
      language = userDoc.language
    } else {
      language = this.state.language
    }
    const {
      firstname, lastname, username, email, profilePic, oauthOrigin,
    } = userDoc
    return (
      <div>
        <NotificationSystem ref={this.notificationSystem} />
        <form className="account-form" onSubmit={this.update.bind(this)}>
          <UserPic src={profilePic} />
          {oauthOrigin
            ? (
              <span>
                <InputText name="firstname" label="First Name" placeholder={firstname} regexp="^[a-zA-Z-]+$" disabled disabledClass="disabled" />
                <InputText name="lastname" label="Last Name" placeholder={lastname} max={32} regexp="^[a-zA-Z-]+$" disabled disabledClass="disabled" />
                <InputLogin name="username" label="username" placeholder={username} regexp="^[a-z0-9A-Z_]+$" disabled disabledClass="disabled" />
                <InputMail name="email" label="Email" placeholder={email} max={32} disabled disabledClass="disabled" />
              </span>
            )
            : (
              <span>
                <InputText name="firstname" label="First Name" placeholder={firstname} regexp="^[a-zA-Z-]+$" />
                <InputText name="lastname" label="Last Name" placeholder={lastname} max={32} regexp="^[a-zA-Z-]+$" />
                <InputLogin name="username" label="username" placeholder={username} regexp="^[a-z0-9A-Z_]+$" />
                <InputMail name="email" label="Email" placeholder={email} max={32} />
                <InputFile name="profilePic" className="profPic" />
              </span>
            )
          }
          <div>
            <label>
              <input type="radio" className="buttonLanguage" name="language" value="ENGLISH" checked={language === 'ENGLISH'} onChange={this.updateLanguage.bind(this)} />
              <img alt="EN" className="language" src="/img/languageEn.png" />
            </label>
            <label>
              <input type="radio" className="buttonLanguage" name="language" value="FRENCH" checked={language === 'FRENCH'} onChange={this.updateLanguage.bind(this)} />
              <img alt="FR" className="language" src="/img/languageFr.png" />
            </label>
            <label>
              <input type="radio" className="buttonLanguage" name="language" value="GERMAN" checked={language === 'GERMAN'} onChange={this.updateLanguage.bind(this)} />
              <img alt="EN" className="language" src="/img/languageDe.png" />
            </label>
            <label>
              <input type="radio" className="buttonLanguage" name="language" value="SPANISH" checked={language === 'SPANISH'} onChange={this.updateLanguage.bind(this)} />
              <img alt="FR" className="language" src="/img/languageEs.png" />
            </label>
          </div>
          <InputButton name="submitModifAccount" id="submitModifAccount" value="Update"/>
        </form>
      </div>
    )
  }
}

export default ModifyAccount
