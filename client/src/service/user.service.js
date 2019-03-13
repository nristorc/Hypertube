import FetchInterfaceService from './fetchInterface.service'

const config = require('../config')
const route = require('./route.service')

const authServerFetch = new FetchInterfaceService(config.AUTH_SERVER_HOST, config.AUTH_SERVER_PORT)

const getOwnData = () => authServerFetch.get(route.GET_USER_DATA)

const update = data => authServerFetch.put(route.REGISTER_URL, data, {})

const register = data => authServerFetch.post(route.REGISTER_URL, data, {})

const sendAuthCode = (data, provider) => (
  authServerFetch.get(`${route.SEND_AUTH_CODE}${provider}`, data)
)

const updatePassword = data => (
  authServerFetch.put(route.UPDATE_PASSWORD, new URLSearchParams(data).toString())
)

const forgotPassword = data => (
  authServerFetch.put(route.FORGOTTEN_PASSWORD, new URLSearchParams(data).toString())
)

const recoverPassword = data => (
  authServerFetch.put(route.RECOVER_PASSWORD, new URLSearchParams(data).toString())
)

const login = (data) => {
  data.append('grant_type', 'password')
  data.append('client_id', config.OAUTH_ID)
  data.append('client_secret', config.OAUTH_SECRET)
  data.append('scope', 'full')
  return authServerFetch.post(route.LOGIN_URL, new URLSearchParams(data).toString())
}

const logout = data => (
  authServerFetch.delete(route.LOGOUT_URL, new URLSearchParams(data).toString())
)

const activateAccount = data => (
  authServerFetch.put(route.ACTIVATE_ACCOUNT_URL, new URLSearchParams(data).toString())
)

const getUserInfo = data => authServerFetch.get(`/user/get/${data}`)

export {
  login,
  logout,
  getUserInfo,
  register,
  update,
  recoverPassword,
  forgotPassword,
  updatePassword,
  activateAccount,
  sendAuthCode,
  getOwnData,
}
