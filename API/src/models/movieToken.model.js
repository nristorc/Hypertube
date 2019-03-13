const mongoose = require('mongoose')

const movieTokenSchema = new mongoose.Schema({
  movieHash: {
    type: String,
  },
  movieToken: {
    type: String,
    required: [true, 'Fail to insert in MovieToken:: No access_token'],
  },
  ttl: {
    type: Number,
    required: [true, 'Fail to insert in MovieToken:: No ttl'],
  },
})

module.exports = mongoose.model('MovieToken', movieTokenSchema)
