const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
  },
  movie: {
    type: String,
  },
  date: {
    type: Date,
  },
  comment: {
    type: String,
  },
})

module.exports = mongoose.model('Comments', commentSchema)
