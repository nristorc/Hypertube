const router = require('express').Router()
const Torrent = require('../../helpers/Torrent.helper')
const { isEmpty } = require('../../utils')
const { MISSING, ERRORS } = require('../../config/constants').RESPONSES
const middlewares = require('../../middlewares')

router.get('/files', middlewares.checkBearerToken, (req, res) => {
  if (isEmpty(req.query.filename)) return res.status(200).json(MISSING.FILE)
  return new Torrent()
    .getFiles(req.query.filename)
    .then(files => res.status(200).json(files))
    .catch(err => res.status(200).json(ERRORS.FILE(err.message)))
})

module.exports = router
