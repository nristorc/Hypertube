const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cover: {
    type: String,
  },
  genres: [{
    type: String,
    trim: true,
  }],
  year: {
    type: Number,
    validate: value => value >= 1800 && value <= 2200,
  },
  rating: {
    type: Number,
    validate: value => value >= 0 && value <= 10,
  },
  torrents: [{
    source: {
      type: String,
    },
    torrent: {
      type: String,
    },
    url: {
      type: String,
    },
    language: {
      type: String,
    },
    quality: {
      type: String,
    },
    seeds: {
      type: Number,
      validate: value => value >= 0,
    },
    leechers: {
      type: Number,
      validate: value => value >= 0,
    },
    size: [{
      human_readable: {
        type: String,
      },
      unix: {
        type: Number,
      },
    }],
  }],
})

movieSchema.index({ title: 1, year: 1, rating: 1 })

module.exports = mongoose.model('Movie', movieSchema)
