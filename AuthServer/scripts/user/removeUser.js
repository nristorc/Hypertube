const mongoose = require('mongoose')
const { UserModel } = require('../../src/models')
const { DATABASE } = require('../../src/config/config')

const removeUser = () => (
  mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => UserModel.findOneAndRemove({
      username: 'dlaurent',
    }))
    .then(response => console.log(response))
    .catch(err => console.error(err))
)

removeUser()
