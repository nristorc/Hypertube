const router = require('express').Router()
const { isEmpty } = require('../../utils')
const { MovieModel } = require('../../models')
const { MISSING } = require('../../config/constants').RESPONSES
const WatchListHelper = require('../../helpers/WatchList.helper')
const middlewares = require('../../middlewares')

router.post('/watchlist', middlewares.checkBearerToken, async (req, res) => {
  try {
    const { movieId } = req.body
    if (isEmpty(movieId)) return res.status(400).json(MISSING.DATA)
    const movie = await MovieModel.findOne({ _id: movieId })
    await WatchListHelper.addToWatchList(req.userDoc._id, movie)
    const data = await WatchListHelper.getFullList(req.userDoc._id)
    return res.status(200).json({ data })
  } catch (err) {
    console.log('BDD Error', err)
    return res.status(200).json(err)
  }
})

module.exports = router
