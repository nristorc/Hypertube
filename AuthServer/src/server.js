const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const http = require('http')
const { MongoHelper, RouterHelper } = require('./helpers')
const { SERVER } = require('./config/config')

class Server {
  constructor() {
    this.app = express()
    this.app.set('view engine', 'ejs')
    this.app.set('views', `${__dirname}/views`)
    this.app.use(cookieParser())
    this.app.use('/assets', express.static('src/assets/profilePictures'))
    this.app.use(session({ secret: 'ratonLaveur', resave: false, saveUninitialized: false }))
    this.app.use(morgan('combined'))
    this.app.use(cors())
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 1000000 }))
    this.db = new MongoHelper()
    this.http = http.Server(this.app)
    this.routes = new RouterHelper(this.app).setAllRoutes()
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

/*
** Run server
*/
new Server().listen()
