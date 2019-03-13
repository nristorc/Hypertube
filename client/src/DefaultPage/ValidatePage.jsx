import React from 'react'
import queryString from 'querystring'
import { userService } from '../service'

const FormData = require('form-data')

class ValidatePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validationState: 'pending',
      errors: {},
    }
  }

  componentDidMount() {
    const { location, history } = this.props
    const { search } = location
    const params = queryString.parse(search.substring(1))
    const formData = new FormData()
    formData.append('token', params.token)
    userService.activateAccount(formData)
      .then((ret) => {
        if (ret.UNEXIST || ret.ALREADY_CONFIRM || ret.FAILED) {
          this.setState({ validationState: 'error', errors: ret })
        } else {
          this.setState({ validationState: 'success', errors: {} })
          setTimeout(() => { history.push('/') }, 1500)
        }
      })
      .catch((err) => {
        console.log('Error from fetch:', err)
        this.setState({ validationState: 'error', errors: {} })
      })
  }

  render() {
    const { validationState } = this.state
    const { errors } = this.state
    return (
      <div>
        <h3>Check of your account...</h3>
        {errors.FAILED
          && <p>Failed to interact with database.</p>
        }
        {validationState === 'pending'
          && <p>Trying to validate your account, please wait... </p>
        }
        {validationState === 'success'
          && <p>Your account has been validated.</p>
        }
        {validationState === 'error' && errors.UNEXIST
          && <p>The user with this token was not found.....</p>
        }
        {validationState === 'error' && errors.ALREADY_CONFIRM
          && <p>This account is already validated.</p>
        }
      </div>
    )
  }
}

export default ValidatePage
