const mongoose = require('mongoose')
const MovieModel = require('../../src/models/movies.model')
const { DATABASE } = require('../../src/config/config')

const removeMovies = () => (
  mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => MovieModel.remove({}))
    .then(response => console.log(response))
    .catch(err => console.error(err))
)

removeMovies()
