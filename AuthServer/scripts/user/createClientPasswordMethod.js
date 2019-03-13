const mongoose = require('mongoose')
const { ClientModel } = require('../../src/models')
const { random } = require('../../src/utils')
const { DATABASE } = require('../../src/config/config')

const createClientPasswordMethod = () => {
  const newUser = new ClientModel({
    clientId: random(64),
    clientSecret: random(64),
    redirectUri: '',
    userId: null,
    scopes: ['full'],
    grantTypes: ['password', 'refresh_token'],
  })
  return mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => newUser.save())
    .then(doc => console.log(doc))
    .catch(err => console.error(err))
}

createClientPasswordMethod()
