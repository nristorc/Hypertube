const crypto = require('crypto')
const moment = require('moment')
const { AccessTokenModel } = require('../models')
const { BDD, TOKEN } = require('../config/constants')
const { isEmpty } = require('../utils')

class AccessTokenHelper {
  static getToken(accessTokenDoc) {
    return accessTokenDoc.access_token
  }

  static create(userId, clientId, scope, ttlCount = 3600) {
    return new Promise((resolve, reject) => {
      const accessToken = crypto.randomBytes(64).toString('hex')
      const ttl = new Date().getTime() + ttlCount * 1000
      const doc = new AccessTokenModel({
        userId,
        clientId,
        accessToken,
        scope,
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

  static delete(accessToken) {
    return new Promise((resolve, reject) => (
      AccessTokenModel.deleteOne({ accessToken })
        .then(() => resolve())
        .catch((err) => {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        })
    ))
  }

  static fetchByToken(accessToken) {
    return new Promise((resolve, reject) => (
      AccessTokenModel.findOne({ accessToken })
        .then((doc) => {
          if (isEmpty(doc)) return reject(new Error(TOKEN.WRONG_ACCESS_TOKEN(accessToken)))
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        })
    ))
  }

  static fetchByClient(userId, clientId) {
    return new Promise((resolve, reject) => (
      AccessTokenModel.findOne({ userId, clientId })
        .then((doc) => {
          if (isEmpty(doc)) return reject(new Error(`No record found from AccessToken with client::{userId:${userId}, clientId:${clientId}}`))
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

  static getTTL(doc) {
    return new Promise((resolve) => {
      const ttl = moment(doc.ttl).diff(new Date(), 'seconds')
      resolve(ttl > 0 ? ttl : 0)
    })
  }
}

AccessTokenHelper.ttl = 3600

module.exports = AccessTokenHelper
