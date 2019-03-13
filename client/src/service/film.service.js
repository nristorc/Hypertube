import FetchInterfaceService from './fetchInterface.service'

const route = require('./route.service')

const apiFetch = new FetchInterfaceService()

const getMovies = data => apiFetch.get(route.ALL_MOVIES, data)

const getCategories = () => apiFetch.get(route.ALL_CATEGORIES, {}, {})

const getOneMovie = url => apiFetch.get(url)

const postComments = (hash, data) => apiFetch.post(`/movie/${hash}/comment`, new URLSearchParams(data).toString())

const postMovieViewed = (movieId, dirname) => (
  apiFetch.post(
    route.MOVIEVIEWED,
    [new URLSearchParams(movieId).toString(), new URLSearchParams(dirname).toString()]
  )
)

const postWatchlist = movieId => (
  apiFetch.post(route.WATCHLIST, new URLSearchParams(movieId).toString())
)

const delFromWatchlist = movieId => (
  apiFetch.delete(route.WATCHLIST, new URLSearchParams(movieId).toString())
)

const getWatchlist = () => apiFetch.get(route.WATCHLIST)

const getEncodedUploaded = data => apiFetch.get('/encoded-upload', new URLSearchParams(data).toString())

export {
  postMovieViewed,
  delFromWatchlist,
  getEncodedUploaded,
  getMovies,
  getOneMovie,
  getCategories,
  postComments,
  getWatchlist,
  postWatchlist,
}
