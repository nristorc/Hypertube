const router = require('express').Router()
const { UserHelper } = require('../../helpers')
const middlewares = require('../../middlewares')
const { USER } = require('../../config/constants').RESPONSES
const { isEmpty } = require('../../utils')

router.put('/password', middlewares.checkBearerToken, async (req, res) => {
  try {
    if (!isEmpty(req.userDoc.oauthOrigin)) {
      return res.status(200).json(USER.OAUTH_PASS)
    }
    await UserHelper.setNewPassword(req.userDoc, req.body)
    return res.status(200).json({ ok: 'OK' })
  } catch (err) {
    console.log('err', err)
    return res.status(200).json(err)
  }
})

module.exports = router
