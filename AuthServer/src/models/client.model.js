const mongoose = require('mongoose')

const oauthClientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: [true, 'Fail to insert in OauthClient:: No clientId'],
  },
  clientSecret: {
    type: String,
    required: [true, 'Fail to insert in OauthClient:: No clientSecret'],
  },
  userId: {
    type: String,
  },
  redirectUri: {
    type: String,
  },
  scopes: [{
    type: String,
    enum: ['full', 'limited'],
    required: true,
  }],
  grantTypes: [{
    type: String,
    enum: ['authorization_code', 'password', 'client_credentials', 'refresh_token'],
    required: true,
  }],
})

module.exports = mongoose.model('OauthClient', oauthClientSchema)
