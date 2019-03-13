const router = require('express').Router()
const query = require('querystring')
const middlewares = require('../middlewares')
const { UserHelper } = require('../helpers')

router.use('/authorization',
  middlewares.isUserAuthorized,
  middlewares.checkAuthGrant)

router.get('/login', (req, res) => res.render('login'))

router.get('/redirectPage', (req, res) => res.render('redirectPage'))

router.get('/authorization', (req, res) => res.render('decision'))

router.get('/decision', (req, res) => res.render('decision', { qs: query.stringify(req.query) }))

router.post('/authorization', (req, res) => res.render('redirectPage'))

router.post('/login', (req, res) => {
  const backUrl = `/authorization?${query.stringify(req.query)}`
  if (req.session.authorized === true) {
    return res.redirect(backUrl)
  }
  return UserHelper.getUserInfoByUsernameAndPassword(req.body.username, req.body.password)
    .then((user) => {
      req.session.user = user
      req.session.authorized = true
      console.log(`Redirect to backUrl: ${backUrl}`)
      res.redirect(backUrl)
    })
    .catch((err) => {
      console.log(`Login return: ${err.message}`)
      console.log(`Redirect to req.url: ${req.url}`)
      res.redirect(req.url)
    })
})

module.exports = router
