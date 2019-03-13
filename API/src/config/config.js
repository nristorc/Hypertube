const dotenv = require('dotenv')

dotenv.load()

const environment = process.env.NODE_ENV || 'production'

console.log(`Server environment is ${environment}`)

const { TMDB_API_KEY, SECRET_KEY } = process.env

const SERVER = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 4000,
}

const DATABASE = {
  HOST: process.env.MONGO_HOST,
  PORT: process.env.MONGO_PORT,
  NAME: process.env.MONGO_DBNAME,
  USR: process.env.MONGO_USR,
  PWD: process.env.MONGO_PWD,
}

const config = {
  production: { JWT_DURATION: 900 },
  development: { JWT_DURATION: 86400 },
  test: { JWT_DURATION: 86400 },
}

module.exports = Object.assign(config[environment], {
  SERVER,
  DATABASE,
  SECRET_KEY,
  TMDB_API_KEY,
})
