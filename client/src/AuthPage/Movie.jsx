import React from 'react'
import { connect } from 'react-redux'
import { Badge, Button } from 'react-materialize'
import { Player, Comment, StreamList } from '../Components'
import { REDIRECT } from '../constants'
import { filmService } from '../service'
import filmsAction from '../actions/films.actions'

const noCover = '/img/noPic.png'

class Movie extends React.Component {
  constructor(props) {
    super(props)
    const { auth, history, dispatch } = props
    const { loggedIn } = auth
    if (loggedIn === false) {
      history.push(REDIRECT.ROOT)
    } else {
      dispatch(filmsAction.setMovieId(props.match.params.movie))
    }
    this.state = { stream: '' }
  }

  async componentDidMount() {
    const { location, dispatch } = this.props
    const { pathname } = location
    try {
      const data = await filmService.getOneMovie(pathname)
      if (Array.isArray(data)) {
        dispatch(filmsAction.setMovie(data[0]))
      }
      this.updateBackground()
    } catch (e) {
      console.log('Error:', e.message)
    }
  }

  componentWillUnmount() {
    const bg = document.getElementById('background-image')
    const { dispatch } = this.props
    dispatch(filmsAction.setMovie(''))
    dispatch(filmsAction.setMovieId(''))
    dispatch(filmsAction.setIndexFile(-1))
    dispatch(filmsAction.setMovieHash(''))
    dispatch(filmsAction.setMovieToken(''))
    dispatch(filmsAction.setTorrentUrl(''))
    dispatch(filmsAction.setTorrentFiles(''))
    dispatch(filmsAction.setSubFile(-1))
    if (bg !== null) {
      bg.style = {
        background: 'url("/img/background.jpg")',
        position: 'absolute',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        top: '60px',
        height: '570px !important',
        backgroundSize: 'cover',
        left: '0',
        right: '0',
        zIndex: '1',
        display: 'block',
        width: '100%',
      }
    }
  }

  chooseStream = (streamURL) => {
    const { dispatch } = this.props
    dispatch(filmsAction.setTorrentUrl(streamURL))
  }

  updateBackground() {
    const { filmsStore } = this.props
    const { movie } = filmsStore
    const { cover } = movie
    const bg = document.getElementById('background-image')
    if (bg !== null) {
      bg.style.background = `url('${cover}')`
      bg.style.backgroundRepeat = 'no-repeat'
      bg.style.backgroundSize = 'cover'
      bg.style.opacity = 0.4
      bg.style.filter = 'blur(5px)'
      bg.style.backgroundPosition = 'center'
    }
  }

  resetStreamList() {
    this.setState({ stream: '' })
  }

  async addWatchlist(event, movieId) {
    event.preventDefault()
    const { dispatch } = this.props
    try {
      const result = await filmService.postWatchlist({ movieId })
      if (typeof result === 'object' && result.data) {
        dispatch(filmsAction.setWatchList(result.data))
      }
    } catch (e) {
      console.log(e)
    }
  }

  async delFromWatchlist(event, movieId) {
    event.preventDefault()
    const { dispatch } = this.props
    try {
      const result = await filmService.delFromWatchlist({ movieId })
      if (typeof result === 'object' && result.data) {
        dispatch(filmsAction.setWatchList(result.data))
      }
    } catch (e) {
      console.log(e)
    }
  }

  isInWatchList(movieId) {
    const { filmsStore } = this.props
    const { watchList } = filmsStore
    return watchList.find(x => x.movieId === movieId)
  }

  render() {
    const { filmsStore } = this.props
    const {
      movie, movieHash, movieId, torrentUrl,
    } = filmsStore
    if (movie === '') return <span className="noInfo">No movie found.</span>
    const {
      cover, title, rating, year, genres, description, torrents,
    } = movie
    const { stream } = this.state
    return (
      <div id="moviePage">
        <div className="movieCard">
          <div className="poster">
            {cover !== undefined && cover !== null
              ? <img src={cover} alt={title} />
              : <img alt={title} src={noCover} />
            }
          </div>
          <div className="movieInfo">
            <div style={{ height: '50px' }}>
              {rating !== undefined && rating !== null
                ? <Badge className="rating">{`${rating} / 10`}</Badge>
                : <Badge className="rating">No rating</Badge>
            }
              {this.isInWatchList(movieId)
                ? <Button className="watchList red" onClick={event => this.delFromWatchlist(event, movieId)}>Delete from watchlist</Button>
                : <Button className="watchList blue" onClick={event => this.addWatchlist(event, movieId)}>Add to watchlist</Button>
            }
            </div>
            <p className="movietitle">{title}</p>
            <p className="moviedate">
              {year}
              {' '}
              {genres && (`| ${genres.join(' | ')}`)}
            </p>
            <br />
            <p className="title">Synopsis</p>
            <p className="moviedescription">{description}</p>
          </div>
        </div>
        <div id="movieStream">
          <StreamList
            chooseStream={this.chooseStream}
            data={torrents}
            stream={stream}
          />
          {movieHash !== '' && (
            <div>
              <Player id="player" source_url={torrentUrl} />
            </div>
          )}
        </div>
        <div className="movieComment">
          <Comment movieId={movieId} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { filmsStore, auth } = state
  return { filmsStore, auth }
}

const connectedMovie = connect(mapStateToProps)(Movie)
export { connectedMovie as Movie }
