import auth from '../services/auth';
import esri from 'esri-leaflet'

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
  },
  toggleSidebar(state) {
    state.navigation.sidebar = !state.navigation.sidebar
  },
  setFloor(state, floor) {
    state.map.floor = floor
  },
  addFeatureLayer(state, payload) {
    let fl = esri.featureLayer({url: payload.url, token: payload.token, where: payload.where})
    // fl.addTo(payload.map)
    state
      .map
      .featureLayers
      .push({id: payload.id, title: payload.title, feautureLayer: fl})
  },
  addBasemap(state, payload) {
    console.log('map: ', payload.map);
    let basemap = esri.tiledMapLayer({url: payload.url, token: payload.token, maxZoom: payload.maxZoom, minZoom: payload.minZoom})
    // basemap.addTo(payload.map)
    state
      .map
      .basemaps
      .push({id: payload.id, title: payload.title, basemap: basemap})
  },
  setDataTable(state, payload) {
    state.datatable.title = payload.title
    state.datatable.headers = payload.headers
    state.datatable.items = payload.items
  }
}