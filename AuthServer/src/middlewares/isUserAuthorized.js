const query = require('querystring')

const isUserAuthorized = (req, res, next) => {
  if (req.session.authorized === true) {
    console.log('Middleware isUserAuthorized: user already connected')
    return next()
  }
  console.log('Middleware isUserAuthorized: detect unconnected user')
  return res.redirect(`/login?${query.stringify(req.query)}`)
}

module.exports = isUserAuthorized
