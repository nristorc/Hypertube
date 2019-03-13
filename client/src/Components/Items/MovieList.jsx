import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import filmsAction from '../../actions/films.actions'
import { filmService } from '../../service'


class MovieList extends React.Component {
  async delFromWatchlist(event, movieId) {
    event.preventDefault()
    const { dispatch, onDeleteMovie } = this.props
    try {
      const result = await filmService.delFromWatchlist({ movieId })
      onDeleteMovie()
      if (typeof result === 'object' && result.data) {
        dispatch(filmsAction.setWatchList(result.data))
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const {
      filmList,
      listSize,
      className,
      action,
    } = this.props
    if (!Array.isArray(filmList) || filmList.length === 0) return <div />
    const content = filmList.reverse().slice(0, parseInt(listSize, 10)).map((film, index) => (
      <div key={`${film._id}_${index}`}>
        <React.Fragment>
          <div className="last-film">
            {film.movieId
              ? <Link to={`/movie/${film.movieId}`}><img className="film-poster" src={film.cover} alt={film.title} /></Link>
              : <Link to={`/movie/${film._id}`}><img className="film-poster" src={film.cover} alt={film.title} /></Link>
            }
            <div className="film-info">
              <p className="film-title">{film.title}</p>
              <p className="film-data">
                {film.year}
                {film.genres && (`| ${film.genres.join(' | ')}`)}
              </p>
              {(film.date !== undefined && film.date !== null) && <p className="film-viewDate">{`Viewed on ${film.date.split('T')[0]}`}</p> }
              {(film.description !== undefined && film.description !== null) && (
                <p className="film-viewDate">
                  {film.description.substr(0, 200)}
                  {(film.description.length > 200) && '...'}
                </p>
              )}
              <div id="filmButton">
                {film.movieId
                  ? (
                    <div className="film-toPage">
                      {action === true && <a waves="light" className="btn waves-effect waves-light film-toPage-button red" href="/" onClick={event => this.delFromWatchlist(event, film.movieId)}>Delete</a>}
                      <NavLink
                        waves="light"
                        className="btn waves-effect waves-light film-toPage-button blue"
                        to={`/movie/${film.movieId}`}
                      >
                        See more
                      </NavLink>
                    </div>
                  )
                  : <a waves="light" className="btn blue waves-effect waves-light film-toPage button" href={`/movie/${film._id}`}>See more</a>
                }
              </div>
            </div>
          </div>
          <hr width="60%" />
        </React.Fragment>
      </div>
    ))
    return <div className={className}>{content}</div>
  }
}

const mapStateToProps = (state) => {
  const { filmsStore } = state
  return { filmsStore }
}

MovieList.defaultProps = {
  onDeleteMovie: () => {},
}

export default connect(mapStateToProps)(withRouter(MovieList))
