import { AUTH } from '../constants'

const initUser = data => dispatch => dispatch({ type: 'INIT', data })
const logout = () => dispatch => dispatch({ type: AUTH.LOGOUT_REQUEST })
const loginSuccess = data => dispatch => dispatch({ type: AUTH.LOGIN_SUCCESS, data })
const loginFail = () => dispatch => dispatch({ type: AUTH.LOGIN_FAILURE })
const updateUser = data => dispatch => dispatch({ type: 'UPDATE_USER_DOC', data })
const pushMovieViewed = movieId => dispatch => dispatch({ type: 'PUSH_USER_MOVIES', movieId })
const updateMoviesViewed = data => dispatch => dispatch({ type: 'UPDATE_USER_MOVIES', data })

export const authActions = {
  initUser,
  pushMovieViewed,
  updateMoviesViewed,
  updateUser,
  loginSuccess,
  loginFail,
  logout,
}
