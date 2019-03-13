const router = require('express').Router()
const { UserHelper } = require('../../helpers')
const { ERRORS } = require('../../config/constants').RESPONSES
const { isEmpty, userIsPassword } = require('../../utils')

router.put('/recover-password', async (req, res) => {
  if (isEmpty(req.body.token)) {
    return res.status(200).json(ERRORS.MISSING_TOKEN)
  }
  if (isEmpty(req.body.password) || isEmpty(req.body.cpassword)) {
    return res.status(200).json(ERRORS.DATA_MISSING)
  }
  if (!userIsPassword(req.body.password, req.body.cpassword)) {
    return res.status(200).json(ERRORS.DATA_VALIDATION)
  }
  try {
    const recover = await UserHelper.setRecoverPassword(req.body.token, req.body)
    if (recover === 'NoMatch') return res.status(200).json(ERRORS.INVALID_TOKEN)
    return res.status(200).json(recover)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
