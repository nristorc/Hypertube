const crypto = require('crypto')
const { RefreshTokenModel } = require('../models')
const { isEmpty } = require('../utils')

class RefreshTokenHelper {
  static create(userId, clientId, scopes) {
    return new Promise((resolve, reject) => {
      const refreshToken = crypto.randomBytes(64).toString('hex')
      const doc = new RefreshTokenModel({
        userId,
        clientId,
        refreshToken,
        scopes,
      })
      return doc.save((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }

  static fetchByToken(refreshToken) {
    return new Promise((resolve, reject) => (
      RefreshTokenModel.findOne({ refreshToken })
        .then((doc) => {
          if (isEmpty(doc)) return reject(new Error(`No record found from RefreshToken with refreshToken::${refreshToken}`))
          return resolve(doc)
        })
        .catch(err => reject(err))
    ))
  }

  static removeByClient(userId, clientId) {
    return new Promise((resolve, reject) => (
      RefreshTokenModel.deleteOne({ userId, clientId }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    ))
  }

  static removeByRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => (
      RefreshTokenModel.deleteOne({ refreshToken }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    ))
  }

  static getUserId(refreshTokenDoc) {
    return refreshTokenDoc.userId
  }

  static getClientId(refreshTokenDoc) {
    return refreshTokenDoc.clientId
  }

  static getScope(refreshTokenDoc) {
    return refreshTokenDoc.scopes
  }
}

module.exports = RefreshTokenHelper
