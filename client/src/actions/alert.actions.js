const add = data => ({ type: 'ADD_ERROR', data })
const clear = () => ({ type: 'CLEAR_ERROR' })

export const alertActions = {
  add,
  clear,
}
