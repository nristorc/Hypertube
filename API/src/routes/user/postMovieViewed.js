const router = require('express').Router()
const { isEmpty } = require('../../utils')
const { MovieModel } = require('../../models')
const { MISSING } = require('../../config/constants').RESPONSES
const UserViews = require('../../helpers/UserViews.helper')
const middlewares = require('../../middlewares')

router.post('/viewedlist', middlewares.checkBearerToken, async (req, res) => {
  try {
    const { movieId, dirname } = req.body
    if (isEmpty(movieId) || isEmpty(dirname)) return res.status(400).json(MISSING.DATA)
    const movie = await MovieModel.findOne({ _id: movieId })
    await UserViews.addUserViews(req.userDoc._id, movie, dirname.slice(0, -1))
    const userViews = await UserViews.getLastViews(req.userDoc._id)
    if (userViews.length === 0) return res.status(200).json([])
    return res.status(200).json(userViews)
  } catch (err) {
    console.log('BDD Error', err)
    return res.status(200).json(err)
  }
})

module.exports = router
