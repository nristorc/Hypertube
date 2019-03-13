import React from 'react'
import { connect } from 'react-redux'
import { MovieList, UserPic } from '../Components'
import { redirectConst } from '../constants'
import { userService, filmService } from '../service'

class User extends React.Component {
  constructor(props) {
    super(props)
    const { connected, history } = this.props
    if (connected === false) history.push(redirectConst.DISCONNECT)
    this.state = { user: {}, watchList: [], state: 'pending' }
  }

  componentDidMount() {
    this.updateWatchList()
      .catch(err => console.log(err))
  }

  updateWatchList = async () => {
    try {
      const { match } = this.props
      const params = (match) ? match.params : undefined
      const id = (params) ? params.id : undefined
      const user = await userService.getUserInfo(id)
      const watchList = await filmService.getWatchlist()
      this.setState({ user, watchList, state: 'ok' })
    } catch (err) {
      this.setState({ state: 'ok' })
      console.log('Error', err)
    }
  }

  render() {
    const { match, auth } = this.props
    const params = (match) ? match.params : undefined
    const id = (params) ? params.id : undefined
    const { user, watchList, state } = this.state
    const userDoc = auth ? auth.userDoc : undefined
    if (state === 'pending' || userDoc === null || userDoc.moviesViewed === undefined) return <div />
    if (user === null || user.UNEXIST) return (<div className="loading"><img width="512px" height="512px" src="/img/Racoon.png" alt="racoon" /></div>)
    const {
      firstname, lastname, username, profilePic,
    } = user
    const action = (id === userDoc._id)
    return (
      <div>
        <div className="userProfile">
          <UserPic src={profilePic} />
          <h4 className="userTitle">{`${username} (${firstname} ${lastname})`}</h4>
          <p className="profileTitle">Recently viewed movies</p>
          {user.moviesViewed.length === 0
            ? <span className="noInfo">No movie viewed.</span>
            : <MovieList filmList={user.moviesViewed} listSize="6" className="movieList" />
          }
          {action === true && <p className="profileTitle">Watchlist</p>}
          {action === true && watchList.length === 0 && <span className="noInfo">No movie in your watchlist yet.</span> }
          {action === true && watchList.length !== 0
          && <MovieList filmList={watchList} action={action} onDeleteMovie={this.updateWatchList} listSize="100000" className="movieList" />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth } = state
  return { auth }
}

const connectedUser = connect(mapStateToProps)(User)
export { connectedUser as User }
