export default {
  getToken(state) {
    return state.token
  },
  getUser(state) {
    return state.user
  },
  getAuthentication(state) {
    return state.isAuthenticated
  }
}