const initialState = {
  movieId: '',
  movie: '',
  movieHash: '',
  subFile: -1,
  movieToken: '',
  indexFile: -1,
  torrentUrl: '',
  files: '',
  watchList: [],
  categories: [],
  content: [],
  rating: [
    { key: 'all', val: 'All' },
    { key: '1', val: '1+' },
    { key: '2', val: '2+' },
    { key: '3', val: '3+' },
    { key: '4', val: '4+' },
    { key: '5', val: '5+' },
    { key: '6', val: '6+' },
    { key: '7', val: '7+' },
    { key: '8', val: '8+' },
    { key: '9', val: '9+' },
  ],
  sort: [
    { key: '-rating', val: 'Rating' },
    { key: 'title', val: 'Alphabetical' },
    { key: '-year', val: 'Latest' },
    { key: 'year', val: 'Oldest' },
  ],
}

const filmsStore = (state = initialState, action) => {
  const movieId = (state) ? state.movieId : null
  const movieHash = (state) ? state.movieHash : null
  const movie = (state) ? state.movie : null
  const indexFile = (state) ? state.indexFile : null
  const subFile = (state) ? state.subFile : null
  const movieToken = (state) ? state.movieToken : null
  const torrentUrl = (state) ? state.torrentUrl : null
  switch (action.type) {
    case 'HASH_UPDATE':
      return action.data
    case 'CAT_UPDATE':
      if (Array.isArray(action.cat)) {
        const arr = action.cat.map(c => ({ key: c, val: c }))
        return Object.assign({}, state, { categories: [{ key: 'all', val: 'All' }, ...arr] })
      }
      return state
    case 'SET_MOVIE_ID':
      if (movieId === action.id) return state
      return Object.assign({}, state, { movieId: action.id })
    case 'SET_MOVIE_HASH':
      if (movieHash === action.hash) return state
      return Object.assign({}, state, { movieHash: action.hash })
    case 'SET_MOVIE':
      if (movie === action.data) return state
      return Object.assign({}, state, { movie: action.data })
    case 'SET_WATCH_LIST':
      if (!Array.isArray(action.data)) return state
      return Object.assign({}, state, { watchList: action.data })
    case 'SET_INDEX_FILE':
      if (indexFile === Number(action.id)) return state
      return Object.assign({}, state, { indexFile: Number(action.id) })
    case 'SET_SUB_FILE':
      if (subFile === action.id) return state
      return Object.assign({}, state, { subFile: action.id })
    case 'SET_MOVIE_TOKEN':
      if (movieToken === action.token) return state
      return Object.assign({}, state, { movieToken: action.token })
    case 'SET_TORRENT_URL':
      if (torrentUrl === action.url) return state
      return Object.assign({}, state, { torrentUrl: action.url })
    case 'SET_TORRENT_FILES':
      if (Array.isArray(action.files)) {
        return Object.assign({}, state, { torrentFiles: action.files })
      }
      return state
    case 'ADD_STORE':
      if (Array.isArray(action.data)) {
        const arr = state.content.concat(action.data)
        return Object.assign({}, state, { content: arr })
      }
      return state
    case 'SET_STORE':
      if (Array.isArray(action.data)) {
        return Object.assign({}, state, { content: action.data })
      }
      return state
    case 'FILES_UPDATE':
      return action.data
    default:
      return state
  }
}

export default filmsStore
