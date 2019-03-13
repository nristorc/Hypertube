const router = require('express').Router()
const { isEmpty } = require('../../utils')
const { MovieModel } = require('../../models')
const { MISSING } = require('../../config/constants').RESPONSES
const WatchListHelper = require('../../helpers/WatchList.helper')
const middlewares = require('../../middlewares')

router.delete('/watchlist', middlewares.checkBearerToken, async (req, res) => {
  try {
    const { movieId } = req.body
    if (isEmpty(movieId)) return res.status(400).json(MISSING.DATA)
    await MovieModel.findOne({ _id: movieId })
    console.log(`Deleted movieId:${movieId} from user ${req.userDoc._id}`)
    await WatchListHelper.deleteFromList(req.userDoc._id, movieId)
    const data = await WatchListHelper.getFullList(req.userDoc._id)
    return res.status(200).json({ data })
  } catch (err) {
    console.log('BDD Error', err)
    return res.json(err.message)
  }
})

module.exports = router
