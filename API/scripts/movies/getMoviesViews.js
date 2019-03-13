const mongoose = require('mongoose')
const UserViewsModel = require('../../src/models/userViews.model')
const { DATABASE } = require('../../src/config/config')

const fetchMovieViews = () => (
  new Promise((resolve, reject) => (
    mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
      .then(() => UserViewsModel.find({}))
      .then((docs) => {
        docs.forEach((doc) => { console.log(JSON.stringify(doc)) })
        return resolve()
      })
      .catch(err => reject(err))
  ))
)

fetchMovieViews()
  .then(() => { console.log('fetchMovieViews succeed') })
  .catch((err) => {
    console.log('fetchMovieViews failed')
    console.error(err)
  })
