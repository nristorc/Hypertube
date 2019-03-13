const router = require('express').Router()
const validator = require('validator')
const CommentsModel = require('../../../models/comments.model')
const MovieModel = require('../../../models/movies.model')
const { isEmpty } = require('../../../utils')
const middlewares = require('../../../middlewares')
const {
  MISSING,
  MOVIE,
  BDD,
  INVALID,
} = require('../../../config/constants').RESPONSES

router.post('/:movie/comment', middlewares.checkBearerToken, async (req, res) => {
  if (isEmpty(req.body.comment)) return res.status(200).json(MISSING.DATA)
  try {
    if (!validator.isMongoId(req.params.movie)) return res.status(200).json(MOVIE.UNEXIST)
    const movie = await MovieModel.findOne({ _id: req.params.movie })
    if (isEmpty(movie)) return res.status(200).json(MOVIE.UNEXIST)
    if (req.body.comment.length > 2500) return res.status(200).json(INVALID.COMMENT_LENGTH)
    new CommentsModel({
      by: req.userDoc._id,
      movie: movie.title,
      comment: req.body.comment,
    }).save()
    return res.status(200).json({ ok: 'ok' })
  } catch (err) {
    console.log('BDD Error:', err.message)
    return res.status(500).json(BDD.FAILED)
  }
})

module.exports = router
