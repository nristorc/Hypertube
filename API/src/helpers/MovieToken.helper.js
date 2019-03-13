const crypto = require('crypto')
const MovieTokenModel = require('../models/movieToken.model')
const { TOKEN, BDD } = require('../config/constants').RESPONSES
const { isEmpty } = require('../utils')

class MovieTokenHelper {
  static getToken(movieTokenDoc) {
    return movieTokenDoc.movieToken
  }

  static create(movieHash, ttlCount = 3600 * 24) {
    return new Promise((resolve, reject) => {
      const movieToken = crypto.randomBytes(64).toString('hex')
      const ttl = new Date().getTime() + ttlCount * 1000
      const doc = new MovieTokenModel({
        movieToken,
        movieHash,
        ttl,
      })
      doc.save((err, result) => {
        if (err) {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        }
        return resolve(result)
      })
    })
  }

  static delete(movieToken) {
    return new Promise((resolve, reject) => (
      MovieTokenModel.deleteOne({ movieToken })
        .then(() => resolve())
        .catch((err) => {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        })
    ))
  }

  static fetchByToken(movieToken) {
    return new Promise((resolve, reject) => (
      MovieTokenModel.findOne({ movieToken })
        .then((doc) => {
          if (isEmpty(doc)) return reject(TOKEN.WRONG_MOVIE_TOKEN(movieToken))
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        })
    ))
  }

  static checkTTL(doc) {
    return (doc.ttl > new Date().getTime())
  }
}

module.exports = MovieTokenHelper
