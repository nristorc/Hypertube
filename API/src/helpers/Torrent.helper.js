const Transmission = require('transmission')
const parseTorrent = require('parse-torrent')
const { username } = require('os').userInfo()
const { ERRORS } = require('../config/constants').RESPONSES

class TorrentHelper {
  constructor() {
    this.transmission = new Transmission({})
    this.downloadDir = `/tmp/${username}/transmission/torrents`
  }

  getFiles(filename) {
    return new Promise((resolve, reject) => {
      const { files } = parseTorrent(`${this.downloadDir}/${filename.replace('.torrent', '')}.torrent`)
      if (files === undefined) reject(new Error(ERRORS.WRONG_FILE))
      resolve(files)
    })
  }

  getStatus(id) {
    return new Promise((resolve, reject) => (
      this.transmission.get(id, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    ))
  }

  getStatusAll() {
    return new Promise((resolve, reject) => (
      this.transmission.sessionStats((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    ))
  }

  getActive() {
    return new Promise((resolve, reject) => (
      this.transmission.active((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    ))
  }


  add(url) {
    return new Promise((resolve, reject) => (
      this.transmission.addUrl(
        url,
        { 'download-dir': this.downloadDir },
        (err, result) => {
          if (err !== null) return reject(err)
          return resolve(result)
        }
      )
    ))
  }

  start(id) {
    return new Promise((resolve, reject) => (
      this.transmission.start(id, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    ))
  }

  del(id) {
    return new Promise((resolve, reject) => (
      this.transmission.remove(id, true, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    ))
  }

  stop(id) {
    return new Promise((resolve, reject) => (
      this.transmission.stop(id, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    ))
  }
}

module.exports = TorrentHelper
