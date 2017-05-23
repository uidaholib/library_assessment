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
  getBasemap(state, title) {
    return state.map.basemaps.find(basemap => basemap.title === title)
  },
  getFeatureLayer(state, title) {
    return state.map.featureLayers.find(featureLayer => featureLayer.title === title)
  }
}