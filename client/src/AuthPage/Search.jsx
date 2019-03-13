import React, { Component, Fragment } from 'react'
import { Badge, Icon } from 'react-materialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { InputText, InputSelect } from '../Components'
import filmsAction from '../actions/films.actions'
import { filmService } from '../service'

const PERPAGE = 20
const noCover = '/img/noPic.png'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      request: {
        query: '',
        sort: '-rating',
        genres: 'all',
        rating: 'all',
        page: 0,
        hitsPerPage: PERPAGE,
      },
    }
    window.onscroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight) this.loadMovies()
    }
  }

  async componentWillMount() {
    const { dispatch, filmsStore } = this.props
    const { categories } = filmsStore
    try {
      if (categories.length === 0) {
        const dataCat = await filmService.getCategories()
        dispatch(filmsAction.catUpdate(dataCat))
      }
    } catch (e) {
      console.log('Error during will mount Search:', e.message)
    }
    this.loadMovies(true)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.displayScroll)
  }

  onChangeRequest = (event) => {
    const { name, value } = event.target
    const { request } = this.state
    request[name] = value
    request.page = 0
    this.loadMovies(true)
  }

  scrollTop = () => {
    window.scrollTo(0, 0)
  }

  displayScroll = () => {
    if (document.getElementById('scroll-arrow')) {
      if (window.scrollY < 200) {
        document.getElementById('scroll-arrow').style.display = 'none'
      } else {
        document.getElementById('scroll-arrow').style.display = 'flex'
      }
    }
  }

  async loadMovies(replace) {
    const { request } = this.state
    const { dispatch } = this.props
    try {
      const data = await filmService.getMovies(request)
      if (Array.isArray(data.data)) {
        request.page += 1
        if (replace) dispatch(filmsAction.setStore(data.data))
        else dispatch(filmsAction.addStore(data.data))
      }
    } catch (e) {
      console.log('Error:', e.message)
    }
  }

  movieViewed(movieId) {
    const { auth } = this.props
    const { moviesViewed } = auth
    if (moviesViewed === null || moviesViewed === undefined
      || !Array.isArray(moviesViewed) || moviesViewed.length === 0) return undefined
    return moviesViewed.find(element => element._id === movieId)
  }

  renderFilm() {
    const { filmsStore } = this.props
    const content = filmsStore ? filmsStore.content : undefined
    return content.map(film => (
      <Fragment key={film._id}>
        <Link to={`/movie/${film._id}`}>
          <div className="movieBox">
            {film.rating !== undefined && film.rating !== null
              ? <Badge className="movieRating">{`${film.rating} / 10`}</Badge>
              : <Badge className="movieRating">No rating</Badge>
            }
            {this.movieViewed(film._id) !== undefined
            && <Icon small className="viewed">remove_red_eye</Icon>}
            {film.cover !== undefined && film.cover !== null
              ? <img alt={film.title} src={film.cover} className={this.movieViewed(film._id) !== undefined ? 'cover cover-view' : 'cover'} />
              : <img alt="Non disponible" src={noCover} className="cover" />
            }
            <div className="movieInfo">
              <h2 className="film-title">{film.title}</h2>
            </div>
          </div>
        </Link>
      </Fragment>
    ))
  }

  renderFilters() {
    const { filmsStore } = this.props
    const categories = filmsStore ? filmsStore.categories : undefined
    const rating = filmsStore ? filmsStore.rating : undefined
    const sort = filmsStore ? filmsStore.sort : undefined
    return (
      <div className="search-filter">
        <div>
          <p>Order By:</p>
          <InputSelect name="sort" values={sort} onChange={this.onChangeRequest} />
        </div>
        <div>
          <p>Category:</p>
          <InputSelect name="genres" values={categories} onChange={this.onChangeRequest} />
        </div>
        <div>
          <p>Rating:</p>
          <InputSelect name="rating" values={rating} onChange={this.onChangeRequest} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>All movies</h1>
        <button
          id="scroll-arrow"
          onClick={this.scrollTop}
          type="button"
        >
          <Icon>keyboard_arrow_up</Icon>
        </button>
        <form className="search-form">
          <InputText onChange={this.onChangeRequest} name="query" label="Type a movie title..." />
          {this.renderFilters()}
        </form>
        <div id="moviesList">
          {this.renderFilm()}
        </div>

      </div>
    )
  }
}

/*
**  mapStateToProps: this is used to retrieve the store state
*/

const mapStateToProps = (state) => {
  const { filmsStore, auth } = state
  return { filmsStore, auth }
}

const connectedSearch = connect(mapStateToProps)(Search)
export { connectedSearch as Search }
