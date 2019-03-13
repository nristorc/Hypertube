const router = require('express').Router()
const validator = require('validator')
const fs = require('fs')
const { SERVER } = require('../../../config/config')
const MovieModel = require('../../../models/movies.model')
const CommentsModel = require('../../../models/comments.model')
const { isEmpty } = require('../../../utils')
const { BDD, MOVIE } = require('../../../config/constants').RESPONSES
const middlewares = require('../../../middlewares')
/*
** Get details about a movie
*/

const getComments = async title => (
  CommentsModel.aggregate([{
    $lookup:
      {
        from: 'users',
        localField: 'by',
        foreignField: '_id',
        as: 'user',
      },
  }, { $match: { movie: title } }, { $sort: { _id: -1 } }, { $limit: 10 }])
)

router.get('/:movie/', middlewares.checkBearerToken, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.movie)) return res.status(200).json(MOVIE.UNEXIST)
    let movie = await MovieModel.findOne({ _id: req.params.movie })
    if (isEmpty(movie)) return res.status(200).json(MOVIE.UNEXIST)
    const comments = await getComments(movie.title)
    for (let i = 0; i < comments.length; i += 1) {
      if (isEmpty(comments[i].user[0].oauthOrigin)) {
        const pic = comments[i].user[0].profilePic.split('/')
        const checkPic = pic[pic.length - 1]
        const checkIfExist = fs.existsSync(`../AuthServer/src/assets/profilePictures/${checkPic}`)
        if (!checkIfExist) comments[i].user[0].profilePic = `http://${SERVER.HOST}:5000/assets/avatar.png`
      }
    }
    if (!isEmpty(comments)) { movie = Object.assign({}, { comments }, movie.toObject()) }
    return res.json([movie])
  } catch (err) {
    console.log('BDD Error:', err.message)
    return res.status(500).json(BDD.FAILED)
  }
})

module.exports = router
