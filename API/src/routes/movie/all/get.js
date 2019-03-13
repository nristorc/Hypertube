const router = require('express').Router()
const MovieModel = require('../../../models/movies.model')
const { isEmpty } = require('../../../utils')
const { MISSING, BDD, SUCCESS } = require('../../../config/constants').RESPONSES
const middlewares = require('../../../middlewares')

const filterInt = (value) => {
  if (/^\+?\d+$/.test(value)) return Number(value)
  return NaN
}

router.get('/', middlewares.checkBearerToken, async (req, res) => {
  const page = filterInt(req.query.page)
  const hitsPerPage = filterInt(req.query.hitsPerPage)
  if (Number.isNaN(page) || Number.isNaN(hitsPerPage)) {
    return res.status(200).json(MISSING.PAGE)
  }
  const {
    query, sort, genres, rating,
  } = req.query
  const whereObj = isEmpty(query) ? {} : { title: { $regex: query, $options: 'i' } }
  if (genres && genres !== 'all') whereObj.genres = genres
  if (rating && rating !== 'all') whereObj.rating = { $gte: rating }
  const sortObj = {}
  if (sort && sort.charAt(0) === '-') sortObj[sort.substring(1)] = -1
  else if (sort) sortObj[sort] = 1
  try {
    req.query.filters = {}
    const result = await MovieModel.find(whereObj)
      .limit(hitsPerPage)
      .skip(page * hitsPerPage)
      .sort(sortObj)
    return res.status(200).json(SUCCESS.GET_ALL_MOVIES(result))
  } catch (err) {
    console.log('BDD Error:', err.message)
    return res.status(500).json(BDD.FAILED)
  }
})


module.exports = router
