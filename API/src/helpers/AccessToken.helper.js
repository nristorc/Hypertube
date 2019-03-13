const { AccessTokenModel } = require('../models')
const { isEmpty } = require('../utils')
const { TOKEN } = require('../config/constants').RESPONSES

class AccessTokenHelper {
  static fetchByToken(accessToken) {
    return new Promise((resolve, reject) => (
      AccessTokenModel.findOne({ accessToken })
        .then((doc) => {
          if (isEmpty(doc)) return reject(new Error(TOKEN.WRONG_ACCESS_TOKEN(accessToken)))
          return resolve(doc)
        })
        .catch(err => reject(err))
    ))
  }

  static checkTTL(doc) {
    return (doc.ttl > new Date().getTime())
  }
}

AccessTokenHelper.ttl = 3600

module.exports = AccessTokenHelper
