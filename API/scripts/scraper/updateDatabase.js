const mongoose = require('mongoose')
const MovieModel = require('../../src/models/movies.model')
const { isEmpty } = require('../../src/utils')
const { DATABASE } = require('../../src/config/config')

const updateDatabase = (movies) => {
  if (isEmpty(movies)) return []
  movies.map(movie => new MovieModel(movie))
  return mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => MovieModel.remove({}))
    .then(() => MovieModel.collection.insert(movies))
}

module.exports = updateDatabase
