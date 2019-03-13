const mongoose = require('mongoose')
const UserViewsModel = require('../../src/models/userViews.model')
const UserModel = require('../../src/models/user.model')
const { DATABASE } = require('../../src/config/config')
const { random } = require('../../src/utils')

const randomDate = (start, end) => (
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
)

const mockData = () => (
  new Promise((resolve, reject) => (
    mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
      .then(() => UserViewsModel.remove({}))
      .then(() => UserModel.find({}))
      .then((users) => {
        const views = []
        users.forEach((user) => {
          let i = 0
          const moviesViewed = []
          while (i < 10) {
            moviesViewed.push({
              title: Math.floor(Math.random() * 500),
              filename: random(64),
              cover: 'http://fr.web.img3.acsta.net/pictures/18/02/23/12/09/5079145.jpg',
              year: '2015',
              genres: ['Adventure', 'Action', 'Thriller'],
              date: randomDate(new Date(2019, 0, 1), new Date()),
            })
            i += 1
          }
          views.push(new UserViewsModel({ userId: user._id, moviesViewed }))
        })
        return UserViewsModel.collection.insert(views)
      })
      .then(docs => resolve(docs))
      .catch(err => reject(err))
  ))
)

console.log('Mocking')
mockData()
  .then(() => {
    console.log('Mock succeed')
    process.exit() // eslint-disable-line
  })
  .catch((err) => {
    console.log('Mock failed')
    console.error(err)
  })
