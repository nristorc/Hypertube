const fs = require('fs')
const validator = require('validator')
const { UserModel } = require('../models')
const { SERVER } = require('../config/config')
const MailHelper = require('./Mail.helper')
const {
  hash,
  random,
  isEmpty,
  userIsEmail,
  userIsUsername,
  userIsPassword,
} = require('../utils')

const {
  USER, BDD, MAIL, INCORRECT, ERRORS, INVALID, MISSING,
} = require('../config/constants').RESPONSES

const mail = new MailHelper()

class UserHelper {
  static getOauthUser(email, oauthOrigin) {
    return new Promise((resolve, reject) => {
      if (!userIsEmail(email)) return reject(INVALID.MAIL)
      return UserModel.findOne({ email, oauthOrigin })
        .then(doc => resolve(doc))
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static updateOauthUser(obj, oauthOrigin) {
    return new Promise((resolve, reject) => (
      UserModel.findOneAndUpdate({ email: obj.email, oauthOrigin },
        {
          $set: {
            username: obj.username,
            firstname: obj.firstname.charAt(0).toUpperCase() + obj.firstname.slice(1),
            lastname: obj.lastname.toUpperCase(),
            profilePic: obj.profilePic,
            emailConfirmed: true,
          },
        },
        { new: true })
        .then(user => resolve(user))
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    ))
  }

  static createOauthUser(obj, oauthOrigin) {
    return new Promise((resolve, reject) => {
      const doc = new UserModel({
        username: obj.username,
        firstname: obj.firstname.charAt(0).toUpperCase() + obj.firstname.slice(1),
        lastname: obj.lastname.toUpperCase(),
        email: obj.email,
        salt: 'google',
        password: 'google',
        profilePic: obj.profilePic,
        emailConfirmed: true,
        oauthOrigin,
      })
      return doc.save((err, result) => {
        if (err) {
          console.log('BDD Error:', err.message)
          return reject(BDD.FAILED)
        }
        return resolve(result)
      })
    })
  }

  static create(user, file, redirectUri) {
    return new Promise((resolve, reject) => {
      UserModel.find({
        $or:
          [
            { username: user.username, oauthOrigin: null },
            { email: user.email, oauthOrigin: null },
          ],
      })
        .then((res) => {
          if (!isEmpty(res)) return reject(USER.ALREADY_EXIST)
          const salt = random(255)
          const emailConfirmation = [{
            token: random(255),
          }]
          const doc = new UserModel({
            username: user.username,
            firstname: user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1),
            lastname: user.lastname.toUpperCase(),
            email: user.email,
            password: hash(user.password, salt),
            profilePic: `http://${SERVER.HOST}:${SERVER.PORT}/assets/${file.filename}`,
            salt,
            emailConfirmation,
          })
          return doc.save((err, userDocResult) => {
            if (err) {
              console.log('BDD Error:', err.message)
              return reject(BDD.FAILED)
            }
            return mail.registration(userDocResult, redirectUri)
              .then(() => resolve(userDocResult))
              .catch((errMail) => {
                console.log('Mail Error:', errMail.message)
                UserHelper.remove(userDocResult._id)
                  .then(() => reject(MAIL.FAIL))
                  .catch(() => reject(ERRORS.CONTACT_ADMIN))
              })
          })
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static checkEmailNotExist(email) {
    return new Promise((resolve, reject) => {
      if (!userIsEmail(email)) return reject(INVALID.MAIL)
      return UserModel.findOne({ email, oauthOrigin: null })
        .then((doc) => {
          if (isEmpty(doc)) return resolve()
          return reject(MAIL.EXIST)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static getAllUsersInfo() {
    return new Promise((resolve, reject) => {
      UserModel.find()
        .then((doc) => {
          if (isEmpty(doc)) return resolve([])
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static getUserInfoById(userId) {
    return new Promise((resolve, reject) => {
      if (!validator.isMongoId(userId)) return reject(USER.UNEXIST)
      return UserModel.findOne({ _id: userId })
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

  static getUserInfoByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => {
      const badUsername = userIsUsername(username)
      const badPassword = userIsPassword(password)
      if (!badUsername && !badPassword) {
        return reject(Object.assign({}, INVALID.USERNAME, INVALID.PASSWORD))
      }
      if (!badUsername) return reject(INVALID.USERNAME)
      if (!badPassword) return reject(INVALID.PASSWORD)
      return UserModel.findOne({ username, oauthOrigin: null })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          if (hash(password, doc.salt) !== doc.password) return reject(USER.BAD_PASS)
          if (doc.emailConfirmed === false) return reject(USER.NOT_ACTIVATED)
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static addForgottenPasswordToken(email, redirectUri) {
    return new Promise((resolve, reject) => {
      const token = random(255)
      if (!userIsEmail(email)) return reject(INVALID.MAIL)
      return UserModel.findOneAndUpdate({ email, oauthOrigin: null },
        { $set: { recoverPassword: { token } } }, { new: true })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          return mail.recoverPassword(email, token, redirectUri)
            .then(() => resolve(doc))
            .catch((err) => {
              console.log('Mail Error:', err.message)
              reject(MAIL.FAIL)
            })
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static setRecoverPassword(token, pass) {
    return new Promise((resolve, reject) => {
      const salt = random(255)
      const password = hash(pass.password, salt)
      UserModel.findOneAndUpdate({ recoverPassword: { $elemMatch: { token } }, oauthOrigin: null },
        { $set: { password, salt, recoverPassword: null } }, { new: true })
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

  static async setUserAccountActive(token) {
    return new Promise((resolve, reject) => (
      UserModel.findOne({ emailConfirmation: { $elemMatch: { token } }, oauthOrigin: null })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          if (doc.emailConfirmed === true) return reject(USER.ALREADY_CONFIRM)
          return UserModel.findByIdAndUpdate(doc._id,
            { $set: { emailConfirmed: true } }, { new: true })
            .then(result => resolve(result))
            .catch((errBdd) => {
              console.log('Error bdd:', errBdd)
              return reject(BDD.FAILED)
            })
        })
        .catch((err) => {
          console.log('Bdd error:', err.message)
          return reject(BDD.FAILED)
        })
    ))
  }

  static setGeneralInformation(userId, key, value, origin = null) {
    return new Promise((resolve, reject) => {
      if (!validator.isMongoId(userId)) return reject(USER.UNEXIST)
      return UserModel.findOneAndUpdate({ _id: userId, oauthOrigin: origin },
        { [key]: value }, { new: true })
        .then((doc) => {
          if (isEmpty(doc)) return resolve()
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static setNewPassword(userDoc, pass) {
    return new Promise((resolve, reject) => {
      if (isEmpty(userDoc)) return reject(USER.UNEXIST)
      if (isEmpty(pass.currentPassword) || isEmpty(pass.password)
        || isEmpty(pass.confirmPassword)) {
        return reject(MISSING.DATA)
      }
      if (hash(pass.currentPassword, userDoc.salt) !== userDoc.password) {
        return reject(INCORRECT.PASSWORD)
      }
      if (!userIsPassword(pass.password, pass.confirmPassword)) {
        return reject(INCORRECT.NEW_PASSWORD)
      }
      const salt = random(255)
      const password = hash(pass.password, salt)
      return UserModel.findOneAndUpdate({ _id: userDoc._id, oauthOrigin: null },
        { $set: { password, salt } }, { new: true })
        .then(user => resolve(user))
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static setNewProfilePic(userId, pic) {
    return new Promise((resolve, reject) => {
      if (!validator.isMongoId(userId)) return reject(USER.UNEXIST)
      return UserModel.findOneAndUpdate({ _id: userId, oauthOrigin: null },
        { $set: { profilePic: `http://${SERVER.HOST}:${SERVER.PORT}/assets/${pic}` } })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          const url = `./src/assets/profilePictures/${doc.profilePic.split('/').pop()}`
          if (fs.existsSync(url)) {
            fs.unlinkSync(url)
          }
          return resolve(doc)
        })
        .catch((err) => {
          console.log('BDD Error:', err.message)
          reject(BDD.FAILED)
        })
    })
  }

  static remove(userId) {
    return new Promise((resolve, reject) => {
      if (!validator.isMongoId(userId)) return reject(USER.UNEXIST)
      return UserModel.findOneAndDelete({ _id: userId })
        .then((doc) => {
          if (isEmpty(doc)) return reject(USER.UNEXIST)
          const url = `./src/assets/profilePictures/${doc.profilePic.split('/').pop()}`
          if (fs.existsSync(url)) {
            fs.unlinkSync(url)
          }
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
