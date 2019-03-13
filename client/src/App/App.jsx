import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import * as route from '../DefaultPage'
import * as authRoute from '../AuthPage'
import { REDIRECT } from '../constants'
import { OurNavbar } from '../Components'

const App = () => (
  <Router>
    <div>
      <OurNavbar />
      <div className="App">
        <Switch>
          <Route exact path={REDIRECT.LOGIN} component={route.Login} />
          <Route exact path={REDIRECT.ROOT} component={route.Home} />
          <Route exact path={REDIRECT.HOME} component={route.Home} />
          <Route exact path={REDIRECT.LOGOUT} component={route.Logout} />
          <Route exact path={REDIRECT.ACC_FORGOTTEN} component={route.ForgottenPassword} />
          <Route exact path={REDIRECT.ACC_RECOVER} component={route.RecoverPassword} />
          <Route exact path={REDIRECT.ACC_REGISTER} component={route.Register} />
          <Route exact path={REDIRECT.ACC_VALIDATION} component={route.ValidatePage} />
          <Route exact path={REDIRECT.MOV_SEARCH} component={authRoute.Search} />
          <Route exact path={REDIRECT.OAUTH_CB} component={route.LoginOauth} />
          <Route path={REDIRECT.USER_PROFILE} component={authRoute.User} />
          <Route exact path={REDIRECT.MOV_WATCH} component={authRoute.Movie} />
          <Route component={route.Home} />
        </Switch>
      </div>
    </div>
  </Router>
)

export default App
