export default {
  getToken(state) {
    return state.token
  },
  getUser(state) {
    return state.user
  },
  getAuthentication(state) {
    return state.isAuthenticated
  },
  getSidebar(state) {
    console.log('get sidebar: ', state.navigation.sidebar);
    return state.navigation.sidebar
  }
}