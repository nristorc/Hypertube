const initialState = { errors: {} }

export const alert = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return { errors: Object.assign({}, state.errors, action.data) }
    case 'CLEAR_ERROR':
      return { errors: [] }
    default:
      return state
  }
}
