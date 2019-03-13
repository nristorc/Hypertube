const router = require('express').Router()
const { UserHelper } = require('../../helpers')
const { ERRORS } = require('../../config/constants').RESPONSES
const { isEmpty } = require('../../utils/')

router.put('/confirm-account', async (req, res) => {
  if (isEmpty(req.body.token)) return res.status(200).json(ERRORS.MISSING_TOKEN)
  try {
    const response = await UserHelper.setUserAccountActive(req.body.token)
    return res.status(200).json(response)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
