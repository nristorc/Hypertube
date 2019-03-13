const query = require('querystring')
const { MIDDLEWARE_ERRORS } = require('../config/constants').RESPONSES
const { ClientHelper } = require('../helpers')
const { code } = require('./authorization_code')

const checkClientCreds = async (req, res) => {
  const clientId = req.query.client_id
  const clientSecret = req.query.client_secret
  const responseType = req.query.response_type
  const redirectUri = req.query.redirect_uri
  const { scope } = req.query
  if (!clientId) return res.status(400).json(MIDDLEWARE_ERRORS.MISSING_CLIENT_ID)
  if (clientSecret) return res.status(400).json(MIDDLEWARE_ERRORS.FORBIDDEN_CLIENT_SECRET)
  if (!responseType) return res.status(400).json(MIDDLEWARE_ERRORS.MISSING_RESPONSE_TYPE)
  if (responseType !== 'code') return res.status(400).json(MIDDLEWARE_ERRORS.INCORRECT_RESPONSE_TYPE)
  const grantType = 'authorization_code'
  try {
    const client = await ClientHelper.fetchById(clientId)
    const clientRedirectUri = ClientHelper.getRedirectUri(client)
    if (!clientRedirectUri) return res.status(400).json(MIDDLEWARE_ERRORS.CLIENT_HAS_NO_REDIR_URI)
    if (!ClientHelper.checkRedirectUri(client, redirectUri)) {
      return res.status(400).json(MIDDLEWARE_ERRORS.INCORRECT_REDIRECT_URI)
    }
    await ClientHelper.checkGrantType(client, grantType)
    const scopes = await ClientHelper.transformScope(scope)
    await ClientHelper.checkScope(client, scopes)
    if (!req.session.user) return res.status(400).json(MIDDLEWARE_ERRORS.NO_ACTIVE_SESSION)
    if (req.method === 'GET') return res.redirect(`/decision?${query.stringify(req.query)}`)
    const codeDoc = await code(req, res, clientRedirectUri, scopes)
    if (codeDoc !== '') return res.redirect(`clientRedirectUri?${query.stringify({ code: codeDoc })}`)
    return res.redirect(clientRedirectUri)
  } catch (err) {
    return res.status(400).json({ err: err.message })
  }
}

module.exports = checkClientCreds
