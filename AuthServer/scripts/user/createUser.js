const mongoose = require('mongoose')
const { UserModel } = require('../../src/models')
const { random, hash } = require('../../src/utils')
const { DATABASE } = require('../../src/config/config')

const createUser = () => {
  const salt = random(64)
  const password = hash('not-a-secure-password', salt)
  const newUser = new UserModel({
    username: 'dlaurent',
    firstname: 'Damien',
    lastname: 'LAURENT',
    profilePic: 'temporary_profile_pic.jpg',
    password,
    salt,
    recoverPassword: {
      token: random(64),
      date: Date.now(),
    },
    email: 'dlaurent@student.42.fr',
    emailConfirmed: true,
    emailConfirmation: {
      token: random(64),
      date: Date.now(),
    },
    oauth: {
      clientId: random(64),
      clientSecret: random(64),
      scope: 'full',
    },
  })
  return mongoose.connect(`mongodb://${DATABASE.USR}:${DATABASE.PWD}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`, { useNewUrlParser: true })
    .then(() => newUser.save())
    .then(doc => console.log(doc))
    .catch(err => console.error(err))
}

createUser()
