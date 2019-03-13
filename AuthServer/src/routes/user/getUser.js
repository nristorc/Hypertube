const router = require('express').Router()
const fs = require('fs')
const _ = require('lodash')
const { SERVER } = require('../../config/config')
const middlewares = require('../../middlewares')
const { UserHelper } = require('../../helpers')
const UserViewsModel = require('../../models/userViews.model')
const { isEmpty } = require('../../utils')


const getLastViews = userId => (
  new Promise((resolve, reject) => (
    UserViewsModel.findOne({ userId })
      .then((docs) => {
        if (isEmpty(docs)) return resolve([])
        const lastViews = []
        docs.moviesViewed.forEach((movie) => {
          if (_.find(lastViews, { title: movie.title }) === undefined) {
            lastViews.push(movie)
          }
        })
        return resolve(lastViews)
      })
      .catch((err) => {
        console.log('BDD Error:', err.message)
        return reject(err)
      })
  ))
)

router.get('/get/:id', middlewares.checkBearerToken, async (req, res) => {
  try {
    let user = await UserHelper.getUserInfoById(req.params.id)
    if (isEmpty(user.oauthOrigin)) {
      const pic = user.profilePic.split('/')
      const checkPic = pic[pic.length - 1]
      const checkIfExist = fs.existsSync(`./src/assets/profilePictures/${checkPic}`)
      if (!checkIfExist) user.profilePic = `http://${SERVER.HOST}:${SERVER.PORT}/assets/avatar.png`
    }
    const moviesViewed = await getLastViews(req.params.id)
    user = Object.assign({}, { moviesViewed }, user.toObject())
    return res.json(user)
  } catch (err) {
    console.log('Error:', err)
    return res.status(200).json(err)
  }
})

router.get('/get', middlewares.checkBearerToken, async (req, res) => {
  try {
    const { userDoc } = req
    const moviesViewed = await getLastViews(userDoc._id)
    const user = Object.assign({}, { moviesViewed }, userDoc.toObject())
    return res.status(200).json(user)
  } catch (err) {
    return res.status(200).json(err)
  }
})

module.exports = router
