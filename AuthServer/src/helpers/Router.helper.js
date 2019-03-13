const callback = require('../routes/callback/providers')
const getAuthorized = require('../routes/getAuthorized')
const logout = require('../routes/logout')
const user = require('../routes/user')
const token = require('../routes/token')

class Router {
  constructor(app) {
    this.app = app
    this.routes = {
      '/': [
        getAuthorized,
        token,
        logout,
      ],
      '/oauth/callback': [
        callback,
      ],
      '/user': [
        user.delete,
        user.get,
        user.getAll,
        user.putConfirmAccount,
        user.putForgottenPassword,
        user.putPassword,
        user.putRecoverPassword,
        user.register,
        user.update,
      ],
    }
  }

  setAllRoutes() {
    console.log('Import all routes')
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].forEach((element) => {
        if (route === '') this.app.use(element)
        else this.app.use(route, element)
      })
    })
  }
}

module.exports = Router
