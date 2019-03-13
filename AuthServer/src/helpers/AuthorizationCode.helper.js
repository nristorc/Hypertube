const crypto = require('crypto')
const { isEmpty } = require('../utils')
const { AuthorizationCodeModel } = require('../models')
const { MIDDLEWARE_ERRORS, BDD_ERRORS } = require('../config/constants').RESPONSES

class AuthorizationCodeHelper {
  static getUserId(codeDoc) {
    return codeDoc.userId
  }

  static getClientId(codeDoc) {
    return codeDoc.clientId
  }

  static getScope(codeDoc) {
    return codeDoc.scope
  }

  static create(userId, clientId, redirectUri, scopes, ttlCount = 3600) {
    return new Promise((resolve, reject) => {
      const authorizationCode = crypto.randomBytes(32).toString('hex')
      const ttl = new Date().getTime() + ttlCount * 1000
      const doc = new AuthorizationCodeModel({
        userId,
        clientId,
        authorizationCode,
        redirectUri,
        scopes,
        ttl,
      })
      return doc.save((err, result) => {
        if (err) return reject(BDD_ERRORS.FAILED)
        return resolve(result)
      })
    })
  }

  static removeByAuthCode(authorizationCode) {
    return new Promise((resolve, reject) => (
      AuthorizationCodeModel.deleteOne({ authorizationCode }, (err) => {
        if (err) reject(BDD_ERRORS.FAILED)
        else resolve()
      })
    ))
  }

  static fetchByCode(authorizationCode) {
    return new Promise((resolve, reject) => {
      AuthorizationCodeModel.findOne({ authorizationCode })
        .then((doc) => {
          if (isEmpty(doc)) return reject(MIDDLEWARE_ERRORS.AUTH_CODE_NOT_FOUND(authorizationCode))
          return resolve(doc)
        })
        .catch(() => BDD_ERRORS.FAILED)
    })
  }

  static checkClient(doc, client) {
    return new Promise((resolve, reject) => {
      if (doc.clientId === client.clientId) return resolve()
      return reject(MIDDLEWARE_ERRORS.AUTH_CODE_FAIL_CHECK_CLIENT_ID(client.clientId))
    })
  }

  static checkRedirectUri(doc, client) {
    return new Promise((resolve, reject) => {
      if (doc.redirectUri === client.redirectUri) return resolve()
      return reject(MIDDLEWARE_ERRORS.AUTH_CODE_FAIL_CHECK_REDIR(client.clientId))
    })
  }

  static checkTTL(codeDoc) {
    return new Promise((resolve, reject) => {
      if (codeDoc.ttl > new Date().getTime()) return resolve()
      return reject(MIDDLEWARE_ERRORS.TOKEN_EXPIRE)
    })
  }
}

AuthorizationCodeHelper.ttl = 300

module.exports = AuthorizationCodeHelper
