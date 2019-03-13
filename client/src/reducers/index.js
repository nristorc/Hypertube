import { combineReducers } from 'redux'
import { auth } from './auth.reducer'
import { alert } from './alert.reducer'
import filmsStore from './films.reducer'

const rootReducer = combineReducers({
  auth,
  filmsStore,
  alert,
})

export default rootReducer
