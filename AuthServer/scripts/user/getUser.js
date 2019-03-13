const mongoose = require('mongoose')
const { UserModel } = require('../../src/models')
const { DATABASE } = require('../../src/config/config')

const getUser = () => (
  mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => UserModel.findOne({
      username: 'dlaurent',
    }))
    .then(doc => console.log(doc))
    .catch(err => console.error(err))
)

getUser()
