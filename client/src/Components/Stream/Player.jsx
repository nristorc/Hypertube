import React from 'react'
import { connect } from 'react-redux'
import { authActions } from '../../actions'

class VideoPlayer extends React.Component {
  render() {
    const { source, track } = this.props
    return (
      <React.Fragment>
        <video id="videoPlayer" crossOrigin="anonymous" controls muted preload="auto" autoPlay>
          <source type="video/mp4" src={source} />
          {track !== '' && <track label="subtitles" kind="subtitles" srcLang="en" src={track} />}
          <track kind="captions" default />
        </video>
      </React.Fragment>
    )
  }
}

class MovieTest extends React.Component {
  componentDidMount() {
    const { dispatch, filmsStore } = this.props
    if (filmsStore.indexFile > -1) {
      dispatch(authActions.pushMovieViewed(filmsStore.movieId))
    }
  }

  render() {
    const {
      movieToken,
      movieHash,
      indexFile,
      torrentFiles,
      torrentUrl,
      subFile,
    } = this.props.filmsStore
    const { userDoc } = this.props.auth
    if (indexFile !== -1) {
      let filename = torrentFiles[indexFile].name
      filename = filename.slice(filename.lastIndexOf('/') + 1)
      filename = encodeURIComponent(filename)
      let magnet = torrentUrl
      if (magnet.substr(0, 6) !== 'magnet') {
        magnet = torrentUrl.split('/')
        magnet = magnet[magnet.length - 1]
      }
      let subtitlesFile = ''
      if (subFile > -1 && torrentFiles[subFile]) subtitlesFile = `http://127.0.0.1:4000/torrent/subtitles?subfile=${torrentFiles[subFile].name.slice(torrentFiles[subFile].name.lastIndexOf('/') + 1)}&magnet=${magnet}&movieToken=${movieToken}&hash=${movieHash}&filename=${filename}`
      const src = `http://127.0.0.1:4000/torrent/encoded-upload?filename=${filename}&magnet=${magnet}&movieToken=${movieToken}&hash=${movieHash}&id=${userDoc._id}`
      return <VideoPlayer source={src} track={subtitlesFile} />
    }
    return <div />
  }
}

const mapStateToProps = (state) => {
  const { filmsStore, auth } = state
  return { filmsStore, auth }
}

export default connect(mapStateToProps)(MovieTest)
