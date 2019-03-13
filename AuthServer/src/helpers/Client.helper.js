const { ClientModel } = require('../models')
const { MIDDLEWARE_ERRORS, CLIENT } = require('../config/constants').RESPONSES
const { isEmpty } = require('../utils')

class ClientHelper {
  static getId(clientDoc) {
    return clientDoc.id
  }

  static getRedirectUri(clientDoc) {
    return clientDoc.redirectUri
  }

  static getScopes(clientDoc) {
    return clientDoc.scopes
  }

  static getClientId(clientDoc) {
    return clientDoc.clientId
  }

  static checkRedirectUri(clientDoc, redirectUri) {
    return (redirectUri.indexOf(ClientHelper.getRedirectUri(clientDoc)) === 0
      && redirectUri.replace(ClientHelper.getRedirectUri(clientDoc), '').indexOf('#') === -1)
  }

  static fetchById(clientId) {
    return new Promise((resolve, reject) => (
      ClientModel.findOne({ clientId })
        .then((doc) => {
          if (isEmpty(doc)) return reject(CLIENT.UNEXIST)
          return resolve(doc)
        })
        .catch(err => reject(err))
    ))
  }

  static checkSecret(clientDoc, secret) {
    return new Promise((resolve, reject) => {
      if (clientDoc.clientSecret === secret) return resolve()
      return reject(MIDDLEWARE_ERRORS.BAD_SECRET_CLIENT)
    })
  }

  static checkGrantType(clientDoc, grantType) {
    return new Promise((resolve, reject) => {
      if (clientDoc.grantTypes.indexOf(grantType) < 0) {
        return reject(MIDDLEWARE_ERRORS.INCORRECT_GRANT_TYPE)
      }
      return resolve()
    })
  }

  static checkScope(clientDoc, scopes) {
    return new Promise((resolve, reject) => {
      scopes.forEach((scope) => {
        if (clientDoc.scopes.indexOf(scope) < 0) reject(MIDDLEWARE_ERRORS.INCORRECT_SCOPE(scope))
      })
      resolve(scopes)
    })
  }

  static transformScope(scope) {
    return new Promise((resolve) => {
      if (!scope) return resolve([])
      return resolve(scope.split(' '))
    })
  }
}

module.exports = ClientHelper
