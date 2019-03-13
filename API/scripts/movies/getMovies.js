const mongoose = require('mongoose')
const MovieModel = require('../../src/models/movies.model')
const { DATABASE } = require('../../src/config/config')

const getMovies = () => (
  mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => MovieModel.find({}))
    .then(docs => docs.forEach(doc => console.log(doc)))
    .catch(err => console.error(err))
)

getMovies()
