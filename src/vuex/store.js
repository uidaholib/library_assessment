import Vue from 'vue'
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters'
import mutations from './mutations'
import esri from 'esri-leaflet'
import auth from '../services/auth'

Vue.use(Vuex);

// const token = auth.getAccessToken()
const floor = 1

const state = {
  isAuthenticated: false,
  user: null,
  token: null,
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
    basemaps: [],
    layer: null
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
    dateRange: null
  }
};

const store = new Vuex.Store({state, actions, mutations, getters});

export default store;
