const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { UserHelper } = require('../../helpers')
const middlewares = require('../../middlewares')
const {
  INVALID, GENERAL, ERRORS,
} = require('../../config/constants').RESPONSES
const {
  userIsFirstname,
  userIsLastname,
  userIsUsername,
  userIsEmail,
  random,
  isEmpty,
} = require('../../utils/')

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) return cb(null, true)
  return cb(ERRORS.FORMAT_PICTURE, false)
}

const fileFilter = (req, file, callback) => { checkFileType(file, callback) }

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, './src/assets/profilePictures/') },
  filename: (req, file, cb) => { cb(null, `${random(60)}.${file.originalname.split('.').pop()}`) },
})
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).single('profilePic')

const verifyInput = (body) => {
  let jsonResp = {}
  if (body.username !== undefined && body.username !== '' && !userIsUsername(body.username)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.USERNAME)
  }
  if (body.firstname !== undefined && body.firstname !== '' && !userIsFirstname(body.firstname)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.FIRSTNAME)
  }
  if (body.lastname !== undefined && body.lastname !== '' && !userIsLastname(body.lastname)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.LASTNAME)
  }
  if (body.email !== undefined && body.email !== '' && !userIsEmail(body.email)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.EMAIL)
  }
  if (body.language !== undefined && body.language !== ''
    && body.language !== 'ENGLISH'
    && body.language !== 'FRENCH'
    && body.language !== 'GERMAN'
    && body.language !== 'SPANISH') {
    jsonResp = Object.assign({}, jsonResp, INVALID.LANGUAGE)
  }
  return jsonResp
}

const detectModif = (body, user, file) => (
  (body.username !== '' && body.username !== user.username)
  || (body.firstname !== '' && body.firstname !== user.firstname)
  || (body.lastname !== '' && body.lastname !== user.lastname)
  || (body.email !== '' && body.email !== user.email)
  || (!isEmpty(file))
  || (body.language !== user.language)
)

const fetchPromises = (userId, fields, file, oauth) => {
  const promises = []
  if (!isEmpty(file)) {
    promises.push(UserHelper.setNewProfilePic(userId, file.filename))
  }
  Object.keys(fields).forEach((key) => {
    if (fields[key] !== '') {
      if (key === 'firstname') promises.push(UserHelper.setGeneralInformation(userId, key, fields[key].charAt(0).toUpperCase() + fields[key].slice(1)))
      else if (key === 'lastname') promises.push(UserHelper.setGeneralInformation(userId, key, fields[key].toUpperCase()))
      else if (key === 'language') promises.push(UserHelper.setGeneralInformation(userId, key, fields[key].toUpperCase(), oauth))
      else promises.push(UserHelper.setGeneralInformation(userId, key, fields[key]))
    }
  })
  return promises
}

const ourUpdate = (req, res, next) => (
  upload(req, res, (err) => {
    if (err) {
      console.log('Upload Error:', err)
      return res.status(200).json(err)
    }
    return next()
  })
)

router.put('/', middlewares.checkBearerToken, ourUpdate, async (req, res) => {
  try {
    const jsonResp = verifyInput(req.body)
    if (Object.keys(jsonResp).length !== 0) {
      return res.status(200).json(jsonResp)
    }
    const containModif = detectModif(req.body, req.userDoc, req.file)
    if (containModif === false) {
      return res.status(200).json(GENERAL.NO_MODIFICATION)
    }
    await Promise.all(fetchPromises(
      req.userDoc._id.toString(),
      req.body, req.file,
      req.userDoc.oauthOrigin
    ))
    return res.status(200).json({ ok: 'OK' })
  } catch (err2) {
    if (!isEmpty(req.file)) {
      fs.unlinkSync(`./src/assets/profilePictures/${req.file.filename}`)
    }
    return res.json(err2.message)
  }
})

module.exports = router
