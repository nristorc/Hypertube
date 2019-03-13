const mongoose = require('mongoose')

const accessTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  clientId: {
    type: String,
    required: [true, 'Fail to insert in AccessToken:: No clientId'],
  },
  accessToken: {
    type: String,
    required: [true, 'Fail to insert in AccessToken:: No access_token'],
    unique: true,
  },
  scope: {
    type: Array,
    required: false,
    items: {
      type: String,
      enum: ['full', 'limited'],
    },
  },
  ttl: {
    type: Number,
    required: [true, 'Fail to insert in AccessToken:: No ttl'],
  },
})

module.exports = mongoose.model('AccessToken', accessTokenSchema)
