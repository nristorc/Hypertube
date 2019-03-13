const router = require('express').Router()
const ffmpeg = require('fluent-ffmpeg')
const pump = require('pump')
const srt2vtt = require('srt-to-vtt')
const path = require('path')
const fs = require('fs')
const torrentStream = require('torrent-stream')
const { sleep } = require('../../utils')
const middlewares = require('../../middlewares')
const Torrent = require('../../helpers/Torrent.helper')
const { ERRORS } = require('../../config/constants').RESPONSES

const getExtention = fileName => fileName.substring(fileName.lastIndexOf('.'))

router.get('/encoded-upload', middlewares.checkMovieToken, async (req, res) => {
  try {
    const {
      hash,
      filename,
    } = req.query
    let { magnet } = req.query
    magnet = magnet.includes('btih') ? magnet.split('btih:')[1].split('&dn')[0] : magnet
    await new Torrent().getStatus(hash)
    const extension = await getExtention(filename)
    const realExtension = extension.substr(1)
    const engine = torrentStream(magnet, { tmp: '/tmp/alex' })
    engine.on('ready', async () => {
      engine.files.forEach(async (file) => {
        if (file.name === filename) {
          console.log('-----file selected for streaming-----')
          file.select()
          const stream = file.createReadStream()
          if (realExtension === 'mp4' || realExtension === 'mkv') {
            pump(stream, res)
          } else {
            ffmpeg()
              .input(stream)
              .outputOptions('-movflags frag_keyframe+empty_moov')
              .outputFormat('mp4')
              .on('start', () => {
                console.log('start')
              })
              .on('progress', (progress) => {
                console.log(`progress: ${progress.timemark}`)
              })
              .on('end', () => {
                console.log('Finished processing')
              })
              .on('error', (err) => {
                console.log(`ERROR: ${err.message}`)
              })
              .inputFormat(realExtension)
              .audioCodec('aac')
              .videoCodec('libx264')
              .pipe(res)
            res.on('close', () => {
              stream.destroy()
            })
          }
        } else {
          console.log('-----file with wrong extension-----')
        }
      })
    })
  } catch (e) {
    console.log('error streaming: ', e.message)
    res.status(200).json(ERRORS.STREAM(e.message))
  }
})

const fileExist = (pathway) => { // eslint-disable-line
  return new Promise(async (resolve, reject) => {
    setTimeout(reject, 90000)
    while (true) { // eslint-disable-line
      if (fs.existsSync(pathway)) {
        return resolve()
      }
      sleep(2000)
    }
  })
}

router.get('/subtitles', middlewares.checkMovieToken, async (req, res) => {
  try {
    const movieHash = req.query.hash
    const status = await new Torrent().getStatus(movieHash)
    const { subfile } = req.query
    const files = status.torrents[0].name
    const { downloadDir } = status.torrents[0]
    const pathfile = path.join(downloadDir, files, subfile)
    await fileExist(pathfile)
    res.contentType('text/vtt')
    return fs.createReadStream(pathfile)
      .pipe(srt2vtt())
      .pipe(res)
  } catch (e) {
    console.log('error with subtitles: ', e.message)
    return res.status(200).json(ERRORS.SUBTITLES(e.message))
  }
})

module.exports = router
