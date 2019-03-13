const schedule = require('node-schedule')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const exec = require('child_process')
const { MongoDb, Router } = require('./helpers')
const { SERVER } = require('./config/config')

class Server {
  constructor() {
    this.app = express()
    this.app.use(morgan('combined'))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(cors())
    this.db = new MongoDb()
    this.http = http.Server(this.app)
    this.routes = new Router(this.app).setAllRoutes()
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

/*
** Run cron for scraping
*/
schedule.scheduleJob('0 0 * * *', () => {
  exec('mkdir -p logs; NODE_ENV=development node --no-deprecation scripts/scraper > logs/$(date +%F).scraper.log')
})

schedule.scheduleJob('0 0 * * *', () => {
  exec('mkdir -p logs; NODE_ENV=development node --no-deprecation scripts/movies/cleanTorrents > logs/$(date +%F).clean.log')
})
