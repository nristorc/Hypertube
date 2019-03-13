const { UserModel } = require('../models')
const { isEmpty } = require('../utils')
const { USER, BDD } = require('../config/constants').RESPONSES

class UserHelper {
  static getUserInfoById(userId) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ _id: userId })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }
}

module.exports = UserHelper
