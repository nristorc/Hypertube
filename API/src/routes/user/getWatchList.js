const router = require('express').Router()
const WatchListHelper = require('../../helpers/WatchList.helper')
const middlewares = require('../../middlewares')

router.get('/watchlist', middlewares.checkBearerToken, async (req, res) => {
  try {
    const list = await WatchListHelper.getFullList(req.userDoc._id)
    return res.status(200).json(list)
  } catch (err) {
    console.log('BDD Error', err)
    return res.status(200).json(err)
  }
})

module.exports = router
