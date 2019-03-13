import React from 'react'
import { Badge, Icon } from 'react-materialize'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { REDIRECT } from '../constants'
import { filmService } from '../service'

const noCover = '/img/noPic.png'
const PERPAGE = 20

class Home extends React.Component {
  static sortResults(list) {
    list.sort((a, b) => {
      if (a.rating === undefined) a.rating = 0 // eslint-disable-line
      if (b.rating === undefined) b.rating = 0 // eslint-disable-line
      return (b.rating - a.rating)
    })
    return list.slice(0, 8)
  }

  constructor(props) {
    super(props)
    this.state = {
      store: [],
      page: 0,
    }
    const { auth, history } = props
    const { loggedIn } = auth
    if (loggedIn === false) {
      history.push(REDIRECT.LOGIN)
    }
  }

  componentWillMount() {
    const { page } = this.state
    const { auth } = this.props
    const { loggedIn } = auth
    if (loggedIn === false) {
      return
    }
    const request = {
      sort: '-rating',
      genres: 'all',
      rating: 'all',
      hitsPerPage: PERPAGE,
      page,
    }
    filmService.getMovies(request)
      .then((data) => {
        if (Array.isArray(data.data)) this.setState({ store: data.data })
        else if (data.MISSING_BEARER) {
          console.log(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  movieViewed(movieId) {
    const { auth } = this.props
    const { moviesViewed } = auth
    if (moviesViewed === null || moviesViewed === undefined) return undefined
    return moviesViewed.find(element => element._id === movieId)
  }

  render() {
    const { store } = this.state
    const { auth } = this.props
    const { loggedIn } = auth
    if (loggedIn === false) {
      return <div />
    }
    const movies = Home.sortResults(store)
    return (
      <div>
        <h1>Download movies</h1>
        <h2 className="pop-title">Most popular movies</h2>
        <div id="popmovies">
          {movies.map(film => (
            <React.Fragment key={film._id}>
              <Link to={`/movie/${film._id}`}>
                <div className="popmovieBox">
                  {film.rating !== undefined && film.rating !== null
                    ? <Badge className="movieRating">{`${film.rating} / 10`}</Badge>
                    : <Badge className="movieRating">No rating</Badge>
                  }
                  {this.movieViewed(film._id) !== undefined
                  && <Icon small className="viewedHome">remove_red_eye</Icon>}
                  {film.cover !== undefined && film.cover !== null
                    ? <img alt={film.title} src={film.cover} className={this.movieViewed(film._id) !== undefined ? 'coverPop cover-view' : 'coverPop'} />
                    : <img alt="Non disponible" src={noCover} className="coverPop" />
                  }
                  <div className="movieInfo">
                    <h2 className="popFilm-title">{film.title}</h2>
                  </div>
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { filmsStore, auth } = state
  return { filmsStore, auth }
}

export default connect(mapStateToProps)(Home)
