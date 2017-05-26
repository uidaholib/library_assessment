import auth from '../services/auth';
import esri from 'esri-leaflet'
import tableHelpers from '../libs/table-helpers'

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
    let fl = esri.featureLayer({
      url: payload.url,
      token: payload.token,
      where: payload.where
    })
    // fl.addTo(payload.map)
    state
      .map
      .featureLayers
      .push({
        id: payload.id,
        title: payload.title,
        feautureLayer: fl
      })
  },
  addBasemap(state, payload) {
    console.log('map: ', payload.map);
    let basemap = esri.tiledMapLayer({
      url: payload.url,
      token: payload.token,
      maxZoom: payload.maxZoom,
      minZoom: payload.minZoom
    })
    // basemap.addTo(payload.map)
    state
      .map
      .basemaps
      .push({
        id: payload.id,
        title: payload.title,
        basemap: basemap
      })
  },
  setDataTable(state, payload) {
    state.datatable.tableTitle = payload.tableTitle
    state.datatable.headers = payload.headers
    state.datatable.items = payload.items
  },
  openMapDialog(state, payload) {
    state.navigation.mapDialog = payload
  },
  setBuilding(state, value) {
    state.map.building = tableHelpers.buildingNameFormatter(value)
  },
  setRoomLocation(state, value) {
    state.map.roomLocation = tableHelpers.roomLocationFormatter(value)
  },
  setChartData(state, chartData) {
    state.chartData = chartData
  },
  setCalendar(state, payload) {
    state.calendar = Object.assign(state.calendar, payload)
    console.log('setting calendar: ', state.calendar)
  }
}
