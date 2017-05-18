import auth from '../services/auth'
import router from '../router'

export default {
  login({
    commit
  }, credentials) {
    auth
      .login(credentials)
      .then((data) => {
        commit('setUser', data)
        commit('setToken', auth.getAccessToken())
        commit('login')
        router.push({name: 'home'})
      })
  }
}