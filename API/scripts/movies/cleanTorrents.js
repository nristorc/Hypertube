const mongoose = require('mongoose')
const moment = require('moment')
const fs = require('fs')
const rm = require('rimraf')
const _ = require('lodash')
const { username } = require('os').userInfo()
const UserViewsModel = require('../../src/models/userViews.model')
const { DATABASE } = require('../../src/config/config')
const { isEmpty, whatTimeIsIt } = require('../../src/utils')

const cleanTorrents = () => (
  new Promise((resolve, reject) => (
    mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
      .then(() => UserViewsModel.find({}))
      .then((docs) => {
        if (isEmpty(docs)) resolve()
        const movieArr = []
        docs.forEach((doc) => {
          doc.moviesViewed.forEach((d) => {
            movieArr.push({ dirname: d.dirname, date: d.date })
          })
        })
        const groupedDocs = _.mapValues(
          _.groupBy(movieArr, 'dirname'),
          clist => clist.map(el => el.date)
        )
        Object.keys(groupedDocs).forEach((key) => {
          if (!groupedDocs[key].some(el => moment(el) > moment().subtract(30, 'days'))) {
            const dir = `/tmp/${username}/transmission/torrents/${key}`
            if (fs.existsSync(dir)) {
              rm.sync(dir)
              console.log(`${whatTimeIsIt()}: dir ${dir} has been deleted`)
            } else console.log(`${whatTimeIsIt()}: dir ${dir} does not exist`)
          }
        })
        return resolve()
      })
      .catch(err => reject(err))
  ))
)

console.log(`${whatTimeIsIt()}: Entering cleanTorrents`)
cleanTorrents()
  .then(() => {
    console.log(`${whatTimeIsIt()}: cleanTorrents succeed`)
    process.exit() // eslint-disable-line
  })
  .catch((err) => {
    console.error(`${whatTimeIsIt()}: cleanTorrents failed with error\n${err}`)
    process.exit() // eslint-disable-line
  })
