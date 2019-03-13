import { AUTH } from '../constants'

const localStorage = require('localStorage')

const initialState = {
  userDoc: null,
  moviesViewed: [],
}

initialState.loggedIn = false
try {
  const bearer = JSON.parse(localStorage.getItem('bearerToken'))
  if (!bearer) {
    initialState.loggedIn = false
  } else {
    const exp = bearer.expires_in || bearer.expiresIn || bearer.ttl
    if (bearer && typeof bearer === 'object' && exp) {
      initialState.loggedIn = exp > new Date().getTime()
    }
  }
} catch (e) {
  console.log('Auth reducer error:', e.message)
  localStorage.setItem('bearerToken', null)
  initialState.loggedIn = false
}

export const auth = (state = initialState, action) => {
  const moviesViewed = (state) ? state.moviesViewed : null
  const isExist = (moviesViewed) ? moviesViewed.find(x => x.movieId === action.movieId) : null
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, {
        userDoc: action.data,
        moviesViewed: action.data.moviesViewed,
      })
    case AUTH.LOGIN_SUCCESS:
      localStorage.setItem('bearerToken', JSON.stringify(action.data))
      return Object.assign({}, state, {
        loggedIn: true,
        userDoc: action.data,
      })
    case 'UPDATE_USER_DOC':
      if (JSON.stringify(action.data) === JSON.stringify(state.userDoc)) return state
      return Object.assign({}, state, { userDoc: action.data })
    case 'PUSH_USER_MOVIES':
      if (isExist) return state
      moviesViewed.push({ _id: action.movieId })
      return Object.assign({}, state, { moviesViewed })
    case 'UPDATE_USER_MOVIES':
      return Object.assign({}, state, { moviesViewed: action.data })
    case AUTH.LOGIN_FAILURE:
      return Object.assign({}, state, {
        loggedIn: false,
        userDoc: null,
      })
    case AUTH.LOGOUT_REQUEST:
      localStorage.clear()
      return Object.assign({}, state, {
        loggedIn: false,
        userDoc: null,
      })
    default:
      return state
  }
}
