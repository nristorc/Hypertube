import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Icon, Navbar } from 'react-materialize'
import { SideNavbar } from '..'
import { REDIRECT } from '../../constants'
import { userService, filmService } from '../../service'
import { authActions } from '../../actions'
import filmsAction from '../../actions/films.actions'

class OurNavbar extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.updateUserData()
  }

  onResize() {
    if (window.innerWidth >= '993') {
      const clickZone = document.getElementById('sidenav-overlay')
      if (clickZone !== null) { clickZone.click() }
    }
  }

  async updateUserData() {
    const { dispatch, auth } = this.props
    if (auth.loggedIn === false) return
    try {
      const data = await userService.getOwnData()
      if (data.AUTH_HEADER || data.BEARER) {
        console.log(data)
      } else {
        const watchList = await filmService.getWatchlist()
        dispatch(filmsAction.setWatchList(watchList))
        dispatch(authActions.initUser(data))
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { loggedIn } = this.props.auth
    if (loggedIn === false) {
      return (
        <div>
          <Navbar brand={<button onClick={(event) => { this.props.history.push(REDIRECT.LOGIN); event.preventDefault() }} className="brand-logo">Hypertube</button>} right>
            <NavLink to={REDIRECT.LOGIN} className="nav-link">
              Login
            </NavLink>
            <NavLink to={REDIRECT.ACC_REGISTER} className="nav-link">
              Register
            </NavLink>
          </Navbar>
        </div>
      )
    }
    return (
      <div>
        <Navbar brand={<button onClick={(event) => { this.props.history.push(REDIRECT.HOME); event.preventDefault() }} className="brand-logo">Hypertube</button>} right>
          <NavLink to={REDIRECT.MOV_SEARCH} className="nav-link">
            Search
          </NavLink>
          <div className="nav-link">
            <SideNavbar />
          </div>
          <NavLink to={REDIRECT.LOGOUT} className="nav-link">
            <Icon tiny>power_settings_new</Icon>
          </NavLink>
        </Navbar>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth } = state
  return { auth }
}
export default connect(mapStateToProps)(withRouter(OurNavbar))
