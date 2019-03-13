const REDIRECT = {
  ROOT: '/',
  HOME: '/home',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ACC_FORGOTTEN: '/forgotten-password',
  ACC_RECOVER: '/recover-password',
  ACC_REGISTER: '/register',
  ACC_VALIDATION: '/confirm-account',
  USER_PROFILE: '/user/:id',
  MOV_SEARCH: '/mov-search',
  MOV_WATCH: '/movie/:movie',
  OAUTH_CB: '/oauth/callback/:provider(google|intraft|facebook|github|gitlab)',
  USE: '/#!user',
}

module.exports = REDIRECT
