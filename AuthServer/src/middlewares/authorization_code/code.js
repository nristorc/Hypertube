const { AuthorizationCodeHelper } = require('../../helpers')

const code = async (req, res, clientRedirectUri, scopes) => {
  if (req.body.decision && req.body.decision === '1') {
    const doc = await AuthorizationCodeHelper.create(req.session.user._id,
      req.query.client_id, clientRedirectUri, scopes)
    return Promise.resolve(doc.authorizationCode)
  }
  return Promise.resolve('')
}

module.exports = code
