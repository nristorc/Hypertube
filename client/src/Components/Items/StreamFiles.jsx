import React, { Component } from 'react'
import { connect } from 'react-redux'
import filmsAction from '../../actions/films.actions'
import { filmService } from '../../service'
import { authActions } from '../../actions'

class StreamFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movieIndex: -1,
      filename: '',
      dirname: '',
      srtIndex: -1,
    }
  }

  componentDidMount() {
    const { torrentFiles } = this.props
    if (torrentFiles || Array.isArray(torrentFiles) || torrentFiles.length !== 0) {
      torrentFiles.forEach((file, index) => {
        if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv')
          || file.name.endsWith('.avi') || file.name.endsWith('.mov')
          || file.name.endsWith('.mpeg') || file.name.endsWith('.m4v')
          || file.name.endsWith('.flv')) {
          this.setState({
            movieIndex: index,
            dirname: file.name.split('/')[0],
            filename: file.name.slice(file.name.lastIndexOf('/') + 1),
          })
        } else if (file.name.endsWith('.srt')) {
          this.setState({ srtIndex: index })
        }
      })
    }
  }

  async updateIndexFile(event, id) {
    const { dispatch, filmsStore } = this.props
    const { dirname, srtIndex } = this.state
    event.preventDefault()
    dispatch(filmsAction.setIndexFile(id))
    this.updateSubIndex(srtIndex)
    try {
      const filmsViewed = await filmService.postMovieViewed({
        movieId: filmsStore.movieId,
        dirname,
      })
      dispatch(authActions.updateMoviesViewed(filmsViewed))
    } catch (err) {
      console.log(err)
    }
  }

  updateSubIndex(index) {
    const { dispatch, filmsStore } = this.props
    if (filmsStore.subFile === -1) {
      dispatch(filmsAction.setSubFile(index))
    }
  }

  render() {
    const { torrentFiles } = this.props
    const { filename, movieIndex } = this.state
    if (!torrentFiles || !Array.isArray(torrentFiles) || torrentFiles.length === 0) {
      return (
        <div className="files">
          <img className="fileLoading" src="/img/loading.gif" width="48px" height="48px" alt="loading" />
        </div>
      )
    }
    return (
      <div className="files">
        {filename
          ? (
            <button key={movieIndex} type="button" className="fileButton" onClick={(event) => { this.updateIndexFile(event, movieIndex) }}>
              <span className="fileList">
                {filename}
              </span>
            </button>
          )
          : (
            <span className="fileList">
                Aucun fichier disponible
            </span>
          )
          }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { filmsStore } = state
  return { filmsStore }
}

export default connect(mapStateToProps)(StreamFiles)
