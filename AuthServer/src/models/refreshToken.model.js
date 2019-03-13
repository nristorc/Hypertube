const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: Object,
    required: [true, 'Fail to insert in RefreshToken:: No userId'],
  },
  clientId: {
    type: Object,
    required: [true, 'Fail to insert in RefreshToken:: No clientId'],
  },
  refreshToken: {
    type: String,
    required: [true, 'Fail to insert in RefreshToken:: No authorization_code'],
    unique: true,
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

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)
