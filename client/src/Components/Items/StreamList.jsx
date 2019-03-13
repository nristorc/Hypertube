import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'react-materialize'
import { StreamFiles } from '..'
import { torrentService } from '../../service'
import filmsAction from '../../actions/films.actions'

const delay = time => new Promise((resolve) => { setTimeout(resolve, time) })

class StreamList extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(filmsAction.setTorrentFiles([]))
  }

  async stream(e) {
    const { dispatch } = this.props
    dispatch(filmsAction.setIndexFile(-1))
    dispatch(filmsAction.setSubFile(-1))
    dispatch(filmsAction.setTorrentUrl(''))
    try {
      const url = e.target.id
      let response = await torrentService.addTorrent({ torrentUrl: url })
      let { data } = response
      dispatch(filmsAction.setMovieToken(data.movieToken))
      dispatch(filmsAction.setTorrentFiles(data.torrents[0].files))
      dispatch(filmsAction.setTorrentUrl(url))
      dispatch(filmsAction.setMovieHash(data.torrents[0].hashString))
      if (data.torrents[0].files.length === 0) {
        let timeSleep = 100
        while (data.torrents[0].files.length === 0) {
          response = await torrentService.addTorrent({ torrentUrl: url }) // eslint-disable-line
          data = response.data // eslint-disable-line
          if (timeSleep < 1000) timeSleep += 100
          await delay(timeSleep) // eslint-disable-line
        }
        dispatch(filmsAction.setMovieToken(data.movieToken))
        dispatch(filmsAction.setTorrentFiles(data.torrents[0].files))
        dispatch(filmsAction.setTorrentUrl(url))
        dispatch(filmsAction.setMovieHash(data.torrents[0].hashString))
      }
      return false
    } catch (err) {
      console.log('Error:', err.message)
      return false
    }
  }

  render() {
    const { filmsStore } = this.props
    const { torrentUrl, movie, torrentFiles } = filmsStore
    if (!movie || movie === '') {
      return <div />
    }
    const { torrents } = movie
    return (
      <div>
        {torrents.map(src => (
          <Fragment key={src.torrent}>
            <div className="streamList">
              <div className="streamList-item">
                <Icon>play_arrow</Icon>
                <div className="infoStream">
                  {src.source !== undefined && src.source !== null
                    ? (
                      <div>
                        <Icon>cloud_download</Icon>
                        <p>{src.source}</p>
                      </div>
                    )
                    : <div />
                  }
                  {src.quality !== undefined && src.quality !== null
                    ? (
                      <div>
                        <Icon>local_movies</Icon>
                        <p>
                          {' '}
                          {src.quality}
                        </p>
                      </div>
                    )
                    : <div />
                  }
                  {src.size[0].human_readable !== undefined && src.size[0].human_readable !== null
                    ? (
                      <div>
                        <Icon>folder</Icon>
                        <p>
                          {' '}
                          {src.size[0].human_readable}
                        </p>
                      </div>
                    )
                    : <div />
                  }
                  {src.language !== undefined && src.language !== null
                    ? (
                      <div>
                        <Icon>language</Icon>
                        <p>
                          {' '}
                          {src.language}
                        </p>
                      </div>
                    )
                    : <div />
                  }
                </div>
              </div>
              <div id="downloadButton">
                <button type="button" waves="light" id={src.torrent} onClick={this.stream.bind(this)} className="blue btn waves-effect waves-light film-toStream">
                  Download
                </button>
              </div>
            </div>
            {torrentUrl === src.torrent
              && <StreamFiles callback={this.updateIndexFile} torrentFiles={torrentFiles} />
            }
          </Fragment>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { filmsStore } = state
  return { filmsStore }
}

export default connect(mapStateToProps)(StreamList)
