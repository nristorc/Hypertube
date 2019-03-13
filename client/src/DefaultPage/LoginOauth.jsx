import React from 'react'
import { connect } from 'react-redux'

const qs = require('querystring')
const localStorage = require('localStorage')
const { userService } = require('../service')
const { authActions } = require('../actions')


class LoginOauth extends React.Component {
  constructor(props) {
    super(props)
    this.state = { auth: 'pending' }
  }

  async componentWillMount() {
    const {
      location,
      match,
      dispatch,
      history,
    } = this.props
    const { search } = location
    const { params } = match
    const { provider } = params
    const paramsUrl = qs.parse(search.substr(1))
    if (!paramsUrl.code || paramsUrl.code === 'access_denied') {
      this.setState({ auth: 'denied' })
    }
    try {
      const result = await userService.sendAuthCode({ code: paramsUrl.code }, provider)
      if (result.accessToken) {
        localStorage.setItem('bearerToken', result)
        setTimeout(() => { history.push('/') }, 1500)
        this.setState({ auth: 'success' }, async () => {
          dispatch(authActions.loginSuccess(result))
          const data = await userService.getOwnData()
          dispatch(authActions.initUser(data))
        })
      } else {
        console.log(result)
        this.setState({ auth: 'denied' })
      }
    } catch (err) {
      console.log('Err:', err.message)
      this.setState({ auth: 'denied' })
    }
  }

  render() {
    const { auth } = this.state
    const { match } = this.props
    const { params } = match
    const { provider } = params
    const providerUpper = provider.charAt(0).toUpperCase() + provider.substring(1)
    return (
      <div className="loading">
        {auth === 'pending' && (
          <p>
            {`Waiting authorization from ${providerUpper}`}
            <br />
            <img src="/img/loading.gif" alt="loading" />
          </p>
        )}
        {auth === 'denied' && (
          <p>
            {`${providerUpper} didn't approve your authorization code`}
            <br />
            <img src="/img/error.png" width="128px" alt="loading" />
          </p>
        )}
        {auth === 'success' && (
          <p>
            {`${providerUpper} approve your authorization code`}
            <br />
            <img src="/img/valid.png" width="128px" alt="loading" />
          </p>
        )}
        {auth === 'error' && (
          <p>
            {`${providerUpper} didn't approve your authorization code`}
            <br />
            <img src="/img/error.png" width="128px" alt="loading" />
          </p>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(LoginOauth)
