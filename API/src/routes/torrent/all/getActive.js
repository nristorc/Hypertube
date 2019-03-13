const router = require('express').Router()
const Torrent = require('../../../helpers/Torrent.helper')
const middlewares = require('../../../middlewares')
const { TORRENT } = require('../../../config/constants')

router.get('/all/active', middlewares.checkBearerToken, (req, res) => (
  new Torrent()
    .getActive()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(200).send(TORRENT.NON_ACTIVE_TORRENT, err))
))

module.exports = router
