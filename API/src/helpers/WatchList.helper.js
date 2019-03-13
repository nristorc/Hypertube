const WatchListModel = require('../models/watchList.model')
const { BDD, WATCHLIST } = require('../config/constants').RESPONSES
const { isEmpty } = require('../utils')

class WatchListHelper {
  static getFullList(userId) {
    return new Promise((resolve, reject) => {
      WatchListModel.find({ userId })
        .then((docs) => {
          resolve(docs)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        })
    })
  }

  static addToWatchList(userId, movie) {
    return new Promise((resolve, reject) => (
      WatchListModel.find({
        $and:
          [
            { userId },
            { movieId: movie._id },
          ],
      })
        .then((res) => {
          if (!isEmpty(res)) return reject(WATCHLIST.EXIST)
          const doc = new WatchListModel({
            userId,
            movieId: movie._id,
            title: movie.title,
            cover: movie.cover,
            year: movie.year,
            description: movie.description,
          })
          return doc.save((err, result) => {
            if (err) {
              console.log('BDD Error:', err.message)
              return reject(BDD.FAILED)
            }
            return resolve(result)
          })
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    ))
  }

  static deleteFromList(userId, movieId) {
    return new Promise((resolve, reject) => (
      WatchListModel.findOneAndDelete({ userId, movieId })
        .then((doc) => {
          if (isEmpty(doc)) return reject(WATCHLIST.NO_MATCH)
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    ))
  }
}

module.exports = WatchListHelper
