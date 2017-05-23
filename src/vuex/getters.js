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
  },
  getFloor(state) {
    return state.map.floor
  },
  getBasemap(state, id) {
    return state.map.basemaps.find(basemap => basemap.id === id)
  },
  getFeatureLayer(state, id) {
    return state.map.featureLayers.find(featureLayer => featureLayer.id === id)
  },
  getDataTable(state) {
    return state.datatable
  }
}