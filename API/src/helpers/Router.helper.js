/*
** /user
*/
const getWatchList = require('../routes/user/getWatchList')
const postWatchList = require('../routes/user/postWatchList')
const deleteMovieWatchList = require('../routes/user/deleteMovieWatchList')
const postMovieViewed = require('../routes/user/postMovieViewed')

/*
** /movie
*/
const getGenres = require('../routes/movie/getGenres')

/*
** /movie/:movie
*/
const getSpecifiedMovie = require('../routes/movie/:movie/get')
const postCommentSpecifiedMovie = require('../routes/movie/:movie/postComment')

/*
** /movie/all
*/
const getAllMovies = require('../routes/movie/all/get')

/*
** /torrent
*/
const getEncodedUpload = require('../routes/torrent/getEncodedUpload')
const getFiles = require('../routes/torrent/getFiles')
const getSpecifiedTorrentStatus = require('../routes/torrent/getStatus')
const addTorrent = require('../routes/torrent/add')

/*
** /torrent/all
*/
const getAllTorrentsStatus = require('../routes/torrent/all/getActive')
const getAllTorrentsActive = require('../routes/torrent/all/getStatus')

class RouterHelper {
  constructor(app) {
    this.app = app
    this.routes = {
      '/movie': [
        getGenres,
        getAllMovies,
        getSpecifiedMovie,
        postCommentSpecifiedMovie,
      ],
      '/torrent': [
        getEncodedUpload,
        getFiles, // not used
        getSpecifiedTorrentStatus, // not used
        getAllTorrentsStatus, // not used
        getAllTorrentsActive, // not used
        addTorrent,
      ],
      '/user': [
        getWatchList,
        postWatchList,
        deleteMovieWatchList,
        postMovieViewed,
      ],
    }
  }

  setAllRoutes() {
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].forEach((element) => {
        if (route === '') this.app.use(element)
        else this.app.use(route, element)
      })
    })
  }
}

module.exports = RouterHelper
