const { MIDDLEWARE_ERRORS } = require('../config/constants').RESPONSES
const { isEmpty } = require('../utils')
const PROVIDERS = require('../config/providers')

const checkOauthCb = (req, res, next) => {
  if (!req.query.code) return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_CODE)
  if (!req.params.provider) return res.status(200).json(MIDDLEWARE_ERRORS.MISSING_PROVIDER)
  if (isEmpty(PROVIDERS[req.params.provider.toUpperCase()])) {
    return res.status(200).json(MIDDLEWARE_ERRORS.INCORRECT_PROVIDER)
  }
  return next()
}

module.exports = checkOauthCb
