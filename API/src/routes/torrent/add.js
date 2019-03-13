const router = require('express').Router()
const Torrent = require('../../helpers/Torrent.helper')
const MovieTokenHelper = require('../../helpers/MovieToken.helper')
const { isEmpty } = require('../../utils')
const { ERRORS, SUCCESS, BDD } = require('../../config/constants').RESPONSES
const middlewares = require('../../middlewares')

router.post('/', middlewares.checkBearerToken, async (req, res) => {
  try {
    if (isEmpty(req.body.torrentUrl)) return res.status(200).json(ERRORS.DATA_MISSING)
    const result = await new Torrent().add(req.body.torrentUrl)
    let status = await new Torrent().getStatus(result.hashString)
    const movieTokenDoc = await MovieTokenHelper.create(result.hashString)
    status = Object.assign({}, status, { movieToken: movieTokenDoc.movieToken })
    return res.status(200).json(SUCCESS.ADD_TORRENT(status))
  } catch (err) {
    console.log('BDD Error:', err.message)
    return res.status(500).json(BDD.FAILED)
  }
})

module.exports = router
