const router = require('express').Router()
const fetch = require('node-fetch')
const { OAuth2Client } = require('google-auth-library')
const middlewares = require('../../middlewares')
const PROVIDERS = require('../../config/providers')
const { UserHelper, AccessTokenHelper } = require('../../helpers')
const { isEmpty } = require('../../utils')
const { ERRORS } = require('../../config/constants').RESPONSES

const client = new OAuth2Client(PROVIDERS.GOOGLE.CLIENT_ID)

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: PROVIDERS.GOOGLE.CLIENT_ID,
  })
  return ticket.getPayload()
}

const oauthGoogle = async (res, code) => {
  const params = {
    code,
    client_id: PROVIDERS.GOOGLE.CLIENT_ID,
    client_secret: PROVIDERS.GOOGLE.CLIENT_SECRET,
    redirect_uri: 'http://127.0.0.1:3000/oauth/callback/google',
    grant_type: 'authorization_code',
  }
  try {
    const resp = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      body: new URLSearchParams(params).toString(),
    })
    const json = await resp.json()
    const decoded = await verify(json.id_token)
    if (!decoded) {
      return res.status(200).json(ERRORS.INVALID_TOKEN)
    }
    if (decoded.email_verified === false) {
      return res.status(200).json(ERRORS.NOT_VERIFIED)
    }
    const oauthUser = await UserHelper.getOauthUser(decoded.email, 'google')
    let user = null
    if (isEmpty(oauthUser)) {
      user = await UserHelper.createOauthUser({
        username: decoded.given_name,
        firstname: decoded.given_name,
        lastname: decoded.family_name,
        email: decoded.email,
        profilePic: decoded.picture,
      }, 'google')
    } else {
      user = await UserHelper.updateOauthUser({
        username: decoded.given_name,
        firstname: decoded.given_name,
        lastname: decoded.family_name,
        email: decoded.email,
        profilePic: decoded.picture,
      }, 'google')
    }
    const accessToken = await AccessTokenHelper.create(user._id, PROVIDERS.GOOGLE.CLIENT_ID, 'full', new Date().getTime() + json.expires_in)
    return res.status(200).json(accessToken)
  } catch (e) {
    return res.status(400).json({ err: e.message })
  }
}

const getIntraFTUser = async (token) => {
  try {
    const resp = await fetch('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'cache-control': 'no-cache',
      },
    })
    const json = await resp.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

const oauth42 = async (res, code) => {
  const params = {
    code,
    client_id: PROVIDERS.INTRAFT.CLIENT_ID,
    client_secret: PROVIDERS.INTRAFT.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://127.0.0.1:3000/oauth/callback/intraft',
  }
  try {
    const resp = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      body: new URLSearchParams(params).toString(),
    })
    const json = await resp.json()
    const userInfo = await getIntraFTUser(json.access_token)
    const oauthUser = await UserHelper.getOauthUser(userInfo.email, 'intraft')
    let user = null
    if (isEmpty(oauthUser)) {
      user = await UserHelper.createOauthUser({
        username: userInfo.login,
        firstname: userInfo.first_name,
        lastname: userInfo.last_name,
        email: userInfo.email,
        profilePic: userInfo.image_url,
      }, 'intraft')
    } else {
      user = await UserHelper.updateOauthUser({
        username: userInfo.login,
        firstname: userInfo.first_name,
        lastname: userInfo.last_name,
        email: userInfo.email,
        profilePic: userInfo.image_url,
      }, 'intraft')
    }
    const accessToken = await AccessTokenHelper.create(user._id, PROVIDERS.INTRAFT.CLIENT_ID, 'full', new Date().getTime() + json.expires_in)
    return res.status(200).json(accessToken)
  } catch (e) {
    return res.status(400).json({ err: e.message })
  }
}

const getFbUser = async (token) => {
  try {
    const resp = await fetch('https://graph.facebook.com/v3.2/me?fields=email,name,first_name,last_name,picture.width(360).height(360),id', {
      headers: {
        Authorization: `Bearer ${token}`,
        'cache-control': 'no-cache',
      },
    })
    const json = await resp.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

const oauthFacebook = async (res, code) => {
  const params = {
    code,
    client_id: PROVIDERS.FACEBOOK.CLIENT_ID,
    client_secret: PROVIDERS.FACEBOOK.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/oauth/callback/facebook',
  }

  try {
    const resp = await fetch('https://graph.facebook.com/v3.2/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      body: new URLSearchParams(params).toString(),
    })
    const json = await resp.json()
    const userInfo = await getFbUser(json.access_token)
    const oauthUser = await UserHelper.getOauthUser(userInfo.email, 'facebook')
    let user = null
    if (isEmpty(oauthUser)) {
      user = await UserHelper.createOauthUser({
        username: userInfo.name,
        firstname: userInfo.first_name,
        lastname: userInfo.last_name,
        email: userInfo.email,
        profilePic: userInfo.picture.data.url,
      }, 'facebook')
    } else {
      user = await UserHelper.updateOauthUser({
        username: userInfo.name,
        firstname: userInfo.first_name,
        lastname: userInfo.last_name,
        email: userInfo.email,
        profilePic: userInfo.picture.data.url,
      }, 'facebook')
    }
    const accessToken = await AccessTokenHelper.create(user._id, PROVIDERS.FACEBOOK.CLIENT_ID, 'full', new Date().getTime() + json.expires_in)
    return res.status(200).json(accessToken)
  } catch (e) {
    console.log('error', e)
    return res.status(400).json(e)
  }
}

const getGithubUser = async (token) => {
  try {
    const resp = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'cache-control': 'no-cache',
      },
    })
    const json = await resp.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

