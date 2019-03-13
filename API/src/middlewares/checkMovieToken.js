const MovieTokenHelper = require('../helpers/MovieToken.helper')
const { TOKEN } = require('../config/constants')

const checkMovieToken = async (req, res, next) => {
  try {
    const movieTokenDoc = await MovieTokenHelper.fetchByToken(req.query.movieToken)
    if (!MovieTokenHelper.checkTTL(movieTokenDoc)) {
      MovieTokenHelper.delete(req.query.movieToken)
      return res.status(200).json(TOKEN.EXPIRED)
    }
    return next()
  } catch (err) {
    console.log('err', err)
    return res.status(400).json(err)
  }
}

module.exports = checkMovieToken
