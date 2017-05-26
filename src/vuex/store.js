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
    mapDialog: false
  },
  map: {
    floor: 1,
    selectedFloor: null,
    building: '1st Floor Library',
    roomLocation: '',
    featureLayers: [],
    basemaps: []
  },
  datatable: {
    tableTitle: {
      title: '',
      subtitle: ''
    },
    headers: [],
    items: []
  },
  chartData: {
    dataCollection: {},
    options: {}
  },
  calendar: {
    startDateEntry: null,
    startDateEntryFormatted: null,
    endDateEntry: null,
    endDateEntryFormatted: null,
    timePeriod: null
  }
};

const store = new Vuex.Store({state, actions, mutations, getters});

export default store;
