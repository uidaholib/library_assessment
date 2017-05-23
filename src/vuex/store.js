import Vue from 'vue'
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters'
import mutations from './mutations'
import auth from '../services/auth'
import esri from 'esri-leaflet'

Vue.use(Vuex);

const token = auth.getAccessToken()
const floor = 1

const state = {
  isAuthenticated: auth.isLoggedIn(),
  user: auth.getUserDataToken(),
  token: token,
  navigation: {
    sidebar: false,
    mapDialog: false,
  },
  map: {
    floor: 1,
    featureLayers: [],
    basemaps: []
  },
  datatable: {
    title: '',
    headers: [],
    items: []
  }
};

const store = new Vuex.Store({state, actions, mutations, getters});

export default store;
