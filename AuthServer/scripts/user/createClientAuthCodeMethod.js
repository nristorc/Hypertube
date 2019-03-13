const mongoose = require('mongoose')
const { ClientModel } = require('../../src/models')
const { random } = require('../../src/utils')
const { DATABASE } = require('../../src/config/config')

const createClientAuthCodeMethod = () => {
  const newUser = new ClientModel({
    clientId: random(64),
    clientSecret: random(64),
    redirectUri: null,
    userId: '5c4ed259ab48dd25ee3e7c34',
    scopes: ['full'],
    grantTypes: ['authorization_code'],
  })
  return mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => newUser.save())
    .then(doc => console.log(doc))
    .catch(err => console.error(err))
}

createClientAuthCodeMethod()