const oauthGithub = async (res, code) => {
  const params = {
    code,
    client_id: PROVIDERS.GITHUB.CLIENT_ID,
    client_secret: PROVIDERS.GITHUB.CLIENT_SECRET,
    grant_type: 'authorization_code',
    state: 'test',
    redirect_uri: 'http://localhost:3000/oauth/callback/github',
  }
  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'cache-control': 'no-cache',
      },
      body: new URLSearchParams(params).toString(),
    })
    const json = await resp.json()
    if (!json.access_token) {
      return res.status(200).json(ERRORS.INVALID_TOKEN)
    }
    const userInfo = await getGithubUser(json.access_token)
    if (isEmpty(userInfo.name)) userInfo.name = userInfo.login
    if (isEmpty(userInfo.email)) userInfo.email = `${userInfo.login}@github.com`
    const oauthUser = await UserHelper.getOauthUser(userInfo.email, 'github')
    let user = null
    if (isEmpty(oauthUser)) {
      user = await UserHelper.createOauthUser({
        username: userInfo.login,
        firstname: userInfo.login,
        lastname: userInfo.name,
        email: userInfo.email,
        profilePic: userInfo.avatar_url,
      }, 'github')
    } else {
      user = await UserHelper.updateOauthUser({
        username: userInfo.login,
        firstname: userInfo.login,
        lastname: userInfo.name,
        email: userInfo.email,
        profilePic: userInfo.avatar_url,
      }, 'github')
    }
    const accessToken = await AccessTokenHelper.create(user._id, PROVIDERS.GITHUB.CLIENT_ID, 'full')
    return res.status(200).json(accessToken)
  } catch (e) {
    console.log('error', e)
    return res.status(400).json(e)
  }
}

const getGitlabUser = async (token) => {
  try {
    const resp = await fetch('https://gitlab.com/api/v4/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'cache-control': 'no-cache',
      },
    })
    const json = await resp.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

const oauthGitlab = async (res, code) => {
  const params = {
    code,
    client_id: PROVIDERS.GITLAB.CLIENT_ID,
    client_secret: PROVIDERS.GITLAB.CLIENT_SECRET,
    grant_type: 'authorization_code',
    state: 'test',
    redirect_uri: 'http://localhost:3000/oauth/callback/gitlab',
  }
  try {
    const resp = await fetch('https://gitlab.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'cache-control': 'no-cache',
      },
      body: new URLSearchParams(params).toString(),
    })
    const json = await resp.json()
    console.log(json)
    if (!json.access_token) {
      return res.status(200).json(ERRORS.INVALID_TOKEN)
    }
    const userInfo = await getGitlabUser(json.access_token)
    const oauthUser = await UserHelper.getOauthUser(userInfo.email, 'gitlab')
    let user = null
    if (isEmpty(oauthUser)) {
      user = await UserHelper.createOauthUser({
        username: userInfo.username,
        firstname: userInfo.username,
        lastname: userInfo.name,
        email: userInfo.email,
        profilePic: userInfo.avatar_url,
      }, 'gitlab')
    } else {
      user = await UserHelper.updateOauthUser({
        username: userInfo.username,
        firstname: userInfo.username,
        lastname: userInfo.name,
        email: userInfo.email,
        profilePic: userInfo.avatar_url,
      }, 'gitlab')
    }
    const accessToken = await AccessTokenHelper.create(user._id, PROVIDERS.GITLAB.CLIENT_ID, 'full')
    return res.status(200).json(accessToken)
  } catch (e) {
    console.log('error', e)
    return res.status(400).json(e)
  }
}

router.get('/:provider', middlewares.checkOauthCb, (req, res) => {
  if (req.params.provider === 'google') return oauthGoogle(res, req.query.code)
  if (req.params.provider === 'intraft') return oauth42(res, req.query.code)
  if (req.params.provider === 'facebook') return oauthFacebook(res, req.query.code)
  if (req.params.provider === 'github') return oauthGithub(res, req.query.code)
  if (req.params.provider === 'gitlab') return oauthGitlab(res, req.query.code)
  return res.status(200)
})

module.exports = router
