const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { UserHelper } = require('../../helpers')
const { ERRORS, INVALID, MISSING } = require('../../config/constants').RESPONSES
const {
  isEmpty,
  random,
  userIsEmail,
  userIsFirstname,
  userIsLastname,
  userIsPassword,
  userIsUsername,
} = require('../../utils')

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

const verifyInput = (fields, file) => {
  let jsonResp = {}
  if (fields.username !== undefined && !userIsUsername(fields.username)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.USERNAME)
  }
  if (fields.firstname !== undefined && !userIsFirstname(fields.firstname)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.FIRSTNAME)
  }
  if (fields.lastname !== undefined && !userIsLastname(fields.lastname)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.LASTNAME)
  }
  if (fields.email !== undefined && !userIsEmail(fields.email)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.EMAIL)
  }
  if (fields.password !== undefined
    && fields.cpassword !== undefined
    && !userIsPassword(fields.password, fields.cpassword)) {
    jsonResp = Object.assign({}, jsonResp, INVALID.PASSWORD)
  }
  if (isEmpty(file)) jsonResp = Object.assign({}, jsonResp, MISSING.FILE)
  return jsonResp
}

const inputFile = (req, res, next) => (
  upload(req, res, (err) => {
    if (err) {
      console.log('Upload Error:', err)
      return res.status(200).json(err)
    }
    return next()
  })
)

router.post('/', inputFile, async (req, res) => {
  const jsonResp = verifyInput(req.body, req.file)
  if (Object.keys(jsonResp).length !== 0) {
    if (jsonResp.FILE_MISSING === undefined) {
      fs.unlinkSync(`./src/assets/profilePictures/${req.file.filename}`)
    }
    return res.status(200).json(jsonResp)
  }
  try {
    const newUser = await UserHelper.create(req.body, req.file, req.body.redirect_uri)
    return res.status(200).json(newUser)
  } catch (err) {
    fs.unlinkSync(`./src/assets/profilePictures/${req.file.filename}`)
    return res.json(err)
  }
})

module.exports = router
