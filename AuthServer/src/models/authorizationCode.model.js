const mongoose = require('mongoose')

const authorizationCodeSchema = new mongoose.Schema({
  userId: {
    type: Object,
    required: [true, 'Fail to insert in AuthorizationCode:: No userId'],
  },
  clientId: {
    type: Object,
    required: [true, 'Fail to insert in AuthorizationCode:: No clientId'],
  },
  authorizationCode: {
    type: String,
    required: [true, 'Fail to insert in AuthorizationCode:: No authorizationCode'],
    unique: true,
  },
  redirectUri: {
    type: String,
    required: [true, 'Fail to insert in AuthorizationCode:: No redirectUri'],
  },
  ttl: {
    type: Number,
    required: [true, 'Fail to insert in AccessToken:: No ttl'],
  },
  scopes: {
    type: Array,
    required: false,
    items: {
      type: String,
      enum: ['full', 'limited'],
    },
  },
})

module.exports = mongoose.model('AuthorizationCode', authorizationCodeSchema)
