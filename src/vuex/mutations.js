import auth from '../services/auth';

export default {
  setToken(state, token) {
    state.token = token
  },
  login(state) {
    state.isAuthenticated = true
  },
  logout(state) {
    state.isAuthenticated = false
    auth.logout()
  },
  setUser(state, user) {
    state.user = user
  }
}