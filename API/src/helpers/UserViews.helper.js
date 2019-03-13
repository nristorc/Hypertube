const _ = require('lodash')
const UserViewsModel = require('../models/userViews.model')
const { isEmpty } = require('../utils')
const { BDD } = require('../config/constants').RESPONSES

class UserViewsHelper {
  static getLastViews(userId) {
    return new Promise((resolve, reject) => {
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
          return reject(BDD.FAILED)
        })
    })
  }

  static addUserViews(userId, movie, dirname) {
    return new Promise(async (resolve, reject) => {
      try {
        const findMatch = await UserViewsModel.find({
          $and:
          [
            { userId },
            { moviesViewed: { $elemMatch: { dirname } } },
          ],
        })
        if (isEmpty(findMatch)) {
          const findId = await UserViewsModel.findOneAndUpdate({
            userId,
          }, {
            $push: {
              moviesViewed: {
                title: movie.title,
                dirname,
                _id: movie._id,
                cover: movie.cover,
                year: movie.year,
                genres: movie.genres,
              },
            },
          })
          if (!isEmpty(findId)) return resolve()
          const doc = new UserViewsModel({
            userId,
            moviesViewed: [{
              _id: movie._id,
              title: movie.title,
              dirname,
              cover: movie.cover,
              year: movie.year,
              genres: movie.genres,
            }],
          })
          return doc.save((err) => {
            if (err) return reject()
            return resolve()
          })
        }
        await UserViewsModel.findOneAndUpdate({
          $and:
              [
                { userId },
                { moviesViewed: { $elemMatch: { dirname } } },
              ],
        }, { $set: { 'moviesViewed.$.date': Date.now() } })
        return resolve()
      } catch (err) {
        console.log('BDD Error: ', err)
        return reject(BDD.FAILED)
      }
    })
  }
}

module.exports = UserViewsHelper
