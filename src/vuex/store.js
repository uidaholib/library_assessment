import Vue from 'vue'
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters'
import mutations from './mutations'
import auth from '../services/auth'

Vue.use(Vuex);

const state = {
  isAuthenticated: auth.isLoggedIn(),
  user: auth.getUserDataToken(),
  token: auth.getAccessToken()
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});

export default store;
