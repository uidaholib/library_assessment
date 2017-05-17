<template>
  <div class="home container row">
    <div class="container">
      <button class="btn btn-danger" @click.prevent="logout">Logout</button>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';
import auth0 from '../services/auth'

export default {
  name: 'home',
  data() {
    console.log(this.$route.params)
    let user
    return {
      user,
      map: null
    }
  },
  methods: {
    logout() {
      auth0.logout()
    },
    main(token) {
      console.log('my token: ', token)
      let tlFloor = '1st'
      // set the inital map extent and basemap
      esri.featureLayer({
        url: '//services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_space_assessment_areas/FeatureServer/0',
        //where: 'Floor = 1',
        token: token,
        where: 1
      }).addTo(this.map);
      esri.tiledMapLayer({
        url: '//tiles.arcgis.com/tiles/WLhB60Nqwp4NnHz3/arcgis/rest/services/library_' + tlFloor + '_floor_floor_plans_basemap_web_app/MapServer',
        maxZoom: 19,
        //        minZoom: 16,
        // do this because to address known bug in esri-leaflet.  Can probably remove in future version of API.
        token: token,
      }).addTo(this.map);
    }
  },
  mounted() {
    this.map = L.map('map').setView([46.7274, -117.0144], 19);
    esri.basemapLayer('Topographic').addTo(this.map);
    if (auth0.isLoggedIn()) {
      const userToken = auth0.getUserDataToken()
      const token = auth0.getAccessToken()
      this.main(token)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  height: 100vh;
  width: 100vw;
  position: relative;
}
</style>
