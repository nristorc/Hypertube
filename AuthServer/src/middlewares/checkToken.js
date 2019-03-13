const { MIDDLEWARE_ERRORS } = require('../config/constants').RESPONSES
const { ClientHelper } = require('../helpers')

const checkClientCreds = async (req, res, next) => {
  const clientId = req.body.client_id
  const clientSecret = req.body.client_secret
  const grantType = req.body.grant_type
  const redirectUri = req.body.redirect_uri
  const { username, password } = req.body
  if (!clientId) return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_CLIENT_ID)
  if (!clientSecret) return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_CLIENT_SECRET)
  if (!grantType) return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_RESPONSE_TYPE)
  if (grantType === 'password' && (!username || !password)) {
    return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_USER_PASS)
  }
  if (!redirectUri && grantType === 'authorization_code') {
    return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_REDIRECT_URI)
  }
  try {
    const client = await ClientHelper.fetchById(clientId)
    await ClientHelper.checkSecret(client, clientSecret)
    await ClientHelper.checkGrantType(client, grantType)
    req.oauthClient = client
    console.log('Middleware checkClientExist: success')
    return next()
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = checkClientCreds
