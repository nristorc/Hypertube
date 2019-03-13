const router = require('express').Router()
const { UserHelper } = require('../../helpers')
const middlewares = require('../../middlewares')

router.delete('/', middlewares.checkBearerToken, async (req, res) => {
  try {
    const user = await UserHelper.remove(req.userDoc._id)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
