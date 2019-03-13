const router = require('express').Router()
const middlewares = require('../middlewares')
const { ERRORS, MIDDLEWARE_ERRORS } = require('../config/constants').RESPONSES
const {
  AuthorizationCodeHelper,
  RefreshTokenHelper,
  AccessTokenHelper,
  UserHelper,
  ClientHelper,
} = require('../helpers')

router.use('/token',
  middlewares.checkToken)

const returnAuthCodeGrant = async (req, res) => {
  const responseObject = {
    token_type: 'Bearer',
  }
  try {
    const [doc, docClient] = await Promise.all([
      AuthorizationCodeHelper.fetchByCode(req.body.code),
      ClientHelper.fetchById(req.body.client_id),
    ])
    await Promise.all([
      AuthorizationCodeHelper.checkClient(doc, req.oauthClient),
      AuthorizationCodeHelper.checkTTL(doc),
      AuthorizationCodeHelper.checkRedirectUri(doc, req.oauthClient),
      RefreshTokenHelper.removeByClient(doc.userId, req.oauthClient.clientId),
    ])
    if (docClient.grantTypes.indexOf('refresh_token') > -1) {
      const refreshToken = await RefreshTokenHelper.create(doc.userId, doc.clientId, doc.scopes)
      responseObject.refresh_token = refreshToken.refreshToken
    }
    const result = await AccessTokenHelper.create(doc.userId, doc.clientId, doc.scopes)
    responseObject.access_token = result.accessToken
    responseObject.expires_in = result.ttl
    await AuthorizationCodeHelper.removeByAuthCode(req.body.code)
    return res.status(200).json(responseObject)
  } catch (err) {
    return res.status(500).json(err)
  }
}

const returnPasswordGrant = async (req, res) => {
  const responseObject = {
    token_type: 'Bearer',
  }
  const { username, password } = req.body
  try {
    const [doc, user, scope] = await Promise.all([
      ClientHelper.fetchById(req.body.client_id),
      UserHelper.getUserInfoByUsernameAndPassword(username, password),
      ClientHelper.transformScope(req.body.scope),
    ])
    await Promise.all([
      ClientHelper.checkScope(doc, scope),
      RefreshTokenHelper.removeByClient(user._id, req.oauthClient.clientId),
    ])
    if (doc.grantTypes.indexOf('refresh_token') > -1) {
      const refreshToken = await RefreshTokenHelper.create(user._id, doc.clientId, doc.scopes)
      responseObject.refresh_token = refreshToken.refreshToken
    }
    const result = await AccessTokenHelper.create(user._id, doc.clientId, doc.scopes)
    responseObject.access_token = result.accessToken
    responseObject.expires_in = result.ttl
    return res.status(200).json(responseObject)
  } catch (err) {
    return res.status(200).json(err)
  }
}

const returnClientCredGrant = (req, res) => (
  res.status(200).json(ERRORS.CLIENT_ERROR)
)

const returnRefreshToken = (req, res) => (
  res.status(200).json(ERRORS.CLIENT_ERROR)
)

router.post('/token', (req, res) => {
  if (req.body.grant_type === 'authorization_code'
    || req.body.grant_type === 'code') {
    return returnAuthCodeGrant(req, res)
  }
  if (req.body.grant_type === 'password') {
    return returnPasswordGrant(req, res)
  }
  if (req.body.grant_type === 'client_credentials') {
    return returnClientCredGrant(req, res)
  }
  if (req.body.grant_type === 'refresh_token') {
    return returnRefreshToken(req, res)
  }
  return res.status(500).json(MIDDLEWARE_ERRORS.INCORRECT_GRANT_TYPE)
})

module.exports = router
