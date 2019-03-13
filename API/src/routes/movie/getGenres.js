const router = require('express').Router()
const MovieModel = require('../../models/movies.model')
const middlewares = require('../../middlewares')
const { isEmpty } = require('../../utils')
const { BDD } = require('../../config/constants').RESPONSES

router.get('/genres', middlewares.checkBearerToken, (req, res) => {
  MovieModel.find({})
    .then((docs) => {
      const genres = []
      if (isEmpty(docs)) return res.status(200).json([])
      docs.forEach((doc) => {
        if (!isEmpty(doc.genres)) {
          doc.genres.forEach((genre) => { if (genres.indexOf(genre) === -1) genres.push(genre) })
        }
      })
      return res.status(200).json(genres.sort())
    })
    .catch((err) => {
      console.log('BDD Error:', err.message)
      return res.status(500).json(BDD.FAILED)
    })
})

module.exports = router
