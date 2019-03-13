const mongoose = require('mongoose')

const userViewsSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  moviesViewed: [{
    title: {
      type: String,
    },
    dirname: {
      type: String,
    },
    cover: {
      type: String,
    },
    year: {
      type: String,
    },
    genres: [{
      type: String,
      trim: true,
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  }],
})

module.exports = mongoose.model('UserViews', userViewsSchema)
