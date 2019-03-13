const mongoose = require('mongoose')

const watchListSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  movieId: {
    type: String,
    require: true,
  },
  title: {
    type: String,
  },
  cover: {
    type: String,
  },
  year: {
    type: String,
  },
  description: {
    type: String,
  },
})

module.exports = mongoose.model('WatchList', watchListSchema)
