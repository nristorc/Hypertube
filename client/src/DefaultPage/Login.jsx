import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import React from 'react'
import NotificationSystem from 'react-notification-system'
import {
  InputText, InputPassword, InputButton,
} from '../Components'
import { authActions } from '../actions'
import { REDIRECT } from '../constants'
import { userService } from '../service'

const FormData = require('form-data')

class Login extends React.Component {
  constructor(props) {
    super(props)
    const { auth, history } = props
    const { loggedIn } = auth
    if (loggedIn === true) {
      history.push(REDIRECT.ROOT)
    }
    this.notificationSystem = React.createRef()
  }

  login(event) {
    event.preventDefault()
    const { dispatch, history } = this.props
    const formObj = new FormData(event.target)
    userService.login(formObj)
      .then(async (ret) => {
        if (ret.access_token) {
          this.notificationSystem.current.addNotification({
            title: 'Success',
            message: 'You\'re loggued. You will be redirected',
            level: 'success',
          })
          dispatch(authActions.loginSuccess(ret))
          const data = await userService.getOwnData()
          dispatch(authActions.initUser(data))
          setTimeout(() => { history.push('/') }, 1500)
        } else {
          if (ret.USER_NOT_ACTIVATED) {
            this.notificationSystem.current.addNotification({
              title: 'Informations are missing',
              message: 'Your account has not been activated yet',
              level: 'warning',
            })
          }
          if (ret.MISSING_USER_PASS) {
            this.notificationSystem.current.addNotification({
              title: 'Informations are missing',
              message: 'Some informations are missing to validate your form',
              level: 'warning',
            })
          }
          if (ret.INVALID_PASSWORD) {
            this.notificationSystem.current.addNotification({
              title: 'Wrong password',
              message: 'Bad password given',
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
          if (ret.UNEXIST) {
            this.notificationSystem.current.addNotification({
              title: 'Account',
              message: 'Unknown account',
              level: 'warning',
            })
          }
        }
      })
      .catch((err) => {
        this.notificationSystem.current.addNotification({
          title: 'Error',
          message: 'Bad response from authorization server.',
          level: 'error',
        })
        console.log('Error from fetch:', err)
      })
  }

  render() {
    const urlGoogle = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=742615774585-e4ruhgb9mse90a5cjvc20mgue7pgamsa.apps.googleusercontent.com&response_type=code&redirect_uri=http://127.0.0.1:3000/oauth/callback/google&scope=openid%20email%20profile&prompt=consent'
    const url42 = 'https://api.intra.42.fr/oauth/authorize?client_id=0d1bcc8389f05871c56476cbd58f1205d670d9c9d31ca00c721de43554737afc&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Foauth%2Fcallback%2Fintraft&response_type=code'
    const urlFb = 'https://www.facebook.com/v3.2/dialog/oauth?client_id=776061746097569&redirect_uri=http://localhost:3000/oauth/callback/facebook&scope=email%2Cpublic_profile'
    const urlGithub = 'https://github.com/login/oauth/authorize?client_id=fe47f59188aa4d142c6a&redirect_uri=http://localhost:3000/oauth/callback/github&state=test&scope=user email'
    const urlGitlab = 'https://gitlab.com/oauth/authorize?client_id=8df387e1f76535f04f06bd4ec662dc7d5f3055f5b271e70f661be2623eb05c65&redirect_uri=http://localhost:3000/oauth/callback/gitlab&response_type=code&state=test&scope=read_user profile email'

    return (
      <div>
        <h1>Login</h1>

        <NotificationSystem ref={this.notificationSystem} />
        <form className="grid-form" onSubmit={this.login.bind(this)}>
          <InputText name="username" regexp="^[a-z0-9A-Z_]+$" label="Login" />
          <InputPassword name="password" regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !@#$%^&*()_+\-=[\]{};':\\|,.<>/?]).{6,}$" label="Mot de passe" />
          <InputButton name="submitRegister" className="blue submitRegister" />
          <br />
          <div className="grid2-form">
            <a id="googleBtn" className="customBtn customGPlusSignIn" href={urlGoogle}>
              <span className="iconGoogle" />
              <span className="buttonText">Google</span>
            </a>
            <a id="42Btn" className="customBtn customGPlusSignIn" href={url42}>
              <span className="icon42" />
              <span className="buttonText">Intranet</span>
            </a>
            <a id="fbBtn" className="customBtn customGPlusSignIn" href={urlFb}>
              <span className="iconFb" />
              <span className="buttonText">Facebook</span>
            </a>
            <a id="fbBtn" className="customBtn customGPlusSignIn" href={urlGithub}>
              <span className="iconGithub" />
              <span className="buttonText">Github</span>
            </a>
            <a id="fbBtn" className="customBtn customGPlusSignIn" href={urlGitlab}>
              <span className="iconGitlab" />
              <span className="buttonText">Gitlab&nbsp;&nbsp;</span>
            </a>
            <p />
            <Link to={REDIRECT.ACC_FORGOTTEN} className="col s12 m6 btn">Account forgotten</Link>
            <Link to={REDIRECT.ACC_REGISTER} className="col s12 m6 btn">Create an account</Link>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Login)
