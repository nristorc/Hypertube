const router = require('express').Router()
const Torrent = require('../../helpers/Torrent.helper')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES
const middlewares = require('../../middlewares')

router.get('/status', middlewares.checkBearerToken, (req, res) => {
  if (isEmpty(req.query.hash)) return res.status(200).json(ERRORS.DATA_MISSING)
  return new Torrent()
    .getStatus(req.query.hash)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(200).json(ERRORS.FILE(err.message)))
})

module.exports = router
