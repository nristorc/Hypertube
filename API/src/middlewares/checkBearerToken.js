const fs = require('fs')
const { MISSING, INVALID } = require('../config/constants').RESPONSES
const { SERVER } = require('../config/config')
const { UserHelper, AccessTokenHelper } = require('../helpers')
const { isEmpty } = require('../utils')
const { TOKEN } = require('../config/constants')

const checkBearerToken = async (req, res, next) => {
  if (isEmpty(req.headers.authorization)) {
    console.log('Middleware auth:: No bearer header')
    return res.status(200).json(MISSING.BEARER)
  }
  const arr = req.headers.authorization.split(' ')
  if (arr[0] !== 'Bearer') {
    console.log('Middleware auth:: Headers authorization wrong type')
    return res.status(200).json(INVALID.AUTH_HEADER)
  }
  try {
    const accessTokenDoc = await AccessTokenHelper.fetchByToken(arr[1])
    if (AccessTokenHelper.checkTTL(accessTokenDoc.accessToken)) {
      return res.status(200).json(TOKEN.EXPIRED)
    }
    const userDoc = await UserHelper.getUserInfoById(accessTokenDoc.userId)
    if (isEmpty(userDoc.oauthOrigin)) {
      const pic = userDoc.profilePic.split('/')
      const checkPic = pic[pic.length - 1]
      const checkIfExist = fs.existsSync(`./src/assets/profilePictures/${checkPic}`)
      if (!checkIfExist) userDoc.profilePic = `http://${SERVER.HOST}:${SERVER.PORT}/assets/avatar.png`
    }
    req.userDoc = userDoc
    return next()
  } catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = checkBearerToken
