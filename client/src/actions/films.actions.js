const hashUpdate = hash => dispatch => dispatch({ type: 'HASH_UPDATE', hash })
const catUpdate = cat => dispatch => dispatch({ type: 'CAT_UPDATE', cat })
const movieIdUpdate = id => dispatch => dispatch({ type: 'MOVIE_ID_UPDATE', id })
const setStore = data => dispatch => dispatch({ type: 'SET_STORE', data })
const addStore = data => dispatch => dispatch({ type: 'ADD_STORE', data })

const setIndexFile = id => dispatch => dispatch({ type: 'SET_INDEX_FILE', id })
const setSubFile = id => dispatch => dispatch({ type: 'SET_SUB_FILE', id })

const setMovieId = id => dispatch => dispatch({ type: 'SET_MOVIE_ID', id })
const setMovieToken = token => dispatch => dispatch({ type: 'SET_MOVIE_TOKEN', token })
const setMovieHash = hash => dispatch => dispatch({ type: 'SET_MOVIE_HASH', hash })
const setMovie = data => dispatch => dispatch({ type: 'SET_MOVIE', data })

const setTorrentUrl = url => dispatch => dispatch({ type: 'SET_TORRENT_URL', url })
const setTorrentFiles = files => dispatch => dispatch({ type: 'SET_TORRENT_FILES', files })

const setWatchList = data => dispatch => dispatch({ type: 'SET_WATCH_LIST', data })

export default {
  setWatchList,
  setIndexFile,
  setSubFile,
  setMovieHash,
  setTorrentUrl,
  setTorrentFiles,
  setMovieToken,
  hashUpdate,
  catUpdate,
  setStore,
  addStore,
  movieIdUpdate,
  setMovieId,
  setMovie,
}
