export function authHeader() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) return user.token
    return ''
  } catch (err) {
    return ''
  }
}
