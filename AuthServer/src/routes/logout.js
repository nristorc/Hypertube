const router = require('express').Router()
const { AccessTokenHelper } = require('../helpers')
const { SUCCESS, ERRORS } = require('../config/constants').RESPONSES

router.delete('/logout', async (req, res) => {
  try {
    await AccessTokenHelper.delete(req.body.token)
    return res.status(200).json(SUCCESS.USER_LOGGED_OUT({}))
  } catch (err) {
    return res.status(500).json(ERRORS.LOGOUT_ERROR(err.message))
  }
})

module.exports = router
