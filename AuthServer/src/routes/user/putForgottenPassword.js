const router = require('express').Router()
const { UserHelper } = require('../../helpers')
const { ERRORS } = require('../../config/constants').RESPONSES
const { isEmpty, userIsEmail } = require('../../utils')

router.put('/forgotten-password', async (req, res) => {
  if (isEmpty(req.body) || isEmpty(req.body.redirect_uri)) {
    return res.status(200).json(ERRORS.DATA_MISSING)
  }
  if (!userIsEmail(req.body.email)) return res.status(200).json(ERRORS.INVALID_EMAIL)
  try {
    const recover = await UserHelper.addForgottenPasswordToken(req.body.email,
      req.body.redirect_uri)
    return res.status(200).json(recover)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
