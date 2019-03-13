import React from 'react'
import {
  SideNav, SideNavItem, Collapsible, CollapsibleItem,
} from 'react-materialize'
import { connect } from 'react-redux'
import { ModifyAccount, ModifyAccountPassword, MovieList } from '..'

class SideNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.modifAccountButton = React.createRef()
    this.state = { user: null }
  }

  resetModifyAccount() {
    if (this.modifAccountButton.current.state.formSent === true) {
      this.modifAccountButton.current.setState({ formSent: false })
    }
    this.forceUpdate()
  }

  render() {
    const { auth } = this.props
    const { userDoc, moviesViewed } = auth
    if (userDoc === undefined || userDoc === null) {
      return <div />
    }
    const {
      profilePic, firstname, lastname, email, username, oauthOrigin, _id,
    } = userDoc
    return (
      <div>
        <SideNav
          trigger={<button id="button-navbar" data-activates="sidenav_0">Account</button>}
          options={{ closeOnClick: true, openOnClick: true }}
        >
          <SideNavItem
            userView
            user={{
              background: '/img/background.jpg',
              image: profilePic,
              name: `${firstname} ${lastname} (${username})`,
              email,
            }}
          />
          <Collapsible>
            <CollapsibleItem onClick={this.resetModifyAccount.bind(this)} header="Account settings" icon="settings">
              <ModifyAccount userDoc={userDoc} ref={this.modifAccountButton} />
            </CollapsibleItem>
            {!oauthOrigin
            && (
            <CollapsibleItem header="Change password" icon="lock">
              <ModifyAccountPassword userData={userDoc} />
            </CollapsibleItem>
            )
            }
          </Collapsible>
          <SideNavItem href={`/user/${_id}`} icon="playlist_add">Watchlist</SideNavItem>
          <SideNavItem href="/logout" icon="power_settings_new">Logout</SideNavItem>
          <SideNavItem divider />
          <SideNavItem subheader>Recently viewed movies</SideNavItem>
          <MovieList filmList={moviesViewed} listSize="3" className="sideMovieList"/>
        </SideNav>
      </div>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(SideNavbar)
