const router = require('express').Router()
const middlewares = require('../../middlewares')
const { UserHelper } = require('../../helpers')

router.get('/all', middlewares.checkBearerToken, async (req, res) => {
  try {
    const users = await UserHelper.getAllUsersInfo()
    return res.status(200).json(users)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
